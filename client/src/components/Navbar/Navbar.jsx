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
      search: '',
    };
  }

  handleClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  onChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  render() {
    return (
      <nav className='navbar'>
        <div className='switch'>
          <div className='toggle'>
            <label htmlFor='themeSwitch'></label>
            <input
              type='checkbox'
              name='swich-theme'
              id='themeSwitch'
              onClick={this.props.onClick}
              defaultChecked
            />
            <div className='toggle-bg'></div>
            <div className='toggle-thumb'>
              <i className='fas fa-sun'></i>
              <i className='fas fa-moon'></i>
            </div>
          </div>
        </div>
        <form className='searchContainer'>
          <input
            id='input'
            type='text'
            value={this.state.search}
            onChange={this.onChange}
            placeholder='Search for a product...'
            className='searchBar'
          />
          <i className='fa fa-magnifying-glass searchIcon'></i>
        </form>
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
          <li className='menuItem'>
            <MenuButton>Sign Up</MenuButton>
          </li>
        </ul>
      </nav>
    );
  }
}
