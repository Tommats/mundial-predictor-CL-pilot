import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import Auth from './containers/Auth/Auth';
import axios from 'axios';
import './App.css';



class App extends Component {
  state = {
    response: '',
    email: ''
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  getEmail = () => {
    axios.get('/users/me',{headers: {'x-auth': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTg0MTM1NjI3YTRkN2MwOGYxYTZhMWMiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTE4NjA1MTQzfQ.p6CVa3TFP_wvSTAY8TdPxY03TqQXX3rYA1eS5tp-TfE'}}).then( (response) => {
      const email = response.data.email;
      this.setState({response: email});
    }).catch(function (error) {
      console.log(error);
    });
  }

  handleClick = () => {
   console.log('this is:', this);
 }

  render() {

    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/" exact component={Auth} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
