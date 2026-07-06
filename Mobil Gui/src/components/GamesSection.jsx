import React, { useState, useEffect } from 'react';

// Vocabulary database fallback for instant client-side games
const MINI_GAME_VOCAB = {
  fen: [
    { english: 'orbit', turkish: 'yörünge', synonym: 'path', antonym: 'center', definition: 'The curved path of a celestial object or spacecraft round a star, planet, or moon.', sentence: 'The Earth is in a constant ____ around the Sun.', type: 'Noun' },
    { english: 'discovery', turkish: 'keşif', synonym: 'finding', antonym: 'loss', definition: 'The act of finding or learning something for the first time.', sentence: 'The ____ of penicillin changed modern medicine.', type: 'Noun' },
    { english: 'gravity', turkish: 'yerçekimi', synonym: 'attraction', antonym: 'repulsion', definition: 'The force that attracts a body towards the centre of the earth.', sentence: 'Objects fall to the ground due to the force of ____.', type: 'Noun' },
    { english: 'compound', turkish: 'bileşik', synonym: 'mixture', antonym: 'element', definition: 'A thing that is composed of two or more separate elements.', sentence: 'Water is a chemical ____ consisting of hydrogen and oxygen.', type: 'Noun' },
    { english: 'radiation', turkish: 'radyasyon', synonym: 'emission', antonym: 'absorption', definition: 'The emission of energy as electromagnetic waves or subatomic particles.', sentence: 'The ozone layer protects us from harmful solar ____.', type: 'Noun' },
    { english: 'absorb', turkish: 'absorbe etmek', synonym: 'soak up', antonym: 'release', definition: 'Take in or soak up energy, liquid, or other substances.', sentence: 'Plants ____ carbon dioxide from the atmosphere.', type: 'Verb' },
    { english: 'conduct', turkish: 'iletmek', synonym: 'transmit', antonym: 'insulate', definition: 'Transmit a form of energy such as heat or electricity.', sentence: 'Metals like copper ____ electricity very efficiently.', type: 'Verb' },
    { english: 'constant', turkish: 'sabit', synonym: 'stable', antonym: 'variable', definition: 'Occurring continuously or remaining the same over a period of time.', sentence: 'The speed of light is a ____ value in physics.', type: 'Adjective' },
    { english: 'abundant', turkish: 'bol', synonym: 'plentiful', antonym: 'scarce', definition: 'Existing or available in large quantities; overflowing.', sentence: 'Hydrogen is the most ____ element in the universe.', type: 'Adjective' },
    { english: 'precisely', turkish: 'kesinlikle', synonym: 'exactly', antonym: 'vaguely', definition: 'In a exact and accurate manner.', sentence: 'The scientific instruments measured the distance ____.', type: 'Adverb' }
  ],
  saglik: [
    { english: 'treatment', turkish: 'tedavi', synonym: 'therapy', antonym: 'harm', definition: 'Medical care given to a patient for an illness or injury.', sentence: 'Chemotherapy is a common ____ for cancer patients.', type: 'Noun' },
    { english: 'disease', turkish: 'hastalık', synonym: 'illness', antonym: 'health', definition: 'A disorder of structure or function in a human, animal, or plant.', sentence: 'Lyme ____ is transmitted to humans through tick bites.', type: 'Noun' },
    { english: 'symptom', turkish: 'belirti', synonym: 'indication', antonym: 'cause', definition: 'A physical or mental sign which indicates a condition of disease.', sentence: 'A dry cough is a common ____ of respiratory infections.', type: 'Noun' },
    { english: 'vaccine', turkish: 'aşı', synonym: 'immunization', antonym: 'pathogen', definition: 'A substance used to stimulate the production of antibodies.', sentence: 'The polio ____ has nearly eradicated the disease worldwide.', type: 'Noun' },
    { english: 'infection', turkish: 'enfeksiyon', synonym: 'contamination', antonym: 'purity', definition: 'The invasion and growth of germs in the body.', sentence: 'Wash the wound to prevent a bacterial ____.', type: 'Noun' },
    { english: 'diagnose', turkish: 'teşhis etmek', synonym: 'identify', antonym: 'misinterpret', definition: 'Identify the nature of an illness by examination of symptoms.', sentence: 'Doctors use blood tests to ____ diabetes.', type: 'Verb' },
    { english: 'prescribe', turkish: 'reçete etmek', synonym: 'order', antonym: 'ban', definition: 'Advise and authorize the use of a medicine or treatment.', sentence: 'The doctor will ____ antibiotics for your throat infection.', type: 'Verb' },
    { english: 'immune', turkish: 'bağışıklık', synonym: 'resistant', antonym: 'susceptible', definition: 'Protected or exempt from a disease or pathogen.', sentence: 'Vaccinated individuals become ____ to the specific virus.', type: 'Adjective' },
    { english: 'severe', turkish: 'şiddetli', synonym: 'acute', antonym: 'mild', definition: 'Very great, intense, or harsh in medical illness symptoms.', sentence: 'The patient experienced ____ chest pain during the attack.', type: 'Adjective' },
    { english: 'gradually', turkish: 'yavaş yavaş', synonym: 'slowly', antonym: 'suddenly', definition: 'By degrees or in a gradual, slow-moving manner.', sentence: 'The patient recovered ____ after the complex surgery.', type: 'Adverb' }
  ],
  sosyal: [
    { english: 'society', turkish: 'toplum', synonym: 'community', antonym: 'individual', definition: 'People living together in a more or less ordered community.', sentence: 'Education plays a critical role in shaping modern ____.', type: 'Noun' },
    { english: 'culture', turkish: 'kültür', synonym: 'tradition', antonym: 'nature', definition: 'The customs, arts, and social institutions of a nation.', sentence: 'We spent the summer studying the local ____ of the Andes.', type: 'Noun' },
    { english: 'heritage', turkish: 'miras', synonym: 'legacy', antonym: 'loss', definition: 'Property or cultural traditions that can be inherited.', sentence: 'Historic buildings are an essential part of our national ____.', type: 'Noun' },
    { english: 'inflation', turkish: 'enflasyon', synonym: 'price rise', antonym: 'deflation', definition: 'A general increase in prices and fall in the purchasing value of money.', sentence: 'Central banks raise interest rates to control rising ____.', type: 'Noun' },
    { english: 'government', turkish: 'hükümet', synonym: 'administration', antonym: 'anarchy', definition: 'The group of people with the authority to govern a country.', sentence: 'The ____ announced a new policy to support low-income families.', type: 'Noun' },
    { english: 'govern', turkish: 'yönetmek', synonym: 'rule', antonym: 'obey', definition: 'Conduct the policy, actions, and affairs of a state.', sentence: 'It is difficult to ____ a nation with diverse populations.', type: 'Verb' },
    { english: 'abolish', turkish: 'yürürlükten kaldırmak', synonym: 'cancel', antonym: 'enact', definition: 'Formally put an end to a system, practice, or institution.', sentence: 'Many nations decided to ____ slavery in the 19th century.', type: 'Verb' },
    { english: 'democratic', turkish: 'demokratik', synonym: 'representative', antonym: 'authoritarian', definition: 'Supporting social equality and electing leaders by voting.', sentence: 'The constitution guarantees a ____ election process.', type: 'Adjective' },
    { english: 'stable', turkish: 'istikrarlı', synonym: 'steady', antonym: 'volatile', definition: 'Not likely to change, fail, or fluctuate.', sentence: 'A ____ economy attracts foreign investment.', type: 'Adjective' },
    { english: 'mutually', turkish: 'karşılıklı olarak', synonym: 'reciprocally', antonym: 'unilaterally', definition: 'With mutual action or relation between two parties.', sentence: 'Both countries signed a ____ beneficial trade agreement.', type: 'Adverb' }
  ]
};

