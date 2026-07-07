import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Check, Eye, Trash2, ArrowRight, Star, RefreshCw, CheckCircle, Sparkles, Mic, Volume2, X } from 'lucide-react';
import VocabularyListView from './components/VocabularyListView';
import VocabularyLeitner from './components/VocabularyLeitner';
import VocabularyMatching from './components/VocabularyMatching';
import VocabularyMcq from './components/VocabularyMcq';
import VocabularySpelling from './components/VocabularySpelling';
import { VocabularySentenceBuilder, VocabularyDuel } from './components/VocabularyScrambled';
import { VocabularyDictation, VocabularyPronunciation } from './components/VocabularyVoice';

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
  "hypothesis": { synonyms: "theory, assumption, thesis, guess", antonyms: "fact, certainty", sentence: "The scientist formulated a new hypothesis for the study.", sentenceTr: "Bilim insanı çalışma için yeni bir hipotez formüle etti." }
};

const PREP_DRILL_QUESTIONS = [
  { sentence: "The researchers succeeded ________ isolating the mutant gene after months of failure.", answer: "in", tip: "Succeed fiili genellikle 'in' edatı ile kullanılır (succeed in doing something)." },
  { sentence: "Heavy exposure ________ solar radiation can cause genetic mutations in skin cells.", answer: "to", tip: "Exposure ve expose kelimeleri 'to' yönelme edatı ile kullanılır (exposure to something)." },
  { sentence: "Insulin prevents blood sugar levels ________ rising too rapidly after meals.", answer: "from", tip: "Prevent fiili 'prevent someone/something from doing something' kalıbıyla kullanılır." },
  { sentence: "We must compensate ________ the loss of biodiversity by creating protected reserves.", answer: "for", tip: "Compensate fiili bir kaybı veya zararı karşılamak/telafi etmek anlamında 'for' ile kullanılır." },
  { sentence: "The chemical reactions are highly dependent ________ the ambient temperature.", answer: "on", tip: "Dependent (bağımlı) sıfatı 'on' veya 'upon' edatıyla kullanılır." },
  { sentence: "Biologists divide the animal kingdom ________ multiple distinct phyla.", answer: "into", tip: "Divide (bölmek, sınıflandırmak) fiili 'into' edatı alır." },
  { sentence: "The doctor diagnosed the patient ________ a rare chronic immune disorder.", answer: "with", tip: "Diagnose fiili teşhis koymak anlamında 'with' edatıyla kullanılır (diagnose someone with a disease)." }
];

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

  // local lists and index management
  const pool = notebook || [];
  
  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [revealMeaning, setRevealMeaning] = useState(false);
  const [cardOffset, setCardOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const flashcardsList = pool.filter(w => w.status !== 'learned');

  // Matching game state
  const [matchMode, setMatchMode] = useState('turkish'); // 'turkish' or 'synonym'
  const [matchLeft, setMatchLeft] = useState([]);
  const [matchRight, setMatchRight] = useState([]);
  const [matchedWords, setMatchedWords] = useState(new Set()); // set of matched word IDs
  const [activeLeft, setActiveLeft] = useState(null);
  const [activeRight, setActiveRight] = useState(null);
  const [matchErrors, setMatchErrors] = useState(new Set());

  // Spelling test state
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingChecked, setSpellingChecked] = useState(false);
  const [spellingResult, setSpellingResult] = useState(null); // 'correct' or 'wrong'
  const spellingList = pool.filter(w => w.status !== 'learned').slice(0, 10);

  // Dictation state
  const [dictationIndex, setDictationIndex] = useState(0);
  const [dictationInput, setDictationInput] = useState('');
  const [dictationChecked, setDictationChecked] = useState(false);
  const [dictationResult, setDictationResult] = useState(null);
  const dictationList = pool.slice(0, 10);

  // Pronunciation state
  const [prIndex, setPrIndex] = useState(0);
  const [prListening, setPrListening] = useState(false);
  const [prScore, setPrScore] = useState(null);
  const prList = pool.slice(0, 10);

  // Sentence Builder state
  const [sbIndex, setSbIndex] = useState(0);
  const [sbSelected, setSbSelected] = useState([]);
  const [sbScrambled, setSbScrambled] = useState([]);
  const [sbChecked, setSbChecked] = useState(false);
  const [sbResult, setSbResult] = useState(null);
  const sbList = pool.filter(w => ALL_SENTENCES[w.english.toLowerCase()]).slice(0, 10);

  // Prep Drill state
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillSelected, setDrillSelected] = useState(null);
  const [drillChecked, setDrillChecked] = useState(false);
  const [drillScore, setDrillScore] = useState(0);
  const [shuffledDrillOptions, setShuffledDrillOptions] = useState([]);

  // Duel state
  const [duelActive, setDuelActive] = useState(false);
  const [duelTime, setDuelTime] = useState(30);
  const [duelScore, setDuelScore] = useState(0);
  const [duelEngList, setDuelEngList] = useState([]);
  const [duelTrList, setDuelTrList] = useState([]);
  const [duelSelectedEng, setDuelSelectedEng] = useState(null);
  const [duelSelectedTr, setDuelSelectedTr] = useState(null);
  const [duelCompletedPairs, setDuelCompletedPairs] = useState([]);

  // MCQ state
  const [mcqIndex, setMcqIndex] = useState(0);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [mcqSelected, setMcqSelected] = useState(null);
  const [mcqChecked, setMcqChecked] = useState(false);
  const [mcqScore, setMcqScore] = useState(0);
  const [mcqFinished, setMcqFinished] = useState(false);
  const [mcqMode, setMcqMode] = useState('turkish'); // 'turkish' or 'synonym'
  const mcqList = pool.slice(0, 10);

  // Custom Word Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [customEnglish, setCustomEnglish] = useState('');
  const [customTurkish, setCustomTurkish] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('english');
  const [sortOrder, setSortOrder] = useState('asc');

  // Load active spelling word
  useEffect(() => {
    setSpellingInput('');
    setSpellingChecked(false);
    setSpellingResult(null);
  }, [spellingIndex]);

  // Load active dictation word
  useEffect(() => {
    setDictationInput('');
    setDictationChecked(false);
    setDictationResult(null);
    if (subTab === 'dictation' && dictationList[dictationIndex] && playSpeechAudio) {
      setTimeout(() => {
        playSpeechAudio(dictationList[dictationIndex].english);
      }, 500);
    }
  }, [dictationIndex, subTab]);

  // Load active pronunciation word
  useEffect(() => {
    setPrScore(null);
    setPrListening(false);
  }, [prIndex]);

  // Load active sentence builder word
  useEffect(() => {
    setSbSelected([]);
    setSbChecked(false);
    setSbResult(null);
    if (sbList[sbIndex]) {
      const sentence = ALL_SENTENCES[sbList[sbIndex].english.toLowerCase()].en;
      const clean = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      const words = clean.split(' ').sort(() => 0.5 - Math.random());
      setSbScrambled(words);
    }
  }, [sbIndex]);

  // Load active prep drill options
  useEffect(() => {
    if (PREP_DRILL_QUESTIONS[drillIndex]) {
      const opts = ["in", "on", "at", "for", "to", "with", "into", "from", "of", "about", "by", "through"];
      const correct = PREP_DRILL_QUESTIONS[drillIndex].answer;
      const filtered = opts.filter(o => o !== correct).sort(() => 0.5 - Math.random()).slice(0, 3);
      setShuffledDrillOptions([correct, ...filtered].sort(() => 0.5 - Math.random()));
    }
  }, [drillIndex]);

  // Load active MCQ options
  useEffect(() => {
    if (mcqList[mcqIndex]) {
      const correctWord = mcqList[mcqIndex];
      const correctVal = mcqMode === 'synonym'
        ? (SYNONYM_MAP[(correctWord.english || '').toLowerCase().trim()] || correctWord.turkish)
        : correctWord.turkish;
      
      const others = pool
        .filter(w => w.english !== correctWord.english)
        .map(w => mcqMode === 'synonym' ? (SYNONYM_MAP[(w.english || '').toLowerCase().trim()] || w.turkish) : w.turkish)
        .filter(Boolean);
      
      const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 3);
      setMcqOptions([correctVal, ...shuffledOthers].sort(() => 0.5 - Math.random()));
      setMcqSelected(null);
      setMcqChecked(false);
    }
  }, [mcqIndex, mcqMode]);

  // Auto pronounce first card
  useEffect(() => {
    if (subTab === 'flashcards' && flashcardsList[flashcardIndex] && autoPronounceEnabled && playSpeechAudio) {
      playSpeechAudio(flashcardsList[flashcardIndex].english);
    }
  }, [flashcardIndex, subTab, autoPronounceEnabled]);

  // Matching game generator
  const startMatchingGame = () => {
    const list = pool.filter(w => w.status !== 'learned').sort(() => 0.5 - Math.random()).slice(0, 5);
    const lefts = list.map(w => ({ id: w.id, text: w.english }));
    
    let rights;
    if (matchMode === 'synonym') {
      rights = list.map(w => ({ id: w.id, text: SYNONYM_MAP[(w.english || '').toLowerCase().trim()] || w.turkish }));
    } else {
      rights = list.map(w => ({ id: w.id, text: w.turkish }));
    }

    setMatchLeft(lefts.sort(() => 0.5 - Math.random()));
    setMatchRight(rights.sort(() => 0.5 - Math.random()));
    setMatchedWords(new Set());
    setActiveLeft(null);
    setActiveRight(null);
    setMatchErrors(new Set());
  };

  useEffect(() => {
    if (subTab === 'matching' && pool.length > 0) {
      startMatchingGame();
    }
  }, [subTab, matchMode]);

  const handleMatchSelect = (item, side) => {
    if (matchedWords.has(item.id)) return;

    if (side === 'left') {
      if (activeLeft?.id === item.id) {
        setActiveLeft(null);
      } else {
        setActiveLeft(item);
        if (activeRight) {
          checkPair(item, activeRight);
        }
      }
    } else {
      if (activeRight?.id === item.id) {
        setActiveRight(null);
      } else {
        setActiveRight(item);
        if (activeLeft) {
          checkPair(activeLeft, item);
        }
      }
    }
  };

  const checkPair = (left, right) => {
    if (left.id === right.id) {
      setMatchedWords(prev => new Set([...prev, left.id]));
      setActiveLeft(null);
      setActiveRight(null);
      if (handleUpdateWordLeitner) handleUpdateWordLeitner(left.id, true);
      if (recordWordStat) recordWordStat(pool.find(w => w.id === left.id)?.english || '', true);
    } else {
      setMatchErrors(new Set([left.id, right.id]));
      setTimeout(() => {
        setMatchErrors(new Set());
        setActiveLeft(null);
        setActiveRight(null);
      }, 1000);
      if (handleUpdateWordLeitner) handleUpdateWordLeitner(left.id, false);
      if (recordWordStat) recordWordStat(pool.find(w => w.id === left.id)?.english || '', false);
    }
  };

  const handleCardStartDrag = (clientX, clientY) => {
    setIsDraggingCard(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleCardMoveDrag = (clientX, clientY) => {
    if (!isDraggingCard) return;
    setCardOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleCardEndDrag = () => {
    if (!isDraggingCard) return;
    setIsDraggingCard(false);
    
    if (cardOffset.x > 120) {
      handleFlashcardAction(false); // Swipe Right - repeat
    } else if (cardOffset.x < -120) {
      handleFlashcardAction(true); // Swipe Left - learn
    }
    
    setCardOffset({ x: 0, y: 0 });
  };

  const handleFlashcardAction = (isLearned) => {
    const currentWord = flashcardsList[flashcardIndex];
    if (!currentWord) return;

    if (isLearned) {
      handleToggleWordStatus(currentWord.id);
      if (recordWordStat) recordWordStat(currentWord.english, true);
      if (handleUpdateWordLeitner) handleUpdateWordLeitner(currentWord.id, true);
    } else {
      if (recordWordStat) recordWordStat(currentWord.english, false);
      if (handleUpdateWordLeitner) handleUpdateWordLeitner(currentWord.id, false);
    }

    setRevealMeaning(false);
    if (flashcardIndex < flashcardsList.length - 1) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      setFlashcardIndex(0);
    }
  };

  // Spelling Handlers
  const handleCheckSpelling = () => {
    if (spellingChecked) return;
    const currentWord = spellingList[spellingIndex];
    const isCorrect = spellingInput.trim().toLowerCase() === currentWord.english.toLowerCase();
    setSpellingResult(isCorrect ? 'correct' : 'wrong');
    setSpellingChecked(true);
    if (handleUpdateWordLeitner) handleUpdateWordLeitner(currentWord.id, isCorrect);
    if (recordWordStat) recordWordStat(currentWord.english, isCorrect);
    if (incrementDailyQuestions) incrementDailyQuestions();
  };

  const handleSpellingDontKnow = () => {
    if (spellingChecked) return;
    const currentWord = spellingList[spellingIndex];
    setSpellingInput(currentWord.english);
    setSpellingResult('wrong');
    setSpellingChecked(true);
    if (handleUpdateWordLeitner) handleUpdateWordLeitner(currentWord.id, false);
    if (recordWordStat) recordWordStat(currentWord.english, false);
  };

  const handleNextSpelling = () => {
    if (spellingIndex < spellingList.length - 1) {
      setSpellingIndex(prev => prev + 1);
    } else {
      setSubTab('flashcards');
      setSpellingIndex(0);
    }
  };

  // Dictation Handlers
  const handleCheckDictation = () => {
    if (dictationChecked) return;
    const currentWord = dictationList[dictationIndex];
    const isCorrect = dictationInput.trim().toLowerCase() === currentWord.english.toLowerCase();
    setDictationResult(isCorrect ? 'correct' : 'wrong');
    setDictationChecked(true);
    if (incrementDailyQuestions) incrementDailyQuestions();
  };

  const handleNextDictation = () => {
    if (dictationIndex < dictationList.length - 1) {
      setDictationIndex(prev => prev + 1);
    } else {
      setSubTab('flashcards');
      setDictationIndex(0);
    }
  };

  // Sentence Builder Handlers
  const handleCheckSentence = () => {
    if (sbChecked) return;
    const currentWord = sbList[sbIndex];
    const sentence = ALL_SENTENCES[currentWord.english.toLowerCase()].en;
    const cleanCorrect = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const isCorrect = sbSelected.join(' ') === cleanCorrect;
    setSbResult(isCorrect ? 'correct' : 'wrong');
    setSbChecked(true);
    if (incrementDailyQuestions) incrementDailyQuestions();
  };

  const handleSbDontKnow = () => {
    if (sbChecked) return;
    const currentWord = sbList[sbIndex];
    const sentence = ALL_SENTENCES[currentWord.english.toLowerCase()].en;
    const cleanCorrect = sentence.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    setSbSelected(cleanCorrect.split(' '));
    setSbResult('wrong');
    setSbChecked(true);
  };

  const handleNextSentence = () => {
    if (sbIndex < sbList.length - 1) {
      setSbIndex(prev => prev + 1);
    } else {
      setSubTab('flashcards');
      setSbIndex(0);
    }
  };

  // Duel Handlers
  const handleStartDuel = () => {
    const subset = pool.sort(() => 0.5 - Math.random()).slice(0, 5);
    const engs = subset.map(w => ({ id: w.id, val: w.english }));
    const trs = subset.map(w => ({ id: w.id, val: w.turkish }));
    setDuelEngList(engs.sort(() => 0.5 - Math.random()));
    setDuelTrList(trs.sort(() => 0.5 - Math.random()));
    setDuelSelectedEng(null);
    setDuelSelectedTr(null);
    setDuelCompletedPairs([]);
    setDuelScore(0);
    setDuelTime(30);
    setDuelActive(true);
  };

  useEffect(() => {
    if (duelActive && duelTime > 0) {
      const timer = setInterval(() => {
        setDuelTime(t => {
          if (t <= 1) {
            setDuelActive(false);
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [duelActive, duelTime]);

  const handleSelectDuelCard = (side, cardId) => {
    if (!duelActive) return;
    if (side === 'eng') {
      if (duelSelectedEng === cardId) {
        setDuelSelectedEng(null);
      } else {
        setDuelSelectedEng(cardId);
        if (duelSelectedTr) {
          checkDuelMatch(cardId, duelSelectedTr);
        }
      }
    } else {
      if (duelSelectedTr === cardId) {
        setDuelSelectedTr(null);
      } else {
        setDuelSelectedTr(cardId);
        if (duelSelectedEng) {
          checkDuelMatch(duelSelectedEng, cardId);
        }
      }
    }
  };

  const checkDuelMatch = (engId, trId) => {
    if (engId === trId) {
      setDuelScore(s => s + 10);
      setDuelCompletedPairs(prev => [...prev, engId]);
      setDuelSelectedEng(null);
      setDuelSelectedTr(null);
    } else {
      setDuelSelectedEng(null);
      setDuelSelectedTr(null);
    }
  };

  // MCQ Handlers
  const handleMcqSelect = (opt) => {
    if (mcqChecked) return;
    setMcqSelected(opt);
    const correctWord = mcqList[mcqIndex];
    const correctVal = mcqMode === 'synonym'
      ? (SYNONYM_MAP[(correctWord.english || '').toLowerCase().trim()] || correctWord.turkish)
      : correctWord.turkish;
    const isCorrect = opt === correctVal;
    
    if (isCorrect) setMcqScore(s => s + 1);
    setMcqChecked(true);
    if (handleUpdateWordLeitner) handleUpdateWordLeitner(correctWord.id, isCorrect);
    if (recordWordStat) recordWordStat(correctWord.english, isCorrect);
    if (incrementDailyQuestions) incrementDailyQuestions();
  };

  const handleNextMcq = () => {
    if (mcqIndex < mcqList.length - 1) {
      setMcqIndex(prev => prev + 1);
    } else {
      setMcqFinished(true);
    }
  };

  // Speech trainer callbacks
  const startSpeechRecognitionPr = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Tarayıcınız ses tanımayı desteklemiyor. Chrome veya Edge kullanın.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setPrListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      const target = prList[prIndex].english.toLowerCase().trim();
      const spoken = speechToText.toLowerCase().trim();
      
      let score = 0;
      if (spoken === target) {
        score = 100;
      } else {
        const diff = Math.abs(target.length - spoken.length);
        score = Math.max(0, 100 - (diff * 15));
      }
      setPrScore(score);
      setPrListening(false);
    };

    recognition.onerror = () => {
      setPrListening(false);
    };
  };

  const startSpeechListening = (wordObj) => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase().trim();
      const target = wordObj.english.toLowerCase().trim();
      let score = 0;
      if (spoken === target) {
        score = 100;
      } else {
        const diff = Math.abs(target.length - spoken.length);
        score = Math.max(0, 100 - (diff * 15));
      }
      setPronunciationScore(score);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  // Filter & Sort table items
  const filteredWords = pool
    .filter(w => {
      const eng = (w.english || w.word || '').toLowerCase();
      const tr = (w.turkish || w.meaning || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = eng.includes(query) || tr.includes(query);
      const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortField === 'english') {
        valA = (a.english || '').toLowerCase();
        valB = (b.english || '').toLowerCase();
      } else if (sortField === 'correct') {
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

  // Match style generator for Matching game
  const getMatchBtnStyle = (isMatched, isActive, isErr, side) => {
    let defaultBg = 'rgba(255, 255, 255, 0.03)';
    let defaultBorder = '1px solid rgba(255, 255, 255, 0.08)';
    let defaultColor = '#e2e8f0';

    if (side === 'left') {
      defaultBg = 'rgba(99, 102, 241, 0.05)';
      defaultBorder = '1px solid rgba(99, 102, 241, 0.2)';
      defaultColor = '#c7d2fe';
    } else if (side === 'right') {
      if (matchMode === 'synonym') {
        defaultBg = 'rgba(139, 92, 246, 0.05)';
        defaultBorder = '1px solid rgba(139, 92, 246, 0.2)';
        defaultColor = '#ddd6fe';
      } else {
        defaultBg = 'rgba(16, 185, 129, 0.05)';
        defaultBorder = '1px solid rgba(16, 185, 129, 0.2)';
        defaultColor = '#a7f3d0';
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
        opacity: 1.0,
        background: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
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

      {/* Select Dropdown for Minigames / Sections */}
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

      {/* FLASHCARDS */}
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
                      e.preventDefault();
                      const touch = e.touches[0];
                      handleCardStartDrag(touch.clientX, touch.clientY);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      handleCardMoveDrag(touch.clientX, touch.clientY);
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleCardEndDrag();
                    }}
                    onClick={() => setRevealMeaning(r => !r)}
                    style={{
                      touchAction: 'none',
                      userSelect: 'none',
                      transform: `translate(${cardOffset.x}px, ${cardOffset.y * 0.15}px) rotate(${cardOffset.x * 0.05}deg)`,
                      transition: isDraggingCard ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      cursor: isDraggingCard ? 'grabbing' : 'grab',
                      position: 'relative'
                    }}
                  >
                    {cardOffset.x > 15 && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '20px',
                        background: `rgba(239, 68, 68, ${Math.min(0.7, cardOffset.x / 140)})`, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '900', zIndex: 100, pointerEvents: 'none'
                      }}>
                        TEKRAR ÇALIŞACAĞIM ✕
                      </div>
                    )}
                    {cardOffset.x < -15 && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '20px',
                        background: `rgba(16, 185, 129, ${Math.min(0.7, -cardOffset.x / 140)})`, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: '900', zIndex: 100, pointerEvents: 'none'
                      }}>
                        BİLİYORUM ✓
                      </div>
                    )}
                    <div className="flip-card-inner">
                      {/* Front */}
                      <div className="flip-card-front">
                        <div className="space-y-2 relative w-full h-full flex flex-col justify-center items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (playSpeechAudio) playSpeechAudio(currentWord.english);
                            }}
                            style={{
                              position: 'absolute', top: '-15px', right: '5px', padding: '8px', borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#a5b4fc', zIndex: 10
                            }}
                            title="Telaffuz Dinle"
                          >
                            <Volume2 className="h-4 w-4" />
                          </button>
                          
                          <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ fontSize: '1.8rem', color: '#f8fafc', margin: '0 0 8px 0' }}>
                            {currentWord.english}
                          </h3>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px' }}>
                            {currentWord.type && (
                              <span className="word-badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', fontSize: '0.62rem', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                                {formatWordType(currentWord.type)}
                              </span>
                            )}
                            {currentWord.priority && (
                              <span className="word-badge" style={{ 
                                background: currentWord.priority === 'Çok Yüksek Sıklık' ? 'rgba(239, 68, 68, 0.12)' : (currentWord.priority === 'Yüksek Sıklık' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)'), 
                                color: currentWord.priority === 'Çok Yüksek Sıklık' ? '#f87171' : (currentWord.priority === 'Yüksek Sıklık' ? '#fbbf24' : '#a5b4fc'), 
                                fontSize: '0.62rem', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px'
                              }}>
                                🎯 {currentWord.priority}
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Anlamı Görmek İçin Tıkla</p>
                          {currentWord.sentence_en && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic', maxWidth: '320px', margin: '12px auto 0 auto', lineHeight: '1.4' }}>
                              "{currentWord.sentence_en}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Back */}
                      <div className="flip-card-back">
                        <div className="space-y-2 relative w-full h-full flex flex-col justify-center items-center">
                          <h3 className="text-xl font-bold text-indigo-400 font-heading" style={{ fontSize: '1.6rem', color: '#818cf8', margin: '0 0 8px 0' }}>
                            {currentWord.turkish}
                          </h3>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '8px' }}>
                            {currentWord.type && (
                              <span className="word-badge" style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', fontSize: '0.62rem', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                                {formatWordType(currentWord.type)}
                              </span>
                            )}
                            {currentWord.priority && (
                              <span className="word-badge" style={{ 
                                background: currentWord.priority === 'Çok Yüksek Sıklık' ? 'rgba(239, 68, 68, 0.12)' : (currentWord.priority === 'Yüksek Sıklık' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)'), 
                                color: currentWord.priority === 'Çok Yüksek Sıklık' ? '#f87171' : (currentWord.priority === 'Yüksek Sıklık' ? '#fbbf24' : '#a5b4fc'), 
                                fontSize: '0.62rem', border: '1px solid rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px'
                              }}>
                                🎯 {currentWord.priority}
                              </span>
                            )}
                          </div>
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

      {/* MATCHING */}
      {subTab === 'matching' && (
        <VocabularyMatching
          matchMode={matchMode}
          setMatchMode={setMatchMode}
          matchLeft={matchLeft}
          matchRight={matchRight}
          matchedWords={matchedWords}
          activeLeft={activeLeft}
          activeRight={activeRight}
          matchErrors={matchErrors}
          handleMatchSelect={handleMatchSelect}
          getMatchBtnStyle={getMatchBtnStyle}
          startMatchingGame={startMatchingGame}
        />
      )}

      {/* SPELLING */}
      {subTab === 'spelling' && (
        <VocabularySpelling
          spellingList={spellingList}
          spellingIndex={spellingIndex}
          spellingInput={spellingInput}
          setSpellingInput={setSpellingInput}
          spellingChecked={spellingChecked}
          spellingResult={spellingResult}
          handleCheckSpelling={handleCheckSpelling}
          handleSpellingDontKnow={handleSpellingDontKnow}
          handleNextSpelling={handleNextSpelling}
          setSubTab={setSubTab}
          playSpeechAudio={playSpeechAudio}
        />
      )}

      {/* DICTATION */}
      {subTab === 'dictation' && (
        <VocabularyDictation
          dictationList={dictationList}
          dictationIndex={dictationIndex}
          dictationInput={dictationInput}
          setDictationInput={setDictationInput}
          dictationChecked={dictationChecked}
          dictationResult={dictationResult}
          handleCheckDictation={handleCheckDictation}
          handleNextDictation={handleNextDictation}
          playSpeechAudio={playSpeechAudio}
          setSubTab={setSubTab}
        />
      )}

      {/* PRONUNCIATION */}
      {subTab === 'pronunciation' && (
        <VocabularyPronunciation
          prList={prList}
          prIndex={prIndex}
          playSpeechAudio={playSpeechAudio}
          startSpeechRecognitionPr={startSpeechRecognitionPr}
          prListening={prListening}
          prScore={prScore}
          setPrScore={setPrScore}
          setPrIndex={setPrIndex}
          setSubTab={setSubTab}
        />
      )}

      {/* SENTENCE BUILDER */}
      {subTab === 'sentenceBuilder' && (
        <VocabularySentenceBuilder
          sbList={sbList}
          sbIndex={sbIndex}
          sbSelected={sbSelected}
          setSbSelected={setSbSelected}
          sbScrambled={sbScrambled}
          sbChecked={sbChecked}
          sbResult={sbResult}
          handleSbDontKnow={handleSbDontKnow}
          handleCheckSentence={handleCheckSentence}
          handleNextSentence={handleNextSentence}
          setSubTab={setSubTab}
        />
      )}

      {/* DUEL */}
      {subTab === 'duel' && (
        <VocabularyDuel
          duelActive={duelActive}
          duelTime={duelTime}
          duelScore={duelScore}
          handleStartDuel={handleStartDuel}
          duelEngList={duelEngList}
          duelTrList={duelTrList}
          duelCompletedPairs={duelCompletedPairs}
          duelSelectedEng={duelSelectedEng}
          duelSelectedTr={duelSelectedTr}
          handleSelectDuelCard={handleSelectDuelCard}
        />
      )}

      {/* MCQ */}
      {subTab === 'mcq' && (
        <VocabularyMcq
          mcqList={mcqList}
          mcqFinished={mcqFinished}
          mcqIndex={mcqIndex}
          mcqOptions={mcqOptions}
          mcqSelected={mcqSelected}
          mcqChecked={mcqChecked}
          mcqScore={mcqScore}
          mcqMode={mcqMode}
          SYNONYM_MAP={SYNONYM_MAP}
          handleMcqSelect={handleMcqSelect}
          getMcqBtnStyle={getMcqBtnStyle}
          handleNextMcq={handleNextMcq}
          setSubTab={setSubTab}
        />
      )}

      {/* PREPOSITION DRILLS */}
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
                              width: '18px', height: '18px', borderRadius: '50%', 
                              border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.2)'}`, 
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.62rem', color: isSelected ? 'white' : 'transparent',
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

      {/* LEITNER */}
      {subTab === 'leitner' && (
        <VocabularyLeitner
          pool={pool}
          setDrawerWord={setDrawerWord}
        />
      )}

      {/* TABLE LIST VIEW */}
      {subTab === 'table' && (
        <VocabularyListView
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          customEnglish={customEnglish}
          setCustomEnglish={setCustomEnglish}
          customTurkish={customTurkish}
          setCustomTurkish={setCustomTurkish}
          handleAddCustomWord={handleAddCustomWord}
          filteredWords={filteredWords}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setDrawerWord={setDrawerWord}
          setPronunciationScore={setPronunciationScore}
          incrementDailyWords={incrementDailyWords}
          handleToggleWordStatus={handleToggleWordStatus}
          handleDeleteFromNotebook={handleDeleteFromNotebook}
          formatWordType={formatWordType}
        />
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
            <div 
              onClick={() => setDrawerWord(null)}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 999 }}
            />
            <div 
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '420px',
                background: 'rgba(11, 15, 26, 0.96)', backdropFilter: 'blur(20px)', borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.6)', zIndex: 1000, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', color: '#e2e8f0', textAlign: 'left'
              }}
            >
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

              <div>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>Türkçe Karşılığı</span>
                <p style={{ fontSize: '0.92rem', fontWeight: '700', color: 'white', margin: '4px 0 0 0' }}>{drawerWord.turkish}</p>
              </div>

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
                      width: '46px', height: '46px', borderRadius: '50%',
                      background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                      border: isListening ? '2px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.25)',
                      color: isListening ? '#f87171' : '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.4)' : 'none',
                      transition: 'all 0.25s ease', flexShrink: 0
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(99,102,241,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.1)' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>Akademik Örnek Cümle</span>
                <p style={{ fontSize: '0.76rem', fontStyle: 'italic', color: '#e2e8f0', margin: '4px 0 0 0', lineHeight: '1.4' }}>"{details.sentence}"</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: '1.4' }}>{details.sentenceTr}</p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    handleToggleWordStatus(drawerWord.id);
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
