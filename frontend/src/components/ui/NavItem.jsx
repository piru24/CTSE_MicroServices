import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({ to, children, variant = 'default', ...props }) => {
  const baseStyle = 'px-3 py-2 rounded-md text-sm font-medium';
  const styles = {
    default: 'text-gray-700 hover:bg-gray-100',
    primary: 'bg-blue-600 text-white hover:bg-blue-700'
  };

  return (
    <li>
      {to ? (
        <Link
          to={to}
          className={`${baseStyle} ${styles[variant]}`}
          {...props}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`${baseStyle} ${styles[variant]}`}
          {...props}
        >
          {children}
        </button>
      )}
    </li>
  );
};

export default NavItem;
