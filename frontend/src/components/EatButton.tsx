import React, { useState } from 'react';
import axios from 'axios';
import { Pet, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';
import FoodModal from './FoodModal';

interface EatButtonProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
  onStatChange: (stat: string, change: number) => void;
}

const EatButton: React.FC<EatButtonProps> = ({ pet, user, onPetUpdate, onStatChange }) => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  const eatWithPet = async () => {
    try {
      const response = await axios.post('/pet/eat');
      onPetUpdate(response.data.pet);
      
      // Update user data with new food count
      if (response.data.user) {
        updateUser(response.data.user);
      }
      
      // Show stat changes
      if (response.data.changes) {
        if (response.data.changes.happiness) onStatChange('happiness', response.data.changes.happiness);
        if (response.data.changes.energy) onStatChange('energy', response.data.changes.energy);
        if (response.data.changes.intelligence) onStatChange('intelligence', response.data.changes.intelligence);
      }
      
      // Success - no toast needed
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to feed pet', 'error');
    }
  };

  const openFoodModal = () => {
    setIsFoodModalOpen(true);
  };

  return (
    <>
      <button
        onClick={user?.foodCount && user?.foodCount > 0 && pet.intelligence >= 4 ? eatWithPet : undefined}
        className={`btn ${user?.foodCount && user?.foodCount > 0 && pet.intelligence >= 4 ? 'btn-primary' : 'btn-disabled'} eat-button`}
        title={
          user?.foodCount === 0 
            ? "No food available! Click + to buy more food." 
            : pet.intelligence < 4 
              ? "Not smart enough! Eating requires 4 intelligence." 
              : "Eating gives energy and happiness but decreases intelligence"
        }
      >
        🍎 Eat
        <span 
          className="food-count" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openFoodModal();
          }}
          style={{ cursor: 'pointer' }}
        >
          {user?.foodCount || 0}
          <span className="food-plus">+</span>
        </span>
      </button>
      
      <FoodModal 
        isOpen={isFoodModalOpen} 
        onClose={() => {
          setIsFoodModalOpen(false);
        }} 
      />
    </>
  );
};

export default EatButton;
