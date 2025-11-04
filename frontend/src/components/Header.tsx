import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/App.css';

const Header: React.FC = () => {
  const { user, logout, downgradeToFree } = useAuth();
  const [showPremiumSection, setShowPremiumSection] = useState(false);

  useEffect(() => {
    if (user?.isPremium) {
      // Small delay to ensure smooth entrance animation
      const timer = setTimeout(() => setShowPremiumSection(true), 10);
      return () => clearTimeout(timer);
    } else {
      // Start exit animation
      setShowPremiumSection(false);
    }
  }, [user?.isPremium]);

  const handleDowngrade = async () => {
    try {
      await downgradeToFree();
    } catch (err: any) {
      console.error('Downgrade error:', err);
    }
  };

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
            <div className={`header-user-premium ${showPremiumSection ? 'premium-section-visible' : 'premium-section-hidden'}`}>
              <button 
                className="downgrade-button"
                onClick={handleDowngrade}
                title="Downgrade to Free"
              >
                <span className="downgrade-icon">⬇️</span>
                <span className="downgrade-text">Downgrade</span>
              </button>
              <div className="premium-badge">✨ Premium</div>
            </div>
          )}
          <div className="user-info">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
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
