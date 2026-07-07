import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import SmartStudyDashboard from './SmartStudy/SmartStudyDashboard';
import SmartStudyFlow from './SmartStudy/SmartStudyFlow';

const CATEGORY_WORDS = {
  fen: [
    { 
      word: "evaluate", 
      meaning: "değerlendirmek", 
      type: "verb", 
      sentence: "Scientists evaluate the laboratory results carefully.", 
      translation: "Bilim insanları laboratuvar sonuçlarını dikkatle değerlendirir.",
      synonyms: "assess, appraise, analyze",
      collocation: "evaluate carefully, evaluate performance",
      examQuestion: "Scientists need to ________ the laboratory results carefully before drawing a final conclusion.",
      examOptions: ["evaluate", "discover", "convert", "inhibit"],
      strategy: "Boşluktan sonra 'the laboratory results' (laboratuvar sonuçları) nesnesi gelmiştir. Akademik dilde verileri veya sonuçları 'değerlendirmek' (evaluate) en sık kullanılan fiildir."
    },
    { 
      word: "discover", 
      meaning: "keşfetmek", 
      type: "verb", 
      sentence: "Astronomers discover a new habitable planet.", 
      translation: "Gökbilimciler yaşanabilir yeni bir gezegen keşfeter.",
      synonyms: "find, unearth, detect",
      collocation: "discover a planet, discover a cure",
      examQuestion: "Astronomers hope to ________ a new habitable planet in the distant solar system using the new telescope.",
      examOptions: ["inhibit", "discover", "absorb", "develop"],
      strategy: "Gökbilimcilerin (astronomers) yeni bir gezegen (a new planet) ile yapacağı en mantıklı eylem onu 'keşfetmektir' (discover)."
    },
    { 
      word: "reveal", 
      meaning: "açığa çıkarmak", 
      type: "verb", 
      sentence: "The research will reveal the causes of global warming.", 
      translation: "Araştırma, küresel ısınmanın nedenlerini açığa çıkaracak.",
      synonyms: "disclose, uncover, expose",
      collocation: "reveal the causes, reveal the truth",
      examQuestion: "The latest geological research will ________ the hidden causes of volcanic eruptions in the region.",
      examOptions: ["reveal", "sustain", "conduct", "alter"],
      strategy: "Gizli nedenleri (hidden causes) 'açığa çıkarmak' veya 'gözler önüne sermek' anlamında 'reveal' fiili tercih edilmelidir."
    },
    { 
      word: "significant", 
      meaning: "önemli, kayda değer", 
      type: "adj", 
      sentence: "There is a significant decrease in carbon emissions.", 
      translation: "Karbon emisyonlarında kayda değer bir düşüş var.",
      synonyms: "important, substantial, considerable",
      collocation: "significant decrease, significant impact",
      examQuestion: "There is a ________ decrease in carbon emissions due to new green policies enacted by the union.",
      examOptions: ["significant", "chronic", "independent", "abundant"],
      strategy: "Boşluktan sonra 'decrease' (düşüş) ismi gelmiştir. Onu niteleyecek en uygun akademik sıfat 'significant' (kayda değer, önemli) sıfatıdır."
    },
    { 
      word: "consequence", 
      meaning: "sonuç", 
      type: "noun", 
      sentence: "Rising sea levels are a direct consequence of melting glaciers.", 
      translation: "Deniz seviyelerinin yükselmesi, eriyen buzulların doğrudan bir sonucudur.",
      synonyms: "result, outcome, effect",
      collocation: "direct consequence, negative consequence",
      examQuestion: "Rising sea levels are a direct ________ of melting glaciers in polar regions.",
      examOptions: ["consequence", "disruption", "resistance", "deficit"],
      strategy: "Eriyen buzulların (melting glaciers) 'doğrudan bir sonucu' anlamını kurmak için 'direct consequence of' kalıbı kullanılmalıdır."
    },
    { 
      word: "establish", 
      meaning: "kurmak, saptamak", 
      type: "verb", 
      sentence: "They want to establish a new research institute.", 
      translation: "Yeni bir araştırma enstitüsü kurmak istiyorlar.",
      synonyms: "set up, found, determine",
      collocation: "establish a relationship, establish an institute",
      examQuestion: "The university plans to ________ a new research institute dedicated to renewable energy studies.",
      examOptions: ["establish", "inhibit", "absorb", "accelerate"],
      strategy: "Bir enstitü (institute), şirket veya vakıf nesne olarak geldiğinde 'kurmak, tesis etmek' anlamında 'establish' fiili kullanılır."
    },
    { 
      word: "develop", 
      meaning: "gelişmek, geliştirmek", 
      type: "verb", 
      sentence: "Engineers develop efficient solar panels.", 
      translation: "Mühendisler verimli güneş panelleri geliştirir.",
      synonyms: "improve, advance, create",
      collocation: "develop technology, develop a method",
      examQuestion: "Engineers are working to ________ more efficient solar panels to capture solar energy.",
      examOptions: ["develop", "regulate", "diagnose", "impair"],
      strategy: "Daha verimli güneş panellerini 'geliştirmek' anlamında 'develop' fiili uygun düşmektedir."
    },
    { 
      word: "provide", 
      meaning: "sağlamak", 
      type: "verb", 
      sentence: "Forests provide oxygen and habitat for wildlife.", 
      translation: "Ormanlar, yaban hayatı için oksijen ve yaşam alanı sağlar.",
      synonyms: "supply, offer, afford",
      collocation: "provide with, provide information",
      examQuestion: "Forests ________ a natural habitat for wildlife and produce a large amount of oxygen.",
      examOptions: ["provide", "inhibit", "predict", "convert"],
      strategy: "Ormanların yaban hayatı için doğal bir yaşam alanı 'sağlaması' (provide) anlamına gelen fiil seçilmelidir."
    },
    { 
      word: "influence", 
      meaning: "etkilemek", 
      type: "verb", 
      sentence: "Solar radiation can influence the Earth's climate.", 
      translation: "Güneş radyasyonu Dünya'nın iklimini etkileyebilir.",
      synonyms: "affect, impact, shape",
      collocation: "directly influence, influence decisions",
      examQuestion: "Fluctuations in solar radiation can significantly ________ the Earth's delicate climate system.",
      examOptions: ["influence", "establish", "generate", "conduct"],
      strategy: "Güneş radyasyonunun iklim sistemini 'etkilemesi' anlamında 'influence' (veya affect) fiili sıklıkla tercih edilir."
    },
    { 
      word: "determine", 
      meaning: "belirlemek", 
      type: "verb", 
      sentence: "DNA tests determine the evolutionary origin of the species.", 
      translation: "DNA testleri türlerin evrimsel kökenini belirler.",
      synonyms: "identify, establish, specify",
      collocation: "determine the cause, determine factors",
      examQuestion: "DNA tests are used by biologists to ________ the precise evolutionary origin of the species.",
      examOptions: ["determine", "accelerate", "sustain", "observe"],
      strategy: "Türlerin evrimsel kökenini 'belirlemek, saptamak' anlamında 'determine' fiili cümle akışına tam uymaktadır."
    }
  ],
  sosyal: [
    { 
      word: "dissemination", 
      meaning: "yayma, yayılma", 
      type: "noun", 
      sentence: "The printing press revolutionized the dissemination of knowledge.", 
      translation: "Matbaa, bilginin yayılmasında devrim yaratmıştır.",
      synonyms: "distribution, spreading, circulation",
      collocation: "dissemination of information, rapid dissemination",
      examQuestion: "The internet has revolutionized the rapid ________ of information across the globe.",
      examOptions: ["dissemination", "monopoly", "poverty", "heritage"],
      strategy: "Bilginin dünya geneline hızlıca 'yayılması' anlamında 'dissemination of information/knowledge' kalıbı yaygın bir akademik kullanımdır."
    },
    { 
      word: "migration", 
      meaning: "göç", 
      type: "noun", 
      sentence: "Economic crisis caused a massive urban migration.", 
      translation: "Ekonomik kriz kitlesel bir kentsel göçe neden oldu.",
      synonyms: "movement, relocation, emigration",
      collocation: "urban migration, mass migration",
      examQuestion: "The severe economic crisis in rural areas caused a massive urban ________.",
      examOptions: ["migration", "collateral", "entrepreneur", "reform"],
      strategy: "Kırsal alandan şehirlere doğru yaşanan kitlesel 'göç' anlamını karşılayan isim 'migration'dır."
    },
    { 
      word: "alleviate", 
      meaning: "hafifletmek", 
      type: "verb", 
      sentence: "Microloans aim to alleviate poverty in rural areas.", 
      translation: "Mikrokrediler kırsal alanlardaki yoksulluğu hafifletmeyi amaçlamaktadır.",
      synonyms: "relieve, ease, mitigate",
      collocation: "alleviate poverty, alleviate pain",
      examQuestion: "The new financial support program aims to ________ poverty in rural communities.",
      examOptions: ["alleviate", "stabilize", "acquire", "sustain"],
      strategy: "Yoksulluk (poverty) veya acı gibi olumsuz durumları 'hafifletmek, azaltmak' anlamında 'alleviate' (mitigate/ease) kullanılır."
    },
    { 
      word: "collateral", 
      meaning: "teminat", 
      type: "noun", 
      sentence: "Low-income families often lack collateral for bank loans.", 
      translation: "Düşük gelirli aileler genellikle banka kredileri için teminattan yoksundur.",
      synonyms: "security, guarantee, pledge",
      collocation: "provide collateral, lack collateral",
      examQuestion: "Low-income families often struggle to obtain bank loans because they lack ________.",
      examOptions: ["collateral", "heritage", "negotiation", "disruption"],
      strategy: "Banka kredileri için güvence veya 'teminat' gösterilememesi durumunu ifade etmek için 'collateral' ismi kullanılır."
    },
    { 
      word: "entrepreneur", 
      meaning: "girişimci", 
      type: "noun", 
      sentence: "The young entrepreneur started a successful tech startup.", 
      translation: "Genç girişimci başarılı bir teknoloji girişimi başlattı.",
      synonyms: "businessman, founder, investor",
      collocation: "successful entrepreneur, young entrepreneur",
      examQuestion: "A visionary ________ took a massive financial risk to start the innovative recycling factory.",
      examOptions: ["entrepreneur", "monopoly", "reform", "poverty"],
      strategy: "Yenilikçi bir fabrika kurmak için finansal risk alan 'girişimci' kişiyi tanımlayan kelime 'entrepreneur'dür."
    }
  ],
  saglik: [
    { 
      word: "regulate", 
      meaning: "düzenlemek", 
      type: "verb", 
      sentence: "Insulin helps regulate glucose in the bloodstream.", 
      translation: "İnsülin, kandaki glikozun düzenlenmesine yardımcı olur.",
      synonyms: "control, adjust, manage",
      collocation: "regulate hormone levels, regulate blood pressure",
      examQuestion: "The thyroid gland produces hormones that help ________ the body's metabolic rate.",
      examOptions: ["regulate", "diagnose", "penetrate", "impair"],
      strategy: "Vücudun metabolizma hızını veya hormon dengesini 'düzenlemek, kontrol altında tutmak' anlamında 'regulate' fiili kullanılır."
    },
    { 
      word: "resistance", 
      meaning: "direnç", 
      type: "noun", 
      sentence: "The patient developed a resistance to antibiotics.", 
      translation: "Hasta antibiyotiklere karşı direnç geliştirdi.",
      synonyms: "immunity, defense, opposition",
      collocation: "antibiotic resistance, insulin resistance",
      examQuestion: "Overuse of medication has led many patients to develop a high ________ to standard antibiotics.",
      examOptions: ["resistance", "symptom", "deficit", "disorder"],
      strategy: "Antibiyotiklere karşı vücudun veya bakterilerin geliştirdiği 'direnç' anlamını tamamlayan isim 'resistance'tır."
    },
    { 
      word: "prevent", 
      meaning: "önlemek", 
      type: "verb", 
      sentence: "Regular exercise helps prevent heart disease.", 
      translation: "Düzenli egzersiz kalp hastalığını önlemeye yardımcı olur.",
      synonyms: "avoid, block, hinder",
      collocation: "prevent from, prevent disease",
      examQuestion: "Adopting a balanced diet and exercising regularly can help ________ heart disease.",
      examOptions: ["prevent", "trigger", "ingest", "enhance"],
      strategy: "Kalp hastalıklarını veya enfeksiyonları 'önlemek, önüne geçmek' anlamında 'prevent' fiili en uygun seçenektir."
    },
    { 
      word: "compensate", 
      meaning: "telafi etmek", 
      type: "verb", 
      sentence: "The pancreas produces extra insulin to compensate.", 
      translation: "Pankreas telafi etmek için fazladan insülin üretir.",
      synonyms: "make up for, offset, balance",
      collocation: "compensate for, compensate loss",
      examQuestion: "The heart beats faster to ________ for the lower oxygen carrying capacity of the blood.",
      examOptions: ["compensate", "regulate", "transmit", "inhibit"],
      strategy: "Genellikle 'for' edatı ile birlikte kullanılan ve eksikliği 'telafi etmek, dengelemek' anlamına gelen fiil 'compensate'tir."
    },
    { 
      word: "diagnose", 
      meaning: "teşhis etmek", 
      type: "verb", 
      sentence: "Doctors use blood tests to diagnose the illness.", 
      translation: "Doktorlar hastalığı teşhis etmek için kan testleri kullanır.",
      synonyms: "identify, detect, determine",
      collocation: "diagnose early, diagnose with cancer",
      examQuestion: "Modern medical imaging techniques allow specialists to ________ serious illnesses at an early stage.",
      examOptions: ["diagnose", "administer", "contract", "absorb"],
      strategy: "Ciddi hastalıkları erken aşamada 'teşhis etmek, tanımlamak' anlamında 'diagnose' fiili kullanılır."
    }
  ]
};

