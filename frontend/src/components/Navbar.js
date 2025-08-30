import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';
import BackButton from './BackButton';

function Navbar({ user }) {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">🎯</span>
          <span className="navbar-title">Speech Therapy</span>
        </div>
        
        <div className="navbar-menu">
          <div className="navbar-user">
            <BackButton to="/home" variant="ghost" className="mr-4">
              Back to Home
            </BackButton>
            <span className="user-name">Welcome, {user?.name || 'User'}</span>
            <button onClick={logout} className="logout-button">
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
