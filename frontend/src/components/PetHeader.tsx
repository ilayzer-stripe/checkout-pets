import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Pet, User } from '../types';
import { useToast } from './ToastContainer';

interface PetHeaderProps {
  pet: Pet;
  user: User | null;
  onPetUpdate: (updatedPet: Pet) => void;
}

const PetHeader: React.FC<PetHeaderProps> = ({ pet, user, onPetUpdate }) => {
  const { showToast } = useToast();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isEditingEmoji, setIsEditingEmoji] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setIsEditingEmoji(false);
      }
    };

    if (isEditingEmoji) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isEditingEmoji]);

  const getPetEmoji = (petType: string, color: string) => {
    const emojiMap: { [key: string]: string } = {
      cat: '🐱',
      dog: '🐶',
      bird: '🐦',
      rabbit: '🐰',
      dragon: '🐉'
    };
    return emojiMap[petType] || '🐱';
  };

  const availableEmojis = [
    { type: 'cat', emoji: '🐱', name: 'Cat', isPremium: false },
    { type: 'dog', emoji: '🐶', name: 'Dog', isPremium: false },
    { type: 'bird', emoji: '🐦', name: 'Bird', isPremium: false },
    { type: 'rabbit', emoji: '🐰', name: 'Rabbit', isPremium: true },
    { type: 'dragon', emoji: '🐉', name: 'Dragon', isPremium: true }
  ];

  const updatePetName = async () => {
    if (!editingName.trim()) {
      setIsEditingName(false);
      setEditingName('');
      return;
    }
    
    try {
      const response = await axios.put('/pet/name', { name: editingName.trim() });
      onPetUpdate(response.data.pet);
      setIsEditingName(false);
      setEditingName('');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update pet name', 'error');
    }
  };

  const updatePetEmoji = async (petType: string) => {
    try {
      const response = await axios.put('/pet/appearance', { petType });
      onPetUpdate(response.data.pet);
      setIsEditingEmoji(false);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update pet emoji', 'error');
    }
  };

  const startEditingName = () => {
    setEditingName(pet.name);
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

  return (
    <div className="pet-header">
      <div className="pet-info-container">
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
            <span 
              className="pet-name clickable"
              onClick={startEditingName}
              title="Click to edit your pet's name"
            >
              {pet.name}
              <span className="edit-hint">✏️</span>
            </span>
          )}
        </h2>
        
        <div className="pet-emoji-row">
          <div 
            className="pet-emoji clickable"
            onClick={() => setIsEditingEmoji(!isEditingEmoji)}
            title="Click to change your pet's appearance"
          >
            {getPetEmoji(pet.petType, pet.color)}
            <span className="edit-hint emoji-hint">🎨</span>
          </div>
          
          <div className={`emoji-picker-inline ${isEditingEmoji ? 'visible' : 'hidden'}`} ref={emojiPickerRef}>
            <div className="emoji-options">
              {availableEmojis.map((option) => {
                const isDisabled = option.isPremium && !user?.isPremium;
                const isSelected = pet.petType === option.type;
                
                return (
                  <button
                    key={option.type}
                    onClick={() => !isDisabled && updatePetEmoji(option.type)}
                    className={`emoji-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                    title={isDisabled ? `Upgrade to Premium to unlock ${option.name}!` : option.name}
                    disabled={isDisabled}
                  >
                    {option.emoji}
                    {isDisabled && <span className="premium-lock">🔒</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetHeader;