const SmartStudySection = ({ selectedCategory, awardPetXP, triggerConfetti }) => {
  const [wordLimit, setWordLimit] = useState(10); // default limit
  const [studyStarted, setStudyStarted] = useState(false);
  const [phase, setPhase] = useState(1); // 1: Learn, 2: Spell, 3: Fill, 4: Summary
  const [currentIdx, setCurrentIdx] = useState(0);
  const [readWords, setReadWords] = useState({});
  const [strategySelected, setStrategySelected] = useState(null);
  const [strategyChecked, setStrategyChecked] = useState(false);
  const [strategyCorrect, setStrategyCorrect] = useState(null);
  const [showStrategyTip, setShowStrategyTip] = useState(false);

  // Spaced Repetition (Known/Learned Word Tracking) States
  const [onlyStudyWrong, setOnlyStudyWrong] = useState(false); // only study unknown words
  const [knownWords, setKnownWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('yokdil_smart_study_known_words') || '[]');
    } catch (e) {
      return [];
    }
  });

  const categoryKnownWords = knownWords.filter(w => w.category === (selectedCategory || 'fen'));
  const allWords = CATEGORY_WORDS[selectedCategory || 'fen'] || CATEGORY_WORDS.fen;
  const categoryUnknownWords = allWords.filter(w => !categoryKnownWords.some(ck => ck.word === w.word));
  const [studyWords, setStudyWords] = useState([]);

  // Shuffles array utility
  const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const words = studyStarted ? studyWords : (onlyStudyWrong ? categoryUnknownWords : allWords).slice(0, wordLimit);

  // Track known/learned word status in localStorage
  const trackWordStatus = (wordObj, isCorrect) => {
    setKnownWords(prev => {
      let updated;
      const cat = selectedCategory || 'fen';
      if (isCorrect) {
        // Add to known words
        const exists = prev.some(w => w.word === wordObj.word && w.category === cat);
        if (!exists) {
          updated = [...prev, { ...wordObj, category: cat }];
        } else {
          updated = prev;
        }
      } else {
        // Remove from known words
        updated = prev.filter(w => !(w.word === wordObj.word && w.category === cat));
      }
      localStorage.setItem('yokdil_smart_study_known_words', JSON.stringify(updated));
      return updated;
    });
  };

  // Phase 2: Meaning Selection State
  const [meaningOptions, setMeaningOptions] = useState([]);
  const [meaningSelected, setMeaningSelected] = useState(null);
  const [meaningChecked, setMeaningChecked] = useState(false);
  const [meaningCorrect, setMeaningCorrect] = useState(null);

  // Phase 3: Synonym Selection State
  const [synonymOptions, setSynonymOptions] = useState([]);
  const [synonymSelected, setSynonymSelected] = useState(null);
  const [synonymChecked, setSynonymChecked] = useState(false);
  const [synonymCorrect, setSynonymCorrect] = useState(null);

  // Phase 4: Cloze (Sentence Blank Fill) State
  const [clozeOptions, setClozeOptions] = useState([]);
  const [clozeSelected, setClozeSelected] = useState(null);
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeCorrect, setClozeCorrect] = useState(null);

  // Load session state from localStorage on category change or mount
  useEffect(() => {
    const category = selectedCategory || 'fen';
    const savedSession = localStorage.getItem(`yokdil_smart_study_session_${category}`);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.studyWords) setStudyWords(parsed.studyWords);
        if (typeof parsed.currentIdx === 'number') setCurrentIdx(parsed.currentIdx);
        if (typeof parsed.phase === 'number') setPhase(parsed.phase);
        if (typeof parsed.studyStarted === 'boolean') setStudyStarted(parsed.studyStarted);
        if (typeof parsed.wordLimit === 'number') setWordLimit(parsed.wordLimit);
        if (parsed.meaningOptions) setMeaningOptions(parsed.meaningOptions);
        if (parsed.synonymOptions) setSynonymOptions(parsed.synonymOptions);
        if (parsed.clozeOptions) setClozeOptions(parsed.clozeOptions);
      } catch (e) {
        console.error("Error loading smart study session:", e);
      }
    }
  }, [selectedCategory]);

  // Save session state to localStorage on state change
  useEffect(() => {
    if (!studyStarted) return;
    const category = selectedCategory || 'fen';
    const sessionObj = {
      studyWords,
      currentIdx,
      phase,
      studyStarted,
      wordLimit,
      meaningOptions,
      synonymOptions,
      clozeOptions
    };
    localStorage.setItem(`yokdil_smart_study_session_${category}`, JSON.stringify(sessionObj));
  }, [studyWords, currentIdx, phase, studyStarted, wordLimit, meaningOptions, synonymOptions, clozeOptions, selectedCategory]);

  const getOptionTranslation = (opt) => {
    if (!opt) return '';
    const cleaned = opt.toLowerCase().trim();
    const match = studyWords.find(w => w.word.toLowerCase() === cleaned || (w.synonyms && w.synonyms.split(',').map(s => s.trim().toLowerCase()).includes(cleaned)));
    if (match) return match.meaning;
    for (const cat of Object.keys(CATEGORY_WORDS)) {
      const match2 = CATEGORY_WORDS[cat].find(w => w.word.toLowerCase() === cleaned);
      if (match2) return match2.meaning;
    }
    for (const cat of Object.keys(CATEGORY_WORDS)) {
      const match3 = CATEGORY_WORDS[cat].find(w => w.synonyms && w.synonyms.split(',').map(s => s.trim().toLowerCase()).includes(cleaned));
      if (match3) return match3.meaning;
    }
    return '';
  };

  const getEnglishForMeaningOption = (turkishTr) => {
    if (!turkishTr) return '';
    const cleanTr = turkishTr.toLowerCase().trim();
    let match = words.find(w => w.meaning && w.meaning.toLowerCase().trim() === cleanTr);
    if (match) return match.word;
    for (const cat of Object.keys(CATEGORY_WORDS)) {
      const match2 = CATEGORY_WORDS[cat].find(w => w.meaning && w.meaning.toLowerCase().trim() === cleanTr);
      if (match2) return match2.word;
    }
    const staticMap = {
      'açıklamak': 'explain',
      'önlemek': 'prevent',
      'geliştirmek': 'develop',
      'saptamak': 'determine',
      'iyileştirmek': 'improve'
    };
    return staticMap[cleanTr] || '';
  };

  const getMeaningOptions = (correctMeaning, activeWords = words) => {
    const others = activeWords.filter(w => w.meaning !== correctMeaning).map(w => w.meaning);
    return [
      correctMeaning,
      others[0] || 'açıklamak',
      others[1] || 'önlemek',
      others[2] || 'geliştirmek'
    ].sort(() => Math.random() - 0.5);
  };

  const getSynonymOptions = (correctSynonymStr, activeWords = words) => {
    const cleanCorrect = correctSynonymStr ? correctSynonymStr.split(',')[0].trim() : 'assess';
    const others = activeWords
      .map(w => w.synonyms ? w.synonyms.split(',')[0].trim() : '')
      .filter(s => s && s !== cleanCorrect);
    return [
      cleanCorrect,
      others[0] || 'assess',
      others[1] || 'prevent',
      others[2] || 'develop'
    ].sort(() => Math.random() - 0.5);
  };

  const getClozeOptions = (correctWord, activeWords = words) => {
    const others = activeWords.filter(w => w.word !== correctWord).map(w => w.word);
    return [
      correctWord,
      others[0] || 'evaluate',
      others[1] || 'discover',
      others[2] || 'reveal'
    ].sort(() => Math.random() - 0.5);
  };

  const handleStartStudy = (limit) => {
    setWordLimit(limit);
    let activeWords = [];
    if (onlyStudyWrong) {
      activeWords = shuffleArray(categoryUnknownWords).slice(0, limit);
    } else {
      activeWords = [...shuffleArray(categoryUnknownWords), ...shuffleArray(categoryKnownWords)].slice(0, limit);
    }
    setStudyWords(activeWords);
    if (activeWords.length > 0) {
      setMeaningOptions(getMeaningOptions(activeWords[0].meaning, activeWords));
    }
    setStudyStarted(true);
    setPhase(1);
    setCurrentIdx(0);
  };

  const handleWordRead = (idx) => {
    setReadWords(prev => ({ ...prev, [idx]: true }));
    if (currentIdx < words.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setPhase(2);
      setCurrentIdx(0);
      setMeaningOptions(getMeaningOptions(words[0].meaning, words));
    }
  };

  const handleMeaningCheck = (opt) => {
    if (meaningChecked) return;
    setMeaningSelected(opt);
    const isCorrect = opt === words[currentIdx].meaning;
    setMeaningCorrect(isCorrect);
    setMeaningChecked(true);
    trackWordStatus(words[currentIdx], isCorrect);
  };

  const handleMeaningDontKnow = () => {
    if (meaningChecked) return;
    setMeaningSelected(words[currentIdx].meaning);
    setMeaningCorrect(false);
    setMeaningChecked(true);
    trackWordStatus(words[currentIdx], false);
  };

  const handleMeaningNext = () => {
    setMeaningSelected(null);
    setMeaningChecked(false);
    setMeaningCorrect(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < words.length) {
      setCurrentIdx(nextIdx);
      setMeaningOptions(getMeaningOptions(words[nextIdx].meaning, words));
    } else {
      setPhase(3);
      setCurrentIdx(0);
      setSynonymOptions(getSynonymOptions(words[0].synonyms, words));
    }
  };

  const handleSynonymCheck = (opt) => {
    if (synonymChecked) return;
    setSynonymSelected(opt);
    const correctVal = words[currentIdx].synonyms ? words[currentIdx].synonyms.split(',')[0].trim() : '';
    const isCorrect = opt === correctVal;
    setSynonymCorrect(isCorrect);
    setSynonymChecked(true);
    trackWordStatus(words[currentIdx], isCorrect);
  };

  const handleSynonymDontKnow = () => {
    if (synonymChecked) return;
    const correctVal = words[currentIdx].synonyms ? words[currentIdx].synonyms.split(',')[0].trim() : '';
    setSynonymSelected(correctVal);
    setSynonymCorrect(false);
    setSynonymChecked(true);
    trackWordStatus(words[currentIdx], false);
  };

  const handleSynonymNext = () => {
    setSynonymSelected(null);
    setSynonymChecked(false);
    setSynonymCorrect(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < words.length) {
      setCurrentIdx(nextIdx);
      setSynonymOptions(getSynonymOptions(words[nextIdx].synonyms, words));
    } else {
      setPhase(4);
      setCurrentIdx(0);
      setClozeOptions(getClozeOptions(words[0].word, words));
    }
  };

  const handleClozeCheck = (opt) => {
    if (clozeChecked) return;
    setClozeSelected(opt);
    const isCorrect = opt === words[currentIdx].word;
    setClozeCorrect(isCorrect);
    setClozeChecked(true);
    trackWordStatus(words[currentIdx], isCorrect);
  };

  const handleClozeDontKnow = () => {
    if (clozeChecked) return;
    setClozeSelected(words[currentIdx].word);
    setClozeCorrect(false);
    setClozeChecked(true);
    trackWordStatus(words[currentIdx], false);
  };

  const handleClozeNext = () => {
    setClozeSelected(null);
    setClozeChecked(false);
    setClozeCorrect(null);
    const nextIdx = currentIdx + 1;
    if (nextIdx < words.length) {
      setCurrentIdx(nextIdx);
      setClozeOptions(getClozeOptions(words[nextIdx].word, words));
    } else {
      setPhase(5);
      setCurrentIdx(0);
    }
  };

  const handleStrategyCheck = (opt) => {
    if (strategyChecked) return;
    setStrategySelected(opt);
    const isCorrect = opt === words[currentIdx].word;
    setStrategyCorrect(isCorrect);
    setStrategyChecked(true);
    trackWordStatus(words[currentIdx], isCorrect);
  };

  const handleStrategyDontKnow = () => {
    if (strategyChecked) return;
    setStrategySelected(words[currentIdx].word);
    setStrategyCorrect(false);
    setStrategyChecked(true);
    trackWordStatus(words[currentIdx], false);
  };

  const handleStrategyNext = () => {
    setStrategySelected(null);
    setStrategyChecked(false);
    setStrategyCorrect(null);
    setShowStrategyTip(false);
    const nextIdx = currentIdx + 1;
    if (nextIdx < words.length) {
      setCurrentIdx(nextIdx);
    } else {
      setPhase(6);
      if (awardPetXP) awardPetXP(50);
      if (triggerConfetti) triggerConfetti();
      
      const currentCrystals = parseInt(localStorage.getItem('yokdil_crystals') || '0', 10);
      localStorage.setItem('yokdil_crystals', String(currentCrystals + 5));
      window.dispatchEvent(new Event('custom-pet-updated'));
    }
  };

  const resetStudy = () => {
    setStudyStarted(false);
    setPhase(1);
    setCurrentIdx(0);
    setReadWords({});
    setMeaningSelected(null);
    setMeaningChecked(false);
    setMeaningCorrect(null);
    setSynonymSelected(null);
    setSynonymChecked(false);
    setSynonymCorrect(null);
    setClozeSelected(null);
    setClozeChecked(false);
    setClozeCorrect(null);
    setStrategySelected(null);
    setStrategyChecked(false);
    setStrategyCorrect(null);
    setShowStrategyTip(false);
  };

  if (!studyStarted) {
    return (
      <SmartStudyDashboard
        wordLimit={wordLimit}
        setWordLimit={setWordLimit}
        handleStartStudy={handleStartStudy}
      />
    );
  }

  if (!words || words.length === 0 || !words[currentIdx]) {
    return (
      <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: 'white', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Trophy size={48} style={{ color: '#fbbf24', marginBottom: '16px' }} />
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 'bold' }}>Tebrikler! 🎉</h3>
        <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Bu kategori için çalışılacak kelime bulunamadı veya tüm kelimeleri başarıyla tamamladınız.</p>
        <button
          onClick={() => {
            const category = selectedCategory || 'fen';
            localStorage.removeItem(`yokdil_smart_study_session_${category}`);
            localStorage.setItem('yokdil_smart_study_known_words', '[]');
            setKnownWords([]);
            setStudyStarted(false);
            setStudyWords([]);
            setPhase(1);
            setCurrentIdx(0);
          }}
          className="btn-primary"
          style={{ padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Çalışmayı Sıfırla ve Yeniden Başlat 🔄
        </button>
      </div>
    );
  }

  return (
    <SmartStudyFlow
      words={words}
      currentIdx={currentIdx}
      setCurrentIdx={setCurrentIdx}
      phase={phase}
      wordLimit={wordLimit}
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
};

export default SmartStudySection;
