import React, { useState, useEffect } from 'react';

// Vocabulary database fallback for instant client-side games if parent data is not loaded
const MINI_GAME_VOCAB = {
  fen: [
    { english: 'orbit', turkish: 'yörünge' },
    { english: 'discovery', turkish: 'keşif' },
    { english: 'gravity', turkish: 'yerçekimi' },
    { english: 'compound', turkish: 'bileşik' },
    { english: 'radiation', turkish: 'radyasyon' },
    { english: 'atmosphere', turkish: 'atmosfer' },
    { english: 'experiment', turkish: 'deney' },
    { english: 'hypothesis', turkish: 'hipotez' },
    { english: 'molecule', turkish: 'molekül' },
    { english: 'evolution', turkish: 'evrim' }
  ],
  saglik: [
    { english: 'treatment', turkish: 'tedavi' },
    { english: 'disease', turkish: 'hastalık' },
    { english: 'symptom', turkish: 'belirti' },
    { english: 'vaccine', turkish: 'aşı' },
    { english: 'infection', turkish: 'enfeksiyon' },
    { english: 'diagnose', turkish: 'teşhis etmek' },
    { english: 'prescription', turkish: 'reçete' },
    { english: 'immune', turkish: 'bağışıklık' },
    { english: 'surgery', turkish: 'ameliyat' },
    { english: 'epidemic', turkish: 'salgın' }
  ],
  sosyal: [
    { english: 'society', turkish: 'toplum' },
    { english: 'culture', turkish: 'kültür' },
    { english: 'heritage', turkish: 'miras' },
    { english: 'inflation', turkish: 'enflasyon' },
    { english: 'government', turkish: 'hükümet' },
    { english: 'migration', turkish: 'göç' },
    { english: 'constitution', turkish: 'anayasa' },
    { english: 'revolution', turkish: 'devrim' },
    { english: 'justice', turkish: 'adalet' },
    { english: 'diplomacy', turkish: 'diplomasi' }
  ]
};

const GamesSection = ({ selectedCategory, awardPetXp, activeTab }) => {
  const [activeGame, setActiveGame] = useState(null); // 'match' or 'shooter'
  const [vocabList, setVocabList] = useState([]);

  useEffect(() => {
    const cat = selectedCategory || 'fen';
    setVocabList(MINI_GAME_VOCAB[cat] || MINI_GAME_VOCAB.fen);
  }, [selectedCategory]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px', textAlign: 'left' }}>
      
      {/* Title */}
      <div className="section-title mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-gamepad" style={{ color: '#ec4899' }}></i> Akademik Mini Oyunlar
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            YÖKDİL kelimelerini eğlenerek pekiştirin, evcil hayvanınıza XP kazandırın!
          </p>
        </div>
        {activeGame && (
          <button 
            onClick={() => setActiveGame(null)}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-arrow-left"></i> Oyun Seçimine Dön
          </button>
        )}
      </div>

      {!activeGame ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '10px' }}>
          
          {/* Game 1: Card Match */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContents: 'center', color: '#ec4899', fontSize: '24px', display: 'flex', justifyContent: 'center' }}>
              <i className="fa-solid fa-clone" style={{ alignSelf: 'center' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: '0 0 6px 0' }}>Kart Eşleştirme</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                İngilizce kelimeleri Türkçe karşılıklarıyla eşleştirin. Hafızanızı test edin ve zamanla yarışın!
              </p>
            </div>
            <button 
              onClick={() => setActiveGame('match')}
              className="btn-primary" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #ec4899, #f43f5e)', border: 'none', color: 'white' }}
            >
              Oyunu Başlat 🎮
            </button>
          </div>

          {/* Game 2: Word Shooter */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContents: 'center', color: '#3b82f6', fontSize: '24px', display: 'flex', justifyContent: 'center' }}>
              <i className="fa-solid fa-bullseye" style={{ alignSelf: 'center' }}></i>
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: '0 0 6px 0' }}>Kelime Avcısı (Word Shooter)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                Yukarıdan düşen İngilizce kelime yere çarpmadan hemen altındaki 3 Türkçe şıktan doğru olanını vurun!
              </p>
            </div>
            <button 
              onClick={() => setActiveGame('shooter')}
              className="btn-primary" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', border: 'none', color: 'white' }}
            >
              Oyunu Başlat 🎮
            </button>
          </div>

        </div>
      ) : activeGame === 'match' ? (
        <CardMatchGame vocab={vocabList} awardPetXp={awardPetXp} />
      ) : (
        <WordShooterGame vocab={vocabList} awardPetXp={awardPetXp} />
      )}

    </div>
  );
};

