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

    let homeIcon = `/images/${this.props.homeId}.png`;
    let awayIcon = `/images/${this.props.awayId}.png`;
    let points = null;
    let sign = '✘';

    if (this.props.status === 'FINISHED') {
      let pointsClass = [classes.Points];
      if (this.props.points>2) {
        pointsClass.push(classes.GreenPoints);
        sign = '✔';
      } else if (this.props.points===2) {
        pointsClass.push(classes.OrangePoints);
        sign = '➦';
      } else {
        pointsClass.push(classes.RedPoints);
      }
      points = <span className={pointsClass.join(' ')}>{sign}&nbsp;&nbsp;{this.props.points} Points</span>
    }

    if (!this.state.editable) {
      predictionBox = (
        <p>
          <span className={classes.PredictionText}>My prediction:</span>&nbsp;<span className={classes.DisabledBox}>{this.state.homePrediction}</span>&nbsp;-&nbsp;
          <span className={classes.DisabledBox}>{this.state.awayPrediction}</span>
          {points}
        </p>
      )
    }
    return (
      <div className={classes.Game}>
        {(!this.state.editable) ? <span className={classes.Closed}>Closed</span>  : null }
        <p>{this.props.formatedDate}</p>
        <p><img src={homeIcon} className={classes.Icon} alt={this.props.home} />{this.props.home} vs <img src={awayIcon} className={classes.Icon} alt={this.props.away} />{this.props.away} {(!this.state.editable) ? <span className={classes.FinalResult}> {this.props.homeGoals}-{this.props.awayGoals}</span>  : null }</p>
        {predictionBox}
      </div>
    );
  }

}

export default Game;
