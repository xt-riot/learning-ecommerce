import React, { Component } from 'react';
import './TopNavbar.css';

export default class TopNavbar extends Component {
  render() {
    return (
      <div className='topNavbar'>
        <h4 className='top-text'>Free shipping on orders over $50.</h4>
        <i className='fa fa-cart-shopping'></i>
        <i className='fa fa-bag-shopping'></i>
      </div>
    );
  }
}
