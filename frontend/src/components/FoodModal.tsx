import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';
import '../styles/FoodModal.css';

interface FoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FoodModal: React.FC<FoodModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (amount: number, price: number) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/auth/purchase-food', { amount, price });
      updateUser(response.data.user);
      showToast(`Successfully purchased ${amount} food!`, 'success');
      onClose();
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Failed to purchase food', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const foodOptions = [
    { amount: 1, price: 1 },
    { amount: 5, price: 2 },
    { amount: 10, price: 3 }
  ];

  return (
    <div className="food-modal-overlay" onClick={onClose}>
      <div className="food-modal" onClick={(e) => e.stopPropagation()}>
        <div className="food-modal-header">
          <h2>🛒 Buy more food</h2>
          <button className="food-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="food-modal-content">
          <div className="food-options">
            {foodOptions.map((option) => (
              <div key={option.amount} className="food-option">
                <div className="food-option-header">
                  <span className="food-amount">{option.amount} 🍎</span>
                </div>
                <button
                  className="food-purchase-btn"
                  onClick={() => handlePurchase(option.amount, option.price)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `$${option.price}`}
                </button>
              </div>
            ))}
          </div>
          
          <div className="food-modal-footer">
            <p className="current-food">
              Current food: <strong>{user?.foodCount || 0}</strong> 🍎
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
