import React from 'react';

const MascotOwl = ({ state, speech }) => {
  // Chick color scheme: vibrant yellow
  let bodyColor = "#FBBF24"; // Bright yellow
  let wingPathLeft = "M18 58 C8 65 12 75 22 64 Z";
  let wingPathRight = "M82 58 C92 65 88 75 78 64 Z";
  let animClass = "duo-mascot-neutral";

  if (state === 'happy') {
    bodyColor = "#FCD34D"; // Shiny lighter yellow
    wingPathLeft = "M18 58 C8 45 12 35 22 52 Z"; // Happy wings pointing up
    wingPathRight = "M82 58 C92 45 88 35 78 52 Z";
    animClass = "duo-mascot-happy";
  } else if (state === 'sad') {
    bodyColor = "#F59E0B"; // Slightly darker amber yellow
    animClass = "duo-mascot-sad";
  } else if (state === 'thinking') {
    bodyColor = "#FDE047"; // Pastel yellow
    animClass = "duo-mascot-thinking";
  }

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!speech) return;
    try {
      const synth = window.speechSynthesis;
      if (synth.speaking) {
        synth.cancel();
      }
      // Remove emojis
      const cleanText = speech.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      synth.speak(utterance);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {speech && (
        <div 
          className="mascot-bubble"
          onClick={handleSpeak}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Telaffuzu Dinlemek için Tıkla 🔊"
        >
          <span>{speech}</span>
          <i className="fa-solid fa-volume-high text-indigo-400" style={{ fontSize: '0.8rem' }}></i>
        </div>
      )}
      <div className={`duo-mascot-container ${animClass}`}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body shadow */}
          <ellipse cx="50" cy="94" rx="20" ry="4" fill="rgba(0,0,0,0.12)" />
          
          {/* Main Round Chick Body */}
          <ellipse cx="50" cy="55" rx="33" ry="34" fill={bodyColor} style={{ transition: 'fill 0.3s ease' }} />
          
          {/* Light Cream Belly */}
          <ellipse cx="50" cy="62" rx="20" ry="20" fill="#FFFDF0" />
 
          {/* Cute Rosy Cheeks */}
          <circle cx="28" cy="58" r="5" fill="#FDA4AF" opacity="0.75" />
          <circle cx="72" cy="58" r="5" fill="#FDA4AF" opacity="0.75" />
          
          {/* Cute Chick Head Feathers (Tuft) instead of owl ears */}
          <path d="M50 21 Q47 11 50 21" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
          <path d="M47 22 Q43 13 47 22" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M53 22 Q57 14 53 22" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
 
          {/* Eyes */}
          {state === 'happy' ? (
            <>
              {/* Happy curved eyes */}
              <path d="M28 48 Q35 40 42 48" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <path d="M58 48 Q65 40 72 48" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </>
          ) : state === 'sad' ? (
            <>
              {/* Sad eyes - Blinking group */}
              <g className="mascot-eye-left">
                <circle cx="35" cy="48" r="8" fill="white" />
                <circle cx="35" cy="50" r="4.5" fill="#1E293B" />
              </g>
              <g className="mascot-eye-right">
                <circle cx="65" cy="48" r="8" fill="white" />
                <circle cx="65" cy="50" r="4.5" fill="#1E293B" />
              </g>
              {/* Sad eyebrows */}
              <path d="M27 38 L39 42" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M73 38 L61 42" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : state === 'thinking' ? (
            <>
              {/* Curious looking up eyes - Blinking group */}
              <g className="mascot-eye-left">
                <circle cx="35" cy="48" r="8" fill="white" />
                <circle cx="38" cy="44" r="4.5" fill="#1E293B" />
              </g>
              <g className="mascot-eye-right">
                <circle cx="65" cy="48" r="8" fill="white" />
                <circle cx="62" cy="44" r="4.5" fill="#1E293B" />
              </g>
              {/* Thinking query eyebrows */}
              <path d="M28 38 Q35 34 42 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M58 42 L72 38" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Shiny cute cartoon eyes - Blinking group */}
              <g className="mascot-eye-left">
                <circle cx="35" cy="48" r="8" fill="white" />
                <circle cx="35" cy="48" r="4.5" fill="#1E293B" />
                <circle cx="37" cy="45" r="1.5" fill="white" />
              </g>
              <g className="mascot-eye-right">
                <circle cx="65" cy="48" r="8" fill="white" />
                <circle cx="65" cy="48" r="4.5" fill="#1E293B" />
                <circle cx="67" cy="45" r="1.5" fill="white" />
              </g>
            </>
          )}
 
          {/* Cute Orange Beak */}
          <polygon points="50,56 43,47 57,47" fill="#F97316" />
 
          {/* Wings */}
          <path d={wingPathLeft} fill={bodyColor} style={{ transition: 'all 0.3s ease' }} />
          <path d={wingPathRight} fill={bodyColor} style={{ transition: 'all 0.3s ease' }} />
 
          {/* Cute Orange Feet */}
          <circle cx="40" cy="91" r="3.5" fill="#F97316" />
          <circle cx="60" cy="91" r="3.5" fill="#F97316" />
        </svg>
      </div>
    </div>
  );
};

export default MascotOwl;
