import React from 'react';
import axios from 'axios';
import { Pet, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';

interface ResetButtonProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ pet, user, onPetUpdate }) => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();

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
    <button
      onClick={resetPetStats}
      className="btn btn-danger"
      title="Reset pet stats to 50% for testing"
    >
      🔄 Reset
    </button>
  );
};

export default ResetButton;
