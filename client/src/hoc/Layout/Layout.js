import React, { Component } from 'react';

import Aux from '../Aux1/Aux1';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    sideDrawerToggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        let topBar = null;

        if (this.props.authstatus) {
          topBar = (
            <Aux>
              <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} username={this.props.username} logout={this.props.logout}/>
              <SideDrawer
                  open={this.state.showSideDrawer}
                  closed={this.sideDrawerClosedHandler} />
            </Aux>
          );
        }

        return (
            <Aux>
                {topBar}
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout;
