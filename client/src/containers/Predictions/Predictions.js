import React, { Component } from 'react';
import classes from './Predictions.css';



class Predictions extends Component {
  clicktest = () => {
    this.props.history.push('/home');
  }
  render() {
    return (
        <div className={classes.Predictions}><p>This is the predictions view</p><button onClick={this.clicktest}>Test</button></div>
    );
  }

}

export default Predictions;