// ----------------------------------------------------
// GAME 1: CARD MATCH
// ----------------------------------------------------
const CardMatchGame = ({ vocab, awardPetXp }) => {
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState([]); // indices
  const [matched, setMatched] = useState([]); // items text
  const [moves, setMoves] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Select 6 random vocabulary items
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
        // Match found!
        setMatched(prev => [...prev, card1.matchId]);
        setSelected([]);
        
        // Award XP
        if (awardPetXp) awardPetXp(5);

        if (matched.length + 1 === 6) {
          setCompleted(true);
          if (awardPetXp) awardPetXp(15); // Bonus completion XP
        }
      } else {
        // No match, reset after 1s
        setTimeout(() => setSelected([]), 1000);
      }
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#ec4899' }}>🎮 KART EŞLEŞTİRME</span>
        <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 'bold' }}>Hamle: <strong style={{ color: 'white' }}>{moves}</strong></span>
      </div>

      {completed ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>Tebrikler, Tamamladınız!</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.5, margin: 0 }}>
            Tüm akademik kelimeleri başarıyla eşleştirdiniz ve evcil hayvanınıza **+45 XP** kazandırdınız!
          </p>
          <button 
            onClick={() => {
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
            }}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '10px', background: 'var(--primary-gradient)', color: 'white' }}
          >
            Yeniden Oyna
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {cards.map((card, idx) => {
            const isSel = selected.includes(idx);
            const isMatch = matched.includes(card.matchId);

            let bg = 'rgba(255,255,255,0.02)';
            let border = '1px solid rgba(255,255,255,0.06)';
            let color = 'white';

            if (isSel) {
              bg = 'rgba(236, 72, 153, 0.15)';
              border = '1.5px solid #ec4899';
              color = '#f472b6';
            } else if (isMatch) {
              bg = 'rgba(16, 185, 129, 0.1)';
              border = '1px solid rgba(16, 185, 129, 0.2)';
              color = '#a7f3d0';
            }

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(idx)}
                style={{
                  height: '80px',
                  borderRadius: '12px',
                  background: bg,
                  border: border,
                  color: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: isMatch ? 'default' : 'pointer',
                  textAlign: 'center',
                  padding: '8px',
                  transition: 'all 0.2s ease',
                  userSelect: 'none',
                  opacity: isMatch ? 0.5 : 1
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

// ----------------------------------------------------
// GAME 2: WORD SHOOTER
// ----------------------------------------------------
const WordShooterGame = ({ vocab, awardPetXp }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [fallProgress, setFallProgress] = useState(0); // 0 to 100
  const [gameState, setGameState] = useState('playing'); // 'playing', 'gameover'

  const loadNextWord = () => {
    if (vocab.length === 0) return;
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    
    // Pick 2 random wrong answers
    const wrongs = vocab
      .filter(v => v.english !== correct.english)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const opts = [correct, ...wrongs].sort(() => 0.5 - Math.random());
    setCurrentWord(correct);
    setOptions(opts);
    setFallProgress(0);
  };

  useEffect(() => {
    loadNextWord();
    setScore(0);
    setWrongCount(0);
    setGameState('playing');
  }, [vocab]);

  // Handle falling animations
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setFallProgress(prev => {
        if (prev >= 100) {
          // Word hit the ground! Counts as a wrong answer
          setWrongCount(w => {
            const nextW = w + 1;
            if (nextW >= 3) {
              setGameState('gameover');
            }
            return nextW;
          });
          loadNextWord();
          return 0;
        }
        return prev + 5; // Speed multiplier
      });
    }, 250);

    return () => clearInterval(timer);
  }, [gameState, currentWord]);

  const handleShootOption = (opt) => {
    if (gameState !== 'playing') return;

    if (opt.english === currentWord.english) {
      // Correct!
      setScore(s => s + 1);
      if (awardPetXp) awardPetXp(5);
      loadNextWord();
    } else {
      // Incorrect!
      setWrongCount(w => {
        const nextW = w + 1;
        if (nextW >= 3) {
          setGameState('gameover');
        }
        return nextW;
      });
      loadNextWord();
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#3b82f6' }}>🎯 KELİME AVCISI</span>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 'bold' }}>
          <span>Skor: <strong style={{ color: '#34d399' }}>{score}</strong></span>
          <span>Can: <strong style={{ color: '#f87171' }}>{3 - wrongCount} ❤️</strong></span>
        </div>
      </div>

      {gameState === 'gameover' ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '3rem' }}>💔</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', margin: 0 }}>Oyun Bitti!</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.5, margin: 0 }}>
            Toplamda **{score}** doğru vuruş yaptınız ve evcil hayvanınıza **+{score * 5} XP** kazandırdınız!
          </p>
          <button 
            onClick={() => {
              setScore(0);
              setWrongCount(0);
              setGameState('playing');
              loadNextWord();
            }}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', border: 'none', borderRadius: '10px', background: 'var(--primary-gradient)', color: 'white' }}
          >
            Yeniden Başla
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Falling Area */}
          <div style={{ height: '180px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            
            {/* Ground indicator */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(239, 68, 68, 0.4)' }} />

            {/* Falling Word */}
            {currentWord && (
              <div 
                style={{
                  position: 'absolute',
                  top: `${fallProgress}%`,
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-100%)',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1.5px solid #3b82f6',
                  color: 'white',
                  padding: '6px 14px',
                  borderRadius: '18px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                  transition: 'top 0.25s linear'
                }}
              >
                {currentWord.english}
              </div>
            )}
          </div>

          {/* Shooters / Bottom Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'bold', textAlign: 'center' }}>
              DOĞRU SEÇENEĞE TIKLAYARAK KELİMEYİ VURUN!
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleShootOption(opt)}
                  className="btn-secondary"
                  style={{
                    padding: '12px 6px',
                    fontSize: '0.76rem',
                    fontWeight: 'bold',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.02)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🎯 {opt.turkish}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default GamesSection;
