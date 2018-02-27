import React, { Component } from 'react';

import Aux from '../Aux1/Aux1';
import classes from './Layout.css';

class Layout extends Component {

    render () {
        return (
            <Aux className={classes.Content}>
              sadasd
              {this.props.children}
            </Aux>
        )
    }
}

export default Layout;
