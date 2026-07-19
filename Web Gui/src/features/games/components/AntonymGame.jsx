import React, { useState, useEffect } from 'react';

const AntonymGame = ({ vocab, awardPetXp }) => {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    if (!Array.isArray(vocab) || vocab.length === 0) return;
    setSelectedOpt(null);
    setShowFeedback(false);
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    if (!correct) return;
    const wrongs = vocab.filter(v => v && correct && v.antonym !== correct.antonym).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    setCurrent(correct);
  };

  useEffect(() => {
    if (Array.isArray(vocab) && vocab.length > 0) {
      loadQuestion();
    }
  }, [vocab]);

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);
    
    const isCorrect = opt.antonym === current.antonym;
    if (isCorrect) {
      setScore(s => s + 1);
      awardPetXp(10);
    }
    
    setTimeout(() => {
      loadQuestion();
    }, 1500);
  };

  const getTurkishOfAntonym = (opt) => {
    if (!opt || !opt.antonym) return '';
    const found = vocab.find(v => v && v.english && v.english.toLowerCase() === opt.antonym.toLowerCase());
    if (found && found.turkish) {
      return found.turkish;
    }
    if (opt.antonym_turkish) return opt.antonym_turkish;
    
    const fallbacks = {
      'center': 'merkez',
      'loss': 'kayıp',
      'repulsion': 'itme gücü, geri tepme',
      'element': 'element, unsur',
      'absorption': 'emilim, soğurma',
      'release': 'salmak, serbest bırakmak',
      'insulate': 'yalıtmak',
      'variable': 'değişken',
      'scarce': 'kıt, nadir',
      'vaguely': 'belirsizce, hayal meyal',
      'harm': 'zarar vermek',
      'health': 'sağlık',
      'cause': 'neden olmak, sebep',
      'pathogen': 'patojen, hastalık yapıcı',
      'purity': 'saflık, temizlik',
      'misinterpret': 'yanlış yorumlamak',
      'ban': 'yasaklamak',
      'susceptible': 'duyarlı, savunmasız',
      'mild': 'hafif, yumuşak',
      'suddenly': 'aniden, birdenbire'
    };
    return fallbacks[opt.antonym.toLowerCase()] || '';
  };

  const getBtnStyle = (opt) => {
    if (!showFeedback) {
      return { padding: '14px 10px', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', cursor: 'pointer' };
    }
    const isCorrect = opt.antonym === current.antonym;
    const isSelected = selectedOpt && selectedOpt.antonym === opt.antonym;
    if (isCorrect) {
      return {
        padding: '10px 10px',
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
        padding: '10px 10px',
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
      padding: '10px 10px',
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
        <div style={{ fontSize: '0.78rem', color: '#f43f5e', fontWeight: 'bold' }}>🔄 ZIT ANLAMLI KELİME BULMA</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      {current && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelimemiz:</div>
          <div style={{ fontSize: '1.5rem', color: '#fb7185', fontWeight: '900' }}>{current.english.toUpperCase()}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(opt)} className="btn-secondary" style={getBtnStyle(opt)} disabled={showFeedback}>
            <div>{opt.antonym}</div>
            {showFeedback && (
              <div style={{ fontSize: '0.72rem', marginTop: '4px', opacity: 0.85, fontWeight: 'normal' }}>
                ({getTurkishOfAntonym(opt)})
              </div>
            )}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: selectedOpt?.antonym === current.antonym ? '#34d399' : '#f87171',
          padding: '8px',
          borderRadius: '10px',
          background: selectedOpt?.antonym === current.antonym ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }}>
          {selectedOpt?.antonym === current.antonym 
            ? '✔️ Doğru! +10 XP' 
            : `❌ Yanlış! Doğru cevap: "${current.antonym}"`}
        </div>
      )}
    </div>
  );
};

export default AntonymGame;
