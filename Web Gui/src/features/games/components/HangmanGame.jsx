import React, { useState, useEffect } from 'react';

const HangmanGame = ({ vocab, awardPetXp }) => {
  const [word, setWord] = useState('');
  const [turkishHint, setTurkishHint] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const loadWord = () => {
    if (!vocab || vocab.length === 0) return;
    const item = vocab[Math.floor(Math.random() * vocab.length)];
    if (!item) return;
    setWord(item.english.toLowerCase());
    setTurkishHint(item.turkish);
    setGuessed([]);
    setMistakes(0);
    setStatus('playing');
  };

  useEffect(() => {
    if (vocab && vocab.length > 0) {
      loadWord();
    }
  }, [vocab]);

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || status !== 'playing') return;
    const nextGuessed = [...guessed, letter];
    setGuessed(nextGuessed);

    if (!word.includes(letter)) {
      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      if (nextMistakes >= 6) {
        setStatus('lost');
      }
    } else {
      const won = word.split('').every(char => nextGuessed.includes(char));
      if (won) {
        setStatus('won');
        awardPetXp(25);
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#10b981', fontWeight: 'bold' }}>
        <span>💀 KELİME ASMACA</span>
        <span>Kalan Hak: {6 - mistakes}</span>
      </div>
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Anlamı:</div>
        <div style={{ fontSize: '1.25rem', color: '#34d399', fontWeight: 'bold' }}>{turkishHint}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '4px', margin: '14px 0' }}>
        {word.split('').map((char, idx) => (
          <span key={idx} style={{ borderBottom: '2px solid white', width: '24px', textAlign: 'center' }}>
            {guessed.includes(char) ? char : '_'}
          </span>
        ))}
      </div>
      {status === 'won' && <div style={{ color: '#34d399', fontWeight: 'bold', textAlign: 'center' }}>🎉 Kazandınız! +25 XP eklendi.</div>}
      {status === 'lost' && <div style={{ color: '#f87171', fontWeight: 'bold', textAlign: 'center' }}>💥 Kaybettiniz! Kelime: {word} idi.</div>}
      {status !== 'playing' ? (
        <button onClick={loadWord} className="btn-primary" style={{ padding: '10px', borderRadius: '8px' }}>Sıradaki Kelime</button>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
          {'abcdefghijklmnopqrstuvwxyz'.split('').map(char => (
            <button key={char} onClick={() => handleGuess(char)} disabled={guessed.includes(char)} style={{ padding: '6px 8px', fontSize: '0.72rem', borderRadius: '4px', background: guessed.includes(char) ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer' }}>
              {char.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HangmanGame;
