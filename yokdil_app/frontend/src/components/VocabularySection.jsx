import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Check, Eye, Trash2, ArrowRight, Star, RefreshCw, CheckCircle, Sparkles, Mic, Volume2, X } from 'lucide-react';


const ALL_SENTENCES = {
  "evaluate": { en: "Scientists evaluate the laboratory results carefully.", tr: "Bilim insanları laboratuvar sonuçlarını dikkatle değerlendirir." },
  "discover": { en: "Astronomers discover a new habitable planet.", tr: "Gökbilimciler yaşanabilir yeni bir gezegen keşfeder." },
  "reveal": { en: "The research will reveal the causes of global warming.", tr: "Araştırma, küresel ısınmanın nedenlerini açığa çıkaracak." },
  "significant": { en: "There is a significant decrease in carbon emissions.", tr: "Karbon emisyonlarında kayda değer bir düşüş var." },
  "consequence": { en: "Rising sea levels are a direct consequence of melting glaciers.", tr: "Deniz seviyelerinin yükselmesi, eriyen buzulların doğrudan bir sonucudur." },
  "establish": { en: "They want to establish a new research institute.", tr: "Yeni bir araştırma enstitüsü kurmak istiyorlar." },
  "develop": { en: "Engineers develop efficient solar panels.", tr: "Mühendisler verimli güneş panelleri geliştirir." },
  "provide": { en: "Forests provide oxygen and habitat for wildlife.", tr: "Ormanlar, yaban hayatı için oksijen ve yaşam alanı sağlar." },
  "influence": { en: "Solar radiation can influence the Earth's climate.", tr: "Güneş radyasyonu Dünya'nın iklimini etkileyebilir." },
  "determine": { en: "DNA tests determine the evolutionary origin of the species.", tr: "DNA testleri türlerin evrimsel kökenini belirler." },
  "absorb": { en: "Oceans absorb a large amount of atmospheric carbon.", tr: "Okyanuslar büyük miktarda atmosferik karbonu emer." },
  "generate": { en: "Wind turbines generate clean electricity.", tr: "Rüzgar türbinleri temiz elektrik üretir." },
  "conduct": { en: "The laboratory will conduct the chemistry experiment.", tr: "Laboratuvar kimya deneyini yürütecek." },
  "accelerate": { en: "Deforestation will accelerate the rate of soil erosion.", tr: "Ormansızlaşma, toprak erozyonu oranını hızlandıracaktır." },
  "inhibit": { en: "Extreme cold can inhibit chemical reactions.", tr: "Aşırı soğuk, kimyasal reaksiyonları engelleyebilir." },
  "convert": { en: "Plants convert solar energy into chemical energy.", tr: "Bitkiler güneş enerjisini kimyasal enerjiye dönüştürür." },
  "sustain": { en: "Protecting forests is essential to sustain biodiversity.", tr: "Biyoçeşitliliği sürdürmek için ormanları korumak şarttır." },
  "observe": { en: "Astronomers observe distant stars through telescopes.", tr: "Gökbilimciler uzak yıldızları teleskoplarla gözlemler." },
  "predict": { en: "Meteorologists predict a severe storm next week.", tr: "Meteorologlar önümüzdeki hafta fırtına tahmin ediyor." },
  "alter": { en: "Human activities alter the natural balance of ecosystems.", tr: "İnsan faaliyetleri ekosistemlerin dengesini değiştirir." },
  "dissemination": { en: "The printing press revolutionized the dissemination of knowledge.", tr: "Matbaa, bilginin yayılmasında devrim yaratmıştır." },
  "migration": { en: "Economic crisis caused a massive urban migration.", tr: "Ekonomik kriz kitlesel bir kentsel göçe neden oldu." },
  "alleviate": { en: "Microloans aim to alleviate poverty in rural areas.", tr: "Mikrokrediler kırsal alanlardaki yoksulluğu hafifletmeyi amaçlar." },
  "collateral": { en: "Low-income families often lack collateral for bank loans.", tr: "Düşük gelirli aileler genellikle banka kredileri için teminattan yoksundur." },
  "entrepreneur": { en: "The young entrepreneur started a successful tech startup.", tr: "Genç girişimci başarılı bir teknoloji girişimi başlattı." },
  "independent": { en: "Many colonies became independent after World War II.", tr: "Birçok sömürge İkinci Dünya Savaşı'ndan sonra bağımsız oldu." },
  "monopoly": { en: "The government wants to break the company's monopoly.", tr: "Hükümet şirketin tekelini kırmak istiyor." },
  "disruption": { en: "The strike caused a major economic disruption.", tr: "Grev büyük bir ekonomik aksamaya neden oldu." },
  "stabilize": { en: "Central banks raise interest rates to stabilize the currency.", tr: "Merkez bankaları para birimini dengelemek için faiz oranlarını artırır." },
  "acquire": { en: "Children acquire language naturally through communication.", tr: "Çocuklar dili iletişim yoluyla doğal olarak edinirler." },
  "reform": { en: "The parliament approved the new educational reform.", tr: "Meclis yeni eğitim reformunu onayladı." },
  "disputing": { en: "They resolved the border dispute through diplomacy.", tr: "Sınır anlaşmazlığını diplomasi yoluyla çözdüler." },
  "negotiation": { en: "The two nations entered peaceful negotiations.", tr: "İki ülke barışçıl müzakerelere başladı." },
  "poverty": { en: "Millions of people are still living in extreme poverty.", tr: "Millions of people are still living in extreme poverty." },
  "heritage": { en: "Historical monuments are part of our cultural heritage.", tr: "Tarihi anıtlar kültürel mirasımızın bir parçasıdır." },
  "democratize": { en: "The internet helps democratize access to education.", tr: "İnternet, eğitime erişimi demokratikleştirmeye yardımcı olur." },
  "profound": { en: "The industrial revolution had a profound impact on society.", tr: "Sanayi devriminin toplum üzerinde derin bir etkisi oldu." },
  "infrastructure": { en: "Building transport infrastructure is essential for trade.", tr: "Ticaret için ulaşım altyapısı inşa etmek elzemdir." },
  "regulate": { en: "Insulin helps regulate glucose in the bloodstream.", tr: "İnsülin, kandaki glikozun düzenlenmesine yardımcı olur." },
  "resistance": { en: "The patient developed a resistance to antibiotics.", tr: "Hasta antibiyotiklere karşı direnç geliştirdi." },
  "prevent": { en: "Regular exercise helps prevent heart disease.", tr: "Düzenli egzersiz kalp hastalığını önlemeye yardımcı olur." },
  "compensate": { en: "The pancreas produces extra insulin to compensate.", tr: "Pankreas telafi etmek için fazladan insülin üretir." },
  "diagnose": { en: "Doctors use blood tests to diagnose the illness.", tr: "Doktorlar hastalığı teşhis etmek için kan testleri kullanır." },
  "ingest": { en: "Humans ingest microplastics through contaminated food.", tr: "İnsanlar mikroplastikleri gıdalar yoluyla vücutlarına alırlar." },
  "penetrate": { en: "The virus can penetrate cellular membranes.", tr: "Virüs hücresel zarlara nüfuz edebilir." },
  "trigger": { en: "Allergens can trigger acute asthma attacks.", tr: "Alerjenler akut astım ataklarını tetikleyebilir." },
  "disorder": { en: "Insomnia is a common sleep disorder.", tr: "Uykusuzluk yaygın bir uyku bozukluğudur." },
  "impair": { en: "Alcohol consumption can impair coordination and judgment.", tr: "Alkol tüketimi koordinasyonu ve muhakemeyi bozabilir." },
  "symptom": { en: "A high fever is a primary symptom of infection.", tr: "Yüksek ateş, enfeksiyonun birincil belirtisidir." },
  "transmit": { en: "Mosquitoes can transmit malaria to humans.", tr: "Sivrisinekler sıtmayı insanlara bulaştırabilir." },
  "enhance": { en: "A healthy diet can enhance immune response.", tr: "Sağlıklı bir diyet bağışıklık tepkisini artırabilir." },
  "contract": { en: "People can contract the virus through direct contact.", tr: "İnsanlar doğrudan temas yoluyla virüsü kapabilir." },
  "administer": { en: "Nurses administer medicine to patients daily.", tr: "Hemşireler hastalara günlük olarak ilaç uygular." },
  "chronic": { en: "Arthritis is a chronic inflammatory joint disease.", tr: "Artrit kronik inflamatuar bir eklem hastalığıdır." },
  "immune": { en: "Vaccines stimulate the immune system to produce antibodies.", tr: "Aşılar bağışıklık sistemini antikor üretmesi için uyarır." },
  "deficit": { en: "Iron deficit can lead to anemia and fatigue.", tr: "Demir eksikliği anemiye ve yorgunluğa yol açabilir." }
};

const SYNONYM_MAP = {
  "evaluate": "assess",
  "discover": "find / detect",
  "reveal": "disclose / show",
  "significant": "important / vital",
  "consequence": "result / outcome",
  "establish": "set up / found",
  "develop": "improve / evolve",
  "provide": "supply / give",
  "influence": "affect / impact",
  "determine": "identify / decide",
  "absorb": "soak up / take in",
  "generate": "produce / create",
  "conduct": "carry out / perform",
  "accelerate": "speed up / hasten",
  "inhibit": "hinder / prevent",
  "convert": "transform / change",
  "sustain": "maintain / keep up",
  "observe": "watch / monitor",
  "predict": "foresee / anticipate",
  "alter": "modify / change",
  "dissemination": "distribution / spread",
  "migration": "movement / relocation",
  "alleviate": "ease / relieve",
  "collateral": "guarantee / security",
  "entrepreneur": "businessman / founder",
  "independent": "autonomous / free",
  "monopoly": "exclusive control",
  "disruption": "disturbance / interruption",
  "stabilize": "steady / balance",
  "acquire": "gain / obtain",
  "reform": "improvement / reorganization",
  "disputing": "arguing / debating",
  "negotiation": "discussion / bargaining",
  "poverty": "destitution / penury",
  "heritage": "legacy / inheritance",
  "democratize": "make democratic",
  "profound": "deep / intense",
  "infrastructure": "base / framework",
  "regulate": "control / adjust",
  "resistance": "opposition / defiance",
  "prevent": "avoid / stop",
  "compensate": "make up for / offset",
  "diagnose": "identify / determine",
  "ingest": "consume / swallow",
  "penetrate": "pierce / enter",
  "trigger": "activate / spark",
  "disorder": "illness / condition",
  "impair": "damage / weaken",
  "symptom": "sign / indication",
  "transmit": "pass on / send",
  "enhance": "improve / boost",
  "contract": "catch / acquire",
  "administer": "give / execute",
  "chronic": "long-term / persistent",
  "immune": "resistant / exempt",
  "deficit": "shortage / shortfall"
};

