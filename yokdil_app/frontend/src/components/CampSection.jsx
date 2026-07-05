import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, ArrowRight, Check, AlertCircle, Calendar, Star, Lock, Heart, Award } from 'lucide-react';

// Camp dictionary is loaded dynamically from /src/camp/{category}/gun_{day}.json
const campModules = import.meta.glob('../camp/**/*.json');

const CampSection = ({ selectedCategory, awardPetXP, triggerConfetti, examsDb }) => {
  // Camp State Management
  const [progress, setProgress] = useState(null);
  const [studyWords, setStudyWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState(1); // 1: Learn, 2: Meaning, 3: Synonym, 4: Cloze, 5: Strategy Question, 6: Day Summary
  const [isStudying, setIsStudying] = useState(false);
  const [examQuestionsMap, setExamQuestionsMap] = useState({});
  const [activeDayWords, setActiveDayWords] = useState({});
  const [selectedDay, setSelectedDay] = useState(1);

  // Question/Test States
  const [meaningOptions, setMeaningOptions] = useState([]);
  const [meaningSelected, setMeaningSelected] = useState(null);
  const [meaningChecked, setMeaningChecked] = useState(false);
  const [meaningCorrect, setMeaningCorrect] = useState(null);

  const [synonymOptions, setSynonymOptions] = useState([]);
  const [synonymSelected, setSynonymSelected] = useState(null);
  const [synonymChecked, setSynonymChecked] = useState(false);
  const [synonymCorrect, setSynonymCorrect] = useState(null);

  const [clozeOptions, setClozeOptions] = useState([]);
  const [clozeSelected, setClozeSelected] = useState(null);
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeCorrect, setClozeCorrect] = useState(null);

  const [strategySelected, setStrategySelected] = useState(null);
  const [strategyChecked, setStrategyChecked] = useState(false);
  const [strategyCorrect, setStrategyCorrect] = useState(null);
  const [showStrategyTip, setShowStrategyTip] = useState(false);

  // Stats for the active day
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [wordResults, setWordResults] = useState({}); // tracking per-word correctness

  // Extract real exam vocabulary questions dynamically
  useEffect(() => {
    if (!examsDb) return;
    const map = {};

    Object.keys(examsDb).forEach(categoryKey => {
      const categoryExams = examsDb[categoryKey] || [];
      categoryExams.forEach(exam => {
        const questions = exam.questions || [];
        const answers = exam.answers || [];
        const vocabQuestions = questions.slice(0, 6);
        vocabQuestions.forEach(q => {
          const answerLetter = answers[q.number - 1];
          if (!answerLetter) return;
          const letterIndex = answerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2...
          const correctWordVal = q.options[letterIndex];
          if (!correctWordVal) return;

          const cleanCorrect = correctWordVal.trim().toLowerCase();
          const options = q.options.map(o => o.trim());

          map[cleanCorrect] = {
            question: q.text,
            options: options,
            correctAnswer: correctWordVal.trim(),
            isRealExam: true,
            source: `${exam.name} - Soru ${q.number}`
          };
        });
      });
    });

    setExamQuestionsMap(map);
  }, [examsDb]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const rawProgress = localStorage.getItem('yokdil_camp_progress');
    if (rawProgress) {
      try {
        const parsed = JSON.parse(rawProgress);
        // Ensure properties exist to avoid undefined crashes
        if (!parsed.completedDays) parsed.completedDays = {};
        if (!parsed.wordMastery) parsed.wordMastery = {};
        if (typeof parsed.currentDay !== 'number') parsed.currentDay = 1;
        setProgress(parsed);
      } catch (e) {
        const initial = {
          currentDay: 1,
          completedDays: {},
          wordMastery: {}
        };
        localStorage.setItem('yokdil_camp_progress', JSON.stringify(initial));
        setProgress(initial);
      }
    } else {
      const initial = {
        currentDay: 1,
        completedDays: {},
        wordMastery: {} // word: level (0 to 3)
      };
      localStorage.setItem('yokdil_camp_progress', JSON.stringify(initial));
      setProgress(initial);
    }
  }, []);

  if (!progress) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Yükleniyor...</div>;
  }

  const saveProgress = (newProg) => {
    setProgress(newProg);
    localStorage.setItem('yokdil_camp_progress', JSON.stringify(newProg));
  };

  const getAIAnalysis = () => {
    const wrongWordsRaw = localStorage.getItem('yokdil_camp_wrong_words') || '[]';
    const wrongDetailsRaw = localStorage.getItem('yokdil_camp_wrong_details') || '{}';
    
    let wrongWords = [];
    let wrongDetails = {};
    try {
      wrongWords = JSON.parse(wrongWordsRaw);
      wrongDetails = JSON.parse(wrongDetailsRaw);
    } catch (e) {
      return null;
    }

    if (!Array.isArray(wrongWords) || wrongWords.length === 0) return null;
    if (!wrongDetails || typeof wrongDetails !== 'object') wrongDetails = {};

    // 1. Tür Analizi
    const types = { noun: 0, verb: 0, adj: 0 };
    wrongWords.forEach(w => {
      const details = wrongDetails[w];
      if (details && details.type) {
        types[details.type] = (types[details.type] || 0) + 1;
      }
    });

    let primaryTypeError = 'noun';
    let maxCount = -1;
    Object.keys(types).forEach(t => {
      if (types[t] > maxCount) {
        maxCount = types[t];
        primaryTypeError = t;
      }
    });

    const typeLabels = { noun: 'İsim (Noun)', verb: 'Fiil (Verb)', adj: 'Sıfat (Adjective)' };
    const typeTips = {
      noun: "Cümlelerde özne ve nesne konumlarına, özellikle de edatlardan (in, of, for vb.) sonra gelen isim yapılarına dikkat etmelisiniz.",
      verb: "Fiil sorularında özellikle 'collocation' (birlikte kullanılan kelimeler) ve prepositions (edatlar) ipuçlarına odaklanmalısınız.",
      adj: "Sıfat sorularında arkasından gelen ismi nasıl nitelediğine ve cümlenin olumlu/olumsuz gidişatına odaklanmalısınız."
    };

    // 2. Anlamsal Analiz
    const categories = {
      negative: [],
      positive: [],
      analysis: []
    };

    wrongWords.forEach(w => {
      const details = wrongDetails[w] || {};
      const tr = (details.tr || '').toLowerCase();

      if (
        tr.includes('engel') || tr.includes('önle') || tr.includes('boz') || tr.includes('zarar') || 
        tr.includes('eksik') || tr.includes('azal') || tr.includes('hafiflet')
      ) {
        categories.negative.push(w);
      } else if (
        tr.includes('geliş') || tr.includes('art') || tr.includes('sağla') || tr.includes('sürdür') || 
        tr.includes('üret') || tr.includes('iyileş')
      ) {
        categories.positive.push(w);
      } else if (
        tr.includes('değerlendir') || tr.includes('incele') || tr.includes('gözlem') || tr.includes('belirle') ||
        tr.includes('analiz')
      ) {
        categories.analysis.push(w);
      }
    });

    let semanticInsight = "";
    if (categories.negative.length >= 2) {
      semanticInsight = `Hatalarınızın önemli bir kısmı **'Engelleme / Azalma / Olumsuz Durum'** bildiren akademik kelimelerden (${categories.negative.slice(0, 3).map(w => `<code>${w}</code>`).join(', ')}) oluşuyor. Bu kelimelerin cümledeki zıtlık bağlaçlarıyla (but, although, however) kullanım sıklığı yüksektir.`;
    } else if (categories.positive.length >= 2) {
      semanticInsight = `Yanlışlarınız ağırlıklı olarak **'Geliştirme / Artırma / Destekleme'** bağlamlı pozitif akademik kelimelerden (${categories.positive.slice(0, 3).map(w => `<code>${w}</code>`).join(', ')}) oluşuyor. Bunlar genellikle olumlu etki-sonuç cümlelerinde karşımıza çıkar.`;
    } else if (categories.analysis.length >= 2) {
      semanticInsight = `Yanlış yaptığınız kelimeler arasında **'İnceleme / Belirleme / Değerlendirme'** eylemleri (${categories.analysis.slice(0, 3).map(w => `<code>${w}</code>`).join(', ')}) yoğunlukta. YÖKDİL araştırma metinlerinde deney, gözlem ve sonuç bildiren cümlelere daha çok odaklanmalısınız.`;
    }

    // 3. Eş Anlam Karışıklığı
    const synonymPairs = [];
    wrongWords.forEach((w1, idx) => {
      wrongWords.slice(idx + 1).forEach(w2 => {
        const d1 = wrongDetails[w1] || {};
        const d2 = wrongDetails[w2] || {};
        const s1 = (d1.synonyms || '').toLowerCase();
        const s2 = (d2.synonyms || '').toLowerCase();

        if (
          s1.includes(w2.toLowerCase()) || 
          s2.includes(w1.toLowerCase()) ||
          (d1.tr && d2.tr && d1.tr.split(',')[0].trim() === d2.tr.split(',')[0].trim())
        ) {
          synonymPairs.push(`${w1} ↔ ${w2}`);
        }
      });
    });

    return {
      primaryType: typeLabels[primaryTypeError] || 'İsim',
      typeTip: typeTips[primaryTypeError],
      semanticInsight,
      synonymPairs,
      totalWrong: wrongWords.length
    };
  };

  // Helper Option Generators
  const getMeaningOptions = (correctMeaning, currentWordObj) => {
    const allMeanings = Object.values(activeDayWords).map(v => v.tr);
    const filtered = allMeanings.filter(m => m !== correctMeaning);
    return [
      correctMeaning,
      filtered[0] || 'saptamak',
      filtered[1] || 'önlemek',
      filtered[2] || 'iyileştirmek'
    ].sort(() => Math.random() - 0.5);
  };

  const getSynonymOptions = (correctSynonym, currentWordObj) => {
    const cleanCorrect = correctSynonym ? correctSynonym.split(',')[0].trim() : 'assess';
    const allSyns = Object.values(activeDayWords)
      .map(v => v.synonyms ? v.synonyms.split(',')[0].trim() : '')
      .filter(s => s && s !== cleanCorrect);

    return [
      cleanCorrect,
      allSyns[0] || 'determine',
      allSyns[1] || 'prevent',
      allSyns[2] || 'develop'
    ].sort(() => Math.random() - 0.5);
  };

  const getClozeOptions = (correctWord) => {
    const allWords = Object.keys(activeDayWords);
    const filtered = allWords.filter(w => w !== correctWord);
    return [
      correctWord,
      filtered[0] || 'evaluate',
      filtered[1] || 'reveal',
      filtered[2] || 'prevent'
    ].sort(() => Math.random() - 0.5);
  };

  // Spaced Repetition Daily Word Selection & Dynamic Camp JSON Loading
  const startDailyStudy = async (dayNum) => {
    const category = selectedCategory || 'fen';
    setSelectedDay(dayNum);

    const moduleKey = `../camp/${category}/gun_${dayNum}.json`;
    const loadFunc = campModules[moduleKey];

    if (!loadFunc) {
      alert("Seçilen güne ait modül bulunamadı!");
      return;
    }

    let dayWords = {};
    try {
      const module = await loadFunc();
      dayWords = module.default || module;
    } catch (e) {
      console.error("Günün kelimeleri yüklenemedi:", e);
      dayWords = {};
    }

    const dayWordKeys = Object.keys(dayWords);
    if (dayWordKeys.length === 0) {
      alert("Seçilen güne ait kelimeler yüklenemedi!");
      return;
    }

    // Spaced Repetition: Yanlış kelimelerin enjeksiyonu
    const wrongWordsRaw = localStorage.getItem('yokdil_camp_wrong_words');
    let wrongWordsList = [];
    if (wrongWordsRaw) {
      try {
        wrongWordsList = JSON.parse(wrongWordsRaw);
      } catch (e) {
        wrongWordsList = [];
      }
    }

    const wrongDetailsRaw = localStorage.getItem('yokdil_camp_wrong_details');
    let wrongDetailsMap = {};
    if (wrongDetailsRaw) {
      try {
        wrongDetailsMap = JSON.parse(wrongDetailsRaw);
      } catch (e) {
        wrongDetailsMap = {};
      }
    }

    // Günün kelimeleri haricinde kalan ve önceden yanlış yapılmış kelimeleri bulalım
    const extraWrong = wrongWordsList.filter(w => !dayWordKeys.includes(w)).slice(0, 4);

    const candidateWords = [];
    dayWordKeys.forEach(w => {
      candidateWords.push({
        word: w,
        ...dayWords[w]
      });
    });

    extraWrong.forEach(w => {
      if (wrongDetailsMap[w]) {
        candidateWords.push({
          word: w,
          ...wrongDetailsMap[w],
          isFromWrongList: true
        });
      }
    });

    // 15 Kelime Seçim Mantığı (Spaced Repetition & Mastery Puanlarına Göre):
    const masteryMap = progress.wordMastery || {};
    const sortedCandidates = [...candidateWords].sort((a, b) => {
      if (a.isFromWrongList && !b.isFromWrongList) return -1;
      if (!a.isFromWrongList && b.isFromWrongList) return 1;
      const levelA = masteryMap[a.word] || 0;
      const levelB = masteryMap[b.word] || 0;
      return levelA - levelB;
    });

    // Seçilen ilk 15 kelime
    const finalWords = sortedCandidates.slice(0, 15);

    // Save current day words and start study
    setActiveDayWords(dayWords);
    setStudyWords(finalWords);
    setCurrentIdx(0);
    setPhase(1);
    setIsStudying(true);

    // Reset stats
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setWordResults({});
  };

  // Handlers for Flow & Transitions
  const handleWordRead = () => {
    if (currentIdx < studyWords.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Transition to Meaning Practice (Phase 2)
      setPhase(2);
      setCurrentIdx(0);
      setMeaningOptions(getMeaningOptions(studyWords[0].tr));
    }
  };

  const handleMeaningCheck = (opt) => {
    if (meaningChecked) return;
    setMeaningSelected(opt);
    const isCorrect = opt === studyWords[currentIdx].tr;
    setMeaningCorrect(isCorrect);
    setMeaningChecked(true);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setWordResults(prev => ({
      ...prev,
      [studyWords[currentIdx].word]: (prev[studyWords[currentIdx].word] !== false) && isCorrect
    }));
  };

  const handleMeaningNext = () => {
    setMeaningSelected(null);
    setMeaningChecked(false);
    setMeaningCorrect(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < studyWords.length) {
      setCurrentIdx(nextIdx);
      setMeaningOptions(getMeaningOptions(studyWords[nextIdx].tr));
    } else {
      // Transition to Synonym Practice (Phase 3)
      setPhase(3);
      setCurrentIdx(0);
      setSynonymOptions(getSynonymOptions(studyWords[0].synonyms));
    }
  };

  const handleSynonymCheck = (opt) => {
    if (synonymChecked) return;
    setSynonymSelected(opt);
    const cleanCorrect = studyWords[currentIdx].synonyms.split(',')[0].trim();
    const isCorrect = opt === cleanCorrect;
    setSynonymCorrect(isCorrect);
    setSynonymChecked(true);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setWordResults(prev => ({
      ...prev,
      [studyWords[currentIdx].word]: prev[studyWords[currentIdx].word] && isCorrect
    }));
  };

  const handleSynonymNext = () => {
    setSynonymSelected(null);
    setSynonymChecked(false);
    setSynonymCorrect(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < studyWords.length) {
      setCurrentIdx(nextIdx);
      setSynonymOptions(getSynonymOptions(studyWords[nextIdx].synonyms));
    } else {
      // Transition to Cloze Sentence (Phase 4)
      setPhase(4);
      setCurrentIdx(0);
      setClozeOptions(getClozeOptions(studyWords[0].word));
    }
  };

  const handleClozeCheck = (opt) => {
    if (clozeChecked) return;
    setClozeSelected(opt);
    const isCorrect = opt === studyWords[currentIdx].word;
    setClozeCorrect(isCorrect);
    setClozeChecked(true);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setWordResults(prev => ({
      ...prev,
      [studyWords[currentIdx].word]: prev[studyWords[currentIdx].word] && isCorrect
    }));
  };

  const handleClozeNext = () => {
    setClozeSelected(null);
    setClozeChecked(false);
    setClozeCorrect(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < studyWords.length) {
      setCurrentIdx(nextIdx);
      setClozeOptions(getClozeOptions(studyWords[nextIdx].word));
    } else {
      // Transition to Soru & Strateji (Phase 5)
      setPhase(5);
      setCurrentIdx(0);
      // For Options in strategy screen, use same cloze options
      setClozeOptions(getClozeOptions(studyWords[0].word));
    }
  };

  const handleStrategyCheck = (opt) => {
    if (strategyChecked) return;
    setStrategySelected(opt);
    const currentWord = studyWords[currentIdx].word.toLowerCase();
    const hasRealExam = !!examQuestionsMap[currentWord];
    const correctAnswer = hasRealExam ? examQuestionsMap[currentWord].correctAnswer : studyWords[currentIdx].word;
    const isCorrect = opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setStrategyCorrect(isCorrect);
    setStrategyChecked(true);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setWordResults(prev => ({
      ...prev,
      [studyWords[currentIdx].word]: prev[studyWords[currentIdx].word] && isCorrect
    }));
  };

  const handleStrategyNext = () => {
    setStrategySelected(null);
    setStrategyChecked(false);
    setStrategyCorrect(null);
    setShowStrategyTip(false);
    const nextIdx = currentIdx + 1;
    if (nextIdx < studyWords.length) {
      setCurrentIdx(nextIdx);
      setClozeOptions(getClozeOptions(studyWords[nextIdx].word));
    } else {
      // Daily Camp Completed -> Summary (Phase 6)
      setPhase(6);

      const score = Math.round((correctAnswers / totalQuestions) * 100) || 100;
      const isPassed = score >= 90;

      // Update mastery level of the words studied
      const updatedMastery = { ...progress.wordMastery };
      studyWords.forEach(w => {
        const wasCorrect = wordResults[w.word] !== false;
        const currentLevel = updatedMastery[w.word] || 0;
        if (wasCorrect) {
          updatedMastery[w.word] = Math.min(3, currentLevel + 1);
        } else {
          updatedMastery[w.word] = Math.max(0, currentLevel - 1);
        }
      });

      // Save day completed status
      const todayNum = selectedDay;
      const updatedCompleted = {
        ...progress.completedDays,
        [todayNum]: {
          score,
          date: new Date().toLocaleDateString(),
          correctCount: correctAnswers,
          totalQuestions: totalQuestions,
          isPassed
        }
      };

      // Spaced Repetition: yanlış kelimelerin toplanması
      const wrongWordsRaw = localStorage.getItem('yokdil_camp_wrong_words') || '[]';
      const wrongDetailsRaw = localStorage.getItem('yokdil_camp_wrong_details') || '{}';
      
      let wrongWordsList = JSON.parse(wrongWordsRaw);
      let wrongDetailsMap = JSON.parse(wrongDetailsRaw);

      studyWords.forEach(w => {
        const wasCorrect = wordResults[w.word] !== false;
        if (!wasCorrect) {
          if (!wrongWordsList.includes(w.word)) {
            wrongWordsList.push(w.word);
            wrongDetailsMap[w.word] = {
              en: w.en,
              tr: w.tr,
              synonyms: w.synonyms,
              type: w.type
            };
          }
        } else {
          wrongWordsList = wrongWordsList.filter(item => item !== w.word);
          delete wrongDetailsMap[w.word];
        }
      });

      localStorage.setItem('yokdil_camp_wrong_words', JSON.stringify(wrongWordsList));
      localStorage.setItem('yokdil_camp_wrong_details', JSON.stringify(wrongDetailsMap));

      // Eğer başarı barajı geçildiyse gün ilerler ve ödüller verilir
      let nextDay = progress.currentDay;
      if (isPassed) {
        if (todayNum === progress.currentDay) {
          nextDay = Math.min(60, todayNum + 1);
        }
        if (awardPetXP) awardPetXP(40);
        if (triggerConfetti) triggerConfetti();

        // Add extra crystals to user
        const currentCrystals = parseInt(localStorage.getItem('yokdil_crystals') || '0', 10);
        localStorage.setItem('yokdil_crystals', String(currentCrystals + 10));
        window.dispatchEvent(new Event('custom-pet-updated'));
      }

      saveProgress({
        currentDay: nextDay,
        completedDays: updatedCompleted,
        wordMastery: updatedMastery
      });
    }
  };

  const exitCamp = () => {
    setIsStudying(false);
    setPhase(1);
    setCurrentIdx(0);
  };

  // Rendering Camp Grid (Menu Mode)
  if (!isStudying) {
    const completedDaysMap = progress.completedDays || {};
    const wordMasteryMap = progress.wordMastery || {};
    const totalDone = Object.keys(completedDaysMap).length;
    const currentDay = progress.currentDay || 1;
    const totalSupermaster = Object.values(wordMasteryMap).filter(v => v === 3).length;

    return (
      <div className="space-y-6">
        {/* Camp Header Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '12px', borderRadius: '12px', color: '#6366f1' }}>
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Kamp İlerlemesi</span>
              <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{totalDone} / 60 Gün</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
              <Star className="h-6 w-6" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Supermaster Kelimeler</span>
              <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{totalSupermaster} / {selectedCategory === 'fen' ? 1730 : 1744}</strong>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Aktif Hedef Gün</span>
              <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>Gün #{currentDay}</strong>
            </div>
          </div>
        </div>

        {/* Start Daily Button Card */}
        <div className="glass-card text-center" style={{ padding: '36px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.04) 100%)', border: '1.5px solid rgba(99, 102, 241, 0.25)' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
            Akademik Kelime Master Kampı 🚀
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#cbd5e1', maxWidth: '520px', margin: '8px auto 24px auto', lineHeight: 1.6 }}>
            Her gün 5 kelimeyi; anlam, eş anlam, boşluk doldurma ve soru stratejileriyle çalışarak hafızanıza sabitleyin. Akıllı spaced repetition algoritması öğrenemediğiniz kelimeleri sonraki günlerde tekrar karşınıza çıkaracaktır.
          </p>

          {(() => {
            const completedDaysMap = progress.completedDays || {};
            const completedObj = completedDaysMap[currentDay];
            const isPassed = completedObj ? completedObj.isPassed : false;
            
            if (completedObj && isPassed) {
              return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    🎉 Bugünün kelime kampını %{completedObj.score} başarıyla tamamladınız!
                  </div>
                  <button
                    onClick={() => startDailyStudy(currentDay)}
                    className="btn-secondary"
                    style={{ padding: '8px 24px', fontSize: '0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    Tekrar Çalış (Puan Yükselt)
                  </button>
                </div>
              );
            } else {
              return (
                <button
                  onClick={() => startDailyStudy(currentDay)}
                  className="btn-primary"
                  style={{ padding: '14px 36px', fontSize: '0.94rem', fontWeight: 'bold', borderRadius: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Gün #{currentDay} Çalışmasını Başlat <ArrowRight className="h-4 w-4" />
                </button>
              );
            }
          })()}
        </div>

        {/* 🤖 YAPAY ZEKA KELİME İLİŞKİ ANALİZ PANELİ */}
        {(() => {
          const aiReport = getAIAnalysis();
          if (!aiReport) return null;

          return (
            <div className="glass-card animate-scale-in" style={{ padding: '24px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.05)', border: '1.5px solid rgba(99, 102, 241, 0.2)', textAlign: 'left', marginTop: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Award className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h4 style={{ fontSize: '1.02rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  🤖 Yapay Zeka Kelime İlişki Analiz Raporu
                </h4>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                Son yaptığınız çalışmalara göre analiz edilen <strong>{aiReport.totalWrong} hatalı kelime</strong> üzerinden kurulan anlamsal ve gramatik ilişkiler:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3.5px solid #6366f1' }}>
                  <span style={{ fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gramer (Sözcük Türü) Analizi</span>
                  <span style={{ fontSize: '0.86rem', color: '#f1f5f9', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                    En çok hata yapılan sözcük türü: <strong>{aiReport.primaryType}</strong>. {aiReport.typeTip}
                  </span>
                </div>

                {aiReport.semanticInsight && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3.5px solid #10b981' }}>
                    <span style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Anlamsal Kümeleme (Semantic Cluster)</span>
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9', display: 'block', marginTop: '3px', lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: aiReport.semanticInsight }} />
                  </div>
                )}

                {aiReport.synonymPairs.length > 0 && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3.5px solid #fbbf24' }}>
                    <span style={{ fontSize: '0.78rem', color: '#fde047', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Eş Anlamlı Karışıklık Riski</span>
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                      Şu kelimeler benzer akademik anlamları sebebiyle zihninizde karışıyor olabilir: <strong>{aiReport.synonymPairs.join(', ')}</strong>. Bunları eş anlam kartlarıyla tekrar etmelisiniz.
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Day Grid Matrix */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>60 Günlük Kamp Takvimi</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: '12px' }}>
            {Array.from({ length: 60 }).map((_, i) => {
              const dayNum = i + 1;
              const completedDaysMap = progress.completedDays || {};
              const completedObj = completedDaysMap[dayNum];
              const isCompleted = !!completedObj;
              const isPassed = completedObj ? completedObj.isPassed : false;
              const score = completedObj ? completedObj.score : null;

              const isActive = dayNum === currentDay;
              const isLocked = false;

              let bg = 'rgba(255, 255, 255, 0.02)';
              let border = '1px solid rgba(255, 255, 255, 0.06)';
              let color = '#64748b';
              let icon = null;

              if (isCompleted) {
                if (isPassed) {
                  bg = 'rgba(16, 185, 129, 0.08)';
                  border = '1.5px solid rgba(16, 185, 129, 0.35)';
                  color = '#34d399';
                  icon = (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '6px' }}>
                      <Check className="h-3.5 w-3.5" style={{ color: '#10b981' }} />
                      <span style={{ fontSize: '0.64rem', color: '#10b981', fontWeight: 'bold' }}>%{score} Puan</span>
                    </div>
                  );
                } else {
                  bg = 'rgba(239, 68, 68, 0.08)';
                  border = '1.5px solid rgba(239, 68, 68, 0.35)';
                  color = '#f87171';
                  icon = (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '6px' }}>
                      <span style={{ fontSize: '0.64rem', color: '#ef4444', fontWeight: 'bold' }}>%{score} Puan</span>
                    </div>
                  );
                }
              } else if (isActive) {
                bg = 'rgba(99, 102, 241, 0.08)';
                border = '1.5px solid rgba(99, 102, 241, 0.5)';
                color = '#a5b4fc';
                icon = <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1', marginTop: '6px' }} />;
              } else if (isLocked) {
                icon = <Lock className="h-3 w-3" style={{ color: '#475569', marginTop: '6px' }} />;
              }

              return (
                <div
                  key={dayNum}
                  style={{
                    background: bg,
                    border: border,
                    borderRadius: '14px',
                    padding: '16px 8px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '88px',
                    transition: 'all 0.2s',
                    cursor: !isLocked ? 'pointer' : 'default',
                    opacity: isLocked ? 0.45 : 1
                  }}
                  onClick={!isLocked ? () => startDailyStudy(dayNum) : undefined}
                >
                  <span style={{ fontSize: '0.72rem', color: color, fontWeight: '800', display: 'block' }}>GÜN</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900', color: isLocked ? '#475569' : 'white', display: 'block', margin: '2px 0' }}>{dayNum}</span>
                  {icon}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Study Flow View
  return (
    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px' }}>
      
      {/* Flow Header and Progress */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '18px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GÜN #{selectedDay} KAMP ÇALIŞMASI</span>
            <h3 style={{ fontSize: '1.38rem', fontWeight: '900', color: 'white', margin: '4px 0 0 0' }}>Kelime Kampı ({studyWords.length} Kelime)</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span className={`badge ${phase >= 1 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
              📖 1. Öğren
            </span>
            <span className={`badge ${phase >= 2 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
              🧠 2. Anlam
            </span>
            <span className={`badge ${phase >= 3 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
              🔄 3. Eş Anlam
            </span>
            <span className={`badge ${phase >= 4 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
              📝 4. Boşluk Doldurma
            </span>
            <span className={`badge ${phase >= 5 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px' }}>
              💡 5. Soru Taktikleri
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((phase - 1) * 20) + ((currentIdx + 1) / studyWords.length * 20)}%`,
            background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* PHASE 1: LEARN CARD */}
      {phase === 1 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 1: Modadil Akademik Kelime Kartı <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
            <button onClick={exitCamp} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Kampı Kapat</button>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>İNGİLİZCE KELİME</span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                {studyWords[currentIdx].word}
              </h1>
              <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', textTransform: 'uppercase', fontWeight: '800' }}>
                tür: {studyWords[currentIdx].type}
              </span>
              
              <div style={{ margin: '14px 0', height: '1px', width: '48px', background: 'rgba(255,255,255,0.08)' }} />

              <span style={{ fontSize: '0.62rem', color: '#a5b4fc', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>TÜRKÇE ANLAMI</span>
              <h2 style={{ fontSize: '1.58rem', fontWeight: '800', color: '#a5b4fc', margin: 0 }}>
                {studyWords[currentIdx].tr}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '14px 18px', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.64rem', color: '#a5b4fc', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  🔄 EŞ ANLAMLILAR (SYNONYMS)
                </span>
                <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', margin: 0 }}>
                  {studyWords[currentIdx].synonyms || "Yok"}
                </p>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '14px 18px', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.64rem', color: '#34d399', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  🔗 COLLOCATIONS / BİRLİKTE KULLANIM
                </span>
                <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', margin: 0, fontStyle: 'italic' }}>
                  {studyWords[currentIdx].word} carefully, direct {studyWords[currentIdx].word}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Örnek Akademik Cümle (YÖKDİL)</span>
              <p style={{ fontSize: '0.98rem', color: 'white', lineHeight: 1.6, margin: '0 auto', fontWeight: '500', maxWidth: '500px' }}>
                {studyWords[currentIdx].en}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.8rem' }}
            >
              Önceki Kelime
            </button>

            <button
              onClick={handleWordRead}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Öğrendim, Sıradaki <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: MEANING PRACTICE */}
      {phase === 2 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 2: Kelimenin Anlamını Eşleştirin <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
                {meaningOptions.map((opt, i) => {
                  const isSelected = meaningSelected === opt;
                  const isCorrectAnswer = opt === studyWords[currentIdx].tr;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (meaningChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = 'rgba(99, 102, 241, 0.15)';
                    border = '1.5px solid #6366f1';
                    color = '#a5b4fc';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleMeaningCheck(opt)}
                      disabled={meaningChecked}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        cursor: meaningChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {meaningChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: meaningCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: meaningCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: meaningCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {meaningCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Doğru Eşleşme.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{studyWords[currentIdx].tr}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            {meaningChecked && (
              <button
                onClick={handleMeaningNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: SYNONYM PRACTICE */}
      {phase === 3 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 3: Eş Anlamlıyı Bulun <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
                {synonymOptions.map((opt, i) => {
                  const isSelected = synonymSelected === opt;
                  const cleanCorrect = studyWords[currentIdx].synonyms.split(',')[0].trim();
                  const isCorrectAnswer = opt === cleanCorrect;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (synonymChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = 'rgba(99, 102, 241, 0.15)';
                    border = '1.5px solid #6366f1';
                    color = '#a5b4fc';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSynonymCheck(opt)}
                      disabled={synonymChecked}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        cursor: synonymChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {synonymChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: synonymCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: synonymCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: synonymCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {synonymCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Eş Anlam Doğru.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{studyWords[currentIdx].synonyms.split(',')[0].trim()}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            {synonymChecked && (
              <button
                onClick={handleSynonymNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: CLOZE PRACTICE */}
      {phase === 4 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 4: Cümle Boşluk Doldurma <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AKADEMİK CÜMLE</span>
              
              <p style={{ fontSize: '1.18rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: '8px 0', wordBreak: 'break-word' }}>
                {studyWords[currentIdx].en.replace(new RegExp(`\\b${studyWords[currentIdx].word}\\b`, 'gi'), '________')}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '500px', marginTop: '16px' }}>
                {clozeOptions.map((opt, i) => {
                  const isSelected = clozeSelected === opt;
                  const isCorrectAnswer = opt === studyWords[currentIdx].word;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (clozeChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = 'rgba(99, 102, 241, 0.15)';
                    border = '1.5px solid #6366f1';
                    color = '#a5b4fc';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleClozeCheck(opt)}
                      disabled={clozeChecked}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: clozeChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {clozeChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: clozeCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: clozeCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: clozeCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {clozeCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Doğru Eşleşme.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{studyWords[currentIdx].word}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            {clozeChecked && (
              <button
                onClick={handleClozeNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 5: STRATEGY & QUESTION PRACTICE */}
      {phase === 5 && (() => {
        const currentWord = studyWords[currentIdx].word.toLowerCase();
        const hasRealExam = !!examQuestionsMap[currentWord];
        const realExamData = examQuestionsMap[currentWord];

        const questionText = hasRealExam ? realExamData.question : studyWords[currentIdx].en.replace(new RegExp(`\\b${studyWords[currentIdx].word}\\b`, 'gi'), '________');
        const optionsList = hasRealExam ? realExamData.options : clozeOptions;
        const correctAnswer = hasRealExam ? realExamData.correctAnswer : studyWords[currentIdx].word;

        const strategyTip = hasRealExam 
          ? `Bu soru gerçek ${realExamData.source} sınavında çıkmıştır. ${studyWords[currentIdx].word} (${studyWords[currentIdx].tr}) kelimesinin cümle bağlamındaki anlamını ve yanındaki yapıları inceleyin.`
          : `Boşluktan önceki ve sonraki kelime gruplarını inceleyin. Cümlenin Türkçe çevirisini göz önünde bulundurarak (${studyWords[currentIdx].tr}) kelimesinin anlamlı şekilde cümleyi tamamladığını doğrulayabilirsiniz.`;

        return (
          <div className="space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                Adım 5: YÖKDİL Sınav Sorusu ve Çözüm Stratejisi <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
              </h4>
            </div>

            <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                {hasRealExam ? (
                  <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                    ⚠️ ORİJİNAL ÇIKMIŞ YÖKDİL SINAV SORUSU ({realExamData.source})
                  </span>
                ) : (
                  <span style={{ fontSize: '0.62rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    YÖKDİL BENZERİ AKADEMİK SORU KALIBI
                  </span>
                )}

                <p style={{ fontSize: '1.05rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>
                  {questionText}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginTop: '16px' }}>
                  {optionsList.map((opt, i) => {
                    const isSelected = strategySelected === opt;
                    const isCorrectAnswer = opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
                    let bg = 'rgba(255, 255, 255, 0.03)';
                    let border = '1px solid rgba(255, 255, 255, 0.08)';
                    let color = 'white';

                    if (strategyChecked) {
                      if (isCorrectAnswer) {
                        bg = 'rgba(16, 185, 129, 0.15)';
                        border = '1.5px solid #10b981';
                        color = '#a7f3d0';
                      } else if (isSelected) {
                        bg = 'rgba(239, 68, 68, 0.15)';
                        border = '1.5px solid #ef4444';
                        color = '#fca5a5';
                      }
                    } else if (isSelected) {
                      bg = 'rgba(99, 102, 241, 0.15)';
                      border = '1.5px solid #6366f1';
                      color = '#a5b4fc';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleStrategyCheck(opt)}
                        disabled={strategyChecked}
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          background: bg,
                          border: border,
                          color: color,
                          fontSize: '0.92rem',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          cursor: strategyChecked ? 'default' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => setShowStrategyTip(prev => !prev)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1.5px dashed rgba(245, 158, 11, 0.3)',
                      color: '#f59e0b',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    💡 Modadil Soru Çözüm Stratejisini Gör {showStrategyTip ? '▲' : '▼'}
                  </button>

                  {showStrategyTip && (
                    <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fef3c7', fontSize: '0.86rem', lineHeight: 1.5 }}>
                      <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>Taktik Rehberi:</strong>
                      {strategyTip}
                    </div>
                  )}
                </div>

                {strategyChecked && (
                  <div className="glass-card animate-scale-in" style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    background: strategyCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: strategyCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                    color: strategyCorrect ? '#a7f3d0' : '#fca5a5',
                    marginTop: '12px',
                    fontSize: '0.82rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {strategyCorrect ? (
                      <>
                        <Check className="h-4 w-4" /> Tebrikler! Doğru Seçim.
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{correctAnswer}" olmalıydı.
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              {strategyChecked && (
                <button
                  onClick={handleStrategyNext}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Sıradaki Soru <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* PHASE 6: DAY SUMMARY / REPORT */}
      {phase === 6 && (
        <div className="space-y-6 text-center py-8">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}>
              <Trophy className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
            Tebrikler! Gün #{progress.currentDay - 1} Başarıyla Tamamlandı! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Bugünün 5 akademik kelimesini; anlam okuma, anlam testi, eş anlam bulma, cümle boşluk doldurma ve sınav taktikleriyle başarıyla çalıştınız.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Kazanılan Ödül</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block', marginTop: '4px' }}>+40 Evcil Hayvan XP</span>
            </div>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Ekstra Kristal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginTop: '4px' }}>+10 Kristal 💎</span>
            </div>
          </div>

          <div style={{ textAlign: 'left', maxWidth: '480px', margin: '20px auto', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'white', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              Günlük Kelime İlerleme Raporu
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {studyWords.map((w, idx) => {
                const wasCorrect = wordResults[w.word] !== false;
                const level = progress.wordMastery[w.word] || 0;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: 'white' }}>{w.word}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge" style={{
                        background: wasCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: wasCorrect ? '#34d399' : '#f87171',
                        border: wasCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                        fontSize: '0.72rem'
                      }}>
                        {wasCorrect ? 'Tam Öğrenildi' : 'Tekrar Edilecek'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Seviye: {level}/3</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={exitCamp}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Kamp Takvimine Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampSection;
