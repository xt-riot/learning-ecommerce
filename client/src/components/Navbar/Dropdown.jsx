import React, { Component } from 'react';
import { serviceDropdown } from '../../data';
// import { Link } from 'react-router-dom';
import './Dropdown.css';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };
  }

  render() {
    return (
      <>
        <div
          className={
            this.props.dropdown
              ? 'services-submenu'
              : 'services-submenu clicked'
          }
        >
          {serviceDropdown.map((item) => {
            return <li key={item.id}>{item.title}</li>;
          })}
        </div>
      </>
    );
  }
}
