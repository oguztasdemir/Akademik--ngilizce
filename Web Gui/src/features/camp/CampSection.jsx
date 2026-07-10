import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { handlePrintPDF, handlePrintCikmisExportPDF, handlePrintCikmisExportDocx, handlePrintCikmisExportXlsx } from './components/CampPrint';
import CampDashboard from './components/CampDashboard';
import CampStudy from './components/CampStudy';
import CampGrammar from './components/CampGrammar';

const campModules = import.meta.glob('../../../../Dataset/**/*.json');

// Helper to resolve dynamically imported dataset modules since Vite alias keys can differ

const deterministicShuffle = (array, seed) => {
  const arr = [...array];
  let mySeed = seed;
  const rnd = () => {
    mySeed = (mySeed * 9301 + 49297) % 233280;
    return mySeed / 233280;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getCampModule = (key) => {
  if (!key) return null;
  const suffix = key.replace(/^@dataset\//, '').replace(/^\//, '');
  const foundKey = Object.keys(campModules).find(k => k.endsWith(suffix));
  return foundKey ? campModules[foundKey] : null;
};

const ACADEMIC_ANTONYMS = {
  "infinite": "finite, limited",
  "early": "late",
  "reject": "accept, approve, admit",
  "expand": "contract, shrink",
  "involuntary": "voluntary, intentional",
  "random": "systematic, planned, ordered",
  "disrupt": "stabilize, organize, restore",
  "displace": "position, place, install",
  "abundant": "scarce, sparse, deficient",
  "accelerate": "decelerate, slow down",
  "accurate": "inaccurate, incorrect, wrong",
  "achieve": "fail, lose, miss",
  "acquire": "lose, forfeit",
  "adequate": "inadequate, insufficient",
  "adverse": "favorable, beneficial",
  "advocate": "oppose, condemn, protest",
  "alter": "preserve, maintain, keep",
  "beneficial": "harmful, detrimental",
  "decline": "increase, rise, grow",
  "enhance": "worsen, diminish, decrease",
  "inevitable": "avoidable, uncertain",
  "profound": "shallow, superficial",
  "reveal": "hide, conceal",
  "significant": "insignificant, minor, trivial",
  "sustain": "destroy, abandon",
  "validate": "invalidate, disprove",
  "abandon": "maintain, keep, pursue",
  "accumulate": "disperse, scatter",
  "adapt": "reject, resist",
  "adhere": "separate, detach",
  "adjust": "disarrange",
  "adopt": "reject, discard",
  "allay": "intensify, worsen",
  "allocate": "withhold, retain",
  "ambiguity": "clarity, certainty",
  "analyze": "synthesize, combine",
  "assess": "ignore, neglect",
  "assume": "know, prove",
  "barrier": "opening, pathway",
  "breakthrough": "setback, failure",
  "challenge": "ease, simplicity",
  "clarify": "confuse, obscure",
  "collaborate": "oppose, compete",
  "comprehensive": "limited, incomplete",
  "crucial": "trivial, minor",
  "demonstrate": "hide, conceal",
  "diverse": "similar, uniform",
  "fluctuate": "stabilize, persist",
  "guarantee": "deny, reject",
  "hypothesis": "fact, certainty",
  "implement": "neglect, ignore",
  "investigate": "ignore, overlook",
  "maintain": "abandon, discontinue",
  "negligible": "significant, important",
  "obtain": "lose, forfeit",
  "predict": "doubt",
  "transfer": "keep, hold",
  "undertake": "abandon, avoid",
  "yield": "resist, withhold",
  "temporary": "permanent, lasting",
  "internal": "external, outer",
  "maximum": "minimum",
  "majority": "minority",
  "increase": "decrease, reduce",
  "create": "destroy, demolish",
  "constant": "variable, unstable",
  "capable": "incapable, incompetent",
  "benefit": "harm, damage",
  "stable": "unstable, volatile",
  "simple": "complex, complicated",
  "visible": "invisible, hidden",
  "positive": "negative",
  "natural": "artificial, synthetic",
  "external": "internal, inner",
  "efficient": "inefficient, wasteful",
  "concentrate": "disperse, distract",
  "combine": "separate, divide",
  "strengthen": "weaken, undermine",
  "preserve": "destroy, alter",
  "precede": "follow, succeed",
  "excess": "deficiency, shortage",
  "exclude": "include, admit",
  "genuine": "fake, false, artificial",
  "vague": "clear, precise, definite",
  "precise": "vague, imprecise, general",
  "acute": "chronic, mild",
  "chronic": "acute",
  "benign": "malignant",
  "malignant": "benign",
  "lethal": "harmless, non-toxic",
  "potent": "weak, ineffective",
  "infectious": "non-infectious",
  "heredity": "environment",
  "sterile": "fertile, contaminated",
  "fertile": "sterile, barren"
};

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

const CampSection = ({ selectedCategory, awardPetXP, triggerConfetti, examsDb, recordWordStat, setActiveStudyInfo, dictDb, addMistake, initialCampType = 'vocabulary', vocabTrack, setVocabTrack, hideSwitcher, setIsStudyingActive }) => {
  // Helper to render Turkish meanings vertically if they contain multiple numbered items
  const renderTurkishMeanings = (text, color = '#34d399', sizeStyle = {}) => {
    if (!text) return null;
    if (/\b\d+\)\s*/.test(text)) {
      const parts = text.split(/(?=\b\d+\))/).map(s => s.trim()).filter(Boolean);
      const gap = sizeStyle.gap || '6px';
      const itemsAlign = sizeStyle.alignItems || 'center';
      const textAlignment = sizeStyle.textAlign || 'center';
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap, alignItems: itemsAlign, textAlign: textAlignment }}>
          {parts.map((p, idx) => (
            <div key={idx} style={{ fontSize: sizeStyle.fontSize || '1.1rem', fontWeight: 'bold', color }}>{p}</div>
          ))}
        </div>
      );
    }
    const { gap, alignItems, textAlign, ...restStyles } = sizeStyle;
    return <h2 style={{ fontSize: sizeStyle.fontSize || '1.45rem', fontWeight: 'bold', margin: 0, color, ...restStyles }}>{text}</h2>;
  };

  const isInitializedRef = useRef(false);
  
  // Camp State Management
  const [progress, setProgress] = useState(null);
  const [totalCampDays, setTotalCampDays] = useState(60);
  const [reportCardType, setReportCardType] = useState('vocabulary'); // 'vocabulary', 'grammar', 'cikmis_kelimeler'
  const [campType, setCampType] = useState(initialCampType); // 'vocabulary', 'grammar', 'cikmis_kelimeler'
  const [cikmisMode, setCikmisMode] = useState('swipe'); // 'swipe' or 'detailed'
  const [grammarProgress, setGrammarProgress] = useState(null);
  const [cikmisProgress, setCikmisProgress] = useState(null);
  const [cikmisPlanData, setCikmisPlanData] = useState({});
  const [vocabPlanData, setVocabPlanData] = useState({});
  const [generalInfoMap, setGeneralInfoMap] = useState({});
  const [studyMode, setStudyMode] = useState(null);

