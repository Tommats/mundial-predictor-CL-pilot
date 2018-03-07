import React, { Component } from 'react';
import classes from './Game.css';

class Game extends Component {

  render() {

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

       let predictionBox = (
        <p>
          <span className={classes.PredictionText}>{this.props.name}&apos;s prediction:</span>&nbsp;<span className={classes.DisabledBox}>{this.props.predictedHome}</span>&nbsp;-&nbsp;
          <span className={classes.DisabledBox}>{this.props.predictedAway}</span>
          {points}
        </p>
      )

    return (
      <div className={classes.Game}>
        {(this.props.status === 'FINISHED') ? <span className={classes.Closed}>Closed</span>  : null }
        <p>{this.props.formatedDate}</p>
        <p><img src={homeIcon} className={classes.Icon} alt={this.props.home} />{this.props.home} vs <img src={awayIcon} className={classes.Icon} alt={this.props.away} />{this.props.away}<span className={classes.FinalResult}> {this.props.homeGoals}-{this.props.awayGoals}</span></p>
        {predictionBox}
      </div>
    );
  }

}

export default Game;
