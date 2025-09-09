import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/App.css';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      {/* Background decoration */}
      <div className="header-decoration header-decoration-1" />
      <div className="header-decoration header-decoration-2" />
      
      <div className="header-brand">
        <div className="header-logo">🐾</div>
        <h1 className="header-title">CheckoutPets</h1>
      </div>
      
      {user && (
        <div className="header-user">
          {user.isPremium && (
              <div className="premium-badge">✨ Premium</div>
          )}
          <div className="user-info">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <div className="user-welcome">Welcome back,</div>
              <div className="user-name">{user.username}</div>
            </div>
          </div>
          <button onClick={logout} className="header-logout">
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
