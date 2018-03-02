import React, { Component } from 'react';

import axios from 'axios';
import classes from './Auth.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';


class Auth extends Component {
  state = {
    controls: {
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'E-Mail Address'
        },
        value: '',
        validation: {
          required: true,
          minLength: 1
        },
        valid: false,
        touched: false,
        serverError: false
      },
      password: {
        elementType: 'input',
        elementConfig: {
          type: 'password',
          placeholder: 'Password'
        },
        value: '',
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touched: false,
        serverError: false
      }
    },
    errMsg: false
  }

  checkValidity(value,rules) {
    let isValid = true;
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;

      if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
      }
    }
    return isValid;
  }

  inputChangeHandler = (event, controlName) => {
    const updatedControls = {
      ...this.state.controls,
      [controlName]: {
        ...this.state.controls[controlName],
        value: event.target.value,
        valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
        touched: true
      }
    }
    this.setState({controls: updatedControls});
  }

  checkForm = () => {
    let currentValidity = true;
    let updatedControls = {
      ...this.state.controls
    }

    for (let property in this.state.controls) {
      updatedControls = {
        ...updatedControls,
        [property]: {
          ...updatedControls[property],
          valid: this.checkValidity(this.state.controls[property].value, this.state.controls[property].validation),
          touched: true
        }
      }
      currentValidity = updatedControls[property].valid && currentValidity;
    }
    this.setState({controls: updatedControls});

    return currentValidity;
  }

  submitFormHandler = (event) => {
    event.preventDefault();
    if (this.checkForm()) {
      const data = {
        'email': this.state.controls.email.value,
        'password': this.state.controls.password.value
      };
      axios.post('/users/login', data).then( (response) => {
          this.setState({errMsg: false});
          localStorage.setItem('xauth', response.headers["x-auth"]);
          window.location.href = "/";
        }).catch((error) => {
          let errorMsg = error.response.data;
          this.setState({errMsg: errorMsg})
        })
    };
  }

  render() {
    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({id: key, config: this.state.controls[key]});
    }

    const form = formElementsArray.map(formElement => (
      <Input
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        serverError= {formElement.config.serverError}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touched}
        changed={(event)=>this.inputChangeHandler(event, formElement.id)} />
    ))

    let errMsg = this.state.errMsg ? <p className={classes.CredError}>{this.state.errMsg}</p> :  null;

    return (
      <div className={classes.Auth}>
        <form>
          {form}
          <Button btnType="Success" clicked={this.submitFormHandler}>SUBMIT</Button>
        </form>
        {errMsg}
      </div>
    );
  }

}

export default Auth;
