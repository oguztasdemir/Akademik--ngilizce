import React, { useState, useEffect } from 'react';

const WordShooterGame = ({ vocab, awardPetXp }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [fallProgress, setFallProgress] = useState(0);
  const [gameState, setGameState] = useState('playing');

  const loadNextWord = () => {
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const wrongs = vocab.filter(v => v.english !== correct.english).sort(() => 0.5 - Math.random()).slice(0, 2);
    setOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    setCurrentWord(correct);
    setFallProgress(0);
  };

  useEffect(() => {
    loadNextWord();
  }, [vocab]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setFallProgress(prev => {
        if (prev >= 100) {
          setWrongCount(w => {
            if (w + 1 >= 3) setGameState('gameover');
            return w + 1;
          });
          loadNextWord();
          return 0;
        }
        return prev + 6;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [gameState, currentWord]);

  const handleShoot = (opt) => {
    if (opt.english === currentWord.english) {
      setScore(s => s + 1);
      awardPetXp(5);
    } else {
      setWrongCount(w => {
        if (w + 1 >= 3) setGameState('gameover');
        return w + 1;
      });
    }
    loadNextWord();
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#3b82f6' }}>🎯 KELİME AVCISI</span>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <span>Skor: <strong style={{ color: '#34d399' }}>{score}</strong></span>
          <span>Can: <strong style={{ color: '#f87171' }}>{3 - wrongCount} ❤️</strong></span>
        </div>
      </div>
      {gameState === 'gameover' ? (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <h3>Oyun Bitti!</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Toplam Skorunuz: {score} | Kazandırılan: +{score * 5} XP</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ height: '150px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
            {currentWord && (
              <div style={{ position: 'absolute', top: `${fallProgress}%`, left: '50%', transform: 'translateX(-50%) translateY(-100%)', background: 'rgba(59,130,246,0.15)', border: '1.5px solid #3b82f6', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {currentWord.english}
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {options.map((opt, idx) => (
              <button key={idx} onClick={() => handleShoot(opt)} className="btn-secondary" style={{ padding: '10px 4px', fontSize: '0.76rem', cursor: 'pointer' }}>
                {opt.turkish}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordShooterGame;
