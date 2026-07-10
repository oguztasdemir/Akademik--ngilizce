import React, { useState, useEffect } from 'react';

const DefinitionGame = ({ vocab, awardPetXp }) => {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    setSelectedOpt(null);
    setShowFeedback(false);
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const wrongs = vocab.filter(v => v.english !== correct.english).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    setCurrent(correct);
  };

  useEffect(() => { loadQuestion(); }, [vocab]);

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);
    
    const isCorrect = opt.english === current.english;
    if (isCorrect) {
      setScore(s => s + 1);
      awardPetXp(20);
    }
    
    setTimeout(() => {
      loadQuestion();
    }, 1800);
  };

  const getBtnStyle = (opt) => {
    if (!showFeedback) {
      return { padding: '12px', fontWeight: 'bold', transition: 'all 0.2s', cursor: 'pointer' };
    }
    const isCorrect = opt.english === current.english;
    const isSelected = selectedOpt && selectedOpt.english === opt.english;
    
    if (isCorrect) {
      return {
        padding: '12px',
        fontWeight: 'bold',
        background: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        color: '#34d399',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)',
        cursor: 'default'
      };
    }
    if (isSelected) {
      return {
        padding: '12px',
        fontWeight: 'bold',
        background: 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
        color: '#f87171',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
        cursor: 'default'
      };
    }
    return {
      padding: '12px',
      fontWeight: 'bold',
      opacity: 0.4,
      cursor: 'default'
    };
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.78rem', color: '#14b8a6', fontWeight: 'bold' }}>📖 İNGİLİZCE TANIM ÇÖZÜCÜ</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      {current && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Aşağıdaki İngilizce tanımı verilen kelimeyi bulunuz:</div>
          <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', border: '1px solid rgba(20, 184, 166, 0.15)', lineHeight: 1.6, fontStyle: 'italic', color: '#e2e8f0', fontWeight: '500' }}>
            "{current.definition}"
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(opt)} className="btn-secondary" style={getBtnStyle(opt)} disabled={showFeedback}>
            {opt.english}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: selectedOpt?.english === current.english ? '#34d399' : '#f87171',
          padding: '8px',
          borderRadius: '10px',
          background: selectedOpt?.english === current.english ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }}>
          {selectedOpt?.english === current.english 
            ? '✔️ Doğru! +20 XP' 
            : `❌ Yanlış! Doğru cevap: "${current.english}"`}
        </div>
      )}
    </div>
  );
};

export default DefinitionGame;