const [cikmisCardFlipped, setCikmisCardFlipped] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [swipeOffsetX, setSwipeOffsetX] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const diff = e.targetTouches[0].clientX - touchStartX;
    setSwipeOffsetX(diff);
  };

  const handleTouchEnd = () => {
    const threshold = 100;
    if (swipeOffsetX > threshold) {
      handleCikmisSwipe(true);
    } else if (swipeOffsetX < -threshold) {
      handleCikmisSwipe(false);
    }
    setSwipeOffsetX(0);
  };
  const [cikmisSwipeResults, setCikmisSwipeResults] = useState({});
  const [cikmisMatchingRound, setCikmisMatchingRound] = useState(0);
  const [cikmisMatchingCards, setCikmisMatchingCards] = useState([]);
  const [cikmisMatchingSelected, setCikmisMatchingSelected] = useState([]);
  const [cikmisMatchingMatched, setCikmisMatchingMatched] = useState([]);
  const [cikmisMatchingMoves, setCikmisMatchingMoves] = useState(0);
  const [cikmisMatchingErrors, setCikmisMatchingErrors] = useState(0);
  const [cikmisMatchingMistakes, setCikmisMatchingMistakes] = useState({});
  const [cikmisQuizIdx, setCikmisQuizIdx] = useState(0);
  const [cikmisQuizSelected, setCikmisQuizSelected] = useState(null);
  const [cikmisQuizChecked, setCikmisQuizChecked] = useState(false);
  const [cikmisQuizCorrect, setCikmisQuizCorrect] = useState(null);
  const [cikmisQuizOptions, setCikmisQuizOptions] = useState([]);
  const [cikmisQuizMistakes, setCikmisQuizMistakes] = useState({});
  const [cikmisTransitionStep, setCikmisTransitionStep] = useState(null); // null or 1, 2, 3, 4
  const [showCikmisExportModal, setShowCikmisExportModal] = useState(false);
  const [activeGrammarDay, setActiveGrammarDay] = useState(null);
  const [grammarQuestions, setGrammarQuestions] = useState([]);
  const [grammarIdx, setGrammarIdx] = useState(0);
  const [grammarSelected, setGrammarSelected] = useState(null);
  const [grammarChecked, setGrammarChecked] = useState(false);
  const [grammarCorrect, setGrammarCorrect] = useState(null);
  const [studyWords, setStudyWords] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState(1); // 1: Learn, 2: Meaning, 3: Synonym, 4: Antonym, 5: Cloze, 6: Day Summary
  const [isStudying, setIsStudying] = useState(false);
  const [examQuestionsMap, setExamQuestionsMap] = useState({});
  const [activeDayWords, setActiveDayWords] = useState({});
  const [allWordsDb, setAllWordsDb] = useState({});
  const [selectedDay, setSelectedDay] = useState(1);
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [showEvaluationChoice, setShowEvaluationChoice] = useState(false);
  const [isEvaluationMode, setIsEvaluationMode] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [viewMode, setViewMode] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [reportCardDay, setReportCardDay] = useState(null);
  const [reportCardWords, setReportCardWords] = useState([]);
  const [loadingReportCard, setLoadingReportCard] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [grammarCampDb, setGrammarCampDb] = useState({});

  const showConfirm = (message, onConfirm, onCancel, showCancel = true) => {
    setConfirmModal({ message, onConfirm, onCancel, showCancel });
  };

  useEffect(() => {
    const loadGrammarCampDb = async () => {
      const category = selectedCategory || 'fen';
      try {
        const mod = await import(`../../../../Dataset/yokdil/${category}/gramer_kampi/grammar_camp.json`);
        setGrammarCampDb(mod.default || mod);
      } catch (e) {
        console.error("Error loading grammar camp db:", e);
      }
    };
    loadGrammarCampDb();
  }, [selectedCategory]);

  useEffect(() => {
    if (setIsStudyingActive) {
      setIsStudyingActive(isStudying);
    }
  }, [isStudying, setIsStudyingActive]);

  useEffect(() => {
    if (isStudying) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainEl = document.querySelector('.app-main');
      if (mainEl) {
        mainEl.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [isStudying]);

  // Question/Test States
  const [meaningOptions, setMeaningOptions] = useState([]);
  const [meaningSelected, setMeaningSelected] = useState(null);
  const [meaningChecked, setMeaningChecked] = useState(false);
  const [meaningCorrect, setMeaningCorrect] = useState(null);

  const [synonymOptions, setSynonymOptions] = useState([]);
  const [synonymSelected, setSynonymSelected] = useState(null);
  const [synonymChecked, setSynonymChecked] = useState(false);
  const [synonymCorrect, setSynonymCorrect] = useState(null);

  const [antonymOptions, setAntonymOptions] = useState([]);
  const [antonymSelected, setAntonymSelected] = useState(null);
  const [antonymChecked, setAntonymChecked] = useState(false);
  const [antonymCorrect, setAntonymCorrect] = useState(null);

  const [clozeOptions, setClozeOptions] = useState([]);
  const [clozeSelected, setClozeSelected] = useState(null);
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeCorrect, setClozeCorrect] = useState(null);
  const [clozeSentenceIndexes, setClozeSentenceIndexes] = useState([]);
  const [clozeMode, setClozeMode] = useState('choice'); // 'choice' or 'write'
  const [clozeInputText, setClozeInputText] = useState('');
  const [clozeShowHint, setClozeShowHint] = useState(false);

  // Stats for the active day
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [wordResults, setWordResults] = useState({}); // tracking per-word correctness

  // Dynamic camp days loader
  useEffect(() => {
    if (initialCampType === 'vocabulary') {
      setTotalCampDays(60);
      return;
    }
    const loadPlanData = () => {
      setTotalCampDays(60);
    };
    loadPlanData();
  }, [selectedCategory, initialCampType]);

  useEffect(() => {
    if (!reportCardDay) {
      setReportCardWords([]);
      return;
    }

    const loadReportData = async () => {
      setLoadingReportCard(true);
      const category = selectedCategory || 'fen';
      
      const isMonthly = (reportCardDay % 28 === 0) || (reportCardDay === totalCampDays);
      const isSec = !isMonthly && ((reportCardDay % 7 === 0) || (reportCardDay === totalCampDays));
      
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
      if (reportCardType === 'cikmis_kelimeler') {
        for (const d of days) {
          const dayWords = cikmisPlanData[String(d)] || [];
          tempWords.push(...dayWords);
        }
      } else {
        for (const d of days) {
          const track = vocabTrack || 'anlam';
          const dailyKelimeKey = `@dataset/yokdil/${category}/gelismis_kelime_kampi/kelime/day_${d}.json`;
          const loadDailyKelime = getCampModule(dailyKelimeKey);
          if (loadDailyKelime) {
            try {
              const kelimeMod = await loadDailyKelime();
              const dailyKelimeData = kelimeMod.default || kelimeMod;
              if (dailyKelimeData && dailyKelimeData.words) {
                let filtered = dailyKelimeData.words || [];
                if (track === 'es_anlam') {
                  filtered = filtered.filter(w => w.synonyms && w.synonyms.trim().length > 0);
                } else if (track === 'zit_anlam') {
                  filtered = filtered.filter(w => w.antonyms && w.antonyms.trim().length > 0);
                }
                tempWords.push(...filtered);
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      }
      setReportCardWords(tempWords);
      setLoadingReportCard(false);
    };

    loadReportData();
  }, [reportCardDay, selectedCategory, totalCampDays, reportCardType]);

  useEffect(() => {
    if (isStudying && setActiveStudyInfo) {
      let progressPercent = 0;
      if (campType === 'grammar' && grammarQuestions.length > 0) {
        progressPercent = phase === 3 ? 100 : Math.round(((phase - 1) * 33) + ((grammarIdx + 1) / grammarQuestions.length * 33));
      } else if (studyWords && studyWords.length > 0) {
        progressPercent = phase === 6 ? 100 : Math.round(((phase - 1) * 20) + ((currentIdx + 1) / studyWords.length * 20));
      }
      setActiveStudyInfo({
        type: 'camp',
        day: selectedDay,
        progress: progressPercent,
        title: campType === 'grammar' ? `Gün #${selectedDay} Gramer` : `Gün #${selectedDay} Kelime`,
        onBack: exitCamp
      });
    } else if (setActiveStudyInfo) {
      setActiveStudyInfo(null);
    }
    return () => {
      if (setActiveStudyInfo) setActiveStudyInfo(null);
    };
  }, [isStudying, selectedDay, phase, currentIdx, studyWords.length, grammarIdx, grammarQuestions.length, campType, setActiveStudyInfo]);

  useEffect(() => {
    setSentenceIdx(0);
  }, [currentIdx, phase]);

  // Extract real exam vocabulary questions dynamically
  useEffect(() => {
    if (!examsDb) return;
    const map = {};

    Object.keys(examsDb).forEach(categoryKey => {
      const categoryExams = examsDb[categoryKey] || [];
      categoryExams.forEach(exam => {
        const questions = exam.questions || [];
        const vocabQuestions = questions.slice(0, 6);
        vocabQuestions.forEach(q => {
          const answerLetter = q.correct_option;
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
        wordMastery: {}
      };
      localStorage.setItem('yokdil_camp_progress', JSON.stringify(initial));
      setProgress(initial);
    }

    // Load grammar progress
    const rawGrammar = localStorage.getItem('yokdil_grammar_camp_progress');
    if (rawGrammar) {
      try {
        const parsed = JSON.parse(rawGrammar);
        if (!parsed.completedDays) parsed.completedDays = {};
        if (typeof parsed.currentDay !== 'number') parsed.currentDay = 1;
        setGrammarProgress(parsed);
      } catch (e) {
        const initial = { currentDay: 1, completedDays: {} };
        localStorage.setItem('yokdil_grammar_camp_progress', JSON.stringify(initial));
        setGrammarProgress(initial);
      }
    } else {
      const initial = { currentDay: 1, completedDays: {} };
      localStorage.setItem('yokdil_grammar_camp_progress', JSON.stringify(initial));
      setGrammarProgress(initial);
    }

    // Load cikmis progress
    const rawCikmis = localStorage.getItem('yokdil_cikmis_camp_progress');
    if (rawCikmis) {
      try {
        const parsed = JSON.parse(rawCikmis);
        if (!parsed.completedDays) parsed.completedDays = {};
        if (typeof parsed.currentDay !== 'number') parsed.currentDay = 1;
        setCikmisProgress(parsed);
      } catch (e) {
        const initial = { currentDay: 1, completedDays: {} };
        localStorage.setItem('yokdil_cikmis_camp_progress', JSON.stringify(initial));
        setCikmisProgress(initial);
      }
    } else {
      const initial = { currentDay: 1, completedDays: {} };
      localStorage.setItem('yokdil_cikmis_camp_progress', JSON.stringify(initial));
      setCikmisProgress(initial);
    }
  }, []);

  // Load camp plan datasets dynamically
  useEffect(() => {
    const loadPlans = async () => {
      const category = selectedCategory || 'fen';
      const categoryDict = (dictDb && dictDb[category]) || {};
      const mappedCikmis = {};
      const mappedVocab = {};

      // Load general info for all three camps immediately first
      const loadedInfo = {};
      const camps = [
        { type: 'cikmis_kelimeler', key: `@dataset/yokdil/${category}/kelime_kampi/00_genel.json` },
        { type: 'vocabulary', key: `@dataset/yokdil/${category}/gelismis_kelime_kampi/00_genel.json` },
        { type: 'grammar', key: `@dataset/yokdil/${category}/gramer_kampi/00_genel.json` }
      ];
      for (const camp of camps) {
        const loadInfo = getCampModule(camp.key);
        if (loadInfo) {
          try {
            const infoMod = await loadInfo();
            loadedInfo[camp.type] = infoMod.default || infoMod;
          } catch (e) {
            console.error(`Failed to load general info for ${camp.type}:`, e);
          }
        }
      }
      setGeneralInfoMap(loadedInfo);
      
      // Load Cikmis Kelimeler plan
      for (let day = 1; day <= 60; day++) {
        const planKey = `@dataset/yokdil/${category}/kelime_kampi/day_${day}.json`;
        const loadPlan = getCampModule(planKey);
        if (loadPlan) {
          try {
            const planMod = await loadPlan();
            const planData = planMod.default || planMod;
            const wordList = planData.words || [];
            mappedCikmis[String(day)] = wordList.map((wObj, idx) => {
              const eng = typeof wObj === 'string' ? wObj : wObj.word;
              return {
                id: idx + 1,
                english: eng,
                turkish: wObj.tr || categoryDict[eng] || "anlamı bulunamadı",
                pronunciation: wObj.pronunciation || ""
              };
            });
          } catch (e) {
            console.error(`Failed to load day ${day} for category ${category}:`, e);
          }
        }
      }
      setCikmisPlanData(mappedCikmis);

      // Load Gelişmiş Kelime Kampı (1500+ academic words) plan
      for (let day = 1; day <= 60; day++) {
        const planKey = `@dataset/yokdil/${category}/gelismis_kelime_kampi/kelime/day_${day}.json`;
        const loadPlan = getCampModule(planKey);
        if (loadPlan) {
          try {
            const planMod = await loadPlan();
            const planData = planMod.default || planMod;
            const wordList = planData.words || [];
            mappedVocab[String(day)] = wordList.map((wObj, idx) => {
              const eng = typeof wObj === 'string' ? wObj : wObj.word;
              return {
                id: idx + 1,
                english: eng,
                turkish: wObj.tr || categoryDict[eng] || "anlamı bulunamadı",
                pronunciation: wObj.pronunciation || "",
                synonyms: wObj.synonyms || "",
                antonyms: wObj.antonyms || "",
                sentences: wObj.sentences || []
              };
            });
          } catch (e) {
            console.error(`Failed to load vocab day ${day} for category ${category}:`, e);
          }
        }
      }
      setVocabPlanData(mappedVocab);
    };
    loadPlans();
  }, [selectedCategory, dictDb]);

  // Load session state from localStorage/hash on category change or mount
  useEffect(() => {
    if (!progress || !grammarProgress || !cikmisProgress) return;
    const category = selectedCategory || 'fen';
    
    // Check hash first
    const hash = window.location.hash;
    const hashParts = hash.split('/');
    
    let isStudyingFromHash = false;
    let selectedDayFromHash = 1;
    let currentIdxFromHash = 0;
    let phaseFromHash = 1;
    let campTypeFromHash = 'vocabulary';
    let grammarIdxFromHash = 0;

    if (hashParts.length >= 7 && hashParts[2] === 'camp') {
      isStudyingFromHash = true;
      campTypeFromHash = hashParts[3];
      selectedDayFromHash = parseInt(hashParts[4].replace('day_', ''), 10) || 1;
      phaseFromHash = parseInt(hashParts[5].replace('phase_', ''), 10) || 1;
      
      if (campTypeFromHash === 'vocabulary') {
        currentIdxFromHash = (parseInt(hashParts[6].replace('word_', ''), 10) - 1) || 0;
      } else if (campTypeFromHash === 'grammar') {
        grammarIdxFromHash = (parseInt(hashParts[6].replace('question_', ''), 10) - 1) || 0;
      }
    } else if (hashParts.length >= 5 && hashParts[2] === 'camp' && hashParts[3] === 'cikmis_kelimeler') {
      isStudyingFromHash = true;
      campTypeFromHash = 'cikmis_kelimeler';
      selectedDayFromHash = parseInt(hashParts[4].replace('day_', ''), 10) || 1;
    }

    if (isStudyingFromHash) {
      setCampType(campTypeFromHash);
      if (campTypeFromHash === 'vocabulary') {
        startDailyStudy(selectedDayFromHash, currentIdxFromHash, phaseFromHash).then(() => {
          isInitializedRef.current = true;
        });
      } else if (campTypeFromHash === 'grammar') {
        startGrammarStudy(selectedDayFromHash, grammarIdxFromHash, phaseFromHash).then(() => {
          isInitializedRef.current = true;
        });
      } else if (campTypeFromHash === 'cikmis_kelimeler') {
        startCikmisStudy(selectedDayFromHash).then(() => {
          isInitializedRef.current = true;
        });
      }
    } else {
      const savedSession = localStorage.getItem(`yokdil_camp_session_${category}`);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed.campType === initialCampType) {
            if (typeof parsed.selectedDay === 'number') setSelectedDay(parsed.selectedDay);
            if (typeof parsed.currentIdx === 'number') setCurrentIdx(parsed.currentIdx);
            if (typeof parsed.phase === 'number') setPhase(parsed.phase);
            setIsStudying(false);
            if (parsed.campType) setCampType(parsed.campType);
            if (typeof parsed.grammarIdx === 'number') setGrammarIdx(parsed.grammarIdx);
          } else {
            setCampType(initialCampType);
            setIsStudying(false);
          }
          isInitializedRef.current = true;
        } catch (e) {
          console.error("Error loading camp session:", e);
          setCampType(initialCampType);
          isInitializedRef.current = true;
        }
      } else {
        setCampType(initialCampType);
        isInitializedRef.current = true;
      }
    }
  }, [selectedCategory, progress, grammarProgress, cikmisProgress]);

  // Save session state to localStorage on state change & update URL hash
  useEffect(() => {
    if (!progress || !grammarProgress || !cikmisProgress) return;
    const category = selectedCategory || 'fen';
    const sessionObj = {
      selectedDay,
      currentIdx,
      phase,
      isStudying,
      campType,
      grammarIdx
    };
    localStorage.setItem(`yokdil_camp_session_${category}`, JSON.stringify(sessionObj));

    // Update URL hash
    if (!isInitializedRef.current) return;
    let newHash = initialCampType === 'cikmis_kelimeler' ? `#/${category}/camp/cikmis_kelimeler` : `#/${category}/camp`;
    if (isStudying) {
      if (campType === 'vocabulary') {
        newHash = `#/${category}/camp/vocabulary/day_${selectedDay}/phase_${phase}/word_${currentIdx + 1}`;
      } else if (campType === 'grammar') {
        newHash = `#/${category}/camp/grammar/day_${selectedDay}/phase_${phase}/question_${grammarIdx + 1}`;
      } else if (campType === 'cikmis_kelimeler') {
        newHash = `#/${category}/camp/cikmis_kelimeler/day_${selectedDay}`;
      }
    }
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  }, [selectedDay, currentIdx, phase, isStudying, campType, grammarIdx, selectedCategory, progress, grammarProgress, cikmisProgress]);

  // Load dictionary fallbacks
  useEffect(() => {
    const loadDictionaries = async () => {
      const category = selectedCategory || 'fen';
      let combinedDb = {};
      try {
        const dictModule = await import(`../../../../Dataset/yokdil/${category}/dictionary.json`);
        if (dictModule.default) {
          combinedDb = { ...dictModule.default };
        }
      } catch (e) {
        console.warn("Could not load dictionary.json:", e);
      }
      setAllWordsDb(combinedDb);
    };
    loadDictionaries();
  }, [selectedCategory]);

  

  // Auto-save active cikmis study session
  useEffect(() => {
    if (!isStudying || campType !== 'cikmis_kelimeler' || !selectedDay) return;
    const category = selectedCategory || 'fen';
    const key = `yokdil_active_cikmis_session_${category}`;
    
    const session = {
      selectedDay,
      studyMode,
      currentIdx,
      cikmisTransitionStep,
      cikmisSwipeResults,
      cikmisMatchingRound,
      cikmisMatchingMoves,
      cikmisMatchingErrors,
      cikmisMatchingMistakes,
      cikmisQuizIdx,
      cikmisQuizMistakes,
      timestamp: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(session));
  }, [
    isStudying,
    campType,
    selectedDay,
    selectedCategory,
    studyMode,
    currentIdx,
    cikmisTransitionStep,
    cikmisSwipeResults,
    cikmisMatchingRound,
    cikmisMatchingMoves,
    cikmisMatchingErrors,
    cikmisMatchingMistakes,
    cikmisQuizIdx,
    cikmisQuizMistakes
  ]); // 'selection', 'swipe', 'matching', 'quiz_en_tr', 'quiz_tr_en', 'quiz_sentence'

  const startDailyStudy = async (dayNum, resumeIdx = null, resumePhase = null) => {
    const category = selectedCategory || 'fen';
    setSelectedDay(dayNum);
    setIsStudying(true);

    const track = vocabTrack || 'anlam';
    const dailyPlanKey = `@dataset/yokdil/${category}/gelismis_kelime_kampi/kelime/day_${dayNum}.json`;
    const loadDaily = getCampModule(dailyPlanKey);
    if (!loadDaily) {
      alert("Bu günün kelime listesi bulunamadı veya henüz hazır değil!");
      setIsStudying(false);
      return;
    }

    try {
      const dailyMod = await loadDaily();
      const dailyData = dailyMod.default || dailyMod;
      if (dailyData && dailyData.words) {
        let rawWords = dailyData.words || [];
        if (track === 'es_anlam') {
          rawWords = rawWords.filter(w => w.synonyms && w.synonyms.trim().length > 0);
        } else if (track === 'zit_anlam') {
          rawWords = rawWords.filter(w => w.antonyms && w.antonyms.trim().length > 0);
        }
        let finalWords = deterministicShuffle(rawWords, dayNum);
        setStudyWords(finalWords);

        // Load correct answers count based on completed state
        const comp = progress.completedDays[dayNum];
        if (comp) {
          const expectedCorr = Math.round((comp.score / 100) * (finalWords.length * 4));
          setCorrectAnswers(expectedCorr);
          setTotalQuestions(finalWords.length * 4);
        } else {
          setCorrectAnswers(0);
          setTotalQuestions(0);
        }

        const initialResults = {};
        finalWords.forEach(w => {
          initialResults[w.word] = true;
        });
        setWordResults(initialResults);

        // Initialize cloze sentence indexes randomly
        const sIndexes = finalWords.map(() => Math.floor(Math.random() * 5));
        setClozeSentenceIndexes(sIndexes);

        const startIdx = resumeIdx !== null ? resumeIdx : 0;
        const startPhase = resumePhase !== null ? resumePhase : 1;
        
        setCurrentIdx(startIdx);
        setPhase(startPhase);

        if (startPhase === 2) {
          setMeaningOptions(getMeaningOptions(finalWords[startIdx].tr, finalWords[startIdx]));
          setMeaningSelected(null);
          setMeaningChecked(false);
        } else if (startPhase === 3) {
          const firstWithSyn = finalWords.findIndex(w => w.synonyms && w.synonyms.trim() !== "" && w.synonyms.trim().toLowerCase() !== "yok");
          const targetIdx = firstWithSyn !== -1 ? firstWithSyn : 0;
          setCurrentIdx(targetIdx);
          setSynonymOptions(getSynonymOptions(finalWords[targetIdx].synonyms.split(',')[0].trim(), finalWords[targetIdx]));
          setSynonymSelected(null);
          setSynonymChecked(false);
        } else if (startPhase === 4) {
          const firstWithAnt = finalWords.findIndex(w => hasAntonym(w));
          const targetIdx = firstWithAnt !== -1 ? firstWithAnt : 0;
          setCurrentIdx(targetIdx);
          const antStr = getAntonym(finalWords[targetIdx]);
          setAntonymOptions(getAntonymOptions(antStr.split(',')[0].trim(), finalWords[targetIdx]));
          setAntonymSelected(null);
          setAntonymChecked(false);
        } else if (startPhase === 5) {
          setCurrentIdx(startIdx);
          setClozeOptions(getClozeOptions(finalWords[startIdx].word));
          setClozeSelected(null);
          setClozeChecked(false);
          setClozeInputText('');
          setClozeShowHint(false);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Kelime listesi yüklenirken hata oluştu.");
      setIsStudying(false);
    }
  };

  const startCikmisStudy = async (dayNum, mode = 'selection', skipConfirmCheck = false) => {
    const category = selectedCategory || 'fen';
    
    // Check if there is an active session for this day to resume
    const sessionKey = `yokdil_active_cikmis_session_${category}`;
    const rawSession = localStorage.getItem(sessionKey);
    if (rawSession && !skipConfirmCheck) {
      try {
        const session = JSON.parse(rawSession);
        if (session && session.selectedDay === dayNum) {
          showConfirm(
            "Bu güne ait yarıda kalmış bir çalışmanız var. Kaldığınız yerden devam etmek ister misiniz?",
            () => {
              // Confirm resume: load states
              setSelectedDay(dayNum);
              setCampType('cikmis_kelimeler');
              const dayWords = cikmisPlanData[String(dayNum)] || [];
              const shuffledWords = deterministicShuffle(dayWords, dayNum);
              setStudyWords(shuffledWords);
              setIsStudying(true);
              
              setStudyMode(session.studyMode || 'swipe');
              setCurrentIdx(session.currentIdx || 0);
              setCikmisTransitionStep(session.cikmisTransitionStep !== undefined ? session.cikmisTransitionStep : null);
              setCikmisSwipeResults(session.cikmisSwipeResults || {});
              setCikmisMatchingRound(session.cikmisMatchingRound || 0);
              setCikmisMatchingMoves(session.cikmisMatchingMoves || 0);
              setCikmisMatchingErrors(session.cikmisMatchingErrors || 0);
              setCikmisMatchingMistakes(session.cikmisMatchingMistakes || {});
              setCikmisQuizIdx(session.cikmisQuizIdx || 0);
              setCikmisQuizMistakes(session.cikmisQuizMistakes || {});
              
              setCikmisCardFlipped(false);
              setCikmisQuizSelected(null);
              setCikmisQuizChecked(false);
              setCikmisQuizCorrect(null);
              
              if (session.studyMode === 'matching') {
                initCikmisMatchingRound(dayWords, session.cikmisMatchingRound || 0);
              } else if (session.studyMode && session.studyMode.startsWith('quiz')) {
                const quizType = session.studyMode === 'quiz_en_tr' ? 'en_tr' : 'tr_en';
                generateCikmisQuizOptions(quizType, session.cikmisQuizIdx || 0, dayWords);
              }
            },
            () => {
              // Cancel/Reset: remove session and load fresh
              localStorage.removeItem(sessionKey);
              startCikmisStudy(dayNum, mode, true);
            }
          );
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    setSelectedDay(dayNum);
    setCampType('cikmis_kelimeler');

    const dayWords = cikmisPlanData[String(dayNum)];
    if (!dayWords || dayWords.length === 0) {
      alert("Bu güne ait kelime verisi bulunamadı!");
      return;
    }

    const shuffledWords = deterministicShuffle(dayWords, dayNum);
    setStudyWords(shuffledWords);
    setIsStudying(true);
    setStudyMode(mode === 'detailed' ? 'swipe' : mode);
    setPhase(1);
    setCurrentIdx(0);
    setCikmisCardFlipped(false);
    setCikmisSwipeResults({});
    setCikmisMatchingMistakes({});

    if (mode === 'matching') {
      setCikmisMatchingRound(0);
      setCikmisMatchingMoves(0);
      setCikmisMatchingErrors(0);
      initCikmisMatchingRound(dayWords, 0);
    }
  };;;

  const initCikmisMatchingRound = (wordsList, roundIdx) => {
    const start = roundIdx * 6;
    const end = Math.min((roundIdx + 1) * 6, wordsList.length);
    const roundWords = wordsList.slice(start, end);

    const cardPool = [];
    roundWords.forEach(item => {
      cardPool.push({ id: `${item.id}-eng`, text: item.english, matchId: item.id, lang: 'eng' });
      cardPool.push({ id: `${item.id}-tr`, text: item.turkish, matchId: item.id, lang: 'tr' });
    });

    setCikmisMatchingCards(cardPool.sort(() => 0.5 - Math.random()));
    setCikmisMatchingSelected([]);
    setCikmisMatchingMatched([]);
  };

  const handleCikmisMatchingCardClick = (idx) => {
    if (cikmisMatchingSelected.length === 2 || cikmisMatchingSelected.includes(idx) || cikmisMatchingMatched.includes(cikmisMatchingCards[idx].matchId)) return;
    const newSelected = [...cikmisMatchingSelected, idx];
    setCikmisMatchingSelected(newSelected);

    if (newSelected.length === 2) {
      setCikmisMatchingMoves(prev => prev + 1);
      const card1 = cikmisMatchingCards[newSelected[0]];
      const card2 = cikmisMatchingCards[newSelected[1]];

      if (card1.matchId === card2.matchId && card1.lang !== card2.lang) {
        setCikmisMatchingMatched(prev => [...prev, card1.matchId]);
        setCikmisMatchingSelected([]);

        const roundTotal = cikmisMatchingCards.length / 2;
        if (cikmisMatchingMatched.length + 1 === roundTotal) {
          // Round completed!
          const nextRound = cikmisMatchingRound + 1;
          const totalRounds = Math.ceil(studyWords.length / 6);
          if (nextRound < totalRounds) {
            setTimeout(() => {
              setCikmisMatchingRound(nextRound);
              initCikmisMatchingRound(studyWords, nextRound);
            }, 800);
          } else {
            // All rounds completed!
            setTimeout(() => {
              setCikmisTransitionStep(2);
            }, 800);
          }
        }
      } else {
        setCikmisMatchingErrors(prev => prev + 1);
        const w1 = studyWords.find(w => w.id === card1.matchId);
        const w2 = studyWords.find(w => w.id === card2.matchId);
        if (w1) setCikmisMatchingMistakes(prev => ({ ...prev, [w1.english]: true }));
        if (w2) setCikmisMatchingMistakes(prev => ({ ...prev, [w2.english]: true }));
        setTimeout(() => setCikmisMatchingSelected([]), 1000);
      }
    }
  };

  const generateCikmisQuizOptions = (mode, idx, currentWords = studyWords) => {
    const current = currentWords[idx];
    if (!current) return;

    let correctVal = '';
    let pool = [];

    if (mode === 'en_tr') {
      correctVal = current.turkish;
      pool = currentWords.filter(w => w.id !== current.id).map(w => w.turkish);
    } else {
      correctVal = current.english;
      pool = currentWords.filter(w => w.id !== current.id).map(w => w.english);
    }

    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
    const distractors = shuffledPool.slice(0, 3);
    const options = [correctVal, ...distractors].sort(() => 0.5 - Math.random());
    setCikmisQuizOptions(options);
  };

  const getCikmisWordSentence = (wordObj) => {
    const category = selectedCategory || 'fen';
    const dict = dictDb[category] || [];
    
    const dictEntry = dict.find(item => 
      item.word.toLowerCase() === wordObj.english.toLowerCase() ||
      wordObj.english.toLowerCase().startsWith(item.word.toLowerCase()) ||
      item.word.toLowerCase().startsWith(wordObj.english.toLowerCase())
    );

    if (dictEntry && dictEntry.sentence) {
      return {
        sentence: dictEntry.sentence,
        translation: dictEntry.sentence_tr || ''
      };
    }

    return {
      sentence: `The word "${wordObj.english}" plays an important role in academic research.`,
      translation: `"${wordObj.turkish}" kelimesi akademik araştırmalarda önemli bir rol oynar.`
    };
  };

  const getBlankedCikmisSentence = (sentence, word) => {
    if (!sentence) return '';
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    let blanked = sentence.replace(regex, '______');
    if (blanked === sentence) {
      const parts = word.split(' ');
      parts.forEach(p => {
        if (p.length > 3) {
          const looseRegex = new RegExp(p, 'gi');
          blanked = blanked.replace(looseRegex, '______');
        }
      });
    }
    return blanked;
  };

  const handleCikmisQuizCheck = (option) => {
    if (cikmisQuizChecked) return;
    setCikmisQuizSelected(option);
    setCikmisQuizChecked(true);

    const currentWord = studyWords[cikmisQuizIdx];
    let correct = false;

    if (studyMode === 'quiz_en_tr') {
      correct = option === currentWord.turkish;
    } else if (studyMode === 'quiz_tr_en') {
      correct = option === currentWord.english;
    } else if (studyMode === 'quiz_sentence') {
      correct = option.toLowerCase() === currentWord.english.toLowerCase();
    }

    setCikmisQuizCorrect(correct);

    if (!correct) {
      setCikmisQuizMistakes(prev => ({ ...prev, [currentWord.english]: true }));
      addMistake?.(currentWord.english, currentWord.turkish, `cikmis_${studyMode}`);
    }
  };

  const handleCikmisQuizNext = () => {
    if (cikmisQuizIdx < studyWords.length - 1) {
      const nextIdx = cikmisQuizIdx + 1;
      setCikmisQuizIdx(nextIdx);
      setCikmisQuizSelected(null);
      setCikmisQuizChecked(false);
      setCikmisQuizCorrect(null);
      
      const modeType = studyMode === 'quiz_en_tr' ? 'en_tr' : 'tr_en';
      generateCikmisQuizOptions(modeType, nextIdx);
    } else {
      if (studyMode === 'quiz_en_tr') {
        setCikmisTransitionStep(3);
      } else if (studyMode === 'quiz_tr_en') {
        setCikmisTransitionStep(4);
      } else if (studyMode === 'quiz_sentence') {
        const totalWords = studyWords.length;
        const totalUniqueMistakes = Object.keys(cikmisQuizMistakes).length;
        const score = Math.max(20, Math.round(((totalWords - totalUniqueMistakes) / totalWords) * 100) - Math.min(20, cikmisMatchingErrors * 2));
        completeCikmisStudy(score);
      }
    }
  };

  const handleExportCikmisData = () => {
    setShowCikmisExportModal(true);
  };

  const triggerCikmisExport = async (format) => {
    const category = selectedCategory || 'fen';
    try {
      const cikmisDoneMap = cikmisProgress.completedDays || {};

      const studiedWords = [];
      const unstudiedWords = [];

      for (let day = 1; day <= 60; day++) {
        const dayWords = cikmisPlanData[String(day)] || [];
        const dayRecord = cikmisDoneMap[day];
        
        const isCompleted = dayRecord ? (
          cikmisMode === 'swipe'
            ? (dayRecord.swipeCompleted !== undefined ? !!dayRecord.swipeCompleted : true)
            : (dayRecord.detailedCompleted !== undefined ? !!dayRecord.detailedCompleted : true)
        ) : false;

        const historyList = dayRecord?.history || [];
        const matchingAttempts = historyList.filter(h => h.cikmisMode === cikmisMode);
        const latestAttempt = matchingAttempts.length > 0 ? matchingAttempts[matchingAttempts.length - 1] : dayRecord;

        const resultsMap = latestAttempt ? (
          cikmisMode === 'swipe'
            ? latestAttempt.swipeResults || latestAttempt.resultsMap || {}
            : latestAttempt.detailedResults || latestAttempt.resultsMap || {}
        ) : {};

        if (isCompleted) {
          dayWords.forEach(w => {
            const isKnown = resultsMap[w.english] !== false;
            studiedWords.push({
              english: w.english,
              turkish: w.turkish,
              pronunciation: w.pronunciation || '',
              status: isKnown
            });
          });
        } else {
          dayWords.forEach(w => {
            unstudiedWords.push({
              english: w.english,
              turkish: w.turkish,
              pronunciation: w.pronunciation || ''
            });
          });
        }
      }

      if (format === 'pdf') {
        handlePrintCikmisExportPDF(studiedWords, unstudiedWords, cikmisMode, category);
      } else if (format === 'docx') {
        handlePrintCikmisExportDocx(studiedWords, unstudiedWords, cikmisMode, category);
      } else if (format === 'xlsx') {
        handlePrintCikmisExportXlsx(studiedWords, unstudiedWords, cikmisMode, category);
      }
      setShowCikmisExportModal(false);
    } catch (e) {
      console.error(e);
      alert("Veriler hazırlanırken bir hata oluştu.");
    }
  };

  const triggerVocabExport = async (format) => {
    const category = selectedCategory || 'fen';
    try {
      const vocabDoneMap = progress?.completedDays || {};
      const studiedWords = [];
      const unstudiedWords = [];

      for (let day = 1; day <= 60; day++) {
        const suffix = `yokdil/${category}/gelismis_kelime_kampi/kelime/day_${day}.json`;
        const foundKey = Object.keys(campModules).find(k => k.endsWith(suffix));
        let dayWords = [];
        if (foundKey) {
          const loader = campModules[foundKey];
          const module = await loader();
          const data = module.default || module;
          let rawWords = data.words || [];
          if (vocabTrack === 'es_anlam') {
            rawWords = rawWords.filter(w => w.synonyms && w.synonyms.trim().length > 0);
          } else if (vocabTrack === 'zit_anlam') {
            rawWords = rawWords.filter(w => w.antonyms && w.antonyms.trim().length > 0);
          }
          dayWords = rawWords;
        }

        const dayRecord = vocabDoneMap[day];
        const isCompleted = dayRecord ? !!dayRecord.isPassed : false;
        const resultsMap = dayRecord?.resultsMap || {};

        if (isCompleted) {
          dayWords.forEach(w => {
            const eng = w.word;
            const trVal = w.tr;
            const isKnown = resultsMap[eng] !== undefined 
              ? resultsMap[eng] === true 
              : ((progress?.wordMastery?.[eng] || 0) >= 2 || true);

            studiedWords.push({
              english: eng,
              turkish: trVal,
              pronunciation: w.pronunciation || '',
              status: isKnown
            });
          });
        } else {
          dayWords.forEach(w => {
            unstudiedWords.push({
              english: w.word,
              turkish: w.tr,
              pronunciation: w.pronunciation || ''
            });
          });
        }
      }

      if (format === 'pdf') {
        handlePrintCikmisExportPDF(studiedWords, unstudiedWords, 'Gelişmiş Kelime Kampı', category);
      } else if (format === 'docx') {
        handlePrintCikmisExportDocx(studiedWords, unstudiedWords, 'Gelişmiş Kelime Kampı', category);
      } else if (format === 'xlsx') {
        handlePrintCikmisExportXlsx(studiedWords, unstudiedWords, 'Gelişmiş Kelime Kampı', category);
      }
    } catch (e) {
      console.error(e);
      alert("Veriler hazırlanırken bir hata oluştu.");
    }
  };

  const completeCikmisStudy = (score, finalResultsMap = null) => {
    const isPassed = score >= 60;
    const dayNum = selectedDay;
    const category = selectedCategory || 'fen';

    const resultsMap = {};
    if (cikmisMode === 'swipe') {
      const activeResults = finalResultsMap || cikmisSwipeResults;
      studyWords.forEach(w => {
        resultsMap[w.english] = !!activeResults[w.english];
      });
    } else {
      studyWords.forEach(w => {
        resultsMap[w.english] = !cikmisMatchingMistakes[w.english] && !cikmisQuizMistakes[w.english];
      });
    }

    const newCompleted = { ...cikmisProgress.completedDays };
    const currentDayRecord = cikmisProgress.completedDays[dayNum] || {};
    
    const updatedRecord = {
      ...currentDayRecord,
      date: new Date().toLocaleDateString(),
    };

    if (cikmisMode === 'swipe') {
      updatedRecord.swipeCompleted = true;
      updatedRecord.swipeScore = score;
      updatedRecord.swipePassed = isPassed;
      updatedRecord.swipeResults = resultsMap;
    } else {
      updatedRecord.detailedCompleted = true;
      updatedRecord.detailedScore = score;
      updatedRecord.detailedPassed = isPassed;
      updatedRecord.detailedResults = resultsMap;
    }

    updatedRecord.score = Math.max(updatedRecord.swipeScore || 0, updatedRecord.detailedScore || 0);
    updatedRecord.isPassed = updatedRecord.swipePassed || updatedRecord.detailedPassed;

    let oldHistory = [];
    if (currentDayRecord.history) {
      oldHistory = [...currentDayRecord.history];
    } else if (currentDayRecord.score !== undefined) {
      oldHistory = [{
        score: currentDayRecord.score,
        isPassed: currentDayRecord.isPassed,
        date: currentDayRecord.date || new Date().toLocaleDateString(),
        swipeResults: currentDayRecord.swipeResults
      }];
    }

    updatedRecord.history = [
      ...oldHistory,
      {
        score: score,
        isPassed: isPassed,
        date: new Date().toLocaleDateString(),
        cikmisMode: cikmisMode,
        resultsMap: resultsMap,
        swipeResults: resultsMap
      }
    ];

    newCompleted[dayNum] = updatedRecord;

    let nextDay = cikmisProgress.currentDay;
    if (isPassed && dayNum === cikmisProgress.currentDay) {
      nextDay = cikmisProgress.currentDay + 1;
    }

    const newProg = {
      ...cikmisProgress,
      currentDay: nextDay,
      completedDays: newCompleted
    };

    saveCikmisProgress(newProg);
    
    if (isPassed) {
      awardPetXP?.(45);
      triggerConfetti?.();
    }
    
    // Clear active study session on completion
    localStorage.removeItem(`yokdil_active_cikmis_session_${category}`);
    
    exitCamp();
  };

  if (!progress || !grammarProgress || !cikmisProgress) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Yükleniyor...</div>;
  }

  const saveProgress = (newProg) => {
    setProgress(newProg);
    localStorage.setItem('yokdil_camp_progress', JSON.stringify(newProg));
  };

  const saveGrammarProgress = (newProg) => {
    setGrammarProgress(newProg);
    localStorage.setItem('yokdil_grammar_camp_progress', JSON.stringify(newProg));
  };

  const saveCikmisProgress = (newProg) => {
    setCikmisProgress(newProg);
    localStorage.setItem('yokdil_cikmis_camp_progress', JSON.stringify(newProg));
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
      semanticInsight = `Hatalarınızın önemli bir kısmı **'Engelleme / Azalba / Olumsuz Durum'** bildiren akademik kelimelerden (${categories.negative.slice(0, 3).map(w => `<code>${w}</code>`).join(', ')}) oluşuyor. Bu kelimelerin cümledeki zıtlık bağlaçlarıyla (but, although, however) kullanım sıklığı yüksektir.`;
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

  const areMeaningsConflicting = (m1, m2) => {
    const clean = (text) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    const w1 = clean(m1);
    const w2 = clean(m2);
    return w1.some(x => w2.includes(x)) || w2.some(x => w1.includes(x));
  };

  const getMeaningOptions = (correctMeaning, currentWordObj) => {
    const allMeanings = Object.values(allWordsDb).map(v => {
      if (typeof v === 'string') return v.split('|')[0].trim();
      return v?.tr || v?.turkish;
    }).filter(Boolean);
    const filtered = allMeanings.filter(m => {
      if (m.toLowerCase().trim() === correctMeaning.toLowerCase().trim()) return false;
      return !areMeaningsConflicting(correctMeaning, m);
    });

    const uniqueFiltered = Array.from(new Set(filtered)).sort(() => Math.random() - 0.5);
    const options = [correctMeaning, ...uniqueFiltered.slice(0, 3)];
    return options.sort(() => Math.random() - 0.5);
  };

  const getSynonymOptions = (correctSynonym, currentWordObj) => {
    const allSyns = Object.values(allWordsDb).map(v => {
        const val = typeof v === 'string' ? v.split('|')[2] || '' : (v.synonyms || '');
        return val.split(',')[0].trim();
    }).filter(Boolean);
    const filtered = allSyns.filter(s => {
      if (s.toLowerCase().trim() === correctSynonym.toLowerCase().trim()) return false;
      if (currentWordObj && currentWordObj.word.toLowerCase() === s.toLowerCase()) return false;
      return true;
    });

    const uniqueFiltered = Array.from(new Set(filtered)).sort(() => Math.random() - 0.5);
    const options = [correctSynonym, ...uniqueFiltered.slice(0, 3)];
    return options.sort(() => Math.random() - 0.5);
  };

  const getWordFromDict = (wordStr) => {
    if (!wordStr || !allWordsDb) return null;
    const cleanStr = wordStr.toLowerCase().trim();
    const entry = allWordsDb[cleanStr] || dictDb?.[cleanStr];
    if (!entry) return null;
    if (typeof entry === 'string') {
      return {
        tr: entry.split('|')[0].trim(),
        turkish: entry.split('|')[0].trim(),
        synonyms: '',
        type: 'noun'
      };
    }
    return entry;
  };

  const getAntonym = (wordObj) => {
    if (!wordObj) return 'Yok';
    const rawAntonym = ACADEMIC_ANTONYMS[wordObj.word.toLowerCase().trim()];
    if (rawAntonym) return rawAntonym;
    if (wordObj.antonyms) {
      if (Array.isArray(wordObj.antonyms)) {
        if (wordObj.antonyms.length > 0) return wordObj.antonyms.join(', ');
      } else if (typeof wordObj.antonyms === 'string' && wordObj.antonyms.trim() !== "" && wordObj.antonyms.trim().toLowerCase() !== "yok") {
        return wordObj.antonyms;
      }
    }
    return 'Yok';
  };

  const getAntonymWithTranslation = (wordObj) => {
    const antonymsStr = getAntonym(wordObj);
    if (antonymsStr === 'Yok') return [];
    const antonymList = antonymsStr.split(',').map(a => a.trim());
    const translatedList = antonymList.map(ant => {
      const match = getWordFromDict(ant);
      return {
        eng: ant,
        tr: match ? (match.tr || match.turkish || null) : null
      };
    });
    return translatedList;
  };

  const getTranslation = (wordStr) => {
    const match = getWordFromDict(wordStr);
    return match ? (match.tr || match.turkish || '') : '';
  };

  const translateCollocation = (coll, word, wordMeaning) => {
    const cleanWord = word.toLowerCase().trim();
    const cleanColl = coll.toLowerCase().trim();
    if (cleanColl.includes('conduct a study')) return 'çalışma yürütmek';
    if (cleanColl.includes('conduct research')) return 'araştırma yapmak';
    if (cleanColl.includes('conduct an experiment')) return 'deney yapmak';
    if (cleanColl.includes('adverse effect')) return 'olumsuz etki';
    if (cleanColl.includes('adverse reaction')) return 'yan etki, olumsuz reaksiyon';
    if (cleanColl.includes('adverse weather')) return 'olumsuz hava koşulları';
    if (cleanColl.includes('gain knowledge')) return 'bilgi edinmek';
    if (cleanColl.includes('acquire skills')) return 'beceri edinmek';
    if (cleanColl.includes('profound effect')) return 'derin/büyük etki';
    if (cleanColl.includes('profound impact')) return 'derin/büyük etki';
    return '';
  };

  const getEnglishForMeaningOption = (turkishTr) => {
    if (!turkishTr || !allWordsDb) return '';
    const cleanTr = turkishTr.toLowerCase().trim();
    const found = Object.entries(allWordsDb).find(([eng, val]) => val && val.tr && val.tr.toLowerCase().trim() === cleanTr);
    return found ? found[0] : '';
  };

  const getSentenceEn = (wordObj) => {
    if (!wordObj) return '';
    if (wordObj.sentences && wordObj.sentences.length > sentenceIdx) {
      return wordObj.sentences[sentenceIdx].en;
    }
    return wordObj.sentence_en || wordObj.sentence || '';
  };

  const getSentenceTr = (wordObj) => {
    if (!wordObj) return '';
    if (wordObj.sentences && wordObj.sentences.length > sentenceIdx) {
      return wordObj.sentences[sentenceIdx].tr;
    }
    return wordObj.sentence_tr || wordObj.tr_sentence || '';
  };

  const getSynonymsList = (wordObj) => {
    if (!wordObj || !wordObj.synonyms) return [];
    let synArray = [];
    if (Array.isArray(wordObj.synonyms)) {
      synArray = wordObj.synonyms;
    } else if (typeof wordObj.synonyms === 'string' && wordObj.synonyms.trim() !== "" && wordObj.synonyms.trim().toLowerCase() !== "yok") {
      synArray = wordObj.synonyms.split(',').map(s => s.trim());
    }
    return synArray.map(syn => ({
      eng: syn,
      tr: getTranslation(syn)
    }));
  };

  const getAntonymsList = (wordObj) => {
    return getAntonymWithTranslation(wordObj);
  };

  const getCollocationsList = (wordObj) => {
    if (!wordObj || !wordObj.collocations) return [];
    let collArray = [];
    if (Array.isArray(wordObj.collocations)) {
      collArray = wordObj.collocations;
    } else if (typeof wordObj.collocations === 'string' && wordObj.collocations.trim() !== "" && wordObj.collocations.trim().toLowerCase() !== "yok") {
      collArray = wordObj.collocations.split(',').map(c => c.trim());
    }
    return collArray.map(coll => ({
      eng: coll,
      tr: translateCollocation(coll, wordObj.word, wordObj.tr)
    }));
  };

  const hasAntonym = (wordObj) => {
    return getAntonym(wordObj) !== 'Yok';
  };

  const getAntonymOptions = (correctAntonym, currentWordObj) => {
    const allAnts = Object.values(ACADEMIC_ANTONYMS).map(s => s.split(',')[0].trim());
    const uniqueFiltered = Array.from(new Set(allAnts)).sort(() => Math.random() - 0.5);
    const options = [correctAntonym, ...uniqueFiltered.slice(0, 3)];
    return options.sort(() => Math.random() - 0.5);
  };

  const getBlankedSentence = (wordObj, idx) => {
    if (!wordObj) return '';
    let sentence = "";
    let wordToBlank = wordObj.word.toLowerCase();
    
    const sentenceIndex = clozeSentenceIndexes[idx] !== undefined ? clozeSentenceIndexes[idx] : 0;
    
    if (wordObj.sentences && wordObj.sentences.length > sentenceIndex) {
      sentence = wordObj.sentences[sentenceIndex].en;
    } else {
      sentence = wordObj.sentence_en || wordObj.sentence || '';
    }

    const escaped = wordToBlank.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}(s|ed|ing|d|es|ly)?\\b`, 'gi');
    return sentence.replace(regex, '_______');
  };

  const getClozeOptions = (correctWord) => {
    const allWords = studyWords.map(w => w.word);
    const filtered = allWords.filter(w => w !== correctWord);
    const options = [correctWord, ...filtered.slice(0, 3)];
    return options.sort(() => Math.random() - 0.5);
  };

  

const handleCikmisSwipeBack = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      const prevWord = studyWords[prevIdx];
      
      const newResults = { ...cikmisSwipeResults };
      delete newResults[prevWord.english];
      
      setCikmisSwipeResults(newResults);
      setCurrentIdx(prevIdx);
      setCikmisCardFlipped(false);
    }
  };

  const handleCikmisSwipe = (known) => {
    const currentWord = studyWords[currentIdx];
    const newResults = { ...cikmisSwipeResults, [currentWord.english]: known };
    setCikmisSwipeResults(newResults);
    
    if (currentIdx < studyWords.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setCikmisCardFlipped(false);
    } else {
      // Finished swipe!
      const knownCount = Object.values(newResults).filter(v => v === true).length;
      const score = Math.round((knownCount / studyWords.length) * 100);
      
      if (cikmisMode === 'swipe') {
        completeCikmisStudy(score, newResults);
      } else {
        // Detailed mode: Transition to Step 2 (Kelime Eşleştirme)
        setCikmisTransitionStep(1);
      }
    }
  };

  const renderCikmisStudy = () => {
    // 1. Render Transition Steps
    if (cikmisTransitionStep !== null) {
      let stepTitle = '';
      let stepDesc = '';
      let buttonText = '';
      let nextAction = () => {};

      if (cikmisTransitionStep === 1) {
        stepTitle = 'Adım 1 Tamamlandı! 🎉';
        stepDesc = 'Hızlı kart kaydırma alıştırmasını bitirdiniz. Şimdi öğrendiklerinizi pekiştirmek için Adım 2: Kelime Eşleştirme çalışmasına geçiyorsunuz.';
        buttonText = 'Eşleştirmeye Başla 🚀';
        nextAction = () => {
          setStudyMode('matching');
          setCikmisMatchingRound(0);
          setCikmisMatchingMoves(0);
          setCikmisMatchingErrors(0);
          initCikmisMatchingRound(studyWords, 0);
          setCikmisTransitionStep(null);
        };
      } else if (cikmisTransitionStep === 2) {
        stepTitle = 'Adım 2 Tamamlandı! 🧩';
        stepDesc = 'Tebrikler, tüm kelimeleri başarıyla eşleştirdiniz! Şimdi kelimelerin Türkçe karşılıklarını test edeceğimiz Adım 3: İngilizce ➔ Türkçe Test aşamasına geçiyorsunuz.';
        buttonText = 'Testi Başlat 🚀';
        nextAction = () => {
          setStudyMode('quiz_en_tr');
          setCikmisQuizIdx(0);
          setCikmisQuizSelected(null);
          setCikmisQuizChecked(false);
          setCikmisQuizCorrect(null);
          generateCikmisQuizOptions('en_tr', 0);
          setCikmisTransitionStep(null);
        };
      } else if (cikmisTransitionStep === 3) {
        stepTitle = 'Adım 3 Tamamlandı! 🧠';
        stepDesc = 'Harika! İngilizce kelimelerin anlamlarını başarıyla tanımladınız. Şimdi Türkçe anlamı verilen kelimenin İngilizce karşılığını seçeceğimiz Adım 4: Türkçe ➔ İngilizce Test başlıyor.';
        buttonText = 'Testi Başlat 🚀';
        nextAction = () => {
          setStudyMode('quiz_tr_en');
          setCikmisQuizIdx(0);
          setCikmisQuizSelected(null);
          setCikmisQuizChecked(false);
          setCikmisQuizCorrect(null);
          generateCikmisQuizOptions('tr_en', 0);
          setCikmisTransitionStep(null);
        };
      } else if (cikmisTransitionStep === 4) {
        stepTitle = 'Adım 4 Tamamlandı! 🏆';
        stepDesc = 'Çok iyi! Şimdi son adım olan ve kelimeleri gerçek akademik cümle bağlamında pekiştireceğimiz Adım 5: Örnek Cümle Tamamlama testine geçiyorsunuz.';
        buttonText = 'Son Aşamayı Başlat 🚀';
        nextAction = () => {
          setStudyMode('quiz_sentence');
          setCikmisQuizIdx(0);
          setCikmisQuizSelected(null);
          setCikmisQuizChecked(false);
          setCikmisQuizCorrect(null);
          generateCikmisQuizOptions('tr_en', 0); // sentence options are English words
          setCikmisTransitionStep(null);
        };
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '20px', color: 'white', textAlign: 'center', padding: '30px', maxWidth: '500px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '40px 30px', borderRadius: '24px', border: '1.5px solid rgba(99, 102, 241, 0.3)', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0.4) 100%)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#a5b4fc', marginBottom: '14px', marginTop: 0 }}>{stepTitle}</h2>
            <p style={{ fontSize: '0.92rem', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '28px' }}>{stepDesc}</p>
            <button
              onClick={nextAction}
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.94rem', background: '#6366f1', borderColor: '#6366f1', cursor: 'pointer' }}
            >
              {buttonText}
            </button>
          </div>
        </div>
      );
    }

    if (studyMode === 'swipe') {
      const currentWord = studyWords[currentIdx];
      const progressPercent = Math.round(((currentIdx) / studyWords.length) * 100);

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', gap: '20px', color: 'white', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
              <span>Kart Kaydırma Egzersizi</span>
              <span>{currentIdx + 1} / {studyWords.length} Kelime</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #ef4444, #34d399)', transition: 'width 0.2s' }}></div>
            </div>
          </div>

          <div 
            onClick={() => setCikmisCardFlipped(!cikmisCardFlipped)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="glass-card" 
            style={{ 
              width: '100%', 
              minHeight: '260px', 
              borderRadius: '24px', 
              border: '2px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '30px', 
              cursor: 'pointer', 
              position: 'relative', 
              textAlign: 'center',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
              transform: `translateX(${swipeOffsetX}px) rotate(${swipeOffsetX * 0.04}deg)`,
              transition: swipeOffsetX === 0 ? 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none',
              touchAction: 'none'
            }}
          >
            {!cikmisCardFlipped ? (
              <div>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '900', margin: 0 }}>{currentWord.english}</h1>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '6px' }}>Telaffuz ve Türkçe anlamını görmek için tıkla</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '900', margin: 0, color: '#fca5a5' }}>{currentWord.english}</h1>
                {currentWord.pronunciation && (
                  <span style={{ fontSize: '1rem', color: '#94a3b8', fontStyle: 'italic' }}>/{currentWord.pronunciation}/</span>
                )}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', width: '120px', margin: '4px auto' }}></div>
                {renderTurkishMeanings(currentWord.turkish, '#34d399', { fontSize: '1.35rem', gap: '8px' })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '14px', width: '100%', marginTop: '10px' }}>
            <button 
              onClick={() => handleCikmisSwipe(false)} 
              className="btn-secondary" 
              style={{ flex: 1, padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', fontWeight: 'bold' }}
            >
              ❌ Bilmiyorum
            </button>
            <button 
              onClick={() => handleCikmisSwipe(true)} 
              className="btn-primary" 
              style={{ flex: 1, padding: '14px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#a7f3d0', fontWeight: 'bold' }}
            >
              ✔️ Biliyorum
            </button>
          </div>
          {currentIdx > 0 && (
            <button 
              onClick={handleCikmisSwipeBack} 
              className="btn-secondary" 
              style={{ width: '100%', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: '0.82rem', fontWeight: '600', marginTop: '6px' }}
            >
              ↩️ Önceki Kelimeye Geri Dön
            </button>
          )}

          <button onClick={exitCamp} className="btn-secondary" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.74rem', cursor: 'pointer', marginTop: '10px' }}>
            ⬅️ Çalışmadan Çık
          </button>
        </div>
      );
    }

    if (studyMode === 'matching') {
      const totalRounds = Math.ceil(studyWords.length / 6);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', gap: '20px', color: 'white', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#6366f1', textTransform: 'uppercase' }}>🧩 KELİME EŞLEŞTİRME</span>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#94a3b8', margin: '2px 0 0 0' }}>Bölüm {cikmisMatchingRound + 1} / {totalRounds}</h3>
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#cbd5e1' }}>
              <span>Hamle: <strong style={{ color: 'white' }}>{cikmisMatchingMoves}</strong></span>
              <span>Hata: <strong style={{ color: '#f87171' }}>{cikmisMatchingErrors}</strong></span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', width: '100%' }}>
            {cikmisMatchingCards.map((card, idx) => {
              const isSel = cikmisMatchingSelected.includes(idx);
              const isMatch = cikmisMatchingMatched.includes(card.matchId);
              
              let cardBg = 'rgba(255,255,255,0.02)';
              let cardBorder = '1px solid rgba(255,255,255,0.06)';
              let cardColor = 'white';

              if (isSel) {
                cardBg = 'rgba(99, 102, 241, 0.15)';
                cardBorder = '1.5px solid #6366f1';
                cardColor = '#a5b4fc';
              } else if (isMatch) {
                cardBg = 'rgba(16, 185, 129, 0.1)';
                cardBorder = '1px solid rgba(16, 185, 129, 0.25)';
                cardColor = '#a7f3d0';
              }

              return (
                <div
                  key={card.id}
                  onClick={() => handleCikmisMatchingCardClick(idx)}
                  style={{
                    height: '75px', 
                    borderRadius: '14px', 
                    background: cardBg,
                    border: cardBorder, 
                    color: cardColor,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold', 
                    cursor: isMatch ? 'default' : 'pointer',
                    textAlign: 'center', 
                    padding: '8px 12px', 
                    opacity: isMatch ? 0.35 : 1,
                    transition: 'all 0.2s',
                    userSelect: 'none'
                  }}
                  className={!isMatch ? "hover-card" : ""}
                >
                  {card.text}
                </div>
              );
            })}
          </div>

          <button onClick={exitCamp} className="btn-secondary" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.74rem', cursor: 'pointer', marginTop: '10px' }}>
            ⬅️ Çalışmadan Çık
          </button>
        </div>
      );
    }

    if (studyMode === 'quiz_en_tr' || studyMode === 'quiz_tr_en' || studyMode === 'quiz_sentence') {
      const currentWord = studyWords[cikmisQuizIdx];
      const progressPercent = Math.round(((cikmisQuizIdx) / studyWords.length) * 100);
      
      let stepLabel = 'Adım 3/5: İngilizce ➔ Türkçe Test';
      if (studyMode === 'quiz_tr_en') stepLabel = 'Adım 4/5: Türkçe ➔ İngilizce Test';
      if (studyMode === 'quiz_sentence') stepLabel = 'Adım 5/5: Örnek Cümle Tamamlama';

      let questionTopText = '';
      let questionSubText = '';

      if (studyMode === 'quiz_en_tr') {
        questionTopText = currentWord.english;
        questionSubText = 'Bu kelimenin doğru Türkçe karşılığını seçin:';
      } else if (studyMode === 'quiz_tr_en') {
        questionTopText = currentWord.turkish;
        questionSubText = 'Bu anlamı taşıyan İngilizce akademik kelimeyi seçin:';
      } else if (studyMode === 'quiz_sentence') {
        const sentenceObj = getCikmisWordSentence(currentWord);
        questionTopText = getBlankedCikmisSentence(sentenceObj.sentence, currentWord.english);
        questionSubText = sentenceObj.translation;
      }

      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '60vh', gap: '20px', color: 'white', padding: '20px', maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
              <span style={{ fontWeight: 'bold', color: '#a5b4fc' }}>{stepLabel}</span>
              <span>{cikmisQuizIdx + 1} / {studyWords.length} Soru</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPercent}%`, background: 'linear-gradient(90deg, #6366f1, #3b82f6)', transition: 'width 0.2s' }}></div>
            </div>
          </div>

          <div className="glass-card" style={{ width: '100%', padding: '30px', borderRadius: '24px', border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SORU</div>
            <h2 style={{ fontSize: studyMode === 'quiz_sentence' ? '1.25rem' : '2.1rem', fontWeight: '800', color: 'white', margin: 0, lineHeight: 1.5, wordBreak: 'break-word' }}>
              {questionTopText}
            </h2>
            {questionSubText && (
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', fontStyle: studyMode === 'quiz_sentence' ? 'italic' : 'normal', margin: '6px 0 0 0', lineHeight: 1.4 }}>
                {questionSubText}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', width: '100%', marginTop: '8px' }}>
            {cikmisQuizOptions.map((opt, i) => {
              const isSelected = cikmisQuizSelected === opt;
              const isCorrectOpt = studyMode === 'quiz_en_tr' 
                ? opt === currentWord.turkish 
                : (studyMode === 'quiz_tr_en' ? opt === currentWord.english : opt.toLowerCase() === currentWord.english.toLowerCase());

              let optBg = 'rgba(255,255,255,0.02)';
              let optBorder = '1.5px solid rgba(255,255,255,0.08)';
              let optColor = 'white';
              let optOpacity = 1;

              if (cikmisQuizChecked) {
                if (isCorrectOpt) {
                  optBg = 'rgba(16, 185, 129, 0.15)';
                  optBorder = '1.5px solid #10b981';
                  optColor = '#a7f3d0';
                } else if (isSelected) {
                  optBg = 'rgba(239, 68, 68, 0.15)';
                  optBorder = '1.5px solid #ef4444';
                  optColor = '#fca5a5';
                } else {
                  optBg = 'rgba(255,255,255,0.01)';
                  optBorder = '1.5px solid rgba(255,255,255,0.03)';
                  optOpacity = 0.5;
                }
              } else if (isSelected) {
                optBg = 'rgba(99, 102, 241, 0.15)';
                optBorder = '1.5px solid #6366f1';
                optColor = '#a5b4fc';
              }

              return (
                <button
                  key={i}
                  onClick={() => !cikmisQuizChecked && setCikmisQuizSelected(opt)}
                  className="hover-card"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: optBg,
                    border: optBorder,
                    color: optColor,
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: cikmisQuizChecked ? 'default' : 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    transition: 'all 0.2s',
                    outline: 'none',
                    opacity: optOpacity
                  }}
                >
                  <span>{opt}</span>
                  {cikmisQuizChecked && isCorrectOpt && <span style={{ color: '#10b981' }}>✔️</span>}
                  {cikmisQuizChecked && isSelected && !isCorrectOpt && <span style={{ color: '#ef4444' }}>❌</span>}
                </button>
              );
            })}
          </div>

          <div style={{ width: '100%', marginTop: '12px' }}>
            {!cikmisQuizChecked ? (
              <button
                onClick={() => cikmisQuizSelected && handleCikmisQuizCheck(cikmisQuizSelected)}
                disabled={!cikmisQuizSelected}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: cikmisQuizSelected ? 'pointer' : 'not-allowed', background: '#6366f1', borderColor: '#6366f1' }}
              >
                Cevabı Kontrol Et
              </button>
            ) : (
              <button
                onClick={handleCikmisQuizNext}
                className="btn-primary"
                style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', background: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                {cikmisQuizIdx < studyWords.length - 1 ? 'Sıradaki Soru' : 'Aşamayı Bitir'} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  const handleWordRead = () => {
    if (currentIdx < studyWords.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      if (cikmisMode === 'swipe') {
        handleCampComplete();
        return;
      }
      if (!vocabTrack || vocabTrack === 'anlam' || vocabTrack === 'tumu') {
        setPhase(2);
        setCurrentIdx(0);
        setMeaningOptions(getMeaningOptions(studyWords[0].tr, studyWords[0]));
        setMeaningSelected(null);
        setMeaningChecked(false);
      } else if (vocabTrack === 'es_anlam') {
        const firstWithSyn = studyWords.findIndex(w => w.synonyms && w.synonyms.trim() !== "" && w.synonyms.trim().toLowerCase() !== "yok");
        if (firstWithSyn !== -1) {
          setPhase(3);
          setCurrentIdx(firstWithSyn);
          setSynonymOptions(getSynonymOptions(studyWords[firstWithSyn].synonyms.split(',')[0].trim(), studyWords[firstWithSyn]));
          setSynonymSelected(null);
          setSynonymChecked(false);
          setSynonymCorrect(null);
        } else {
          handleCampComplete();
        }
      } else if (vocabTrack === 'zit_anlam') {
        const firstWithAnt = studyWords.findIndex(w => hasAntonym(w));
        if (firstWithAnt !== -1) {
          setPhase(4);
          setCurrentIdx(firstWithAnt);
          const antStr = getAntonym(studyWords[firstWithAnt]);
          setAntonymOptions(getAntonymOptions(antStr.split(',')[0].trim(), studyWords[firstWithAnt]));
          setAntonymSelected(null);
          setAntonymChecked(false);
          setAntonymCorrect(null);
        } else {
          handleCampComplete();
        }
      } else if (vocabTrack === 'cumle') {
        setPhase(5);
        setCurrentIdx(0);
        setClozeOptions(getClozeOptions(studyWords[0].word));
        setClozeSelected(null);
        setClozeChecked(false);
        setClozeCorrect(null);
        setClozeInputText('');
        setClozeShowHint(false);
      }
    }
  };

  const handleMeaningCheck = (opt) => {
    if (meaningChecked) return;
    setMeaningSelected(opt);
    setMeaningChecked(true);

    const correct = opt === studyWords[currentIdx].tr;
    setMeaningCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setWordResults(prev => ({ ...prev, [studyWords[currentIdx].word]: false }));
      addMistake?.(studyWords[currentIdx].word, studyWords[currentIdx].tr, 'camp_meaning');
      
      const details = {
        type: studyWords[currentIdx].type,
        tr: studyWords[currentIdx].tr,
        synonyms: studyWords[currentIdx].synonyms
      };
      const rawDetails = localStorage.getItem('yokdil_camp_wrong_details') || '{}';
      try {
        const parsed = JSON.parse(rawDetails);
        parsed[studyWords[currentIdx].word] = details;
        localStorage.setItem('yokdil_camp_wrong_details', JSON.stringify(parsed));
      } catch (e) {}

      const rawWrong = localStorage.getItem('yokdil_camp_wrong_words') || '[]';
      try {
        const parsed = JSON.parse(rawWrong);
        if (!parsed.includes(studyWords[currentIdx].word)) {
          parsed.push(studyWords[currentIdx].word);
          localStorage.setItem('yokdil_camp_wrong_words', JSON.stringify(parsed));
        }
      } catch (e) {}
    }
  };

  const handleMeaningNext = () => {
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setMeaningOptions(getMeaningOptions(studyWords[next].tr, studyWords[next]));
      setMeaningSelected(null);
      setMeaningChecked(false);
      setMeaningCorrect(null);
    } else {
      if (vocabTrack === 'anlam') {
        handleCampComplete();
      } else {
        const firstWithSyn = studyWords.findIndex(w => w.synonyms && w.synonyms.trim() !== "" && w.synonyms.trim().toLowerCase() !== "yok");
        if (firstWithSyn !== -1) {
          setPhase(3);
          setCurrentIdx(firstWithSyn);
          setSynonymOptions(getSynonymOptions(studyWords[firstWithSyn].synonyms.split(',')[0].trim(), studyWords[firstWithSyn]));
          setSynonymSelected(null);
          setSynonymChecked(false);
          setSynonymCorrect(null);
        } else {
          const firstWithAnt = studyWords.findIndex(w => hasAntonym(w));
          if (firstWithAnt !== -1) {
            setPhase(4);
            setCurrentIdx(firstWithAnt);
            const antStr = getAntonym(studyWords[firstWithAnt]);
            setAntonymOptions(getAntonymOptions(antStr.split(',')[0].trim(), studyWords[firstWithAnt]));
            setAntonymSelected(null);
            setAntonymChecked(false);
            setAntonymCorrect(null);
          } else {
            setPhase(5);
            setCurrentIdx(0);
            setClozeOptions(getClozeOptions(studyWords[0].word));
            setClozeSelected(null);
            setClozeChecked(false);
            setClozeCorrect(null);
            setClozeInputText('');
            setClozeShowHint(false);
          }
        }
      }
    }
  };

  const handleSynonymCheck = (opt) => {
    if (synonymChecked) return;
    setSynonymSelected(opt);
    setSynonymChecked(true);

    const cleanCorrect = studyWords[currentIdx].synonyms.split(',')[0].trim();
    const correct = opt === cleanCorrect;
    setSynonymCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setWordResults(prev => ({ ...prev, [studyWords[currentIdx].word]: false }));
      addMistake?.(studyWords[currentIdx].word, studyWords[currentIdx].tr, 'camp_synonym');
    }
  };

  const handleSynonymNext = () => {
    const nextIdx = studyWords.findIndex((w, idx) => idx > currentIdx && w.synonyms && w.synonyms.trim() !== "" && w.synonyms.trim().toLowerCase() !== "yok");
    if (nextIdx !== -1) {
      setCurrentIdx(nextIdx);
      setSynonymOptions(getSynonymOptions(studyWords[nextIdx].synonyms.split(',')[0].trim(), studyWords[nextIdx]));
      setSynonymSelected(null);
      setSynonymChecked(false);
      setSynonymCorrect(null);
    } else {
      if (vocabTrack === 'es_anlam') {
        handleCampComplete();
      } else {
        const firstWithAnt = studyWords.findIndex(w => hasAntonym(w));
        if (firstWithAnt !== -1) {
          setPhase(4);
          setCurrentIdx(firstWithAnt);
          const antStr = getAntonym(studyWords[firstWithAnt]);
          setAntonymOptions(getAntonymOptions(antStr.split(',')[0].trim(), studyWords[firstWithAnt]));
          setAntonymSelected(null);
          setAntonymChecked(false);
          setAntonymCorrect(null);
        } else {
          setPhase(5);
          setCurrentIdx(0);
          setClozeOptions(getClozeOptions(studyWords[0].word));
          setClozeSelected(null);
          setClozeChecked(false);
          setClozeCorrect(null);
          setClozeInputText('');
          setClozeShowHint(false);
        }
      }
    }
  };

  const handleAntonymCheck = (opt) => {
    if (antonymChecked) return;
    setAntonymSelected(opt);
    setAntonymChecked(true);

    const antonymStr = getAntonym(studyWords[currentIdx]);
    const cleanCorrect = antonymStr.split(',')[0].trim();
    const correct = opt === cleanCorrect;
    setAntonymCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setWordResults(prev => ({ ...prev, [studyWords[currentIdx].word]: false }));
      addMistake?.(studyWords[currentIdx].word, studyWords[currentIdx].tr, 'camp_antonym');
    }
  };

  const handleAntonymNext = () => {
    const nextIdx = studyWords.findIndex((w, idx) => idx > currentIdx && hasAntonym(w));
    if (nextIdx !== -1) {
      setCurrentIdx(nextIdx);
      const antStr = getAntonym(studyWords[nextIdx]);
      setAntonymOptions(getAntonymOptions(antStr.split(',')[0].trim(), studyWords[nextIdx]));
      setAntonymSelected(null);
      setAntonymChecked(false);
      setAntonymCorrect(null);
    } else {
      if (vocabTrack === 'zit_anlam') {
        handleCampComplete();
      } else {
        setPhase(5);
        setCurrentIdx(0);
        setClozeOptions(getClozeOptions(studyWords[0].word));
        setClozeSelected(null);
        setClozeChecked(false);
        setClozeCorrect(null);
        setClozeInputText('');
        setClozeShowHint(false);
      }
    }
  };

  const handleClozeCheck = (opt) => {
    if (clozeChecked) return;
    let selectedOpt = opt;
    if (clozeMode === 'write') {
      selectedOpt = clozeInputText.trim().toLowerCase();
    }
    setClozeSelected(selectedOpt);
    setClozeChecked(true);

    const correct = selectedOpt === studyWords[currentIdx].word.toLowerCase();
    setClozeCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setWordResults(prev => ({ ...prev, [studyWords[currentIdx].word]: false }));
      addMistake?.(studyWords[currentIdx].word, studyWords[currentIdx].tr, 'camp_cloze');
    }
  };

  const handleClozeNext = () => {
    if (currentIdx < studyWords.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setClozeOptions(getClozeOptions(studyWords[next].word));
      setClozeSelected(null);
      setClozeChecked(false);
      setClozeCorrect(null);
      setClozeInputText('');
      setClozeShowHint(false);
    } else {
      handleCampComplete();
    }
  };

  const handleCampComplete = () => {
    const isSwipe = cikmisMode === 'swipe';
    const successRate = isSwipe ? 100 : (Math.round((correctAnswers / totalQuestions) * 100) || 100);
    const isPassed = successRate >= 70;

    const newCompleted = { ...progress.completedDays };
    const currentDayRecord = newCompleted[selectedDay] || {};
    
    const updatedRecord = {
      ...currentDayRecord,
      date: new Date().toLocaleDateString()
    };

    if (isSwipe) {
      updatedRecord.swipeCompleted = true;
      updatedRecord.swipeScore = successRate;
      updatedRecord.swipePassed = true;
      if (updatedRecord.detailedCompleted === undefined) {
        updatedRecord.score = successRate;
        updatedRecord.isPassed = true;
      }
    } else {
      updatedRecord.detailedCompleted = true;
      updatedRecord.detailedScore = successRate;
      updatedRecord.detailedPassed = isPassed;
      updatedRecord.score = successRate;
      updatedRecord.isPassed = isPassed;
    }

    newCompleted[selectedDay] = updatedRecord;

    let nextDay = progress.currentDay;
    if (isPassed && selectedDay === progress.currentDay) {
      nextDay = progress.currentDay + 1;
    }

    const newMastery = { ...progress.wordMastery };
    studyWords.forEach(w => {
      const wasCorrect = wordResults[w.word] !== false;
      const currentLevel = newMastery[w.word] || 0;
      if (wasCorrect) {
        newMastery[w.word] = Math.min(3, currentLevel + 1);
        recordWordStat?.(w.word, true);
      } else {
        newMastery[w.word] = Math.max(0, currentLevel - 1);
        recordWordStat?.(w.word, false);
      }
    });

    const newProgress = {
      ...progress,
      currentDay: nextDay,
      completedDays: newCompleted,
      wordMastery: newMastery
    };

    saveProgress(newProgress);
    awardPetXP?.(40);
    triggerConfetti?.();
    setPhase(6);
  };

  const startGrammarStudy = async (dayNum, resumeIdx = null, resumePhase = null) => {
    setSelectedDay(dayNum);
    setIsStudying(true);
    setCampType('grammar');

    const dayData = grammarCampDb[String(dayNum)];
    if (!dayData) {
      alert("Bu günün dilbilgisi konusu bulunamadı!");
      setIsStudying(false);
      return;
    }

    setActiveGrammarDay(dayData);
    setGrammarQuestions(dayData.questions || []);

    const comp = grammarProgress.completedDays[dayNum];
    if (comp) {
      const expectedCorr = Math.round((comp.score / 100) * (dayData.questions || []).length);
      setCorrectAnswers(expectedCorr);
      setTotalQuestions((dayData.questions || []).length);
    } else {
      setCorrectAnswers(0);
      setTotalQuestions(0);
    }

    const startIdx = resumeIdx !== null ? resumeIdx : 0;
    const startPhase = resumePhase !== null ? resumePhase : 1;

    setGrammarIdx(startIdx);
    setPhase(startPhase);

    setGrammarSelected(null);
    setGrammarChecked(false);
    setGrammarCorrect(null);
  };

  const handleGrammarNextLecture = () => {
    setPhase(2);
    setGrammarIdx(0);
    setGrammarSelected(null);
    setGrammarChecked(false);
  };

  const handleGrammarCheck = (opt) => {
    if (grammarChecked) return;
    setGrammarSelected(opt);
    setGrammarChecked(true);

    const q = grammarQuestions[grammarIdx];
    const correct = opt === q.answer;
    setGrammarCorrect(correct);
    setTotalQuestions(prev => prev + 1);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleGrammarNextQuestion = () => {
    if (grammarIdx < grammarQuestions.length - 1) {
      setGrammarIdx(prev => prev + 1);
      setGrammarSelected(null);
      setGrammarChecked(false);
      setGrammarCorrect(null);
    } else {
      handleGrammarComplete();
    }
  };

  const handleGrammarComplete = () => {
    const successRate = Math.round((correctAnswers / totalQuestions) * 100) || 100;
    const isPassed = successRate >= 60;

    const newCompleted = { ...grammarProgress.completedDays };
    newCompleted[selectedDay] = {
      score: successRate,
      isPassed: isPassed,
      date: new Date().toLocaleDateString()
    };

    let nextDay = grammarProgress.currentDay;
    if (isPassed && selectedDay === grammarProgress.currentDay) {
      nextDay = grammarProgress.currentDay + 1;
    }

    const newProgress = {
      ...grammarProgress,
      currentDay: nextDay,
      completedDays: newCompleted
    };

    saveGrammarProgress(newProgress);
    awardPetXP?.(45);
    triggerConfetti?.();
    setPhase(3);
  };

  const exitCamp = () => {
    setIsStudying(false);
    setActiveGrammarDay(null);
    setGrammarQuestions([]);
    setStudyWords([]);
    
    const category = selectedCategory || 'fen';
    localStorage.removeItem(`yokdil_camp_session_${category}`);
    
    window.history.pushState(null, '', `#/${category}/camp`);
  };

  const completedDaysMap = progress.completedDays || {};
  const currentDay = progress.currentDay || 1;
  const totalDone = Object.values(completedDaysMap).filter(v => v.isPassed).length;

  const grammarDoneMap = grammarProgress.completedDays || {};
  const currentGrammarDay = grammarProgress.currentDay || 1;
  const grammarDoneCount = Object.values(grammarDoneMap).filter(v => v.isPassed).length;

  const cikmisDoneMap = cikmisProgress.completedDays || {};
  const cikmisDoneCount = Object.values(cikmisDoneMap).filter(v => 
    cikmisMode === 'swipe' ? !!v.swipeCompleted : !!v.detailedCompleted
  ).length;

  let currentCikmisDay = 1;
  for (let d = 1; d <= 60; d++) {
    const dayRec = cikmisDoneMap[d];
    const isDone = dayRec ? (cikmisMode === 'swipe' ? !!dayRec.swipeCompleted : !!dayRec.detailedCompleted) : false;
    if (!isDone) {
      currentCikmisDay = d;
      break;
    }
  }

  const totalSupermaster = Object.values(progress.wordMastery || {}).filter(v => v === 3).length;

  if (isStudying) {
    if (campType === 'grammar') {
      return (
        <CampGrammar
          selectedDay={selectedDay}
          activeGrammarDay={activeGrammarDay}
          phase={phase}
          grammarIdx={grammarIdx}
          grammarQuestions={grammarQuestions}
          grammarSelected={grammarSelected}
          grammarChecked={grammarChecked}
          grammarCorrect={grammarCorrect}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          handleGrammarNextLecture={handleGrammarNextLecture}
          handleGrammarCheck={handleGrammarCheck}
          handleGrammarNextQuestion={handleGrammarNextQuestion}
          exitCamp={exitCamp}
          setActiveStudyInfo={setActiveStudyInfo}
        />
      );
    }

    if (campType === 'cikmis_kelimeler') {
      return renderCikmisStudy();
    }

    return (
      <CampStudy
        selectedDay={selectedDay}
        studyWords={studyWords}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        phase={phase}
        setPhase={setPhase}
        allWordsDb={allWordsDb}
        sentenceIdx={sentenceIdx}
        setSentenceIdx={setSentenceIdx}
        meaningOptions={meaningOptions}
        meaningSelected={meaningSelected}
        meaningChecked={meaningChecked}
        meaningCorrect={meaningCorrect}
        handleMeaningCheck={handleMeaningCheck}
        handleMeaningNext={handleMeaningNext}
        getEnglishForMeaningOption={getEnglishForMeaningOption}
        synonymOptions={synonymOptions}
        synonymSelected={synonymSelected}
        synonymChecked={synonymChecked}
        synonymCorrect={synonymCorrect}
        handleSynonymCheck={handleSynonymCheck}
        handleSynonymNext={handleSynonymNext}
        antonymOptions={antonymOptions}
        antonymSelected={antonymSelected}
        antonymChecked={antonymChecked}
        antonymCorrect={antonymCorrect}
        handleAntonymCheck={handleAntonymCheck}
        handleAntonymNext={handleAntonymNext}
        getAntonym={getAntonym}
        clozeMode={clozeMode}
        setClozeMode={setClozeMode}
        clozeInputText={clozeInputText}
        setClozeInputText={setClozeInputText}
        clozeChecked={clozeChecked}
        clozeCorrect={clozeCorrect}
        clozeOptions={clozeOptions}
        clozeSelected={clozeSelected}
        clozeShowHint={clozeShowHint}
        setClozeShowHint={setClozeShowHint}
        handleClozeCheck={handleClozeCheck}
        handleClozeNext={handleClozeNext}
        getBlankedSentence={getBlankedSentence}
        clozeSentenceIndexes={clozeSentenceIndexes}
        wordResults={wordResults}
        progress={progress}
        exitCamp={exitCamp}
        formatWordType={formatWordType}
        getSynonymsList={getSynonymsList}
        getAntonymsList={getAntonymsList}
        getCollocationsList={getCollocationsList}
        getSentenceEn={getSentenceEn}
        getSentenceTr={getSentenceTr}
        handleWordRead={handleWordRead}
        setActiveStudyInfo={setActiveStudyInfo}
        totalCampDays={totalCampDays}
        setMeaningOptions={setMeaningOptions}
        vocabTrack={vocabTrack}
      />
    );
  }

  return (
    <div className="space-y-6">
      {reportCardDay && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.65)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }} onClick={() => setReportCardDay(null)}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', padding: '28px', border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(15, 23, 42, 0.98)', color: 'white', textAlign: 'left', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: 0, color: 'white' }}>
                📊 Genel Değerlendirme Karnesi
              </h3>
              <button 
                onClick={() => setReportCardDay(null)} 
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {(() => {
              let completedObj = null;
              let score = 100;
              let titleText = "";
              let isCikmis = reportCardType === 'cikmis_kelimeler';
              let isGrammar = reportCardType === 'grammar';
              let isVocab = reportCardType === 'vocabulary';

              if (isGrammar) {
                completedObj = grammarDoneMap[reportCardDay];
                score = completedObj ? completedObj.score : 100;
                titleText = `Dilbilgisi Kampı ${reportCardDay}. Gün`;
              } else if (isCikmis) {
                completedObj = cikmisDoneMap[reportCardDay];
                score = completedObj ? completedObj.score : 100;
                titleText = `Çıkmış Kelimeler ${reportCardDay}. Gün`;
              } else {
                completedObj = completedDaysMap[reportCardDay];
                score = completedObj ? completedObj.score : 100;
                const isMonthly = (reportCardDay % 28 === 0) || (reportCardDay === totalCampDays);
                const isSec = !isMonthly && ((reportCardDay % 7 === 0) || (reportCardDay === totalCampDays));
                titleText = isMonthly ? `Aylık Genel Test ${Math.ceil(reportCardDay / 28)}` : (isSec ? `Haftalık Kamp ${Math.ceil(reportCardDay / 7)}` : `${reportCardDay}. Gün`);
              }

              const history = completedObj?.history || (completedObj ? [completedObj] : []);
              
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <div className="glass-card" style={{ flex: 1, minWidth: '130px', padding: '14px', borderRadius: '14px', background: isGrammar ? 'rgba(16, 185, 129, 0.08)' : isCikmis ? 'rgba(239, 68, 68, 0.08)' : 'rgba(99, 102, 241, 0.08)', border: isGrammar ? '1px solid rgba(16, 185, 129, 0.2)' : isCikmis ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)' }}>
                      <span style={{ fontSize: '0.68rem', color: isGrammar ? '#34d399' : isCikmis ? '#fca5a5' : '#a5b4fc', textTransform: 'uppercase', display: 'block' }}>Rapor Günü</span>
                      <strong style={{ fontSize: '1.15rem', color: 'white' }}>
                        {titleText}
                      </strong>
                    </div>
                    <div className="glass-card" style={{ flex: 1, minWidth: '130px', padding: '14px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                      <span style={{ fontSize: '0.68rem', color: '#34d399', textTransform: 'uppercase', display: 'block' }}>Başarı Oranı</span>
                      <strong style={{ fontSize: '1.15rem', color: '#34d399' }}>%{score}</strong>
                    </div>
                  </div>

                  {!isGrammar && (
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
                              <span style={{ fontWeight: 'bold', color: 'white' }}>
                                {w.word || w.english || ''} 
                                {w.type ? <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'normal' }}> ({formatWordType(w.type)})</span> : ''}
                              </span>
                              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', textAlign: 'right' }}>{renderTurkishMeanings(w.tr || w.turkish || '', '#a5b4fc', { fontSize: '0.8rem', gap: '2px', alignItems: 'flex-end', textAlign: 'right' })}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {isGrammar && (
                    <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'white', display: 'block', marginBottom: '4px' }}>📚 Dilbilgisi Konusu Tamamlandı</strong>
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Konu anlatımı ve pekiştirme soruları başarıyla incelendi.</span>
                    </div>
                  )}

                  {history.length > 1 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📈 Performans Gelişim Geçmişi
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }} className="custom-scrollbar">
                        {history.map((attempt, index) => {
                          const prevAttempt = index > 0 ? history[index - 1] : null;
                          let trendText = '';
                          let trendColor = '#94a3b8';
                          if (prevAttempt) {
                            if (attempt.score > prevAttempt.score) {
                              trendText = `(+${attempt.score - prevAttempt.score}% Gelişim)`;
                              trendColor = '#34d399';
                            } else if (attempt.score < prevAttempt.score) {
                              trendText = `(-${prevAttempt.score - attempt.score}% Düşüş)`;
                              trendColor = '#f87171';
                            } else {
                              trendText = '(Değişim Yok)';
                            }
                          }
                          return (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', borderLeft: attempt.isPassed ? '3.5px solid #10b981' : '3.5px solid #ef4444', fontSize: '0.8rem' }}>
                              <div>
                                <span style={{ fontWeight: 'bold', color: 'white', marginRight: '6px' }}>{index + 1}. Deneme (v{index + 1}):</span>
                                <span style={{ color: attempt.isPassed ? '#34d399' : '#f87171', fontWeight: 'bold' }}>%{attempt.score}</span>
                                <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '8px' }}>({attempt.date})</span>
                              </div>
                              {trendText && (
                                <span style={{ fontSize: '0.74rem', color: trendColor, fontWeight: 'bold' }}>
                                  {attempt.score > prevAttempt.score ? '📈 ' : (attempt.score < prevAttempt.score ? '📉 ' : '➡️ ')} {trendText}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {!isGrammar && (
                      <button 
                        onClick={() => {
                          const historyList = completedObj?.history || [];
                          const latestAttempt = historyList.length > 0 ? historyList[historyList.length - 1] : completedObj;
                          const exportStats = { 
                            ...completedObj, 
                            ...latestAttempt,
                            swipeResults: latestAttempt.swipeResults || latestAttempt.resultsMap || completedObj.swipeResults || completedObj.resultsMap
                          };
                          handlePrintPDF(reportCardDay, reportCardWords, exportStats, selectedCategory, totalCampDays);
                        }}
                        className="btn-primary"
                        style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#3b82f6', borderColor: '#3b82f6', cursor: 'pointer' }}
                      >
                        🖨️ PDF Olarak İndir / Yazdır
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setReportCardDay(null);
                        if (isGrammar) {
                          startGrammarStudy(reportCardDay);
                        } else if (isCikmis) {
                          startCikmisStudy(reportCardDay);
                        } else {
                          startDailyStudy(reportCardDay);
                        }
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
        </div>,
        document.body
      )}

      <CampDashboard
        campType={campType}
        setCampType={setCampType}
        vocabTrack={vocabTrack}
        setVocabTrack={setVocabTrack}
        totalDone={totalDone}
        totalSupermaster={totalSupermaster}
        selectedCategory={selectedCategory}
        currentDay={currentDay}
        completedDaysMap={completedDaysMap}
        totalCampDays={totalCampDays}
        startDailyStudy={startDailyStudy}
        setReportCardDay={setReportCardDay}
        reportCardType={reportCardType}
        setReportCardType={setReportCardType}
        getAIAnalysis={getAIAnalysis}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedWeek={selectedWeek}
        setSelectedWeek={setSelectedWeek}
        grammarDoneCount={grammarDoneCount}
        currentGrammarDay={currentGrammarDay}
        grammarDoneMap={grammarDoneMap}
        startGrammarStudy={startGrammarStudy}
        grammarCampDb={grammarCampDb}
        cikmisDoneCount={cikmisDoneCount}
        currentCikmisDay={currentCikmisDay}
        cikmisDoneMap={cikmisDoneMap}
        startCikmisStudy={startCikmisStudy}
        cikmisMode={cikmisMode}
        setCikmisMode={setCikmisMode}
        onExportCikmisData={triggerCikmisExport}
        onExportVocabData={triggerVocabExport}
        cikmisPlanData={cikmisPlanData}
        vocabPlanData={vocabPlanData}
        generalInfo={generalInfoMap[campType]}
        hideSwitcher={hideSwitcher || initialCampType === 'cikmis_kelimeler'}
        showConfirm={showConfirm}
      />

      {confirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            borderRadius: '24px',
            padding: '28px',
            maxWidth: '440px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 16px auto'
            }}>
              ❓
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Onay Gerekiyor
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px', whiteSpace: 'pre-line' }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#3b82f6',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Tamam
              </button>
              {confirmModal.showCancel && (
                <button
                  onClick={() => {
                    if (confirmModal.onCancel) confirmModal.onCancel();
                    setConfirmModal(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  İptal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampSection;
