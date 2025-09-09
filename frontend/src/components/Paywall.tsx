import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/PetDisplay.css';

interface PaywallCardProps {
  className: string;
  title: string;
  description: string;
  buttonText: string;
  buttonClassName: string;
  onButtonClick: () => void;
}

const PaywallCard: React.FC<PaywallCardProps> = ({
  className,
  title,
  description,
  buttonText,
  buttonClassName,
  onButtonClick
}) => {
  return (
    <div className={className}>
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        onClick={onButtonClick}
        className={buttonClassName}
      >
        {buttonText}
      </button>
    </div>
  );
};

interface PaywallProps {
  onError: (error: string) => void;
}

const Paywall: React.FC<PaywallProps> = ({ onError }) => {
  const { user, upgradeToPremium, downgradeToFree } = useAuth();
  if (!user) {
    return null;
  }

  const handleUpgrade = async () => {
    try {
      await upgradeToPremium();
    } catch (err: any) {
      onError(err.message);
    }
  };

  const handleDowngrade = async () => {
    try {
      console.log('Before downgrade - user.isPremium:', user.isPremium);
      await downgradeToFree();
      console.log('After downgrade - user.isPremium:', user.isPremium);
    } catch (err: any) {
      console.error('Downgrade error:', err);
      onError(err.message);
    }
  };

  if (user.isPremium) {
    return (
      <PaywallCard
        className="paywall paywall-premium"
        title="✨ Premium Active!"
        description="You have access to all premium features!"
        buttonText="🔄 Downgrade to Free"
        buttonClassName="paywall-button paywall-downgrade"
        onButtonClick={handleDowngrade}
      />
    );
  } else {
    return (
      <PaywallCard
        className="paywall paywall-free"
        title="✨ Unlock Premium Features!"
        description="Get access to premium food, pet customization, and mini-games!"
        buttonText="✨ Upgrade to Premium"
        buttonClassName="paywall-button"
        onButtonClick={handleUpgrade}
      />
    );
  }
};

export default Paywall;
