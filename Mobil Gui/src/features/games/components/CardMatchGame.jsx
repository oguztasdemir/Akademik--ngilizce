import React, { useState, useEffect } from 'react';

const CardMatchGame = ({ vocab, awardPetXp }) => {
  const [engCards, setEngCards] = useState([]);
  const [trCards, setTrCards] = useState([]);
  const [selectedEng, setSelectedEng] = useState(null);
  const [selectedTr, setSelectedTr] = useState(null);
  const [matched, setMatched] = useState([]);
  const [wrongMatch, setWrongMatch] = useState(null);
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!vocab || vocab.length === 0) return;
    const shuffled = [...vocab].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    const engPool = shuffled.map(item => ({
      id: `${item.english}-eng`,
      text: item.english,
      matchId: item.english,
      lang: 'eng'
    })).sort(() => 0.5 - Math.random());

    const trPool = shuffled.map(item => ({
      id: `${item.english}-tr`,
      text: item.turkish,
      matchId: item.english,
      lang: 'tr'
    })).sort(() => 0.5 - Math.random());

    setEngCards(engPool);
    setTrCards(trPool);
    setSelectedEng(null);
    setSelectedTr(null);
    setMatched([]);
    setMoves(0);
    setCompleted(false);
    setWrongMatch(null);
  }, [vocab]);

  const handleEngClick = (card) => {
    if (matched.includes(card.matchId) || wrongMatch) return;
    if (selectedEng && selectedEng.id === card.id) {
      setSelectedEng(null);
      return;
    }
    setSelectedEng(card);
    checkMatch(card, selectedTr);
  };

  const handleTrClick = (card) => {
    if (matched.includes(card.matchId) || wrongMatch) return;
    if (selectedTr && selectedTr.id === card.id) {
      setSelectedTr(null);
      return;
    }
    setSelectedTr(card);
    checkMatch(selectedEng, card);
  };

  const checkMatch = (engCard, trCard) => {
    if (!engCard || !trCard) return;
    setMoves(prev => prev + 1);

    if (engCard.matchId === trCard.matchId) {
      setMatched(prev => [...prev, engCard.matchId]);
      setSelectedEng(null);
      setSelectedTr(null);
      if (awardPetXp) awardPetXp(5);
      
      if (matched.length + 1 === engCards.length) {
        setCompleted(true);
        if (awardPetXp) awardPetXp(15);
      }
    } else {
      setWrongMatch({ engId: engCard.id, trId: trCard.id });
      setTimeout(() => {
        setSelectedEng(null);
        setSelectedTr(null);
        setWrongMatch(null);
      }, 1000);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#ec4899' }}>🎮 KART EŞLEŞTİRME (10x AKADEMİK)</span>
        <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 'bold' }}>Hamle: <strong style={{ color: 'white' }}>{moves}</strong></span>
      </div>
      {completed ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>Tebrikler!</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>Tüm kelimeleri eşleştirdiniz ve **XP** kazandınız!</p>
          <button
            onClick={() => {
              // Trigger reload of vocab
              const shuffled = [...vocab].sort(() => 0.5 - Math.random()).slice(0, 6);
              const engPool = shuffled.map(item => ({ id: `${item.english}-eng`, text: item.english, matchId: item.english, lang: 'eng' })).sort(() => 0.5 - Math.random());
              const trPool = shuffled.map(item => ({ id: `${item.english}-tr`, text: item.turkish, matchId: item.english, lang: 'tr' })).sort(() => 0.5 - Math.random());
              setEngCards(engPool);
              setTrCards(trPool);
              setSelectedEng(null);
              setSelectedTr(null);
              setMatched([]);
              setMoves(0);
              setCompleted(false);
              setWrongMatch(null);
            }}
            className="btn-primary"
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            Yeniden Oyna 🔄
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* English Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', textAlign: 'center', marginBottom: '4px' }}>İngilizce Kelimeler</div>
            {engCards.map((card) => {
              const isSel = selectedEng && selectedEng.id === card.id;
              const isMatch = matched.includes(card.matchId);
              const isWrong = wrongMatch && wrongMatch.engId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleEngClick(card)}
                  style={{
                    height: '60px',
                    borderRadius: '12px',
                    background: isWrong ? 'rgba(239,68,68,0.15)' : isSel ? 'rgba(99,102,241,0.2)' : isMatch ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                    border: isWrong ? '1.5px solid #ef4444' : isSel ? '1.5px solid #6366f1' : isMatch ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    color: isWrong ? '#fca5a5' : isSel ? '#c7d2fe' : isMatch ? '#a7f3d0' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    cursor: isMatch ? 'default' : 'pointer',
                    textAlign: 'center',
                    padding: '8px',
                    opacity: isMatch ? 0.35 : 1,
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                  className="hover-card"
                >
                  {card.text}
                </div>
              );
            })}
          </div>

          {/* Turkish Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#f472b6', textTransform: 'uppercase', textAlign: 'center', marginBottom: '4px' }}>Türkçe Karşılıkları</div>
            {trCards.map((card) => {
              const isSel = selectedTr && selectedTr.id === card.id;
              const isMatch = matched.includes(card.matchId);
              const isWrong = wrongMatch && wrongMatch.trId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleTrClick(card)}
                  style={{
                    height: '60px',
                    borderRadius: '12px',
                    background: isWrong ? 'rgba(239,68,68,0.15)' : isSel ? 'rgba(236,72,153,0.2)' : isMatch ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.02)',
                    border: isWrong ? '1.5px solid #ef4444' : isSel ? '1.5px solid #ec4899' : isMatch ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    color: isWrong ? '#fca5a5' : isSel ? '#fbcfe8' : isMatch ? '#a7f3d0' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    cursor: isMatch ? 'default' : 'pointer',
                    textAlign: 'center',
                    padding: '8px',
                    opacity: isMatch ? 0.35 : 1,
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                  className="hover-card"
                >
                  {card.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardMatchGame;
