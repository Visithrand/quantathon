import React from 'react';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">🎯</span>
          <span className="navbar-title">Speech Therapy</span>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-user">
            <span className="user-name">Welcome, {user?.name || 'User'}</span>
            <button onClick={onLogout} className="logout-button">
              <span>Logout</span>
              <span className="logout-icon">🚪</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
