import React from 'react';
import classes from './Home.css';

const home = (props) => (
  <div className={classes.Home}>
    <div className={classes.LogoContainer}><img src="/images/CL_Logo.png" alt="Logo" className={classes.Logo} /></div>
    <h2><u>Champions League Predictor (Pilot)</u></h2>
    <p>This is a pre-Mundial pilot for the predictor game.</p>
    <p>For placing a prediction for any match, jump on to "My Predictions" section and click on "My Prediction" boxes:</p>
    <div className={classes.PredictionExample}>My prediction:&nbsp;<span className={classes.DisabledBox}>0</span>&nbsp;-&nbsp;
    <span className={classes.DisabledBox}>0</span></div>
    <p>
    Once changing one of the values, a <span style={{color: 'green'}}>"Save"</span> button will show up. Click "Save" for saving your prediction.
    </p>
    <p><u>Points Calculation</u></p>
    <p><span className={classes.Points+' '+classes.OrangePoints}>➦&nbsp;&nbsp;General Prediction</span> - You predicted the general result (home/away win or draw) but not the exact score, will grant you 2 points.</p>
    <p><span className={classes.Points+' '+classes.GreenPoints}>✔&nbsp;&nbsp;Exact Prediction</span> - You predicted the exact final result, will grant you additional 3 points (on top of the base 2 general prediction points) and 5 points in total.<br /><b>*Bonus points</b> - Predicted results with more than 3 goals in total.<br/>Every extra goal predicted will grant another 2 points. For example, The final result is 3-2 = 9 points: 5 for the exact score and 4 bonus goal points.</p>
    <p><u>Table</u></p>
    <p>Sorted by points. If two or more players are equal on points on completion of the tournament matches,
    the following criteria are applied in the order given to determine their rankings:</p>
      <ol className={classes.Criteria} type="a">
        <li>higher number of general predictions;</li>
        <li>higher number of exact predictions;</li>
        <li>higher number of exact predicted goals;</li>
      </ol>
  </div>
);

export default home;
