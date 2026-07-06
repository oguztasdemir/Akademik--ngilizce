import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Trophy, ArrowRight, Check, AlertCircle, Calendar, Star, Lock, Heart, Award } from 'lucide-react';
import grammarCampDb from '@dataset/yokdil/genel/grammar_camp.json';
const campModules = import.meta.glob('@dataset/**/*.json');

// Helper to resolve dynamically imported dataset modules since Vite alias keys can differ
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

const CampSection = ({ selectedCategory, awardPetXP, triggerConfetti, examsDb }) => {
  const isInitializedRef = useRef(false);
  // Camp State Management
  const [progress, setProgress] = useState(null);
  const [totalCampDays, setTotalCampDays] = useState(60);

  // Dynamic camp days loader
  useEffect(() => {
    const loadPlanData = async () => {
      const category = selectedCategory || 'fen';
      const planKey = `@dataset/yokdil/${category}/kamp_plan.json`;
      const loadPlan = getCampModule(planKey);
      if (loadPlan) {
        try {
          const planMod = await loadPlan();
          const planData = planMod.default || planMod;
          setTotalCampDays(Object.keys(planData).length);
        } catch (e) {
          console.error("Plan yüklenirken hata oluştu:", e);
        }
      }
    };
    loadPlanData();
  }, [selectedCategory]);

  const [campType, setCampType] = useState('vocabulary'); // 'vocabulary' or 'grammar'
  const [grammarProgress, setGrammarProgress] = useState(null);
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

  useEffect(() => {
    setSentenceIdx(0);
  }, [currentIdx, phase]);

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

  const [strategySelected, setStrategySelected] = useState(null);
  const [strategyChecked, setStrategyChecked] = useState(false);
  const [strategyCorrect, setStrategyCorrect] = useState(null);
  const [showStrategyTip, setShowStrategyTip] = useState(false);

  // Stats for the active day
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [wordResults, setWordResults] = useState({}); // tracking per-word correctness

  // Matching Game States
  const [matchingLeftCards, setMatchingLeftCards] = useState([]);
  const [matchingRightCards, setMatchingRightCards] = useState([]);
  const [selectedLeftCard, setSelectedLeftCard] = useState(null); // { id, word, text }
  const [selectedRightCard, setSelectedRightCard] = useState(null); // { id, word, text }
  const [matchedPairs, setMatchedPairs] = useState([]); // array of word keys
  const [matchingMode, setMatchingMode] = useState('tr'); // 'tr' or 'synonym'
  const [matchingFailed, setMatchingFailed] = useState(false);
  const [wrongMatches, setWrongMatches] = useState({}); // { cardId: true }

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
  }, []);

  // Load session state from localStorage/hash on category change or mount
  useEffect(() => {
    if (!progress || !grammarProgress) return;
    const category = selectedCategory || 'fen';
    
    // Check hash first
    const hash = window.location.hash;
    const hashParts = hash.split('/'); // e.g. ["#", "fen", "camp", "vocabulary", "day_5", "phase_2", "word_3"]
    
    let isStudyingFromHash = false;
    let selectedDayFromHash = 1;
    let currentIdxFromHash = 0;
    let phaseFromHash = 1;
    let campTypeFromHash = 'vocabulary';
    let grammarIdxFromHash = 0;

    if (hashParts.length >= 7 && hashParts[2] === 'camp') {
      isStudyingFromHash = true;
      campTypeFromHash = hashParts[3]; // 'vocabulary' or 'grammar'
      selectedDayFromHash = parseInt(hashParts[4].replace('day_', ''), 10) || 1;
      phaseFromHash = parseInt(hashParts[5].replace('phase_', ''), 10) || 1;
      
      if (campTypeFromHash === 'vocabulary') {
        currentIdxFromHash = (parseInt(hashParts[6].replace('word_', ''), 10) - 1) || 0;
      } else {
        grammarIdxFromHash = (parseInt(hashParts[6].replace('question_', ''), 10) - 1) || 0;
      }
    }

    if (isStudyingFromHash) {
      setCampType(campTypeFromHash);
      if (campTypeFromHash === 'vocabulary') {
        startDailyStudy(selectedDayFromHash, currentIdxFromHash, phaseFromHash).then(() => {
          isInitializedRef.current = true;
        });
      } else {
        startGrammarStudy(selectedDayFromHash, grammarIdxFromHash, phaseFromHash).then(() => {
          isInitializedRef.current = true;
        });
      }
    } else {
      const savedSession = localStorage.getItem(`yokdil_camp_session_${category}`);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (parsed.isStudying && parsed.selectedDay) {
            if (parsed.campType === 'vocabulary') {
              startDailyStudy(parsed.selectedDay, parsed.currentIdx, parsed.phase).then(() => {
                isInitializedRef.current = true;
              });
            } else if (parsed.campType === 'grammar') {
              startGrammarStudy(parsed.selectedDay, parsed.grammarIdx, parsed.phase).then(() => {
                isInitializedRef.current = true;
              });
            }
          } else {
            if (typeof parsed.selectedDay === 'number') setSelectedDay(parsed.selectedDay);
            if (typeof parsed.currentIdx === 'number') setCurrentIdx(parsed.currentIdx);
            if (typeof parsed.phase === 'number') setPhase(parsed.phase);
            if (typeof parsed.isStudying === 'boolean') setIsStudying(parsed.isStudying);
            if (parsed.campType) setCampType(parsed.campType);
            if (typeof parsed.grammarIdx === 'number') setGrammarIdx(parsed.grammarIdx);
            isInitializedRef.current = true;
          }
        } catch (e) {
          console.error("Error loading camp session:", e);
          isInitializedRef.current = true;
        }
      } else {
        isInitializedRef.current = true;
      }
    }
  }, [selectedCategory, progress, grammarProgress]);

  // Save session state to localStorage on state change & update URL hash
  useEffect(() => {
    if (!progress || !grammarProgress) return;
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
    let newHash = `#/${category}/camp`;
    if (isStudying) {
      if (campType === 'vocabulary') {
        newHash += `/vocabulary/day_${selectedDay}/phase_${phase}/word_${currentIdx + 1}`;
      } else if (campType === 'grammar') {
        newHash += `/grammar/day_${selectedDay}/phase_${phase}/question_${grammarIdx + 1}`;
      }
    }
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  }, [selectedDay, currentIdx, phase, isStudying, campType, grammarIdx, selectedCategory, progress, grammarProgress]);

  if (!progress || !grammarProgress) {
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
  const areMeaningsConflicting = (m1, m2) => {
    if (!m1 || !m2) return false;
    const clean = (text) => text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
    const words1 = clean(m1);
    const words2 = clean(m2);
    for (let w1 of words1) {
      if (w1.length <= 2) continue;
      for (let w2 of words2) {
        if (w2.length <= 2) continue;
        if (w1.includes(w2) || w2.includes(w1)) return true;
      }
    }
    return false;
  };

  const getMeaningOptions = (correctMeaning, currentWordObj) => {
    const allMeanings = Object.values(allWordsDb).map(v => v.tr).filter(Boolean);
    const filtered = allMeanings.filter(m => {
      if (m === correctMeaning) return false;
      return !areMeaningsConflicting(m, correctMeaning);
    });

    const uniqueFiltered = Array.from(new Set(filtered)).sort(() => Math.random() - 0.5);

    return [
      correctMeaning,
      uniqueFiltered[0] || 'saptamak',
      uniqueFiltered[1] || 'önlemek',
      uniqueFiltered[2] || 'iyileştirmek'
    ].sort(() => Math.random() - 0.5);
  };

  const getSynonymOptions = (correctSynonym, currentWordObj) => {
    const cleanCorrect = correctSynonym ? correctSynonym.split(',')[0].trim() : 'assess';
    const allSyns = Object.values(allWordsDb)
      .map(v => v.synonyms ? v.synonyms.split(',')[0].trim() : '')
      .filter(s => s && s !== cleanCorrect);

    const filtered = allSyns.filter(s => {
      return !areMeaningsConflicting(s, cleanCorrect);
    });

    const uniqueFiltered = Array.from(new Set(filtered)).sort(() => Math.random() - 0.5);

    return [
      cleanCorrect,
      uniqueFiltered[0] || 'determine',
      uniqueFiltered[1] || 'prevent',
      uniqueFiltered[2] || 'develop'
    ].sort(() => Math.random() - 0.5);
  };

  const getAntonym = (wordObj) => {
    if (!wordObj) return '';
    const w = wordObj.word.toLowerCase();
    if (ACADEMIC_ANTONYMS[w]) return ACADEMIC_ANTONYMS[w];
    if (wordObj.antonyms) {
      if (Array.isArray(wordObj.antonyms)) return wordObj.antonyms.join(', ');
      return wordObj.antonyms;
    }
    return '';
  };

  const getAntonymWithTranslation = (wordObj) => {
    const antonymsStr = getAntonym(wordObj);
    if (!antonymsStr) return 'Yok';
    
    const antonymList = antonymsStr.split(',').map(a => a.trim());
    const translatedList = antonymList.map(ant => {
      let tr = '';
      const cleanAnt = ant.toLowerCase();
      if (allWordsDb && allWordsDb[cleanAnt]) {
        tr = allWordsDb[cleanAnt].tr;
      } else {
        const fallbacks = {
          "finite": "sınırlı, sonlu",
          "limited": "kısıtlı, sınırlı",
          "late": "geç, son",
          "accept": "kabul etmek",
          "approve": "onaylamak",
          "admit": "kabul etmek, itiraf etmek",
          "contract": "küçülmek, büzülmek",
          "shrink": "çekmek, küçülmek",
          "voluntary": "gönüllü",
          "intentional": "kasıtlı, bilerek",
          "systematic": "sistemli, düzenli",
          "planned": "planlı",
          "ordered": "düzenli",
          "stabilize": "dengelemek, sabitlemek",
          "organize": "düzenlemek",
          "restore": "restore etmek, onarmak",
          "position": "konumlandırmak",
          "place": "yerleştirmek",
          "install": "kurmak, monte etmek",
          "scarce": "nadir, kıt",
          "sparse": "seyrek, dağınık",
          "deficient": "yetersiz, eksik",
          "decelerate": "yavaşlatmak",
          "slow down": "yavaşlamak",
          "inaccurate": "hatalı, yanlış",
          "incorrect": "yanlış, hatalı",
          "wrong": "yanlış",
          "fail": "başarısız olmak",
          "lose": "kaybetmek",
          "miss": "kaçırmak, özlemek",
          "forfeit": "kaybetmek, feragat etmek",
          "inadequate": "yetersiz",
          "insufficient": "yetersiz, eksik",
          "favorable": "olumlu, elverişli",
          "beneficial": "faydalı, yararlı",
          "oppose": "karşı çıkmak",
          "condemn": "kınamak",
          "protest": "protesto etmek",
          "preserve": "korumak, muhafaza etmek",
          "maintain": "sürdürmek, korumak",
          "keep": "tutmak, korumak",
          "harmful": "zararlı",
          "detrimental": "zararlı, hasar verici",
          "decrease": "azalmak, düşmek",
          "diminish": "azalmak, eksilmek",
          "worsen": "kötüleşmek",
          "avoidable": "kaçınılabilir",
          "uncertain": "belirsiz",
          "shallow": "sığ",
          "superficial": "yüzeysel",
          "hide": "gizlemek, saklamak",
          "conceal": "gizlemek",
          "insignificant": "önemsiz",
          "minor": "önemsiz, küçük",
          "trivial": "önemsiz",
          "destroy": "yok etmek, yıkmak",
          "abandon": "terk etmek",
          "invalidate": "geçersiz kılmak",
          "disprove": "aksini kanıtlamak",
          "disperse": "dağıtmak, yaymak",
          "scatter": "dağıtmak, saçmak",
          "reject": "reddetmek",
          "resist": "direnmek",
          "separate": "ayırmak",
          "detach": "ayırmak, sökmek",
          "disarrange": "karıştırmak, dağıtmak",
          "discard": "atmak, ıskartaya çıkarmak",
          "intensify": "yoğunlaştırmak",
          "withhold": "esirgemek, vermemek",
          "retain": "elinde tutmak",
          "clarity": "açıklık, berraklık",
          "certainty": "kesinlik",
          "synthesize": "sentezlemek",
          "combine": "birleştirmek",
          "ignore": "görmezden gelmek",
          "neglect": "ihmal etmek",
          "know": "bilmek",
          "prove": "kanıtlamak",
          "opening": "açıklık, açılış",
          "pathway": "yol, patika",
          "setback": "aksilik, yenilgi",
          "failure": "başarısızlık",
          "ease": "kolaylık, rahatlık",
          "simplicity": "sadelik",
          "confuse": "kafasını karıştırmak",
          "obscure": "anlaşılması güç hale getirmek",
          "compete": "rekabet etmek",
          "limited": "sınırlı",
          "incomplete": "eksik, tamamlanmamış",
          "similar": "benzer",
          "uniform": "tekdüze, homojen",
          "persist": "sürdürmek, üstelemek",
          "deny": "inkar etmek, reddetmek",
          "fact": "gerçek",
          "overlook": "gözden kaçırmak",
          "discontinue": "durdurmak, kesmek",
          "important": "önemli",
          "doubt": "şüphe duymak",
          "hold": "tutmak, barındırmak",
          "avoid": "kaçınmak",
          "permanent": "kalıcı",
          "lasting": "kalıcı, uzun süreli",
          "external": "dış, harici",
          "outer": "dış, dıştaki",
          "minimum": "minimum, en az",
          "minority": "azınlık",
          "reduce": "azaltmak",
          "demolish": "yıkmak",
          "variable": "değişken",
          "unstable": "kararsız, dengesiz",
          "incapable": "yetersiz, aciz",
          "incompetent": "yetersiz, beceriksiz",
          "damage": "zarar, hasar",
          "volatile": "değişken, uçucu",
          "complex": "karmaşık",
          "complicated": "karmaşık",
          "invisible": "görünmez",
          "negative": "negatif, olumsuz",
          "artificial": "yapay",
          "synthetic": "sentetik, yapay",
          "inner": "iç, içteki",
          "inefficient": "verimsiz",
          "wasteful": "savurgan, israflı",
          "distract": "dikkatini dağıtmak",
          "divide": "bölmek, ayırmak",
          "weaken": "zayıflatmak",
          "undermine": "baltalamak, zayıflatmak"
        };
        tr = fallbacks[cleanAnt] || '';
      }
      return tr ? `${ant} (${tr})` : ant;
    });
    return translatedList.join(', ');
  };

  const getTranslation = (wordStr) => {
    if (!wordStr) return '';
    const clean = wordStr.toLowerCase().trim();
    if (allWordsDb && allWordsDb[clean]) {
      return allWordsDb[clean].tr || '';
    }
    const localFallbacks = {
      "finite": "sınırlı, sonlu",
      "limited": "kısıtlı, sınırlı",
      "late": "geç, son",
      "accept": "kabul etmek",
      "approve": "onaylamak",
      "admit": "kabul etmek, itiraf etmek",
      "contract": "küçülmek, büzülmek",
      "shrink": "çekmek, küçülmek",
      "voluntary": "gönüllü",
      "intentional": "kasıtlı, bilerek",
      "systematic": "sistemli, düzenli",
      "planned": "planlı",
      "ordered": "düzenli",
      "stabilize": "dengelemek, sabitlemek",
      "organize": "düzenlemek",
      "restore": "restore etmek, onarmak",
      "position": "konumlandırmak",
      "place": "yerleştirmek",
      "install": "kurmak, monte etmek",
      "scarce": "nadir, kıt",
      "sparse": "seyrek, dağınık",
      "deficient": "yetersiz, eksik",
      "decelerate": "yavaşlatmak",
      "slow down": "yavaşlamak",
      "inaccurate": "hatalı, yanlış",
      "incorrect": "yanlış, hatalı",
      "wrong": "yanlış",
      "fail": "başarısız olmak",
      "lose": "kaybetmek",
      "miss": "kaçırmak, özlemek",
      "forfeit": "kaybetmek, feragat etmek",
      "inadequate": "yetersiz",
      "insufficient": "yetersiz, eksik",
      "favorable": "olumlu, elverişli",
      "beneficial": "faydalı, yararlı",
      "oppose": "karşı çıkmak",
      "condemn": "kınamak",
      "protest": "protesto etmek",
      "preserve": "korumak, muhafaza etmek",
      "maintain": "sürdürmek, korumak",
      "keep": "tutmak, korumak",
      "harmful": "zararlı",
      "detrimental": "zararlı, hasar verici",
      "decrease": "azalmak, düşmek",
      "diminish": "azalmak, eksilmek",
      "worsen": "kötüleşmek",
      "avoidable": "kaçınılabilir",
      "uncertain": "belirsiz",
      "shallow": "sığ",
      "superficial": "yüzeysel",
      "hide": "gizlemek, saklamak",
      "conceal": "gizlemek",
      "insignificant": "önemsiz",
      "minor": "önemsiz, küçük",
      "trivial": "önemsiz",
      "destroy": "yok etmek, yıkmak",
      "abandon": "terk etmek",
      "invalidate": "geçersiz kılmak",
      "disprove": "aksini kanıtlamak",
      "disperse": "dağıtmak, yaymak",
      "scatter": "dağıtmak, saçmak",
      "reject": "reddetmek",
      "resist": "direnmek",
      "separate": "ayırmak",
      "detach": "ayırmak, sökmek",
      "disarrange": "karıştırmak, dağıtmak",
      "discard": "atmak, ıskartaya çıkarmak",
      "intensify": "yoğunlaştırmak",
      "withhold": "esirgemek, vermemek",
      "retain": "elinde tutmak",
      "clarity": "açıklık, berraklık",
      "certainty": "kesinlik",
      "synthesize": "sentezlemek",
      "combine": "birleştirmek",
      "ignore": "görmezden gelmek",
      "neglect": "ihmal etmek",
      "know": "bilmek",
      "prove": "kanıtlamak",
      "opening": "açıklık, açılış",
      "pathway": "yol, patika",
      "setback": "aksilik, yenilgi",
      "failure": "başarısızlık",
      "ease": "kolaylık, rahatlık",
      "simplicity": "sadelik",
      "confuse": "kafasını karıştırmak",
      "obscure": "anlaşılması güç hale getirmek",
      "compete": "rekabet etmek",
      "limited": "sınırlı",
      "incomplete": "eksik, tamamlanmamış",
      "similar": "benzer",
      "uniform": "tekdüze, homojen",
      "persist": "sürdürmek, üstelemek",
      "deny": "inkar etmek, reddetmek",
      "fact": "gerçek",
      "overlook": "gözden kaçırmak",
      "discontinue": "durdurmak, kesmek",
      "important": "önemli",
      "doubt": "şüphe duymak",
      "hold": "tutmak, barındırmak",
      "avoid": "kaçınmak",
      "permanent": "kalıcı",
      "lasting": "kalıcı, uzun süreli",
      "external": "dış, harici",
      "outer": "dış, dıştaki",
      "minimum": "minimum, en az",
      "minority": "azınlık",
      "reduce": "azaltmak",
      "demolish": "yıkmak",
      "variable": "değişken",
      "unstable": "kararsız, dengesiz",
      "incapable": "yetersiz, aciz",
      "incompetent": "yetersiz, beceriksiz",
      "damage": "zarar, hasar",
      "volatile": "değişken, uçucu",
      "complex": "karmaşık",
      "complicated": "karmaşık",
      "invisible": "görünmez",
      "negative": "negatif, olumsuz",
      "artificial": "yapay",
      "synthetic": "sentetik, yapay",
      "inner": "iç, içteki",
      "inefficient": "verimsiz",
      "wasteful": "savurgan, israflı",
      "distract": "dikkatini dağıtmak",
      "divide": "bölmek, ayırmak",
      "weaken": "zayıflatmak",
      "undermine": "baltalamak, zayıflatmak",
      
      // Synonym mappings
      "assess": "değerlendirmek",
      "appraise": "değerlendirmek, paha biçmek",
      "analyze": "analiz etmek",
      "find": "bulmak",
      "unearth": "ortaya çıkarmak, keşfetmek",
      "detect": "tespit etmek, algılamak",
      "disclose": "açıklamak, ifşa etmek",
      "uncover": "ortaya çıkarmak",
      "expose": "maruz bırakmak, ifşa etmek",
      "important": "önemli",
      "substantial": "önemli, büyük",
      "considerable": "kayda değer",
      "control": "kontrol etmek",
      "adjust": "ayarlamak, düzenlemek",
      "manage": "yönetmek",
      "immunity": "bağışıklık",
      "defense": "savunma",
      "opposition": "karşıtlık, muhalefet",
      "avoid": "kaçınmak",
      "block": "engellemek",
      "hinder": "hayırlamak, engellemek",
      "make up for": "telafi etmek",
      "offset": "dengelemek",
      "balance": "dengelemek",
      "identify": "tanımlamak, belirlemek",
      "determine": "belirlemek",
      "improve": "geliştirmek"
    };
    return localFallbacks[clean] || '';
  };

  const translateCollocation = (coll, word, wordMeaning) => {
    if (!coll) return '';
    const cleanColl = coll.toLowerCase().trim();
    const cleanWord = word.toLowerCase().trim();
    
    if (cleanColl.startsWith('crucial ') && cleanColl.includes(cleanWord)) {
      return `kritik / önemli ${wordMeaning}`;
    }
    if (cleanColl.startsWith('study of ') && cleanColl.includes(cleanWord)) {
      return `${wordMeaning} çalışması / araştırması`;
    }
    if (cleanColl.endsWith(' carefully') && cleanColl.includes(cleanWord)) {
      return `dikkatlice ${wordMeaning}`;
    }
    const collocationsDict = {
      "crucial abandon": "kritik vazgeçiş / terk",
      "study of abandon": "terk etme çalışması",
      "evaluate carefully": "dikkatle değerlendirmek",
      "evaluate performance": "performansı değerlendirmek",
      "discover a planet": "gezegen keşfetmek",
      "discover a cure": "tedavi keşfetmek",
      "reveal the causes": "nedenleri açığa çıkarmak",
      "reveal the truth": "gerçeği açığa çıkarmak",
      "significant decrease": "kayda değer düşüş",
      "significant impact": "önemli etki",
      "regulate blood pressure": "tansiyonu düzenlemek",
      "regulate hormone levels": "hormon seviyelerini düzenlemek",
      "antibiotic resistance": "antibiyotik direnci",
      "insulin resistance": "insülin direnci",
      "prevent disease": "hastalığı önlemek",
      "prevent from": "...den korumak / önlemek",
      "compensate for": "telafi etmek",
      "compensate loss": "kaybı telafi etmek",
      "diagnose early": "erken teşhis etmek",
      "diagnose with cancer": "kanser teşhisi koymak",
      "infinite carefully": "son derece dikkatli / özenli",
      "infinite patience": "sonsuz sabır",
      "infinite variety": "sonsuz çeşitlilik"
    };
    if (collocationsDict[cleanColl]) {
      return collocationsDict[cleanColl];
    }
    let wordsArr = cleanColl.split(' ');
    let translatedWords = wordsArr.map(w => {
      if (w === cleanWord) return wordMeaning;
      if (w === 'crucial') return 'kritik';
      if (w === 'study') return 'çalışma';
      if (w === 'of') return '';
      if (w === 'carefully') return 'dikkatle';
      if (w === 'prevent') return 'önlemek';
      if (w === 'resistance') return 'direnç';
      return w;
    }).filter(Boolean);
    return translatedWords.join(' ');
  };

  const getEnglishForMeaningOption = (turkishTr) => {
    if (!turkishTr) return '';
    const cleanTr = turkishTr.toLowerCase().trim();
    // 1. Look in studyWords
    let match = studyWords.find(w => w.tr && w.tr.toLowerCase().trim() === cleanTr);
    if (match) return match.word;
    
    // 2. Look in activeDayWords values
    const dayWordsArray = Object.values(activeDayWords || {});
    match = dayWordsArray.find(w => w.tr && w.tr.toLowerCase().trim() === cleanTr);
    if (match) return match.word;

    // 3. Look in allWordsDb
    if (allWordsDb) {
      const found = Object.entries(allWordsDb).find(([eng, val]) => val && val.tr && val.tr.toLowerCase().trim() === cleanTr);
      if (found) return found[0];
    }
    return '';
  };

  const getSentenceEn = (wordObj) => {
    if (!wordObj) return '';
    if (wordObj.sentences && wordObj.sentences[sentenceIdx]) {
      return wordObj.sentences[sentenceIdx].en;
    }
    return wordObj.en || wordObj.sentence_en || wordObj.sentence || '';
  };

  const getSentenceTr = (wordObj) => {
    if (!wordObj) return '';
    if (wordObj.sentences && wordObj.sentences[sentenceIdx]) {
      return wordObj.sentences[sentenceIdx].tr;
    }
    return wordObj.en_tr || wordObj.sentence_tr || wordObj.translation || '';
  };

  const getSynonymsList = (wordObj) => {
    if (!wordObj || !wordObj.synonyms || wordObj.synonyms === 'Yok') return [];
    return wordObj.synonyms.split(',').map(s => {
      const eng = s.trim();
      const tr = getTranslation(eng);
      return { eng, tr };
    }).filter(x => x.eng);
  };

  const getAntonymsList = (wordObj) => {
    const antonymsStr = getAntonym(wordObj);
    if (!antonymsStr || antonymsStr === 'Yok') return [];
    return antonymsStr.split(',').map(a => {
      const eng = a.trim();
      const match = eng.match(/^([^(]+)(?:\(([^)]+)\))?$/);
      if (match) {
        const cleanEng = match[1].trim();
        const tr = match[2] ? match[2].trim() : getTranslation(cleanEng);
        return { eng: cleanEng, tr };
      }
      return { eng, tr: getTranslation(eng) };
    }).filter(x => x.eng);
  };

  const getCollocationsList = (wordObj) => {
    if (!wordObj) return [];
    const collStr = wordObj.collocation || `${wordObj.word} carefully`;
    if (!collStr || collStr === 'Yok') return [];
    return collStr.split(',').map(c => {
      const eng = c.trim();
      const tr = translateCollocation(eng, wordObj.word, wordObj.tr || wordObj.meaning);
      return { eng, tr };
    }).filter(x => x.eng);
  };

  const hasAntonym = (wordObj) => {
    return !!getAntonym(wordObj);
  };

  const getAntonymOptions = (correctAntonym, currentWordObj) => {
    const cleanCorrect = correctAntonym ? correctAntonym.split(',')[0].trim() : 'accept';
    const allAnts = Object.values(ACADEMIC_ANTONYMS)
      .map(a => a.split(',')[0].trim())
      .filter(a => a && a !== cleanCorrect);

    const uniqueFiltered = Array.from(new Set(allAnts)).sort(() => Math.random() - 0.5);

    return [
      cleanCorrect,
      uniqueFiltered[0] || 'increase',
      uniqueFiltered[1] || 'destroy',
      uniqueFiltered[2] || 'decelerate'
    ].sort(() => Math.random() - 0.5);
  };

  const getBlankedSentence = (wordObj, idx) => {
    if (!wordObj) return '';
    let sentence = '';
    const sentenceIdx = clozeSentenceIndexes[idx] !== undefined ? clozeSentenceIndexes[idx] : 0;
    if (wordObj.sentences && wordObj.sentences.length > sentenceIdx) {
      sentence = wordObj.sentences[sentenceIdx].en;
    } else if (wordObj.sentences && wordObj.sentences.length > 0) {
      sentence = wordObj.sentences[0].en;
    } else if (wordObj.en) {
      sentence = wordObj.en;
    } else {
      return 'The ________ of these findings is clear.';
    }
    const word = wordObj.word;
    const regex = new RegExp('\\b' + word + '\\b', 'gi');
    if (regex.test(sentence)) {
      return sentence.replace(regex, '________');
    }
    const subIdx = sentence.toLowerCase().indexOf(word.toLowerCase());
    if (subIdx !== -1) {
      return sentence.substring(0, subIdx) + '________' + sentence.substring(subIdx + word.length);
    }
    return sentence + ' (________)';
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
  const startDailyStudy = async (dayNum, resumeIdx = null, resumePhase = null) => {
    const category = selectedCategory || 'fen';
    setSelectedDay(dayNum);

    const dailyKelimeKey = `@dataset/yokdil/${category}/gunluk_kamp/kelime/day_${dayNum}.json`;
    const wordsKey = `@dataset/yokdil/${category}/kelimeler.json`;

    const loadDailyKelime = getCampModule(dailyKelimeKey);
    const loadWords = getCampModule(wordsKey);

    if (!loadDailyKelime) {
      alert("Seçilen güne ait kelimeler bulunamadı!");
      return;
    }

    let dailyKelimeData = {};
    let wordsData = {};
    try {
      const kelimeMod = await loadDailyKelime();
      dailyKelimeData = kelimeMod.default || kelimeMod;

      if (Object.keys(allWordsDb).length === 0 && loadWords) {
        const wordsMod = await loadWords();
        wordsData = wordsMod.default || wordsMod;
        setAllWordsDb(wordsData);
      } else {
        wordsData = allWordsDb;
      }
    } catch (e) {
      console.error("Günün kelimeleri veya veritabanı yüklenemedi:", e);
      alert("Veriler yüklenirken hata oluştu!");
      return;
    }

    const dayWords = {};
    dailyKelimeData.words.forEach(w => {
      dayWords[w.word] = w;
    });

    const dayWordKeys = dailyKelimeData.words.map(w => w.word);

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
    const extraWrong = wrongWordsList.filter(w => !dayWordKeys.includes(w)).slice(0, 5);

    const candidateWords = [...dailyKelimeData.words];

    extraWrong.forEach(w => {
      if (wrongDetailsMap[w]) {
        candidateWords.push({
          word: w,
          ...wrongDetailsMap[w],
          isFromWrongList: true
        });
      }
    });

    // 20 Kelime Seçim Mantığı (Spaced Repetition & Mastery Puanlarına Göre):
    const masteryMap = progress.wordMastery || {};
    const sortedCandidates = [...candidateWords].sort((a, b) => {
      if (a.isFromWrongList && !b.isFromWrongList) return -1;
      if (!a.isFromWrongList && b.isFromWrongList) return 1;
      const levelA = masteryMap[a.word] || 0;
      const levelB = masteryMap[b.word] || 0;
      return levelA - levelB;
    });

    // Seçilen ilk 20 kelime
    const finalWords = sortedCandidates.slice(0, 20);

    // Generate random sentence indexes for each study word
    const randIndexes = finalWords.map(w => {
      const sLen = (w.sentences && w.sentences.length) || 1;
      return Math.floor(Math.random() * sLen);
    });
    setClozeSentenceIndexes(randIndexes);

    // Save current day words and start study
    setActiveDayWords(dayWords);
    setStudyWords(finalWords);
    const targetIdx = resumeIdx !== null ? resumeIdx : 0;
    const targetPhase = resumePhase !== null ? resumePhase : 1;
    setCurrentIdx(targetIdx);
    setPhase(targetPhase);
    setIsStudying(true);

    // If options are empty, initialize them based on current phase
    if (targetPhase === 2 && finalWords[targetIdx]) {
      const allWords = Object.keys(dayWords);
      const filtered = allWords.filter(w => w !== finalWords[targetIdx].word);
      const opts = [
        finalWords[targetIdx].tr,
        dayWords[filtered[0]]?.tr || 'değerlendirmek',
        dayWords[filtered[1]]?.tr || 'açığa çıkarmak',
        dayWords[filtered[2]]?.tr || 'önlemek'
      ].sort(() => Math.random() - 0.5);
      setMeaningOptions(opts);
    }

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
      // Transition to Synonym Practice (Phase 3) - Skip words with no synonyms
      const firstWithSyn = studyWords.findIndex(w => w.synonyms && w.synonyms.trim() !== "" && w.synonyms.trim().toLowerCase() !== "yok");
      if (firstWithSyn !== -1) {
        setPhase(3);
        setCurrentIdx(firstWithSyn);
        setSynonymOptions(getSynonymOptions(studyWords[firstWithSyn].synonyms));
      } else {
        // Transition to Antonym Practice (Phase 4) - Skip words with no antonyms
        const firstWithAnt = studyWords.findIndex(w => hasAntonym(w));
        if (firstWithAnt !== -1) {
          setPhase(4);
          setCurrentIdx(firstWithAnt);
          setAntonymOptions(getAntonymOptions(getAntonym(studyWords[firstWithAnt])));
        } else {
          // Transition to Cloze Sentence (Phase 5)
          setPhase(5);
          setCurrentIdx(0);
          setClozeOptions(getClozeOptions(studyWords[0].word));
        }
      }
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
    
    // Find next word that actually has synonyms defined
    const nextIdx = studyWords.findIndex((w, idx) => idx > currentIdx && w.synonyms && w.synonyms.trim() !== "" && w.synonyms.trim().toLowerCase() !== "yok");
    if (nextIdx !== -1) {
      setCurrentIdx(nextIdx);
      setSynonymOptions(getSynonymOptions(studyWords[nextIdx].synonyms));
    } else {
      // Transition to Antonym Practice (Phase 4) - Skip words with no antonyms
      const firstWithAnt = studyWords.findIndex(w => hasAntonym(w));
      if (firstWithAnt !== -1) {
        setPhase(4);
        setCurrentIdx(firstWithAnt);
        setAntonymOptions(getAntonymOptions(getAntonym(studyWords[firstWithAnt])));
      } else {
        // Transition to Cloze Sentence (Phase 5)
        setPhase(5);
        setCurrentIdx(0);
        setClozeOptions(getClozeOptions(studyWords[0].word));
      }
    }
  };

  const handleAntonymCheck = (opt) => {
    if (antonymChecked) return;
    setAntonymSelected(opt);
    const antonymStr = getAntonym(studyWords[currentIdx]);
    const cleanCorrect = antonymStr.split(',')[0].trim();
    const isCorrect = opt === cleanCorrect;
    setAntonymCorrect(isCorrect);
    setAntonymChecked(true);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setWordResults(prev => ({
      ...prev,
      [studyWords[currentIdx].word]: prev[studyWords[currentIdx].word] && isCorrect
    }));
  };

  const handleAntonymNext = () => {
    setAntonymSelected(null);
    setAntonymChecked(false);
    setAntonymCorrect(null);
    
    // Find next word that actually has antonyms defined
    const nextIdx = studyWords.findIndex((w, idx) => idx > currentIdx && hasAntonym(w));
    if (nextIdx !== -1) {
      setCurrentIdx(nextIdx);
      setAntonymOptions(getAntonymOptions(getAntonym(studyWords[nextIdx])));
    } else {
      // Transition to Cloze Sentence (Phase 5)
      setPhase(5);
      setCurrentIdx(0);
      setClozeOptions(getClozeOptions(studyWords[0].word));
    }
  };

  const handleClozeCheck = (opt) => {
    if (clozeChecked) return;
    let isCorrect = false;
    if (clozeMode === 'write') {
      const userText = clozeInputText.toLowerCase().trim();
      const targetText = studyWords[currentIdx].word.toLowerCase().trim();
      isCorrect = userText === targetText;
      setClozeSelected(clozeInputText || 'Boş');
    } else {
      setClozeSelected(opt);
      isCorrect = opt === studyWords[currentIdx].word;
    }
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
    setClozeInputText('');
    setClozeShowHint(false);
    const nextIdx = currentIdx + 1;
    if (nextIdx < studyWords.length) {
      setCurrentIdx(nextIdx);
      setClozeOptions(getClozeOptions(studyWords[nextIdx].word));
    } else {
      // Transition to Summary (Phase 6)
      handleCampComplete();
    }
  };

  const handleCampComplete = () => {
    // Transition to Summary (Phase 6)
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
        nextDay = Math.min(totalCampDays, todayNum + 1);
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
  };

  const startGrammarStudy = async (dayNum, resumeIdx = null, resumePhase = null) => {
    const category = selectedCategory || 'fen';
    setSelectedDay(dayNum);

    const grammarKey = `@dataset/yokdil/${category}/gunluk_kamp/grammar/day_${dayNum}.json`;
    const loadGrammar = getCampModule(grammarKey);

    if (!loadGrammar) {
      alert("Seçilen güne ait dilbilgisi konusu bulunamadı!");
      return;
    }

    let dayData = {};
    try {
      const grammarMod = await loadGrammar();
      dayData = grammarMod.default || grammarMod;
    } catch (e) {
      console.error("Dilbilgisi verisi yüklenemedi:", e);
      alert("Dilbilgisi verileri yüklenirken hata oluştu!");
      return;
    }

    setActiveGrammarDay(dayData);
    setGrammarQuestions(dayData.questions);
    setGrammarIdx(resumeIdx !== null ? resumeIdx : 0);
    setPhase(resumePhase !== null ? resumePhase : 1); // 1: Konu Anlatımı, 2: Konu Testi, 3: Rapor
    setIsStudying(true);

    // Reset stats
    setCorrectAnswers(0);
    setTotalQuestions(0);
  };

  const handleGrammarNextLecture = () => {
    setPhase(2); // Go to Quiz
    setGrammarIdx(0);
    setGrammarSelected(null);
    setGrammarChecked(false);
    setGrammarCorrect(null);
  };

  const handleGrammarCheck = (opt) => {
    if (grammarChecked) return;
    setGrammarSelected(opt);
    const currentQ = grammarQuestions[grammarIdx];
    const isCorrect = opt === currentQ.answer;
    setGrammarCorrect(isCorrect);
    setGrammarChecked(true);
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };

  const handleGrammarNextQuestion = () => {
    setGrammarSelected(null);
    setGrammarChecked(false);
    setGrammarCorrect(null);
    const nextIdx = grammarIdx + 1;
    if (nextIdx < grammarQuestions.length) {
      setGrammarIdx(nextIdx);
    } else {
      // Complete day
      handleGrammarComplete();
    }
  };

  const handleGrammarComplete = () => {
    setPhase(3); // Summary
    const score = Math.round((correctAnswers / totalQuestions) * 100) || 100;
    const isPassed = score >= 80; // Pass mark for grammar is 80%

    const todayNum = selectedDay;
    const updatedCompleted = {
      ...grammarProgress.completedDays,
      [todayNum]: {
        score,
        date: new Date().toLocaleDateString(),
        correctCount: correctAnswers,
        totalQuestions: totalQuestions,
        isPassed
      }
    };

    let nextDay = grammarProgress.currentDay;
    if (isPassed) {
      if (todayNum === grammarProgress.currentDay) {
        nextDay = Math.min(30, todayNum + 1);
      }
      if (awardPetXP) awardPetXP(45);
      if (triggerConfetti) triggerConfetti();

      const currentCrystals = parseInt(localStorage.getItem('yokdil_crystals') || '0', 10);
      localStorage.setItem('yokdil_crystals', String(currentCrystals + 10));
      window.dispatchEvent(new Event('custom-pet-updated'));
    }

    saveGrammarProgress({
      currentDay: nextDay,
      completedDays: updatedCompleted
    });
  };

  const exitCamp = () => {
    setIsStudying(false);
    setPhase(1);
    setCurrentIdx(0);
    setGrammarIdx(0);
    setGrammarSelected(null);
    setGrammarChecked(false);
    setGrammarCorrect(null);
  };

  // Rendering Camp Grid (Menu Mode)
  if (!isStudying) {
    const completedDaysMap = progress.completedDays || {};
    const wordMasteryMap = progress.wordMastery || {};
    const totalDone = Object.keys(completedDaysMap).length;
    const currentDay = progress.currentDay || 1;
    const totalSupermaster = Object.values(wordMasteryMap).filter(v => v === 3).length;

    // Grammar calculations
    const grammarDoneMap = grammarProgress.completedDays || {};
    const grammarDoneCount = Object.keys(grammarDoneMap).length;
    const currentGrammarDay = grammarProgress.currentDay || 1;

    return (
      <div className="space-y-6">
        {/* Camp Type Switcher */}
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '4px', maxWidth: '400px', margin: '0 auto 10px auto' }}>
          <button
            onClick={() => setCampType('vocabulary')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              background: campType === 'vocabulary' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: campType === 'vocabulary' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
              color: campType === 'vocabulary' ? '#a5b4fc' : '#94a3b8',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            📖 Kelime Kampı
          </button>
          <button
            onClick={() => setCampType('grammar')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '10px',
              background: campType === 'grammar' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              border: campType === 'grammar' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
              color: campType === 'grammar' ? '#a7f3d0' : '#94a3b8',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            🧠 Dilbilgisi Kampı
          </button>
        </div>

        {campType === 'vocabulary' ? (
          <>
            {/* Vocabulary Camp Menu */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '12px', borderRadius: '12px', color: '#6366f1' }}>
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Kelime İlerlemesi</span>
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

            {/* Day List Panels */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Günlük Kamp</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: totalCampDays }).map((_, i) => {
                  const dayNum = i + 1;
                  const completedObj = completedDaysMap[dayNum];
                  const isCompleted = !!completedObj;
                  const isPassed = completedObj ? completedObj.isPassed : false;
                  const score = completedObj ? completedObj.score : null;

                  const isActive = dayNum === currentDay;

                  let border = '1px solid rgba(255, 255, 255, 0.06)';
                  let bg = 'rgba(255, 255, 255, 0.02)';
                  let badgeText = 'Çalışma Başlatılmadı';
                  let badgeBg = 'rgba(255, 255, 255, 0.05)';
                  let badgeColor = '#94a3b8';

                  if (isCompleted) {
                    if (isPassed) {
                      bg = 'rgba(16, 185, 129, 0.05)';
                      border = '1px solid rgba(16, 185, 129, 0.25)';
                      badgeText = `Başarılı (%${score})`;
                      badgeBg = 'rgba(16, 185, 129, 0.15)';
                      badgeColor = '#34d399';
                    } else {
                      bg = 'rgba(239, 68, 68, 0.05)';
                      border = '1px solid rgba(239, 68, 68, 0.25)';
                      badgeText = `Başarısız (%${score})`;
                      badgeBg = 'rgba(239, 68, 68, 0.15)';
                      badgeColor = '#f87171';
                    }
                  } else if (isActive) {
                    bg = 'rgba(99, 102, 241, 0.05)';
                    border = '1.5px solid rgba(99, 102, 241, 0.4)';
                    badgeText = 'Sıradaki Hedef';
                    badgeBg = 'rgba(99, 102, 241, 0.15)';
                    badgeColor = '#a5b4fc';
                  }

                  return (
                    <div
                      key={dayNum}
                      onClick={() => startDailyStudy(dayNum)}
                      style={{
                        background: bg,
                        border: border,
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        gap: '12px'
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isActive ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: isActive ? '#a5b4fc' : 'white', fontSize: '1.05rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {dayNum}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {dayNum}. Gün Akademik Kelimeleri
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                            Spaced Repetition & 20 Seçilmiş Kelime Kartı
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          background: badgeBg,
                          color: badgeColor
                        }}>
                          {badgeText}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Grammar Camp Menu */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Gramer İlerlemesi</span>
                  <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{grammarDoneCount} / 30 Gün</strong>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Aktif Hedef Gün</span>
                  <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>Gün #{currentGrammarDay}</strong>
                </div>
              </div>
            </div>

            {/* Start Grammar Camp Card */}
            <div className="glass-card text-center" style={{ padding: '36px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.04) 100%)', border: '1.5px solid rgba(16, 185, 129, 0.25)' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
                Akademik Dilbilgisi (Grammar) Kampı 🧠
              </h2>
              <p style={{ fontSize: '0.94rem', color: '#cbd5e1', maxWidth: '520px', margin: '8px auto 24px auto', lineHeight: 1.6 }}>
                YÖKDİL ve YDS sınavlarında en çok test edilen gramer konularını (Zamanlar, Bağlaçlar, Kısaltmalar, Edatlar) interaktif konu özetleri ve mini testlerle 30 günde tamamlayın.
              </p>

              {(() => {
                const completedObj = grammarDoneMap[currentGrammarDay];
                const isPassed = completedObj ? completedObj.isPassed : false;
                
                if (completedObj && isPassed) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        🎉 Bugünün dilbilgisi çalışmasını %{completedObj.score} başarıyla tamamladınız!
                      </div>
                      <button
                        onClick={() => startGrammarStudy(currentGrammarDay)}
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
                      onClick={() => startGrammarStudy(currentGrammarDay)}
                      className="btn-primary"
                      style={{ padding: '14px 36px', fontSize: '0.94rem', fontWeight: 'bold', borderRadius: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', borderColor: '#10b981' }}
                    >
                      Gün #{currentGrammarDay} Gramer Çalışmasını Başlat <ArrowRight className="h-4 w-4" />
                    </button>
                  );
                }
              })()}
            </div>

            {/* Grammar 30 Day List Panels */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Günlük Kamp</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const completedObj = grammarDoneMap[dayNum];
                  const isCompleted = !!completedObj;
                  const isPassed = completedObj ? completedObj.isPassed : false;
                  const score = completedObj ? completedObj.score : null;

                  const isActive = dayNum === currentGrammarDay;
                  const dayData = grammarCampDb[String(dayNum)];

                  let border = '1px solid rgba(255, 255, 255, 0.06)';
                  let bg = 'rgba(255, 255, 255, 0.02)';
                  let badgeText = 'Çalışma Başlatılmadı';
                  let badgeBg = 'rgba(255, 255, 255, 0.05)';
                  let badgeColor = '#94a3b8';

                  if (isCompleted) {
                    if (isPassed) {
                      bg = 'rgba(16, 185, 129, 0.05)';
                      border = '1px solid rgba(16, 185, 129, 0.25)';
                      badgeText = `Başarılı (%${score})`;
                      badgeBg = 'rgba(16, 185, 129, 0.15)';
                      badgeColor = '#34d399';
                    } else {
                      bg = 'rgba(239, 68, 68, 0.05)';
                      border = '1px solid rgba(239, 68, 68, 0.25)';
                      badgeText = `Başarısız (%${score})`;
                      badgeBg = 'rgba(239, 68, 68, 0.15)';
                      badgeColor = '#f87171';
                    }
                  } else if (isActive) {
                    bg = 'rgba(16, 185, 129, 0.05)';
                    border = '1.5px solid rgba(16, 185, 129, 0.4)';
                    badgeText = 'Sıradaki Hedef';
                    badgeBg = 'rgba(16, 185, 129, 0.15)';
                    badgeColor = '#a7f3d0';
                  }

                  return (
                    <div
                      key={dayNum}
                      onClick={() => startGrammarStudy(dayNum)}
                      style={{
                        background: bg,
                        border: border,
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        gap: '12px'
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: isActive ? '#a7f3d0' : 'white', fontSize: '1.05rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {dayNum}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {dayData?.title || `${dayNum}. Gün Dilbilgisi Konusu`}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                            Konu Anlatımı & 5 Pekiştirme Sorusu
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          background: badgeBg,
                          color: badgeColor
                        }}>
                          {badgeText}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Study Flow View
  if (campType === 'grammar') {
    return (
      <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px' }}>
        
        {/* Grammar Flow Header and Progress */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>GÜN #{selectedDay} DİLBİLGİSİ KAMPI</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'white', margin: 0 }}>{activeGrammarDay?.title}</h3>
            </div>
            
            {/* Grammar Progress Bar */}
            <div style={{ flex: 1, minWidth: '150px', maxWidth: '350px', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${phase === 3 ? 100 : (phase === 1 ? 33 : 33 + ((grammarIdx + 1) / (grammarQuestions.length || 5) * 66))}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        </div>

        {/* GRAMMAR PHASE 1: LECTURE CARD */}
        {phase === 1 && activeGrammarDay && (
          <div className="space-y-6 animate-scale-in">
            <div style={{ padding: '0 8px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
                BUGÜNÜN KONUSU
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: '0 0 20px 0' }}>
                {activeGrammarDay.title}
              </h2>
            </div>

            {(() => {
              const sections = activeGrammarDay.lecture.split('\n\n');
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sections.map((section, sIdx) => {
                    if (sIdx === 0 && !section.startsWith('1.') && !section.startsWith('2.') && !section.startsWith('3.')) {
                      // Render intro/overview card
                      return (
                        <div 
                          key={sIdx}
                          className="glass-card animate-scale-in" 
                          style={{ 
                            padding: '24px', 
                            borderRadius: '20px', 
                            background: 'rgba(15, 23, 42, 0.45)', 
                            border: '1.5px solid rgba(16, 185, 129, 0.15)',
                            textAlign: 'left'
                          }}
                        >
                          <p style={{ fontSize: '1.02rem', color: '#f1f5f9', lineHeight: 1.7, margin: 0, fontWeight: '500' }}>
                            {section}
                          </p>
                        </div>
                      );
                    }
                    
                    let sectionTitle = 'Genel Bilgi';
                    let sectionContent = section;
                    let borderLeftColor = '#10b981';
                    let bgGlow = 'rgba(16, 185, 129, 0.02)';
                    
                    if (section.includes('1. TEMEL KURALLAR VE FORMÜLLER:')) {
                      sectionTitle = '📘 1. Temel Kurallar & Formüller';
                      sectionContent = section.replace('1. TEMEL KURALLAR VE FORMÜLLER:', '').trim();
                      borderLeftColor = '#6366f1';
                      bgGlow = 'rgba(99, 102, 241, 0.05)';
                    } else if (section.includes('2. ÖRNEK AKADEMİK CÜMLELER:')) {
                      sectionTitle = '🔍 2. Örnek Akademik Cümleler';
                      sectionContent = section.replace('2. ÖRNEK AKADEMİK CÜMLELER:', '').trim();
                      borderLeftColor = '#10b981';
                      bgGlow = 'rgba(16, 185, 129, 0.05)';
                    } else if (section.includes('3. SINAV STRATEJİLERİ VE İPUÇLARI:')) {
                      sectionTitle = '💡 3. Sınav Stratejileri & İpuçları';
                      sectionContent = section.replace('3. SINAV STRATEJİLERİ VE İPUÇLARI:', '').trim();
                      borderLeftColor = '#fbbf24';
                      bgGlow = 'rgba(251, 191, 36, 0.05)';
                    } else {
                      // If it's a fallback block, display normally
                      return (
                        <div 
                          key={sIdx}
                          className="glass-card" 
                          style={{ 
                            padding: '20px 24px', 
                            borderRadius: '16px', 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid rgba(255,255,255,0.06)',
                            textAlign: 'left'
                          }}
                        >
                          <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {section}
                          </p>
                        </div>
                      );
                    }
                    
                    return (
                      <div 
                        key={sIdx}
                        className="glass-card animate-scale-in" 
                        style={{ 
                          padding: '22px 26px', 
                          borderRadius: '18px', 
                          background: bgGlow, 
                          border: '1.5px solid rgba(255, 255, 255, 0.04)',
                          borderLeft: `5px solid ${borderLeftColor}`,
                          textAlign: 'left'
                        }}
                      >
                        <h4 style={{ fontSize: '1.08rem', fontWeight: 'bold', color: 'white', marginTop: 0, marginBottom: '12px', letterSpacing: '-0.01em' }}>
                          {sectionTitle}
                        </h4>
                        <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {sectionContent}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button
                onClick={handleGrammarNextLecture}
                className="btn-primary"
                style={{ padding: '12px 32px', fontSize: '0.88rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', borderColor: '#10b981', borderRadius: '12px' }}
              >
                Konu Testine Geç <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* GRAMMAR PHASE 2: QUIZ */}
        {phase === 2 && grammarQuestions.length > 0 && grammarQuestions[grammarIdx] && (
          <div className="space-y-6 animate-scale-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
                Adım 2: Konu Pekiştirme Testi <span style={{ color: '#10b981' }}>({grammarIdx + 1}/{grammarQuestions.length})</span>
              </h4>
            </div>

            <div className="glass-card" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORU</span>
                <p style={{ fontSize: '1.1rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>
                  {grammarQuestions[grammarIdx].q}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', width: '100%', marginTop: '16px' }}>
                  {grammarQuestions[grammarIdx].options.map((opt, i) => {
                    const isSelected = grammarSelected === opt;
                    const isCorrectAnswer = opt === grammarQuestions[grammarIdx].answer;
                    let bg = 'rgba(255, 255, 255, 0.03)';
                    let border = '1px solid rgba(255, 255, 255, 0.08)';
                    let color = 'white';

                    if (grammarChecked) {
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
                        onClick={() => handleGrammarCheck(opt)}
                        disabled={grammarChecked}
                        style={{
                          padding: '14px 20px',
                          borderRadius: '12px',
                          background: bg,
                          border: border,
                          color: color,
                          fontSize: '0.94rem',
                          fontWeight: 'bold',
                          textAlign: 'left',
                          cursor: grammarChecked ? 'default' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {grammarChecked && (
                  <div className="glass-card animate-scale-in" style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: grammarCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                    border: grammarCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f1f5f9',
                    marginTop: '12px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: grammarCorrect ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      {grammarCorrect ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {grammarCorrect ? 'Doğru Cevap!' : `Hatalı! Doğru cevap: "${grammarQuestions[grammarIdx].answer}"`}
                    </strong>
                    {grammarQuestions[grammarIdx].exp}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              {grammarChecked && (
                <button
                  onClick={handleGrammarNextQuestion}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {grammarIdx === grammarQuestions.length - 1 ? 'Çalışmayı Bitir' : 'Sıradaki Soru'} <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* GRAMMAR PHASE 3: SUMMARY */}
        {phase === 3 && (
          <div className="space-y-6 text-center py-8 animate-scale-in">
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
              Tebrikler! Gün #{selectedDay} Dilbilgisi Çalışması Tamamlandı! 🎉
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
              Bugünün dilbilgisi konusunu ve testini başarıyla tamamladınız. Skorunuz: %{Math.round((correctAnswers / totalQuestions) * 100) || 100}
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
              <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Kazanılan Ödül</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block', marginTop: '4px' }}>+45 Evcil Hayvan XP</span>
              </div>
              <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Ekstra Kristal</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginTop: '4px' }}>+10 Kristal 💎</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={exitCamp}
                className="btn-primary"
                style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Gramer Takvimine Dön
              </button>
            </div>
          </div>
        )}

        {/* Exit Camp Button for active grammar study phases (1-2) */}
        {phase < 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
            <button 
              onClick={exitCamp} 
              className="btn-secondary" 
              style={{ 
                padding: '8px 24px', 
                fontSize: '0.8rem', 
                background: 'rgba(239, 68, 68, 0.08)', 
                border: '1px solid rgba(239, 68, 68, 0.25)', 
                color: '#f87171',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Kampı Kapat ve Çık
            </button>
          </div>
        )}
      </div>
    );
  }

  // Vocabulary Study Flow View
  return (
    <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Flow Header and Progress */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>GÜN #{selectedDay} KAMP ÇALIŞMASI</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'white', margin: 0 }}>Kelime Kampı ({studyWords.length} Kelime)</h3>
          </div>
          
          {/* Dynamic Progress Bar */}
          <div style={{ flex: 1, minWidth: '150px', maxWidth: '350px', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${phase === 6 ? 100 : (((phase - 1) * 20) + ((currentIdx + 1) / studyWords.length * 20))}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
      </div>

      {/* PHASE 1: LEARN CARD */}
      {phase === 1 && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 1: Modadil Akademik Kelime Kartı <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ 
            padding: '24px 28px', 
            borderRadius: '24px', 
            background: 'rgba(15, 23, 42, 0.65)', 
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(12px)',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em' }}>İNGİLİZCE KELİME</span>
              <h1 style={{ 
                fontSize: studyWords[currentIdx].word.length > 15 ? '1.8rem' : (studyWords[currentIdx].word.length > 10 ? '2.2rem' : '2.6rem'), 
                fontWeight: '900', 
                color: '#ffffff', 
                margin: 0, 
                letterSpacing: '-0.02em',
                textShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
                maxWidth: '100%'
              }}>
                {studyWords[currentIdx].word}
              </h1>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                <span className="word-badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', fontSize: '0.68rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '8px' }}>
                  {formatWordType(studyWords[currentIdx].type)}
                </span>
                {studyWords[currentIdx].priority && (
                  <span className="word-badge" style={{ 
                    background: studyWords[currentIdx].priority === 'Çok Yüksek Sıklık' ? 'rgba(239, 68, 68, 0.15)' : (studyWords[currentIdx].priority === 'Yüksek Sıklık' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)'), 
                    color: studyWords[currentIdx].priority === 'Çok Yüksek Sıklık' ? '#fca5a5' : (studyWords[currentIdx].priority === 'Yüksek Sıklık' ? '#fcd34d' : '#c7d2fe'), 
                    fontSize: '0.68rem',
                    fontWeight: '600',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '3px 10px',
                    borderRadius: '8px'
                  }}>
                    🎯 {studyWords[currentIdx].priority}
                  </span>
                )}
              </div>
              
              <div style={{ margin: '10px 0', height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

              <span style={{ fontSize: '0.65rem', color: '#a5b4fc', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em' }}>TÜRKÇE ANLAMI</span>
              <h2 style={{ 
                fontSize: studyWords[currentIdx].tr.length > 25 ? '1.15rem' : (studyWords[currentIdx].tr.length > 15 ? '1.3rem' : '1.5rem'), 
                fontWeight: '800', 
                color: '#c7d2fe', 
                margin: 0,
                maxWidth: '100%'
              }}>
                {studyWords[currentIdx].tr}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.1)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.6rem', color: '#a5b4fc', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  🔄 EŞ ANLAMLILAR
                </span>
                {getSynonymsList(studyWords[currentIdx]).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {getSynonymsList(studyWords[currentIdx]).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: 'white', fontWeight: '700', lineHeight: '1.2' }}>
                        {item.eng} {item.tr && <span style={{ color: '#a5b4fc', fontWeight: '500', fontSize: '0.72rem' }}>({item.tr})</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>Yok</p>
                )}
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.6rem', color: '#f87171', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  🔀 ZIT ANLAMLILAR
                </span>
                {getAntonymsList(studyWords[currentIdx]).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {getAntonymsList(studyWords[currentIdx]).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: 'white', fontWeight: '700', lineHeight: '1.2' }}>
                        {item.eng} {item.tr && <span style={{ color: '#fca5a5', fontWeight: '500', fontSize: '0.72rem' }}>({item.tr})</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>Yok</p>
                )}
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '10px 12px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.6rem', color: '#34d399', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  🔗 BİRLİKTE KULLANIMLAR (COLLOCATIONS)
                </span>
                {getCollocationsList(studyWords[currentIdx]).length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {getCollocationsList(studyWords[currentIdx]).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.78rem', color: 'white', fontWeight: '700', fontStyle: 'italic', lineHeight: '1.2' }}>
                        {item.eng} {item.tr && <span style={{ color: '#a7f3d0', fontWeight: '500', fontSize: '0.72rem', fontStyle: 'normal' }}>({item.tr})</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>Yok</p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 16px', borderRadius: '16px', background: 'rgba(251, 191, 36, 0.03)', border: '1px dashed rgba(251, 191, 36, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  📝 ÖRNEK AKADEMİK CÜMLE (YÖKDİL)
                </span>
                {studyWords[currentIdx].sentences && (
                  <button 
                    onClick={() => setSentenceIdx(prev => (prev + 1) % studyWords[currentIdx].sentences.length)}
                    style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '6px',
                      color: '#fbbf24',
                      padding: '2px 8px',
                      fontSize: '0.6rem',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                  >
                    🔄 Cümleyi Değiştir ({sentenceIdx + 1}/5)
                  </button>
                )}
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.5, margin: '0 0 6px 0', fontWeight: '500' }}>
                  "{getSentenceEn(studyWords[currentIdx])}"
                </p>
                {getSentenceTr(studyWords[currentIdx]) && (
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                    {getSentenceTr(studyWords[currentIdx])}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
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
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 2: Kelimenin Anlamını Eşleştirin <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
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
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: meaningChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{opt}</span>
                      {meaningChecked && (() => {
                        const eng = getEnglishForMeaningOption(opt);
                        return eng ? (
                          <span style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: '700', color: isCorrectAnswer ? '#67e8f9' : '#cbd5e1' }}>
                            ({eng})
                          </span>
                        ) : null;
                      })()}
                    </button>
                  );
                })}
              </div>

              {meaningChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: meaningCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: meaningCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: meaningCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '8px',
                  fontSize: '0.8rem',
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            {meaningChecked && (
              <button
                onClick={handleMeaningNext}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: SYNONYM PRACTICE */}
      {phase === 3 && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 3: Eş Anlamlıyı Bulun <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
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
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
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
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: synonymCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: synonymCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: synonymCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '8px',
                  fontSize: '0.8rem',
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            {synonymChecked && (
              <button
                onClick={handleSynonymNext}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: ANTONYM PRACTICE (NEW!) */}
      {phase === 4 && studyWords && studyWords.length > 0 && studyWords[currentIdx] && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 4: Zıt Anlamlıyı Bulun <span style={{ color: '#f87171' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(239, 68, 68, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
                {antonymOptions.map((opt, i) => {
                  const isSelected = antonymSelected === opt;
                  const antonymStr = getAntonym(studyWords[currentIdx]);
                  const cleanCorrect = antonymStr.split(',')[0].trim();
                  const isCorrectAnswer = opt === cleanCorrect;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (antonymChecked) {
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
                      onClick={() => handleAntonymCheck(opt)}
                      disabled={antonymChecked}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: antonymChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {antonymChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: antonymCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: antonymCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: antonymCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {antonymCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Zıt Anlam Doğru.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{getAntonym(studyWords[currentIdx]).split(',')[0].trim()}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            {antonymChecked && (
              <button
                onClick={handleAntonymNext}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 5: FILL-IN-THE-BLANK (CLOZE SENTENCE TEST) */}
      {phase === 5 && studyWords && studyWords.length > 0 && studyWords[currentIdx] && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 5: Cümle Boşluğunu Doldurun (Cloze Test) <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
            
            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button 
                onClick={() => { setClozeMode('choice'); setClozeChecked(false); setClozeCorrect(null); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: clozeMode === 'choice' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: clozeMode === 'choice' ? '#a5b4fc' : '#94a3b8'
                }}
              >
                Çoktan Seçmeli
              </button>
              <button 
                onClick={() => { setClozeMode('write'); setClozeChecked(false); setClozeCorrect(null); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: clozeMode === 'write' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: clozeMode === 'write' ? '#a7f3d0' : '#94a3b8'
                }}
              >
                ⌨️ Yazarak Pratik
              </button>
            </div>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '20px 24px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN AKADEMİK CÜMLE</span>
              
              <div style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '16px 20px', borderRadius: '14px', width: '100%', maxWidth: '550px', marginBottom: '8px' }}>
                <p style={{ fontSize: '1.05rem', color: 'white', fontWeight: '500', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{getBlankedSentence(studyWords[currentIdx], currentIdx)}"
                </p>
              </div>

              {clozeMode === 'write' ? (
                // WRITING/SPELLING MODE UI
                <div style={{ width: '100%', maxWidth: '550px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <input 
                      type="text"
                      value={clozeInputText}
                      onChange={(e) => setClozeInputText(e.target.value)}
                      disabled={clozeChecked}
                      placeholder="Boşluğa gelecek kelimeyi yazın..."
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        color: 'white',
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        outline: 'none',
                        textAlign: 'center'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !clozeChecked) {
                          handleClozeCheck();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleClozeCheck()}
                      disabled={clozeChecked}
                      className="btn-primary"
                      style={{
                        padding: '0 24px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '0.88rem',
                        background: '#10b981',
                        borderColor: '#10b981',
                        cursor: clozeChecked ? 'default' : 'pointer'
                      }}
                    >
                      Kontrol Et
                    </button>
                  </div>
                  
                  {!clozeChecked && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setClozeShowHint(true)}
                        style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                      >
                        💡 İpucu Al
                      </button>
                    </div>
                  )}

                  {clozeShowHint && !clozeChecked && (
                    <div style={{ fontSize: '0.78rem', color: '#fde047', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                      İpucu: Kelime <strong>"{studyWords[currentIdx].word[0].toUpperCase()}"</strong> harfiyle başlıyor ve <strong>{studyWords[currentIdx].word.length}</strong> harften oluşuyor.
                    </div>
                  )}
                </div>
              ) : (
                // CLASSIC MULTIPLE CHOICE OPTIONS
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '550px', marginTop: '10px' }}>
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
                          padding: '12px 16px',
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
              )}

              {clozeChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: clozeCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: clozeCorrect ? '1.5px solid rgba(16, 185, 129, 0.2)' : '1.5px solid rgba(239, 68, 68, 0.2)',
                  color: clozeCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: '550px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {clozeCorrect ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>{clozeCorrect ? 'Tebrikler! Doğru Seçim.' : `Hatalı! Doğru cevap: "${studyWords[currentIdx].word}" olmalıydı.`}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    <strong>Türkçe Çeviri:</strong> {studyWords[currentIdx].sentences && studyWords[currentIdx].sentences.length > (clozeSentenceIndexes[currentIdx] || 0) ? studyWords[currentIdx].sentences[clozeSentenceIndexes[currentIdx] || 0].tr : (studyWords[currentIdx].en_tr || studyWords[currentIdx].tr)}
                  </div>
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

      {/* PHASE 6: DAY SUMMARY / REPORT */}
      {phase === 6 && (
        <div className="space-y-6 text-center py-8 animate-scale-in">
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
            Tebrikler! Gün #{selectedDay} Başarıyla Tamamlandı! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Bugünün akademik kelimelerini; anlam okuma, anlam testi, eş anlam bulma, zıt anlam bulma ve çoktan seçmeli kelime testi ile başarıyla çalıştınız.
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
                      <span className="word-badge" style={{
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

      {/* Exit Camp Button at the very bottom for all active study phases (1-5) */}
      {phase < 6 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <button 
            onClick={exitCamp} 
            className="btn-secondary" 
            style={{ 
              padding: '8px 24px', 
              fontSize: '0.8rem', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              color: '#f87171',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Kampı Kapat ve Çık
          </button>
        </div>
      )}
    </div>
  );
};

export default CampSection;