const GAMES_CATALOG = [
  { id: 'match', name: '1. Kart Eşleştirme (Memory)', desc: 'İngilizce kelimeleri Türkçe anlamlarıyla kart çevirerek eşleştirin.', color: '#ec4899', icon: 'fa-clone' },
  { id: 'shooter', name: '2. Kelime Avcısı (Shooter)', desc: 'Yukarıdan düşen kelime yere çarpmadan doğru çevirisini vurun!', color: '#3b82f6', icon: 'fa-bullseye' },
  { id: 'hangman', name: '3. Kelime Asmaca (Hangman)', desc: 'Harfleri tahmin ederek gizli YÖKDİL kelimesini kurtarın.', color: '#10b981', icon: 'fa-skull-crossbones' },
  { id: 'spelling', name: '4. Harf Karıştırma (Spelling)', desc: 'Karışık verilen harfleri doğru sıraya dizerek kelimeyi yazın.', color: '#fb923c', icon: 'fa-arrow-down-a-z' },
  { id: 'synonym', name: '5. Eş Anlam Eşleştirme', desc: 'Akademik kelimeleri benzer anlamlı İngilizce kelimeleriyle eşleştirin.', color: '#a855f7', icon: 'fa-equals' },
  { id: 'antonym', name: '6. Zıt Anlam Eşleştirme', desc: 'Kelimeleri zıt anlamlı İngilizce kelimeleriyle eşleştirin.', color: '#f43f5e', icon: 'fa-right-left' },
  { id: 'tf_run', name: '7. Doğru / Yanlış Çeviri', desc: 'Karşınıza çıkan çevirinin doğru mu yanlış mı olduğunu hızlıca seçin.', color: '#06b6d4', icon: 'fa-circle-check' },
  { id: 'word_type', name: '8. Kelime Türü Boksör', desc: 'Kelimeleri doğru dilbilgisi sepetine (Noun, Verb, Adj, Adv) fırlatın!', color: '#84cc16', icon: 'fa-box-open' },
  { id: 'cloze', name: '9. Cümle Tamamlama', desc: 'Akademik cümlelerdeki boşluğa uygun olan kelimeyi yerleştirin.', color: '#f59e0b', icon: 'fa-pen-clip' },
  { id: 'definition', name: '10. Tanım Bulmaca', desc: 'İngilizce tanımı verilen akademik kelimeyi tahmin edin.', color: '#14b8a6', icon: 'fa-book-bookmark' }
];

