import React, { useState, useEffect } from 'react';

const SynonymGame = ({ vocab, awardPetXp }) => {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    if (!vocab || vocab.length === 0) return;
    setSelectedOpt(null);
    setShowFeedback(false);
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    if (!correct) return;
    const wrongs = vocab.filter(v => v && correct && v.synonym !== correct.synonym).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    setCurrent(correct);
  };

  useEffect(() => {
    if (vocab && vocab.length > 0) {
      loadQuestion();
    }
  }, [vocab]);

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);
    
    const isCorrect = opt.synonym === current.synonym;
    if (isCorrect) {
      setScore(s => s + 1);
      awardPetXp(10);
    }
    
    setTimeout(() => {
      loadQuestion();
    }, 1500);
  };

  const getBtnStyle = (opt) => {
    if (!showFeedback) {
      return { padding: '14px 10px', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', cursor: 'pointer' };
    }
    const isCorrect = opt.synonym === current.synonym;
    const isSelected = selectedOpt && selectedOpt.synonym === opt.synonym;
    if (isCorrect) {
      return {
        padding: '14px 10px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        background: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        color: '#34d399',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
        transition: 'all 0.2s',
        cursor: 'default'
      };
    }
    if (isSelected) {
      return {
        padding: '14px 10px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        background: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
        color: '#f87171',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
        transition: 'all 0.2s',
        cursor: 'default'
      };
    }
    return {
      padding: '14px 10px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      opacity: 0.4,
      transition: 'all 0.2s',
      cursor: 'default'
    };
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 'bold' }}>🔗 EŞ ANLAMLI KELİME BULMA</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      {current && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelimemiz:</div>
          <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: '900' }}>{current.english.toUpperCase()}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(opt)} className="btn-secondary" style={getBtnStyle(opt)} disabled={showFeedback}>
            {opt.synonym}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: selectedOpt?.synonym === current.synonym ? '#34d399' : '#f87171',
          padding: '8px',
          borderRadius: '10px',
          background: selectedOpt?.synonym === current.synonym ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }}>
          {selectedOpt?.synonym === current.synonym 
            ? '✔️ Doğru! +10 XP' 
            : `❌ Yanlış! Doğru cevap: "${current.synonym}"`}
        </div>
      )}
    </div>
  );
};

export default SynonymGame;
