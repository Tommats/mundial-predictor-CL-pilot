import React from 'react';

import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
      <NavigationItem link="/home" exact clicked={props.clicked}>Home</NavigationItem>
      <NavigationItem link="/predictions" clicked={props.clicked}>My Predictions</NavigationItem>
      <NavigationItem link="/table" clicked={props.clicked}>Table</NavigationItem>
  </ul>
);

export default navigationItems;
