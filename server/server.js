require('./config/config');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const schedule = require('node-schedule');

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

app.get('/usersList', authenticate, function(req, res) {
  User.find({}, function(err, users) {
    var userMap = [];

    users.forEach(function(user) {
      userMap.push(user);
    });

    res.send(userMap);
  });
});

var rule = new schedule.RecurrenceRule();
// rule.hour = [15, 18, 21, 23];
rule.minute = 58;

var dailyJob = schedule.scheduleJob(rule, function(){
  console.log('Running scheduler now', Date.now());
  axios.get('http://api.football-data.org/v1/competitions/464/fixtures', {headers: {'X-Auth-Token' : '6a03d467443843759002ddfced5206c2'} }).then( (response) => {
    let games = response.data.fixtures;
    for(let game in games) {
      games[game].date = Date.parse(games[game].date);
      games[game].id = games[game]._links.self.href.replace("http://api.football-data.org/v1/fixtures/", "");
      Prediction.find({
        matchId: games[game].id
      }).then( (predictions) => {
        if ((games[game].date > (Date.now()-(4800 * 60 * 60 * 1000)))&&(games[game].status==="FINISHED")) { //Get finished games which not yet been calculated, from the relevant time in the past (currently 11 days 24*11=264)
          // Ponits logic: checking the final results and scoring as follow: direction - 2 points, exact score - 3 points, for every extra goal greater than up to 3 goals prediction - extra 2 points.
          for (let k in predictions) {
            if (predictions[k].status === 'Initial') {
              let exact = 0;
              let general = 0;
              let goals = 0;
              let points = 0;
              let predictedHomeWin = (predictions[k].home>predictions[k].away)&&(games[game].result.goalsHomeTeam>games[game].result.goalsAwayTeam);
              let predictedAwayWin = (predictions[k].home<predictions[k].away)&&(games[game].result.goalsHomeTeam<games[game].result.goalsAwayTeam);
              let predictedDraw = (predictions[k].home===predictions[k].away)&&(games[game].result.goalsHomeTeam===games[game].result.goalsAwayTeam);
              if ( predictedHomeWin || predictedAwayWin || predictedDraw ) {
                points = 2;
                if ((games[game].result.goalsHomeTeam===predictions[k].home) && (games[game].result.goalsAwayTeam===predictions[k].away)) {
                  points+= 3;
                  exact = 1;
                  goals = predictions[k].home+predictions[k].away;
                  if (predictions[k].home+predictions[k].away>3) {
                    points += (parseInt(predictions[k].home, 10)+parseInt(predictions[k].away, 10)-3)*2;
                  }
                } else {
                  general = 1;
                }
              }
              User.findOne({
                  _id: predictions[k]._creator
                }).then( (user) => {
                  console.log('User ID:', user._id, 'adding ',points,' for bet',predictions[k]._id);
                  User.findOneAndUpdate({_id:user._id}, {$inc: {points: points, general: general, exact: exact, exactGoals: goals}}, {new: true}).then((user)=>{
                    let statusUpdate = {status: 'Done', points: points};
                    Prediction.findOneAndUpdate({_id:predictions[k]._id}, {$set: statusUpdate}, {new: true}).then((user)=>{
                      console.log('success');
                    }).catch((e)=>{
                      console.log('Prdiction status update to done - error');
                    })
                  }).catch((e)=>{
                    console.log('user points update error');
                  })

                }, (e) => {
                  console.log(e);
                });
            }
          }
        }
      }, (e) => {
        console.log(e);
      })
    }
  }).catch((error) => {
    console.log(error);
  });



});

app.listen(port, ()=>{
  console.log(`Started on port ${port}`);
});

module.exports = {app};
