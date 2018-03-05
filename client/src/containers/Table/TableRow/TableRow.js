import React from 'react';
import Aux from '../../../hoc/Aux1/Aux1';
import classes from './TableRow.css';

const tableRow = (props) => {
  let trClass = [classes.TableRow];
  let symbol = <span role="img" aria-label="Fish">🐟</span>;
  if (props.rank === 1) {
    trClass.push(classes.Winner);
    symbol = <span role="img" aria-label="Crown">👑</span>;
  } else if (props.rank === 2) {
    symbol = <span role="img" aria-label="Second">🥈</span>;
  } else if (props.rank === 3) {
    symbol = <span role="img" aria-label="Third">🥉</span>;
  }
  return (
  <Aux>
    <tr className={classes.Spacer}></tr>
    <tr className={trClass.join(' ')}>
      <td>{props.rank}</td>
      <td>{symbol}&nbsp;&nbsp;{props.name}</td>
      <td>{props.points}</td>
      <td>{props.general}</td>
      <td>{props.exact}</td>
      <td>{props.exactGoals}</td>
    </tr>
  </Aux>
  )
};

export default tableRow;
