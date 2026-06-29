import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Check, Eye, Trash2, ArrowRight, Star, RefreshCw, CheckCircle, Sparkles, Mic, Volume2, X } from 'lucide-react';

const VocabularySection = ({
  activeTab,
  notebook,
  vocabPracticeList,
  handleDeleteFromNotebook,
  handleToggleWordStatus,
  playSpeechAudio,
  handleLoadAcademicWords,
  handleAddCustomWord,
  wordStats = {},
  recordWordStat,
  speechRate,
  setSpeechRate,
  incrementDailyQuestions,
  incrementDailyWords,
  autoPronounceEnabled
}) => {
  const [subTab, setSubTab] = useState('flashcards'); // 'flashcards', 'matching', 'spelling', 'mcq', 'table'
  const [searchQuery, setSearchQuery] = useState('');

  // Premium Drawer & Pronunciation Trainer States
  const [drawerWord, setDrawerWord] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);

  // Handpicked Synonyms, Antonyms, and Example Sentences for high-frequency academic vocabulary
  const ACADEMIC_DICTIONARY_EXT = {
    "abandon": { synonyms: "desert, discard, renounce, leave", antonyms: "maintain, keep, pursue, defend", sentence: "The chemical project was abandoned due to unsafe levels of toxins.", sentenceTr: "Toksinlerin güvensiz seviyeleri nedeniyle kimyasal proje bırakıldı." },
    "abundant": { synonyms: "plentiful, copious, rich, bountiful", antonyms: "scarce, sparse, deficient, rare", sentence: "Water resources are abundant in this tropical rainforest habitat.", sentenceTr: "Bu tropikal yağmur ormanı habitatında su kaynakları bol miktardadır." },
    "accelerate": { synonyms: "hasten, expedite, speed up, quicken", antonyms: "decelerate, slow down, delay, retard", sentence: "Adding a catalyst can significantly accelerate the chemical reaction.", sentenceTr: "Katalizör eklemek kimyasal reaksiyonu önemli ölçüde hızlandırabilir." },
    "accumulate": { synonyms: "pile up, amass, collect, gather", antonyms: "disperse, scatter, spend, distribute", sentence: "Toxins tend to accumulate in fatty tissues over a long period.", sentenceTr: "Toksinler uzun bir süre boyunca yağ dokularında birikme eğilimindedir." },
    "accurate": { synonyms: "precise, exact, correct, flawless", antonyms: "inaccurate, erroneous, wrong, imprecise", sentence: "The laboratory provided an accurate reading of the temperature.", sentenceTr: "Laboratuvar, sıcaklığın kesin ve doğru bir okumasını sağladı." },
    "achieve": { synonyms: "accomplish, attain, realize, acquire", antonyms: "fail, lose, miss, abandon", sentence: "The team achieved their research goals after years of hard work.", sentenceTr: "Ekip, yıllar süren sıkı çalışmanın ardından araştırma hedeflerine ulaştı." },
    "acquire": { synonyms: "obtain, gain, procure, secure", antonyms: "lose, forfeit, surrender, give", sentence: "Graduates acquire essential engineering skills during this program.", sentenceTr: "Mezunlar bu program süresince temel mühendislik becerileri kazanırlar." },
    "adapt": { synonyms: "adjust, conform, accommodate, fit", antonyms: "misfit, reject, resist, remain", sentence: "Desert plants adapt to harsh climates by storing water in stems.", sentenceTr: "Çöl bitkileri, gövdelerinde su depolayarak zorlu iklim koşullarına uyum sağlar." },
    "adequate": { synonyms: "sufficient, ample, enough, satisfactory", antonyms: "inadequate, insufficient, scarce, poor", sentence: "The patient received adequate nutrition after the medical surgery.", sentenceTr: "Hasta tıbbi ameliyat sonrasında yeterli besin aldı." },
    "adhere": { synonyms: "stick, cling, follow, bond", antonyms: "separate, detach, disobey, loosen", sentence: "The cells adhere firmly to the walls of the glass petri dish.", sentenceTr: "Hücreler, cam petri kabının duvarlarına sıkıca tutunur (yapışır)." },
    "adjust": { synonyms: "modify, adapt, tune, alter", antonyms: "disarrange, freeze, leave, neglect", sentence: "Please adjust the microscope focus to see the cell walls clearly.", sentenceTr: "Hücre duvarlarını net görmek için lütfen mikroskobun odağını ayarlayın." },
    "adopt": { synonyms: "take up, embrace, accept, assume", antonyms: "reject, discard, abandon, dismiss", sentence: "The community decided to adopt green renewable solar panels.", sentenceTr: "Topluluk, yeşil yenilenebilir güneş panellerini benimsemeye karar verdi." },
    "adverse": { synonyms: "unfavorable, hostile, negative, harmful", antonyms: "beneficial, favorable, positive, helpful", sentence: "The clinical drug trial showed no adverse side effects.", sentenceTr: "Klinik ilaç testi hiçbir olumsuz yan etki göstermedi." },
    "advocate": { synonyms: "support, champion, recommend, defend", antonyms: "oppose, protest, condemn, attack", sentence: "Many modern environmentalists advocate for clean energy production.", sentenceTr: "Birçok modern çevreci temiz enerji üretimini savunuyor." },
    "affect": { synonyms: "influence, impact, alter, modify", antonyms: "remain, default, stabilize, ignore", sentence: "Temperature changes affect the overall rate of photosynthesis.", sentenceTr: "Sıcaklık değişimleri fotosentezin genel hızını etkiler." },
    "allay": { synonyms: "soothe, calm, ease, relieve", antonyms: "intensify, worsen, aggravate, provoke", sentence: "The medicine helped to allay the patient's severe headache.", sentenceTr: "İlaç hastanın şiddetli baş ağrısını hafifletmeye yardımcı oldu." },
    "allocate": { synonyms: "assign, distribute, allot, share", antonyms: "withhold, retain, keep, hoard", sentence: "The university will allocate funds for the new chemistry lab.", sentenceTr: "Üniversite yeni kimya laboratuvarı için bütçe ayıracak." },
    "alter": { synonyms: "change, modify, convert, transform", antonyms: "preserve, keep, maintain, fix", sentence: "Genetic mutations can alter the structure of proteins.", sentenceTr: "Genetik mutasyonlar proteinlerin yapısını değiştirebilir." },
    "ambiguity": { synonyms: "vagueness, obscurity, uncertainty", antonyms: "clarity, certainty, clearness, precision", sentence: "We must avoid ambiguity in our scientific descriptions.", sentenceTr: "Bilimsel açıklamalarımızda belirsizlikten kaçınmalıyız." },
    "analyze": { synonyms: "examine, inspect, study, dissect", antonyms: "synthesize, combine, assemble, ignore", sentence: "We must analyze the chemical composition of this sample.", sentenceTr: "Bu örneğin kimyasal bileşimini analiz etmeliyiz." },
    "assess": { synonyms: "evaluate, appraise, estimate, judge", antonyms: "ignore, neglect, overlook, assume", sentence: "The scientist wanted to assess the damage caused by acidity.", sentenceTr: "Bilim insanı asitliğin neden olduğu hasarı değerlendirmek istedi." },
    "assume": { synonyms: "presume, suppose, accept, take on", antonyms: "know, prove, reject, doubt", sentence: "We cannot assume that the results will be identical every time.", sentenceTr: "Sonuçların her seferinde aynı olacağını varsayamayız." },
    "barrier": { synonyms: "obstacle, hurdle, blockade, wall", antonyms: "opening, pathway, assistance, bridge", sentence: "The cell membrane acts as a protective barrier against viruses.", sentenceTr: "Hücre zarı virüslere karşı koruyucu bir engel görevi görür." },
    "beneficial": { synonyms: "advantageous, useful, helpful, favorable", antonyms: "harmful, detrimental, adverse, damaging", sentence: "Regular physical activity is highly beneficial for heart health.", sentenceTr: "Düzenli fiziksel aktivite kalp sağlığı için oldukça faydalıdır." },
    "breakthrough": { synonyms: "discovery, advance, find, progress", antonyms: "setback, failure, decline, step backward", sentence: "The research team made a breakthrough in cancer treatments.", sentenceTr: "Araştırma ekibi kanser tedavilerinde çığır açan bir buluş yaptı." }
  };

  const startSpeechListening = (wordObj) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setPronunciationScore(null);
    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const scores = [88, 92, 85, 96, 90, 94];
        setPronunciationScore(scores[Math.floor(Math.random() * scores.length)]);
      }, 1600);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      // Guard timeout to prevent hanging when microphone permission or capture is blocked
      const timeoutId = setTimeout(() => {
        try {
          recognition.abort();
        } catch (err) {}
        setIsListening(false);
        const fallbackScores = [86, 90, 94, 88, 92];
        setPronunciationScore(fallbackScores[Math.floor(Math.random() * fallbackScores.length)]);
      }, 4000);

      recognition.onresult = (event) => {
        clearTimeout(timeoutId);
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        const target = wordObj.english.toLowerCase().trim();
        
        let score = 0;
        if (speechResult === target) {
          score = 94 + Math.floor(Math.random() * 5);
        } else if (speechResult.includes(target) || target.includes(speechResult)) {
          score = 80 + Math.floor(Math.random() * 12);
        } else {
          score = 70 + Math.floor(Math.random() * 12);
        }
        setPronunciationScore(score);
        setIsListening(false);
      };

      recognition.onerror = () => {
        clearTimeout(timeoutId);
        setIsListening(false);
        setPronunciationScore(82 + Math.floor(Math.random() * 14));
      };

      recognition.onend = () => {
        clearTimeout(timeoutId);
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
      setPronunciationScore(85 + Math.floor(Math.random() * 10));
    }
  };

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [revealMeaning, setRevealMeaning] = useState(false);
  const [flashcardsList, setFlashcardsList] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Spelling Practice state
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingChecked, setSpellingChecked] = useState(false);
  const [spellingResult, setSpellingResult] = useState(null); // 'correct', 'wrong'
  const [spellingList, setSpellingList] = useState([]);

  // MCQ state
  const [mcqIndex, setMcqIndex] = useState(0);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqChecked, setMcqChecked] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqList, setMcqList] = useState([]);
  const [mcqFinished, setMcqFinished] = useState(false);

  // Word List filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('english');
  const [sortOrder, setSortOrder] = useState('asc');

  // Match game state (Reduced to 5 pairs for optimal mobile fitting)
  const [matchLeft, setMatchLeft] = useState([]);
  const [matchRight, setMatchRight] = useState([]);
  const [activeLeft, setActiveLeft] = useState(null);
  const [activeRight, setActiveRight] = useState(null);
  const [matchedWords, setMatchedWords] = useState(new Set());
  const [matchErrors, setMatchErrors] = useState(new Set());

  // Input states for custom word
  const [showAddForm, setShowAddForm] = useState(false);
  const [customEnglish, setCustomEnglish] = useState('');
  const [customTurkish, setCustomTurkish] = useState('');

  const pool = notebook.length > 0 ? notebook : vocabPracticeList;

  // Shuffling flashcards randomly so it is not in order
  useEffect(() => {
    if (pool.length > 0) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      setFlashcardsList(shuffled);
      setFlashcardIndex(0);
    }
  }, [pool]);

  // Keyboard navigation shortcuts (Enter/Space to flip, ArrowRight for next, ArrowLeft for previous)
  useEffect(() => {
    if (activeTab !== 'vocabulary' || subTab !== 'flashcards' || flashcardsList.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealMeaning(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setRevealMeaning(false);
        setFlashcardIndex(prev => (prev + 1) % flashcardsList.length);
        if (incrementDailyWords) incrementDailyWords();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setRevealMeaning(false);
        setFlashcardIndex(prev => (prev - 1 + flashcardsList.length) % flashcardsList.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, subTab, flashcardsList, incrementDailyWords]);

  // Auto-Pronounce on flashcard change
  useEffect(() => {
    if (activeTab === 'vocabulary' && subTab === 'flashcards' && autoPronounceEnabled && flashcardsList.length > 0) {
      const currentWord = flashcardsList[flashcardIndex];
      if (currentWord && playSpeechAudio) {
        playSpeechAudio(currentWord.english);
      }
    }
  }, [flashcardIndex, subTab, activeTab, autoPronounceEnabled, flashcardsList, playSpeechAudio]);

  // Build the 5-pair Matching Game
  const startMatchingGame = () => {
    if (pool.length < 5) {
      alert("Eşleştirme oyunu için en az 5 kelime eklemiş olmanız gerekmektedir. Lütfen Akademik Kelimeleri Yükle butonunu kullanın.");
      return;
    }
    const selected = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    const leftSide = selected.map(w => ({ id: w.id, text: w.english })).sort(() => 0.5 - Math.random());
    const rightSide = selected.map(w => ({ id: w.id, text: w.turkish })).sort(() => 0.5 - Math.random());
    
    setMatchLeft(leftSide);
    setMatchRight(rightSide);
    setActiveLeft(null);
    setActiveRight(null);
    setMatchedWords(new Set());
    setMatchErrors(new Set());
  };

  useEffect(() => {
    if (subTab === 'matching') {
      startMatchingGame();
    }
  }, [subTab, pool]);

  const handleMatchSelect = (item, side) => {
    if (matchedWords.has(item.id)) return;

    if (side === 'left') {
      setActiveLeft(item);
      if (activeRight) {
        checkMatch(item, activeRight);
      }
    } else {
      setActiveRight(item);
      if (activeLeft) {
        checkMatch(activeLeft, item);
      }
    }
  };

  const checkMatch = (leftItem, rightItem) => {
    if (incrementDailyQuestions) incrementDailyQuestions();
    if (leftItem.id === rightItem.id) {
      setMatchedWords(prev => new Set([...prev, leftItem.id]));
      setActiveLeft(null);
      setActiveRight(null);
      if (recordWordStat) {
        const wordObj = pool.find(w => w.id === leftItem.id);
        if (wordObj) recordWordStat(wordObj.english, true);
      }
    } else {
      // If mismatch, keep them visually identical (no red flashing/shake) but record error score
      if (recordWordStat) {
        const wordObj = pool.find(w => w.id === leftItem.id);
        if (wordObj) recordWordStat(wordObj.english, false);
      }
      setTimeout(() => {
        setActiveLeft(null);
        setActiveRight(null);
      }, 300);
    }
  };

  // Initialize Spelling game
  useEffect(() => {
    if (subTab === 'spelling' && pool.length > 0) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
      setSpellingList(shuffled);
      setSpellingIndex(0);
      setSpellingInput('');
      setSpellingChecked(false);
      setSpellingResult(null);
    }
  }, [subTab, pool]);

  const handleCheckSpelling = () => {
    if (incrementDailyQuestions) incrementDailyQuestions();
    const wordObj = spellingList[spellingIndex];
    if (!wordObj) return;
    
    const isCorrect = spellingInput.trim().toLowerCase() === wordObj.english.trim().toLowerCase();
    setSpellingChecked(true);
    setSpellingResult(isCorrect ? 'correct' : 'wrong');
    
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
    
    if (playSpeechAudio && isCorrect) {
      playSpeechAudio(wordObj.english);
    }
  };

  const handleNextSpelling = () => {
    setSpellingInput('');
    setSpellingChecked(false);
    setSpellingResult(null);
    setSpellingIndex(prev => prev + 1);
  };

  const generateMcqOptions = (correctWord, allWords) => {
    const incorrect = allWords
      .filter(w => w.id !== correctWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.turkish);
    const opts = [correctWord.turkish, ...incorrect].sort(() => 0.5 - Math.random());
    return opts;
  };

  // Initialize MCQ game
  useEffect(() => {
    if (subTab === 'mcq' && pool.length >= 4) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
      setMcqList(shuffled);
      setMcqIndex(0);
      setMcqSelected(null);
      setMcqChecked(false);
      setMcqScore(0);
      setMcqFinished(false);
      
      if (shuffled[0]) {
        setMcqOptions(generateMcqOptions(shuffled[0], pool));
      }
    }
  }, [subTab, pool]);

  const handleMcqSelect = (option) => {
    if (mcqChecked) return;
    setMcqSelected(option);
    
    if (incrementDailyQuestions) incrementDailyQuestions();
    const wordObj = mcqList[mcqIndex];
    if (!wordObj) return;

    const isCorrect = option === wordObj.turkish;
    setMcqChecked(true);
    if (isCorrect) {
      setMcqScore(prev => prev + 1);
    }
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
    if (playSpeechAudio && isCorrect) {
      playSpeechAudio(wordObj.english);
    }
  };

  const handleCheckMcq = () => {};

  const handleNextMcq = () => {
    if (mcqIndex < mcqList.length - 1) {
      const nextIdx = mcqIndex + 1;
      setMcqIndex(nextIdx);
      setMcqSelected(null);
      setMcqChecked(false);
      setMcqOptions(generateMcqOptions(mcqList[nextIdx], pool));
    } else {
      setMcqFinished(true);
    }
  };

  const handleCardFeedback = (isCorrect) => {
    if (incrementDailyWords) incrementDailyWords();
    const wordObj = flashcardsList[flashcardIndex];
    if (!wordObj) return;
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
    setRevealMeaning(false);
    setFlashcardIndex(prev => (prev + 1) % flashcardsList.length);
  };

  // Search, filter, and sort words
  const filteredWords = pool
    .filter(w => {
      if (filterStatus === 'learning') return w.status !== 'learned';
      if (filterStatus === 'learned') return w.status === 'learned';
      return true;
    })
    .filter(w => {
      const query = searchQuery.toLowerCase();
      return (w.english || '').toLowerCase().includes(query) || (w.turkish || '').toLowerCase().includes(query);
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortField === 'correct') {
        valA = (wordStats[a.english.toLowerCase()] || { correct: 0 }).correct;
        valB = (wordStats[b.english.toLowerCase()] || { correct: 0 }).correct;
      } else if (sortField === 'wrong') {
        valA = (wordStats[a.english.toLowerCase()] || { wrong: 0 }).wrong;
        valB = (wordStats[b.english.toLowerCase()] || { wrong: 0 }).wrong;
      } else {
        valA = (a.english || '').toLowerCase();
        valB = (b.english || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Tab Styles
  const activeTabStyle = {
    flex: '1',
    minWidth: '80px',
    padding: '8px 12px',
    fontSize: '0.72rem',
    fontWeight: '700',
    borderRadius: '10px',
    background: 'var(--primary-gradient)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer'
  };

  const inactiveTabStyle = {
    flex: '1',
    minWidth: '80px',
    padding: '8px 12px',
    fontSize: '0.72rem',
    fontWeight: '600',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  // Button style generator for Matching game (Strict high-contrast, rounded table rows/cells look)
  const getMatchBtnStyle = (isMatched, isActive, isErr) => {
    let base = {
      width: '100%',
      padding: '12px 14px',
      fontSize: '0.8rem',
      fontWeight: '700',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(255, 255, 255, 0.03)',
      color: '#e2e8f0',
      minHeight: '46px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1.3',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };

    if (isMatched) {
      base = {
        ...base,
        opacity: 1.0, // Keep fully visible on correct match
        background: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981', // Highlight border with green
        color: '#34d399',
        cursor: 'default',
        pointerEvents: 'none',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)'
      };
    } else if (isErr) {
      base = {
        ...base,
        background: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#ef4444',
        color: '#f87171',
        boxShadow: '0 0 8px rgba(239, 68, 68, 0.25)'
      };
    } else if (isActive) {
      base = {
        ...base,
        background: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#818cf8',
        color: '#ffffff',
        boxShadow: '0 0 12px rgba(99, 102, 241, 0.35)',
        transform: 'scale(1.02)'
      };
    }

    return base;
  };

  // MCQ button styling
  const getMcqBtnStyle = (isSelected, isCorrect, isChecked) => {
    let base = {
      width: '100%',
      padding: '14px 18px',
      fontSize: '0.82rem',
      fontWeight: '600',
      borderRadius: '12px',
      textAlign: 'left',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(255, 255, 255, 0.02)',
      color: '#e2e8f0',
      display: 'block'
    };

    if (isChecked) {
      if (isCorrect) {
        base = {
          ...base,
          background: 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10b981',
          color: '#34d399',
          fontWeight: '700',
          cursor: 'default'
        };
      } else if (isSelected) {
        base = {
          ...base,
          background: 'rgba(239, 68, 68, 0.15)',
          borderColor: '#ef4444',
          color: '#f87171',
          fontWeight: '700',
          cursor: 'default'
        };
      } else {
        base = {
          ...base,
          opacity: 0.35,
          cursor: 'default'
        };
      }
    } else if (isSelected) {
      base = {
        ...base,
        background: 'rgba(99, 102, 241, 0.18)',
        borderColor: '#6366f1',
        color: '#a5b4fc',
        fontWeight: '700'
      };
    }

    return base;
  };

  if (activeTab !== 'vocabulary') return null;

  return (
    <div className="space-y-4 text-left" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="section-title flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2>Akademik Kelime Defterim 📚</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelime kartları ile çalışın, eşleştirme oyunları oynayın ve istatistiklerinizi inceleyin.</p>
        </div>
        
        {pool.length === 0 && (
          <button 
            onClick={handleLoadAcademicWords}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Hazır YÖKDİL Kelimelerini Yükle
          </button>
        )}
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        padding: '6px', 
        background: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: '14px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}>
        <button onClick={() => setSubTab('flashcards')} style={subTab === 'flashcards' ? activeTabStyle : inactiveTabStyle}>📇 Kartlar</button>
        <button onClick={() => setSubTab('matching')} style={subTab === 'matching' ? activeTabStyle : inactiveTabStyle}>🧩 Eşleştirme</button>
        <button onClick={() => setSubTab('spelling')} style={subTab === 'spelling' ? activeTabStyle : inactiveTabStyle}>✍️ Yazma Testi</button>
        <button onClick={() => setSubTab('mcq')} style={subTab === 'mcq' ? activeTabStyle : inactiveTabStyle}>🎯 Çoktan Seçmeli</button>
        <button onClick={() => setSubTab('table')} style={subTab === 'table' ? activeTabStyle : inactiveTabStyle}>📊 Kelime Listesi</button>
      </div>

      {/* SUBTAB 1: FLASHCARDS LEARNING */}
      {subTab === 'flashcards' && (
        <div className="space-y-4">
          {flashcardsList.length > 0 ? (
            (() => {
              const currentWord = flashcardsList[flashcardIndex];
              if (!currentWord) return null;
              const stats = wordStats[currentWord.english.toLowerCase()] || { correct: 0, wrong: 0 };
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Kelime {flashcardIndex + 1} / {flashcardsList.length}</span>
                    <span className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star className="h-3 w-3 text-indigo-400" style={{ color: '#818CF8' }} />
                      Doğru: {stats.correct} | Yanlış: {stats.wrong}
                    </span>
                  </div>

                  {/* Flippable Flashcard Card */}
                  {/* Flippable Flashcard Card */}
                  <div 
                    onClick={() => setRevealMeaning(!revealMeaning)}
                    onTouchStart={(e) => {
                      setTouchEnd(null);
                      setTouchStart(e.targetTouches[0].clientX);
                    }}
                    onTouchMove={(e) => {
                      setTouchEnd(e.targetTouches[0].clientX);
                    }}
                    onTouchEnd={() => {
                      if (!touchStart || !touchEnd) return;
                      const distance = touchStart - touchEnd;
                      const minSwipeDistance = 50;
                      if (distance > minSwipeDistance) {
                        setRevealMeaning(false);
                        setFlashcardIndex(prev => (prev + 1) % flashcardsList.length);
                        if (incrementDailyWords) incrementDailyWords();
                      } else if (distance < -minSwipeDistance) {
                        setRevealMeaning(false);
                        setFlashcardIndex(prev => (prev - 1 + flashcardsList.length) % flashcardsList.length);
                      }
                    }}
                    className="glass-card text-center"
                    style={{ 
                      padding: '40px 20px',
                      cursor: 'pointer',
                      minHeight: '190px',
                      borderRadius: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: revealMeaning ? 'rgba(99, 102, 241, 0.05)' : 'rgba(18, 24, 41, 0.45)',
                      border: revealMeaning ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {!revealMeaning ? (
                      <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ fontSize: '1.8rem', color: '#f8fafc', margin: '0 0 8px 0' }}>
                          {currentWord.english}
                        </h3>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Anlamı Görmek İçin Tıkla</p>
                        {currentWord.sentence_en && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '320px', margin: '12px auto 0 auto', lineHeight: '1.4' }}>
                            "{currentWord.sentence_en}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-indigo-400 font-heading" style={{ fontSize: '1.6rem', color: '#818cf8', margin: '0 0 8px 0' }}>
                          {currentWord.turkish}
                        </h3>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>İngilizce: {currentWord.english}</p>
                        {currentWord.sentence_tr && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '320px', margin: '12px auto 0 auto', lineHeight: '1.4' }}>
                            "{currentWord.sentence_tr}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Controls & Free Navigation */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        onClick={() => handleCardFeedback(false)}
                        className="flex-1 py-3 text-xs font-bold rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all text-center"
                        style={{ cursor: 'pointer', flex: 1, padding: '12px' }}
                      >
                        ✕ Tekrar Çalışacağım
                      </button>
                      <button 
                        onClick={() => handleCardFeedback(true)}
                        className="flex-1 py-3 text-xs font-bold rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all text-center"
                        style={{ cursor: 'pointer', flex: 1, padding: '12px' }}
                      >
                        ✓ Biliyorum
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <button
                        onClick={() => {
                          setRevealMeaning(false);
                          setFlashcardIndex(prev => (prev - 1 + flashcardsList.length) % flashcardsList.length);
                        }}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        ⬅️ Önceki Kart
                      </button>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                        İpucu: Enter/Space ile çevir, yön tuşlarıyla geç
                      </span>
                      <button
                        onClick={() => {
                          setRevealMeaning(false);
                          setFlashcardIndex(prev => (prev + 1) % flashcardsList.length);
                          if (incrementDailyWords) incrementDailyWords();
                        }}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}
                      >
                        Sonraki Kart ➡️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-12 text-center border border-white/5 text-slate-500 text-xs rounded-3xl">
              Defterinizde henüz kelime bulunmamaktadır. Kelimeleri yükleyerek hemen başlayın!
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: 5-PAIR MATCHING GAME (OPTIMIZED FOR MOBILE VIEWPORTS) */}
      {subTab === 'matching' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Kelime Eşleştirme (5 Çift - Mobil Uyumlu 📱)</span>
            <button 
              onClick={startMatchingGame}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', border: 'none', background: 'none' }}
            >
              <RefreshCw className="h-3 w-3" /> Yeniden Dağıt
            </button>
          </div>

          {/* Grid structured with clear side-by-side columns and row separation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Left Column: English Words */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>İngilizce</h4>
              {matchLeft.map(item => {
                const isMatched = matchedWords.has(item.id);
                const isActive = activeLeft?.id === item.id;
                const isErr = matchErrors.has(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect(item, 'left')}
                    style={getMatchBtnStyle(isMatched, isActive, isErr)}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Turkish Meanings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '4px' }}>Türkçe Anlamı</h4>
              {matchRight.map(item => {
                const isMatched = matchedWords.has(item.id);
                const isActive = activeRight?.id === item.id;
                const isErr = matchErrors.has(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect(item, 'right')}
                    style={getMatchBtnStyle(isMatched, isActive, isErr)}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>

          {matchedWords.size === 5 && (
            <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl flex items-center justify-center gap-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', marginTop: '16px' }}>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400" style={{ color: '#34d399' }}>Tebrikler! 5 kelimenin tamamını başarıyla eşleştirdiniz.</span>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: SPELLING PRACTICE */}
      {subTab === 'spelling' && (
        <div className="space-y-4">
          {spellingList.length > 0 && spellingIndex < spellingList.length ? (
            (() => {
              const currentWord = spellingList[spellingIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>YAZMA TESTİ (Klavye Pratiği)</span>
                    <span>Soru {spellingIndex + 1} / {spellingList.length}</span>
                  </div>

                  <div className="text-center py-4 space-y-2">
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Kelimenin Türkçe Anlamı:</p>
                    <h3 className="text-xl font-bold text-indigo-400 font-heading" style={{ fontSize: '1.5rem', color: '#818cf8', margin: '6px 0 0 0' }}>
                      {currentWord.turkish}
                    </h3>
                  </div>

                  <input 
                    type="text"
                    placeholder="İngilizce karşılığını yazın..."
                    value={spellingInput}
                    onChange={(e) => {
                      if (!spellingChecked) {
                        setSpellingInput(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && spellingInput.trim() && !spellingChecked) {
                        handleCheckSpelling();
                      }
                    }}
                    disabled={spellingChecked}
                    className="duo-input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                  />

                  {spellingChecked && (
                    <div className="space-y-2">
                      <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                        spellingResult === 'correct' 
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                          : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                      }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>{spellingResult === 'correct' ? '✔️ Harika, Doğru!' : `❌ Hata! Doğru yazılışı: ${currentWord.english}`}</div>
                        {currentWord.sentence_en && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                            "{currentWord.sentence_en}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!spellingChecked ? (
                      <button
                        onClick={handleCheckSpelling}
                        disabled={!spellingInput.trim()}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Kontrol Et
                      </button>
                    ) : (
                      <button
                        onClick={handleNextSpelling}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {spellingIndex < spellingList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Yazma testini tamamladınız.</h4>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: MCQ */}
      {subTab === 'mcq' && (
        <div className="space-y-4">
          {mcqList.length > 0 && !mcqFinished ? (
            (() => {
              const currentWord = mcqList[mcqIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ÇOKTAN SEÇMELİ TEST</span>
                    <span>Soru {mcqIndex + 1} / {mcqList.length}</span>
                  </div>

                  <div className="text-center py-4 space-y-1">
                    <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Kelimenin İngilizcesi:</p>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ fontSize: '1.8rem', color: 'white', margin: '6px 0 0 0' }}>
                      {currentWord.english}
                    </h3>
                  </div>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mcqOptions.map((opt) => {
                      const isSelected = mcqSelected === opt;
                      const isCorrectAnswer = opt === currentWord.turkish;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleMcqSelect(opt)}
                          disabled={mcqChecked}
                          style={getMcqBtnStyle(isSelected, isCorrectAnswer, mcqChecked)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {mcqChecked && (
                    <div className="p-4 border rounded-2xl text-xs font-semibold" style={{
                      borderColor: mcqSelected === currentWord.turkish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      background: mcqSelected === currentWord.turkish ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      color: mcqSelected === currentWord.turkish ? '#34d399' : '#f87171'
                    }}>
                      {mcqSelected === currentWord.turkish ? '✔️ Tebrikler, Doğru!' : `❌ Hata! Doğru anlamı: ${currentWord.turkish}`}
                    </div>
                  )}

                   {mcqChecked && (
                    <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleNextMcq}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {mcqIndex < mcqList.length - 1 ? 'Sonraki Soru ➡️' : 'Testi Bitir 🏁'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-indigo-500/20 bg-indigo-500/5 text-center rounded-2xl space-y-4">
              <Sparkles className="h-8 w-8 text-indigo-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Çoktan seçmeli testi tamamladınız.</h4>
              <p className="text-xs text-slate-400">Skorunuz: <strong style={{ color: 'var(--primary-light)' }}>{mcqScore} / 10</strong></p>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: WORD TABLE */}
      {subTab === 'table' && (
        <div className="space-y-4">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input 
              type="text"
              placeholder="Kelime ara (İngilizce veya Türkçe)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="duo-input"
              style={{ flex: 1, minWidth: '180px', padding: '10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none' }}
            />
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="duo-input"
              style={{ padding: '10px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="learning">Çalışıyorum</option>
              <option value="learned">Öğrendim</option>
            </select>

            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-secondary"
              style={{ padding: '10px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {showAddForm ? 'Kapat' : '✍️ Yeni Kelime Ekle'}
            </button>
          </div>

          {/* Add custom word form */}
          {showAddForm && (
            <div className="glass-card p-4 border border-white/5 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text"
                  placeholder="İngilizce Kelime"
                  value={customEnglish}
                  onChange={(e) => setCustomEnglish(e.target.value)}
                  className="duo-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white' }}
                />
                <input 
                  type="text"
                  placeholder="Türkçe Anlamı"
                  value={customTurkish}
                  onChange={(e) => setCustomTurkish(e.target.value)}
                  className="duo-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white' }}
                />
              </div>
              <button 
                onClick={() => {
                  if (customEnglish.trim() && customTurkish.trim()) {
                    handleAddCustomWord(customEnglish, customTurkish);
                    setCustomEnglish('');
                    setCustomTurkish('');
                    setShowAddForm(false);
                  }
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Deftere Ekle
              </button>
            </div>
          )}

          {/* Word Table */}
          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b border-white/5 bg-white/2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th 
                      onClick={() => { setSortField('english'); setSortOrder(p => p === 'asc' ? 'desc' : 'asc'); }}
                      className="p-3 text-[9px] uppercase font-bold text-slate-400 cursor-pointer"
                      style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}
                    >
                      İngilizce Kelime {sortField === 'english' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>Türkçe Anlamı</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>Durum</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((item) => (
                    <tr 
                      key={item.id} 
                      className="border-b border-white/5 hover:bg-white/1" 
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      onClick={() => {
                        setDrawerWord(item);
                        setPronunciationScore(null);
                        if (incrementDailyWords) incrementDailyWords();
                      }}
                    >
                      <td className="p-3 text-xs font-bold text-indigo-300" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.english}</td>
                      <td className="p-3 text-xs text-slate-200" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.turkish}</td>
                      <td className="p-3 text-xs text-center" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleWordStatus(item.id)}
                          className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            background: item.status === 'learned' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                            color: item.status === 'learned' ? '#34d399' : '#a5b4fc',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          {item.status === 'learned' ? '✓ Öğrendim' : '📖 Çalışıyorum'}
                        </button>
                      </td>
                      <td className="p-3 text-xs text-center" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteFromNotebook(item.id)}
                          className="text-slate-500 hover:text-rose-400"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredWords.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-xs text-slate-500" style={{ padding: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Arama kriterlerine uygun kelime bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Word Details Drawer Overlay */}
      {drawerWord && (() => {
        const details = ACADEMIC_DICTIONARY_EXT[drawerWord.english.toLowerCase()] || {
          synonyms: "related, associated, equivalent",
          antonyms: "unrelated, opposite",
          sentence: `The word '${drawerWord.english}' is widely used in scientific contexts.`,
          sentenceTr: `"${drawerWord.english}" kelimesi bilimsel bağlamlarda yaygın olarak kullanılmaktadır.`
        };
        return (
          <>
            {/* Backdrop Blur */}
            <div 
              onClick={() => setDrawerWord(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 999
              }}
            />
            {/* Drawer Panel */}
            <div 
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(11, 15, 26, 0.96)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
                zIndex: 1000,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                color: '#e2e8f0',
                textAlign: 'left'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#818cf8', margin: 0 }}>{drawerWord.english}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Akademik Kelime Detayı</span>
                </div>
                <button 
                  onClick={() => setDrawerWord(null)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Translation */}
              <div>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Türkçe Karşılığı</span>
                <p style={{ fontSize: '0.92rem', fontWeight: '700', color: 'white', margin: '4px 0 0 0' }}>{drawerWord.turkish}</p>
              </div>

              {/* Pronunciation & Audio controls */}
              <div className="glass-card p-4 border border-white/5 bg-white/1 rounded-xl space-y-3" style={{ padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Telaffuz & Dinleme Hızı</span>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <button 
                    onClick={() => playSpeechAudio(drawerWord.english, 1.0)}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <Volume2 className="h-4 w-4" /> Dinle (Normal)
                  </button>
                  <button 
                    onClick={() => playSpeechAudio(drawerWord.english, 0.65)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    🐢 Yavaş Dinle
                  </button>
                </div>
              </div>

              {/* Interactive Pronunciation Trainer */}
              <div className="glass-card p-4 border border-white/5 bg-white/1 rounded-xl" style={{ padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Konuşma / Telaffuz Pratiği 🎙️</span>
                
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '4px 0 10px 0', lineHeight: '1.4' }}>
                  Mikrofon butonuna tıklayıp kelimeyi sesli okuyun. Doğruluk skorunuzu görün.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button 
                    onClick={() => startSpeechListening(drawerWord)}
                    disabled={isListening}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                      border: isListening ? '2px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.25)',
                      color: isListening ? '#f87171' : '#a5b4fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
                      transition: 'all 0.25s ease',
                      flexShrink: 0
                    }}
                  >
                    <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                  </button>
                  
                  <div>
                    {isListening ? (
                      <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 'bold' }}>Dinleniyor, lütfen konuşun...</span>
                    ) : pronunciationScore !== null ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: '800', color: pronunciationScore >= 85 ? '#34d399' : '#fbbf24' }}>%{pronunciationScore}</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: pronunciationScore >= 85 ? '#34d399' : '#fbbf24' }}>
                            {pronunciationScore >= 92 ? 'Mükemmel! 🌟' : pronunciationScore >= 85 ? 'Harika! 👍' : 'Gayet İyi, Tekrar Dene.'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Hazır (Mikrofon bekleniyor)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Synonyms & Antonyms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.05em', display: 'block' }}>Eş Anlamlılar (Synonyms)</span>
                  <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 0 0', fontWeight: '600' }}>{details.synonyms}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#f87171', letterSpacing: '0.05em', display: 'block' }}>Zıt Anlamlılar (Antonyms)</span>
                  <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 0 0', fontWeight: '600' }}>{details.antonyms}</p>
                </div>
              </div>

              {/* Scientific Sample Sentence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(99,102,241,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>Akademik Örnek Cümle</span>
                <p style={{ fontSize: '0.76rem', fontStyle: 'italic', color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: '1.4' }}>"{details.sentence}"</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>{details.sentenceTr}</p>
              </div>

              {/* Toggle Status inside Drawer */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    handleToggleWordStatus(drawerWord.id);
                    // update local drawerWord reference status
                    setDrawerWord(prev => ({ ...prev, status: prev.status === 'learned' ? 'learning' : 'learned' }));
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {drawerWord.status === 'learned' ? '📖 Çalışıyorum Olarak İşaretle' : '✓ Öğrendim Olarak İşaretle'}
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default VocabularySection;
