import React from 'react';
import './Footer.css';
import { linkToGithub } from '../../utils';

export default function Footer() {
  return (
    <div className='footer'>
      <hr />
      <div className='bottom-footer'>
        <h4 className='dev'>
          Developed with React.js and Node.js.{'  '}
          <i className='fa-brands fa-github' onClick={linkToGithub}></i>
          &copy; {new Date().getFullYear()} | xt-riot x andreasntokas
        </h4>
      </div>
    </div>
  );
}
