import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Check, Volume2, ArrowRight, Star, RefreshCw, X, AlertCircle, ChevronLeft, Award } from 'lucide-react';

const formatWordType = (type) => {
  if (!type) return '';
  const t = type.toLowerCase().trim();
  if (t === 'noun' || t === 'n') return 'İsim (noun)';
  if (t === 'verb' || t === 'v') return 'Fiil (verb)';
  if (t === 'adj' || t === 'adjective') return 'Sıfat (adj)';
  if (t === 'adv' || t === 'adverb') return 'Zarf (adv)';
  if (t === 'conj' || t === 'conjunction') return 'Bağlaç (conj)';
  if (t === 'prep' || t === 'preposition') return 'Edat (prep)';
  return type;
};

const BookExerciseSection = ({ activeTab, playSpeechAudio, BACKEND_URL, selectedDay, setSelectedDay, completedDays, setCompletedDays }) => {
  const [currentDayData, setCurrentDayData] = useState(null);
  const [loadingDay, setLoadingDay] = useState(false);
  const [phase, setPhase] = useState(1); // 1: Learn, 2: Synonym Match, 3: Antonym Match, 4: Quiz, 5: Summary
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [allWordsDb, setAllWordsDb] = useState({});

  useEffect(() => {
    const loadDictionaries = async () => {
      let combinedDb = {};
      try {
        const dictModule = await import('@dataset/yokdil/fen/dictionary.json');
        if (dictModule.default) {
          combinedDb = { ...dictModule.default };
        }
      } catch (e) {
        console.warn("Could not load dictionary.json fallback:", e);
      }
      try {
        const kelimelerModule = await import('@dataset/yokdil/fen/kelimeler.json');
        if (kelimelerModule.default) {
          combinedDb = { ...combinedDb, ...kelimelerModule.default };
        }
      } catch (e) {
        console.warn("Could not load kelimeler.json:", e);
      }
      setAllWordsDb(combinedDb);
    };
    loadDictionaries();
  }, []);

  const getTranslation = (wordStr) => {
    if (!wordStr) return '';
    const clean = wordStr.toLowerCase().trim();
    if (allWordsDb && allWordsDb[clean]) {
      const entry = allWordsDb[clean];
      if (typeof entry === 'string') return entry;
      if (typeof entry === 'object') {
        return entry.tr || entry.turkish || '';
      }
    }
    // Fallback: search in day's words if loaded
    if (currentDayData && currentDayData.words) {
      const match = currentDayData.words.find(w => w.word.toLowerCase() === clean);
      if (match) return match.turkish;
    }
    // Fallback list of some common words
    const localFallbacks = {
      "trivial": "önemsiz, ufak tefek",
      "unimportant": "önemsiz",
      "insignificant": "önemsiz, değersiz",
      "important": "önemli",
      "significant": "önemli, kayda değer",
      "developed": "gelişmiş",
      "fair": "adil, dürüst",
      "immature": "olgunlaşmamış",
      "young": "genç",
      "juvenile": "çocuksu, genç",
      "discuss": "tartışmak, görüşmek",
      "talk": "konuşmak",
      "bargain": "pazarlık yapmak",
      "create": "yaratmak, oluşturmak"
    };
    return localFallbacks[clean] || '';
  };
  
  // Matching exercise state
  const [matchLeftSelected, setMatchLeftSelected] = useState(null);
  const [matches, setMatches] = useState({}); // { leftId: rightKey }
  const [wrongMatch, setWrongMatch] = useState(null); // { leftId, rightKey }
  
  // Synonym MCQ step 2 state
  const [synonymQuestionIdx, setSynonymQuestionIdx] = useState(0);
  const [synonymSelectedOption, setSynonymSelectedOption] = useState(null);
  const [synonymShowFeedback, setSynonymShowFeedback] = useState(false);
  const [synonymOptions, setSynonymOptions] = useState([]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionId: selectedOption }
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Load session state from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(`yokdil_book_exercise_session`);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (typeof parsed.selectedDay === 'number') setSelectedDay(parsed.selectedDay);
        if (typeof parsed.phase === 'number') setPhase(parsed.phase);
        if (typeof parsed.currentWordIdx === 'number') setCurrentWordIdx(parsed.currentWordIdx);
        if (typeof parsed.synonymQuestionIdx === 'number') setSynonymQuestionIdx(parsed.synonymQuestionIdx);
        if (parsed.quizAnswers) setQuizAnswers(parsed.quizAnswers);
        if (typeof parsed.quizSubmitted === 'boolean') setQuizSubmitted(parsed.quizSubmitted);
      } catch (e) {
        console.error("Error loading book exercise session:", e);
      }
    }
  }, []);

  // Save session state to localStorage on state change
  useEffect(() => {
    if (!selectedDay) return;
    const sessionObj = {
      selectedDay,
      phase,
      currentWordIdx,
      synonymQuestionIdx,
      quizAnswers,
      quizSubmitted
    };
    localStorage.setItem(`yokdil_book_exercise_session`, JSON.stringify(sessionObj));
  }, [selectedDay, phase, currentWordIdx, synonymQuestionIdx, quizAnswers, quizSubmitted]);

  // Local CompletedDays storage synchronization lifted to App.jsx

  // Load day data dynamically
  useEffect(() => {
    if (selectedDay) {
      setLoadingDay(true);
      setCurrentDayData(null);
      fetch(`${BACKEND_URL || ''}/dataset/yokdil/fen/kitap/day_${selectedDay}.json`)
        .then(res => {
          if (!res.ok) throw new Error("Günün verisi bulunamadı");
          return res.json();
        })
        .then(data => {
          setCurrentDayData(data);
          setLoadingDay(false);
        })
        .catch(err => {
          console.error("Error loading day data:", err);
          alert(`${selectedDay}. Günün verisi yüklenemedi. Lütfen PDF dosyanızı 'yokdil_app/pdfs/' dizinine kopyalayıp 'parse_yds_book.py' betiğini çalıştırın.`);
          setSelectedDay(null);
          setLoadingDay(false);
        });
    }
  }, [selectedDay]);



  // Total 54 days
  const totalDays = 54;
  
  const findCorrectRightKey = (leftItem, rightList, wordsList, isAntonym = false) => {
    if (!leftItem || !rightList || !wordsList) return null;
    const cleanWord = leftItem.word.replace(/\s+[a-z]$/i, '').trim().toLowerCase();
    const wordData = wordsList.find(w => w.word.toLowerCase() === cleanWord);
    if (!wordData) {
      const match = leftItem.word.match(/\s+([a-f])$/i);
      if (match) return match[1].toLowerCase();
      return null;
    }
    const targetTerms = isAntonym 
      ? (wordData.antonyms || []).map(t => t.toLowerCase().trim())
      : (wordData.synonyms || []).map(t => t.toLowerCase().trim());
      
    if (targetTerms.length === 0) {
      const match = leftItem.word.match(/\s+([a-f])$/i);
      if (match) return match[1].toLowerCase();
      return null;
    }
    for (const rightItem of rightList) {
      const defLower = rightItem.def.toLowerCase();
      for (const term of targetTerms) {
        if (defLower.includes(term)) return rightItem.key;
      }
    }
    const match = leftItem.word.match(/\s+([a-f])$/i);
    if (match) return match[1].toLowerCase();
    
    return rightList[0]?.key;
  };

  const loadSynonymQuestion = (idx, dayData) => {
    if (!dayData || !dayData.exercises || !dayData.exercises.synonym_matching) return;
    const leftList = dayData.exercises.synonym_matching.left;
    const rightList = dayData.exercises.synonym_matching.right;
    const wordsList = dayData.words;
    if (idx >= leftList.length) return;
    const leftItem = leftList[idx];
    const correctKey = findCorrectRightKey(leftItem, rightList, wordsList, false);
    const correctOption = rightList.find(r => r.key === correctKey);
    const otherOptions = rightList.filter(r => r.key !== correctKey);
    const shuffledOthers = [...otherOptions].sort(() => 0.5 - Math.random());
    const selectedOthers = shuffledOthers.slice(0, 4);
    const combined = [correctOption, ...selectedOthers].filter(Boolean);
    const uniqueOptions = Array.from(new Set(combined.map(o => o.key)))
      .map(key => combined.find(o => o.key === key));
    const shuffledOptions = uniqueOptions.sort(() => 0.5 - Math.random());
    setSynonymOptions(shuffledOptions);
    setSynonymSelectedOption(null);
    setSynonymShowFeedback(false);
  };

  const handleSynonymOptionClick = (optionKey) => {
    if (synonymShowFeedback) return;
    setSynonymSelectedOption(optionKey);
    setSynonymShowFeedback(true);
    const leftList = currentDayData.exercises.synonym_matching.left;
    const leftItem = leftList[synonymQuestionIdx];
    const correctKey = findCorrectRightKey(leftItem, currentDayData.exercises.synonym_matching.right, currentDayData.words, false);
    const isCorrect = optionKey === correctKey;
    if (isCorrect) {
      setTimeout(() => {
        if (synonymQuestionIdx < leftList.length - 1) {
          setSynonymQuestionIdx(prev => prev + 1);
        } else {
          setPhase(3);
          setMatches({});
          setMatchLeftSelected(null);
        }
      }, 1500);
    }
  };

  useEffect(() => {
    if (phase === 2 && currentDayData) {
      loadSynonymQuestion(synonymQuestionIdx, currentDayData);
    }
  }, [phase, synonymQuestionIdx, currentDayData]);

  const handleDaySelect = (dayNum) => {
    setSelectedDay(dayNum);
    setPhase(1);
    setCurrentWordIdx(0);
    setMatches({});
    setMatchLeftSelected(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setSynonymQuestionIdx(0);
    setSynonymSelectedOption(null);
    setSynonymShowFeedback(false);
  };

  // Synonym / Antonym Matching Logic
  const handleMatchClick = (side, item) => {
    if (side === 'left') {
      // If already matched, do nothing
      if (matches[item.id]) return;
      setMatchLeftSelected(item);
    } else if (side === 'right' && matchLeftSelected) {
      const leftId = matchLeftSelected.id;
      const rightKey = item.key;
      
      // Get correct answers from dataset based on phase
      const correctAnswers = phase === 2 
        ? currentDayData?.exercises?.synonym_matching?.answers 
        : currentDayData?.exercises?.antonym_matching?.answers || {};
      
      const isCorrect = correctAnswers[leftId] === rightKey;

      if (isCorrect) {
        setMatches(prev => ({ ...prev, [leftId]: rightKey }));
        setMatchLeftSelected(null);
      } else {
        // Show wrong match feedback temporarily
        setWrongMatch({ leftId, rightKey });
        setTimeout(() => {
          setWrongMatch(null);
          setMatchLeftSelected(null);
        }, 1000);
      }
    }
  };

  if (activeTab !== 'book-exercises') return null;

  return (
    <div className="section-container animate-fade-in" style={{ color: 'white' }}>
      {/* Top Header progress bar if a day is selected */}
      {selectedDay ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          {currentDayData && !loadingDay && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', background: 'rgba(15, 23, 42, 0.25)', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: '600' }}>Alıştırma Adımları</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className={`badge ${phase >= 1 ? 'badge-primary' : ''}`} style={{ fontSize: '0.64rem', padding: '3px 8px', background: phase >= 1 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: phase >= 1 ? '#a5b4fc' : '#64748b', borderRadius: '4px' }}>
                    📖 1. Kelimeler
                  </span>
                  <span className={`badge ${phase >= 2 ? 'badge-primary' : ''}`} style={{ fontSize: '0.64rem', padding: '3px 8px', background: phase >= 2 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: phase >= 2 ? '#a5b4fc' : '#64748b', borderRadius: '4px' }}>
                    🔄 2. Eş Anlam
                  </span>
                  <span className={`badge ${phase >= 3 ? 'badge-primary' : ''}`} style={{ fontSize: '0.64rem', padding: '3px 8px', background: phase >= 3 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: phase >= 3 ? '#a5b4fc' : '#64748b', borderRadius: '4px' }}>
                    🔀 3. Zıt Anlam
                  </span>
                  <span className={`badge ${phase >= 4 ? 'badge-primary' : ''}`} style={{ fontSize: '0.64rem', padding: '3px 8px', background: phase >= 4 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: phase >= 4 ? '#a5b4fc' : '#64748b', borderRadius: '4px' }}>
                    ❓ 4. Test
                  </span>
                  <span className={`badge ${phase >= 5 ? 'badge-primary' : ''}`} style={{ fontSize: '0.64rem', padding: '3px 8px', background: phase >= 5 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)', color: phase >= 5 ? '#34d399' : '#64748b', borderRadius: '4px' }}>
                    🏆 5. Özet
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(phase / 5) * 100}%`,
                  background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: '32px' }}>
          <h1 className="font-heading" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>
            📖 YDS Kitap
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Suat Gürcan ve Rıdvan Gürbüz'ün popüler kitabındaki 60 günlük programı gün gün takip edin, kelimeleri eş anlamlarıyla öğrenin ve alıştırmaları çözün.
          </p>
          <div className="glass-card" style={{ padding: '16px', marginTop: '16px', borderLeft: '4px solid #818cf8', background: 'rgba(129,140,248,0.05)' }}>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block' }}>
              💡 **İpucu:** YDS kelime programının tüm günlerini (1-60) yüklemek için kitabın PDF dosyasını projedeki `yokdil_app/pdfs/` klasörüne kopyalayıp `parse_yds_book.py` scriptini çalıştırın. Şimdilik örnek olarak **1. Gün** tamamen aktiftir.
            </span>
          </div>
        </div>
      )}

      {/* 1. DAY SELECTION LIST VIEW */}
      {!selectedDay && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
          {/* Search bar */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Gün ara... (Örn: 1, 15, tamamlandı)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'white',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Array.from({ length: totalDays }, (_, idx) => {
              const dayNum = idx + 1;
              const isCompleted = completedDays.includes(dayNum);
              
              // Filter logic
              const searchLower = searchTerm.toLowerCase().trim();
              if (searchLower) {
                const matchesDay = `gün ${dayNum}`.includes(searchLower) || String(dayNum).includes(searchLower);
                const matchesCompleted = isCompleted && ('tamamlandı'.includes(searchLower) || 'bitti'.includes(searchLower));
                const matchesPending = !isCompleted && ('başlanmadı'.includes(searchLower) || 'kaldı'.includes(searchLower) || 'başlat'.includes(searchLower));
                if (!matchesDay && !matchesCompleted && !matchesPending) return null;
              }

              return (
                <div
                  key={dayNum}
                  onClick={() => handleDaySelect(dayNum)}
                  className={`glass-card day-selector-row ${isCompleted ? 'completed' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: isCompleted 
                      ? '1px solid rgba(16, 185, 129, 0.25)' 
                      : '1px solid rgba(255, 255, 255, 0.06)',
                    background: isCompleted
                      ? 'rgba(16, 185, 129, 0.04)'
                      : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted ? '#10b981' : '#818cf8',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}>
                      {dayNum}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '750', color: 'white' }}>
                        {dayNum}. Gün Çalışması
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                        Kelime Kartları, Eş/Zıt Anlam Alıştırmaları ve Çoktan Seçmeli Test
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                      color: isCompleted ? '#34d399' : '#94a3b8',
                      border: isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {isCompleted ? '✓ Tamamlandı' : 'Başlanmadı'}
                    </span>
                    <button
                      className="btn-primary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      {isCompleted ? 'Tekrar Et' : 'Başlat 🚀'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. INNER DAY WORKSPACE (WORDS & EXERCISES) */}
      {selectedDay && (!currentDayData || loadingDay) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'white', gap: '12px', padding: '40px' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>Günlük ders içeriği yükleniyor...</p>
        </div>
      )}

      {selectedDay && currentDayData && !loadingDay && (
        <div>
          <div style={{ height: '8px' }} />

          {/* PHASE 1: LEARN WORDS */}
          {phase === 1 && currentDayData.words && currentDayData.words.length > 0 && (
            <div className="space-y-6">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  Adım 1: Kelime Öğrenimi <span style={{ color: '#818cf8' }}>({currentWordIdx + 1}/{currentDayData.words.length})</span>
                </h4>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Kelimelerin anlam, eş anlam ve zıt anlam yapılarını inceleyin.</span>
              </div>

              <div className="glass-card animate-scale-in" style={{ padding: '16px 24px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '14px', gap: '4px' }}>
                  <span style={{ fontSize: '0.58rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>İNGİLİZCE KELİME</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em', wordBreak: 'break-all' }}>
                      {currentDayData.words[currentWordIdx].word}
                    </h1>
                    {playSpeechAudio && (
                      <button 
                        onClick={() => playSpeechAudio(currentDayData.words[currentWordIdx].word)}
                        className="speak-btn-glow"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          padding: '6px',
                          borderRadius: '50%',
                          color: '#818cf8',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Volume2 size={14} />
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                    <span className="word-badge" style={{ fontSize: '0.62rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                      {formatWordType(currentDayData.words[currentWordIdx].type)}
                    </span>
                    {currentDayData.words[currentWordIdx].priority && (
                      <span className="word-badge" style={{ 
                        background: currentDayData.words[currentWordIdx].priority === 'Çok Yüksek Sıklık' ? 'rgba(239, 68, 68, 0.12)' : (currentDayData.words[currentWordIdx].priority === 'Yüksek Sıklık' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)'), 
                        color: currentDayData.words[currentWordIdx].priority === 'Çok Yüksek Sıklık' ? '#f87171' : (currentDayData.words[currentWordIdx].priority === 'Yüksek Sıklık' ? '#fbbf24' : '#a5b4fc'), 
                        fontSize: '0.62rem',
                        border: '1px solid rgba(255,255,255,0.06)',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        🎯 {currentDayData.words[currentWordIdx].priority}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ margin: '8px 0', height: '1px', width: '32px', background: 'rgba(255,255,255,0.08)' }} />

                  <span style={{ fontSize: '0.58rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>TÜRKÇE ANLAMI</span>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                    {currentDayData.words[currentWordIdx].turkish}
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
                  {/* Eş Anlamlılar (Synonyms) */}
                  <div style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.12)', padding: '10px 14px', borderRadius: '12px', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.6rem', color: '#a5b4fc', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      🔄 EŞ ANLAMLILAR (SYNONYMS)
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                      {currentDayData.words[currentWordIdx].synonyms && currentDayData.words[currentWordIdx].synonyms.length > 0 ? (
                        currentDayData.words[currentWordIdx].synonyms.map((s, idx) => {
                          const tr = getTranslation(s);
                          return (
                            <span key={idx} style={{ fontSize: '0.76rem', background: 'rgba(16,185,129,0.08)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', marginBottom: '2px' }}>
                              {s} {tr ? `(${tr})` : ''}
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Bulunmuyor</span>
                      )}
                    </div>
                  </div>

                  {/* Zıt Anlamlılar (Antonyms) */}
                  <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.12)', padding: '10px 14px', borderRadius: '12px', textAlign: 'left' }}>
                    <span style={{ fontSize: '0.6rem', color: '#f87171', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      🔀 ZIT ANLAMLILAR (ANTONYMS)
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                      {currentDayData.words[currentWordIdx].antonyms && currentDayData.words[currentWordIdx].antonyms.length > 0 ? (
                        currentDayData.words[currentWordIdx].antonyms.map((a, idx) => {
                          const tr = getTranslation(a);
                          return (
                            <span key={idx} style={{ fontSize: '0.76rem', background: 'rgba(239,68,68,0.08)', color: '#f87171', padding: '1px 6px', borderRadius: '4px', marginBottom: '2px' }}>
                              {a} {tr ? `(${tr})` : ''}
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Bulunmuyor</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Academic Sentence Box */}
                {currentDayData.words[currentWordIdx].sentence_en && (
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Örnek Cümle</span>
                    <p style={{ fontSize: '0.98rem', color: 'white', lineHeight: 1.6, margin: '0 auto', fontWeight: '500', maxWidth: '500px' }}>
                      "{currentDayData.words[currentWordIdx].sentence_en}"
                    </p>
                    <p style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '8px', marginBottom: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                      {currentDayData.words[currentWordIdx].sentence_tr}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={() => setCurrentWordIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentWordIdx === 0}
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Önceki Kelime
                </button>

                <button
                  onClick={() => {
                    if (currentWordIdx < currentDayData.words.length - 1) {
                      setCurrentWordIdx(prev => prev + 1);
                    } else {
                      // Transition to Synonym Matching (Phase 2)
                      setPhase(2);
                      setMatches({});
                      setMatchLeftSelected(null);
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {currentWordIdx < currentDayData.words.length - 1 ? 'Öğrendim, Sıradaki' : 'Eş Anlam Eşleştirmeye Geç'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: SYNONYM MATCHING (MULTIPLE CHOICE - 1 QUESTION AT A TIME WITH 5 OPTIONS) */}
          {phase === 2 && currentDayData.exercises.synonym_matching && (() => {
            const leftList = currentDayData.exercises.synonym_matching.left;
            const rightList = currentDayData.exercises.synonym_matching.right;
            const currentItem = leftList[synonymQuestionIdx];
            if (!currentItem) return null;
            
            const cleanWord = currentItem.word.replace(/\s+[a-z]$/i, '').trim();
            const correctKey = findCorrectRightKey(currentItem, rightList, currentDayData.words, false);
            
            return (
              <div className="glass-card animate-scale-in" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 'bold' }}>
                    Adım 2: Eş Anlam Eşleştirme (Soru {synonymQuestionIdx + 1} / {leftList.length})
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    Kelimenin eş anlamlısını seçin
                  </span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span style={{ fontSize: '0.62rem', color: '#a5b4fc', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: '8px 0', letterSpacing: '-0.02em' }}>
                    {cleanWord.toUpperCase()}
                  </h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {synonymOptions.map((opt) => {
                    if (!opt) return null;
                    const isSelected = synonymSelectedOption === opt.key;
                    const isCorrectOpt = opt.key === correctKey;
                    
                    let btnStyle = {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      color: '#cbd5e1',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      fontSize: '0.92rem',
                      width: '100%'
                    };

                    if (synonymShowFeedback) {
                      if (isCorrectOpt) {
                        btnStyle.border = '1px solid #10b981';
                        btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                        btnStyle.color = '#34d399';
                      } else if (isSelected) {
                        btnStyle.border = '1px solid #ef4444';
                        btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                        btnStyle.color = '#f87171';
                      } else {
                        btnStyle.opacity = 0.5;
                        btnStyle.cursor = 'default';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSynonymOptionClick(opt.key)}
                        style={btnStyle}
                        className={`mcq-option-btn ${!synonymShowFeedback ? 'hover-effect' : ''}`}
                        disabled={synonymShowFeedback}
                      >
                        <span>{opt.def}</span>
                        {synonymShowFeedback && (() => {
                          const wordsArr = opt.def.split(',').map(s => s.trim());
                          const trs = wordsArr.map(w => getTranslation(w)).filter(Boolean);
                          return trs.length > 0 ? (
                            <span style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: '700', marginLeft: 'auto', marginRight: '12px', color: isCorrectOpt ? '#67e8f9' : '#cbd5e1' }}>
                              ({trs.join(', ')})
                            </span>
                          ) : null;
                        })()}
                        {synonymShowFeedback && isCorrectOpt && <Check size={18} style={{ color: '#10b981' }} />}
                        {synonymShowFeedback && isSelected && !isCorrectOpt && <X size={18} style={{ color: '#ef4444' }} />}
                      </button>
                    );
                  })}
                </div>

                {synonymShowFeedback && synonymSelectedOption !== correctKey && (
                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        if (synonymQuestionIdx < leftList.length - 1) {
                          setSynonymQuestionIdx(prev => prev + 1);
                        } else {
                          setPhase(3);
                          setMatches({});
                          setMatchLeftSelected(null);
                        }
                      }}
                      className="btn-primary"
                      style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      Sıradaki Kelime <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* PHASE 3: ANTONYM MATCHING */}
          {phase === 3 && currentDayData.exercises.antonym_matching && (
            <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '6px' }}>
                    Adım 3: Zıt Anlamlı Eşleştirme (Antonym Matching)
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    Soldaki İngilizce kelimeleri sağdaki uygun zıt anlamlılarıyla eşleştirin.
                  </p>
                </div>
                
                {Object.keys(matches).length === currentDayData.exercises.antonym_matching.left.length && (
                  <button
                    onClick={() => {
                      setPhase(4);
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.82rem', fontWeight: 'bold' }}
                  >
                    Çoktan Seçmeli Teste Geç 🚀
                  </button>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', position: 'relative' }}>
                {/* Left Side (Words) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentDayData.exercises.antonym_matching.left.map((item) => {
                    const matchedKey = matches[item.id];
                    const isSelected = matchLeftSelected?.id === item.id;
                    const isWrong = wrongMatch?.leftId === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMatchClick('left', item)}
                        className={`matching-card left-side ${isSelected ? 'selected' : ''} ${matchedKey ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16px 20px',
                          borderRadius: '16px',
                          border: matchedKey
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : isSelected
                              ? '1px solid #818cf8'
                              : isWrong
                                ? '1px solid #ef4444'
                                : '1px solid rgba(255,255,255,0.06)',
                          background: matchedKey
                            ? 'rgba(16, 185, 129, 0.1)'
                            : isSelected
                              ? 'rgba(99, 102, 241, 0.15)'
                              : isWrong
                                ? 'rgba(239, 68, 68, 0.15)'
                                : 'rgba(255,255,255,0.02)',
                          color: matchedKey ? '#34d399' : 'white',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          cursor: matchedKey ? 'default' : 'pointer'
                        }}
                      >
                        <strong style={{ fontSize: '1rem' }}>{item.word}</strong>
                        {matchedKey && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                              Eşleşti ({matchedKey.toUpperCase()})
                            </span>
                            <Check size={16} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Side (Definitions) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentDayData.exercises.antonym_matching.right.map((item) => {
                    const matchingLeftId = Object.keys(matches).find(k => matches[k] === item.key);
                    const isMatched = !!matchingLeftId;
                    const isWrong = wrongMatch?.rightKey === item.key;
                    
                    return (
                      <button
                        key={item.key}
                        onClick={() => handleMatchClick('right', item)}
                        className={`matching-card right-side ${isMatched ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '16px 20px',
                          borderRadius: '16px',
                          border: isMatched
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : isWrong
                              ? '1px solid #ef4444'
                              : '1px solid rgba(255,255,255,0.06)',
                          background: isMatched
                            ? 'rgba(16, 185, 129, 0.1)'
                            : isWrong
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(255,255,255,0.02)',
                          color: isMatched ? '#34d399' : '#cbd5e1',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          cursor: isMatched ? 'default' : 'pointer',
                          width: '100%',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: isMatched ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                            color: isMatched ? '#10b981' : '#818cf8',
                            fontSize: '0.85rem',
                            fontWeight: '800'
                          }}>
                            {item.key.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.9rem' }}>{item.def}</span>
                        </div>
                        {isMatched && <Check size={16} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* PHASE 4: MULTIPLE CHOICE QUIZ */}
          {phase === 4 && currentDayData.exercises.multiple_choice && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
                    Adım 4: Çoktan Seçmeli Test
                  </h3>
                </div>
                
                {quizSubmitted && (
                  <button
                    onClick={() => {
                      setPhase(5);
                      // Add to completed days
                      if (!completedDays.includes(selectedDay)) {
                        setCompletedDays(prev => [...prev, selectedDay]);
                      }
                    }}
                    className="btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.82rem', fontWeight: 'bold' }}
                  >
                    Sonuçları Gör ve Bitir 🏆
                  </button>
                )}
              </div>

              {currentDayData.exercises.multiple_choice.map((q) => {
                const selectedOpt = quizAnswers[q.id];
                const isCorrect = selectedOpt === q.answer;
                
                return (
                  <div key={q.id} className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '16px' }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.12)',
                        color: '#818cf8',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        flexShrink: 0
                      }}>
                        {q.id}
                      </span>
                      <p style={{ fontSize: '1.05rem', fontWeight: '600', color: 'white', lineHeight: '1.5', margin: 0 }}>
                        {q.question}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {Object.entries(q.options).map(([optKey, optVal]) => {
                        if (!optVal) return null;
                        const isSelected = selectedOpt === optKey;
                        const showCorrect = quizSubmitted && q.answer === optKey;
                        const showWrong = quizSubmitted && isSelected && !isCorrect;
                        
                        return (
                          <button
                            key={optKey}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optKey }))}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '14px 20px',
                              borderRadius: '14px',
                              textAlign: 'left',
                              width: '100%',
                              transition: 'all 0.2s ease',
                              background: showCorrect
                                ? 'rgba(16, 185, 129, 0.15)'
                                : showWrong
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : isSelected
                                    ? 'rgba(99, 102, 241, 0.12)'
                                    : 'rgba(255,255,255,0.01)',
                              border: showCorrect
                                ? '1px solid #10b981'
                                : showWrong
                                  ? '1px solid #ef4444'
                                  : isSelected
                                    ? '1px solid var(--primary-light)'
                                    : '1px solid rgba(255,255,255,0.05)',
                              color: showCorrect ? '#10b981' : showWrong ? '#f87171' : 'white',
                              cursor: quizSubmitted ? 'default' : 'pointer'
                            }}
                          >
                            <span style={{
                              fontWeight: '800',
                              marginRight: '12px',
                              color: showCorrect ? '#10b981' : showWrong ? '#f87171' : isSelected ? '#818cf8' : '#cbd5e1'
                            }}>
                              {optKey})
                            </span>
                            <span>{optVal}</span>
                            {quizSubmitted && (() => {
                              const tr = getTranslation(optVal);
                              return tr ? (
                                <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '700', marginLeft: 'auto', marginRight: '12px', color: showCorrect ? '#67e8f9' : '#cbd5e1' }}>
                                  ({tr})
                                </span>
                              ) : null;
                            })()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Submit Action */}
              <div style={{ display: 'flex', justifyContent: 'end', gap: '12px', paddingBottom: '40px' }}>
                {!quizSubmitted && (
                  <button
                    disabled={Object.keys(quizAnswers).length < currentDayData.exercises.multiple_choice.length}
                    onClick={() => setQuizSubmitted(true)}
                    className="btn-primary"
                    style={{ 
                      padding: '12px 24px', 
                      borderRadius: '14px', 
                      fontWeight: '700',
                      opacity: Object.keys(quizAnswers).length < currentDayData.exercises.multiple_choice.length ? 0.5 : 1,
                      cursor: Object.keys(quizAnswers).length < currentDayData.exercises.multiple_choice.length ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Cevapları Kontrol Et
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PHASE 5: SUMMARY */}
          {phase === 5 && (
            <div className="glass-card animate-scale-in" style={{ padding: '40px 32px', borderRadius: '24px', textAlign: 'center', background: 'rgba(11, 15, 26, 0.8)', border: '1.5px solid rgba(16, 185, 129, 0.25)', maxWidth: '580px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '2px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981'
                }}>
                  <Award size={36} />
                </div>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: '10px 0' }}>Tebrikler!</h2>
              <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedDay}. Gün çalışmasını başarıyla tamamladınız. Kelimeleri öğrendiniz, alıştırmaları çözdünüz ve kendinizi test ettiniz.
              </p>

              {/* Score card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px 20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Çözülen Soru</span>
                  <strong style={{ fontSize: '1.4rem', color: 'white' }}>{currentDayData.exercises.multiple_choice.length}</strong>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.08)' }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Doğru Sayısı</span>
                  <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>
                    {Object.entries(quizAnswers).filter(([qId, val]) => {
                      const q = currentDayData.exercises.multiple_choice.find(item => String(item.id) === String(qId));
                      return q && q.answer === val;
                    }).length}
                  </strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedDay(null)}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}
              >
                Gün Listesine Dön ve Devam Et 🚀
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookExerciseSection;
