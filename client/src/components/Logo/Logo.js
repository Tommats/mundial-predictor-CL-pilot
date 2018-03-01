import React from 'react';

import mundialLogo from '../../assets/images/logo.png';
import classes from './Logo.css';

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={mundialLogo} alt="Predictor" />
    </div>
);

export default logo;
