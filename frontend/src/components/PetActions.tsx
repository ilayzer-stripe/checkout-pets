import React, { useState, useEffect } from 'react';
import { Pet, User } from '../types';
import EatButton from './EatButton';
import PlayButton from './PlayButton';
import StudyButton from './StudyButton';
import ResetButton from './ResetButton';

interface PetActionsProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
  onStatChange: (stat: string, change: number) => void;
}

const PetActions: React.FC<PetActionsProps> = ({ pet, user, onPetUpdate, onStatChange }) => {
  const [playShimmer, setPlayShimmer] = useState(false);
  const [studyShimmer, setStudyShimmer] = useState(false);

  // Trigger shimmer effect when user upgrades to premium
  useEffect(() => {
    if (user?.isPremium) {
      // Reset shimmer states first to ensure clean animation
      setPlayShimmer(false);
      setStudyShimmer(false);
      
      // Small delay to ensure reset, then trigger shimmer
      const resetTimer = setTimeout(() => {
        setPlayShimmer(true);
        setStudyShimmer(true);
        
        // Remove shimmer class after animation completes
        const shimmerTimer = setTimeout(() => {
          setPlayShimmer(false);
          setStudyShimmer(false);
        }, 1500);
        
        return shimmerTimer;
      }, 50);
      
      return () => {
        clearTimeout(resetTimer);
      };
    } else {
      // Ensure shimmer is off when not premium
      setPlayShimmer(false);
      setStudyShimmer(false);
    }
  }, [user?.isPremium]);

  return (
    <div className="pet-actions">
      <h3>Actions</h3>
      <div className="action-buttons">
        <EatButton 
          pet={pet}
          user={user}
          onPetUpdate={onPetUpdate}
          onStatChange={onStatChange}
        />
        
        <PlayButton 
          pet={pet}
          user={user}
          onPetUpdate={onPetUpdate}
          onStatChange={onStatChange}
          playShimmer={playShimmer}
        />
        
        <StudyButton 
          pet={pet}
          user={user}
          onPetUpdate={onPetUpdate}
          onStatChange={onStatChange}
          studyShimmer={studyShimmer}
        />
        
        <ResetButton 
          pet={pet}
          user={user}
          onPetUpdate={onPetUpdate}
        />
      </div>
    </div>
  );
};

export default PetActions;
