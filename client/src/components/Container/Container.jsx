import React, { Component } from 'react';
import TopNavbar from '../TopNavbar/TopNavbar';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Container.css';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'light',
    };
  }

  switchTheme = () => {
    this.setState({
      theme: this.state.theme ? 'dark' : 'light',
    });
    console.log(this.state.theme);
  };

  render() {
    return (
      <div id='container' data-theme={this.state.theme}>
        <TopNavbar />
        <Navbar onClick={this.switchTheme} />
        <Footer />
      </div>
    );
  }
}
