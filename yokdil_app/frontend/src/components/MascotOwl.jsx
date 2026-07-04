import React, { useState, useEffect } from 'react';
import MascotPet from './MascotPet';

const MascotOwl = ({ state, speech }) => {
  const [petConfig, setPetConfig] = useState({
    animalId: 'chick',
    hat: 'none',
    glasses: 'none',
    clothing: 'none',
    item: 'none'
  });

  // Listen to custom pet updates in localStorage
  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem('yokdil_custom_pet');
      if (saved) {
        try {
          setPetConfig(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing pet configuration:", e);
        }
      }
    };

    loadConfig();

    // Listen for storage change events (when customizer updates it)
    window.addEventListener('storage', loadConfig);
    // Custom event dispatch for same-window updates
    window.addEventListener('custom-pet-updated', loadConfig);

    return () => {
      window.removeEventListener('storage', loadConfig);
      window.removeEventListener('custom-pet-updated', loadConfig);
    };
  }, []);

  return (
    <MascotPet 
      state={state} 
      speech={speech} 
      customConfig={petConfig} 
      isFloating={false}
    />
  );
};

export default MascotOwl;
