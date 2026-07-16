import React, { useState, useEffect } from 'react';

const TrueFalseGame = ({ vocab, awardPetXp, logStudyActivity }) => {
  const [englishWord, setEnglishWord] = useState('');
  const [displayedTr, setDisplayedTr] = useState('');
  const [correctTr, setCorrectTr] = useState('');
  const [isCorrectPair, setIsCorrectPair] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    setSelectedAns(null);
    setShowFeedback(false);
    const item = vocab[Math.floor(Math.random() * vocab.length)];
    setEnglishWord(item.english);
    setCorrectTr(item.turkish);
    const isReal = Math.random() > 0.5;
    setIsCorrectPair(isReal);
    if (isReal) {
      setDisplayedTr(item.turkish);
    } else {
      const fake = vocab.filter(v => v.english !== item.english)[0] || item;
      setDisplayedTr(fake.turkish);
    }
  };

  useEffect(() => { loadQuestion(); }, [vocab]);

  const handleAnswer = (val) => {
    if (showFeedback) return;
    setSelectedAns(val);
    setShowFeedback(true);
    
    const isCorrect = val === isCorrectPair;
    if (isCorrect) {
      setScore(s => s + 1);
      awardPetXp(5);
      if (logStudyActivity) logStudyActivity('games', 1);
    }
  };

  const getBtnStyle = (val) => {
    if (!showFeedback) {
      return { flex: 1, padding: '14px', background: val ? '#10b981' : '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' };
    }
    const isCorrect = val === isCorrectPair;
    const isSelected = selectedAns === val;
    
    if (isCorrect) {
      return {
        flex: 1,
        padding: '14px',
        background: '#10b981',
        border: '3px solid #34d399',
        color: 'white',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        cursor: 'default'
      };
    }
    if (isSelected) {
      return {
        flex: 1,
        padding: '14px',
        background: '#ef4444',
        border: '3px solid #f87171',
        color: 'white',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 'bold',
        cursor: 'default'
      };
    }
    return {
      flex: 1,
      padding: '14px',
      background: val ? '#10b981' : '#ef4444',
      opacity: 0.35,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      cursor: 'default'
    };
  };

  return (
    <div className="glass-card text-center" style={{ padding: '32px 24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 'bold' }}>⚡ HIZLI DOĞRU / YANLIŞ ÇEVİRİ</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      <div style={{ margin: '10px 0' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white' }}>{englishWord}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '8px 0' }}>anlamı eşleşiyor mu:</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22d3ee' }}>"{displayedTr}"</div>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => handleAnswer(true)} disabled={showFeedback} style={getBtnStyle(true)}>DOĞRU (True) ✔️</button>
        <button onClick={() => handleAnswer(false)} disabled={showFeedback} style={getBtnStyle(false)}>YANLIŞ (False) ❌</button>
      </div>
      {showFeedback && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 'bold',
            color: selectedAns === isCorrectPair ? '#34d399' : '#f87171',
            padding: '12px',
            borderRadius: '10px',
            background: selectedAns === isCorrectPair ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            lineHeight: '1.4'
          }}>
            {selectedAns === isCorrectPair ? (
              '✔️ Doğru Cevap! +5 XP'
            ) : (
              <span>
                ❌ Yanlış Cevap! <br />
                <strong>"{englishWord}"</strong> kelimesinin gerçek anlamı: <strong>"{correctTr}"</strong>
              </span>
            )}
          </div>
          <button
            onClick={loadQuestion}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            Sonraki Soru ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default TrueFalseGame;
