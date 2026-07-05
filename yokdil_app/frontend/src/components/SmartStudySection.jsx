import React, { useState } from 'react';
import { Check, AlertCircle, Award, ArrowRight, BookOpen, Edit3, HelpCircle, Trophy } from 'lucide-react';

const CATEGORY_WORDS = {
  fen: [
    { word: "evaluate", meaning: "değerlendirmek", type: "verb", sentence: "Scientists evaluate the laboratory results carefully.", translation: "Bilim insanları laboratuvar sonuçlarını dikkatle değerlendirir." },
    { word: "discover", meaning: "keşfetmek", type: "verb", sentence: "Astronomers discover a new habitable planet.", translation: "Gökbilimciler yaşanabilir yeni bir gezegen keşfetmez." },
    { word: "reveal", meaning: "açığa çıkarmak", type: "verb", sentence: "The research will reveal the causes of global warming.", translation: "Araştırma, küresel ısınmanın nedenlerini açığa çıkaracak." },
    { word: "significant", meaning: "önemli, kayda değer", type: "adj", sentence: "There is a significant decrease in carbon emissions.", translation: "Karbon emisyonlarında kayda değer bir düşüş var." },
    { word: "consequence", meaning: "sonuç", type: "noun", sentence: "Rising sea levels are a direct consequence of melting glaciers.", translation: "Deniz seviyelerinin yükselmesi, eriyen buzulların doğrudan bir sonucudur." },
    { word: "establish", meaning: "kurmak, saptamak", type: "verb", sentence: "They want to establish a new research institute.", translation: "Yeni bir araştırma enstitüsü kurmak istiyorlar." },
    { word: "develop", meaning: "gelişmek, geliştirmek", type: "verb", sentence: "Engineers develop efficient solar panels.", translation: "Mühendisler verimli güneş panelleri geliştirir." },
    { word: "provide", meaning: "sağlamak", type: "verb", sentence: "Forests provide oxygen and habitat for wildlife.", translation: "Ormanlar, yaban hayatı için oksijen ve yaşam alanı sağlar." },
    { word: "influence", meaning: "etkilemek", type: "verb", sentence: "Solar radiation can influence the Earth's climate.", translation: "Güneş radyasyonu Dünya'nın iklimini etkileyebilir." },
    { word: "determine", meaning: "belirlemek", type: "verb", sentence: "DNA tests determine the evolutionary origin of the species.", translation: "DNA testleri türlerin evrimsel kökenini belirler." },
    { word: "absorb", meaning: "emmek, yutmak", type: "verb", sentence: "Oceans absorb a large amount of atmospheric carbon.", translation: "Okyanuslar büyük miktarda atmosferik karbonu emer." },
    { word: "generate", meaning: "üretmek", type: "verb", sentence: "Wind turbines generate clean electricity.", translation: "Rüzgar türbinleri temiz elektrik üretir." },
    { word: "conduct", meaning: "yürütmek, yapmak", type: "verb", sentence: "The laboratory will conduct the chemistry experiment.", translation: "Laboratuvar yarın kimya deneyini yürütecek." },
    { word: "accelerate", meaning: "hızlandırmak", type: "verb", sentence: "Deforestation will accelerate the rate of soil erosion.", translation: "Ormansızlaşma, toprak erozyonu oranını hızlandıracaktır." },
    { word: "inhibit", meaning: "engellemek, yavaşlatmak", type: "verb", sentence: "Extreme cold can inhibit chemical reactions.", translation: "Aşırı soğuk, kimyasal reaksiyonları engelleyebilir." },
    { word: "convert", meaning: "dönüştürmek", type: "verb", sentence: "Plants convert solar energy into chemical energy.", translation: "Bitkiler güneş enerjisini kimyasal enerjiye dönüştürür." },
    { word: "sustain", meaning: "sürdürmek, devam ettirmek", type: "verb", sentence: "Protecting forests is essential to sustain biodiversity.", translation: "Biyoçeşitliliği sürdürmek için ormanları korumak şarttır." },
    { word: "observe", meaning: "gözlemlemek", type: "verb", sentence: "Astronomers observe distant stars through telescopes.", translation: "Gökbilimciler uzak yıldızları teleskoplarla gözlemler." },
    { word: "predict", meaning: "tahmin etmek", type: "verb", sentence: "Meteorologists predict a severe storm next week.", translation: "Meteorologlar önümüzdeki hafta şiddetli bir fırtına tahmin ediyor." },
    { word: "alter", meaning: "değiştirmek", type: "verb", sentence: "Human activities alter the natural balance of ecosystems.", translation: "İnsan faaliyetleri ekosistemlerin doğal dengesini değiştirir." }
  ],
  sosyal: [
    { word: "dissemination", meaning: "yayma, yayılma", type: "noun", sentence: "The printing press revolutionized the dissemination of knowledge.", translation: "Matbaa, bilginin yayılmasında devrim yaratmıştır." },
    { word: "migration", meaning: "göç", type: "noun", sentence: "Economic crisis caused a massive urban migration.", translation: "Ekonomik kriz kitlesel bir kentsel göçe neden oldu." },
    { word: "alleviate", meaning: "hafifletmek", type: "verb", sentence: "Microloans aim to alleviate poverty in rural areas.", translation: "Mikrokrediler kırsal alanlardaki yoksulluğu hafifletmeyi amaçlamaktadır." },
    { word: "collateral", meaning: "teminat", type: "noun", sentence: "Low-income families often lack collateral for bank loans.", translation: "Düşük gelirli aileler genellikle banka kredileri için teminattan yoksundur." },
    { word: "entrepreneur", meaning: "girişimci", type: "noun", sentence: "The young entrepreneur started a successful tech startup.", translation: "Genç girişimci başarılı bir teknoloji girişimi başlattı." },
    { word: "independent", meaning: "bağımsız", type: "adj", sentence: "Many colonies became independent after World War II.", translation: "Birçok sömürge İkinci Dünya Savaşı'ndan sonra bağımsız oldu." },
    { word: "monopoly", meaning: "tekel", type: "noun", sentence: "The government wants to break the company's monopoly.", translation: "Hükümet şirketin tekelini kırmak istiyor." },
    { word: "disruption", meaning: "bozulma, aksama", type: "noun", sentence: "The strike caused a major economic disruption.", translation: "Grev büyük bir ekonomik aksamaya neden oldu." },
    { word: "stabilize", meaning: "dengelemek, sabitlemek", type: "verb", sentence: "Central banks raise interest rates to stabilize the currency.", translation: "Merkez bankaları para birimini dengelemek için faiz oranlarını artırır." },
    { word: "acquire", meaning: "edinmek, kazanmak", type: "verb", sentence: "Children acquire language naturally through communication.", translation: "Çocuklar dili iletişim yoluyla doğal olarak edinirler." },
    { word: "reform", meaning: "reform, ıslahat", type: "noun", sentence: "The parliament approved the new educational reform.", translation: "Meclis yeni eğitim reformunu onayladı." },
    { word: "disputing", meaning: "tartışmak, anlaşmazlık", type: "verb", sentence: "They resolved the border dispute through diplomacy.", translation: "Sınır anlaşmazlığını diplomasi yoluyla çözdüler." },
    { word: "negotiation", meaning: "müzakere", type: "noun", sentence: "The two nations entered peaceful negotiations.", translation: "İki ülke barışçıl müzakerelere başladı." },
    { word: "poverty", meaning: "yoksulluk", type: "noun", sentence: "Millions of people are still living in extreme poverty.", translation: "Milyonlarca insan hala aşırı yoksulluk içinde yaşıyor." },
    { word: "heritage", meaning: "miras", type: "noun", sentence: "Historical monuments are part of our cultural heritage.", translation: "Tarihi anıtlar kültürel mirasımızın bir parçasıdır." },
    { word: "democratize", meaning: "demokratikleştirmek", type: "verb", sentence: "The internet helps democratize access to education.", translation: "İnternet, eğitime erişimi demokratikleştirmeye yardımcı olur." },
    { word: "generate", meaning: "üretmek, yaratmak", type: "verb", sentence: "Small businesses generate employment opportunities.", translation: "Küçük işletmeler istihdam fırsatları yaratır." },
    { word: "sustain", meaning: "sürdürmek", type: "verb", sentence: "They need international support to sustain economic growth.", translation: "Ekonomik büyümeyi sürdürmek için uluslararası desteğe ihtiyaçları var." },
    { word: "profound", meaning: "derin, büyük", type: "adj", sentence: "The industrial revolution had a profound impact on society.", translation: "Sanayi devriminin toplum üzerinde derin bir etkisi oldu." },
    { word: "infrastructure", meaning: "altyapı", type: "noun", sentence: "Building transport infrastructure is essential for trade.", translation: "Ticaret için ulaşım altyapısı inşa etmek elzemdir." }
  ],
  saglik: [
    { word: "regulate", meaning: "düzenlemek", type: "verb", sentence: "Insulin helps regulate glucose in the bloodstream.", translation: "İnsülin, kandaki glikozun düzenlenmesine yardımcı olur." },
    { word: "resistance", meaning: "direnç", type: "noun", sentence: "The patient developed a resistance to antibiotics.", translation: "Hasta antibiyotiklere karşı direnç geliştirdi." },
    { word: "prevent", meaning: "önlemek", type: "verb", sentence: "Regular exercise helps prevent heart disease.", translation: "Düzenli egzersiz kalp hastalığını önlemeye yardımcı olur." },
    { word: "compensate", meaning: "telafi etmek", type: "verb", sentence: "The pancreas produces extra insulin to compensate.", translation: "Pankreas telafi etmek için fazladan insülin üretir." },
    { word: "diagnose", meaning: "teşhis etmek", type: "verb", sentence: "Doctors use blood tests to diagnose the illness.", translation: "Doktorlar hastalığı teşhis etmek için kan testleri kullanır." },
    { word: "ingest", meaning: "yutmak, vücuda almak", type: "verb", sentence: "Humans ingest microplastics through contaminated food.", translation: "İnsanlar mikroplastikleri kontamine gıdalar yoluyla vücutlarına alırlar." },
    { word: "penetrate", meaning: "nüfuz etmek", type: "verb", sentence: "The virus can penetrate cellular membranes.", translation: "Virüs hücresel zarlara nüfuz edebilir." },
    { word: "trigger", meaning: "tetiklemek", type: "verb", sentence: "Allergens can trigger acute asthma attacks.", translation: "Alerjenler akut astım ataklarını tetikleyebilir." },
    { word: "disorder", meaning: "bozukluk, hastalık", type: "noun", sentence: "Insomnia is a common sleep disorder.", translation: "Uykusuzluk yaygın bir uyku bozukluğudur." },
    { word: "impair", meaning: "zarar vermek, bozmak", type: "verb", sentence: "Alcohol consumption can impair coordination and judgment.", translation: "Alkol tüketimi koordinasyonu ve muhakemeyi bozabilir." },
    { word: "symptom", meaning: "belirti", type: "noun", sentence: "A high fever is a primary symptom of infection.", translation: "Yüksek ateş, enfeksiyonun birincil belirtisidir." },
    { word: "transmit", meaning: "bulaştırmak, iletmek", type: "verb", sentence: "Mosquitoes can transmit malaria to humans.", translation: "Sivrisinekler sıtmayı insanlara bulaştırabilir." },
    { word: "absorb", meaning: "emmek", type: "verb", sentence: "The small intestine absorbs nutrients from food.", translation: "İnce bağırsak gıdalardan besinleri emer." },
    { word: "inhibit", meaning: "baskılamak, engellemek", type: "verb", sentence: "Drugs can inhibit the replication of the virus.", translation: "İlaçlar virüsün çoğalmasını baskılayabilir." },
    { word: "enhance", meaning: "geliştirmek, artırmak", type: "verb", sentence: "A healthy diet can enhance immune response.", translation: "Sağlıklı bir diyet bağışıklık tepkisini artırabilir." },
    { word: "contract", meaning: "yakalanmak, kapmak", type: "verb", sentence: "People can contract the virus through direct contact.", translation: "İnsanlar doğrudan temas yoluyla virüsü kapabilir." },
    { word: "administer", meaning: "vermek, uygulamak", type: "verb", sentence: "Nurses administer medicine to patients daily.", translation: "Hemşireler hastalara günlük olarak ilaç uygular." },
    { word: "chronic", meaning: "kronik, müzmin", type: "adj", sentence: "Arthritis is a chronic inflammatory joint disease.", translation: "Artrit kronik inflamatuar bir eklem hastalığıdır." },
    { word: "immune", meaning: "bağışıklık", type: "adj", sentence: "Vaccines stimulate the immune system to produce antibodies.", translation: "Aşılar bağışıklık sistemini antikor üretmesi için uyarır." },
    { word: "deficit", meaning: "eksiklik", type: "noun", sentence: "Iron deficit can lead to anemia and fatigue.", translation: "Demir eksikliği anemiye ve yorgunluğa yol açabilir." }
  ]
};

