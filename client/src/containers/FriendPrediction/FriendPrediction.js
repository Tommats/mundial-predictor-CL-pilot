import React, { Component } from 'react';
import dateFormat from 'dateformat';
import Game from './Game/Game';
import classes from './FriendPrediction.css';
import axios from 'axios';
import queryString from 'query-string';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux1/Aux1';


class FriendPredictions extends Component {
  state = {
    games: '',
    predictions: '',
    name: '',
    loading: true,
  };

  componentDidMount() {
    axios.get('http://api.football-data.org/v1/competitions/464/fixtures', {headers: {'X-Auth-Token' : '6a03d467443843759002ddfced5206c2'} }).then( (response) => {
      let games = response.data.fixtures;
      for(let game in games) {
        let newKey = (parseInt(games[game]._links.self.href.replace("http://api.football-data.org/v1/fixtures/", ""),10));
        games[newKey] = games[game];
        games[newKey].date = Date.parse(games[newKey].date);
        games[newKey].id = games[game]._links.self.href.replace("http://api.football-data.org/v1/fixtures/", "");
        games[newKey].homeTeamId = (parseInt(games[game]._links.homeTeam.href.replace("http://api.football-data.org/v1/teams/", ""),10));
        games[newKey].awayTeamId = (parseInt(games[game]._links.awayTeam.href.replace("http://api.football-data.org/v1/teams/", ""),10));
        delete games[game];
      }
      games.sort( (a,b) => {return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);} );
      this.setState({games: games});
    }).catch((error) => {
        console.log(error);
    });
    if (localStorage.getItem('xauth')) {
      let parsed = queryString.parse(this.props.location.search);
      axios.get(`/predictions/user/${parsed.id}`, {headers: {'x-auth' : localStorage.getItem('xauth')} }).then( (response) => {
        let predictions = response.data.predictions;
        for(let prediction in predictions) {
          let newKey = (parseInt(predictions[prediction].matchId,10));
          predictions[newKey] = predictions[prediction];
          delete predictions[prediction];
        }
        this.setState({predictions: predictions, name: parsed.name, loading: false});
        }).catch((error) => {
          console.log(error);
        })
    }
  }
  render() {
    let games = null;
    if (this.state.games.length>0 && this.state.predictions.length) {
      games = this.state.games.filter((game => game.status === 'FINISHED')).map((game)=>{
        return <Game
          key={game.id}
          id={this.state.predictions[game.id]._id}
          points={this.state.predictions[game.id].points}
          homeId = {game.homeTeamId}
          awayId = {game.awayTeamId}
          date={game.date}
          formatedDate={dateFormat (game.date, "dd/mm/yyyy HH:MM")}
          home={game.homeTeamName}
          name={this.state.name.substr(0,this.state.name.indexOf(' '))}
          homeGoals={game.result.goalsHomeTeam}
          awayGoals={game.result.goalsAwayTeam}
          predictedHome={this.state.predictions[game.id].home}
          predictedAway={this.state.predictions[game.id].away}
          away={game.awayTeamName}
          status={game.status} />
      });
    };

    return (
      <div className={classes.Predictions}>
        {(this.state.loading) ? <Spinner /> : (
          <Aux>
          <div className={classes.PlayerName}>{this.state.name}&apos;s Predictions</div>
          <div>{games}</div>
          </Aux>
        )}
      </div>
    );
  }

}

export default FriendPredictions;
