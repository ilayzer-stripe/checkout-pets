import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';
import '../styles/PetDisplay.css';

interface PaywallProps {}

const Paywall: React.FC<PaywallProps> = () => {
  const { user, upgradeToPremium } = useAuth();
  const { showToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    if (user && !user.isPremium) {
      // Show paywall and animate in
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else if (user && user.isPremium) {
      // User upgraded - animate out then remove from DOM
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    } else {
      // No user - don't render
      setShouldRender(false);
      setIsVisible(false);
    }
  }, [user]);
  
  const handleUpgrade = async () => {
    try {
      await upgradeToPremium();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Don't render if we shouldn't show the paywall
  if (!shouldRender) {
    return null;
  }

  return (
    <div className={`paywall paywall-free ${isVisible ? 'paywall-visible' : 'paywall-hidden'}`}>
      <h3>✨ Unlock Premium Features!</h3>
      <p>Get access to new actions, extra pet customization, and more!</p>
      <button
        onClick={handleUpgrade}
        className="paywall-button"
      >
        ✨ Upgrade to Premium
      </button>
    </div>
  );
};

export default Paywall;
