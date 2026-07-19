import React, { useState, useEffect } from 'react';
import { Trophy, ShieldAlert, Award, Star, BookOpen, ChevronRight, Play } from 'lucide-react';
import SmartStudyFlow from './components/SmartStudyFlow';

const campModules = import.meta.glob('../../../../Dataset/**/*.json');

const SmartStudySection = ({ selectedCategory, awardPetXP, triggerConfetti, activeTab }) => {
  const [campWordsDb, setCampWordsDb] = useState({});
  const [loadingDb, setLoadingDb] = useState(true);
  const [studyStarted, setStudyStarted] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [studyWords, setStudyWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState(1);
  const [readWords, setReadWords] = useState({});

  // Question flows states
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

  // Load Gelişmiş Kelime Kampı day files to build the word database
  useEffect(() => {
    const loadAllCampWords = async () => {
      try {
        const category = selectedCategory || 'fen';
        const db = {};
        for (let day = 1; day <= 30; day++) {
          const path = `../../../../Dataset/yokdil/${category}/gelismis_kelime_kampi/day_${day}.json`;
          const matchingKey = Object.keys(campModules).find(k => k.includes(`yokdil/${category}/gelismis_kelime_kampi/day_${day}.json`));
          if (matchingKey) {
            const loader = campModules[matchingKey];
            const mod = await loader();
            const data = mod.default || mod;
            if (data && Array.isArray(data.words)) {
              data.words.forEach(w => {
                db[w.word.toLowerCase()] = {
                  word: w.word,
                  meaning: w.tr,
                  type: w.type || 'noun',
                  synonyms: w.synonyms || '',
                  collocation: w.antonyms || '',
                  sentence: w.sentences?.[0]?.en || '',
                  translation: w.sentences?.[0]?.tr || '',
                  examQuestion: w.sentences?.[0]?.blanked || '',
                  examOptions: [w.word, 'inhibit', 'discover', 'develop'],
                  strategy: 'Cümle yapısını inceleyerek doğru kelimeyi bulunuz.'
                };
              });
            }
          }
        }
        setCampWordsDb(db);
        setLoadingDb(false);
      } catch (e) {
        console.error("Error loading camp words:", e);
        setLoadingDb(false);
      }
    };
    loadAllCampWords();
  }, [selectedCategory]);

  if (activeTab !== 'smart-study') return null;

  // Retrieve current wrong words from local storage
  const wrongWordsRaw = localStorage.getItem('yokdil_camp_wrong_words') || '[]';
  const wrongDetailsRaw = localStorage.getItem('yokdil_camp_wrong_details') || '{}';
  const correctCountsRaw = localStorage.getItem('yokdil_smart_study_correct_counts') || '{}';

  let wrongList = [];
  let wrongDetails = {};
  let correctCounts = {};
  try {
    wrongList = JSON.parse(wrongWordsRaw);
    wrongDetails = JSON.parse(wrongDetailsRaw);
    correctCounts = JSON.parse(correctCountsRaw);
  } catch (e) {}

  // Merge wrong words list with database details
  const wordsToStudy = wrongList.map(w => {
    const wordKey = w.toLowerCase();
    const dbWord = campWordsDb[wordKey];
    const details = wrongDetails[w] || {};
    
    return {
      word: w,
      meaning: dbWord?.meaning || details.tr || 'anlam bulunamadı',
      type: dbWord?.type || details.type || 'kelime',
      synonyms: dbWord?.synonyms || details.synonyms || '',
      collocation: dbWord?.collocation || '',
      sentence: dbWord?.sentence || '',
      translation: dbWord?.translation || '',
      examQuestion: dbWord?.examQuestion || `Boşluğa gelebilecek en uygun kelimeyi seçin: ${w}`,
      examOptions: dbWord?.examOptions || [w, 'inhibit', 'discover', 'develop'],
      strategy: dbWord?.strategy || 'Kelimenin cümle içindeki kullanımını inceleyin.'
    };
  });

  const totalWrongCount = wordsToStudy.length;
  const totalDays = Math.ceil(totalWrongCount / 10) || 1;

  const trackWordStatus = (wordObj, isCorrect) => {
    const wordKey = wordObj.word.toLowerCase();
    let currentCounts = {};
    try {
      currentCounts = JSON.parse(localStorage.getItem('yokdil_smart_study_correct_counts') || '{}');
    } catch (e) {}

    if (isCorrect) {
      const nextCount = (currentCounts[wordKey] || 0) + 1;
      currentCounts[wordKey] = nextCount;
      localStorage.setItem('yokdil_smart_study_correct_counts', JSON.stringify(currentCounts));

      if (nextCount >= 2) {
        // Remove from wrong words lists
        try {
          let wrongListParsed = JSON.parse(localStorage.getItem('yokdil_camp_wrong_words') || '[]');
          let wrongDetailsParsed = JSON.parse(localStorage.getItem('yokdil_camp_wrong_details') || '{}');
          
          wrongListParsed = wrongListParsed.filter(w => w.toLowerCase() !== wordKey);
          delete wrongDetailsParsed[wordObj.word];
          
          localStorage.setItem('yokdil_camp_wrong_words', JSON.stringify(wrongListParsed));
          localStorage.setItem('yokdil_camp_wrong_details', JSON.stringify(wrongDetailsParsed));
        } catch (e) {}
      }
    } else {
      currentCounts[wordKey] = 0;
      localStorage.setItem('yokdil_smart_study_correct_counts', JSON.stringify(currentCounts));
    }
  };

  const handleStartStudy = (dayIndex) => {
    const startIdx = dayIndex * 10;
    const endIdx = Math.min(startIdx + 10, totalWrongCount);
    const dayWords = wordsToStudy.slice(startIdx, endIdx);
    
    setStudyWords(dayWords);
    setSelectedDay(dayIndex + 1);
    setCurrentIdx(0);
    setPhase(1);
    setStudyStarted(true);
    setupQuestionFlow(dayWords[0], dayWords);
  };

  const setupQuestionFlow = (wordObj, currentWordsList = studyWords) => {
    if (!wordObj) return;

    // Get fallback option pools from database keys
    const dbKeys = Object.keys(campWordsDb);
    const getRandomWord = () => {
      if (dbKeys.length > 5) {
        const randKey = dbKeys[Math.floor(Math.random() * dbKeys.length)];
        return campWordsDb[randKey]?.meaning || 'deneme';
      }
      return 'deneme';
    };

    // 1. Meaning options (meaning quiz)
    const meanings = [
      wordObj.meaning,
      getRandomWord(),
      getRandomWord(),
      getRandomWord()
    ].filter((v, i, a) => a.indexOf(v) === i);
    while (meanings.length < 4) {
      meanings.push(getRandomWord());
    }
    setMeaningOptions(meanings.sort(() => Math.random() - 0.5));
    setMeaningSelected(null);
    setMeaningChecked(false);
    setMeaningCorrect(null);

    // 2. Synonym options
    const correctSyn = wordObj.synonyms ? wordObj.synonyms.split(',')[0].trim() : '';
    const syns = [
      correctSyn,
      'inhibit',
      'discover',
      'develop',
      'prevent'
    ].filter((v, i, a) => a.indexOf(v) === i && v !== '').slice(0, 4);
    setSynonymOptions(syns.sort(() => Math.random() - 0.5));
    setSynonymSelected(null);
    setSynonymChecked(false);
    setSynonymCorrect(null);

    // 3. Cloze sentence options
    const cloze = [
      wordObj.word,
      'inhibit',
      'discover',
      'develop'
    ].sort(() => Math.random() - 0.5);
    setClozeOptions(cloze);
    setClozeSelected(null);
    setClozeChecked(false);
    setClozeCorrect(null);

    // 4. Strategy options
    setStrategySelected(null);
    setStrategyChecked(false);
    setStrategyCorrect(null);
    setShowStrategyTip(false);
  };

  const handleWordRead = () => {
    setReadWords(prev => ({ ...prev, [studyWords[currentIdx].word]: true }));
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
    } else {
      setCurrentIdx(0);
      setPhase(2);
      setupQuestionFlow(studyWords[0]);
    }
  };

  const handleMeaningCheck = (opt) => {
    setMeaningSelected(opt);
    setMeaningChecked(true);
    const isCorrect = opt === studyWords[currentIdx].meaning;
    setMeaningCorrect(isCorrect);
    trackWordStatus(studyWords[currentIdx], isCorrect);
  };

  const handleMeaningDontKnow = () => {
    setMeaningSelected(studyWords[currentIdx].meaning);
    setMeaningChecked(true);
    setMeaningCorrect(false);
    trackWordStatus(studyWords[currentIdx], false);
  };

  const handleMeaningNext = () => {
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setupQuestionFlow(studyWords[next]);
    } else {
      setCurrentIdx(0);
      setPhase(3);
      setupQuestionFlow(studyWords[0]);
    }
  };

  const handleSynonymCheck = (opt) => {
    setSynonymSelected(opt);
    setSynonymChecked(true);
    const correctVal = studyWords[currentIdx].synonyms ? studyWords[currentIdx].synonyms.split(',')[0].trim() : '';
    const isCorrect = opt.toLowerCase() === correctVal.toLowerCase();
    setSynonymCorrect(isCorrect);
    trackWordStatus(studyWords[currentIdx], isCorrect);
  };

  const handleSynonymDontKnow = () => {
    const correctVal = studyWords[currentIdx].synonyms ? studyWords[currentIdx].synonyms.split(',')[0].trim() : '';
    setSynonymSelected(correctVal);
    setSynonymChecked(true);
    setSynonymCorrect(false);
    trackWordStatus(studyWords[currentIdx], false);
  };

  const handleSynonymNext = () => {
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setupQuestionFlow(studyWords[next]);
    } else {
      setCurrentIdx(0);
      setPhase(4);
      setupQuestionFlow(studyWords[0]);
    }
  };

  const handleClozeCheck = (opt) => {
    setClozeSelected(opt);
    setClozeChecked(true);
    const isCorrect = opt === studyWords[currentIdx].word;
    setClozeCorrect(isCorrect);
    trackWordStatus(studyWords[currentIdx], isCorrect);
  };

  const handleClozeDontKnow = () => {
    setClozeSelected(studyWords[currentIdx].word);
    setClozeChecked(true);
    setClozeCorrect(false);
    trackWordStatus(studyWords[currentIdx], false);
  };

  const handleClozeNext = () => {
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setupQuestionFlow(studyWords[next]);
    } else {
      setCurrentIdx(0);
      setPhase(5);
      setupQuestionFlow(studyWords[0]);
    }
  };

  const handleStrategyCheck = (opt) => {
    setStrategySelected(opt);
    setStrategyChecked(true);
    const isCorrect = opt === studyWords[currentIdx].word;
    setStrategyCorrect(isCorrect);
    trackWordStatus(studyWords[currentIdx], isCorrect);
  };

  const handleStrategyDontKnow = () => {
    setStrategySelected(studyWords[currentIdx].word);
    setStrategyChecked(true);
    setStrategyCorrect(false);
    trackWordStatus(studyWords[currentIdx], false);
  };

  const handleStrategyNext = () => {
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setupQuestionFlow(studyWords[next]);
    } else {
      // Completed current day!
      awardPetXP?.(50);
      triggerConfetti?.();
      setPhase(6); // Summary phase
    }
  };

  const getEnglishForMeaningOption = (opt) => {
    const found = Object.values(campWordsDb).find(w => w.meaning === opt);
    return found ? found.word : '';
  };

  const getOptionTranslation = (opt) => {
    const found = Object.values(campWordsDb).find(w => w.word.toLowerCase() === opt.toLowerCase() || (w.synonyms && w.synonyms.toLowerCase().includes(opt.toLowerCase())));
    return found ? found.meaning : '';
  };

  const resetStudy = () => {
    setStudyStarted(false);
    setSelectedDay(null);
    setStudyWords([]);
    setCurrentIdx(0);
    setPhase(1);
  };

  if (loadingDb) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
        <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: '#10b981', marginBottom: '10px' }}></i>
        <p>Hata havuzu veritabanı yükleniyor...</p>
      </div>
    );
  }

  if (totalWrongCount === 0) {
    return (
      <div className="glass-card" style={{ padding: '40px 20px', borderRadius: '24px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', border: '1.5px solid rgba(255, 255, 255, 0.08)' }}>
        <Trophy size={64} style={{ color: '#fbbf24', marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: 'white' }}>Harika! Hiç Yanlışınız Yok 🎉</h2>
        <p style={{ color: '#cbd5e1', maxWidth: '460px', margin: '8px auto 24px auto', fontSize: '0.88rem', lineHeight: 1.6 }}>
          Gelişmiş Kelime Kampı'nda yaptığınız yanlışlar otomatik olarak burada birikir ve size özel bir Hata Kampı oluşturur. Şu an çalışacak hatalı kelimeniz bulunmuyor.
        </p>
      </div>
    );
  }

  if (studyStarted) {
    return (
      <SmartStudyFlow
        words={studyWords}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        phase={phase}
        wordLimit={10}
        meaningOptions={meaningOptions}
        meaningSelected={meaningSelected}
        meaningChecked={meaningChecked}
        meaningCorrect={meaningCorrect}
        handleMeaningCheck={handleMeaningCheck}
        getEnglishForMeaningOption={getEnglishForMeaningOption}
        handleMeaningDontKnow={handleMeaningDontKnow}
        handleMeaningNext={handleMeaningNext}
        synonymOptions={synonymOptions}
        synonymSelected={synonymSelected}
        synonymChecked={synonymChecked}
        synonymCorrect={synonymCorrect}
        handleSynonymCheck={handleSynonymCheck}
        getOptionTranslation={getOptionTranslation}
        handleSynonymDontKnow={handleSynonymDontKnow}
        handleSynonymNext={handleSynonymNext}
        clozeOptions={clozeOptions}
        clozeSelected={clozeSelected}
        clozeChecked={clozeChecked}
        clozeCorrect={clozeCorrect}
        handleClozeCheck={handleClozeCheck}
        handleClozeDontKnow={handleClozeDontKnow}
        handleClozeNext={handleClozeNext}
        strategySelected={strategySelected}
        strategyChecked={strategyChecked}
        strategyCorrect={strategyCorrect}
        handleStrategyCheck={handleStrategyCheck}
        showStrategyTip={showStrategyTip}
        setShowStrategyTip={setShowStrategyTip}
        handleStrategyDontKnow={handleStrategyDontKnow}
        handleStrategyNext={handleStrategyNext}
        resetStudy={resetStudy}
        handleWordRead={handleWordRead}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(99, 102, 241, 0.03) 100%)', border: '1.5px solid rgba(239, 68, 68, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '10px', borderRadius: '12px' }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Hata Odaklı Akıllı Çalışma Kampı 🧠</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.82rem', margin: '4px 0 0 0' }}>
              Yanlış cevapladığınız kelimelerden dinamik olarak oluşturulan özel kamp. Her kelimeyi en az <b>2 kez üst üste doğru</b> bilmeniz gerekir.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {Array.from({ length: totalDays }).map((_, idx) => {
          const startIdx = idx * 10;
          const endIdx = Math.min(startIdx + 10, totalWrongCount);
          const dayWords = wordsToStudy.slice(startIdx, endIdx);
          const learnedInDay = dayWords.filter(w => (correctCounts[w.word.toLowerCase()] || 0) >= 2).length;

          return (
            <div 
              key={idx} 
              className="glass-card" 
              style={{ 
                padding: '20px', 
                borderRadius: '16px', 
                background: 'rgba(30, 41, 59, 0.4)', 
                border: '1.5px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.94rem', fontWeight: 'bold', color: 'white' }}>Gün #{idx + 1} Hata Kampı</span>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                    {learnedInDay}/{dayWords.length} Öğrenildi
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '6px 0 0 0' }}>
                  Bu kampta çalışılacak toplam {dayWords.length} hatalı kelimeniz bulunmaktadır.
                </p>
              </div>

              <button
                onClick={() => handleStartStudy(idx)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none'
                }}
              >
                <Play size={14} /> Kamp Gününü Başlat
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartStudySection;
