import React from 'react';
import axios from 'axios';
import { Pet, User } from '../types';
import { useToast } from './ToastContainer';

interface PlayButtonProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
  onStatChange: (stat: string, change: number) => void;
  playShimmer: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ pet, user, onPetUpdate, onStatChange, playShimmer }) => {
  const { showToast } = useToast();

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

  return (
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
  );
};

export default PlayButton;