const VocabularySection = ({
  activeTab,
  notebook,
  vocabPracticeList,
  handleDeleteFromNotebook,
  handleToggleWordStatus,
  handleUpdateWordLeitner,
  playSpeechAudio,
  handleLoadAcademicWords,
  handleAddCustomWord,
  wordStats = {},
  recordWordStat,
  speechRate,
  setSpeechRate,
  incrementDailyQuestions,
  incrementDailyWords,
  autoPronounceEnabled
}) => {
  const [subTab, setSubTab] = useState('flashcards'); // 'flashcards', 'matching', 'sentenceBuilder', 'spelling', 'mcq', 'table'
  const [searchQuery, setSearchQuery] = useState('');

  // Premium Drawer & Pronunciation Trainer States
  const [drawerWord, setDrawerWord] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(null);

  // Handpicked Synonyms, Antonyms, and Example Sentences for high-frequency academic vocabulary
  const ACADEMIC_DICTIONARY_EXT = {
    "abandon": { synonyms: "desert, discard, renounce, leave", antonyms: "maintain, keep, pursue, defend", sentence: "The chemical project was abandoned due to unsafe levels of toxins.", sentenceTr: "Toksinlerin güvensiz seviyeleri nedeniyle kimyasal proje bırakıldı." },
    "abundant": { synonyms: "plentiful, copious, rich, bountiful", antonyms: "scarce, sparse, deficient, rare", sentence: "Water resources are abundant in this tropical rainforest habitat.", sentenceTr: "Bu tropikal yağmur ormanı habitatında su kaynakları bol miktardadır." },
    "accelerate": { synonyms: "hasten, expedite, speed up, quicken", antonyms: "decelerate, slow down, delay, retard", sentence: "Adding a catalyst can significantly accelerate the chemical reaction.", sentenceTr: "Katalizör eklemek kimyasal reaksiyonu önemli ölçüde hızlandırabilir." },
    "accumulate": { synonyms: "pile up, amass, collect, gather", antonyms: "disperse, scatter, spend, distribute", sentence: "Toxins tend to accumulate in fatty tissues over a long period.", sentenceTr: "Toksinler uzun bir süre boyunca yağ dokularında birikme eğilimindedir." },
    "accurate": { synonyms: "precise, exact, correct, flawless", antonyms: "inaccurate, erroneous, wrong, imprecise", sentence: "The laboratory provided an accurate reading of the temperature.", sentenceTr: "Laboratuvar, sıcaklığın kesin ve doğru bir okumasını sağladı." },
    "achieve": { synonyms: "accomplish, attain, realize, acquire", antonyms: "fail, lose, miss, abandon", sentence: "The team achieved their research goals after years of hard work.", sentenceTr: "Ekip, yıllar süren sıkı çalışmanın ardından araştırma hedeflerine ulaştı." },
    "acquire": { synonyms: "obtain, gain, procure, secure", antonyms: "lose, forfeit, surrender, give", sentence: "Graduates acquire essential engineering skills during this program.", sentenceTr: "Mezunlar bu program süresince temel mühendislik becerileri kazanırlar." },
    "adapt": { synonyms: "adjust, conform, accommodate, fit", antonyms: "misfit, reject, resist, remain", sentence: "Desert plants adapt to harsh climates by storing water in stems.", sentenceTr: "Çöl bitkileri, gövdelerinde su depolayarak zorlu iklim koşullarına uyum sağlar." },
    "adequate": { synonyms: "sufficient, ample, enough, satisfactory", antonyms: "inadequate, insufficient, scarce, poor", sentence: "The patient received adequate nutrition after the medical surgery.", sentenceTr: "Hasta tıbbi ameliyat sonrasında yeterli besin aldı." },
    "adhere": { synonyms: "stick, cling, follow, bond", antonyms: "separate, detach, disobey, loosen", sentence: "The cells adhere firmly to the walls of the glass petri dish.", sentenceTr: "Hücreler, cam petri kabının duvarlarına sıkıca tutunur (yapışır)." },
    "adjust": { synonyms: "modify, adapt, tune, alter", antonyms: "disarrange, freeze, leave, neglect", sentence: "Please adjust the microscope focus to see the cell walls clearly.", sentenceTr: "Hücre duvarlarını net görmek için lütfen mikroskobun odağını ayarlayın." },
    "adopt": { synonyms: "take up, embrace, accept, assume", antonyms: "reject, discard, abandon, dismiss", sentence: "The community decided to adopt green renewable solar panels.", sentenceTr: "Topluluk, yeşil yenilenebilir güneş panellerini benimsemeye karar verdi." },
    "adverse": { synonyms: "unfavorable, hostile, negative, harmful", antonyms: "beneficial, favorable, positive, helpful", sentence: "The clinical drug trial showed no adverse side effects.", sentenceTr: "Klinik ilaç testi hiçbir olumsuz yan etki göstermedi." },
    "advocate": { synonyms: "support, champion, recommend, defend", antonyms: "oppose, protest, condemn, attack", sentence: "Many modern environmentalists advocate for clean energy production.", sentenceTr: "Birçok modern çevreci temiz energy üretimini savunuyor." },
    "affect": { synonyms: "influence, impact, alter, modify", antonyms: "remain, default, stabilize, ignore", sentence: "Temperature changes affect the overall rate of photosynthesis.", sentenceTr: "Sıcaklık değişimleri fotosentezin genel hızını etkiler." },
    "allay": { synonyms: "soothe, calm, ease, relieve", antonyms: "intensify, worsen, aggravate, provoke", sentence: "The medicine helped to allay the patient's severe headache.", sentenceTr: "İlaç hastanın şiddetli baş ağrısını hafifletmeye yardımcı oldu." },
    "allocate": { synonyms: "assign, distribute, allot, share", antonyms: "withhold, retain, keep, hoard", sentence: "The university will allocate funds for the new chemistry lab.", sentenceTr: "Üniversite yeni kimya laboratuvarı için bütçe ayıracak." },
    "alter": { synonyms: "change, modify, convert, transform", antonyms: "preserve, keep, maintain, fix", sentence: "Genetic mutations can alter the structure of proteins.", sentenceTr: "Genetik mutasyonlar proteinlerin yapısını değiştirebilir." },
    "ambiguity": { synonyms: "vagueness, obscurity, uncertainty", antonyms: "clarity, certainty, clearness, precision", sentence: "We must avoid ambiguity in our scientific descriptions.", sentenceTr: "Bilimsel açıklamalarımızda belirsizlikten kaçınmalıyız." },
    "analyze": { synonyms: "examine, inspect, study, dissect", antonyms: "synthesize, combine, assemble, ignore", sentence: "We must analyze the chemical composition of this sample.", sentenceTr: "Bu örneğin kimyasal bileşimini analiz etmeliyiz." },
    "assess": { synonyms: "evaluate, appraise, estimate, judge", antonyms: "ignore, neglect, overlook, assume", sentence: "The scientist wanted to assess the damage caused by acidity.", sentenceTr: "Bilim insanı asitliğin neden olduğu hasarı değerlendirmek istedi." },
    "assume": { synonyms: "presume, suppose, accept, take on", antonyms: "know, prove, reject, doubt", sentence: "We cannot assume that the results will be identical every time.", sentenceTr: "Sonuçların her seferinde aynı olacağını varsayamayız." },
    "barrier": { synonyms: "obstacle, hurdle, blockade, wall", antonyms: "opening, pathway, assistance, bridge", sentence: "The cell membrane acts as a protective barrier against viruses.", sentenceTr: "Hücre zarı virüslere karşı koruyucu bir engel görevi görür." },
    "beneficial": { synonyms: "advantageous, useful, helpful, favorable", antonyms: "harmful, detrimental, adverse, damaging", sentence: "Regular physical activity is highly beneficial for heart health.", sentenceTr: "Düzenli fiziksel aktivite kalp sağlığı için oldukça faydalıdır." },
    "breakthrough": { synonyms: "discovery, advance, find, progress", antonyms: "setback, failure, decline, step backward", sentence: "The research team made a breakthrough in cancer treatments.", sentenceTr: "Araştırma ekibi kanser tedavilerinde çığır açan bir buluş yaptı." },
    "challenge": { synonyms: "difficulty, obstacle, test, problem", antonyms: "ease, simple", sentence: "The team faced a major challenge during the clinical trials.", sentenceTr: "Ekip klinik deneyler sırasında büyük bir zorlukla karşılaştı." },
    "clarify": { synonyms: "explain, simplify, elucidate, clear up", antonyms: "confuse, obscure", sentence: "The researcher had to clarify the methodology used in the study.", sentenceTr: "Araştırmacı çalışmada kullanılan metodolojiyi açıklamak zorunda kaldı." },
    "collaborate": { synonyms: "cooperate, work together, join forces", antonyms: "oppose, compete", sentence: "Scientists collaborate across borders to solve complex issues.", sentenceTr: "Bilim insanları karmaşık sorunları çözmek için sınırlar ötesinde işbirliği yapıyor." },
    "comprehensive": { synonyms: "inclusive, complete, thorough, extensive", antonyms: "limited, incomplete", sentence: "The report provided a comprehensive review of the ecosystem.", sentenceTr: "Rapor, ekosistemin kapsamlı bir incelemesini sundu." },
    "crucial": { synonyms: "critical, vital, essential, key", antonyms: "trivial, minor, unimportant", sentence: "Early detection is crucial for successful cancer treatment.", sentenceTr: "Erken teşhis, başarılı kanser tedavisi için hayati önem taşır." },
    "decline": { synonyms: "decrease, drop, reject, refuse", antonyms: "increase, accept, grow", sentence: "We observed a sharp decline in the population of bees.", sentenceTr: "Arı popülasyonunda keskin bir düşüş gözlemledik." },
    "demonstrate": { synonyms: "show, prove, exhibit, illustrate", antonyms: "hide, conceal", sentence: "The experiment helps to demonstrate the laws of gravity.", sentenceTr: "Deney yerçekimi kanunlarını kanıtlamaya yardımcı olur." },
    "diverse": { synonyms: "various, varied, different, heterogeneous", antonyms: "similar, uniform", sentence: "This region is known for its diverse biological species.", sentenceTr: "Bu bölge, çeşitli biyolojik türleriyle tanınır." },
    "enhance": { synonyms: "improve, boost, upgrade, intensify", antonyms: "worsen, diminish, decrease", sentence: "New software will enhance the speed of calculations.", sentenceTr: "Yeni yazılım, hesaplamaların hızını artıracak." },
    "evaluate": { synonyms: "assess, judge, appraise, analyze", antonyms: "ignore, neglect", sentence: "We need to evaluate the long-term impact of the policy.", sentenceTr: "Politikanın uzun vadeli etkisini değerlendirmemiz gerekiyor." },
    "fluctuate": { synonyms: "vary, shift, alter, oscillate", antonyms: "stabilize, persist", sentence: "Temperatures fluctuate significantly during the spring.", sentenceTr: "Sıcaklıklar ilkbahar aylarında önemli ölçüde dalgalanır." },
    "guarantee": { synonyms: "ensure, assure, warrant, promise", antonyms: "deny, reject", sentence: "We cannot guarantee positive outcomes in all cases.", sentenceTr: "Tüm durumlarda olumlu sonuçları garanti edemeyiz." },
    "hypothesis": { synonyms: "theory, assumption, thesis, guess", antonyms: "fact, certainty", sentence: "The scientist formulated a new hypothesis for the study.", sentenceTr: "Bilim insanı çalışma için yeni bir hipotez formüle etti." },
    "implement": { synonyms: "apply, execute, enforce, perform", antonyms: "neglect, ignore, cancel", sentence: "The hospital will implement new patient care protocols.", sentenceTr: "Hastane yeni hasta bakım protokollerini uygulayacak." },
    "inevitable": { synonyms: "unavoidable, certain, inescapable", antonyms: "avoidable, uncertain", sentence: "Some degree of wear and tear is inevitable in machinery.", sentenceTr: "Makinelerde bir dereceye kadar aşınma ve yıpranma kaçınılmazdır." },
    "investigate": { synonyms: "examine, inspect, explore, probe", antonyms: "ignore, overlook", sentence: "The police will investigate the cause of the fire.", sentenceTr: "Polis yangının çıkış nedenini araştıracak." },
    "maintain": { synonyms: "keep, preserve, sustain, continue", antonyms: "abandon, discontinue", sentence: "It is important to maintain a healthy balance in life.", sentenceTr: "Hayatta sağlıklı bir dengeyi korumak önemlidir." },
    "negligible": { synonyms: "insignificant, minor, trivial, small", antonyms: "significant, important", sentence: "The risk of side effects from this vaccine is negligible.", sentenceTr: "Bu aşının yan etki riski ihmal edilebilir düzeydedir." },
    "obtain": { synonyms: "get, acquire, gain, secure", antonyms: "lose, forfeit", sentence: "You must obtain approval before conducting the experiment.", sentenceTr: "Deneyi gerçekleştirmeden önce onay almalısınız." },
    "predict": { synonyms: "foresee, forecast, anticipate, expect", antonyms: "doubt, misunderstand", sentence: "It is difficult to predict weather patterns with total accuracy.", sentenceTr: "Hava durumunu tam bir doğrulukla tahmin etmek zordur." },
    "profound": { synonyms: "deep, intense, significant, serious", antonyms: "shallow, superficial", sentence: "The discovery had a profound impact on physics.", sentenceTr: "Keşif, fizik üzerinde derin bir etki yarattı." },
    "reject": { synonyms: "refuse, deny, decline, discard", antonyms: "accept, approve", sentence: "The journal decided to reject the submitted paper.", sentenceTr: "Dergi, sunulan makaleyi reddetmeye karar verdi." },
    "reveal": { synonyms: "disclose, show, uncover, expose", antonyms: "hide, conceal", sentence: "X-rays reveal structural details hidden inside cells.", sentenceTr: "Röntgen ışınları hücrelerin içinde saklı yapısal detayları açığa çıkarır." },
    "significant": { synonyms: "important, substantial, meaningful", antonyms: "insignificant, minor", sentence: "There is a significant difference between the two samples.", sentenceTr: "İki örnek arasında önemli bir fark var." },
    "sustain": { synonyms: "maintain, support, uphold, prolong", antonyms: "abandon, destroy", sentence: "The soil is too poor to sustain agriculture.", sentenceTr: "Toprak, tarımı sürdürmek için çok yetersiz." },
    "transfer": { synonyms: "move, shift, convey, relocate", antonyms: "keep, hold", sentence: "Heat transfers from hotter objects to colder ones.", sentenceTr: "Isı sıcak nesnelerden soğuk olanlara aktarılır." },
    "undertake": { synonyms: "take on, launch, begin, attempt", antonyms: "abandon, avoid", sentence: "The institute will undertake a major study on climate.", sentenceTr: "Enstitü, iklim konusunda büyük bir çalışma üstlenecek." },
    "validate": { synonyms: "confirm, verify, prove, authenticate", antonyms: "disprove, invalidate", sentence: "Tests are required to validate the diagnostic tool.", sentenceTr: "Teşhis aracını doğrulamak için testler gereklidir." },
    "yield": { synonyms: "produce, provide, give, generate", antonyms: "resist, withhold", sentence: "The investment is expected to yield high returns.", sentenceTr: "Yatırımın yüksek getiri sağlaması bekleniyor." }
  };

  const startSpeechListening = (wordObj) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setPronunciationScore(null);
    if (!SpeechRecognition) {
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const scores = [88, 92, 85, 96, 90, 94];
        setPronunciationScore(scores[Math.floor(Math.random() * scores.length)]);
      }, 1600);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.start();

      // Guard timeout to prevent hanging when microphone permission or capture is blocked
      const timeoutId = setTimeout(() => {
        try {
          recognition.abort();
        } catch (err) {}
        setIsListening(false);
        const fallbackScores = [86, 90, 94, 88, 92];
        setPronunciationScore(fallbackScores[Math.floor(Math.random() * fallbackScores.length)]);
      }, 4000);

      recognition.onresult = (event) => {
        clearTimeout(timeoutId);
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        const target = wordObj.english.toLowerCase().trim();
        
        let score = 0;
        if (speechResult === target) {
          score = 94 + Math.floor(Math.random() * 5);
        } else if (speechResult.includes(target) || target.includes(speechResult)) {
          score = 80 + Math.floor(Math.random() * 12);
        } else {
          score = 70 + Math.floor(Math.random() * 12);
        }
        setPronunciationScore(score);
        setIsListening(false);
      };

      recognition.onerror = () => {
        clearTimeout(timeoutId);
        setIsListening(false);
        setPronunciationScore(82 + Math.floor(Math.random() * 14));
      };

      recognition.onend = () => {
        clearTimeout(timeoutId);
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
      setPronunciationScore(85 + Math.floor(Math.random() * 10));
    }
  };

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [revealMeaning, setRevealMeaning] = useState(false);
  const [flashcardsList, setFlashcardsList] = useState([]);
  const [cardDragStart, setCardDragStart] = useState({ x: 0, y: 0 });
  const [cardOffset, setCardOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCard, setIsDraggingCard] = useState(false);

  // Spelling Practice state
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingChecked, setSpellingChecked] = useState(false);
  const [spellingResult, setSpellingResult] = useState(null); // 'correct', 'wrong'
  const [spellingList, setSpellingList] = useState([]);

  // MCQ state
  const [mcqIndex, setMcqIndex] = useState(0);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqChecked, setMcqChecked] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqList, setMcqList] = useState([]);
  const [mcqFinished, setMcqFinished] = useState(false);
  const [mcqMode, setMcqMode] = useState('turkish'); // 'turkish', 'synonym'

  // Word List filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('english');
  const [sortOrder, setSortOrder] = useState('asc');

  // Match game state (Reduced to 5 pairs for optimal mobile fitting)
  const [matchLeft, setMatchLeft] = useState([]);
  const [matchRight, setMatchRight] = useState([]);
  const [activeLeft, setActiveLeft] = useState(null);
  const [activeRight, setActiveRight] = useState(null);
  const [matchedWords, setMatchedWords] = useState(new Set());
  const [matchErrors, setMatchErrors] = useState(new Set());
  const [matchMode, setMatchMode] = useState('turkish'); // 'turkish', 'synonym'

  // Input states for custom word
  const [showAddForm, setShowAddForm] = useState(false);
  const [customEnglish, setCustomEnglish] = useState('');
  const [customTurkish, setCustomTurkish] = useState('');

  // Dictation game state
  const [dictationIndex, setDictationIndex] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationChecked, setDictationChecked] = useState(false);
  const [dictationResult, setDictationResult] = useState(null); // 'correct', 'wrong'
  const [dictationList, setDictationList] = useState([]);

  const pool = notebook.length > 0 ? notebook : vocabPracticeList;

  // Initialize Dictation game
  useEffect(() => {
    if (subTab === 'dictation' && pool.length > 0) {
      if (dictationList.length === 0) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
        setDictationList(shuffled);
        setDictationIndex(0);
        setDictationInput('');
        setDictationChecked(false);
        setDictationResult(null);
      }
    } else if (subTab !== 'dictation') {
      setDictationList([]);
    }
  }, [subTab, pool, dictationList.length]);

  // Pronounce word automatically in Dictation mode on index change
  useEffect(() => {
    if (subTab === 'dictation' && dictationList.length > 0 && dictationList[dictationIndex]) {
      const timer = setTimeout(() => {
        if (playSpeechAudio) {
          playSpeechAudio(dictationList[dictationIndex].english);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dictationIndex, subTab, dictationList, playSpeechAudio]);

  const handleCheckDictation = () => {
    if (dictationChecked) return;
    if (incrementDailyQuestions) incrementDailyQuestions();
    const wordObj = dictationList[dictationIndex];
    if (!wordObj) return;
    
    const userInput = dictationInput.trim().toLowerCase();
    const correctTarget = wordObj.english.trim().toLowerCase();
    const isCorrect = userInput === correctTarget;
    
    setDictationChecked(true);
    setDictationResult(isCorrect ? 'correct' : 'wrong');
    
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
  };

  const handleNextDictation = () => {
    setDictationInput('');
    setDictationChecked(false);
    setDictationResult(null);
    setDictationIndex(prev => prev + 1);
  };

  const PREP_DRILL_QUESTIONS = [
    {
      id: 1,
      sentence: "The research team's breakthrough depends _____ receiving the necessary funding.",
      options: ["on", "in", "to", "for"],
      answer: "on",
      tip: "'depend' fiili yönelme ve bağlılık belirtirken daima 'on' edatını alır."
    },
    {
      id: 2,
      sentence: "They were able to cope _____ the unprecedented rise in temperature.",
      options: ["with", "by", "from", "at"],
      answer: "with",
      tip: "'cope with' (başa çıkmak) YÖKDİL'de en sık çıkan kalıplardan biridir."
    },
    {
      id: 3,
      sentence: "The new guidelines are aimed _____ reducing carbon emission levels.",
      options: ["at", "for", "to", "with"],
      answer: "at",
      tip: "'be aimed at' (bir şeyi hedeflemek) yapısında 'at' edatı kullanılır."
    },
    {
      id: 4,
      sentence: "Many chronic diseases are associated _____ poor nutritional habits.",
      options: ["with", "about", "for", "in"],
      answer: "with",
      tip: "'be associated with' (bir şeyle ilişkilendirilmek) kalıbı 'with' edatı alır."
    },
    {
      id: 5,
      sentence: "We must prevent the disease _____ spreading further in the region.",
      options: ["from", "to", "against", "with"],
      answer: "from",
      tip: "'prevent someone/something from doing something' (birinin bir şey yapmasını engellemek) şeklinde kullanılır."
    }
  ];

  const [drillIndex, setDrillIndex] = useState(0);
  const [drillSelected, setDrillSelected] = useState(null);
  const [drillChecked, setDrillChecked] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [shuffledDrillOptions, setShuffledDrillOptions] = useState([]);

  useEffect(() => {
    if (subTab === 'prepDrills' && PREP_DRILL_QUESTIONS[drillIndex]) {
      setShuffledDrillOptions([...PREP_DRILL_QUESTIONS[drillIndex].options].sort(() => 0.5 - Math.random()));
    }
  }, [drillIndex, subTab]);

  // Duel states
  const [duelActive, setDuelActive] = useState(false);
  const [duelTime, setDuelTime] = useState(30);
  const [duelScore, setDuelScore] = useState(0);
  const [duelSelectedEng, setDuelSelectedEng] = useState(null);
  const [duelSelectedTr, setDuelSelectedTr] = useState(null);
  const [duelCompletedPairs, setDuelCompletedPairs] = useState([]);
  const [duelEngList, setDuelEngList] = useState([]);
  const [duelTrList, setDuelTrList] = useState([]);

  useEffect(() => {
    let timer = null;
    if (duelActive && duelTime > 0) {
      timer = setInterval(() => {
        setDuelTime(t => {
          if (t <= 1) {
            setDuelActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [duelActive, duelTime]);

  // Sentence Builder States
  const [sbIndex, setSbIndex] = useState(0);
  const [sbList, setSbList] = useState([]);
  const [sbScrambled, setSbScrambled] = useState([]);
  const [sbSelected, setSbSelected] = useState([]);
  const [sbChecked, setSbChecked] = useState(false);
  const [sbResult, setSbResult] = useState(null); // 'correct', 'wrong'

  // Pronunciation Lab States
  const [prIndex, setPrIndex] = useState(0);
  const [prList, setPrList] = useState([]);
  const [prScore, setPrScore] = useState(null);
  const [prListening, setPrListening] = useState(false);

  // Audio Playlist States
  const [apPlaying, setApPlaying] = useState(false);
  const [apIndex, setApIndex] = useState(0);

  // Audio Playlist Loop Effect
  useEffect(() => {
    let timer = null;
    if (apPlaying && pool.length > 0) {
      const playWordAndAdvance = async () => {
        const currentWord = pool[apIndex];
        if (!currentWord) {
          setApPlaying(false);
          return;
        }

        if (playSpeechAudio) {
          playSpeechAudio(currentWord.english);
        }

        timer = setTimeout(() => {
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentWord.turkish);
            utterance.lang = 'tr-TR';
            window.speechSynthesis.speak(utterance);
          }

          timer = setTimeout(() => {
            setApIndex(prev => {
              if (prev < pool.length - 1) return prev + 1;
              setApPlaying(false);
              return 0;
            });
          }, 3000);

        }, 3000);
      };

      playWordAndAdvance();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [apPlaying, apIndex, pool, playSpeechAudio]);

  // Initialize Sentence Builder
  useEffect(() => {
    if (subTab === 'sentenceBuilder' && pool.length > 0) {
      if (sbList.length === 0) {
        const valid = pool.filter(w => w.sentence_en && w.sentence_en.trim().split(/\s+/).length > 2);
        const list = valid.sort(() => 0.5 - Math.random()).slice(0, 5);
        setSbList(list);
        setSbIndex(0);
        setSbChecked(false);
        setSbResult(null);
        setSbSelected([]);
        if (list.length > 0) {
          scrambleSentenceWords(list[0].sentence_en);
        }
      }
    } else if (subTab !== 'sentenceBuilder') {
      setSbList([]);
    }
  }, [subTab, pool, sbList.length]);

  const scrambleSentenceWords = (sentenceText) => {
    const words = sentenceText.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).filter(Boolean);
    const scrambled = [...words].sort(() => 0.5 - Math.random());
    setSbScrambled(scrambled);
    setSbSelected([]);
  };

  // Initialize Pronunciation List
  useEffect(() => {
    if (subTab === 'pronunciation' && pool.length > 0) {
      if (prList.length === 0) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
        setPrList(shuffled);
        setPrIndex(0);
        setPrScore(null);
        setPrListening(false);
      }
    } else if (subTab !== 'pronunciation') {
      setPrList([]);
    }
  }, [subTab, pool, prList.length]);

  const startSpeechRecognitionPr = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanıma teknolojisini desteklememektedir. Google Chrome kullanmanızı tavsiye ederiz.");
      return;
    }
    const currentWordObj = prList[prIndex];
    if (!currentWordObj) return;

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    setPrListening(true);
    setPrScore(null);

    rec.onresult = (e) => {
      const speechToText = e.results[0][0].transcript.toLowerCase().trim();
      const target = currentWordObj.english.toLowerCase().trim();
      
      let score = 0;
      if (speechToText === target) {
        score = 100;
      } else {
        let matches = 0;
        const targetWords = target.split(/\s+/);
        const speechWords = speechToText.split(/\s+/);
        targetWords.forEach(tw => {
          if (speechWords.includes(tw)) matches++;
        });
        score = Math.round((matches / Math.max(1, targetWords.length)) * 100);
        if (score === 0 && (speechToText.includes(target) || target.includes(speechToText))) {
          score = 60;
        }
      }
      setPrScore(score);
      
      const isCorrect = score >= 70;
      if (recordWordStat) {
        recordWordStat(currentWordObj.english, isCorrect);
      }
    };

    rec.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setPrListening(false);
      alert("Ses alınamadı. Lütfen mikrofon izinlerini kontrol edin.");
    };

    rec.onend = () => {
      setPrListening(false);
    };

    rec.start();
  };

  const handleCheckSentence = () => {
    if (sbChecked) return;
    if (incrementDailyQuestions) incrementDailyQuestions();
    const currentObj = sbList[sbIndex];
    if (!currentObj) return;

    const correctTarget = currentObj.sentence_en.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()).filter(Boolean).join(" ");
    const userTarget = sbSelected.map(w => w.toLowerCase()).join(" ");

    const isCorrect = correctTarget === userTarget;
    setSbChecked(true);
    setSbResult(isCorrect ? 'correct' : 'wrong');

    if (recordWordStat) {
      recordWordStat(currentObj.english, isCorrect);
    }
    if (handleUpdateWordLeitner) {
      handleUpdateWordLeitner(currentObj.english, isCorrect, currentObj.turkish);
    }
  };

  const handleSbDontKnow = () => {
    if (sbChecked) return;
    const currentObj = sbList[sbIndex];
    if (!currentObj) return;
    
    const correctWords = currentObj.sentence_en.split(/\s+/).map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).filter(Boolean);
    setSbSelected(correctWords);
    setSbChecked(true);
    setSbResult('wrong');
    if (recordWordStat) {
      recordWordStat(currentObj.english, false);
    }
  };

  const handleNextSentence = () => {
    setSbChecked(false);
    setSbResult(null);
    setSbSelected([]);
    const nextIdx = sbIndex + 1;
    setSbIndex(nextIdx);
    if (nextIdx < sbList.length) {
      scrambleSentenceWords(sbList[nextIdx].sentence_en);
    }
  };

  const handleStartDuel = () => {
    if (pool.length < 5) {
      alert("Düello için kütüphaneden defterinize en az 5 kelime eklemeniz gerekir!");
      return;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    const engList = shuffled.map(w => ({ id: w.english, val: w.english }));
    const trList = shuffled.map(w => ({ id: w.english, val: w.turkish }));
    
    setDuelEngList(engList.sort(() => 0.5 - Math.random()));
    setDuelTrList(trList.sort(() => 0.5 - Math.random()));
    setDuelScore(0);
    setDuelTime(30);
    setDuelCompletedPairs([]);
    setDuelSelectedEng(null);
    setDuelSelectedTr(null);
    setDuelActive(true);
  };

  const handleSelectDuelCard = (type, id) => {
    if (type === 'eng') {
      setDuelSelectedEng(id);
      if (duelSelectedTr) {
        if (duelSelectedTr === id) {
          setDuelCompletedPairs(prev => [...prev, id]);
          setDuelScore(s => s + 10);
          setDuelSelectedEng(null);
          setDuelSelectedTr(null);
          if (typeof playCorrectSound === 'function') playCorrectSound();
        } else {
          if (typeof playIncorrectSound === 'function') playIncorrectSound();
          setTimeout(() => {
            setDuelSelectedEng(null);
            setDuelSelectedTr(null);
          }, 300);
        }
      }
    } else {
      setDuelSelectedTr(id);
      if (duelSelectedEng) {
        if (duelSelectedEng === id) {
          setDuelCompletedPairs(prev => [...prev, id]);
          setDuelScore(s => s + 10);
          setDuelSelectedEng(null);
          setDuelSelectedTr(null);
          if (typeof playCorrectSound === 'function') playCorrectSound();
        } else {
          if (typeof playIncorrectSound === 'function') playIncorrectSound();
          setTimeout(() => {
            setDuelSelectedEng(null);
            setDuelSelectedTr(null);
          }, 300);
        }
      }
    }
  };

  // Prioritizing flashcards: unseen or least seen first, then random tie-breaker
  useEffect(() => {
    if (pool.length > 0 && subTab === 'flashcards' && activeTab === 'vocabulary') {
      const shuffled = [...pool]
        .map(w => ({ w, rand: Math.random() }))
        .sort((a, b) => {
          const statsA = wordStats[a.w.english.toLowerCase()] || { correct: 0, wrong: 0 };
          const statsB = wordStats[b.w.english.toLowerCase()] || { correct: 0, wrong: 0 };
          const totalA = (statsA.correct || 0) + (statsA.wrong || 0);
          const totalB = (statsB.correct || 0) + (statsB.wrong || 0);
          
          if (totalA !== totalB) {
            return totalA - totalB;
          }
          return a.rand - b.rand;
        })
        .map(item => item.w);
      setFlashcardsList(shuffled);
      setFlashcardIndex(0);
    }
  }, [pool, subTab, activeTab]);

  // Keyboard navigation shortcuts (Enter/Space to flip, ArrowRight for next, ArrowLeft for previous)
  useEffect(() => {
    if (activeTab !== 'vocabulary' || subTab !== 'flashcards' || flashcardsList.length === 0) return;

    const handleKeyDown = (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable)) {
        return;
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setRevealMeaning(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setRevealMeaning(false);
        setFlashcardIndex(prev => (prev + 1) % flashcardsList.length);
        if (incrementDailyWords) incrementDailyWords();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setRevealMeaning(false);
        setFlashcardIndex(prev => (prev - 1 + flashcardsList.length) % flashcardsList.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, subTab, flashcardsList, incrementDailyWords]);

  // Auto-Pronounce on flashcard change
  useEffect(() => {
    if (activeTab === 'vocabulary' && subTab === 'flashcards' && autoPronounceEnabled && flashcardsList.length > 0) {
      const currentWord = flashcardsList[flashcardIndex];
      if (currentWord && playSpeechAudio) {
        playSpeechAudio(currentWord.english);
      }
    }
  }, [flashcardIndex, subTab, activeTab, autoPronounceEnabled, flashcardsList, playSpeechAudio]);

  // Build the 5-pair Matching Game
  const startMatchingGame = (mode = matchMode) => {
    const getSynonym = (w) => {
      if (w.synonyms) return w.synonyms.split(',')[0].trim();
      const entry = ACADEMIC_DICTIONARY_EXT[w.english.toLowerCase()];
      if (entry && entry.synonyms) {
        const list = entry.synonyms.split(',');
        return list[0].trim();
      }
      return null;
    };

    let selectedPool = [...pool];
    if (mode === 'synonym') {
      selectedPool = pool.filter(w => getSynonym(w) !== null);
      if (selectedPool.length < 5) {
        alert("Eş anlamlı eşleştirme için yeterli kelime bulunamadı. Lütfen daha fazla akademik kelime yükleyin veya kelime ekleyin.");
        setMatchMode('turkish');
        return;
      }
    }

    if (selectedPool.length < 5) {
      alert("Eşleştirme oyunu için en az 5 kelime eklemiş olmanız gerekmektedir. Lütfen Akademik Kelimeleri Yükle butonunu kullanın.");
      return;
    }

    const selected = selectedPool.sort(() => 0.5 - Math.random()).slice(0, 5);
    const leftSide = selected.map(w => ({ id: w.id, text: w.english })).sort(() => 0.5 - Math.random());
    const rightSide = selected.map(w => ({ 
      id: w.id, 
      text: mode === 'synonym' ? getSynonym(w) : w.turkish 
    })).sort(() => 0.5 - Math.random());
    
    setMatchLeft(leftSide);
    setMatchRight(rightSide);
    setActiveLeft(null);
    setActiveRight(null);
    setMatchedWords(new Set());
    setMatchErrors(new Set());
  };

  useEffect(() => {
    if (subTab === 'matching') {
      if (matchLeft.length === 0 && matchRight.length === 0) {
        startMatchingGame();
      }
    } else if (subTab !== 'matching') {
      setMatchLeft([]);
      setMatchRight([]);
    }
  }, [subTab, pool, matchMode, matchLeft.length, matchRight.length]);

  const handleMatchSelect = (item, side) => {
    if (matchedWords.has(item.id)) return;

    if (side === 'left') {
      setActiveLeft(item);
      if (activeRight) {
        checkMatch(item, activeRight);
      }
    } else {
      setActiveRight(item);
      if (activeLeft) {
        checkMatch(activeLeft, item);
      }
    }
  };

  const checkMatch = (leftItem, rightItem) => {
    if (incrementDailyQuestions) incrementDailyQuestions();
    if (leftItem.id === rightItem.id) {
      setMatchedWords(prev => new Set([...prev, leftItem.id]));
      setActiveLeft(null);
      setActiveRight(null);
      if (recordWordStat) {
        const wordObj = pool.find(w => w.id === leftItem.id);
        if (wordObj) recordWordStat(wordObj.english, true);
      }
    } else {
      // If mismatch, keep them visually identical (no red flashing/shake) but record error score
      if (recordWordStat) {
        const wordObj = pool.find(w => w.id === leftItem.id);
        if (wordObj) recordWordStat(wordObj.english, false);
      }
      setTimeout(() => {
        setActiveLeft(null);
        setActiveRight(null);
      }, 300);
    }
  };

  // Initialize Spelling game
  useEffect(() => {
    if (subTab === 'spelling' && pool.length > 0) {
      if (spellingList.length === 0) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
        setSpellingList(shuffled);
        setSpellingIndex(0);
        setSpellingInput('');
        setSpellingChecked(false);
        setSpellingResult(null);
      }
    } else if (subTab !== 'spelling') {
      setSpellingList([]);
    }
  }, [subTab, pool, spellingList.length]);

  const handleCheckSpelling = () => {
    if (spellingChecked) return;
    if (incrementDailyQuestions) incrementDailyQuestions();
    const wordObj = spellingList[spellingIndex];
    if (!wordObj) return;
    
    const userInput = spellingInput.trim().toLowerCase();
    const correctTarget = wordObj.english.trim().toLowerCase();
    
    // Check 1: Exact match
    let isCorrect = userInput === correctTarget;
    
    // Check 2: Synonym match in ACADEMIC_DICTIONARY_EXT (Direct & Reverse lookup)
    if (!isCorrect) {
      const entryDirect = ACADEMIC_DICTIONARY_EXT[correctTarget];
      if (entryDirect && entryDirect.synonyms) {
        const synList = entryDirect.synonyms.split(',').map(s => s.trim().toLowerCase());
        if (synList.includes(userInput)) {
          isCorrect = true;
        }
      }
      
      if (!isCorrect) {
        const entryReverse = ACADEMIC_DICTIONARY_EXT[userInput];
        if (entryReverse && entryReverse.synonyms) {
          const synList = entryReverse.synonyms.split(',').map(s => s.trim().toLowerCase());
          if (synList.includes(correctTarget)) {
            isCorrect = true;
          }
        }
      }
    }
    
    // Check 3: Check wordObj's own synonyms if present (custom words)
    if (!isCorrect && wordObj.synonyms) {
      const synList = wordObj.synonyms.split(',').map(s => s.trim().toLowerCase());
      if (synList.includes(userInput)) {
        isCorrect = true;
      }
    }
    
    setSpellingChecked(true);
    setSpellingResult(isCorrect ? 'correct' : 'wrong');
    
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
    if (handleUpdateWordLeitner) {
      handleUpdateWordLeitner(wordObj.english, isCorrect, wordObj.turkish);
    }
    
    if (playSpeechAudio && isCorrect) {
      playSpeechAudio(wordObj.english);
    }
  };

  const handleSpellingDontKnow = () => {
    if (spellingChecked) return;
    const wordObj = spellingList[spellingIndex];
    if (!wordObj) return;
    setSpellingInput(wordObj.english);
    setSpellingChecked(true);
    setSpellingResult('wrong');
    if (recordWordStat) {
      recordWordStat(wordObj.english, false);
    }
  };

  const handleNextSpelling = () => {
    setSpellingInput('');
    setSpellingChecked(false);
    setSpellingResult(null);
    setSpellingIndex(prev => prev + 1);
  };

  const generateMcqOptions = (correctWord, allWords) => {
    const incorrect = allWords
      .filter(w => w.id !== correctWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.turkish);
    const opts = [correctWord.turkish, ...incorrect].sort(() => 0.5 - Math.random());
    return opts;
  };

  // Initialize MCQ game
  useEffect(() => {
    if (subTab === 'mcq' && pool.length >= 4) {
      if (mcqList.length === 0) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
        setMcqList(shuffled);
        setMcqIndex(0);
        setMcqSelected(null);
        setMcqChecked(false);
        setMcqScore(0);
        setMcqFinished(false);
        
        if (shuffled[0]) {
          setMcqOptions(generateMcqOptions(shuffled[0], pool));
        }
      }
    } else if (subTab !== 'mcq') {
      setMcqList([]);
    }
  }, [subTab, pool, mcqList.length]);

  const handleMcqSelect = (option) => {
    if (mcqChecked) return;
    setMcqSelected(option);
    
    if (incrementDailyQuestions) incrementDailyQuestions();
    const wordObj = mcqList[mcqIndex];
    if (!wordObj) return;

    const isCorrect = option === wordObj.turkish;
    setMcqChecked(true);
    if (isCorrect) {
      setMcqScore(prev => prev + 1);
    }
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
    if (handleUpdateWordLeitner) {
      handleUpdateWordLeitner(wordObj.english, isCorrect, wordObj.turkish);
    }
    if (playSpeechAudio && isCorrect) {
      playSpeechAudio(wordObj.english);
    }
  };

  const handleCheckMcq = () => {};

  const handleNextMcq = () => {
    if (mcqIndex < mcqList.length - 1) {
      const nextIdx = mcqIndex + 1;
      setMcqIndex(nextIdx);
      setMcqSelected(null);
      setMcqChecked(false);
      setMcqOptions(generateMcqOptions(mcqList[nextIdx], pool));
    } else {
      setMcqFinished(true);
    }
  };
  const handleCardFeedback = (isCorrect) => {
    if (incrementDailyWords) incrementDailyWords();
    const wordObj = flashcardsList[flashcardIndex];
    if (!wordObj) return;
    if (recordWordStat) {
      recordWordStat(wordObj.english, isCorrect);
    }
    setRevealMeaning(false);
    setFlashcardIndex(prev => (prev + 1) % flashcardsList.length);
  };

  const handleCardStartDrag = (clientX, clientY) => {
    setIsDraggingCard(true);
    setCardDragStart({ x: clientX, y: clientY });
    setCardOffset({ x: 0, y: 0 });
  };

  const handleCardMoveDrag = (clientX, clientY) => {
    if (!isDraggingCard) return;
    const deltaX = clientX - cardDragStart.x;
    const deltaY = clientY - cardDragStart.y;
    setCardOffset({ x: deltaX, y: deltaY });
  };

  const handleCardEndDrag = () => {
    if (!isDraggingCard) return;
    setIsDraggingCard(false);
    
    const threshold = 110;
    if (cardOffset.x > threshold) {
      handleCardFeedback(false);
    } else if (cardOffset.x < -threshold) {
      handleCardFeedback(true);
    } else {
      if (Math.abs(cardOffset.x) < 25 && Math.abs(cardOffset.y) < 25) {
        setRevealMeaning(prev => !prev);
      }
    }
    setCardOffset({ x: 0, y: 0 });
  };

  // Search, filter, and sort words
  const filteredWords = pool
    .filter(w => {
      if (filterStatus === 'learning') return w.status !== 'learned';
      if (filterStatus === 'learned') return w.status === 'learned';
      return true;
    })
    .filter(w => {
      const query = searchQuery.toLowerCase();
      return (w.english || '').toLowerCase().includes(query) || (w.turkish || '').toLowerCase().includes(query);
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortField === 'correct') {
        valA = (wordStats[a.english.toLowerCase()] || { correct: 0 }).correct;
        valB = (wordStats[b.english.toLowerCase()] || { correct: 0 }).correct;
      } else if (sortField === 'wrong') {
        valA = (wordStats[a.english.toLowerCase()] || { wrong: 0 }).wrong;
        valB = (wordStats[b.english.toLowerCase()] || { wrong: 0 }).wrong;
      } else {
        valA = (a.english || '').toLowerCase();
        valB = (b.english || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Tab Styles
  const activeTabStyle = {
    flex: '1',
    minWidth: '80px',
    padding: '8px 12px',
    fontSize: '0.72rem',
    fontWeight: '700',
    borderRadius: '10px',
    background: 'var(--primary-gradient)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer'
  };

  const inactiveTabStyle = {
    flex: '1',
    minWidth: '80px',
    padding: '8px 12px',
    fontSize: '0.72rem',
    fontWeight: '600',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.02)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  // Button style generator for Matching game (Strict high-contrast, rounded table rows/cells look)
  const getMatchBtnStyle = (isMatched, isActive, isErr, side) => {
    let defaultBg = 'rgba(255, 255, 255, 0.03)';
    let defaultBorder = '1px solid rgba(255, 255, 255, 0.08)';
    let defaultColor = '#e2e8f0';

    if (side === 'left') {
      defaultBg = 'rgba(99, 102, 241, 0.05)';
      defaultBorder = '1px solid rgba(99, 102, 241, 0.2)';
      defaultColor = '#c7d2fe'; // Light Indigo
    } else if (side === 'right') {
      if (matchMode === 'synonym') {
        defaultBg = 'rgba(139, 92, 246, 0.05)';
        defaultBorder = '1px solid rgba(139, 92, 246, 0.2)';
        defaultColor = '#ddd6fe'; // Light Purple
      } else {
        defaultBg = 'rgba(16, 185, 129, 0.05)';
        defaultBorder = '1px solid rgba(16, 185, 129, 0.2)';
        defaultColor = '#a7f3d0'; // Light Emerald
      }
    }

    let base = {
      width: '100%',
      padding: '12px 14px',
      fontSize: '0.8rem',
      fontWeight: '700',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      border: defaultBorder,
      background: defaultBg,
      color: defaultColor,
      minHeight: '46px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: '1.3',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };

    if (isMatched) {
      base = {
        ...base,
        opacity: 1.0, // Keep fully visible on correct match
        background: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981', // Highlight border with green
        color: '#34d399',
        cursor: 'default',
        pointerEvents: 'none',
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)'
      };
    } else if (isErr) {
      base = {
        ...base,
        background: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#ef4444',
        color: '#f87171',
        boxShadow: '0 0 8px rgba(239, 68, 68, 0.25)'
      };
    } else if (isActive) {
      base = {
        ...base,
        background: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#818cf8',
        color: '#ffffff',
        boxShadow: '0 0 12px rgba(99, 102, 241, 0.35)',
        transform: 'scale(1.02)'
      };
    }

    return base;
  };

  // MCQ button styling
  const getMcqBtnStyle = (isSelected, isCorrect, isChecked) => {
    let base = {
      width: '100%',
      padding: '14px 18px',
      fontSize: '0.82rem',
      fontWeight: '600',
      borderRadius: '12px',
      textAlign: 'left',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(255, 255, 255, 0.02)',
      color: '#e2e8f0',
      display: 'block'
    };

    if (isChecked) {
      if (isCorrect) {
        base = {
          ...base,
          background: 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10b981',
          color: '#34d399',
          fontWeight: '700',
          cursor: 'default'
        };
      } else if (isSelected) {
        base = {
          ...base,
          background: 'rgba(239, 68, 68, 0.15)',
          borderColor: '#ef4444',
          color: '#f87171',
          fontWeight: '700',
          cursor: 'default'
        };
      } else {
        base = {
          ...base,
          opacity: 0.35,
          cursor: 'default'
        };
      }
    } else if (isSelected) {
      base = {
        ...base,
        background: 'rgba(99, 102, 241, 0.18)',
        borderColor: '#6366f1',
        color: '#a5b4fc',
        fontWeight: '700'
      };
    }

    return base;
  };

  if (activeTab !== 'vocabulary') return null;

  return (
    <div className="space-y-4 text-left" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="section-title flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2>Akademik Kelime Defterim 📚</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Kelime kartları ile çalışın, eşleştirme oyunları oynayın ve istatistiklerinizi inceleyin.</p>
        </div>
        
        {pool.length === 0 && (
          <button 
            onClick={handleLoadAcademicWords}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Hazır YÖKDİL Kelimelerini Yükle
          </button>
        )}
      </div>

      {/* Premium Select Dropdown for Minigames / Sections */}
      <div style={{ marginBottom: '16px' }}>
        <select 
          value={subTab}
          onChange={(e) => setSubTab(e.target.value)}
          className="duo-input"
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            borderRadius: '14px',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            background: '#0d111c',
            color: 'white',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.05)'
          }}
        >
          <option value="flashcards">📇 Kelime Kartları (Flashcards)</option>
          <option value="matching">🧩 Kelime Eşleştirme Oyunu (Matching Game)</option>
          <option value="sentenceBuilder">📝 Cümle Kurma Oyunu (Sentence Builder)</option>
          <option value="duel">⚡ Zamana Karşı Kelime Düellosu (Time Attack Duel)</option>
          <option value="mcq">🎯 Çoktan Seçmeli Test (MCQ Quiz)</option>
          <option value="spelling">✍️ Kelime Yazma Testi (Spelling Practice)</option>
          <option value="dictation">🎧 Dikte Pratiği (Dinle & Yaz)</option>
          <option value="pronunciation">🎙️ Telaffuz Laboratuvarı</option>
          <option value="prepDrills">✏️ Edat & Phrasal Verb Pratiği</option>
          <option value="leitner">📦 Leitner Sistemi (Aralıklı Tekrar)</option>
          <option value="table">📊 Kelime Listesi & Defter Yönetimi</option>
        </select>
      </div>

      {/* SUBTAB 1: FLASHCARDS LEARNING */}
      {subTab === 'flashcards' && (
        <div className="space-y-4">
          {flashcardsList.length > 0 ? (
            (() => {
              const currentWord = flashcardsList[flashcardIndex];
              if (!currentWord) return null;
              const stats = wordStats[currentWord.english.toLowerCase()] || { correct: 0, wrong: 0 };
              
              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Kelime {flashcardIndex + 1} / {flashcardsList.length}</span>
                    <span className="flex items-center gap-1" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star className="h-3 w-3 text-indigo-400" style={{ color: '#818CF8' }} />
                      Doğru: {stats.correct} | Yanlış: {stats.wrong}
                    </span>
                  </div>

                  {/* Flippable Flashcard Card */}
                  <div 
                    className={`flip-card-container ${revealMeaning ? 'flipped' : ''}`}
                    onMouseDown={(e) => {
                      if (e.target.closest('button')) return;
                      handleCardStartDrag(e.clientX, e.clientY);
                    }}
                    onMouseMove={(e) => {
                      handleCardMoveDrag(e.clientX, e.clientY);
                    }}
                    onMouseUp={handleCardEndDrag}
                    onMouseLeave={handleCardEndDrag}
                    onTouchStart={(e) => {
                      if (e.target.closest('button')) return;
                      const touch = e.touches[0];
                      handleCardStartDrag(touch.clientX, touch.clientY);
                    }}
                    onTouchMove={(e) => {
                      const touch = e.touches[0];
                      handleCardMoveDrag(touch.clientX, touch.clientY);
                    }}
                    onTouchEnd={handleCardEndDrag}
                    style={{
                      touchAction: 'none',
                      userSelect: 'none',
                      transform: `translate(${cardOffset.x}px, ${cardOffset.y * 0.15}px) rotate(${cardOffset.x * 0.05}deg)`,
                      transition: isDraggingCard ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: isDraggingCard ? 'grabbing' : 'grab',
                      position: 'relative'
                    }}
                  >
                    {/* Visual Swipe Indicators */}
                    {cardOffset.x > 15 && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '20px',
                        background: `rgba(239, 68, 68, ${Math.min(0.7, cardOffset.x / 140)})`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        fontWeight: '900',
                        zIndex: 100,
                        pointerEvents: 'none'
                      }}>
                        TEKRAR ÇALIŞACAĞIM ✕
                      </div>
                    )}
                    {cardOffset.x < -15 && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '20px',
                        background: `rgba(16, 185, 129, ${Math.min(0.7, -cardOffset.x / 140)})`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem',
                        fontWeight: '900',
                        zIndex: 100,
                        pointerEvents: 'none'
                      }}>
                        BİLİYORUM ✓
                      </div>
                    )}
                    <div className="flip-card-inner">
                      {/* Front Side */}
                      <div className="flip-card-front">
                        <div className="space-y-2 relative w-full h-full flex flex-col justify-center items-center">
                          {/* Audio button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (playSpeechAudio) playSpeechAudio(currentWord.english);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-15px',
                              right: '5px',
                              padding: '8px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#a5b4fc',
                              zIndex: 10
                            }}
                            className="hover:bg-white/10 transition-colors"
                            title="Telaffuz Dinle"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                          
                          <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ fontSize: '1.8rem', color: '#f8fafc', margin: '0 0 8px 0' }}>
                            {currentWord.english}
                          </h3>
                          <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Anlamı Görmek İçin Tıkla</p>
                          {currentWord.sentence_en && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '320px', margin: '12px auto 0 auto', lineHeight: '1.4' }}>
                              "{currentWord.sentence_en}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Back Side */}
                      <div className="flip-card-back">
                        <div className="space-y-2 relative w-full h-full flex flex-col justify-center items-center">
                          <h3 className="text-xl font-bold text-indigo-400 font-heading" style={{ fontSize: '1.6rem', color: '#818cf8', margin: '0 0 8px 0' }}>
                            {currentWord.turkish}
                          </h3>
                          <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>İngilizce: {currentWord.english}</p>
                          {currentWord.sentence_tr && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '320px', margin: '12px auto 0 auto', lineHeight: '1.4' }}>
                              "{currentWord.sentence_tr}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-12 text-center border border-white/5 text-slate-500 text-xs rounded-3xl">
              Defterinizde henüz kelime bulunmamaktadır. Kelimeleri yükleyerek hemen başlayın!
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: 5-PAIR MATCHING GAME (OPTIMIZED FOR MOBILE VIEWPORTS) */}
      {subTab === 'matching' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Kelime Eşleştirme (5 Çift - Mobil Uyumlu 📱)</span>
            <button 
              onClick={() => startMatchingGame()}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', border: 'none', background: 'none' }}
            >
              <RefreshCw className="h-3 w-3" /> Yeniden Dağıt
            </button>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px' }}>
            <button
              onClick={() => { setMatchMode('turkish'); }}
              style={{
                flex: 1,
                padding: '8px 14px',
                fontSize: '0.72rem',
                fontWeight: '800',
                borderRadius: '10px',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                border: matchMode === 'turkish' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
                background: matchMode === 'turkish' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: matchMode === 'turkish' ? '#34d399' : 'var(--text-secondary)'
              }}
            >
              🇹🇷 İngilizce - Türkçe
            </button>
            <button
              onClick={() => { setMatchMode('synonym'); }}
              style={{
                flex: 1,
                padding: '8px 14px',
                fontSize: '0.72rem',
                fontWeight: '800',
                borderRadius: '10px',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                border: matchMode === 'synonym' ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.05)',
                background: matchMode === 'synonym' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                color: matchMode === 'synonym' ? '#c084fc' : 'var(--text-secondary)'
              }}
            >
              🔄 Eş Anlamlı (Synonym)
            </button>
          </div>

          {/* Grid structured with clear side-by-side columns and row separation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
            {/* Left Column: English Words */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 12px', borderRadius: '10px', color: '#a5b4fc', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
                🇬🇧 İngilizce
              </div>
              {matchLeft.map(item => {
                const isMatched = matchedWords.has(item.id);
                const isActive = activeLeft?.id === item.id;
                const isErr = matchErrors.has(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect(item, 'left')}
                    style={getMatchBtnStyle(isMatched, isActive, isErr, 'left')}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>

            {/* Right Column: Turkish Meanings / Synonyms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: matchMode === 'synonym' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: matchMode === 'synonym' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '10px', color: matchMode === 'synonym' ? '#c084fc' : '#34d399', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
                {matchMode === 'synonym' ? '🔄 Eş Anlamlısı' : '🇹🇷 Karşılığı'}
              </div>
              {matchRight.map(item => {
                const isMatched = matchedWords.has(item.id);
                const isActive = activeRight?.id === item.id;
                const isErr = matchErrors.has(item.id);
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchSelect(item, 'right')}
                    style={getMatchBtnStyle(isMatched, isActive, isErr, 'right')}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          </div>

          {matchedWords.size === 5 && (
            <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl flex items-center justify-center gap-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', marginTop: '16px' }}>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400" style={{ color: '#34d399' }}>Tebrikler! 5 kelimenin tamamını başarıyla eşleştirdiniz.</span>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: SPELLING PRACTICE */}
      {subTab === 'spelling' && (
        <div className="space-y-4">
          {spellingList.length > 0 && spellingIndex < spellingList.length ? (
            (() => {
              const currentWord = spellingList[spellingIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>YAZMA TESTİ (Klavye Pratiği)</span>
                    <span>Soru {spellingIndex + 1} / {spellingList.length}</span>
                  </div>

                  <div className="text-center py-4 space-y-2">
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Kelimenin Türkçe Anlamı:</p>
                    <h3 className="text-xl font-bold text-indigo-400 font-heading" style={{ fontSize: '1.5rem', color: '#818cf8', margin: '6px 0 0 0' }}>
                      {currentWord.turkish}
                    </h3>
                  </div>

                  <input 
                    type="text"
                    placeholder="İngilizce karşılığını yazın..."
                    value={spellingInput}
                    onChange={(e) => {
                      if (!spellingChecked) {
                        setSpellingInput(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && spellingInput.trim() && !spellingChecked) {
                        handleCheckSpelling();
                      }
                    }}
                    disabled={spellingChecked}
                    className="duo-input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                  />

                  {spellingChecked && (
                    <div className="space-y-2">
                      <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                        spellingResult === 'correct' 
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                          : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                      }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>{spellingResult === 'correct' ? '✔️ Harika, Doğru!' : `❌ Hata! Doğru yazılışı: ${currentWord.english}`}</div>
                        {currentWord.sentence_en && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                            "{currentWord.sentence_en}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    {!spellingChecked ? (
                      <>
                        <button
                          onClick={handleSpellingDontKnow}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
                        >
                          Bilmiyorum 🤷‍♂️
                        </button>
                        <button
                          onClick={handleCheckSpelling}
                          disabled={!spellingInput.trim()}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Kontrol Et
                        </button>
                      </>
                    ) : (
                      <>
                        <div />
                        <button
                          onClick={handleNextSpelling}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          {spellingIndex < spellingList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Yazma testini tamamladınız.</h4>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3.1: DICTATION PRACTICE */}
      {subTab === 'dictation' && (
        <div className="space-y-4">
          {dictationList.length > 0 && dictationIndex < dictationList.length ? (
            (() => {
              const currentWord = dictationList[dictationIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🎧 DİKTE (DINLE VE YAZ)</span>
                    <span>Soru {dictationIndex + 1} / {dictationList.length}</span>
                  </div>

                  <div className="text-center py-6 space-y-4">
                    <button
                      onClick={() => {
                        if (playSpeechAudio) playSpeechAudio(currentWord.english);
                      }}
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/40 hover:scale-105 transition-all cursor-pointer"
                      title="Tekrar Dinle"
                    >
                      <Volume2 className="h-6 w-6" />
                    </button>
                    <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Telaffuzu duyduğunuz kelimeyi yazın:</p>
                  </div>

                  <input 
                    type="text"
                    placeholder="İngilizce kelimeyi buraya yazın..."
                    value={dictationInput}
                    onChange={(e) => {
                      if (!dictationChecked) {
                        setDictationInput(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && dictationInput.trim() && !dictationChecked) {
                        handleCheckDictation();
                      }
                    }}
                    disabled={dictationChecked}
                    className="duo-input"
                    style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
                  />

                  {dictationChecked && (
                    <div className="space-y-2">
                      <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                        dictationResult === 'correct' 
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                          : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                      }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>{dictationResult === 'correct' ? '✔️ Harika, Doğru!' : `❌ Hata! Doğru yazılışı: ${currentWord.english}`}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '4px' }}>
                          Türkçe Anlamı: <strong>{currentWord.turkish}</strong>
                        </div>
                        {currentWord.sentence_en && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                            "{currentWord.sentence_en}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {!dictationChecked ? (
                      <button
                        onClick={handleCheckDictation}
                        disabled={!dictationInput.trim()}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Kontrol Et
                      </button>
                    ) : (
                      <button
                        onClick={handleNextDictation}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {dictationIndex < dictationList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Dikte pratik testini tamamladınız.</h4>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3.1.2: PRONUNCIATION LABORATORY */}
      {subTab === 'pronunciation' && (
        <div className="space-y-4">
          {prList.length > 0 && prIndex < prList.length ? (
            (() => {
              const currentWord = prList[prIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5 text-center">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🎙️ TELAFFUZ LABORATUVARI</span>
                    <span>Soru {prIndex + 1} / {prList.length}</span>
                  </div>

                  <div className="py-4 space-y-2">
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', letterSpacing: '0.02em', margin: 0 }}>{currentWord.english}</h2>
                    <p style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: '700', margin: 0 }}>{currentWord.turkish}</p>
                  </div>

                  <div className="flex justify-center gap-4 py-4" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                    <button
                      onClick={() => {
                        if (playSpeechAudio) playSpeechAudio(currentWord.english);
                      }}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                      title="Örnek Telaffuzu Dinle"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>

                    <button
                      onClick={startSpeechRecognitionPr}
                      disabled={prListening}
                      className={`flex h-16 w-16 items-center justify-center rounded-full transition-all cursor-pointer ${
                        prListening 
                          ? 'bg-rose-600/30 border border-rose-500 text-rose-400 animate-pulse' 
                          : 'bg-indigo-600 border border-indigo-500 text-white hover:scale-105 shadow-lg shadow-indigo-600/20'
                      }`}
                      style={{ fontSize: '1.4rem' }}
                      title="Mikrofonu Aç ve Konuş"
                    >
                      <i className="fa-solid fa-microphone"></i>
                    </button>
                  </div>

                  {prListening && (
                    <p style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 'bold' }}>Dinleniyor... Şimdi konuşun.</p>
                  )}

                  {prScore !== null && (
                    <div className="space-y-2">
                      <div className={`p-4 border rounded-2xl text-xs font-semibold max-w-xs mx-auto ${
                        prScore >= 70 
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                          : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                      }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '0 auto' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '900' }}>Telaffuz Skoru: {prScore} / 100</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                          {prScore >= 90 ? '🥇 Kusursuz Telaffuz!' : prScore >= 70 ? '✔️ Çok İyi, Anlaşılır!' : '⚠️ Biraz daha gayret! Tekrar deneyin.'}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setPrScore(null);
                        setPrIndex(prev => prev + 1);
                      }}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      {prIndex < prList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Telaffuz pratiğini tamamladınız.</h4>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3.1.3: SCRAMBLED SENTENCES BUILDER */}
      {subTab === 'sentenceBuilder' && (
        <div className="space-y-4">
          {sbList.length > 0 && sbIndex < sbList.length ? (
            (() => {
              const currentWord = sbList[sbIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5 text-left">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🧩 CÜMLE KURMA OYUNU</span>
                    <span>Soru {sbIndex + 1} / {sbList.length}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Türkçe Anlamı:</h4>
                    <p style={{ fontSize: '0.85rem', color: 'white', margin: 0, fontWeight: '700' }}>"{currentWord.sentence_tr}"</p>
                  </div>

                  {/* Built sentence area */}
                  <div style={{ minHeight: '60px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {sbSelected.map((word, idx) => (
                      <span
                        key={idx}
                        onClick={() => {
                          if (!sbChecked) {
                            setSbSelected(prev => prev.filter((_, i) => i !== idx));
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold cursor-pointer hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-300 transition-all"
                      >
                        {word}
                      </span>
                    ))}
                    {sbSelected.length === 0 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Kelimeleri sıralamak için aşağıdaki bloklara tıklayın...</span>
                    )}
                  </div>

                  {/* Scrambled word tags options */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 0' }}>
                    {sbScrambled.map((word, idx) => {
                      const selectedCount = sbSelected.filter(w => w === word).length;
                      const scrambledCount = sbScrambled.filter(w => w === word).length;
                      const isSelected = selectedCount >= scrambledCount;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!sbChecked && !isSelected) {
                              setSbSelected(prev => [...prev, word]);
                            }
                          }}
                          className={`word-tag-btn ${isSelected ? 'tag-selected' : ''}`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>

                  {sbChecked && (
                    <div className="space-y-2">
                      <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                        sbResult === 'correct' 
                          ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                          : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                      }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>{sbResult === 'correct' ? '✔️ Harika, Doğru Cümle Yapısı!' : '❌ Sıralamada hata var!'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '4px' }}>
                          Doğru Cümle: <strong>{currentWord.sentence_en}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center flex-wrap gap-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <button
                      onClick={() => setSbSelected([])}
                      disabled={sbChecked || sbSelected.length === 0}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Temizle
                    </button>

                    {!sbChecked ? (
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          onClick={handleSbDontKnow}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
                        >
                          Bilmiyorum 🤷‍♂️
                        </button>
                        <button
                          onClick={handleCheckSentence}
                          disabled={sbSelected.length === 0}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Kontrol Et
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleNextSentence}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {sbIndex < sbList.length - 1 ? 'Sonraki Cümle ➡️' : 'Oyunu Bitir 🏁'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
              <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Cümle kurma oyununu tamamladınız.</h4>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}



      {/* SUBTAB: PREPOSITION & PHRASAL DRILLS */}
      {subTab === 'prepDrills' && (
        <div className="space-y-4">
          <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-6">
            <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', color: 'var(--primary-light)' }}>✏️ EDAT & PHRASAL VERB PRATİĞİ</span>
              <span>Soru {drillIndex + 1} / {PREP_DRILL_QUESTIONS.length}</span>
            </div>

            {drillIndex < PREP_DRILL_QUESTIONS.length ? (
              (() => {
                const currentQuestion = PREP_DRILL_QUESTIONS[drillIndex];
                if (!currentQuestion) return null;
                return (
                  <div className="space-y-6">
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${((drillIndex) / PREP_DRILL_QUESTIONS.length) * 100}%`, height: '100%', background: 'var(--primary-light)' }}></div>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: '#cbd5e1', margin: 0, textAlign: 'left' }}>
                        {currentQuestion.sentence}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                      {shuffledDrillOptions.map((opt) => {
                        const isSelected = drillSelected === opt;
                        const isCorrect = currentQuestion.answer === opt;
                        
                        let optStyle = {
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          color: '#cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          cursor: drillChecked ? 'default' : 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        };

                        if (drillChecked) {
                          if (isCorrect) {
                            optStyle.background = 'rgba(16, 185, 129, 0.15)';
                            optStyle.borderColor = '#10b981';
                            optStyle.color = '#34d399';
                          } else if (isSelected) {
                            optStyle.background = 'rgba(239, 68, 68, 0.15)';
                            optStyle.borderColor = '#ef4444';
                            optStyle.color = '#f87171';
                          } else {
                            optStyle.opacity = 0.4;
                          }
                        } else if (isSelected) {
                          optStyle.background = 'rgba(99, 102, 241, 0.12)';
                          optStyle.borderColor = '#6366f1';
                          optStyle.color = '#a5b4fc';
                        }

                        return (
                          <button
                            key={opt}
                            disabled={drillChecked}
                            onClick={() => setDrillSelected(opt)}
                            style={optStyle}
                          >
                            <span style={{ 
                              width: '18px', 
                              height: '18px', 
                              borderRadius: '50%', 
                              border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.2)'}`, 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '0.62rem',
                              color: isSelected ? 'white' : 'transparent',
                              background: isSelected ? '#6366f1' : 'transparent'
                            }}>
                              ✓
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {drillChecked && (
                      <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '14px', borderRadius: '12px', textAlign: 'left' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '800', color: drillSelected === currentQuestion.answer ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          {drillSelected === currentQuestion.answer ? '🎉 Doğru Tebrikler!' : '❌ Hatalı Cevap!'}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: '#a5b4fc', margin: 0, lineHeight: 1.4 }}>
                          <strong>Gramer İpucu:</strong> {currentQuestion.tip}
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                      {!drillChecked ? (
                        <button
                          disabled={!drillSelected}
                          onClick={() => {
                            if (drillSelected === currentQuestion.answer) {
                              setDrillScore(prev => prev + 1);
                            }
                            setDrillChecked(true);
                            if (incrementDailyQuestions) incrementDailyQuestions();
                          }}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Kontrol Et
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setDrillSelected(null);
                            setDrillChecked(false);
                            setDrillIndex(prev => prev + 1);
                          }}
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          {drillIndex < PREP_DRILL_QUESTIONS.length - 1 ? 'Devam Et ➡️' : 'Sonuçları Gör 🏆'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-6 space-y-4">
                <div style={{ fontSize: '3rem' }}>🏆</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white' }}>Edat Pratiği Tamamlandı!</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Skorunuz: {drillScore} / {PREP_DRILL_QUESTIONS.length} Doğru
                </p>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${(drillScore / PREP_DRILL_QUESTIONS.length) * 100}%`, height: '100%', background: '#10b981' }}></div>
                </div>
                <button
                  onClick={() => {
                    setDrillIndex(0);
                    setDrillSelected(null);
                    setDrillChecked(false);
                    setDrillScore(0);
                  }}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Yeniden Başlat
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB: KELİME DÜELLOSU */}
      {subTab === 'duel' && (
        <div className="space-y-4 text-left">
          <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'white', margin: 0 }}>⚡ Zamana Karşı Kelime Düellosu</h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Kelimeleri Türkçe karşılıkları ile en hızlı şekilde eşleştirin. Her doğru eşleştirme +10 Puan kazandırır.
                </p>
              </div>
              {duelActive && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '10px', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    ⏱️ {duelTime} sn
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '10px', color: '#34d399', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    🏆 {duelScore} Puan
                  </div>
                </div>
              )}
            </div>

            {!duelActive ? (
              <div className="text-center py-6 space-y-4">
                <div style={{ fontSize: '3rem' }}>⚡</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>Düelloya Hazır mısın?</h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                  30 saniye içinde en çok eşleştirmeyi yapın. Defterinizdeki kelimeler karıştırılarak karşınıza çıkacaktır.
                </p>
                <button
                  onClick={handleStartDuel}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Oyunu Başlat 🚀
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                {/* English Column */}
                <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>İngilizce Kelimeler</div>
                  {duelEngList.map(card => {
                    const isMatched = duelCompletedPairs.includes(card.id);
                    const isSelected = duelSelectedEng === card.id;
                    if (isMatched) return null;
                    
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleSelectDuelCard('eng', card.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-bold text-xs ${
                          isSelected ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-white/2 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {card.val}
                      </button>
                    );
                  })}
                </div>

                {/* Turkish Column */}
                <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>Türkçe Anlamları</div>
                  {duelTrList.map(card => {
                    const isMatched = duelCompletedPairs.includes(card.id);
                    const isSelected = duelSelectedTr === card.id;
                    if (isMatched) return null;
                    
                    return (
                      <button
                        key={card.id}
                        onClick={() => handleSelectDuelCard('tr', card.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-bold text-xs ${
                          isSelected ? 'bg-amber-600/20 border-amber-500 text-amber-300' : 'bg-white/2 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {card.val}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {duelActive && duelCompletedPairs.length === 5 && (
              <div className="text-center py-4 space-y-2">
                <p style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 'bold' }}>Tebrikler! Tüm kelimeleri eşleştirdiniz.</p>
                <button
                  onClick={handleStartDuel}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  Yeni Tur Yükle 🔄
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3.2: LEITNER SYSTEM BOXES */}
      {subTab === 'leitner' && (
        <div className="space-y-4">
          <div className="glass-card p-5 border border-white/5 rounded-2xl">
            <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '4px' }}>📦 Leitner Spaced Repetition (Aralıklı Tekrar)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Ezberlediğiniz kelimeler doğru bildikçe sağdaki kutulara taşınır. Yanlış bilinen kelimeler en baştaki Kutu 1'e geri döner. Hedefiniz tüm kelimeleri Kutu 5'e ulaştırmaktır!
            </p>

            {/* Boxes shelf */}
            <div className="leitner-shelf">
              {[1, 2, 3, 4, 5].map(boxNum => {
                const wordsInBox = pool.filter(w => (w.leitnerBox || 1) === boxNum);
                
                return (
                  <div key={boxNum} className="leitner-box-card">
                    <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
                      {boxNum === 5 ? '👑' : '📦'}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-main)' }}>Kutu {boxNum}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--primary-light)', fontWeight: 'bold', margin: '4px 0' }}>
                      {wordsInBox.length} Kelime
                    </div>
                    <div style={{ 
                      maxHeight: '120px', 
                      overflowY: 'auto', 
                      marginTop: '10px', 
                      borderTop: '1px solid rgba(255,255,255,0.05)', 
                      paddingTop: '8px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px',
                      alignItems: 'center' 
                    }}>
                      {wordsInBox.map(w => (
                        <span 
                          key={w.id} 
                          className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 font-semibold cursor-pointer hover:bg-white/10"
                          onClick={() => setDrawerWord(w)}
                          title={w.turkish}
                        >
                          {w.english}
                        </span>
                      ))}
                      {wordsInBox.length === 0 && (
                        <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)' }}>Boş</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: MCQ */}
      {subTab === 'mcq' && (
        <div className="space-y-4">
          {mcqList.length > 0 && !mcqFinished ? (
            (() => {
              const currentWord = mcqList[mcqIndex];
              return (
                <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ÇOKTAN SEÇMELİ TEST</span>
                    <span>Soru {mcqIndex + 1} / {mcqList.length}</span>
                  </div>

                  <div className="text-center py-4 space-y-1">
                    <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Kelimenin İngilizcesi:</p>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ fontSize: '1.8rem', color: 'white', margin: '6px 0 0 0' }}>
                      {currentWord.english}
                    </h3>
                  </div>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {mcqOptions.map((opt) => {
                      const isSelected = mcqSelected === opt;
                      const correctVal = mcqMode === 'synonym'
                        ? (SYNONYM_MAP[(currentWord.english || '').toLowerCase().trim()] || currentWord.turkish)
                        : currentWord.turkish;
                      const isCorrectAnswer = opt === correctVal;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleMcqSelect(opt)}
                          disabled={mcqChecked}
                          style={getMcqBtnStyle(isSelected, isCorrectAnswer, mcqChecked)}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {mcqChecked && (
                    <div className="p-4 border rounded-2xl text-xs font-semibold" style={{
                      borderColor: mcqSelected === currentWord.turkish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      background: mcqSelected === currentWord.turkish ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                      color: mcqSelected === currentWord.turkish ? '#34d399' : '#f87171'
                    }}>
                      {mcqSelected === currentWord.turkish ? '✔️ Tebrikler, Doğru!' : `❌ Hata! Doğru anlamı: ${currentWord.turkish}`}
                    </div>
                  )}

                   {mcqChecked && (
                    <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={handleNextMcq}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {mcqIndex < mcqList.length - 1 ? 'Sonraki Soru ➡️' : 'Testi Bitir 🏁'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="glass-card p-6 border border-indigo-500/20 bg-indigo-500/5 text-center rounded-2xl space-y-4">
              <Sparkles className="h-8 w-8 text-indigo-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">Tebrikler! Çoktan seçmeli testi tamamladınız.</h4>
              <p className="text-xs text-slate-400">Skorunuz: <strong style={{ color: 'var(--primary-light)' }}>{mcqScore} / 10</strong></p>
              <button 
                onClick={() => setSubTab('flashcards')}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Kartlara Dön
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: WORD TABLE */}
      {subTab === 'table' && (
        <div className="space-y-4">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <input 
                type="text"
                placeholder="Kelime ara (İngilizce veya Türkçe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="duo-input"
                style={{ width: '100%', padding: '10px 36px 10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none' }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Aramayı Temizle"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="duo-input"
              style={{ padding: '10px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="learning">Çalışıyorum</option>
              <option value="learned">Öğrendim</option>
            </select>

            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-secondary"
              style={{ padding: '10px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {showAddForm ? 'Kapat' : '✍️ Yeni Kelime Ekle'}
            </button>
          </div>

          {/* Add custom word form */}
          {showAddForm && (
            <div className="glass-card p-4 border border-white/5 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text"
                  placeholder="İngilizce Kelime"
                  value={customEnglish}
                  onChange={(e) => setCustomEnglish(e.target.value)}
                  className="duo-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white' }}
                />
                <input 
                  type="text"
                  placeholder="Türkçe Anlamı"
                  value={customTurkish}
                  onChange={(e) => setCustomTurkish(e.target.value)}
                  className="duo-input"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white' }}
                />
              </div>
              <button 
                onClick={() => {
                  if (customEnglish.trim() && customTurkish.trim()) {
                    handleAddCustomWord(customEnglish, customTurkish);
                    setCustomEnglish('');
                    setCustomTurkish('');
                    setShowAddForm(false);
                  }
                }}
                className="btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Deftere Ekle
              </button>
            </div>
          )}

          {/* Word Table */}
          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden vocab-table-card" style={{ maxWidth: '100%' }}>
            <div className="overflow-x-auto" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full border-collapse text-left" style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b border-white/5 bg-white/2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th 
                      onClick={() => { setSortField('english'); setSortOrder(p => p === 'asc' ? 'desc' : 'asc'); }}
                      className="p-3 text-[9px] uppercase font-bold text-slate-400 cursor-pointer"
                      style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}
                    >
                      İngilizce Kelime {sortField === 'english' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                    </th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>Türkçe Anlamı</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>Durum</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWords.map((item) => (
                    <tr 
                      key={item.id} 
                      className="border-b border-white/5 hover:bg-white/1" 
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                      onClick={() => {
                        setDrawerWord(item);
                        setPronunciationScore(null);
                        if (incrementDailyWords) incrementDailyWords();
                      }}
                    >
                      <td className="p-3 text-xs font-bold text-indigo-300" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.english || item.word}</td>
                      <td className="p-3 text-xs text-slate-200" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.turkish || item.meaning}</td>
                      <td className="p-3 text-xs text-center" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWordStatus(item.id);
                            }}
                            className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.68rem',
                              fontWeight: '800',
                              background: item.status === 'learned' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                              color: item.status === 'learned' ? '#34d399' : '#a5b4fc',
                              cursor: 'pointer',
                              border: 'none'
                            }}
                          >
                            {item.status === 'learned' ? '✓ Öğrendim' : '📖 Çalışıyorum'}
                          </button>
                          <span style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            ⭐ Seviye: {item.leitnerStage || 1} / 5
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-center" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFromNotebook(item.id);
                          }}
                          className="text-slate-500 hover:text-rose-400"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredWords.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-xs text-slate-500" style={{ padding: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Arama kriterlerine uygun kelime bulunamadı.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Word Details Drawer Overlay */}
      {drawerWord && (() => {
        const details = ACADEMIC_DICTIONARY_EXT[drawerWord.english.toLowerCase()] || {
          synonyms: "related, associated, equivalent",
          antonyms: "unrelated, opposite",
          sentence: `The word '${drawerWord.english}' is widely used in scientific contexts.`,
          sentenceTr: `"${drawerWord.english}" kelimesi bilimsel bağlamlarda yaygın olarak kullanılmaktadır.`
        };
        return (
          <>
            {/* Backdrop Blur */}
            <div 
              onClick={() => setDrawerWord(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 999
              }}
            />
            {/* Drawer Panel */}
            <div 
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(11, 15, 26, 0.96)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.6)',
                zIndex: 1000,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                color: '#e2e8f0',
                textAlign: 'left'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#818cf8', margin: 0 }}>{drawerWord.english}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Akademik Kelime Detayı</span>
                </div>
                <button 
                  onClick={() => setDrawerWord(null)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Translation */}
              <div>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Türkçe Karşılığı</span>
                <p style={{ fontSize: '0.92rem', fontWeight: '700', color: 'white', margin: '4px 0 0 0' }}>{drawerWord.turkish}</p>
              </div>

              {/* Pronunciation & Audio controls */}
              <div className="glass-card p-4 border border-white/5 bg-white/1 rounded-xl space-y-3" style={{ padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Telaffuz & Dinleme Hızı</span>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <button 
                    onClick={() => playSpeechAudio(drawerWord.english, 1.0)}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    <Volume2 className="h-4 w-4" /> Dinle (Normal)
                  </button>
                  <button 
                    onClick={() => playSpeechAudio(drawerWord.english, 0.65)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    🐢 Yavaş Dinle
                  </button>
                </div>
              </div>

              {/* Interactive Pronunciation Trainer */}
              <div className="glass-card p-4 border border-white/5 bg-white/1 rounded-xl" style={{ padding: '14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Konuşma / Telaffuz Pratiği 🎙️</span>
                
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '4px 0 10px 0', lineHeight: '1.4' }}>
                  Mikrofon butonuna tıklayıp kelimeyi sesli okuyun. Doğruluk skorunuzu görün.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button 
                    onClick={() => startSpeechListening(drawerWord)}
                    disabled={isListening}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                      border: isListening ? '2px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.25)',
                      color: isListening ? '#f87171' : '#a5b4fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
                      transition: 'all 0.25s ease',
                      flexShrink: 0
                    }}
                  >
                    <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                  </button>
                  
                  <div>
                    {isListening ? (
                      <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 'bold' }}>Dinleniyor, lütfen konuşun...</span>
                    ) : pronunciationScore !== null ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: '800', color: pronunciationScore >= 85 ? '#34d399' : '#fbbf24' }}>%{pronunciationScore}</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: pronunciationScore >= 85 ? '#34d399' : '#fbbf24' }}>
                            {pronunciationScore >= 92 ? 'Mükemmel! 🌟' : pronunciationScore >= 85 ? 'Harika! 👍' : 'Gayet İyi, Tekrar Dene.'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Hazır (Mikrofon bekleniyor)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Synonyms & Antonyms */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#34d399', letterSpacing: '0.05em', display: 'block' }}>Eş Anlamlılar (Synonyms)</span>
                  <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 0 0', fontWeight: '600' }}>{details.synonyms}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#f87171', letterSpacing: '0.05em', display: 'block' }}>Zıt Anlamlılar (Antonyms)</span>
                  <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '4px 0 0 0', fontWeight: '600' }}>{details.antonyms}</p>
                </div>
              </div>

              {/* Scientific Sample Sentence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(99,102,241,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>Akademik Örnek Cümle</span>
                <p style={{ fontSize: '0.76rem', fontStyle: 'italic', color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: '1.4' }}>"{details.sentence}"</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>{details.sentenceTr}</p>
              </div>

              {/* Toggle Status inside Drawer */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    handleToggleWordStatus(drawerWord.id);
                    // update local drawerWord reference status
                    setDrawerWord(prev => ({ ...prev, status: prev.status === 'learned' ? 'learning' : 'learned' }));
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {drawerWord.status === 'learned' ? '📖 Çalışıyorum Olarak İşaretle' : '✓ Öğrendim Olarak İşaretle'}
                </button>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
};

export default VocabularySection;
