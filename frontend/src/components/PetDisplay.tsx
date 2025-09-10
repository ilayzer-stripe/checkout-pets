import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';
import { Pet } from '../types';
import Paywall from './Paywall';
import PetHeader from './PetHeader';
import PetActions from './PetActions';
import StatBar from './StatBar';
import '../styles/common.css';
import '../styles/PetDisplay.css';

// Main PetDisplay component

const PetDisplay: React.FC = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [statChanges, setStatChanges] = useState<{[key: string]: number}>({});
  
  const { user } = useAuth();
  const { showToast } = useToast();

  const showStatChange = (stat: string, change: number) => {
    setStatChanges(prev => ({ ...prev, [stat]: change }));
    setTimeout(() => {
      setStatChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[stat];
        return newChanges;
      });
    }, 2000);
  };

  const fetchPet = useCallback(async () => {
    try {
      const response = await axios.get('/pet');
      setPet(response.data.pet);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to fetch pet', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (user) {
      fetchPet();
    }
  }, [user, fetchPet]);

  const getStatColor = (value: number) => {
    if (value >= 70) return '#4CAF50'; // Green
    if (value >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading your pet...</div>;
  }

  if (!pet) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No pet found</div>;
  }

  return (
    <div className="pet-display">
      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}
      </style>
      
      <PetHeader 
        pet={pet} 
        user={user}
        onPetUpdate={setPet} 
      />

      <div className="pet-stats">
        <h3>Stats</h3>
        <div className="flex-column">
          <StatBar 
            label="Happiness"
            value={pet.happiness}
            change={statChanges.happiness}
            getStatColor={getStatColor}
          />
          
          <StatBar 
            label="Intelligence"
            value={pet.intelligence}
            change={statChanges.intelligence}
            getStatColor={getStatColor}
          />
          
          <StatBar 
            label="Energy"
            value={pet.energy}
            change={statChanges.energy}
            getStatColor={getStatColor}
          />
        </div>
      </div>

      <PetActions 
        pet={pet}
        user={user}
        onPetUpdate={setPet}
        onStatChange={showStatChange}
      />

      <Paywall />
    </div>
  );
};

export default PetDisplay;
