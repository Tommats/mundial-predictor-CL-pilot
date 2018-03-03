import React, { Component } from 'react';
import classes from './Game.css';

class Game extends Component {
  state = {
    editable: true,
    homePrediction: 0,
    awayPrediction: 0
  }
  componentWillMount () {
    this.setState({homePrediction: this.props.predictedHome, awayPrediction: this.props.predictedAway});
  }
  render() {
    return (
      <div className={classes.Game}>
        {(this.props.status === 'FINISHED') ? <span className={classes.Closed}>Closed</span>  : null }
        <p>{this.props.date}</p>
        <p>{this.props.home} vs {this.props.away} {(this.props.status === 'FINISHED') ? <span className={classes.FinalResult}>{this.props.homeGoals}-{this.props.awayGoals}</span>  : null }</p>
        <p>My prediction: <span className={classes.PredictionBox}>{this.state.homePrediction}</span> - <span className={classes.PredictionBox}>{this.state.awayPrediction}</span></p>
      </div>
    );
  }

}

export default Game;
