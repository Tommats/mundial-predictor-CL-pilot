import React, { Component } from 'react';
import dateFormat from 'dateformat';
import Game from './Game/Game';
import classes from './Predictions.css';
import axios from 'axios';

import Spinner from '../../components/UI/Spinner/Spinner';



class Predictions extends Component {
  state = {
    games: '',
    predictions: ''
  };

  componentDidMount() {
    axios.get('http://api.football-data.org/v1/competitions/464/fixtures', {headers: {'X-Auth-Token' : '6a03d467443843759002ddfced5206c2'} }).then( (response) => {
      let games = response.data.fixtures;
      for(let game in games) {
        let newKey = (parseInt(games[game]._links.self.href.replace("http://api.football-data.org/v1/fixtures/", ""),10));
        games[newKey] = games[game];
        games[newKey].date = Date.parse(games[newKey].date);
        games[newKey].id = games[game]._links.self.href.replace("http://api.football-data.org/v1/fixtures/", "");
        delete games[game];
      }
      games.sort( (a,b) => {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
      this.setState({games: games});
    }).catch((error) => {
        console.log(error);
    });
    if (localStorage.getItem('xauth')) {
      axios.get('/predictions', {headers: {'x-auth' : localStorage.getItem('xauth')} }).then( (response) => {
        let predictions = response.data.predictions;
        for(let prediction in predictions) {
          let newKey = (parseInt(predictions[prediction].matchId,10));
          predictions[newKey] = predictions[prediction];
          delete predictions[prediction];
        }
        this.setState({predictions: predictions});
        }).catch((error) => {
          console.log(error);
        })
    }
  }

  render() {
    let games = <Spinner />;
    if (this.state.games.length>0 && this.state.predictions.length) {
      games = this.state.games.map((game)=>{
        return <Game
          key={game.id}
          date={dateFormat (game.date, "dd/mm/yyyy HH:MM")}
          home={game.homeTeamName}
          homeGoals={game.result.goalsHomeTeam}
          awayGoals={game.result.goalsAwayTeam}
          predictedHome={this.state.predictions[game.id].home}
          predictedAway={this.state.predictions[game.id].away}
          away={game.awayTeamName}
          status={game.status} />
      })
    }
    return (
      <div className={classes.Predictions}>
        {games}
      </div>
    );
  }

}

export default Predictions;
