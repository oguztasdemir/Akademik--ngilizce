import React, { useState, useEffect } from 'react';
import CardMatchGame from './components/CardMatchGame';
import WordShooterGame from './components/WordShooterGame';
import HangmanGame from './components/HangmanGame';
import SpellingGame from './components/SpellingGame';
import SynonymGame from './components/SynonymGame';
import AntonymGame from './components/AntonymGame';
import TrueFalseGame from './components/TrueFalseGame';
import ClozeGame from './components/ClozeGame';
import DefinitionGame from './components/DefinitionGame';

const GAMES_CATALOG = [
  { id: 'match', name: '1. Kart Eşleştirme (Memory)', desc: 'İngilizce kelimeleri Türkçe anlamlarıyla kart çevirerek eşleştirin.', color: '#ec4899', icon: 'fa-clone' },
  { id: 'shooter', name: '2. Kelime Avcısı (Shooter)', desc: 'Yukarıdan düşen kelime yere çarpmadan doğru çevirisini vurun!', color: '#3b82f6', icon: 'fa-bullseye' },
  { id: 'hangman', name: '3. Kelime Asmaca (Hangman)', desc: 'Harfleri tahmin ederek gizli YÖKDİL kelimesini kurtarın.', color: '#10b981', icon: 'fa-skull-crossbones' },
  { id: 'spelling', name: '4. Harf Karıştırma (Spelling)', desc: 'Karışık verilen harfleri doğru sıraya dizerek kelimeyi yazın.', color: '#fb923c', icon: 'fa-arrow-down-a-z' },
  { id: 'synonym', name: '5. Eş Anlam Eşleştirme', desc: 'Akademik kelimeleri benzer anlamlı İngilizce kelimeleriyle eşleştirin.', color: '#a855f7', icon: 'fa-equals' },
  { id: 'antonym', name: '6. Zıt Anlam Eşleştirme', desc: 'Kelimeleri zıt anlamlı İngilizce kelimeleriyle eşleştirin.', color: '#f43f5e', icon: 'fa-right-left' },
  { id: 'tf_run', name: '7. Doğru / Yanlış Çeviri', desc: 'Karşınıza çıkan çevirinin doğru mu yanlış mı olduğunu hızlıca seçin.', color: '#06b6d4', icon: 'fa-circle-check' },
  { id: 'cloze', name: '8. Cümle Tamamlama', desc: 'Akademik cümlelerdeki boşluğa uygun olan kelimeyi yerleştirin.', color: '#f59e0b', icon: 'fa-pen-clip' },
  { id: 'definition', name: '9. Tanım Bulmaca', desc: 'İngilizce tanımı verilen akademik kelimeyi tahmin edin.', color: '#14b8a6', icon: 'fa-book-bookmark' }
];

const GamesSection = ({ selectedCategory, awardPetXP, awardPetXp, setIsStudyingActive, logStudyActivity }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [vocabList, setVocabList] = useState([]);
  const [sessionScore, setSessionScore] = useState(0);

  const actualAwardPetXp = awardPetXP || awardPetXp;

  useEffect(() => {
    setSessionScore(0);
  }, [activeGame]);

  const handleGameAwardXp = (xpAmount) => {
    if (actualAwardPetXp) {
      actualAwardPetXp(xpAmount);
    }
    
    setSessionScore(prev => {
      const nextScore = prev + 1;
      try {
        const raw = localStorage.getItem('yokdil_games_performance') || '{}';
        const stats = JSON.parse(raw);
        if (!stats.highScores) stats.highScores = {};
        
        stats.totalCorrect = (stats.totalCorrect || 0) + 1;
        
        if (activeGame) {
          const currentHigh = stats.highScores[activeGame] || 0;
          if (nextScore > currentHigh) {
            stats.highScores[activeGame] = nextScore;
          }
        }
        
        localStorage.setItem('yokdil_games_performance', JSON.stringify(stats));
      } catch (e) {}
      
      return nextScore;
    });

    if (logStudyActivity) {
      logStudyActivity('games', 1);
    }
  };

  useEffect(() => {
    if (setIsStudyingActive) {
      setIsStudyingActive(activeGame !== null);
    }
  }, [activeGame, setIsStudyingActive]);

  useEffect(() => {
    if (!activeGame) {
      setVocabList([]);
      return;
    }
    const cat = selectedCategory || 'fen';
    const loadVocab = async () => {
      try {
        const mod = await import(`../../../../Dataset/yokdil/${cat}/minioyunlar/${activeGame}.json`);
        setVocabList(mod.default || mod);
      } catch (e) {
        console.error(`Error loading games vocab for ${activeGame}:`, e);
      }
    };
    loadVocab();
  }, [activeGame, selectedCategory]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px', textAlign: 'left' }}>
      
      <div className="section-title mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-gamepad" style={{ color: '#ec4899' }}></i> 10x Akademik Mini Oyunlar
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            YÖKDİL akademik kelime dağarcığınızı pekiştirecek 10 harika eğitsel oyun!
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {GAMES_CATALOG.map((g) => (
            <div 
              key={g.id} 
              className="glass-card" 
              style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${g.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: g.color, fontSize: '20px' }}>
                  <i className={`fa-solid ${g.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', margin: 0 }}>{g.name}</h3>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0, flex: 1 }}>
                {g.desc}
              </p>
              <button 
                onClick={() => setActiveGame(g.id)}
                className="btn-primary" 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 'bold', cursor: 'pointer', background: `linear-gradient(135deg, ${g.color}, ${g.color}dd)`, border: 'none', color: 'white' }}
              >
                Oyunu Başlat 🎮
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {activeGame === 'match' && <CardMatchGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'shooter' && <WordShooterGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'hangman' && <HangmanGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'spelling' && <SpellingGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'synonym' && <SynonymGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'antonym' && <AntonymGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'tf_run' && <TrueFalseGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'cloze' && <ClozeGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
          {activeGame === 'definition' && <DefinitionGame vocab={vocabList} awardPetXp={handleGameAwardXp} />}
        </div>
      )}

    </div>
  );
};

export default GamesSection;
