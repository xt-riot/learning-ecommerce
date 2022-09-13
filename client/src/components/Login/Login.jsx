import React, { Component } from 'react';
import './Login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value.trim(),
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    const { email, password } = this.state;
    return (
      <div className='app'>
        <div className='login'>
          <h1>Login</h1>
          <div className='container'>
            <form onSubmit={this.onSubmit}>
              <label>E-mail</label>
              <input
                type='email'
                name='email'
                value={email}
                onChange={this.onChange}
                placeholder='Enter your email'
              />
              <label>Password</label>
              <input
                name='password'
                type='password'
                value={password}
                onChange={this.onChange}
                placeholder='Enter your password'
              />
              <div className='remember'>
                <input type='checkbox' checked='checked' />
                <p>Remember Me</p>
              </div>
              <button type='submit'>Log In</button>
            </form>
            <div className='bottom'>
              <p>Forget your password?</p>
              <a href='/'>Reset Password</a>
            </div>
            <p className='create'>Create Account</p>
          </div>
        </div>
      </div>
    );
  }
}