const SmartStudySection = ({ selectedCategory, awardPetXP, triggerConfetti }) => {
  const [wordLimit, setWordLimit] = useState(10); // default limit
  const [studyStarted, setStudyStarted] = useState(false);
  const [phase, setPhase] = useState(1); // 1: Learn, 2: Spell, 3: Fill, 4: Summary
  const [currentIdx, setCurrentIdx] = useState(0);
  const [readWords, setReadWords] = useState({});
  const [spellInput, setSpellInput] = useState('');
  const [spellChecked, setSpellChecked] = useState(false);
  const [spellCorrect, setSpellCorrect] = useState(null);
  
  const [fillSelected, setFillSelected] = useState(null);
  const [fillChecked, setFillChecked] = useState(false);
  const [fillCorrect, setFillCorrect] = useState(null);

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

  // Handler for Phase 3 (Context fill in the blank)
  const getMeaningOptions = (correctMeaning, activeWords = words) => {
    const others = activeWords.filter(w => w.meaning !== correctMeaning).map(w => w.meaning);
    const shuffled = [
      correctMeaning,
      others[0] || 'açıklamak',
      others[1] || 'önlemek',
      others[2] || 'geliştirmek'
    ].sort(() => Math.random() - 0.5);
    return shuffled;
  };

  const [meaningOptions, setMeaningOptions] = useState([]);
  const [meaningSelected, setMeaningSelected] = useState(null);
  const [meaningChecked, setMeaningChecked] = useState(false);
  const [meaningCorrect, setMeaningCorrect] = useState(null);

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
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className={`badge ${phase >= 1 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen className="h-3 w-3" /> 1. Öğren
            </span>
            <span className={`badge ${phase >= 2 ? 'badge-primary' : ''}`} style={{ fontSize: '0.68rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Edit3 className="h-3 w-3" /> 2. Anlam Testi
            </span>
          </div>
        </div>
 
        {/* Dynamic Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((phase - 1) * 50) + ((currentIdx + 1) / words.length * 50)}%`,
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
              Adım 1: Kelimeleri İnceleyin ve Tanıyın <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Kelimeleri okuyarak hafızanıza alın.</span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em' }}>İNGİLİZCE KELİME</span>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#818cf8', margin: 0, letterSpacing: '-0.02em', wordBreak: 'break-all' }}>
                {words[currentIdx].word}
              </h1>
              <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                {words[currentIdx].type}
              </span>
              
              <div style={{ margin: '12px 0', height: '1.5px', width: '32px', background: 'rgba(255,255,255,0.08)' }} />

              <span style={{ fontSize: '0.62rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TÜRKÇE ANLAMI</span>
              <h2 style={{ fontSize: '1.48rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                {words[currentIdx].meaning}
              </h2>
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Örnek Akademik Cümle (YÖKDİL)</span>
              <p style={{ fontSize: '0.98rem', color: 'white', lineHeight: 1.6, margin: '0 auto', fontWeight: '500', maxWidth: '440px' }}>
                {words[currentIdx].sentence}
              </p>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '8px', marginBottom: 0, maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto' }}>
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
              Okudum, Sıradaki <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: MEANING SELECTION PRACTICE */}
      {phase === 2 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 2: Kelimenin Anlamını Tahmin Edin <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>İngilizce kelimenin doğru Türkçe anlamını seçenekler arasından seçin.</span>
          </div>

          <div className="glass-card" style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>İngilizce Kelime</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#818cf8', margin: 0, letterSpacing: '-0.02em' }}>
                {words[currentIdx].word}
              </h2>
              <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                tür: {words[currentIdx].type}
              </span>

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

              {/* Correct / Incorrect Feedback Box */}
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
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Doğru Anlam. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru anlam: "{words[currentIdx].meaning}" olmalıydı.
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
                Sıradaki Kelime <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: SUMMARY / CELEBRATION */}
      {phase === 3 && (
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
            Tebrikler! Kelime Kampını Tamamladınız! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Seçtiğiniz akademik kelimeleri; anlam okuma ve çoktan seçmeli anlam eşleştirme aşamalarından geçerek hafızanıza kazıdınız.
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
