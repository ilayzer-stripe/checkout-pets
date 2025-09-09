import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Paywall from './Paywall';
import '../styles/common.css';
import '../styles/PetDisplay.css';

interface Pet {
  id: string;
  name: string;
  happiness: number;
  hunger: number;
  energy: number;
  petType: string;
  color: string;
  userId: string;
}

const PetDisplay: React.FC = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [statChanges, setStatChanges] = useState<{[key: string]: number}>({});
  
  const { user } = useAuth();

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

  const fetchPet = async () => {
    try {
      const response = await axios.get('/pet');
      setPet(response.data.pet);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPet();
    }
  }, [user]);

  const feedPet = async () => {
    try {
      const response = await axios.post('/pet/feed');
      setPet(response.data.pet);
      
      // Show stat changes
      if (response.data.changes) {
        if (response.data.changes.hunger) showStatChange('hunger', response.data.changes.hunger);
        if (response.data.changes.happiness) showStatChange('happiness', response.data.changes.happiness);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to feed pet');
    }
  };

  const feedPremiumPet = async () => {
    try {
      const response = await axios.post('/pet/feed-premium');
      setPet(response.data.pet);
      
      // Show stat changes
      if (response.data.changes) {
        if (response.data.changes.hunger) showStatChange('hunger', response.data.changes.hunger);
        if (response.data.changes.happiness) showStatChange('happiness', response.data.changes.happiness);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Premium subscription required for premium food!');
      } else {
        setError(err.response?.data?.error || 'Failed to feed pet');
      }
    }
  };

  const playWithPet = async () => {
    try {
      const response = await axios.post('/pet/play');
      setPet(response.data.pet);
      
      // Show stat changes
      if (response.data.changes) {
        if (response.data.changes.energy) showStatChange('energy', response.data.changes.energy);
        if (response.data.changes.happiness) showStatChange('happiness', response.data.changes.happiness);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('Premium subscription required to play with your pet!');
      } else {
        setError(err.response?.data?.error || 'Failed to play with pet');
      }
    }
  };

  const updatePetName = async () => {
    if (!editingName.trim()) {
      setIsEditingName(false);
      setEditingName('');
      return;
    }
    
    try {
      const response = await axios.put('/pet/name', { name: editingName.trim() });
      setPet(response.data.pet);
      setIsEditingName(false);
      setEditingName('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update pet name');
    }
  };

  const startEditingName = () => {
    setEditingName(pet?.name || '');
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setEditingName('');
  };

  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      updatePetName();
    } else if (e.key === 'Escape') {
      cancelEditingName();
    }
  };

  const resetPetStats = async () => {
    try {
      const response = await axios.post('/pet/reset');
      setPet(response.data.pet);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset pet stats');
    }
  };

  const getPetEmoji = (petType: string, color: string) => {
    const emojiMap: { [key: string]: string } = {
      cat: '🐱',
      dog: '🐶',
      bird: '🐦',
      rabbit: '🐰'
    };
    return emojiMap[petType] || '🐱';
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return '#4CAF50'; // Green
    if (value >= 40) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading your pet...</div>;
  }

  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        color: 'red',
        backgroundColor: '#ffe6e6',
        borderRadius: '8px',
        margin: '20px'
      }}>
        {error}
        <button 
          onClick={() => setError('')}
          style={{ marginLeft: '10px', padding: '5px 10px' }}
        >
          Dismiss
        </button>
      </div>
    );
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
      <div className="pet-header">
        <div className="pet-emoji">
          {getPetEmoji(pet.petType, pet.color)}
        </div>
        <h2 className="pet-name-container">
          {isEditingName ? (
            <>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={handleNameKeyPress}
                onBlur={updatePetName}
                autoFocus
                className="pet-name-input"
              />
              <button
                onClick={updatePetName}
                className="btn-confirm"
              >
                ✓
              </button>
              <button
                onClick={cancelEditingName}
                className="btn-cancel"
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <span className="pet-name">{pet.name}</span>
              <button
                onClick={startEditingName}
                className="btn-edit"
                title="Click to edit name"
              >
                ✏️
              </button>
            </>
          )}
        </h2>
      </div>

      <div className="pet-stats">
        <h3>Pet Stats</h3>
        <div className="flex-column">
          <div className="stat-bar-container">
            <span className="stat-label">Happiness</span>
            <div className="stat-bar">
              <div 
                className="stat-fill"
                style={{
                  width: `${pet.happiness}%`,
                  backgroundColor: getStatColor(pet.happiness)
                }}
              />
            </div>
            <span className="stat-value">{pet.happiness}%</span>
            <span className={`stat-change ${statChanges.happiness > 0 ? 'positive' : 'negative'} ${!statChanges.happiness ? 'invisible' : ''}`}>
              {statChanges.happiness ? (statChanges.happiness > 0 ? '+' : '') + statChanges.happiness : ''}
            </span>
          </div>
          
          <div className="stat-bar-container">
            <span className="stat-label">Hunger</span>
            <div className="stat-bar">
              <div 
                className="stat-fill"
                style={{
                  width: `${pet.hunger}%`,
                  backgroundColor: getStatColor(pet.hunger)
                }}
              />
            </div>
            <span className="stat-value">{pet.hunger}%</span>
            <span className={`stat-change ${statChanges.hunger > 0 ? 'positive' : 'negative'} ${!statChanges.hunger ? 'invisible' : ''}`}>
              {statChanges.hunger ? (statChanges.hunger > 0 ? '+' : '') + statChanges.hunger : ''}
            </span>
          </div>
          
          <div className="stat-bar-container">
            <span className="stat-label">Energy</span>
            <div className="stat-bar">
              <div 
                className="stat-fill"
                style={{
                  width: `${pet.energy}%`,
                  backgroundColor: getStatColor(pet.energy)
                }}
              />
            </div>
            <span className="stat-value">{pet.energy}%</span>
            <span className={`stat-change ${statChanges.energy > 0 ? 'positive' : 'negative'} ${!statChanges.energy ? 'invisible' : ''}`}>
              {statChanges.energy ? (statChanges.energy > 0 ? '+' : '') + statChanges.energy : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="pet-actions">
        <h3>Actions</h3>
        <div className="action-buttons">
          <button
            onClick={feedPet}
            className="btn btn-primary"
          >
            🍎 Feed Apple
          </button>
          
          <button
            onClick={feedPremiumPet}
            className={`btn ${user?.isPremium ? 'btn-primary' : 'btn-disabled'}`}
            disabled={!user?.isPremium}
          >
            🍕 Feed Pizza
          </button>
          
          <button
            onClick={playWithPet}
            className={`btn ${user?.isPremium ? 'btn-primary' : 'btn-disabled'}`}
            disabled={!user?.isPremium}
          >
            🎾 Play
          </button>
          
          <button
            onClick={resetPetStats}
            className="btn btn-danger"
            title="Reset pet stats to 50% for testing"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      <Paywall onError={setError} />
    </div>
  );
};

export default PetDisplay;
