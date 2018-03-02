import React from 'react';
import classes from './Game.css';


const game = (props) => (
  <div className={classes.Game}>
    {(props.status === 'FINISHED') ? <span className={classes.Closed}>Closed</span>  : null }
    <p>{props.date}</p>
    <p>{props.home} vs {props.away} {(props.status === 'FINISHED') ? <span className={classes.FinalResult}>{props.homeGoals}-{props.awayGoals}</span>  : null }</p>
    <p>My prediction: {props.predictedHome} - {props.predictedAway}</p>
  </div>
);

export default game;
