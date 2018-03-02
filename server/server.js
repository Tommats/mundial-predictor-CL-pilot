require('./config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const axios = require('axios');

var path = require('path');
var {mongoose} = require('./db/mongoose');
var {Prediction} = require('./models/prediction');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});


app.post('/predictions', authenticate, (req, res)=> {
  var prediction = new Prediction ({
    matchId: req.body.matchId,
    _creator: req.user._id,
    completedAt: new Date().getTime()
  });

  prediction.save().then((doc) => {
    res.send(doc);
  }, (e)=> {
    res.status(400).send(e);
  });
});

app.get('/predictions', authenticate, (req, res) => {
  Prediction.find({
    _creator: req.user._id
  }).then( (predictions) => {
    res.send({predictions});
  }, (e) => {
    res.status(400).send(e);
  })
});

app.get('/predictions/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Prediction.findOne({
    _id: id,
    _creator: req.user._id
  }).then((prediction)=>{
    if (!prediction) {
      return res.status(404).send();
    }
    res.status(200).send({prediction});
  }).catch ((e)=> res.status(400).send());
});

app.delete('/predictions/:id', authenticate, (req, res)=>{
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }
  Prediction.findOneAndRemove({
    _id: id,
    _creator: req.user.id
  }).then((prediction)=>{
    if (!prediction) {
      return res.status(404).send();
    }
    res.status(200).send({prediction});
  }).catch ((e)=> res.status(400).send());
});

app.patch('/predictions/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['home', 'away']);

  if (!ObjectID.isValid(id)) {
     return res.status(404).send();
  }

  body.completedAt = new Date().getTime();

  Prediction.findOneAndUpdate({_id:id, _creator:req.user.id}, {$set: body}, {new: true}).then((prediction)=>{
    if(!prediction) {
      return res.status(404).send();
    }

    res.send({prediction});
  }).catch((e)=>{
    res.status(400).send();
  })
})

app.post('/users', (req, res)=> {
  var body = _.pick(req.body, ['email', 'password', 'name']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e)=> {
    if (e.errmsg.search('duplicate')) {
      res.status(400).send('This email is already used!');
    } else {
      res.status(400).send(e);
    }

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
    res.status(400).send(e);
  });
});

app.delete('/users/me/token', authenticate, (req,res)=> { //Logout action
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
