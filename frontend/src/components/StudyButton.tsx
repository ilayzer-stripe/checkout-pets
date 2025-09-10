import React from 'react';
import axios from 'axios';
import { Pet, User } from '../types';
import { useToast } from './ToastContainer';

interface StudyButtonProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
  onStatChange: (stat: string, change: number) => void;
  studyShimmer: boolean;
}

const StudyButton: React.FC<StudyButtonProps> = ({ pet, user, onPetUpdate, onStatChange, studyShimmer }) => {
  const { showToast } = useToast();

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

  return (
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
  );
};

export default StudyButton;
