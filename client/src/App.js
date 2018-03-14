import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from './axios';

import Aux from './hoc/Aux1/Aux1';
import Layout from './hoc/Layout/Layout';
import Auth from './containers/Auth/Auth';
import Home from './containers/Home/Home';
import Table from './containers/Table/Table';
import Predictions from './containers/Predictions/Predictions';
import FriendPrediction from './containers/FriendPrediction/FriendPrediction';

import './App.css';

class App extends Component {
  state = {
    response: '',
    email: '',
    auth: false,
    username: null
  };

  componentDidMount() {
    if (!this.state.auth) {
      if (localStorage.getItem('xauth')) {
        axios.get('/users/me', {headers: {'x-auth' : localStorage.getItem('xauth')} }).then( (response) => {
          let user = response.data.name;
          this.setState({auth: true, username: user});
          }).catch((error) => {
            console.log(error);
          })
      }
    }
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };


  logOutHandler = () => {
    axios.delete('/users/me/token', {headers: {'x-auth' : localStorage.getItem('xauth')} }).then( (response) => {
      console.log('Logged out');
      this.setState({auth: false, username: null});
      localStorage.removeItem('xauth');
    }).catch((error) => {
        console.log(error);
    })
 }

  render() {
    let route = <Route path="/" component={Auth} />;
    if (this.state.auth) {
       route = (
         <Aux>
           <Route path="/predictions" component={Predictions} />
           <Route path="/home" component={Home} />
           <Route path="/table" component={Table} />
           <Route path="/user/" component={FriendPrediction} />
           <Route path="/" exact component={Home} />
         </Aux>
       );
    }
    return (
      <div>
        <Layout authstatus={this.state.auth} username={this.state.username} logout={this.logOutHandler}>
          <Switch>
            {route}
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
