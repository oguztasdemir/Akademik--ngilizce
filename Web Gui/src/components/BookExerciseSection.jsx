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

const BookExerciseSection = ({ activeTab, playSpeechAudio, BACKEND_URL, selectedDay, setSelectedDay, completedDays, setCompletedDays, addMistake }) => {
  const [currentDayData, setCurrentDayData] = useState(null);
  const [loadingDay, setLoadingDay] = useState(false);
  const [showEvaluationChoice, setShowEvaluationChoice] = useState(false);
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);

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
        const res = await fetch(`${BACKEND_URL || ''}/dataset/yokdil/fen/kitap/day_${d}.json`);
        if (res.ok) {
          const data = await res.json();
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
          const res = await fetch(`${BACKEND_URL || ''}/dataset/yokdil/fen/kitap/day_${d}.json`);
          if (res.ok) {
            const data = await res.json();
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

  const handlePrintPDF = (dayNum, wordsList) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert("Popup engelleyiciyi devre dışı bırakın!");
      return;
    }

    const isMonthly = (dayNum % 28 === 0) || (dayNum === totalDays);
    const isSec = !isMonthly && ((dayNum % 7 === 0) || (dayNum === totalDays));
    const titleText = isMonthly 
      ? `YDS Kitap Aylık Genel Değerlendirme Raporu - Ay ${Math.ceil(dayNum / 28)}` 
      : (isSec ? `YDS Kitap Haftalık Değerlendirme Raporu - Hafta ${Math.ceil(dayNum / 7)}` : `YDS Kitap Günlük Çalışma Raporu - Gün ${dayNum}`);

    let wordsRows = wordsList.map((w, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 10px; font-weight: bold; color: #1e293b;">${idx + 1}. ${w.word}</td>
        <td style="padding: 10px; color: #475569; font-style: italic;">${w.type || ''}</td>
        <td style="padding: 10px; color: #0f172a; font-weight: 500;">${w.turkish || ''}</td>
        <td style="padding: 10px; color: #475569; font-size: 0.85rem;">${w.sentence_en || ''}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>${titleText}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background-color: #ffffff; }
            h1 { color: #818cf8; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 1.8rem; }
            .meta-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .meta-item { font-size: 0.9rem; color: #475569; }
            .meta-item strong { color: #0f172a; font-size: 1.1rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f1f5f9; color: #475569; text-align: left; padding: 12px; font-size: 0.9rem; border-bottom: 2px solid #cbd5e1; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>📝 ${titleText}</h1>
          <div class="meta-box">
            <div class="meta-item">Kategori: <strong>YDS Kelime Kitabı</strong></div>
            <div class="meta-item">Tamamlanma Durumu: <strong>✓ Başarıyla Tamamlandı</strong></div>
          </div>
          <h3>📚 Kelime Listesi (${wordsList.length} Sözcük)</h3>
          <table>
            <thead>
              <tr>
                <th>Kelime</th>
                <th>Tür</th>
                <th>Türkçe Anlamı</th>
                <th>Örnek Cümle</th>
              </tr>
            </thead>
            <tbody>
              ${wordsRows}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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

  // Local CompletedDays storage synchronization lifted to App.jsx

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
              const res = await fetch(`${BACKEND_URL || ''}/dataset/yokdil/fen/kitap/day_${d}.json`);
              if (res.ok) {
                const data = await res.json();
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
  }, [selectedDay, isEvaluationMode, showEvaluationChoice]);



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
    setActiveQuizQIdx(0);
    if (dayNum % 10 === 0) {
      setShowEvaluationChoice(true);
      setIsEvaluationMode(false);
    } else {
      setShowEvaluationChoice(false);
      setIsEvaluationMode(false);
    }
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
                      onClick={() => handlePrintPDF(reportCardDay, reportCardWords)}
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
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setViewMode(mode);
                  setSelectedMonth(null);
                  setSelectedWeek(null);
                }}
                className="glass-button"
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  background: viewMode === mode ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)',
                  border: viewMode === mode ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.08)',
                  color: viewMode === mode ? 'white' : '#cbd5e1',
                  transition: 'all 0.2s'
                }}
              >
                {mode === 'daily' ? '📅 Günlük Görünüm' : mode === 'weekly' ? '🔁 Haftalık Görünüm' : '🔥 Aylık Görünüm'}
              </button>
            ))}
          </div>

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

          {(() => {
            const getMonthStats = (monthNum) => {
              const start = (monthNum - 1) * 28 + 1;
              const end = Math.min(monthNum * 28, totalDays);
              const totalDaysInMonth = end - start + 1;

              let completed = 0;
              for (let d = start; d <= end; d++) {
                if (completedDays.includes(d)) {
                  completed++;
                }
              }
              return { completed, totalDaysInMonth };
            };

            const getWeekStats = (weekNum) => {
              const start = (weekNum - 1) * 7 + 1;
              const end = Math.min(weekNum * 7, totalDays);
              const totalDaysInWeek = end - start + 1;

              let completed = 0;
              for (let d = start; d <= end; d++) {
                if (completedDays.includes(d)) {
                  completed++;
                }
              }
              return { completed, totalDaysInWeek };
            };

            const renderDayItem = (dayNum) => {
              const isCompleted = completedDays.includes(dayNum);
              
              // Filter logic for search
              const searchLower = searchTerm.toLowerCase().trim();
              if (searchLower) {
                const matchesDay = `gün ${dayNum}`.includes(searchLower) || String(dayNum).includes(searchLower);
                const matchesCompleted = isCompleted && ('tamamlandı'.includes(searchLower) || 'bitti'.includes(searchLower));
                const matchesPending = !isCompleted && ('başlanmadı'.includes(searchLower) || 'kaldı'.includes(searchLower) || 'başlat'.includes(searchLower));
                if (!matchesDay && !matchesCompleted && !matchesPending) return null;
              }

              const isMonthlyCamp = (dayNum % 28 === 0) || (dayNum === totalDays);
              const isSecCamp = !isMonthlyCamp && ((dayNum % 7 === 0) || (dayNum === totalDays));
              const secCampNum = Math.ceil(dayNum / 7);
              const monthlyCampNum = Math.ceil(dayNum / 28);

              let border = isMonthlyCamp 
                ? '1.5px solid rgba(239, 68, 68, 0.4)' 
                : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)');
              let bg = isMonthlyCamp 
                ? 'rgba(239, 68, 68, 0.02)' 
                : (isSecCamp ? 'rgba(251, 191, 36, 0.02)' : 'rgba(255, 255, 255, 0.02)');
              let badgeText = isCompleted ? '✓ Tamamlandı' : 'Başlanmadı';
              let badgeBg = isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)';
              let badgeColor = isCompleted ? '#34d399' : '#94a3b8';

              if (isCompleted) {
                bg = isMonthlyCamp 
                  ? 'rgba(239, 68, 68, 0.06)' 
                  : (isSecCamp ? 'rgba(251, 191, 36, 0.06)' : 'rgba(16, 185, 129, 0.04)');
                border = isMonthlyCamp 
                  ? '1.5px solid rgba(239, 68, 68, 0.7)' 
                  : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.7)' : '1px solid rgba(16, 185, 129, 0.25)');
              }

              const dayName = isMonthlyCamp 
                ? `Aylık Genel Test ${monthlyCampNum} 🏆` 
                : (isSecCamp ? `Haftanın Kampı ${secCampNum} 🏆` : `${dayNum}. Gün Çalışması`);
              const dayDesc = isMonthlyCamp 
                ? `${monthlyCampNum}. Ay Sonu Genel Değerlendirme Testi` 
                : (isSecCamp ? `${secCampNum}. Hafta Sonu Genel Bölüm Tekrarı` : `Kelime Kartları, Eş/Zıt Anlam Alıştırmaları ve Çoktan Seçmeli Test`);

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    if (isCompleted) {
                      setReportCardDay(dayNum);
                    } else {
                      handleDaySelect(dayNum);
                    }
                  }}
                  className={`glass-card day-selector-row ${isCompleted ? 'completed' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderRadius: '16px',
                    border: border,
                    background: bg,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    boxShadow: isMonthlyCamp 
                      ? '0 0 15px rgba(239, 68, 68, 0.08)' 
                      : (isSecCamp ? '0 0 15px rgba(251, 191, 36, 0.08)' : 'none')
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: isCompleted 
                        ? (isMonthlyCamp ? 'rgba(239, 68, 68, 0.15)' : (isSecCamp ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)')) 
                        : (isMonthlyCamp ? 'rgba(239, 68, 68, 0.12)' : (isSecCamp ? 'rgba(251, 191, 36, 0.12)' : 'rgba(99, 102, 241, 0.1)')),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isCompleted 
                        ? (isMonthlyCamp ? '#f87171' : (isSecCamp ? '#fbbf24' : '#10b981')) 
                        : (isMonthlyCamp ? '#f87171' : (isSecCamp ? '#fbbf24' : '#818cf8')),
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      border: (isSecCamp || isMonthlyCamp) ? `1px solid ${isMonthlyCamp ? 'rgba(239, 68, 68, 0.25)' : 'rgba(251, 191, 36, 0.25)'}` : 'none'
                    }}>
                      {isMonthlyCamp ? '🔥' : (isSecCamp ? '👑' : dayNum)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '750', color: 'white' }}>
                        {dayName}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
                        {dayDesc}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: badgeBg,
                      color: badgeColor,
                      border: isCompleted 
                        ? (isSecCamp ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)') 
                        : '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      {badgeText}
                    </span>
                    <button
                      className="btn-primary"
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: isMonthlyCamp && !isCompleted ? '#ef4444' : (isSecCamp && !isCompleted ? '#f59e0b' : ''),
                        borderColor: isMonthlyCamp && !isCompleted ? '#ef4444' : (isSecCamp && !isCompleted ? '#f59e0b' : '')
                      }}
                    >
                      {isCompleted ? 'Tekrar Et' : 'Başlat 🚀'}
                    </button>
                  </div>
                </div>
              );
            };

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {viewMode === 'daily' && (
                  Array.from({ length: totalDays }).map((_, i) => renderDayItem(i + 1))
                )}

                {viewMode === 'weekly' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, wIdx) => {
                      const weekNum = wIdx + 1;
                      const wStats = getWeekStats(weekNum);
                      const isWeekExpanded = selectedWeek === weekNum;
                      const wProgressPct = Math.round((wStats.completed / wStats.totalDaysInWeek) * 100);

                      return (
                        <div key={weekNum} className="glass-card" style={{ padding: '16px 20px', borderRadius: '16px', border: isWeekExpanded ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.06)' }}>
                          <div onClick={() => setSelectedWeek(isWeekExpanded ? null : weekNum)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'left' }}>
                              <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'white', fontWeight: 'bold' }}>
                                Hafta {weekNum} Değerlendirmesi {isWeekExpanded ? '▼' : '▶'}
                              </h4>
                              <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                                İlerleme: {wStats.completed}/{wStats.totalDaysInWeek} Gün
                              </span>
                            </div>
                            <div style={{ width: '100px', textAlign: 'right' }}>
                              <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                                <div style={{ height: '100%', width: `${wProgressPct}%`, background: 'linear-gradient(90deg, #6366f1, #34d399)', borderRadius: '2px' }}></div>
                              </div>
                              <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' }}>%{wProgressPct}</span>
                            </div>
                          </div>

                          {isWeekExpanded && (
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                              {Array.from({ length: wStats.totalDaysInWeek }).map((_, dIdx) => {
                                const dNum = (weekNum - 1) * 7 + dIdx + 1;
                                return renderDayItem(dNum);
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {viewMode === 'monthly' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {Array.from({ length: Math.ceil(totalDays / 28) }).map((_, mIdx) => {
                      const monthNum = mIdx + 1;
                      const stats = getMonthStats(monthNum);
                      const isExpanded = selectedMonth === monthNum;
                      const progressPct = Math.round((stats.completed / stats.totalDaysInMonth) * 100);

                      return (
                        <div key={monthNum} className="glass-card" style={{ padding: '20px', borderRadius: '18px', border: isExpanded ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}>
                          <div onClick={() => setSelectedMonth(isExpanded ? null : monthNum)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                            <div style={{ textAlign: 'left' }}>
                              <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'white', fontWeight: 'bold' }}>
                                {monthNum}. Ay Değerlendirmesi {isExpanded ? '▼' : '▶'}
                              </h4>
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                                İlerleme: {stats.completed}/{stats.totalDaysInMonth} Gün
                              </span>
                            </div>
                            <div style={{ width: '120px', textAlign: 'right' }}>
                              <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                                <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '3px' }}></div>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold' }}>%{progressPct} Tamamlandı</span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div style={{ marginTop: '16px', paddingLeft: '12px', borderLeft: '2px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {(() => {
                                const startWeek = (monthNum - 1) * 4 + 1;
                                const endWeek = Math.min(monthNum * 4, Math.ceil(totalDays / 7));
                                const weeks = Array.from({ length: endWeek - startWeek + 1 }, (_, wIdx) => startWeek + wIdx);

                                return weeks.map(weekNum => {
                                  const wStats = getWeekStats(weekNum);
                                  const isWeekExpanded = selectedWeek === weekNum;
                                  const wProgressPct = Math.round((wStats.completed / wStats.totalDaysInWeek) * 100);

                                  return (
                                    <div key={weekNum} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px 16px' }}>
                                      <div onClick={() => setSelectedWeek(isWeekExpanded ? null : weekNum)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                        <div style={{ textAlign: 'left' }}>
                                          <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 'bold' }}>
                                            Hafta {weekNum} {isWeekExpanded ? '▼' : '▶'}
                                          </h5>
                                          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                                            {wStats.completed}/{wStats.totalDaysInWeek} Gün
                                          </span>
                                        </div>
                                        <div style={{ width: '90px' }}>
                                          <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                                            <div style={{ height: '100%', width: `${wProgressPct}%`, background: 'linear-gradient(90deg, #6366f1, #34d399)', borderRadius: '2px' }}></div>
                                          </div>
                                        </div>
                                      </div>

                                      {isWeekExpanded && (
                                        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                                          {Array.from({ length: wStats.totalDaysInWeek }).map((_, dIdx) => {
                                            const dNum = (weekNum - 1) * 7 + dIdx + 1;
                                            return renderDayItem(dNum);
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
          </div>
      )}

      {/* 2. INNER DAY WORKSPACE (WORDS & EXERCISES) */}
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

                {((selectedDay % 7 === 0) || (selectedDay % 28 === 0) || (selectedDay === totalDays)) && (
                  <button
                    onClick={() => {
                      setPhase(2);
                      setMatches({});
                      setMatchLeftSelected(null);
                    }}
                    className="btn-secondary"
                    style={{ padding: '10px 16px', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', background: 'rgba(239, 68, 68, 0.05)', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    ⏩ Kartları Geç ve Alıştırmaya Başla
                  </button>
                )}

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
                  Adım 4: Çoktan Seçmeli Test
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>
                  Soru {activeQuizQIdx + 1} / {currentDayData.exercises.multiple_choice.length}
                </span>
              </div>

              {(() => {
                const q = currentDayData.exercises.multiple_choice[activeQuizQIdx];
                if (!q) return null;
                const selectedOpt = quizAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === q.answer;

                return (
                  <div className="glass-card animate-scale-in" style={{ padding: '24px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '20px' }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)',
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
                        {activeQuizQIdx + 1}
                      </span>
                      <p style={{ fontSize: '1.05rem', fontWeight: '600', color: 'white', lineHeight: '1.5', margin: 0, textAlign: 'left' }}>
                        {q.question}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {Object.entries(q.options).map(([optKey, optVal]) => {
                        if (!optVal) return null;
                        const isSelected = selectedOpt === optKey;
                        const showCorrect = isAnswered && q.answer === optKey;
                        const showWrong = isAnswered && isSelected && !isCorrect;

                        return (
                          <button
                            key={optKey}
                            disabled={isAnswered}
                            onClick={() => {
                              setQuizAnswers(prev => ({ ...prev, [q.id]: optKey }));
                              if (optKey !== q.answer && addMistake) {
                                addMistake({
                                  type: 'reading_question',
                                  bookId: selectedDay,
                                  passageTitle: `Okuma Kitabı - Gün #${selectedDay}`,
                                  questionText: q.question,
                                  options: Object.values(q.options),
                                  correctAnswer: q.options[q.answer] || q.answer,
                                  userAnswer: optVal
                                });
                              }
                            }}
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
                              cursor: isAnswered ? 'default' : 'pointer'
                            }}
                          >
                            <span style={{
                              fontWeight: '800',
                              marginRight: '12px',
                              color: showCorrect ? '#10b981' : showWrong ? '#f87171' : isSelected ? '#818cf8' : '#cbd5e1'
                            }}>
                              {optKey})
                            </span>
                            <span style={{ fontSize: '0.9rem' }}>{optVal}</span>
                            {isAnswered && (() => {
                              const tr = getTranslation(optVal);
                              return tr ? (
                                <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '750', marginLeft: 'auto', marginRight: '12px', color: showCorrect ? '#67e8f9' : '#cbd5e1' }}>
                                  ({tr})
                                </span>
                              ) : null;
                            })()}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                        {activeQuizQIdx < currentDayData.exercises.multiple_choice.length - 1 ? (
                          <button
                            onClick={() => setActiveQuizQIdx(prev => prev + 1)}
                            className="btn-primary"
                            style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 'bold' }}
                          >
                            Sonraki Soru ➡️
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizSubmitted(true);
                              setPhase(5);
                              if (!completedDays.includes(selectedDay)) {
                                setCompletedDays(prev => [...prev, selectedDay]);
                              }
                            }}
                            className="btn-primary"
                            style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
                          >
                            Sonuçları Gör ve Bitir 🏁
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
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
                {currentDayData.isEvaluation 
                  ? `${selectedDay - 9}-${selectedDay}. Günler Genel Değerlendirme Testini başarıyla tamamladınız! 10 günlük birikiminiz başarıyla ölçüldü.`
                  : `${selectedDay}. Gün çalışmasını başarıyla tamamladınız. Kelimeleri öğrendiniz, alıştırmaları çözdünüz ve kendinizi test ettiniz.`
                }
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
