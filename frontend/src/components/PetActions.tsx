import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pet, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';
import FoodModal from './FoodModal';

interface PetActionsProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
  onStatChange: (stat: string, change: number) => void;
}

const PetActions: React.FC<PetActionsProps> = ({ pet, user, onPetUpdate, onStatChange }) => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [playShimmer, setPlayShimmer] = useState(false);
  const [studyShimmer, setStudyShimmer] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  // Trigger shimmer effect when user upgrades to premium
  useEffect(() => {
    if (user?.isPremium) {
      setPlayShimmer(true);
      setStudyShimmer(true);
      
      // Remove shimmer class after animation completes
      const timer = setTimeout(() => {
        setPlayShimmer(false);
        setStudyShimmer(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user?.isPremium]);
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

  const playWithPet = async () => {
    try {
      const response = await axios.post('/pet/play');
      onPetUpdate(response.data.pet);
      
      // Show stat changes
      if (response.data.changes) {
        if (response.data.changes.happiness) onStatChange('happiness', response.data.changes.happiness);
        if (response.data.changes.energy) onStatChange('energy', response.data.changes.energy);
        if (response.data.changes.intelligence) onStatChange('intelligence', response.data.changes.intelligence);
      }
      
      // Success - no toast needed
    } catch (err: any) {
      if (err.response?.status === 403) {
        showToast('Premium subscription required to play with your pet!', 'warning');
      } else {
        showToast(err.response?.data?.error || 'Failed to play with pet', 'error');
      }
    }
  };

  const studyWithPet = async () => {
    try {
      const response = await axios.post('/pet/study');
      onPetUpdate(response.data.pet);
      
      // Show stat changes
      if (response.data.changes) {
        if (response.data.changes.happiness) onStatChange('happiness', response.data.changes.happiness);
        if (response.data.changes.energy) onStatChange('energy', response.data.changes.energy);
        if (response.data.changes.intelligence) onStatChange('intelligence', response.data.changes.intelligence);
      }
      
      // Success - no toast needed
    } catch (err: any) {
      if (err.response?.status === 403) {
        showToast('Premium subscription required to study with your pet!', 'warning');
      } else {
        showToast(err.response?.data?.error || 'Failed to study with pet', 'error');
      }
    }
  };

  const resetPetStats = async () => {
    try {
      const response = await axios.post('/pet/reset');
      onPetUpdate(response.data.pet);
      
      // Update user data with reset food count
      if (response.data.user) {
        updateUser(response.data.user);
      }
      
      // Success - no toast needed
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to reset pet stats', 'error');
    }
  };

  return (
    <div className="pet-actions">
      <h3>Actions</h3>
      <div className="action-buttons">
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
        
        <button
          onClick={playWithPet}
          className={`btn ${user?.isPremium && pet.energy >= 5 ? 'btn-primary' : 'btn-disabled'} ${!user?.isPremium ? 'premium-locked' : ''} ${playShimmer ? 'premium-unlock-shimmer' : ''}`}
          disabled={!user?.isPremium || pet.energy < 5}
          title={
            !user?.isPremium 
              ? "Upgrade to Premium to unlock Play!" 
              : pet.energy < 5 
                ? "Not enough energy! Play costs 5 energy." 
                : "Play increases happiness & intelligence with minimal energy cost!"
          }
        >
          🎾 Play
          {!user?.isPremium && <span className="premium-lock">🔒</span>}
        </button>
        
        <button
          onClick={studyWithPet}
          className={`btn ${user?.isPremium && pet.energy >= 6 ? 'btn-primary' : 'btn-disabled'} ${!user?.isPremium ? 'premium-locked' : ''} ${studyShimmer ? 'premium-unlock-shimmer' : ''}`}
          disabled={!user?.isPremium || pet.energy < 6}
          title={
            !user?.isPremium 
              ? "Upgrade to Premium to unlock Study!" 
              : pet.energy < 6 
                ? "Not enough energy! Study costs 6 energy." 
                : "Study greatly increases intelligence with good efficiency!"
          }
        >
          📚 Study
          {!user?.isPremium && <span className="premium-lock">🔒</span>}
        </button>
        
        <button
          onClick={resetPetStats}
          className="btn btn-danger"
          title="Reset pet stats to 50% for testing"
        >
          🔄 Reset
        </button>
      </div>
      
      <FoodModal 
        isOpen={isFoodModalOpen} 
        onClose={() => {
          setIsFoodModalOpen(false);
        }} 
      />
    </div>
  );
};

export default PetActions;
