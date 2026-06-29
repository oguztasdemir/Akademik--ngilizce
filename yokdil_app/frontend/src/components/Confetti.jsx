import React from 'react';

const Confetti = ({ particles }) => {
  if (!particles || particles.length === 0) return null;

  return (
    <div className="confetti-canvas-container">
      {particles.map(p => (
        <div 
          key={p.id} 
          className="confetti-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            transform: `rotate(${p.tilt}deg)`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
