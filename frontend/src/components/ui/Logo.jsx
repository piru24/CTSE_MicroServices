import React from 'react';
import logo from '../../assets/images/logo.png'; // Adjust the path as necessary

const Logo = () => (
  <img
    src={logo}
    alt="Logo"
    className="w-12 h-12 object-cover rounded-full shadow-lg"
    style={{ filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))' }}
  />
);

export default Logo;
