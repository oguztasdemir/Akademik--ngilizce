import React, { useState, useEffect } from 'react';

const bookModules = import.meta.glob('../../../Dataset/**/*.json');

const getBookModule = (category, dayNum) => {
  const cat = category || 'fen';
  const suffix = `yokdil/${cat}/yds_kitap/day_${dayNum}.json`;
  let foundKey = Object.keys(bookModules).find(k => k.endsWith(suffix));
  if (!foundKey && cat !== 'fen') {
    const fallbackSuffix = `yokdil/fen/yds_kitap/day_${dayNum}.json`;
    foundKey = Object.keys(bookModules).find(k => k.endsWith(fallbackSuffix));
  }
  return foundKey ? bookModules[foundKey] : null;
};
import { Award, Volume2, ArrowRight, Check, X } from 'lucide-react';
import { handlePrintPDF } from './components/BookExercisePrint';
import BookExerciseDashboard from './components/BookExerciseDashboard';
import BookExerciseStudy from './components/BookExerciseStudy';

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

const BookExerciseSection = ({ activeTab, playSpeechAudio, BACKEND_URL, selectedDay, setSelectedDay, completedDays, setCompletedDays, addMistake, selectedCategory, setIsStudyingActive }) => {
  const totalDays = 62;
  const [currentDayData, setCurrentDayData] = useState(null);
  const [loadingDay, setLoadingDay] = useState(false);
  const [showEvaluationChoice, setShowEvaluationChoice] = useState(false);
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);

  useEffect(() => {
    if (setIsStudyingActive) {
      setIsStudyingActive(currentDayData !== null);
    }
  }, [currentDayData, setIsStudyingActive]);

  const startNormalStudy = () => {
    setShowEvaluationChoice(false);
    setIsEvaluationMode(false);
  };

  const loadEvaluationData = async (targetDay) => {
    setLoadingDay(true);
    setCurrentDayData(null);
    setIsEvaluationMode(true);
    setShowEvaluationChoice(false);
    
    const startDay = targetDay - 9;
    const endDay = targetDay;
    const allQuestions = [];
    const allWords = [];
    
    try {
      for (let d = startDay; d <= endDay; d++) {
        const loadModule = getBookModule(selectedCategory, d);
        if (loadModule) {
          const mod = await loadModule();
          const data = mod.default || mod;
          if (data.words) {
            allWords.push(...data.words);
          }
          const mc = data.multiple_choice || (data.exercises && data.exercises.multiple_choice);
          if (mc) {
            allQuestions.push(...mc);
          }
        }
      }
      
      const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, 15);
      const mappedQuestions = shuffledQuestions.map((q, idx) => ({
        ...q,
        id: idx + 1
      }));
      
      const evalData = {
        day: targetDay,
        isEvaluation: true,
        words: allWords.slice(0, 15),
        exercises: {
          multiple_choice: mappedQuestions
        }
      };
      
      setCurrentDayData(evalData);
      setPhase(4);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setLoadingDay(false);
    } catch (e) {
      console.error("Evaluation loading failed:", e);
      alert("Genel değerlendirme testi verileri yüklenirken hata oluştu.");
      setSelectedDay(null);
      setLoadingDay(false);
    }
  };

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
        console.warn("Could not load dictionary.json:", e);
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
      if (typeof entry === 'string') return entry.split('|')[0].trim();
      if (typeof entry === 'object') {
        return (entry.tr || entry.turkish || '').split('|')[0].trim();
      }
    }
    if (currentDayData && currentDayData.words) {
      const match = currentDayData.words.find(w => w.word.toLowerCase() === clean);
      if (match) return match.turkish;
    }
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
  const [activeQuizQIdx, setActiveQuizQIdx] = useState(0);
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [reportCardDay, setReportCardDay] = useState(null);
  const [reportCardWords, setReportCardWords] = useState([]);
  const [loadingReportCard, setLoadingReportCard] = useState(false);

  useEffect(() => {
    if (!reportCardDay) {
      setReportCardWords([]);
      return;
    }

    const loadReportData = async () => {
      setLoadingReportCard(true);
      
      const isMonthly = (reportCardDay % 28 === 0) || (reportCardDay === totalDays);
      const isSec = !isMonthly && ((reportCardDay % 7 === 0) || (reportCardDay === totalDays));
      
      let days = [reportCardDay];
      if (isMonthly) {
        const currentMonthIdx = Math.ceil(reportCardDay / 28);
        const startDay = Math.max(1, (currentMonthIdx - 1) * 28 + 1);
        days = Array.from({ length: reportCardDay - startDay + 1 }, (_, idx) => startDay + idx);
      } else if (isSec) {
        const currentWeekIdx = Math.ceil(reportCardDay / 7);
        const startDay = Math.max(1, (currentWeekIdx - 1) * 7 + 1);
        days = Array.from({ length: reportCardDay - startDay + 1 }, (_, idx) => startDay + idx);
      }

      const tempWords = [];
      for (const d of days) {
        try {
          const loadModule = getBookModule(selectedCategory, d);
          if (loadModule) {
            const mod = await loadModule();
            const data = mod.default || mod;
            if (data.words) {
              tempWords.push(...data.words);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      setReportCardWords(tempWords);
      setLoadingReportCard(false);
    };

    loadReportData();
  }, [reportCardDay, totalDays]);

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
        if (typeof parsed.activeQuizQIdx === 'number') setActiveQuizQIdx(parsed.activeQuizQIdx);
      } catch (e) {
        console.error("Error loading book exercise session:", e);
      }
    }
  }, []);

  // Save session state to localStorage on state change
  useEffect(() => {
    if (!selectedDay) {
      localStorage.removeItem(`yokdil_book_exercise_session`);
      return;
    }
    const sessionObj = {
      selectedDay,
      phase,
      currentWordIdx,
      synonymQuestionIdx,
      quizAnswers,
      quizSubmitted,
      activeQuizQIdx
    };
    localStorage.setItem(`yokdil_book_exercise_session`, JSON.stringify(sessionObj));
  }, [selectedDay, phase, currentWordIdx, synonymQuestionIdx, quizAnswers, quizSubmitted, activeQuizQIdx]);

  // Load day data dynamically
  useEffect(() => {
    if (selectedDay) {
      if (selectedDay % 10 === 0 && !isEvaluationMode) {
        if (showEvaluationChoice) {
          setCurrentDayData(null);
          return;
        }
      }
      if (isEvaluationMode) {
        return;
      }

      const isMonthlyCamp = selectedDay % 28 === 0;
      const isSecCamp = selectedDay % 7 === 0;
      if (isSecCamp || isMonthlyCamp) {
        setLoadingDay(true);
        setCurrentDayData(null);

        const startDay = isMonthlyCamp ? selectedDay - 27 : selectedDay - 6;
        const endDay = selectedDay;

        const loadWeeklyData = async () => {
          const allWords = [];
          const synonymLeft = [];
          const synonymRight = [];
          const synonymAnswers = {};
          const antonymLeft = [];
          const antonymRight = [];
          const antonymAnswers = {};
          const allQuestions = [];

          try {
            for (let d = startDay; d <= endDay; d++) {
              if (d <= 0) continue;
              const loadModule = getBookModule(selectedCategory, d);
              if (loadModule) {
                const mod = await loadModule();
                const data = mod.default || mod;
                if (data.words) allWords.push(...data.words);
                
                const sm = data.exercises?.synonym_matching;
                if (sm) {
                  if (sm.left) synonymLeft.push(...sm.left);
                  if (sm.right) synonymRight.push(...sm.right);
                  if (sm.answers) Object.assign(synonymAnswers, sm.answers);
                }
                const am = data.exercises?.antonym_matching;
                if (am) {
                  if (am.left) antonymLeft.push(...am.left);
                  if (am.right) antonymRight.push(...am.right);
                  if (am.answers) Object.assign(antonymAnswers, am.answers);
                }
                
                const mc = data.multiple_choice || (data.exercises && data.exercises.multiple_choice);
                if (mc) allQuestions.push(...mc);
              }
            }

            const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
            const mappedQuestions = shuffledQuestions.map((q, idx) => ({
              ...q,
              id: idx + 1
            }));

            const mergedData = {
              day: selectedDay,
              isEvaluation: true,
              isSectionCamp: !isMonthlyCamp,
              isMonthlyCamp: isMonthlyCamp,
              words: allWords,
              exercises: {
                synonym_matching: {
                  left: synonymLeft.slice(0, 15),
                  right: synonymRight.slice(0, 15),
                  border: isMonthlyCamp ? 'rgba(239, 68, 68, 0.7)' : 'rgba(251, 191, 36, 0.7)',
                  answers: synonymAnswers
                },
                antonym_matching: {
                  left: antonymLeft.slice(0, 15),
                  right: antonymRight.slice(0, 15),
                  answers: antonymAnswers
                },
                multiple_choice: isMonthlyCamp ? mappedQuestions.slice(0, 30) : mappedQuestions
              }
            };

            setCurrentDayData(mergedData);
            setLoadingDay(false);
          } catch (e) {
            console.error("Weekly aggregation failed:", e);
            alert("Haftalık bölüm sonu kampı verileri yüklenirken hata oluştu.");
            setSelectedDay(null);
            setLoadingDay(false);
          }
        };

        loadWeeklyData();
        return;
      }

      const loadModule = getBookModule(selectedCategory, selectedDay);
      if (!loadModule) {
        alert(`${selectedDay}. Günün verisi bulunamadı.`);
        setSelectedDay(null);
        setLoadingDay(false);
        return;
      }
      setLoadingDay(true);
      setCurrentDayData(null);
      loadModule()
        .then(mod => {
          const data = mod.default || mod;
          setCurrentDayData(data);
          setLoadingDay(false);
        })
        .catch(err => {
          console.error("Error loading day data:", err);
          alert(`${selectedDay}. Günün verisi yüklenemedi.`);
          setSelectedDay(null);
          setLoadingDay(false);
        });
    }
  }, [selectedDay, isEvaluationMode, showEvaluationChoice]);

  
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
    setActiveQuizQIdx(0);
    if (dayNum % 10 === 0) {
      setShowEvaluationChoice(true);
      setIsEvaluationMode(false);
    } else {
      setShowEvaluationChoice(false);
      setIsEvaluationMode(false);
    }
  };

  const handleMatchClick = (side, item) => {
    if (side === 'left') {
      if (matches[item.id]) return;
      setMatchLeftSelected(item);
    } else if (side === 'right' && matchLeftSelected) {
      const leftId = matchLeftSelected.id;
      const rightKey = item.key;
      
      const correctAnswers = phase === 2 
        ? currentDayData?.exercises?.synonym_matching?.answers 
        : currentDayData?.exercises?.antonym_matching?.answers || {};
      
      const isCorrect = correctAnswers[leftId] === rightKey;

      if (isCorrect) {
        setMatches(prev => ({ ...prev, [leftId]: rightKey }));
        setMatchLeftSelected(null);
      } else {
        setWrongMatch({ leftId, rightKey });
        setTimeout(() => {
          setWrongMatch(null);
          setMatchLeftSelected(null);
        }, 1000);
      }
    }
  };

  const triggerBookExport = async (format) => {
    try {
      const studiedDays = [];
      const unstudiedDays = [];

      for (let day = 1; day <= 62; day++) {
        const isCompleted = completedDays.includes(day);
        const loadModule = getBookModule(selectedCategory, day);
        let wordsCount = 0;
        let dayTitle = `Gün #${day}`;
        if (loadModule) {
          const mod = await loadModule();
          const data = mod.default || mod;
          wordsCount = data.words ? data.words.length : 0;
          if (day >= 55) {
            dayTitle = `AWL Liste ${day - 54}`;
          }
        }
        const item = {
          day: day,
          title: dayTitle,
          isCompleted: isCompleted,
          wordsCount: wordsCount
        };
        if (isCompleted) {
          studiedDays.push(item);
        } else {
          unstudiedDays.push(item);
        }
      }

      const { handlePrintBookExportPDF, handlePrintBookExportDocx, handlePrintBookExportXlsx } = await import('./components/BookExercisePrint');
      if (format === 'pdf') {
        handlePrintBookExportPDF(studiedDays, unstudiedDays, selectedCategory);
      } else if (format === 'docx') {
        handlePrintBookExportDocx(studiedDays, unstudiedDays, selectedCategory);
      } else if (format === 'xlsx') {
        handlePrintBookExportXlsx(studiedDays, unstudiedDays, selectedCategory);
      }
    } catch (e) {
      console.error(e);
      alert("YDS Kitap raporu hazırlanırken bir hata oluştu.");
    }
  };

  if (activeTab !== 'book-exercises') return null;

  return (
    <div className="section-container animate-fade-in" style={{ color: 'white' }}>
      {reportCardDay && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', borderRadius: '24px', padding: '28px', border: '1.5px solid var(--primary-light)', background: 'rgba(15, 23, 42, 0.95)', color: 'white', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                📊 Genel Değerlendirme Karnesi (YDS Kitap)
              </h3>
              <button 
                onClick={() => setReportCardDay(null)} 
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {(() => {
              const isMonthly = (reportCardDay % 28 === 0) || (reportCardDay === totalDays);
              const isSec = !isMonthly && ((reportCardDay % 7 === 0) || (reportCardDay === totalDays));
              
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="glass-card" style={{ flex: 1, minWidth: '130px', padding: '14px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <span style={{ fontSize: '0.68rem', color: '#a5b4fc', textTransform: 'uppercase', display: 'block' }}>Rapor Günü</span>
                      <strong style={{ fontSize: '1.15rem', color: 'white' }}>
                        {isMonthly ? `Aylık Genel Test ${Math.ceil(reportCardDay / 28)}` : (isSec ? `Haftalık Kamp ${Math.ceil(reportCardDay / 7)}` : `${reportCardDay}. Gün`)}
                      </strong>
                    </div>
                    <div className="glass-card" style={{ flex: 1, minWidth: '130px', padding: '14px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span style={{ fontSize: '0.68rem', color: '#34d399', textTransform: 'uppercase', display: 'block' }}>Durum</span>
                      <strong style={{ fontSize: '1.15rem', color: '#34d399' }}>✓ Tamamlandı</strong>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '8px' }}>
                      📚 Çalışılan Kelimeler ({reportCardWords.length} Adet)
                    </h4>
                    {loadingReportCard ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', color: '#94a3b8' }}>
                        <span style={{ fontSize: '0.82rem' }}>Veriler yükleniyor...</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '12px' }} className="custom-scrollbar">
                        {reportCardWords.map((w, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem' }}>
                            <span style={{ fontWeight: 'bold', color: 'white' }}>{w.word} <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'normal' }}>({formatWordType(w.type)})</span></span>
                            <span style={{ color: '#a5b4fc' }}>{w.turkish}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => handlePrintPDF(reportCardDay, reportCardWords, totalDays)}
                      className="btn-primary"
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#3b82f6', borderColor: '#3b82f6', cursor: 'pointer' }}
                    >
                      🖨️ PDF Olarak İndir / Yazdır
                    </button>
                    <button 
                      onClick={() => {
                        setReportCardDay(null);
                        handleDaySelect(reportCardDay);
                      }}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                    >
                      🔄 Çalışmayı Yeniden Başlat
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

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

      {selectedDay && showEvaluationChoice && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px', color: 'white', gap: '20px', padding: '40px 20px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', fontSize: '1.8rem' }}>
            <Award size={36} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 8px 0', color: 'white' }}>{selectedDay}. Gün Değerlendirme Seçeneği</h2>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', maxWidth: '400px', lineHeight: '1.5', margin: 0 }}>
              Tebrikler! {selectedDay}. güne ulaştınız. Bu milat günde 10 günlük birikiminizi karıştırarak genel değerlendirme testi yapabilir ya da normal günlük kelime çalışmasını başlatabilirsiniz.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '440px', marginTop: '10px' }}>
            <button 
              onClick={() => loadEvaluationData(selectedDay)}
              className="btn-primary"
              style={{ flex: '1 1 180px', padding: '14px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              <span style={{ fontSize: '0.9rem' }}>Genel Değerlendirme Testi</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({selectedDay - 9}-{selectedDay}. Günleri Karıştır)</span>
            </button>
            <button 
              onClick={startNormalStudy}
              className="glass-button"
              style={{ flex: '1 1 180px', padding: '14px', borderRadius: '12px', fontWeight: 'bold', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: 'white' }}
            >
              <span style={{ fontSize: '0.9rem' }}>Normal Gün Çalışması</span>
              <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>({selectedDay}. Günün Kelimeleri)</span>
            </button>
          </div>
        </div>
      )}

      {selectedDay && !showEvaluationChoice && (!currentDayData || loadingDay) && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'white', gap: '12px', padding: '40px' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)' }}></i>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>Günlük ders içeriği yükleniyor...</p>
        </div>
      )}

      {/* RENDER STUDY OR DASHBOARD */}
      {selectedDay ? (
        !showEvaluationChoice && currentDayData && !loadingDay && (
          <BookExerciseStudy
            currentDayData={currentDayData}
            phase={phase}
            setPhase={setPhase}
            currentWordIdx={currentWordIdx}
            setCurrentWordIdx={setCurrentWordIdx}
            playSpeechAudio={playSpeechAudio}
            formatWordType={formatWordType}
            getTranslation={getTranslation}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            totalDays={totalDays}
            matches={matches}
            setMatches={setMatches}
            matchLeftSelected={matchLeftSelected}
            setMatchLeftSelected={setMatchLeftSelected}
            wrongMatch={wrongMatch}
            setWrongMatch={setWrongMatch}
            synonymQuestionIdx={synonymQuestionIdx}
            setSynonymQuestionIdx={setSynonymQuestionIdx}
            synonymOptions={synonymOptions}
            synonymSelectedOption={synonymSelectedOption}
            synonymShowFeedback={synonymShowFeedback}
            quizAnswers={quizAnswers}
            setQuizAnswers={setQuizAnswers}
            quizSubmitted={quizSubmitted}
            setQuizSubmitted={setQuizSubmitted}
            activeQuizQIdx={activeQuizQIdx}
            setActiveQuizQIdx={setActiveQuizQIdx}
            setCompletedDays={setCompletedDays}
            completedDays={completedDays}
            addMistake={addMistake}
            findCorrectRightKey={findCorrectRightKey}
            handleSynonymOptionClick={handleSynonymOptionClick}
            handleMatchClick={handleMatchClick}
          />
        )
      ) : (
        <BookExerciseDashboard
          totalDays={totalDays}
          completedDays={completedDays}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          handleDaySelect={handleDaySelect}
          setReportCardDay={setReportCardDay}
          formatWordType={formatWordType}
          onExportBookData={triggerBookExport}
        />
      )}
    </div>
  );
};

export default BookExerciseSection;
