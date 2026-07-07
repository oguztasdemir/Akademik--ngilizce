import React, { useState, useEffect } from 'react';

const CardMatchGame = ({ vocab, awardPetXp }) => {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const shuffled = [...vocab].sort(() => 0.5 - Math.random()).slice(0, 6);
    const cardPool = [];
    shuffled.forEach((item) => {
      cardPool.push({ id: `${item.english}-eng`, text: item.english, matchId: item.english, lang: 'eng' });
      cardPool.push({ id: `${item.english}-tr`, text: item.turkish, matchId: item.english, lang: 'tr' });
    });
    setCards(cardPool.sort(() => 0.5 - Math.random()));
    setSelected([]);
    setMatched([]);
    setMoves(0);
    setCompleted(false);
  }, [vocab]);

  const handleCardClick = (idx) => {
    if (selected.length === 2 || selected.includes(idx) || matched.includes(cards[idx].matchId)) return;
    const newSelected = [...selected, idx];
    setSelected(newSelected);
    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const card1 = cards[newSelected[0]];
      const card2 = cards[newSelected[1]];
      if (card1.matchId === card2.matchId && card1.lang !== card2.lang) {
        setMatched(prev => [...prev, card1.matchId]);
        setSelected([]);
        awardPetXp(5);
        if (matched.length + 1 === 6) {
          setCompleted(true);
          awardPetXp(15);
        }
      } else {
        setTimeout(() => setSelected([]), 1000);
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#ec4899' }}>🎮 KART EŞLEŞTİRME</span>
        <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 'bold' }}>Hamle: <strong style={{ color: 'white' }}>{moves}</strong></span>
      </div>
      {completed ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>Tebrikler!</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Tüm kelimeleri eşleştirdiniz ve **+45 XP** kazandınız!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {cards.map((card, idx) => {
            const isSel = selected.includes(idx);
            const isMatch = matched.includes(card.matchId);
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: '80px', borderRadius: '12px', background: isSel ? 'rgba(236,72,153,0.15)' : isMatch ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                  border: isSel ? '1.5px solid #ec4899' : '1px solid rgba(255,255,255,0.06)', color: isSel ? '#f472b6' : isMatch ? '#a7f3d0' : 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 'bold', cursor: isMatch ? 'default' : 'pointer',
                  textAlign: 'center', padding: '8px', opacity: isMatch ? 0.4 : 1
                }}
              >
                {card.text}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CardMatchGame;
