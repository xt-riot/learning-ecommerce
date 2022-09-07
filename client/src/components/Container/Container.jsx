import React, { Component } from 'react';
import './Container.css';
import TopNavbar from '../TopNavbar/TopNavbar';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div id='container'>
        <TopNavbar />
        <Navbar />
        <Footer />
      </div>
    );
  }
}
