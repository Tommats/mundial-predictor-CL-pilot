import React, { Component } from 'react';
import classes from './Game.css';
import axios from 'axios';

class Game extends Component {
  state = {
    editable: true,
    homePrediction: 0,
    awayPrediction: 0,
    edited: false,
    saved: false,
    saveMessage: ''
  }
  componentWillMount () {
    let status = false;
    if ((this.props.date>Date.now()) && (this.props.status !== 'FINISHED')) {
      status = true;
    }
    this.setState({homePrediction: this.props.predictedHome, awayPrediction: this.props.predictedAway, editable: status});
  }

  changePredictionHandler = (event, inputIdentifier) => {
    let value = event.target.value;

    if ((inputIdentifier === 'home') && (value!==this.state.homePrediction)) {
      this.setState({homePrediction: value, edited:true, saved: false});
    } else if ((inputIdentifier === 'away') && (value!==this.state.awayPrediction)) {
      this.setState({awayPrediction: value, edited:true, saved: false});
    }
  }

  savePredictionHandler = () => {
    let data = {home : this.state.homePrediction, away: this.state.awayPrediction};
    let saveMsg = 'Saved!';
    axios.patch('/predictions/'+this.props.id, data, {headers: {'x-auth' : localStorage.getItem('xauth')} }).then( (response) => {
    }).catch((error) => {
        saveMsg='Error, contact admin';
    });
    this.setState({edited: false,saved: true,saveMessage: saveMsg});
  }

  render() {
    let predictionBox = (
      <p><span className={classes.PredictionText}>My prediction:</span>&nbsp;<input type="text" className={classes.PredictionBox} defaultValue={this.state.homePrediction} onChange={(event)=>this.changePredictionHandler(event, 'home')} />&nbsp;-&nbsp;
      <input type="text" className={classes.PredictionBox} defaultValue={this.state.awayPrediction} onChange={(event)=>this.changePredictionHandler(event, 'away')} />
      {(this.state.edited) ? <button className={classes.SaveButton} onClick={this.savePredictionHandler}>✔ &nbsp;&nbsp;Save</button> : null}
      {(this.state.saved) ? <span className={classes.SaveMessage}>{this.state.saveMessage}</span> : null}
      </p>
    );
    if (!this.state.editable) {
      predictionBox = (
        <p>
          <span className={classes.PredictionText}>My prediction:</span>&nbsp;<span className={classes.DisabledBox}>{this.state.homePrediction}</span>&nbsp;-&nbsp;
          <span className={classes.DisabledBox}>{this.state.awayPrediction}</span>
        </p>
      )
    }

    return (
      <div className={classes.Game}>
        {(this.props.status === 'FINISHED') ? <span className={classes.Closed}>Closed</span>  : null }
        <p>{this.props.formatedDate}</p>
        <p>{this.props.home} vs {this.props.away} {(!this.state.editable) ? <span className={classes.FinalResult}>{this.props.homeGoals}-{this.props.awayGoals}</span>  : null }</p>
        {predictionBox}
      </div>
    );
  }

}

export default Game;
