import React, { useState } from 'react';
import { Check, AlertCircle, Award, ArrowRight, BookOpen, Edit3, HelpCircle, Trophy } from 'lucide-react';

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
      translation: "Gökbilimciler yaşanabilir yeni bir gezegen keşfeder.",
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

  // Smart Hint System State
  const [hintLevel, setHintLevel] = useState(0);

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

  // Helper to generate hints
  const getSpellingHint = (word, level) => {
    if (level === 0) return '';
    const chars = word.split('');
    if (level === 1) {
      return chars.map((c, i) => {
        if (i === 0 || i === chars.length - 1 || c === ' ' || c === '-') return c;
        return '_';
      }).join(' ');
    }
    return chars.map((c, i) => {
      if (i < 3 || i === chars.length - 1 || c === ' ' || c === '-') return c;
      return '_';
    }).join(' ');
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

  // Handler for Phase 1 (Word Navigation)
  const handleWordRead = (idx) => {
    setReadWords(prev => ({ ...prev, [idx]: true }));
    if (currentIdx < words.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Unlocked next phase
      setPhase(2);
      setCurrentIdx(0);
      setMeaningOptions(getMeaningOptions(words[0].meaning, words));
    }
  };

  // Handler for Phase 2 (Meaning Selection)
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

  // Handler for Phase 3 (Synonym Selection)
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

  // Handler for Phase 4 (Cloze Blank Fill)
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

  // Handler for Phase 5 (Strategy & Cloze Question)
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
      // Completed all phases (End of Study -> Phase 6)
      setPhase(6);
      if (awardPetXP) awardPetXP(50); // Give +50 XP
      if (triggerConfetti) triggerConfetti();
      
      // Award crystals (via localStorage)
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
      <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1.5px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <BookOpen className="h-8 w-8" />
            </div>
          </div>

          <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SİSTEMATİK AKILLI ÇALIŞMA</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: '8px 0' }}>Kelime Öğrenim Kampı</h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
            Bu modülde seçtiğiniz sayıda akademik kelimeyi; önce inceleyerek öğrenir, ardından doğru anlamını seçeneklerden bularak test edersiniz.
          </p>

          <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
            Çalışmak istediğiniz kelime sayısını seçin:
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
            {[5, 10, 15, 20].map((num) => (
              <button
                key={num}
                onClick={() => setWordLimit(num)}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: wordLimit === num ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: wordLimit === num ? '1.5px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: wordLimit === num ? '#a5b4fc' : 'white',
                  fontSize: '0.84rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {num} Kelime {num === 5 ? '(Hızlı)' : num === 10 ? '(Standart)' : num === 15 ? '(Detaylı)' : '(Kamp)'}
              </button>
            ))}
          </div>

          {/* Spaced Repetition (Unknown Word Tracking) Option */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 'bold', color: 'white' }}>Sadece Bilmediğim Kelimelerle Çalış</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                Hatalı/bilinmeyen kelimelerinizi tekrar edin ({categoryUnknownWords.length} kelime kaldı)
              </div>
            </div>
            <input
              type="checkbox"
              checked={onlyStudyWrong}
              disabled={categoryUnknownWords.length === 0}
              onChange={(e) => {
                setOnlyStudyWrong(e.target.checked);
                if (e.target.checked && categoryUnknownWords.length > 0) {
                  setWordLimit(Math.min(wordLimit, categoryUnknownWords.length));
                }
              }}
              style={{
                width: '18px',
                height: '18px',
                accentColor: '#6366f1',
                cursor: categoryUnknownWords.length === 0 ? 'not-allowed' : 'pointer'
              }}
            />
          </div>

          <button
            onClick={() => handleStartStudy(wordLimit)}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Çalışmayı Başlat 🚀
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px' }}>
      
      {/* Header and Progress Bar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '18px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SİSTEMATİK AKILLI ÇALIŞMA</span>
            <h3 style={{ fontSize: '1.38rem', fontWeight: '900', color: 'white', margin: '4px 0 0 0' }}>Kelime Öğrenim Kampı ({wordLimit} Kelime)</h3>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
            width: `${((phase - 1) * 20) + ((currentIdx + 1) / words.length * 20)}%`,
            background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* PHASE 1: LEARN WORDS */}
      {phase === 1 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 1: Modadil Akademik Kelime Kartı <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Kelimelerin anlam, eş anlam ve collocation yapılarını inceleyin.</span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>İNGİLİZCE KELİME</span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em', wordBreak: 'break-all' }}>
                {words[currentIdx].word}
              </h1>
              <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: '800' }}>
                {words[currentIdx].type}
              </span>
              
              <div style={{ margin: '14px 0', height: '1px', width: '48px', background: 'rgba(255,255,255,0.08)' }} />

              <span style={{ fontSize: '0.62rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>TÜRKÇE ANLAMI</span>
              <h2 style={{ fontSize: '1.58rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                {words[currentIdx].meaning}
              </h2>
            </div>

            {/* Modadil Synonyms & Collocations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0' }}>
              {/* Eş Anlamlılar (Synonyms) */}
              <div style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '14px 18px', borderRadius: '16px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.64rem', color: '#a5b4fc', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  🔄 EŞ ANLAMLILAR (SYNONYMS)
                </span>
                <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', margin: 0 }}>
                  {words[currentIdx].synonyms || "Yok"}
                </p>
              </div>

              {/* Birlikte Kullanılanlar (Collocations) */}
              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '14px 18px', borderRadius: '16px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.64rem', color: '#34d399', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  🔗 COLLOCATIONS / BİRLİKTE KULLANIM
                </span>
                <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', margin: 0, fontStyle: 'italic' }}>
                  {words[currentIdx].collocation || "Yok"}
                </p>
              </div>
            </div>

            {/* Academic Sentence Box */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Örnek Akademik Cümle (YÖKDİL)</span>
              <p style={{ fontSize: '0.98rem', color: 'white', lineHeight: 1.6, margin: '0 auto', fontWeight: '500', maxWidth: '500px' }}>
                {words[currentIdx].sentence}
              </p>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '8px', marginBottom: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                {words[currentIdx].translation}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Önceki Kelime
            </button>

            <button
              onClick={() => handleWordRead(currentIdx)}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Öğrendim, Sıradaki <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: MEANING SELECTION PRACTICE */}
      {phase === 2 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 2: Kelimenin Anlamını Eşleştirin <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              İngilizce kelimenin doğru Türkçe anlamını bulun.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                {words[currentIdx].word}
              </h2>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
                {meaningOptions.map((opt, i) => {
                  const isSelected = meaningSelected === opt;
                  const isCorrectAnswer = opt === words[currentIdx].meaning;
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
                        textAlign: 'center',
                        cursor: meaningChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Box */}
              {meaningChecked && (
                <div className={`glass-card animate-scale-in`} style={{
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
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Doğru Eşleşme. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru cevap: "{words[currentIdx].meaning}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!meaningChecked ? (
              <button
                onClick={handleMeaningDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleMeaningNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: SYNONYM SELECTION PRACTICE */}
      {phase === 3 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 3: Eş Anlam Eşleştirin <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              İngilizce kelimenin en yakın anlamlısını (synonym) seçeneklerden bulun.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                {words[currentIdx].word}
              </h2>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
                {synonymOptions.map((opt, i) => {
                  const isSelected = synonymSelected === opt;
                  const correctVal = words[currentIdx].synonyms ? words[currentIdx].synonyms.split(',')[0].trim() : '';
                  const isCorrectAnswer = opt === correctVal;
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
                        textAlign: 'center',
                        cursor: synonymChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Box */}
              {synonymChecked && (
                <div className={`glass-card animate-scale-in`} style={{
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
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Eş Anlam Doğru. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru eş anlamlısı: "{words[currentIdx].synonyms.split(',')[0].trim()}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!synonymChecked ? (
              <button
                onClick={handleSynonymDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleSynonymNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: CLOZE / SENTENCE FILL PRACTICE */}
      {phase === 4 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 4: Cümle Boşluk Doldurma <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Cümle içindeki boşluğa gelebilecek en uygun kelimeyi seçin.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AKADEMİK CÜMLE</span>
              
              <p style={{ fontSize: '1.18rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: '8px 0', wordBreak: 'break-word' }}>
                {words[currentIdx].sentence.replace(new RegExp(`\\b${words[currentIdx].word}\\b`, 'gi'), '________')}
              </p>

              <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', display: 'block', marginBottom: '12px' }}>
                Çevirisi: {words[currentIdx].translation}
              </span>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '500px', margin: '16px auto 0 auto' }}>
                {clozeOptions.map((opt, i) => {
                  const isSelected = clozeSelected === opt;
                  const isCorrectAnswer = opt === words[currentIdx].word;
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
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Box */}
              {clozeChecked && (
                <div className={`glass-card animate-scale-in`} style={{
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
                  gap: '8px',
                  alignSelf: 'center'
                }}>
                  {clozeCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Harika! Cümle tamamlandı. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru kelime: "{words[currentIdx].word}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!clozeChecked ? (
              <button
                onClick={handleClozeDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleClozeNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 5: STRATEGY & QUESTION PRACTICE */}
      {phase === 5 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 5: YÖKDİL Sınav Sorusu ve Çözüm Stratejisi <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Kelimelerin gerçek YÖKDİL cümlelerinde nasıl sorulduğunu görün.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.62rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>YÖKDİL SORU KALIBI</span>
              <p style={{ fontSize: '1.05rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>
                {words[currentIdx].examQuestion}
              </p>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginTop: '16px' }}>
                {words[currentIdx].examOptions.map((opt, i) => {
                  const isSelected = strategySelected === opt;
                  const isCorrectAnswer = opt === words[currentIdx].word;
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
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Toggle Modadil Strategy Tip Button */}
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
                    {words[currentIdx].strategy}
                  </div>
                )}
              </div>

              {/* Correct / Incorrect Feedback Box */}
              {strategyChecked && (
                <div className={`glass-card animate-scale-in`} style={{
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
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Doğru Seçim. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru cevap: "{words[currentIdx].word}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!strategyChecked ? (
              <button
                onClick={handleStrategyDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleStrategyNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Soru <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 6: SUMMARY / CELEBRATION */}
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
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              animation: 'scaleIn 0.5s'
            }}>
              <Trophy className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
            Tebrikler! Modadil Kelime Kampını Tamamladınız! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Seçtiğiniz akademik kelimeleri; anlam okuma, Türkçe anlam eşleştirme, eş anlam bulma, cümle boşluk doldurma ve sınav soru taktikleri aşamalarını başarıyla tamamlayarak hafızanıza kazıdınız.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Kazanılan Ödül</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block', marginTop: '4px' }}>+50 Evcil Hayvan XP</span>
            </div>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Ekstra Kristal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginTop: '4px' }}>+5 Kristal 💎</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={resetStudy}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Tekrar Çalış
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartStudySection;
