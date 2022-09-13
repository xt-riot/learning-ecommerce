import React, { Component } from 'react';

export default class Categories extends Component {
  render() {
    return (
      <div>
        {/* <div
          dropdown={this.props.dropdown}
          onClick={this.enableDropdown}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          className={
            this.props.dropdown
              ? 'services-submenu'
              : 'services-submenu clicked'
          }
        >
          {serviceDropdown.map((item) => {
            return (
              <li key={item.id} onClick={console.log(item.title)}>
                {item.title}
              </li>
            );
          })}
        </div> */}
      </div>
    );
  }
}
