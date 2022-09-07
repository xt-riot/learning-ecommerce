import React, { Component } from 'react';
import Profile from './Profile';
import Products from './Products';
import Services from './Services';
import Contact from './Contact';
import { MenuButton } from './MenuButton';
import './Navbar.css';

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    return (
      <nav className='navbar'>
        <div className='logoWrapper'>
          <h1 className='navbarLogo'>
            Learning E-Commerce <i className='fa-solid fa-store'></i>
          </h1>
        </div>
        <div className='menu-icon' onClick={this.handleClick}>
          <i
            className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}
          ></i>
        </div>
        <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
          <li className='menuItem'>
            <Profile />
          </li>
          <li className='menuItem'>
            <Products />
          </li>
          <li className='menuItem'>
            <Services />
          </li>
          <li className='menuItem'>
            <Contact />
          </li>
          <i className='fa fa-magnifying-glass menuItem'></i>
          <li className='menuItem'>
            <MenuButton>Sign Up</MenuButton>
          </li>
        </ul>
      </nav>
    );
  }
}
