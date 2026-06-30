import React, { useState, useEffect } from 'react';
import { Trophy, Play, Heart, Star, ArrowLeft, Gamepad, Award, Flame } from 'lucide-react';

const FALLBACK_WORDS = [
  { english: "mitigate", turkish: "hafifletmek, azaltmak", synonym: "alleviate", antonym: "aggravate" },
  { english: "assess", turkish: "değerlendirmek", synonym: "evaluate", antonym: "ignore" },
  { english: "implement", turkish: "uygulamak", synonym: "execute", antonym: "neglect" },
  { english: "adversary", turkish: "rakip, düşman", synonym: "opponent", antonym: "ally" },
  { english: "comprise", turkish: "içermek, kapsamak", synonym: "include", antonym: "exclude" },
  { english: "empirical", turkish: "deneysel, ampirik", synonym: "experimental", antonym: "theoretical" },
  { english: "ambiguous", turkish: "belirsiz, muğlak", synonym: "unclear", antonym: "clear" },
  { english: "fluctuate", turkish: "dalgalanmak", synonym: "oscillate", antonym: "stabilize" },
  { english: "incentive", turkish: "teşvik, özendirme", synonym: "motivation", antonym: "deterrent" },
  { english: "scrutinize", turkish: "dikkatle incelemek", synonym: "examine", antonym: "glance" }
];

const PREPOSITION_QUESTIONS = [
  { sentence: "The results depend _____ the sample size.", options: ["on", "at", "to", "in"], answer: "on" },
  { sentence: "They succeeded _____ finding a cure.", options: ["in", "on", "at", "by"], answer: "in" },
  { sentence: "He is responsible _____ the department.", options: ["for", "to", "with", "about"], answer: "for" },
  { sentence: "The rise is associated _____ temperature changes.", options: ["with", "about", "for", "in"], answer: "with" },
  { sentence: "Prevent the cells _____ mutating further.", options: ["from", "to", "against", "with"], answer: "from" }
];

const CONJUNCTION_QUESTIONS = [
  { sentence: "_____ the weather was cold, we went out.", options: ["Although", "Because", "Despite", "In order to"], answer: "Although" },
  { sentence: "The project was delayed _____ funding issues.", options: ["because of", "although", "but", "in spite of"], answer: "because of" },
  { sentence: "She studied hard _____ she could pass YÖKDİL.", options: ["so that", "because of", "although", "despite"], answer: "so that" },
  { sentence: "They continued their study _____ the extreme heat.", options: ["despite", "although", "because", "due to"], answer: "despite" },
  { sentence: "We need to act quickly _____ prevent degradation.", options: ["in order to", "although", "because of", "as a result"], answer: "in order to" }
];

const SENTENCE_TEMPLATES = [
  { en: "Photosynthesis converts solar energy into chemical energy.", tr: "Fotosentez güneş enerjisini kimyasal enerjiye dönüştürür." },
  { en: "Deforestation represents a severe threat to biodiversity.", tr: "Ormansızlaşma biyoçeşitliliğe ciddi bir tehdit oluşturur." },
  { en: "Insulin regulates the amount of glucose in blood.", tr: "İnsülin kandaki glikoz miktarını düzenler." },
  { en: "Agricultural workers migrated to rapidly growing industrial cities.", tr: "Tarım işçileri hızla büyüyen sanayi şehirlerine göç etti." },
  { en: "The research team evaluated these fundamental scientific parameters.", tr: "Araştırma ekibi bu temel bilimsel parametreleri değerlendirdi." }
];