const GamesSection = ({ selectedCategory, awardPetXp }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [vocabList, setVocabList] = useState([]);

  useEffect(() => {
    const cat = selectedCategory || 'fen';
    setVocabList(MINI_GAME_VOCAB[cat] || MINI_GAME_VOCAB.fen);
  }, [selectedCategory]);

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
              style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContents: 'space-between', gap: '14px', border: '1px solid rgba(255,255,255,0.06)' }}
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
          {activeGame === 'match' && <CardMatchGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'shooter' && <WordShooterGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'hangman' && <HangmanGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'spelling' && <SpellingGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'synonym' && <SynonymGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'antonym' && <AntonymGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'tf_run' && <TrueFalseGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'word_type' && <WordTypeGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'cloze' && <ClozeGame vocab={vocabList} awardPetXp={awardPetXp} />}
          {activeGame === 'definition' && <DefinitionGame vocab={vocabList} awardPetXp={awardPetXp} />}
        </div>
      )}

    </div>
  );
};

// ----------------------------------------------------
// GAME 1: CARD MATCH (Memory)
// ----------------------------------------------------
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

// ----------------------------------------------------
// GAME 2: WORD SHOOTER
// ----------------------------------------------------
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

// ----------------------------------------------------
// GAME 3: HANGMAN (Kelime Asmaca)
// ----------------------------------------------------
const HangmanGame = ({ vocab, awardPetXp }) => {
  const [word, setWord] = useState('');
  const [turkishHint, setTurkishHint] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const loadWord = () => {
    const item = vocab[Math.floor(Math.random() * vocab.length)];
    setWord(item.english.toLowerCase());
    setTurkishHint(item.turkish);
    setGuessed([]);
    setMistakes(0);
    setStatus('playing');
  };

  useEffect(() => { loadWord(); }, [vocab]);

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

// ----------------------------------------------------
// GAME 4: SPELLING GAME (Anagram / Spelling Bee)
// ----------------------------------------------------
const SpellingGame = ({ vocab, awardPetXp }) => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [letters, setLetters] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [status, setStatus] = useState('playing');

  const loadWord = () => {
    const item = vocab[Math.floor(Math.random() * vocab.length)];
    setWord(item.english.toUpperCase());
    setHint(item.turkish);
    setAnswer([]);
    setStatus('playing');
    setLetters(item.english.toUpperCase().split('').sort(() => 0.5 - Math.random()).map((char, idx) => ({ id: idx, val: char })));
  };

  useEffect(() => { loadWord(); }, [vocab]);

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
      {status === 'wrong' && <div style={{ color: '#f87171', textAlign: 'center', fontWeight: 'bold' }}>❌ Hatalı Sıralama! Yeniden deneyin.</div>}
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

// ----------------------------------------------------
// GAME 5: SYNONYM MATCH (Eş Anlam Eşleştirme)
// ----------------------------------------------------
// ----------------------------------------------------
// GAME 5: SYNONYM MATCH (Eş Anlam Eşleştirme)
// ----------------------------------------------------
const SynonymGame = ({ vocab, awardPetXp }) => {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    setSelectedOpt(null);
    setShowFeedback(false);
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const wrongs = vocab.filter(v => v.synonym !== correct.synonym).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    setCurrent(correct);
  };

  useEffect(() => { loadQuestion(); }, [vocab]);

  const handleSelect = (opt) => {
    if (showFeedback) return;
    setSelectedOpt(opt);
    setShowFeedback(true);
    
    const isCorrect = opt.synonym === current.synonym;
    if (isCorrect) {
      setScore(s => s + 1);
      awardPetXp(10);
    }
    
    setTimeout(() => {
      loadQuestion();
    }, 1500);
  };

  const getBtnStyle = (opt) => {
    if (!showFeedback) {
      return { padding: '14px 10px', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', cursor: 'pointer' };
    }
    const isCorrect = opt.synonym === current.synonym;
    const isSelected = selectedOpt && selectedOpt.synonym === opt.synonym;
    if (isCorrect) {
      return {
        padding: '14px 10px',
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
        padding: '14px 10px',
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
      padding: '14px 10px',
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
        <div style={{ fontSize: '0.78rem', color: '#a855f7', fontWeight: 'bold' }}>🔗 EŞ ANLAMLI KELİME BULMA</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      {current && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelimemiz:</div>
          <div style={{ fontSize: '1.5rem', color: '#c084fc', fontWeight: '900' }}>{current.english.toUpperCase()}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {options.map((opt, idx) => (
          <button key={idx} onClick={() => handleSelect(opt)} className="btn-secondary" style={getBtnStyle(opt)} disabled={showFeedback}>
            {opt.synonym}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: selectedOpt?.synonym === current.synonym ? '#34d399' : '#f87171',
          padding: '8px',
          borderRadius: '10px',
          background: selectedOpt?.synonym === current.synonym ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }}>
          {selectedOpt?.synonym === current.synonym 
            ? '✔️ Doğru! +10 XP' 
            : `❌ Yanlış! Doğru cevap: "${current.synonym}"`}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// GAME 6: ANTONYM MATCH (Zıt Anlam Eşleştirme)
// ----------------------------------------------------
const AntonymGame = ({ vocab, awardPetXp }) => {
  const [current, setCurrent] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    setSelectedOpt(null);
    setShowFeedback(false);
    const correct = vocab[Math.floor(Math.random() * vocab.length)];
    const wrongs = vocab.filter(v => v.antonym !== correct.antonym).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...wrongs].sort(() => 0.5 - Math.random()));
    setCurrent(correct);
  };

  useEffect(() => { loadQuestion(); }, [vocab]);

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

  const getBtnStyle = (opt) => {
    if (!showFeedback) {
      return { padding: '14px 10px', fontSize: '0.8rem', fontWeight: 'bold', transition: 'all 0.2s', cursor: 'pointer' };
    }
    const isCorrect = opt.antonym === current.antonym;
    const isSelected = selectedOpt && selectedOpt.antonym === opt.antonym;
    if (isCorrect) {
      return {
        padding: '14px 10px',
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
        padding: '14px 10px',
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
      padding: '14px 10px',
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
            {opt.antonym}
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

// ----------------------------------------------------
// GAME 7: TRUE/FALSE TRANSLATION (Hızlı Çeviri)
// ----------------------------------------------------
const TrueFalseGame = ({ vocab, awardPetXp }) => {
  const [englishWord, setEnglishWord] = useState('');
  const [displayedTr, setDisplayedTr] = useState('');
  const [isCorrectPair, setIsCorrectPair] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    setSelectedAns(null);
    setShowFeedback(false);
    const item = vocab[Math.floor(Math.random() * vocab.length)];
    setEnglishWord(item.english);
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
    }
    
    setTimeout(() => {
      loadQuestion();
    }, 1500);
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
        <div style={{
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: selectedAns === isCorrectPair ? '#34d399' : '#f87171',
          padding: '8px',
          borderRadius: '10px',
          background: selectedAns === isCorrectPair ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }}>
          {selectedAns === isCorrectPair ? '✔️ Doğru Cevap! +5 XP' : '❌ Yanlış cevap!'}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// GAME 8: WORD TYPE BOXER (Kelime Türü Sınıflandırma)
// ----------------------------------------------------
const WordTypeGame = ({ vocab, awardPetXp }) => {
  const [current, setCurrent] = useState(null);
  const [score, setScore] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const loadQuestion = () => {
    setSelectedType(null);
    setShowFeedback(false);
    setCurrent(vocab[Math.floor(Math.random() * vocab.length)]);
  };

  useEffect(() => { loadQuestion(); }, [vocab]);

  const handleClassify = (type) => {
    if (showFeedback) return;
    setSelectedType(type);
    setShowFeedback(true);
    
    const isCorrect = type === current.type;
    if (isCorrect) {
      setScore(s => s + 1);
      awardPetXp(10);
    }
    
    setTimeout(() => {
      loadQuestion();
    }, 1500);
  };

  const getBtnStyle = (t) => {
    if (!showFeedback) {
      return { padding: '12px', fontWeight: 'bold', cursor: 'pointer' };
    }
    const isCorrect = t === current.type;
    const isSelected = selectedType === t;
    
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
        <div style={{ fontSize: '0.78rem', color: '#84cc16', fontWeight: 'bold' }}>📦 KELİME TÜRÜ SINIFLANDIRICI</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      {current && (
        <div style={{ textAlign: 'center', padding: '14px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Bu kelimenin türü (Part of Speech) nedir?</div>
          <div style={{ fontSize: '1.6rem', color: '#a3e635', fontWeight: '900' }}>{current.english}</div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {['Noun', 'Verb', 'Adjective', 'Adverb'].map(t => (
          <button key={t} onClick={() => handleClassify(t)} className="btn-secondary" style={getBtnStyle(t)} disabled={showFeedback}>
            {t}
          </button>
        ))}
      </div>
      {showFeedback && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: selectedType === current.type ? '#34d399' : '#f87171',
          padding: '8px',
          borderRadius: '10px',
          background: selectedType === current.type ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'
        }}>
          {selectedType === current.type 
            ? `✔️ Doğru! "${current.english}" bir ${current.type}. +10 XP` 
            : `❌ Yanlış! Doğru cevap: "${current.english}" bir ${current.type} olmalıydı.`}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// GAME 9: CLOZE GAME (Cümle Doldurma)
// ----------------------------------------------------
const ClozeGame = ({ vocab, awardPetXp }) => {
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
      awardPetXp(15);
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
        <div style={{ fontSize: '0.78rem', color: '#f59e0b', fontWeight: 'bold' }}>📝 CÜMLE BOŞLUK DOLDURMA</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Skor: {score}</div>
      </div>
      {current && (
        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', lineHeight: 1.6 }}>
          {current.sentence}
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
            ? '✔️ Doğru! +15 XP' 
            : `❌ Yanlış! Doğru kelime: "${current.english}"`}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------
// GAME 10: DEFINITION GAME (Tanım Bulmaca)
// ----------------------------------------------------
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
        <div style={{ padding: '14px', background: 'rgba(0,0,0,0.15)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)', lineHeight: 1.6, fontStyle: 'italic', color: '#cbd5e1' }}>
          "{current.definition}"
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

export default GamesSection;
