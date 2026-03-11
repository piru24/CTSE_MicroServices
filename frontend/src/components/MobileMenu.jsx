import React from 'react';
import NavItem from './ui/NavItem';

const MobileMenu = ({ isOpen, onClose, navItems, onLogout }) => (
  <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
      {navItems.map((item) => (
        <NavItem key={item.path} to={item.path}>
          {item.label}
        </NavItem>
      ))}
      <NavItem as="button" onClick={onLogout}>
        Logout
      </NavItem>
    </div>
  </div>
);

export default MobileMenu;