const MinigamesSection = ({
  activeTab,
  notebook,
  playSpeechAudio,
  incrementDailyQuestions,
  playCorrectSound,
  playIncorrectSound,
  logStudyActivity
}) => {
  const [activeGame, setActiveGame] = useState(null);

  // General Pool
  const getPool = () => {
    const userPool = notebook || [];
    return userPool.length >= 5 ? userPool : FALLBACK_WORDS;
  };

  // Shared Stats
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [gameTimeLimit, setGameTimeLimit] = useState(30); // 15, 30, 60, 90 or 'infinite'

  // --- GAME 1: DUEL STATE & LOGIC ---
  const [duelSelectedEng, setDuelSelectedEng] = useState(null);
  const [duelSelectedTr, setDuelSelectedTr] = useState(null);
  const [duelCompletedPairs, setDuelCompletedPairs] = useState([]);
  const [duelEngList, setDuelEngList] = useState([]);
  const [duelTrList, setDuelTrList] = useState([]);

  // --- GAME 2: TOWER STATE & LOGIC ---
  const [fallingWord, setFallingWord] = useState(null);
  const [fallProgress, setFallProgress] = useState(0);
  const [towerOptions, setTowerOptions] = useState([]);

  // --- GAME 3: SPEED SPELLER STATE & LOGIC ---
  const [spellTarget, setSpellTarget] = useState(null);
  const [spellInput, setSpellInput] = useState("");

  // --- GAME 4: SENTENCE PUZZLE STATE & LOGIC ---
  const [puzzleTarget, setPuzzleTarget] = useState(null);
  const [puzzleWords, setPuzzleWords] = useState([]);
  const [puzzleSelected, setPuzzleSelected] = useState([]);

  // --- GAME 5: BALLOONS STATE & LOGIC ---
  const [balloonTarget, setBalloonTarget] = useState(null);
  const [balloonOptions, setBalloonOptions] = useState([]);

  // --- GAME 6: PREPOSITION SNIPER STATE & LOGIC ---
  const [prepTarget, setPrepTarget] = useState(null);

  // --- GAME 7: SYNONYM SWAPPER STATE & LOGIC ---
  const [synTarget, setSynTarget] = useState(null);
  const [synOptions, setSynOptions] = useState([]);

  // --- GAME 8: ANTONYM MATCH STATE & LOGIC ---
  const [antTarget, setAntTarget] = useState(null);
  const [antOptions, setAntOptions] = useState([]);

  // --- GAME 9: DICTATION RUN STATE & LOGIC ---
  const [dictTarget, setDictTarget] = useState(null);
  const [dictInput, setDictInput] = useState("");

  // --- GAME 10: CONJUNCTION MAZE STATE & LOGIC ---
  const [conjTarget, setConjTarget] = useState(null);

  // --- GAME 11: PRONUNCIATION COACH STATE & LOGIC ---
  const [pronounceTarget, setPronounceTarget] = useState(null);
  const [spokenWords, setSpokenWords] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState("");

  // General 1-second interval timer
  useEffect(() => {
    let t = null;
    if (gameActive && gameTimeLimit !== 'infinite' && time > 0) {
      t = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            setGameActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [gameActive, time, gameTimeLimit]);

  // Tower physics timer loop
  useEffect(() => {
    let loop = null;
    if (activeGame === 'tower' && gameActive && fallingWord) {
      loop = setInterval(() => {
        setFallProgress(p => {
          if (p >= 100) {
            if (playIncorrectSound) playIncorrectSound();
            setLives(l => {
              if (l <= 1) {
                setGameActive(false);
                return 0;
              }
              return l - 1;
            });
            spawnTowerWord();
            return 0;
          }
          return p + 1.5;
        });
      }, 80);
    }
    return () => clearInterval(loop);
  }, [activeGame, gameActive, fallingWord]);

  if (activeTab !== 'minigames') return null;

  // --- LAUNCH GAME HANDLERS ---

  const handleStartGame = (gameKey) => {
    setActiveGame(gameKey);
    setScore(0);
    setLives(3);
    if (gameTimeLimit === 'infinite') {
      setTime(9999);
    } else {
      setTime(gameTimeLimit);
    }
    setGameActive(true);
    if (logStudyActivity) {
      logStudyActivity('games', 1);
    }

    if (gameKey === 'duel') {
      const pool = getPool();
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
      setDuelEngList(shuffled.map(w => ({ id: w.english, val: w.english })).sort(() => 0.5 - Math.random()));
      setDuelTrList(shuffled.map(w => ({ id: w.english, val: w.turkish })).sort(() => 0.5 - Math.random()));
      setDuelCompletedPairs([]);
      setDuelSelectedEng(null);
      setDuelSelectedTr(null);
    } else if (gameKey === 'tower') {
      spawnTowerWord();
    } else if (gameKey === 'speller') {
      spawnSpellerWord();
    } else if (gameKey === 'sentence') {
      spawnSentencePuzzle();
    } else if (gameKey === 'balloons') {
      spawnBalloons();
    } else if (gameKey === 'preposition') {
      spawnPreposition();
    } else if (gameKey === 'synonym') {
      spawnSynonym();
    } else if (gameKey === 'antonym') {
      spawnAntonym();
    } else if (gameKey === 'dictation') {
      spawnDictation();
    } else if (gameKey === 'conjunction') {
      spawnConjunction();
    } else if (gameKey === 'pronounce') {
      spawnPronunciation();
    }
  };

  // --- SPAWNING & GAME SPECIFIC LOGICS ---

  // Game 2: Tower Spawner
  const spawnTowerWord = () => {
    const pool = getPool();
    const target = pool[Math.floor(Math.random() * pool.length)];
    const incorrects = pool.filter(w => w.english !== target.english).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.turkish);
    setFallingWord(target);
    setTowerOptions([target.turkish, ...incorrects].sort(() => 0.5 - Math.random()));
    setFallProgress(0);
  };

  // Game 3: Speed Speller Spawner
  const spawnSpellerWord = () => {
    const pool = getPool();
    const target = pool[Math.floor(Math.random() * pool.length)];
    setSpellTarget(target);
    setSpellInput("");
    if (playSpeechAudio) playSpeechAudio(target.english);
  };

  // Game 4: Sentence Puzzle Spawner
  const spawnSentencePuzzle = () => {
    const target = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
    setPuzzleTarget(target);
    const cleanedWords = target.en.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).filter(Boolean);
    setPuzzleWords(cleanedWords.sort(() => 0.5 - Math.random()));
    setPuzzleSelected([]);
  };

  // Game 5: Balloons Spawner
  const spawnBalloons = () => {
    const pool = getPool();
    const target = pool[Math.floor(Math.random() * pool.length)];
    const incorrects = pool.filter(w => w.english !== target.english).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.turkish);
    setBalloonTarget(target);
    setBalloonOptions([target.turkish, ...incorrects].sort(() => 0.5 - Math.random()));
  };

  // Game 6: Preposition Spawner
  const spawnPreposition = () => {
    const target = PREPOSITION_QUESTIONS[Math.floor(Math.random() * PREPOSITION_QUESTIONS.length)];
    setPrepTarget(target);
  };

  // Game 7: Synonym Spawner
  const spawnSynonym = () => {
    const pool = getPool().filter(w => w.synonym);
    const usePool = pool.length > 0 ? pool : FALLBACK_WORDS;
    const target = usePool[Math.floor(Math.random() * usePool.length)];
    const incorrects = usePool.filter(w => w.english !== target.english).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.synonym || w.turkish);
    setSynTarget(target);
    setSynOptions([target.synonym || "alleviate", ...incorrects].sort(() => 0.5 - Math.random()));
  };

  // Game 8: Antonym Spawner
  const spawnAntonym = () => {
    const pool = getPool().filter(w => w.antonym);
    const usePool = pool.length > 0 ? pool : FALLBACK_WORDS;
    const target = usePool[Math.floor(Math.random() * usePool.length)];
    const incorrects = usePool.filter(w => w.english !== target.english).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.antonym || w.turkish);
    setAntTarget(target);
    setAntOptions([target.antonym || "aggravate", ...incorrects].sort(() => 0.5 - Math.random()));
  };

  // Game 9: Dictation Spawner
  const spawnDictation = () => {
    const target = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
    setDictTarget(target);
    setDictInput("");
    if (playSpeechAudio) playSpeechAudio(target.en);
  };

  // Game 10: Conjunction Spawner
  const spawnConjunction = () => {
    const target = CONJUNCTION_QUESTIONS[Math.floor(Math.random() * CONJUNCTION_QUESTIONS.length)];
    setConjTarget(target);
  };

  // Game 11: Pronunciation Spawner & Speech Recognition
  const spawnPronunciation = () => {
    const target = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
    setPronounceTarget(target);
    setSpokenWords([]);
    setSpeechText("");
  };

  const startPronounceListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSpeechText(text);
      
      const targetWordsArray = pronounceTarget.en.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
      const spokenWordsArray = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
      
      setSpokenWords(spokenWordsArray);

      const matches = targetWordsArray.filter(w => spokenWordsArray.includes(w));
      const accuracy = (matches.length / targetWordsArray.length) * 100;

      if (accuracy >= 70) {
        if (typeof playCorrectSound === 'function') playCorrectSound();
        setScore(s => s + 10);
        if (incrementDailyQuestions) incrementDailyQuestions();
        setTimeout(() => {
          spawnPronunciation();
        }, 2000);
      } else {
        if (typeof playIncorrectSound === 'function') playIncorrectSound();
        setLives(l => {
          if (l <= 1) {
            setGameActive(false);
            return 0;
          }
          return l - 1;
        });
        setTimeout(() => {
          spawnPronunciation();
        }, 2000);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- USER ACTION CHECKERS ---

  // Game 1 Matcher
  const matchDuelPair = (type, id) => {
    if (type === 'eng') {
      setDuelSelectedEng(id);
      if (duelSelectedTr) {
        if (duelSelectedTr === id) {
          setDuelCompletedPairs(p => [...p, id]);
          setScore(s => s + 10);
          setDuelSelectedEng(null);
          setDuelSelectedTr(null);
          if (playCorrectSound) playCorrectSound();
        } else {
          if (playIncorrectSound) playIncorrectSound();
          setTimeout(() => {
            setDuelSelectedEng(null);
            setDuelSelectedTr(null);
          }, 300);
        }
      }
    } else {
      setDuelSelectedTr(id);
      if (duelSelectedEng) {
        if (duelSelectedEng === id) {
          setDuelCompletedPairs(p => [...p, id]);
          setScore(s => s + 10);
          setDuelSelectedEng(null);
          setDuelSelectedTr(null);
          if (playCorrectSound) playCorrectSound();
        } else {
          if (playIncorrectSound) playIncorrectSound();
          setTimeout(() => {
            setDuelSelectedEng(null);
            setDuelSelectedTr(null);
          }, 300);
        }
      }
    }
  };

  // Game 3 Checker
  const checkSpeller = (e) => {
    e.preventDefault();
    if (spellInput.trim().toLowerCase() === spellTarget.english.toLowerCase()) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 10);
      spawnSpellerWord();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnSpellerWord();
    }
  };

  // Game 4 Unscrambler Word Select
  const handlePuzzleWordClick = (w, idx) => {
    if (puzzleSelected.includes(idx)) {
      setPuzzleSelected(puzzleSelected.filter(i => i !== idx));
    } else {
      const nextSel = [...puzzleSelected, idx];
      setPuzzleSelected(nextSel);

      if (nextSel.length === puzzleWords.length) {
        const constructed = nextSel.map(i => puzzleWords[i]).join(" ").toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        const targetClean = puzzleTarget.en.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
        
        if (constructed === targetClean) {
          if (typeof playCorrectSound === 'function') playCorrectSound();
          setScore(s => s + 20);
          if (incrementDailyQuestions) incrementDailyQuestions();
          spawnSentencePuzzle();
        } else {
          if (typeof playIncorrectSound === 'function') playIncorrectSound();
          setLives(l => {
            if (l <= 1) {
              setGameActive(false);
              return 0;
            }
            return l - 1;
          });
          setPuzzleSelected([]); // Reset on mistake
        }
      }
    }
  };

  // Game 5 Pop Balloon
  const handlePopBalloon = (opt) => {
    if (opt === balloonTarget.turkish) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 10);
      spawnBalloons();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnBalloons();
    }
  };

  // Game 6 Preposition Gun
  const handlePrepositionGun = (opt) => {
    if (opt === prepTarget.answer) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 10);
      spawnPreposition();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnPreposition();
    }
  };

  // Game 7 Synonym Solver
  const handleSynonymAnswer = (opt) => {
    if (opt === synTarget.synonym) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 10);
      spawnSynonym();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnSynonym();
    }
  };

  // Game 8 Antonym Solver
  const handleAntonymAnswer = (opt) => {
    if (opt === antTarget.antonym) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 10);
      spawnAntonym();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnAntonym();
    }
  };

  // Game 9 Dictation Runner
  const handleDictationCheck = (e) => {
    e.preventDefault();
    if (dictInput.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") === dictTarget.en.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 20);
      spawnDictation();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnDictation();
    }
  };

  // Game 10 Conjunction Maze
  const handleConjunctionMaze = (opt) => {
    if (opt === conjTarget.answer) {
      if (playCorrectSound) playCorrectSound();
      setScore(s => s + 10);
      spawnConjunction();
    } else {
      if (playIncorrectSound) playIncorrectSound();
      setLives(l => {
        if (l <= 1) {
          setGameActive(false);
          return 0;
        }
        return l - 1;
      });
      spawnConjunction();
    }
  };

  // --- RENDER GAME OPTIONS ---

  const GAMES_LIST = [
    { key: "duel", title: "Kelime Düellosu ⚡", desc: "Zamana karşı kelimeleri eşleştirin." },
    { key: "tower", title: "Kelime Kulesi 🧱", desc: "Düşen kelimeleri en alta çarpmadan önce patlatın." },
    { key: "speller", title: "Hızlı Yazıcı ✍️", desc: "Seslendirilen kelimeleri hızlıca klavyeden girin." },
    { key: "sentence", title: "Cümle Kurucu 🧩", desc: "Kelimeleri sürükleyip doğru cümle kurun." },
    { key: "balloons", title: "Kelime Balonları 🎈", desc: "Karşılık gelen balonları patlatın." },
    { key: "preposition", title: "Edat Keskin Nişancısı 🎯", desc: "Doğru edat balonunu vurup cümleyi tamamlayın." },
    { key: "synonym", title: "Eşanlamlı Değişimi 🔄", desc: "Metindeki kelimenin eşanlamlısını seçin." },
    { key: "antonym", title: "Zıt Anlam Avı ❌", desc: "Karşıt kelimeyi eşleştirip yok edin." },
    { key: "dictation", title: "Dikte Koşusu 📻", desc: "Duyduğunuz cümleyi hızlıca girin." },
    { key: "conjunction", title: "Bağlaç Labirenti 🧐", desc: "Yan cümleleri bağlayacak doğru bağlacı seçin." },
    { key: "pronounce", title: "Telaffuz Antrenörü 🎙️", desc: "Cümleyi mikrofona okuyun, doğruluğu puanlansın." }
  ];

  return (
    <div className="space-y-6 text-left" style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Gamepad className="h-6 w-6 text-indigo-400" /> Oyun Parkı (11 Minigames) 🎮
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            YÖKDİL sınavına özel 11 farklı eğitsel mini oyunla çalışın.
          </p>
        </div>
        {!activeGame ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>⏱️ Süre Sınırı:</span>
            <select
              value={gameTimeLimit}
              onChange={(e) => {
                const val = e.target.value;
                setGameTimeLimit(val === 'infinite' ? 'infinite' : Number(val));
              }}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 'bold',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={15}>15 sn (Hızlı)</option>
              <option value={30}>30 sn (Standart)</option>
              <option value={60}>60 sn (Rahat)</option>
              <option value={90}>90 sn (Kolay)</option>
              <option value="infinite">Süresiz ♾️</option>
            </select>
          </div>
        ) : (
          <button
            onClick={() => setActiveGame(null)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Geri Dön
          </button>
        )}
      </div>

      {!activeGame ? (
        /* GAME SELECTION DASHBOARD GRID (10 CARDS) */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {GAMES_LIST.map(game => (
            <div 
              key={game.key}
              className="glass-card flex flex-col justify-between hover:scale-[1.02] transition-all"
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                background: 'rgba(11, 15, 26, 0.6)',
                cursor: 'pointer',
                gap: '12px'
              }}
              onClick={() => handleStartGame(game.key)}
            >
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white', margin: 0 }}>{game.title}</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>{game.desc}</p>
              </div>
              <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.68rem', width: 'fit-content' }}>
                Başlat <Play className="h-3 w-3 inline ml-1 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* GAME RUNNING LAYOUT */
        <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-6" style={{ background: 'rgba(11, 15, 26, 0.6)' }}>
          
          {/* Header info bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white', margin: 0 }}>
              {GAMES_LIST.find(g => g.key === activeGame)?.title}
            </h3>
            {gameActive && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '4px 10px', borderRadius: '8px', color: '#f87171', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart className="h-3 w-3 fill-current" /> {lives} Can
                </div>
                <div style={{ background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.2)', padding: '4px 10px', borderRadius: '8px', color: '#fb923c', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame className="h-3 w-3" /> {gameTimeLimit === 'infinite' ? 'Süresiz ♾️' : `${time} sn`}
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '4px 10px', borderRadius: '8px', color: '#34d399', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star className="h-3 w-3 fill-current" /> {score} Puan
                </div>
              </div>
            )}
          </div>

          {!gameActive ? (
            /* GAME OVER / RESULTS VIEW */
            <div className="text-center py-8 space-y-4">
              <Award className="h-14 w-14 text-yellow-400 mx-auto" />
              <h4 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'white' }}>Oyun Sona Erdi!</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Kazanılan Toplam Skor: <strong>{score} Puan</strong></p>
              <button
                onClick={() => handleStartGame(activeGame)}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Yeniden Oyna 🔄
              </button>
            </div>
          ) : (
            /* ACTIVE GAME VIEWS (1 to 10) */
            (() => {
              switch (activeGame) {
                case 'duel':
                  return (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#a5b4fc', textTransform: 'uppercase' }}>İngilizce</div>
                        {duelEngList.map(card => {
                          const isMatched = duelCompletedPairs.includes(card.id);
                          const isSelected = duelSelectedEng === card.id;
                          if (isMatched) return null;
                          return (
                            <button 
                              key={card.id} 
                              onClick={() => matchDuelPair('eng', card.id)} 
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)',
                                border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
                                color: isSelected ? '#a5b4fc' : '#cbd5e1',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {card.val}
                            </button>
                          );
                        })}
                      </div>
                      <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase' }}>Türkçe</div>
                        {duelTrList.map(card => {
                          const isMatched = duelCompletedPairs.includes(card.id);
                          const isSelected = duelSelectedTr === card.id;
                          if (isMatched) return null;
                          return (
                            <button 
                              key={card.id} 
                              onClick={() => matchDuelPair('tr', card.id)} 
                              style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: isSelected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                                border: isSelected ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
                                color: isSelected ? '#fcd34d' : '#cbd5e1',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {card.val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );

                case 'tower':
                  return (
                    <div className="space-y-6">
                      <div style={{ height: '220px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                        {fallingWord && (
                          <div style={{ position: 'absolute', left: '50%', top: `${fallProgress}%`, transform: 'translateX(-50%) translateY(-50%)', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '8px 20px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '800', color: 'white', whiteSpace: 'nowrap' }}>
                            {fallingWord.english}
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: '#ef4444' }}></div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                        {towerOptions.map((opt, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleTowerAnswer(opt)} 
                            style={{
                              width: '100%',
                              padding: '14px 18px',
                              borderRadius: '14px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#cbd5e1',
                              fontWeight: '700',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'speller':
                  return (
                    <form onSubmit={checkSpeller} className="space-y-4 max-w-sm mx-auto text-center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                        <button type="button" onClick={() => playSpeechAudio && playSpeechAudio(spellTarget.english)} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', color: '#a5b4fc', borderStyle: 'solid' }} title="Normal Hız">
                          🔊 Normal
                        </button>
                        <button type="button" onClick={() => playSpeechAudio && playSpeechAudio(spellTarget.english, 0.5)} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', color: '#fbbf24', borderStyle: 'solid' }} title="Yavaş Hız">
                          🐢 Yavaş
                        </button>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Duyduğunuz kelimeyi aşağıdaki kutuya doğru harflerle yazın.</p>
                      <input 
                        type="text" 
                        value={spellInput} 
                        onChange={(e) => setSpellInput(e.target.value)} 
                        placeholder="Kelimeleri yazın..." 
                        autoFocus
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', textAlign: 'center', outline: 'none' }}
                      />
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}>Cevapla</button>
                    </form>
                  );

                case 'sentence':
                  return (
                    <div className="space-y-6">
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Türkçe Çeviri: <strong>{puzzleTarget?.tr}</strong></p>
                      
                      {/* Active word slots */}
                      <div style={{ minHeight: '60px', padding: '12px', background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {puzzleSelected.map(idx => (
                          <span key={idx} className="px-3 py-1.5 rounded bg-indigo-600 text-white font-bold text-xs">
                            {puzzleWords[idx]}
                          </span>
                        ))}
                      </div>

                      {/* Scrambled selection list */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {puzzleWords.map((word, idx) => {
                          const isSel = puzzleSelected.includes(idx);
                          return (
                            <button
                              key={idx}
                              onClick={() => handlePuzzleWordClick(word, idx)}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                background: isSel ? 'transparent' : 'rgba(255,255,255,0.04)',
                                border: isSel ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)',
                                color: isSel ? '#475569' : '#cbd5e1',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                cursor: isSel ? 'default' : 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: isSel ? 0.35 : 1
                              }}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );

                case 'balloons':
                  return (
                    <div className="space-y-6">
                      <div className="text-center py-4 bg-indigo-900/10 border border-indigo-500/10 rounded-xl">
                        <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase' }}>Hedef Kelime</span>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white', margin: '4px 0 0 0' }}>{balloonTarget?.english}</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {balloonOptions.map((opt, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handlePopBalloon(opt)} 
                            style={{
                              width: '100%',
                              padding: '14px 18px',
                              borderRadius: '14px',
                              background: 'rgba(99, 102, 241, 0.05)',
                              border: '1px solid rgba(99, 102, 241, 0.25)',
                              color: '#cbd5e1',
                              fontWeight: '700',
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                          >
                            🎈 {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'preposition':
                  return (
                    <div className="space-y-6">
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>{prepTarget?.sentence}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {prepTarget?.options.map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => handlePrepositionGun(opt)} 
                            style={{
                              width: '100%',
                              padding: '12px 18px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#cbd5e1',
                              fontWeight: '700',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            🎯 {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'synonym':
                  return (
                    <div className="space-y-6">
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc' }}>Eşanlamlısını Bul</span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'white', margin: '4px 0 0 0' }}>"{synTarget?.english}"</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {synOptions.map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => handleSynonymAnswer(opt)} 
                            style={{
                              width: '100%',
                              padding: '12px 18px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#cbd5e1',
                              fontWeight: '700',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            🔄 {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'antonym':
                  return (
                    <div className="space-y-6">
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc' }}>Zıt Anlamlısını Bul</span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: 'white', margin: '4px 0 0 0' }}>"{antTarget?.english}"</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        {antOptions.map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => handleAntonymAnswer(opt)} 
                            style={{
                              width: '100%',
                              padding: '12px 18px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#cbd5e1',
                              fontWeight: '700',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            ❌ {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'dictation':
                  return (
                    <form onSubmit={handleDictationCheck} className="space-y-4 max-w-sm mx-auto text-center">
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '8px' }}>
                        <button type="button" onClick={() => playSpeechAudio && playSpeechAudio(dictTarget.en)} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', color: '#a5b4fc', borderStyle: 'solid' }} title="Normal Hız">
                          🔊 Normal
                        </button>
                        <button type="button" onClick={() => playSpeechAudio && playSpeechAudio(dictTarget.en, 0.5)} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.9rem', color: '#fbbf24', borderStyle: 'solid' }} title="Yavaş Hız">
                          🐢 Yavaş
                        </button>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Duyduğunuz cümleyi noktalamalara dikkat ederek yazın.</p>
                      <textarea 
                        value={dictInput} 
                        onChange={(e) => setDictInput(e.target.value)} 
                        placeholder="Cümleyi yazın..." 
                        rows={3}
                        autoFocus
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none' }}
                      />
                      <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}>Cevapla</button>
                    </form>
                  );

                case 'conjunction':
                  return (
                    <div className="space-y-6">
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: '1.1rem', color: 'white', margin: 0 }}>{conjTarget?.sentence}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {conjTarget?.options.map(opt => (
                          <button 
                            key={opt} 
                            onClick={() => handleConjunctionMaze(opt)} 
                            style={{
                              width: '100%',
                              padding: '12px 18px',
                              borderRadius: '12px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#cbd5e1',
                              fontWeight: '700',
                              fontSize: '0.76rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            🧐 {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );

                case 'pronounce':
                  return (
                    <div className="space-y-6 text-center">
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Bu Cümleyi Sesli Okuyun</span>
                        
                        <div style={{ fontSize: '1.2rem', color: 'white', lineHeight: '1.6', fontWeight: '600' }}>
                          {pronounceTarget?.en.split(/\s+/).map((word, idx) => {
                            const clean = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                            const isMatch = spokenWords.includes(clean);
                            const color = spokenWords.length > 0 ? (isMatch ? '#34d399' : '#f87171') : 'white';
                            return (
                              <span key={idx} style={{ color, marginRight: '6px', transition: 'color 0.3s ease' }}>
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={startPronounceListening}
                          disabled={isListening}
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                            border: `2px solid ${isListening ? '#ef4444' : '#6366f1'}`,
                            color: isListening ? '#f87171' : '#a5b4fc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                        >
                          <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                        </button>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                          {isListening ? 'Dinleniyor... Şimdi konuşun!' : 'Mikrofonu Aç ve Oku'}
                        </span>
                      </div>

                      {speechText && (
                        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', maxWidth: '400px', margin: '0 auto' }}>
                          <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Algılanan Ses</div>
                          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '4px 0 0 0', fontStyle: 'italic' }}>"{speechText}"</p>
                        </div>
                      )}
                    </div>
                  );

                default:
                  return null;
              }
            })()
          )}

        </div>
      )}

    </div>
  );
};

export default MinigamesSection;
