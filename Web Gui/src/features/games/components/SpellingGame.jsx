import React, { useState, useEffect } from 'react';

const SpellingGame = ({ vocab, awardPetXp }) => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [letters, setLetters] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [status, setStatus] = useState('playing');

  const loadWord = () => {
    if (!Array.isArray(vocab) || vocab.length === 0) return;
    const item = vocab[Math.floor(Math.random() * vocab.length)];
    if (!item) return;
    setWord(item.english.toUpperCase());
    setHint(item.turkish);
    setAnswer([]);
    setStatus('playing');
    setLetters(item.english.toUpperCase().split('').sort(() => 0.5 - Math.random()).map((char, idx) => ({ id: idx, val: char })));
  };

  useEffect(() => {
    if (Array.isArray(vocab) && vocab.length > 0) {
      loadWord();
    }
  }, [vocab]);

  const selectLetter = (item) => {
    if (status !== 'playing') return;
    setAnswer(prev => [...prev, item]);
    setLetters(prev => prev.filter(l => l.id !== item.id));
  };

  const removeLetter = (item) => {
    if (status !== 'playing') return;
    setLetters(prev => [...prev, item]);
    setAnswer(prev => prev.filter(l => l.id !== item.id));
  };

  const checkAnswer = () => {
    const entered = answer.map(l => l.val).join('');
    if (entered === word) {
      setStatus('correct');
      awardPetXp(15);
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 'bold' }}>✍️ HARF KARIŞTIRMA</div>
      <div style={{ textAlign: 'center', fontSize: '1.1rem', color: 'white' }}>
        Karşılığı: <strong style={{ color: '#fb923c' }}>{hint}</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px', minHeight: '40px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px', justifyContent: 'center' }}>
        {answer.map(item => (
          <button key={item.id} onClick={() => removeLetter(item)} style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#fb923c', border: 'none', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>
            {item.val}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {letters.map(item => (
          <button key={item.id} onClick={() => selectLetter(item)} style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px', cursor: 'pointer' }}>
            {item.val}
          </button>
        ))}
      </div>
      {status === 'correct' && <div style={{ color: '#34d399', textAlign: 'center', fontWeight: 'bold' }}>🎉 Tebrikler! Doğru Eşleşti! +15 XP</div>}
      {status === 'wrong' && <div style={{ color: '#f87171', textAlign: 'center', fontWeight: 'bold' }}>❌ Cevap yanlış, doğrusu: {word}</div>}
      {status === 'correct' ? (
        <button onClick={loadWord} className="btn-primary" style={{ padding: '10px' }}>Sıradaki Kelime</button>
      ) : (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={checkAnswer} className="btn-primary" style={{ flex: 1, padding: '10px', background: '#fb923c' }}>Kontrol Et</button>
          <button onClick={loadWord} className="btn-secondary" style={{ padding: '10px' }}>Atla</button>
        </div>
      )}
    </div>
  );
};

export default SpellingGame;
