require('./config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

var path = require('path');
var {mongoose} = require('./db/mongoose');
var {Bet} = require('./models/bet');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.post('/bets', authenticate, (req, res)=> {
  var bet = new Bet ({
    text: req.body.text,
    _creator: req.user._id
  });

  bet.save().then((doc) => {
    res.send(doc);
  }, (e)=> {
    res.status(400).send(e);
  });
});

app.get('/bets', authenticate, (req, res) => {
  Bet.find({
    _creator: req.user._id
  }).then( (bets) => {
    res.send({bets});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/bets/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Bet.findOne({
    _id: id,
    _creator: req.user._id
  }).then((bet)=>{
    if (!bet) {
      return res.status(404).send();
    }
    res.status(200).send({bet});
  }).catch ((e)=> res.status(400).send());
});

app.delete('/bets/:id', authenticate, (req, res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Bet.findOneAndRemove({
    _id: id,
    _creator: req.user.id
  }).then((bet)=>{
    if (!bet) {
      return res.status(404).send();
    }
    res.status(200).send({bet});
  }).catch ((e)=> res.status(400).send());
});

app.patch('/bets/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Bet.findOneAndUpdate({_id:id, _creator:req.user.id}, {$set: body}, {new: true}).then((bet)=>{
    if(!bet) {
      return res.status(404).send();
    }

    res.send({bet});
  }).catch((e)=>{
    res.status(400).send();
  })
})

app.post('/users', (req, res)=> {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e)=> {
    res.status(400).send(e);
  })
});


app.get('/users/me', authenticate, (req, res) =>{
  res.send(req.user);
});

app.post('/users/login', (req,res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
      res.header('x-auth', token).send(user);
    })
  }).catch((e)=> {
    res.status(400).send();
  });
});

app.delete('/users/me/token', authenticate, (req,res)=> { //Logout
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, ()=>{
    res.status(400).send();
  });
});


app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
