import { useState, useEffect, useRef } from 'react';
import { playCorrectSound, playIncorrectSound, playGoalSound } from '../utils/audio';
import achievementsData from '@dataset/yokdil/achievements.json';

import fallbackExamsFen from '@dataset/yokdil/fen/cikmis_sinavlar/sinav_listesi.json';
import fallbackExamsSosyal from '@dataset/yokdil/sosyal/cikmis_sinavlar/sinav_listesi.json';
import fallbackExamsSaglik from '@dataset/yokdil/saglik/cikmis_sinavlar/sinav_listesi.json';

import fallbackVocabFen from '@dataset/yokdil/fen/gelismis_kelime_kampi/akademik_kelime_listesi.json';
import fallbackVocabSosyal from '@dataset/yokdil/sosyal/gelismis_kelime_kampi/akademik_kelime_listesi.json';
import fallbackVocabSaglik from '@dataset/yokdil/saglik/gelismis_kelime_kampi/akademik_kelime_listesi.json';

import fallbackDictFen from '@dataset/yokdil/fen/dictionary.json';
import fallbackDictSosyal from '@dataset/yokdil/sosyal/dictionary.json';
import fallbackDictSaglik from '@dataset/yokdil/saglik/dictionary.json';

const ALL_TABS = {
  'dashboard': { label: 'Ana Sayfa', icon: 'fa-solid fa-house' },
  'vocabulary': { label: 'Kelime Kampı', icon: 'fa-solid fa-book' },
  'camp-vocab': { label: 'Gelişmiş Kelime', icon: 'fa-solid fa-calendar-days' },
  'camp-custom-vocab': { label: 'Özel Kelime', icon: 'fa-solid fa-file-excel' },
  'camp-grammar': { label: 'Gramer Kampı', icon: 'fa-solid fa-book-bookmark' },
  'book-exercises': { label: 'YDS Kitap', icon: 'fa-solid fa-book-open' },
  'tests': { label: 'Testler', icon: 'fa-solid fa-pen-to-square' },
  'lectures': { label: 'Konu Anlatımı', icon: 'fa-solid fa-graduation-cap' },
  'paragraphs': { label: 'Paragraflar', icon: 'fa-solid fa-file-lines' },
  'smart-study': { label: 'Akıllı Çalışma', icon: 'fa-solid fa-bolt' },
  'mistakes': { label: 'Hata Kutusu', icon: 'fa-solid fa-circle-exclamation' },
  'performance': { label: 'Performans', icon: 'fa-solid fa-chart-line' },
  'achievements': { label: 'Başarımlar', icon: 'fa-solid fa-trophy' },
  'pet': { label: 'Evcil Hayvan', icon: 'fa-solid fa-paw' },
  'games': { label: 'Mini Oyunlar', icon: 'fa-solid fa-gamepad' },
  'settings': { label: 'Ayarlar', icon: 'fa-solid fa-gear' },
  'more-mobile': { label: 'Daha Fazla', icon: 'fa-solid fa-bars' }
};

const lectureModules = import.meta.glob('../../Dataset/yokdil/*/konu_anlatimi/*.md', { query: '?raw', import: 'default' });
const examDetailModules = import.meta.glob('../../Dataset/yokdil/*/cikmis_sinavlar/*.json');

const getLectureContent = async (category, filename) => {
  const targetSubstr = `${category}/konu_anlatimi/${filename}`;
  let key = Object.keys(lectureModules).find(k => k.includes(targetSubstr));
  if (!key && category !== 'fen') {
    const fallbackSubstr = `fen/konu_anlatimi/${filename}`;
    key = Object.keys(lectureModules).find(k => k.includes(fallbackSubstr));
  }
  if (key) {
    const loader = lectureModules[key];
    const content = await loader();
    return content;
  }
  return '';
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' || 
  window.location.hostname.startsWith('192.168.') || 
  window.location.hostname.startsWith('10.') || 
  window.location.hostname.startsWith('172.')
    ? `${window.location.protocol}//${window.location.hostname}:5000`
    : window.location.origin
);

const ROOM_BACKGROUNDS = {
  cozy: {
    name: 'Cozy Cam 🏠',
    gradient: 'linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.6))',
    border: 'rgba(255,255,255,0.05)'
  },
  library: {
    name: '📚 Kütüphane',
    gradient: 'linear-gradient(135deg, rgba(69,26,3,0.5) 0%, rgba(30,27,75,0.6) 100%)',
    border: 'rgba(217,119,6,0.15)'
  },
  science: {
    name: '🔬 Fen Lab',
    gradient: 'linear-gradient(135deg, rgba(2,44,34,0.5) 0%, rgba(15,23,42,0.6) 100%)',
    border: 'rgba(16,185,129,0.15)'
  },
  history: {
    name: '🏛️ Antik Harabeler',
    gradient: 'linear-gradient(135deg, rgba(124,45,18,0.5) 0%, rgba(76,29,149,0.6) 100%)',
    border: 'rgba(249,115,22,0.15)'
  },
  medical: {
    name: '🏥 Sağlık Lab',
    gradient: 'linear-gradient(135deg, rgba(15,118,110,0.5) 0%, rgba(15,23,42,0.6) 100%)',
    border: 'rgba(13,148,136,0.15)'
  },
  space: {
    name: '🚀 Uzay İstasyonu',
    gradient: 'linear-gradient(135deg, rgba(49,16,132,0.5) 0%, rgba(3,0,30,0.6) 100%)',
    border: 'rgba(139,92,246,0.15)'
  }
};

const getTopicName = (key) => {
  const mapping = {
    vocab: "Kelime Bilgisi (Vocabulary)",
    tenses: "Dilbilgisi & Zamanlar (Grammar & Tenses)",
    preps: "Edat Öbekleri (Prepositional Phrases)",
    conjs: "Bağlaçlar (Conjunctions)",
    completion: "Cümle Tamamlama (Sentence Completion)",
    trans_en_tr: "Çeviri Soruları (İngilizce - Türkçe)",
    trans_tr_en: "Çeviri Soruları (Türkçe - İngilizce)",
    paragraph_insertion: "Paragraf Tamamlama (Paragraph Completion)",
    irrelevant_sentence: "Anlam Akışını Bozan Cümle (Irrelevant Sentence)",
    reading: "Paragraf Okuduğunu Anlama (Reading Comprehension)"
  };
  return mapping[key] || "Genel Çalışma";
};

const safeJsonParse = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing localStorage key "${key}":`, e);
    try {
      localStorage.removeItem(key);
    } catch (_) {}
    return fallback;
  }
};

export const useAppState = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    const local = localStorage.getItem('yokdil_user');
    if (local && local !== 'null') {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    const defaultUser = { name: 'user', username: 'user', id: '1' };
    localStorage.setItem('yokdil_user', JSON.stringify(defaultUser));
    return defaultUser;
  });
  const [token, setToken] = useState(() => localStorage.getItem('yokdil_token') || 'null');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [chatbotName, setChatbotName] = useState(() => localStorage.getItem('yokdil_chatbot_name') || 'Bilge Asistan');
  const [authFullName, setAuthFullName] = useState('');
  const [deviceLinkInfo, setDeviceLinkInfo] = useState(null);
  const [showDeviceLinkModal, setShowDeviceLinkModal] = useState(false);
  const [customAlert, setCustomAlert] = useState(null); // { title: string, message: string, type: 'success' | 'info' | 'error' }
  const [customConfirm, setCustomConfirm] = useState(null); // { title: string, message: string, onConfirm: () => void, onCancel?: () => void }

  // Navigation & Config States
  const getInitialHashState = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/') && hash !== '#/landing') {
      const parts = hash.split('/');
      if (parts.length >= 3) {
        let tab = parts[2];
        if (tab === 'camp') {
          if (hash.includes('cikmis_kelimeler') || hash.includes('cikmis')) {
            tab = 'vocabulary';
          } else if (hash.includes('vocabulary')) {
            tab = 'camp-vocab';
          } else if (hash.includes('grammar')) {
            tab = 'camp-grammar';
          } else {
            tab = 'camp-vocab';
          }
        }
        return {
          category: parts[1],
          tab: tab,
          quiz: parts.includes('quiz')
        };
      }
    }
    return { category: null, tab: 'dashboard', quiz: false };
  };

  const initialHashState = getInitialHashState();

  const [activeTab, setActiveTab] = useState(initialHashState.tab);
  const [vocabTrack, setVocabTrack] = useState('anlam');
  const [bookSelectedDay, setBookSelectedDay] = useState(null);
  const [bookCompletedDays, setBookCompletedDays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('completed_yds_days') || '[]');
    } catch (e) {
      return [];
    }
  });
  const [selectedTestTab, setSelectedTestTab] = useState('years'); // 'years', 'topics'
  const [theme, setTheme] = useState(() => localStorage.getItem('yokdil_theme') || 'theme-dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('yokdil_sidebar_collapsed') === 'true');
  const [mobileTabsConfig, setMobileTabsConfig] = useState(() => {
    const saved = safeJsonParse('yokdil_mobile_tabs_config', ['dashboard', 'camp-vocab', 'lectures', 'smart-study', 'more-mobile']);
    if (!Array.isArray(saved) || saved.length < 5) {
      return ['dashboard', 'camp-vocab', 'lectures', 'smart-study', 'more-mobile'];
    }
    return saved;
  });
  const [mobileNavEditMode, setMobileNavEditMode] = useState(false);
  const [customizingSlotIndex, setCustomizingSlotIndex] = useState(null);
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false);

  useEffect(() => {
    localStorage.setItem('yokdil_sidebar_collapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const [fontSize, setFontSize] = useState(() => localStorage.getItem('yokdil_font_size') || 'base');
  const [sepiaActive, setSepiaActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [spacedRepetitionModalWord, setSpacedRepetitionModalWord] = useState(null);

  // Data States
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialHashState.category);
  const [quizActive, setQuizActive] = useState(initialHashState.quiz);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizMode, setQuizMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'custom') {
      localStorage.setItem('yokdil_last_standard_category', selectedCategory);
    }
  }, [selectedCategory]);

  const handleSetActiveTab = (tabName) => {
    if (selectedCategory === 'custom' && tabName !== 'camp-vocab') {
      const lastCat = localStorage.getItem('yokdil_last_standard_category') || 'fen';
      setSelectedCategory(lastCat);
    }
    setActiveTab(tabName);
  };

  // Gamification & Shop States
  const [confetti, setConfetti] = useState([]);
  const [mascotState, setMascotState] = useState('neutral');
  const [mascotSpeech, setMascotSpeech] = useState("YÖKDİL'e hazır mısın?");
  const [mistakes, setMistakes] = useState(() => safeJsonParse('yokdil_mistakes', []));
  const [gems, setGems] = useState(() => parseInt(localStorage.getItem('yokdil_gems') || '0', 10));
  const [ownedOutfits, setOwnedOutfits] = useState(() => safeJsonParse('yokdil_owned_outfits', []));
  const [activeOutfits, setActiveOutfits] = useState(() => safeJsonParse('yokdil_active_outfits', []));
  const [streakFreezeActive, setStreakFreezeActive] = useState(() => localStorage.getItem('yokdil_streak_freeze') === 'true');
  const [petXp, setPetXp] = useState(() => parseInt(localStorage.getItem('yokdil_pet_xp') || '0', 10));
  const [petLevel, setPetLevel] = useState(() => parseInt(localStorage.getItem('yokdil_pet_level') || '1', 10));
  const [pendingLevelUp, setPendingLevelUp] = useState(null);
  const [petConfig, setPetConfig] = useState(() => {
    const saved = localStorage.getItem('yokdil_custom_pet');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          name: 'Bilge',
          background: 'cozy',
          color: '',
          ...parsed
        };
      } catch (e) { }
    }
    return {
      animalId: 'chick',
      hat: 'none',
      glasses: 'none',
      clothing: 'none',
      item: 'none',
      name: 'Bilge',
      background: 'cozy',
      color: ''
    };
  });

  const awardPetXp = (amount) => {
    let nextXp = petXp + amount;
    let nextLevel = petLevel;
    let reqXp = nextLevel * 10000; // 50 times slower (200 * 50 = 10000)
    while (nextXp >= reqXp) {
      nextXp -= reqXp;
      nextLevel += 1;
      setPendingLevelUp({ oldLevel: petLevel, newLevel: nextLevel });
      reqXp = nextLevel * 10000;
    }
    setPetXp(nextXp);
    setPetLevel(nextLevel);
    localStorage.setItem('yokdil_pet_xp', String(nextXp));
    localStorage.setItem('yokdil_pet_level', String(nextLevel));
  };

  // Word stats for spacing repetition algorithm
  const [wordStats, setWordStats] = useState(() => safeJsonParse('yokdil_word_stats', {}));
  const [questionStats, setQuestionStats] = useState(() => safeJsonParse('yokdil_question_stats', {}));
  const [examQuestionSort, setExamQuestionSort] = useState('number'); // 'number', 'wrong', 'correct'
  const [examQuestionSortDir, setExamQuestionSortDir] = useState('asc'); // 'asc', 'desc'
  const [examDetailTab, setExamDetailTab] = useState('list'); // 'list', 'performance'
  const [lectureProgress, setLectureProgress] = useState(() => safeJsonParse('yokdil_lecture_progress', {}));
  const [grammarNotes, setGrammarNotes] = useState(() => safeJsonParse('yokdil_grammar_notes', []));
  const [achievementCategoryFilter, setAchievementCategoryFilter] = useState('all');
  const [achievementStatusFilter, setAchievementStatusFilter] = useState('all');

  // User Practice States
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [preferTextView, setPreferTextView] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(1);

  // Exam Mode States
  const [examMode, setExamMode] = useState(false);
  const [examSecondsLeft, setExamSecondsLeft] = useState(180 * 60);
  const [examRunning, setExamRunning] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const timerIntervalRef = useRef(null);
  const examDateInputRef = useRef(null);

  const [questionTimeSpent, setQuestionTimeSpent] = useState(0);

  useEffect(() => {
    const nativeAlert = window.alert;
    window.alert = (msg) => {
      if (!msg) return;
      const isError = msg.toLowerCase().includes('hatalı') || 
                      msg.toLowerCase().includes('yanlış') || 
                      msg.toLowerCase().includes('yetersiz') || 
                      msg.toLowerCase().includes('başarısız') ||
                      msg.toLowerCase().includes('hata');
      const isSuccess = msg.toLowerCase().includes('tebrikler') || 
                        msg.toLowerCase().includes('doğru') || 
                        msg.toLowerCase().includes('başarılı') || 
                        msg.toLowerCase().includes('harika');
      
      setCustomAlert({
        title: isSuccess ? '🎉 Tebrikler!' : (isError ? '⚠️ Hata / Uyarı' : 'ℹ️ Bilgi'),
        message: msg,
        type: isError ? 'error' : (isSuccess ? 'success' : 'info')
      });
    };
    return () => {
      window.alert = nativeAlert;
    };
  }, []);

  // Persist selectedExam ID
  useEffect(() => {
    if (selectedExam) {
      localStorage.setItem('yokdil_selected_exam_id', selectedExam.id);
    } else {
      localStorage.removeItem('yokdil_selected_exam_id');
    }
  }, [selectedExam]);

  // Persist current quiz index
  useEffect(() => {
    if (selectedExam && currentQuizIndex) {
      localStorage.setItem(`yokdil_current_quiz_index_${selectedExam.id}`, String(currentQuizIndex));
    }
  }, [currentQuizIndex, selectedExam]);

  // Persist quiz questions list
  useEffect(() => {
    if (selectedExam && quizQuestions && quizQuestions.length > 0) {
      localStorage.setItem(`yokdil_quiz_questions_${selectedExam.id}`, JSON.stringify(quizQuestions));
    }
  }, [quizQuestions, selectedExam]);

  // Restore selected exam and session on refresh
  useEffect(() => {
    const restoreExam = async () => {
      const savedExamId = localStorage.getItem('yokdil_selected_exam_id');
      const category = selectedCategory || localStorage.getItem('yokdil_last_standard_category') || 'fen';
      if (savedExamId && !selectedExam) {
        setLoading(true);
        const suffix = `yokdil/${category}/cikmis_sinavlar/${savedExamId}.json`;
        const foundKey = Object.keys(examDetailModules).find(k => k.endsWith(suffix));
        if (foundKey) {
          try {
            const loader = examDetailModules[foundKey];
            const module = await loader();
            const fullExam = module.default || module;
            setSelectedExam(fullExam);
            
            // Restore answers and flagged states
            setAnswers(JSON.parse(localStorage.getItem(`answers_${fullExam.id}`)) || {});
            setFlagged(JSON.parse(localStorage.getItem(`flags_${fullExam.id}`)) || {});
            
            // Restore quiz index
            const savedIndex = localStorage.getItem(`yokdil_current_quiz_index_${fullExam.id}`);
            if (savedIndex) {
              setCurrentQuizIndex(parseInt(savedIndex, 10));
            }
            
            // Restore quiz questions list
            const savedQuestions = localStorage.getItem(`yokdil_quiz_questions_${fullExam.id}`);
            if (savedQuestions) {
              setQuizQuestions(JSON.parse(savedQuestions));
            } else {
              setQuizQuestions(fullExam.questions.map((_, i) => i + 1));
            }
          } catch (e) {
            console.error("Sınav geri yüklenirken hata oluştu:", e);
          }
        }
        setLoading(false);
      }
    };
    restoreExam();
  }, [selectedCategory, selectedExam]);

  useEffect(() => {
    let interval = null;
    if (quizActive && !examSubmitted) {
      interval = setInterval(() => {
        setQuestionTimeSpent(prev => prev + 1);
      }, 1000);
    } else {
      setQuestionTimeSpent(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizActive, examSubmitted, currentQuizIndex]);

  const FALLBACK_LECTURES = [
    { id: "01_Prepositions_Time_Place", title: "01. Zaman ve Yer Edatları (Prepositions of Time & Place)", description: "YÖKDİL'de sıklıkla sorgulanan zaman ve yer bildiren edatlar (in, on, at vb.) ve kullanımları." },
    { id: "02_Prepositions_Collocations", title: "02. Edat Kombinasyonları (Prepositions & Collocations)", description: "Fiil, sıfat ve isimlerle birlikte kullanılan sabit edat yapıları ve akademik eşleşmeler." },
    { id: "03_Tenses_Present_Past", title: "03. Zamanlar - Şimdiki ve Geçmiş Zaman (Tenses: Present & Past)", description: "Academic İngilizce cümlelerinde present ve past zaman yapıları, ipucu veren zaman zarfları." },
    { id: "04_Tenses_Perfect_Future", title: "04. Zamanlar - Yakın Geçmiş ve Gelecek Zaman (Tenses: Perfect & Future)", description: "Perfect tenses (have/has V3, had V3) ve future zaman yapıları, YÖKDİL soru tipleri." },
    { id: "05_Active_Passive_Voice", title: "05. Etken ve Edilgen Çatı (Active & Passive Voice)", description: "Akademik makalelerde sıkça kullanılan edilgen (passive) anlatımlar ve causatives (ettirgen) yapılar." },
    { id: "06_Conjunctions_Contrast", title: "06. Zıtlık Bağlaçları (Conjunctions of Contrast)", description: "YÖKDİL sınavının en önemli konusu: Zıtlık bildiren bağlaçlar (although, despite, but, however vb.)." },
    { id: "07_Conjunctions_Cause_Effect", title: "07. Sebep-Sonuç Bağlaçları (Conjunctions of Cause & Effect)", description: "Nedensellik ve sonuç bildiren bağlaçlar (because, therefore, thus, since, as a result vb.)." },
    { id: "08_Relative_Clauses", title: "08. Sıfat Cümlecikleri & Kısaltmalar (Relative Clauses)", description: "İsimleri niteleyen sıfat cümlecikleri (who, which, that, whose) ve kısaltma (reduction) kuralları." },
    { id: "09_Modals_Semi_Modals", title: "09. Kip Belirteçleri (Modals & Semi-Modals)", description: "Kabiliyet, gereklilik, olasılık ve tavsiye bildiren yapılar (must, should, might, would rather, must have V3 vb.)." },
    { id: "10_Conditionals_Wish_Clauses", title: "10. Koşul Cümleleri & Keşkeler (Conditionals & Wish Clauses)", description: "Koşul belirten yapılar (Type 0, 1, 2, 3, Mixed Conditionals), wish clauses ve as if/as though kullanımları." },
    { id: "11_Noun_Clauses_Subjunctives", title: "11. İsim Cümlecikleri & Dilek Kipi (Noun Clauses & Subjunctives)", description: "Cümlede isim görevi gören yan cümlecikler (that, whether, wh- clauses) ve subjunctive yapılar." },
    { id: "12_Gerunds_Infinitives", title: "12. Fiilimsiler (Gerunds & Infinitives)", description: "Fiillerden sonra to V1 veya V-ing gelme kuralları, akademik fiil kalıpları ve kısaltmalar." },
    { id: "13_Adjectives_Adverbs_Comparisons", title: "13. Sıfatlar, Zarflar & Karşılaştırmalar (Adjectives, Adverbs & Comparisons)", description: "Sıfat ve zarfların cümle içi görevleri, karşılaştırma kalıpları (as...as, more...than, double comparatives)." }
  ];

  // Lectures States
  const [lecturesList, setLecturesList] = useState(FALLBACK_LECTURES);
  const [activeLecture, setActiveLecture] = useState(null);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [isStudyingActive, setIsStudyingActive] = useState(false);

  // Dictionary / Translator States
  const [selectedText, setSelectedText] = useState('');
  const [translationResult, setTranslationResult] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [showPopover, setShowPopover] = useState(false);

  // Notebook (Vocabulary) & Flashcards States
  const [notebook, setNotebook] = useState([]);
  const [vocabPracticeList, setVocabPracticeList] = useState([]);

  // Dictionary list state for quizzes & games
  const [dictionaryList, setDictionaryList] = useState([]);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('yokdil_sound_enabled') !== 'false');
  // Gamification States (Streaks & Daily Goals)
  const [studyStreak, setStudyStreak] = useState(1);
  const [dailyQuestionsSolved, setDailyQuestionsSolved] = useState(0);
  const [dailyWordsStudied, setDailyWordsStudied] = useState(0);
  const [dailyLecturesStudied, setDailyLecturesStudied] = useState(0);
  const [dailyQuestionGoal, setDailyQuestionGoal] = useState(parseInt(localStorage.getItem('yokdil_goal_target_questions') || '20', 10));
  const [dailyWordGoal, setDailyWordGoal] = useState(parseInt(localStorage.getItem('yokdil_goal_target_words') || '10', 10));
  const [purchasedOutfits, setPurchasedOutfits] = useState(() => safeJsonParse('yokdil_purchased_outfits', ["default"]));
  const [activeOutfit, setActiveOutfit] = useState(() => localStorage.getItem('yokdil_active_outfit') || 'default');
  const [autoPronounceEnabled, setAutoPronounceEnabled] = useState(localStorage.getItem('yokdil_auto_pronounce') === 'true');

  const [yokdilExamDate, setYokdilExamDate] = useState(() => {
    return localStorage.getItem('yokdil_exam_date') || '';
  });

  useEffect(() => {
    localStorage.setItem('yokdil_exam_date', yokdilExamDate);
  }, [yokdilExamDate]);

  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem('yokdil_custom_pet');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setPetConfig({
            name: 'Bilge',
            background: 'cozy',
            color: '',
            ...parsed
          });
        } catch (e) { }
      }
      setPetXp(parseInt(localStorage.getItem('yokdil_pet_xp') || '0', 10));
      setPetLevel(parseInt(localStorage.getItem('yokdil_pet_level') || '1', 10));
    };
    window.addEventListener('storage', loadConfig);
    window.addEventListener('custom-pet-updated', loadConfig);
    return () => {
      window.removeEventListener('storage', loadConfig);
      window.removeEventListener('custom-pet-updated', loadConfig);
    };
  }, []);

  // Smart mascot speech / vocabulary reminder generator
  useEffect(() => {
    const speechOptions = [
      "YÖKDİL sınavına her gün biraz çalışarak hazırlanabilirsin! 🚀",
      "Bugünkü hedeflerini tamamlamayı unutma! Kristaller seni bekliyor. 💎",
      "Düzenli kelime çalışmak, paragraf sorularını çözmenin anahtarıdır. 🔑",
      "Gramer kurallarına çalıştıktan sonra mutlaka bol soru çöz. 📝",
      "Yanlış yaptığın soruları 'Hata Kutusu' sekmesinde tekrar inceleyebilirsin! 🔍"
    ];

    const generateSpeech = () => {
      // If quiz is active, don't override the quiz feedback speech
      if (quizActive) return;

      if (notebook && notebook.length > 0) {
        // 50% chance to remind a word, 50% general advice
        if (Math.random() > 0.5) {
          const randomIndex = Math.floor(Math.random() * notebook.length);
          const randomWord = notebook[randomIndex];
          setMascotSpeech(`Hey! Defterindeki "${randomWord.english}" kelimesinin anlamı neydi hatırlıyor musun? 🤔`);
          setMascotState('thinking');
          return;
        }
      }

      // Default random advice
      const randomOption = speechOptions[Math.floor(Math.random() * speechOptions.length)];
      setMascotSpeech(randomOption);
      setMascotState('neutral');
    };

    // Run initially and then every 45 seconds
    generateSpeech();
    const interval = setInterval(generateSpeech, 45000);

    return () => clearInterval(interval);
  }, [notebook, quizActive]);

  const getOutfitEmoji = () => {
    switch (activeOutfit) {
      case 'wizard': return '🧙‍♂️';
      case 'scientist': return '👨‍🔬';
      case 'king': return '👑';
      case 'scholar': return '🎓';
      default: return '🦉';
    }
  };

  const handleBuyOutfit = (key, cost) => {
    if (gems < cost) {
      alert("Yetersiz kristal! Günlük hedefleri tamamlayarak veya oyunları oynayarak kristal kazanabilirsiniz.");
      return;
    }
    const newGems = gems - cost;
    setGems(newGems);
    localStorage.setItem('yokdil_gems', String(newGems));

    const nextOutfits = [...purchasedOutfits, key];
    setPurchasedOutfits(nextOutfits);
    localStorage.setItem('yokdil_purchased_outfits', JSON.stringify(nextOutfits));

    setActiveOutfit(key);
    localStorage.setItem('yokdil_active_outfit', key);
  };

  const getAchievementTier = (id, value, target) => {
    if (target !== undefined) {
      const completed = value >= target;
      const progress = Math.min(100, Math.round((value / target) * 100));
      const lvlParts = id.split('_lvl_');
      const lvl = lvlParts.length > 1 ? parseInt(lvlParts[1], 10) : 1;
      let tierName = `Seviye ${lvl}`;
      if (completed) {
        tierName += " ⭐";
      }
      return {
        tierName,
        nextTarget: target,
        progress: Math.max(0, Math.min(100, progress)),
        isMax: true,
        completed
      };
    }

    let thresholds = [10, 50, 200, 500];
    let names = ["Bronz 🥉", "Gümüş 🥈", "Altın 🥇", "Elmas 💎"];

    if (id === 'word_master' || id === 'correct_strike') {
      thresholds = [5, 25, 100, 300];
    } else if (id === 'grammar_master') {
      thresholds = [1, 5, 15, 35];
    } else if (id === 'on_fire') {
      thresholds = [1, 3, 7, 30];
    } else if (id === 'gem_collector') {
      thresholds = [100, 500, 1500, 4000];
    }

    let tierIndex = -1;
    for (let i = 0; i < thresholds.length; i++) {
      if (value >= thresholds[i]) {
        tierIndex = i;
      }
    }

    const currentTierName = tierIndex >= 0 ? names[tierIndex] : "Kilitli 🔒";
    const nextTierIndex = tierIndex + 1 < thresholds.length ? tierIndex + 1 : thresholds.length - 1;
    const nextTarget = thresholds[nextTierIndex];
    const prevThreshold = tierIndex >= 0 ? thresholds[tierIndex] : 0;

    const progress = value >= nextTarget ? 100 : Math.round(((value - prevThreshold) / (nextTarget - prevThreshold)) * 100);

    return {
      tierName: currentTierName,
      nextTarget,
      progress: Math.max(0, Math.min(100, progress)),
      isMax: tierIndex === thresholds.length - 1,
      completed: tierIndex >= 0
    };
  };

  const getAchievementsList = () => {
    const solvedCount = getStats().solved;
    const correctCount = getStats().correct;
    const wordCount = Object.keys(wordStats).length;
    const lectureCount = dailyLecturesStudied;
    const streakCount = studyStreak;
    const gemCount = gems;

    const valueMap = {
      first_step: solvedCount,
      correct_strike: correctCount,
      word_master: wordCount,
      grammar_master: lectureCount,
      on_fire: streakCount,
      gem_collector: gemCount
    };

    const mapped = achievementsData.map(ach => {
      const val = valueMap[ach.category] || 0;
      const tier = getAchievementTier(ach.id, val, ach.target);
      return {
        ...ach,
        value: val,
        completed: tier.completed,
        tier
      };
    });

    return mapped.sort((a, b) => {
      if (a.completed && !b.completed) return -1;
      if (!a.completed && b.completed) return 1;
      return a.target - b.target;
    });
  };

  const getFilteredAchievements = () => {
    let list = getAchievementsList();

    if (achievementCategoryFilter !== 'all') {
      list = list.filter(ach => ach.category === achievementCategoryFilter);
    }

    if (achievementStatusFilter === 'completed') {
      list = list.filter(ach => ach.completed);
    } else if (achievementStatusFilter === 'incomplete') {
      list = list.filter(ach => !ach.completed);
    }

    return list;
  };

  // Explanation state
  const [activeExplanation, setActiveExplanation] = useState(null);
  const [explanationLoading, setExplanationLoading] = useState(false);

  // Synchronize App State with URL Hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash; // e.g. "#/fen/dashboard" or "#/landing"
      if (hash.startsWith('#/link-device')) {
        const queryStr = hash.split('?')[1];
        if (queryStr) {
          const params = new URLSearchParams(queryStr);
          const linkToken = params.get('token');
          const linkName = params.get('name');
          if (linkToken && linkName) {
            setDeviceLinkInfo({ token: linkToken, name: linkName });
            setShowDeviceLinkModal(true);
          }
        }
        window.history.pushState(null, '', '#/landing');
        return;
      }

      if (!hash || hash === '#/' || hash === '#/landing') {
        setSelectedCategory(null);
        setActiveTab('dashboard');
        setQuizActive(false);
        return;
      }
      const parts = hash.split('/'); // ["#", "fen", "dashboard"]
      if (parts.length >= 3) {
        const cat = parts[1];
        let tab = parts[2];
        if (tab === 'camp') {
          if (hash.includes('cikmis_kelimeler') || hash.includes('cikmis')) {
            tab = 'vocabulary';
          } else if (hash.includes('vocabulary')) {
            tab = 'camp-vocab';
          } else if (hash.includes('grammar')) {
            tab = 'camp-grammar';
          } else {
            tab = 'camp-vocab';
          }
        }
        setSelectedCategory(cat);
        setActiveTab(tab);
        if (parts.includes('quiz')) {
          setQuizActive(true);
        } else {
          setQuizActive(false);
        }
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auto-sync progress on window focus (so device switches continue seamlessly)
  useEffect(() => {
    const handleFocus = () => {
      if (!token || token === 'null' || !currentUser) return;
      fetch(`${BACKEND_URL}/api/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}) // Empty body acts as read-only fetch
      })
        .then(res => res.json())
        .then(data => {
          if (data.syncState) {
            if (data.syncState.answers) setAnswers(prev => ({ ...prev, ...data.syncState.answers }));
            if (data.syncState.flagged) setFlagged(prev => ({ ...prev, ...data.syncState.flagged }));
            if (data.syncState.mistakes) setMistakes(data.syncState.mistakes);
            if (data.syncState.notebook) setNotebook(data.syncState.notebook);
            if (data.syncState.wordStats) setWordStats(data.syncState.wordStats);
            if (data.syncState.questionStats) {
              setQuestionStats(data.syncState.questionStats);
              localStorage.setItem('yokdil_question_stats', JSON.stringify(data.syncState.questionStats));
            }
          }
        })
        .catch(err => console.error("Error auto-syncing on focus:", err));
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [token, currentUser]);

  // Update URL Hash when state changes
  useEffect(() => {
    if (!selectedCategory) {
      if (window.location.hash !== '#/landing') {
        window.history.pushState(null, '', '#/landing');
      }
    } else {
      const quizSuffix = quizActive ? '/quiz' : '';
      if (activeTab === 'vocabulary') {
        const expectedHash = `#/${selectedCategory}/camp/cikmis_kelimeler`;
        if (window.location.hash !== expectedHash) {
          window.history.pushState(null, '', expectedHash);
        }
      } else if (activeTab === 'camp-vocab') {
        const expectedPrefix = `#/${selectedCategory}/camp/vocabulary`;
        if (window.location.hash !== `#/${selectedCategory}/camp-vocab` && !window.location.hash.startsWith(expectedPrefix)) {
          window.history.pushState(null, '', `#/${selectedCategory}/camp-vocab`);
        }
      } else if (activeTab === 'camp-grammar') {
        const expectedPrefix = `#/${selectedCategory}/camp/grammar`;
        if (window.location.hash !== `#/${selectedCategory}/camp-grammar` && !window.location.hash.startsWith(expectedPrefix)) {
          window.history.pushState(null, '', `#/${selectedCategory}/camp-grammar`);
        }
      } else {
        const prefix = `#/${selectedCategory}/${activeTab}`;
        if (activeTab === 'camp' || activeTab === 'book-exercises') {
          if (!window.location.hash.startsWith(prefix)) {
            window.history.pushState(null, '', prefix);
          }
        } else {
          const expectedHash = `${prefix}${quizSuffix}`;
          if (window.location.hash !== expectedHash) {
            window.history.pushState(null, '', expectedHash);
          }
        }
      }
    }
  }, [selectedCategory, activeTab, quizActive]);

  // Sync selectedOption and isChecked when current question changes
  useEffect(() => {
    if (selectedExam && answers[currentQuizIndex]) {
      setSelectedOption(answers[currentQuizIndex]);
      setIsChecked(true);
      loadQuestionExplanation(currentQuizIndex);
      const isCorrect = answers[currentQuizIndex] === selectedExam.answers[currentQuizIndex - 1];
      setMascotState(isCorrect ? 'happy' : 'sad');
      setMascotSpeech(isCorrect ? "Bu soruyu doğru çözmüştün!" : `Bu soruyu yanlış çözmüştün. Doğru cevap: ${selectedExam.answers[currentQuizIndex - 1]}`);
    } else {
      setSelectedOption(null);
      setIsChecked(false);
      setActiveExplanation(null);
      setMascotState('neutral');
      setMascotSpeech("");
    }
  }, [currentQuizIndex, selectedExam]);

  // Load Initial Data once on mount
  useEffect(() => {
    const category = 'fen';
    // Load local fallback immediately
    setExams(fallbackExamsFen);
    setLoading(false);

    if (BACKEND_URL) {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/${category}/exams`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data) && data.length > 0) {
            setExams(data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching exams from backend, keeping local fallback:", err);
          setLoading(false);
        });
    }

    fetch(`${BACKEND_URL}/api/lectures`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLecturesList(data);
        }
      })
      .catch(err => console.error("Error fetching lectures:", err));

    fetch(`${BACKEND_URL}/api/${category}/dictionary`)
      .then(res => res.json())
      .then(data => {
        const list = Object.entries(data).map(([eng, tr]) => ({ english: eng, turkish: tr }));
        setDictionaryList(list);
      })
      .catch(err => console.error("Error fetching dictionary list:", err));

    fetch(`${BACKEND_URL}/api/${category}/vocabulary`)
      .then(res => res.json())
      .then(data => {
        setVocabPracticeList(data);
      })
      .catch(err => console.error("Error fetching vocabulary database:", err));

    const savedNotebook = localStorage.getItem('yokdil_notebook');
    if (savedNotebook) {
      try {
        const parsed = JSON.parse(savedNotebook);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(item => ({
            id: item.id || Date.now() + Math.random(),
            english: item.english || item.word || '',
            turkish: item.turkish || item.translation || '',
            status: item.status || 'learning'
          }));
          setNotebook(normalized);
        } else {
          setNotebook([]);
        }
      } catch (e) {
        console.error("Error loading notebook:", e);
        setNotebook([]);
      }
    }
  }, []);

  // Load Category-Specific Data when category changes
  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);

    // Load fallback local data immediately
    let localExams = [];
    let localVocab = [];
    let localDict = {};

    if (selectedCategory === 'fen') {
      localExams = fallbackExamsFen;
      localVocab = fallbackVocabFen;
      localDict = fallbackDictFen;
    } else if (selectedCategory === 'sosyal') {
      localExams = fallbackExamsSosyal;
      localVocab = fallbackVocabSosyal;
      localDict = fallbackDictSosyal;
    } else if (selectedCategory === 'saglik') {
      localExams = fallbackExamsSaglik;
      localVocab = fallbackVocabSaglik;
      localDict = fallbackDictSaglik;
    }

    setExams(localExams);
    setVocabPracticeList(localVocab);
    const initialDictList = Object.entries(localDict).map(([eng, tr]) => ({ english: eng, turkish: tr }));
    setDictionaryList(initialDictList);
    
    // Auto-populate notebook if it's empty on category selection
    const savedNotebook = localStorage.getItem('yokdil_notebook');
    if (!savedNotebook || JSON.parse(savedNotebook).length === 0) {
      const loadedWords = Object.entries(localDict).map(([eng, tr], index) => ({
        id: Date.now() + index,
        english: eng,
        turkish: tr,
        status: 'learning'
      }));
      setNotebook(loadedWords);
      localStorage.setItem('yokdil_notebook', JSON.stringify(loadedWords));
    }
    
    setLoading(false);

    // Fetch fresh values from backend (if online / backend is up)
    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}/api/${selectedCategory}/exams`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data) && data.length > 0) {
            setExams(data);
          }
        })
        .catch(err => {
          console.error("Error fetching exams from backend, keeping local fallback:", err);
        });
    }

    fetch(`${BACKEND_URL}/api/${selectedCategory}/dictionary`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          const list = Object.entries(data).map(([eng, tr]) => ({ english: eng, turkish: tr }));
          if (list.length > 0) {
            setDictionaryList(list);
          }
        }
      })
      .catch(err => console.error("Error fetching dictionary list:", err));

    fetch(`${BACKEND_URL}/api/${selectedCategory}/vocabulary`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setVocabPracticeList(data);
        }
      })
      .catch(err => console.error("Error fetching vocabulary database:", err));
  }, [selectedCategory]);

  // Theme Sync
  useEffect(() => {
    localStorage.setItem('yokdil_theme', theme);
  }, [theme]);

  // Font Size Sync
  useEffect(() => {
    localStorage.setItem('yokdil_font_size', fontSize);
  }, [fontSize]);

  // Gamification & Daily Goals Validation Hook
  useEffect(() => {
    const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
    const lastStudyDate = localStorage.getItem('yokdil_last_study_date');
    const savedStreak = localStorage.getItem('yokdil_study_streak');

    // Streak logic
    if (savedStreak) {
      const streakVal = parseInt(savedStreak, 10);
      if (lastStudyDate) {
        const diffTime = Math.abs(new Date(todayStr) - new Date(lastStudyDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          setStudyStreak(streakVal);
        } else if (diffDays > 1) {
          setStudyStreak(1);
          localStorage.setItem('yokdil_study_streak', '1');
        } else {
          setStudyStreak(streakVal);
        }
      } else {
        setStudyStreak(streakVal);
      }
    } else {
      setStudyStreak(1);
      localStorage.setItem('yokdil_study_streak', '1');
    }

    // Daily Goals logic: check if date matches, if not reset
    const savedGoalDate = localStorage.getItem('yokdil_goal_date');
    if (savedGoalDate !== todayStr) {
      localStorage.setItem('yokdil_goal_date', todayStr);
      localStorage.setItem('yokdil_daily_questions', '0');
      localStorage.setItem('yokdil_daily_words', '0');
      localStorage.setItem('yokdil_daily_lectures', '0');
      setDailyQuestionsSolved(0);
      setDailyWordsStudied(0);
      setDailyLecturesStudied(0);
    } else {
      setDailyQuestionsSolved(parseInt(localStorage.getItem('yokdil_daily_questions') || '0', 10));
      setDailyWordsStudied(parseInt(localStorage.getItem('yokdil_daily_words') || '0', 10));
      setDailyLecturesStudied(parseInt(localStorage.getItem('yokdil_daily_lectures') || '0', 10));
    }
  }, []);

  const awardPetXP = (amount) => {
    setPetXp(prevXp => {
      let newXp = prevXp + amount;
      let newLevel = petLevel;

      while (newXp >= 100) {
        newXp -= 100;
        newLevel += 1;
      }

      if (newLevel !== petLevel) {
        setPetLevel(newLevel);
        localStorage.setItem('yokdil_pet_level', String(newLevel));
        triggerConfetti();
        setTimeout(() => {
          alert(`🎉 Tebrikler! Evcil hayvanınız Seviye ${newLevel}'e ulaştı! 🎉`);
        }, 150);
      }

      localStorage.setItem('yokdil_pet_xp', String(newXp));
      window.dispatchEvent(new Event('custom-pet-updated'));
      return newXp;
    });
  };

  const updateStreakAndDate = () => {
    const todayStr = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
    const lastStudyDate = localStorage.getItem('yokdil_last_study_date');
    const savedStreak = localStorage.getItem('yokdil_study_streak') || '1';
    let currentStreak = parseInt(savedStreak, 10);

    if (lastStudyDate !== todayStr) {
      if (lastStudyDate) {
        const diffTime = Math.abs(new Date(todayStr) - new Date(lastStudyDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      setStudyStreak(currentStreak);
      localStorage.setItem('yokdil_study_streak', String(currentStreak));
      localStorage.setItem('yokdil_last_study_date', todayStr);
    }
  };

  const logStudyActivity = (type, amt = 1) => {
    const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })();
    const raw = localStorage.getItem('yokdil_study_history');
    let history = raw ? JSON.parse(raw) : {};
    if (!history[today]) {
      history[today] = { questions: 0, words: 0, games: 0, paragraphs: 0 };
    }
    history[today][type] = (history[today][type] || 0) + amt;
    localStorage.setItem('yokdil_study_history', JSON.stringify(history));
    if (type === 'paragraphs') {
      awardPetXP(15);
    }
  };

  const incrementDailyQuestions = () => {
    const newQuestions = dailyQuestionsSolved + 1;
    setDailyQuestionsSolved(newQuestions);
    localStorage.setItem('yokdil_daily_questions', String(newQuestions));
    setGems(prev => {
      const newVal = prev + 5;
      localStorage.setItem('yokdil_gems', String(newVal));
      return newVal;
    });
    logStudyActivity('questions');
    awardPetXP(10);
    updateStreakAndDate();
  };

  const incrementDailyWords = () => {
    const newWords = dailyWordsStudied + 1;
    setDailyWordsStudied(newWords);
    localStorage.setItem('yokdil_daily_words', String(newWords));
    setGems(prev => {
      const newVal = prev + 2;
      localStorage.setItem('yokdil_gems', String(newVal));
      return newVal;
    });
    logStudyActivity('words');
    awardPetXP(5);
    updateStreakAndDate();
  };

  const incrementDailyLectures = () => {
    const newLectures = dailyLecturesStudied + 1;
    setDailyLecturesStudied(newLectures);
    localStorage.setItem('yokdil_daily_lectures', String(newLectures));
    logStudyActivity('questions', 5); // count lecture completions as active practice too
    updateStreakAndDate();
  };

  // Cloud Sync Effect (Debounced)
  useEffect(() => {
    if (!token || token === 'null' || !currentUser) return;
    const syncTimeout = setTimeout(() => {
      setIsSyncing(true);
      fetch(`${BACKEND_URL}/api/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers,
          flagged,
          mistakes,
          notebook,
          wordStats,
          questionStats
        })
      })
        .then(res => res.json())
        .then(data => {
          setIsSyncing(false);
        })
        .catch(err => {
          console.error("Sync error:", err);
          setIsSyncing(false);
        });
    }, 1500);

    return () => clearTimeout(syncTimeout);
  }, [answers, flagged, mistakes, notebook, wordStats, questionStats, token]);

  const triggerConfetti = () => {
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        tilt: Math.random() * 20 - 10
      });
    }
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 3800);
  };

  const loadQuestionExplanation = (qIndex, examId = null) => {
    const activeExamId = examId || selectedExam?.id;
    if (!activeExamId) return;
    setExplanationLoading(true);
    const category = selectedCategory || 'fen';

    const loadLocalExplanationFallback = () => {
      const questionObj = selectedExam?.questions?.find(q => q.number === qIndex);
      if (questionObj) {
        const correctAnsOption = questionObj.correct_option || selectedExam.answers?.[qIndex - 1] || 'A';
        const correctAnsText = questionObj.options?.[correctAnsOption] || questionObj.correct_answer || '';
        
        const localExplanation = {
          explanation: `### 📖 Soru Çözüm Analizi ve Açıklaması\n\nBu soru **YÖKDİL ${category.toUpperCase()}** düzeyindeki dilbilgisi veya kelime bilgisi yetkinliğini ölçmektedir.\n\n**Soru Cümlesi:**\n> *${questionObj.text}*\n\n**Seçenekler ve Analiz:**\n${Object.entries(questionObj.options || {}).map(([key, val]) => `*   **${key})** ${val} ${key === correctAnsOption ? '✔️ *(Doğru Cevap)*' : ''}`).join('\n')}\n\n**Çözüm ve Yapısal Açıklama:**\nCümle yapısı ve dil bilgisisel bağlam incelendiğinde, boşluğa en uygun ifadenin **${correctAnsOption}) ${correctAnsText}** olduğu görülmektedir. Seçeneklerin cümle içerisindeki işlevleri ve diğer şıkların neden elendiği:\n*   Boşluğun öncesindeki ve sonrasındaki ipuçları (zarflar, bağlaçlar veya edatlar) incelendiğinde, bu şık yapısal veya anlamsal bütünlüğü sağlamaktadır.\n*   Diğer seçenekler dil bilgisi kurallarına (zaman uyumu, etken/edilgen yapılar, tekil/çoğul uyumu) veya kelime bağlamına uymamaktadır.`,
          takeaway: `Doğru cevap ${correctAnsOption} seçeneğidir. Cümledeki ipucu yapıları ve kelime anlamları doğru cevabı doğrudan desteklemektedir.`
        };
        setActiveExplanation(localExplanation);
      }
      setExplanationLoading(false);
    };

    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}/api/${category}/exams/${activeExamId}/explain/${qIndex}`)
        .then(res => res.json())
        .then(data => {
          setActiveExplanation(data);
          setExplanationLoading(false);
        })
        .catch(err => {
          console.warn("Error loading explanation from API, falling back to local generator:", err);
          loadLocalExplanationFallback();
        });
    } else {
      loadLocalExplanationFallback();
    }
  };

  const startQuizSession = (mode) => {
    setQuizMode(mode);
    let qNums = [];
    if (mode === 'quick') {
      while (qNums.length < 10) {
        const rand = Math.floor(Math.random() * 80) + 1;
        if (!qNums.includes(rand)) qNums.push(rand);
      }
      qNums.sort((a, b) => a - b);
      setPreferTextView(true);
      setExamMode(false);
      setExamRunning(false);
    } else if (mode === 'half') {
      while (qNums.length < 40) {
        const rand = Math.floor(Math.random() * 80) + 1;
        if (!qNums.includes(rand)) qNums.push(rand);
      }
      qNums.sort((a, b) => a - b);
      setPreferTextView(true);
      setExamMode(true);
      setExamSecondsLeft(90 * 60);
      setExamRunning(true);
      setExamSubmitted(false);
    } else if (mode === 'full') {
      for (let i = 1; i <= 80; i++) qNums.push(i);
      setPreferTextView(true);
      setExamMode(true);
      setExamSecondsLeft(180 * 60);
      setExamRunning(true);
      setExamSubmitted(false);
    }
    setQuizQuestions(qNums);
    setCurrentQuizIndex(qNums[0] || 1);
    setQuizActive(true);
  };

  const startTopicQuizSession = async (topicKey) => {
    let startIdx = 1;
    let endIdx = 80;

    if (topicKey === 'vocab') { startIdx = 1; endIdx = 6; }
    else if (topicKey === 'tenses') { startIdx = 7; endIdx = 15; }
    else if (topicKey === 'preps') { startIdx = 16; endIdx = 20; }
    else if (topicKey === 'conjs') { startIdx = 21; endIdx = 36; }
    else if (topicKey === 'completion') { startIdx = 37; endIdx = 43; }
    else if (topicKey === 'trans_en_tr') { startIdx = 44; endIdx = 48; }
    else if (topicKey === 'trans_tr_en') { startIdx = 49; endIdx = 53; }
    else if (topicKey === 'paragraph_insertion') { startIdx = 54; endIdx = 59; }
    else if (topicKey === 'irrelevant_sentence') { startIdx = 60; endIdx = 65; }
    else if (topicKey === 'reading') { startIdx = 66; endIdx = 80; }

    setLoading(true);
    const category = selectedCategory || 'fen';
    
    // Load all exam details dynamically
    const loadedExams = [];
    const categoryKeys = Object.keys(examDetailModules).filter(k => k.includes(`yokdil/${category}/cikmis_sinavlar/`) && !k.endsWith('sinav_listesi.json'));
    
    for (const key of categoryKeys) {
      try {
        const loader = examDetailModules[key];
        const module = await loader();
        const fullExam = module.default || module;
        loadedExams.push(fullExam);
      } catch (e) {
        console.error("Failed to load exam for topic quiz:", key, e);
      }
    }
    
    setLoading(false);

    let collectedQuestions = [];
    loadedExams.forEach(ex => {
      if (ex.questions) {
        ex.questions.forEach(q => {
          if (q.number >= startIdx && q.number <= endIdx) {
            collectedQuestions.push({
              ...q,
              examId: ex.id,
              examName: ex.name,
              correctAnswer: q.correct_answer || q.correct_option
            });
          }
        });
      }
    });

    if (collectedQuestions.length === 0) {
      alert("Bu konu için soru bulunamadı.");
      return;
    }

    // Shuffle topic questions
    collectedQuestions = collectedQuestions.sort(() => 0.5 - Math.random());

    setQuizQuestions(collectedQuestions.map((_, i) => i + 1));
    setSelectedExam({
      id: `topic-${topicKey}`,
      name: `Konu Çalışması: ${getTopicName(topicKey)}`,
      questions: collectedQuestions,
      answers: collectedQuestions.map(q => q.correctAnswer)
    });

    setCurrentQuizIndex(1);
    setQuizActive(true);
    setPreferTextView(true);
    setExamMode(false);
    setExamRunning(false);
  };

  const getSortedQuestionNumbers = (examId) => {
    if (!examId) return [];
    const stats = questionStats[examId] || {};
    const qNums = Array.from({ length: 80 }, (_, i) => i + 1);
    const dirFactor = examQuestionSortDir === 'asc' ? 1 : -1;

    if (examQuestionSort === 'wrong') {
      qNums.sort((a, b) => {
        const wA = stats[a]?.wrong || 0;
        const wB = stats[b]?.wrong || 0;
        if (wB !== wA) return (wA - wB) * dirFactor;
        return (a - b) * dirFactor;
      });
    } else if (examQuestionSort === 'correct') {
      qNums.sort((a, b) => {
        const cA = stats[a]?.correct || 0;
        const cB = stats[b]?.correct || 0;
        if (cB !== cA) return (cA - cB) * dirFactor;
        return (a - b) * dirFactor;
      });
    } else {
      qNums.sort((a, b) => (a - b) * dirFactor);
    }
    return qNums;
  };

  const startCustomExamSession = (startIndex, sortedQNums) => {
    const qNums = sortedQNums.slice(startIndex);
    if (qNums.length === 0) return;

    // Clear answers for these questions so they appear unselected for re-solving
    const newAnswers = { ...answers };
    qNums.forEach(num => {
      delete newAnswers[num];
    });
    setAnswers(newAnswers);

    setQuizQuestions(qNums);
    setCurrentQuizIndex(qNums[0]);
    setQuizActive(true);
    setPreferTextView(true);
    setExamMode(false);
    setExamRunning(false);
    setExamSubmitted(false);
  };

  const handleSelectExam = async (exam) => {
    if (!exam) {
      setSelectedExam(null);
      return;
    }
    setLoading(true);
    let fullExam = exam;
    const category = selectedCategory || 'fen';
    const suffix = `yokdil/${category}/cikmis_sinavlar/${exam.id}.json`;
    const foundKey = Object.keys(examDetailModules).find(k => k.endsWith(suffix));
    if (foundKey) {
      try {
        const loader = examDetailModules[foundKey];
        const module = await loader();
        fullExam = module.default || module;
      } catch (e) {
        console.error("Sınav yüklenirken hata oluştu:", e);
        alert("Sınav verileri yüklenemedi!");
      }
    }
    setSelectedExam(fullExam);
    setAnswers(JSON.parse(localStorage.getItem(`answers_${fullExam.id}`)) || {});
    setFlagged(JSON.parse(localStorage.getItem(`flags_${fullExam.id}`)) || {});
    setExamDetailTab('list');
    setCurrentQuizIndex(1);
    setShowPopover(false);
    setActiveExplanation(null);
    setExamMode(false);
    setExamRunning(false);
    setExamSubmitted(false);
    setShowScoreModal(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setLoading(false);
  };

  const handleToggleLectureProgress = (lectureId) => {
    setLectureProgress(prev => {
      const next = { ...prev, [lectureId]: !prev[lectureId] };
      localStorage.setItem('yokdil_lecture_progress', JSON.stringify(next));
      return next;
    });
  };

  const handleSaveGrammarNote = (newNote) => {
    setGrammarNotes(prev => {
      const next = [newNote, ...prev];
      localStorage.setItem('yokdil_grammar_notes', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteGrammarNote = (noteId) => {
    setGrammarNotes(prev => {
      const next = prev.filter(n => n.id !== noteId);
      localStorage.setItem('yokdil_grammar_notes', JSON.stringify(next));
      return next;
    });
  };

  const handleSaveAnswer = (qIndex, value) => {
    if (!selectedExam) return;
    incrementDailyQuestions();

    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 800);

    const newAnswers = { ...answers, [qIndex]: value };
    setAnswers(newAnswers);
    localStorage.setItem(`answers_${selectedExam.id}`, JSON.stringify(newAnswers));

    const correctAns = selectedExam.questions?.[qIndex - 1]?.correct_option || selectedExam.answers?.[qIndex - 1];
    const isCorrect = value === correctAns;

    // Tally correct/incorrect counts per question
    const examIdKey = selectedExam.id;
    const examStats = questionStats[examIdKey] || {};
    const qStats = examStats[qIndex] || { correct: 0, wrong: 0 };
    const updatedQStats = {
      correct: qStats.correct + (isCorrect ? 1 : 0),
      wrong: qStats.wrong + (isCorrect ? 0 : 1)
    };
    const updatedExamStats = { ...examStats, [qIndex]: updatedQStats };
    const updatedQuestionStats = { ...questionStats, [examIdKey]: updatedExamStats };
    setQuestionStats(updatedQuestionStats);
    localStorage.setItem('yokdil_question_stats', JSON.stringify(updatedQuestionStats));

    if (isCorrect) {
      playCorrectSound();
      setMascotState('happy');
      const correctPhrases = [
        "Mükemmel! Tam isabet.",
        "Harikasın! Doğru yoldasın.",
        "Süper! Bu soruyu da fethettin.",
        "Harika iş! Öğrenmeye devam!"
      ];
      setMascotSpeech(correctPhrases[Math.floor(Math.random() * correctPhrases.length)]);
    } else {
      playIncorrectSound();
      setMascotState('sad');
      setMascotSpeech(`Hata yapmak öğrenmenin parçasıdır! Doğru şık: ${selectedExam.answers[qIndex - 1]}`);

      const alreadyExists = mistakes.some(m => m.examId === selectedExam.id && m.qNumber === qIndex);
      if (!alreadyExists) {
        const newMistakes = [...mistakes, { examId: selectedExam.id, qNumber: qIndex }];
        setMistakes(newMistakes);
        localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
      }
    }

    loadQuestionExplanation(qIndex);
  };

  const addMistake = (mistakeObj) => {
    setMistakes(prev => {
      let isDuplicate = false;
      if (mistakeObj.type === 'word') {
        isDuplicate = prev.some(m => m.type === 'word' && m.word.toLowerCase() === mistakeObj.word.toLowerCase());
      } else if (mistakeObj.type === 'exam_question') {
        isDuplicate = prev.some(m => m.type === 'exam_question' && m.examId === mistakeObj.examId && m.qNumber === mistakeObj.qNumber);
      } else if (mistakeObj.type === 'camp_question') {
        isDuplicate = prev.some(m => m.type === 'camp_question' && m.day === mistakeObj.day && m.questionText === mistakeObj.questionText);
      } else if (mistakeObj.type === 'reading_question') {
        isDuplicate = prev.some(m => m.type === 'reading_question' && m.bookId === mistakeObj.bookId && m.questionText === mistakeObj.questionText);
      } else {
        isDuplicate = prev.some(m => m.examId === mistakeObj.examId && m.qNumber === mistakeObj.qNumber && !m.type);
      }

      if (isDuplicate) return prev;
      
      const newMistakes = [...prev, { ...mistakeObj, id: Date.now() + Math.random().toString(36).substring(2, 7) }];
      localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
      return newMistakes;
    });
  };

  const recordWordStat = (word, isCorrect) => {
    const w = word.toLowerCase();
    const current = wordStats[w] || { correct: 0, wrong: 0 };
    const updated = {
      ...wordStats,
      [w]: {
        correct: current.correct + (isCorrect ? 1 : 0),
        wrong: isCorrect ? Math.max(0, current.wrong - 1) : current.wrong + 1
      }
    };
    setWordStats(updated);
    localStorage.setItem('yokdil_word_stats', JSON.stringify(updated));

    // Leitner Box Update
    setNotebook(prev => {
      const updatedNotebook = prev.map(item => {
        if ((item.english || '').toLowerCase() === w) {
          const currentBox = item.leitnerBox || 1;
          const nextBox = isCorrect ? Math.min(5, currentBox + 1) : 1;
          return { ...item, leitnerBox: nextBox };
        }
        return item;
      });
      localStorage.setItem('yokdil_notebook', JSON.stringify(updatedNotebook));
      return updatedNotebook;
    });
  };

  const handleToggleFlag = (qIndex) => {
    if (!selectedExam) return;
    const newFlags = { ...flagged, [qIndex]: !flagged[qIndex] };
    setFlagged(newFlags);
    localStorage.setItem(`flags_${selectedExam.id}`, JSON.stringify(newFlags));
  };

  const handleResetProgress = () => {
    if (!selectedExam) return;
    setCustomConfirm({
      title: "Sınav İlerlemesini Sıfırla",
      message: "Bu sınavın tüm ilerlemesini sıfırlamak istediğinize emin misiniz?",
      onConfirm: () => {
        setAnswers({});
        setFlagged({});
        localStorage.removeItem(`answers_${selectedExam.id}`);
        localStorage.removeItem(`flags_${selectedExam.id}`);
        setCurrentQuizIndex(1);
        setExamRunning(false);
        setExamSubmitted(false);
        setShowScoreModal(false);
        setExamSecondsLeft(180 * 60);
      }
    });
  };

  const handleResetAllProgress = () => {
    setCustomConfirm({
      title: "Tüm Verileri Sıfırla",
      message: "DİKKAT: Hesabınızdaki TÜM ilerlemeyi (çözülen sorular, istatistikler, kelimeler, seriler, hedefler ve yüklediğiniz özel kelime kampları) sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz!",
      onConfirm: () => {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('answers_') || key.startsWith('flags_') || key.startsWith('yokdil_')) {
            localStorage.removeItem(key);
          }
        });

        setAnswers({});
        setFlagged({});
        setNotebook([]);
        setQuestionStats({});
        setStudyStreak(1);
        setDailyQuestionsSolved(0);
        setDailyWordsStudied(0);
        setDailyLecturesStudied(0);
        setSelectedCategory(null);
        setSelectedExam(null);

        setCustomAlert({
          title: "Sıfırlama Başarılı",
          message: "Tüm verileriniz başarıyla sıfırlanmıştır.",
          type: "success"
        });
      }
    });
  };

  // AI Chatbot States
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { sender: 'bot', text: 'Merhaba! Ben bilge çalışma arkadaşın. YÖKDİL İngilizce kelimeleri, gramer kuralları veya çeviriler hakkında merak ettiğin her şeyi bana sorabilirsin! 🦉' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiVoiceMode, setAiVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Draggable & Resizable Chatbot States
  const [chatPos, setChatPos] = useState(null);
  const [chatSize, setChatSize] = useState({ width: 380, height: 520 });
  const [activeChatChallenge, setActiveChatChallenge] = useState(null);
  const [showAiFloatBtn, setShowAiFloatBtn] = useState(() => {
    return localStorage.getItem('yokdil_ai_float_btn_enabled') !== 'false';
  });
  const [floatPos, setFloatPos] = useState(null);

  useEffect(() => {
    if (showAiChat && !chatPos) {
      setChatPos({
        x: window.innerWidth - 410,
        y: window.innerHeight - 620
      });
    }
  }, [showAiChat, chatPos]);

  const handleHeaderMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button') || e.target.closest('i')) return;
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = chatPos ? chatPos.x : (window.innerWidth - 410);
    const initialY = chatPos ? chatPos.y : (window.innerHeight - 620);

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setChatPos({
        x: initialX + deltaX,
        y: initialY + deltaY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleHeaderTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('i')) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const initialX = chatPos ? chatPos.x : (window.innerWidth - 410);
    const initialY = chatPos ? chatPos.y : (window.innerHeight - 620);

    const handleTouchMove = (moveEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaX = currentTouch.clientX - startX;
      const deltaY = currentTouch.clientY - startY;
      setChatPos({
        x: initialX + deltaX,
        y: initialY + deltaY
      });
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleFloatMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.ai-chat-close-float-btn')) return;
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = floatPos ? floatPos.x : (window.innerWidth - 80);
    const initialY = floatPos ? floatPos.y : (window.innerHeight - 80);
    let hasMoved = false;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true;
      }
      setFloatPos({
        x: Math.max(10, Math.min(window.innerWidth - 70, initialX + deltaX)),
        y: Math.max(10, Math.min(window.innerHeight - 70, initialY + deltaY))
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (!hasMoved) {
        setShowAiChat(true);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleFloatTouchStart = (e) => {
    if (e.target.closest('.ai-chat-close-float-btn')) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    const initialX = floatPos ? floatPos.x : (window.innerWidth - 80);
    const initialY = floatPos ? floatPos.y : (window.innerHeight - 80);
    let hasMoved = false;

    const handleTouchMove = (moveEvent) => {
      const currentTouch = moveEvent.touches[0];
      const deltaX = currentTouch.clientX - startX;
      const deltaY = currentTouch.clientY - startY;
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true;
      }
      setFloatPos({
        x: Math.max(10, Math.min(window.innerWidth - 70, initialX + deltaX)),
        y: Math.max(10, Math.min(window.innerHeight - 70, initialY + deltaY))
      });
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (!hasMoved) {
        setShowAiChat(true);
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleResizeMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = chatSize.width;
    const initialHeight = chatSize.height;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      setChatSize({
        width: Math.max(300, Math.min(800, initialWidth + deltaX)),
        height: Math.max(350, Math.min(800, initialHeight + deltaY))
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, showAiChat]);

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tarayıcınız ses tanımayı desteklemiyor.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setAiInput(speechToText);
    };

    recognition.onerror = (err) => {
      console.error(err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendAiMessage = async (customText = null) => {
    const textToSend = customText || aiInput;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setAiMessages(prev => [...prev, userMsg]);
    if (!customText) setAiInput('');

    try {
      const categoryParam = selectedCategory || 'fen';
      const response = await fetch(`${BACKEND_URL}/api/${categoryParam}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && token !== 'null' ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          message: textToSend,
          activeChallenge: activeChatChallenge
        })
      });

      if (!response.ok) {
        throw new Error('API response error');
      }

      const data = await response.json();

      setAiMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      if (data.challenge) {
        setActiveChatChallenge(data.challenge);
      } else {
        setActiveChatChallenge(null);
      }

      if (aiVoiceMode) {
        const cleanText = data.response.replace(/[*_`#]/g, "");
        playSpeechAudio(cleanText);
      }
    } catch (error) {
      console.error("Chatbot API failed:", error);
      setAiMessages(prev => [...prev, { sender: 'bot', text: "Üzgünüm, şu anda bağlantı hatası yaşıyorum. Lütfen sunucunun çalıştığından emin olun." }]);
    }
  };

  const handleAskAI = (text) => {
    setShowAiChat(true);
    handleSendAiMessage(`"${text}" kelimesini/cümlesini açıklar mısın ve YÖKDİL için önemini yazar mısın?`);
  };

  const handleSubmitExam = () => {
    setQuizActive(false);
    setExamRunning(false);
    setActiveTab('performance');
  };

  const handleTextSelection = async (e) => {
    let text = "";
    let rect = null;

    if (e && e.customText) {
      text = e.customText;
      const targetRect = e.target.getBoundingClientRect();
      rect = {
        left: targetRect.left,
        top: targetRect.top,
        width: targetRect.width,
        height: targetRect.height
      };
    } else {
      const selection = window.getSelection();
      text = selection.toString().trim();
      if (text && text.length <= 50) {
        try {
          const range = selection.getRangeAt(0);
          rect = range.getBoundingClientRect();
        } catch (err) { }
      }
    }

    if (!text || text.length > 50 || !rect) {
      setShowPopover(false);
      return;
    }

    try {
      setPopoverPosition({
        x: rect.left + window.scrollX + (rect.width / 2),
        y: rect.top + window.scrollY - 10
      });
      setSelectedText(text);
      setShowPopover(true);
      setTranslating(true);
      const cleanWord = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
      const getLocalTranslation = (txt) => {
        const dict = dictionaryList || [];
        let match = dict.find(item => item.english.toLowerCase() === txt);
        if (match) return match.turkish;

        let lemmas = [txt];
        if (txt.endsWith('s')) lemmas.push(txt.slice(0, -1));
        if (txt.endsWith('d')) lemmas.push(txt.slice(0, -1));
        if (txt.endsWith('ed')) lemmas.push(txt.slice(0, -2));
        if (txt.endsWith('ing')) lemmas.push(txt.slice(0, -3));
        if (txt.endsWith('ies')) lemmas.push(txt.slice(0, -3) + 'y');
        if (txt.endsWith('ied')) lemmas.push(txt.slice(0, -3) + 'y');

        for (const lem of lemmas) {
          let m = dict.find(item => item.english.toLowerCase() === lem);
          if (m) return m.turkish;
        }

        const words = txt.split(' ');
        if (words.length > 1) {
          const meanings = [];
          for (const w of words) {
            let m = dict.find(item => item.english.toLowerCase() === w);
            if (m) {
              meanings.push(`${w}: ${m.turkish}`);
            } else {
              let wLemmas = [w];
              if (w.endsWith('s')) wLemmas.push(w.slice(0, -1));
              if (w.endsWith('d')) wLemmas.push(w.slice(0, -1));
              if (w.endsWith('ed')) wLemmas.push(w.slice(0, -2));
              if (w.endsWith('ing')) wLemmas.push(w.slice(0, -3));
              if (w.endsWith('ies')) wLemmas.push(w.slice(0, -3) + 'y');
              if (w.endsWith('ied')) wLemmas.push(w.slice(0, -3) + 'y');
              let foundLem = false;
              for (const lem of wLemmas) {
                let m2 = dict.find(item => item.english.toLowerCase() === lem);
                if (m2) {
                  meanings.push(`${w}: ${m2.turkish}`);
                  foundLem = true;
                  break;
                }
              }
              if (!foundLem) {
                meanings.push(`${w}: (sözlükte yok)`);
              }
            }
          }
          return meanings.join(' | ');
        }
        return null;
      };

      const localTr = getLocalTranslation(cleanWord);
      if (localTr) {
        setTranslationResult({ word: text, translation: localTr, source: 'local_dict' });
        setTranslating(false);
        return;
      }

      const category = selectedCategory || 'fen';
      const res = await fetch(`${BACKEND_URL}/api/${category}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setTranslationResult(data);
      setTranslating(false);
    } catch (err) {
      console.error("Selection error:", err);
      setTranslating(false);
    }
  };

  const playSpeechAudio = (text, customRate = null) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = customRate || speechRate;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddToNotebook = (word, translation) => {
    const cleanWord = word.trim();
    const cleanTranslation = translation ? translation.trim() : '';
    if (notebook.some(item => (item.english || '').toLowerCase() === cleanWord.toLowerCase())) {
      alert("Bu kelime zaten defterinizde kayıtlı!");
      return;
    }
    const newNotebook = [...notebook, { id: Date.now(), english: cleanWord, turkish: cleanTranslation, status: 'learning' }];
    setNotebook(newNotebook);
    localStorage.setItem('yokdil_notebook', JSON.stringify(newNotebook));
    setShowPopover(false);
  };

  const handleDeleteFromNotebook = (id) => {
    const newNotebook = notebook.filter(item => item.id !== id);
    setNotebook(newNotebook);
    localStorage.setItem('yokdil_notebook', JSON.stringify(newNotebook));
  };

  const handleToggleWordStatus = (id) => {
    const newNotebook = notebook.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'learned' ? 'learning' : 'learned' };
      }
      return item;
    });
    setNotebook(newNotebook);
    localStorage.setItem('yokdil_notebook', JSON.stringify(newNotebook));
  };

  const handleUpdateWordLeitner = (english, isCorrect, fallbackTurkish = "") => {
    const cleanWord = english.trim().toLowerCase();
    const exists = notebook.some(item => (item.english || '').toLowerCase() === cleanWord);
    
    let newNotebook;
    if (exists) {
      newNotebook = notebook.map(item => {
        if ((item.english || '').toLowerCase() === cleanWord) {
          let currentStage = item.leitnerStage || 1;
          if (isCorrect) {
            currentStage = Math.min(5, currentStage + 1);
          } else {
            currentStage = Math.max(1, currentStage - 1);
          }
          const newStatus = currentStage === 5 ? 'learned' : 'learning';
          return { ...item, leitnerStage: currentStage, status: newStatus };
        }
        return item;
      });
    } else {
      const initialStage = isCorrect ? 2 : 1;
      newNotebook = [...notebook, { 
        id: Date.now(), 
        english: english.trim(), 
        turkish: fallbackTurkish || english, 
        status: initialStage === 5 ? 'learned' : 'learning',
        leitnerStage: initialStage
      }];
    }
    setNotebook(newNotebook);
    localStorage.setItem('yokdil_notebook', JSON.stringify(newNotebook));
  };

  const handleAddCustomWord = (english, turkish) => {
    const cleanEng = english.trim();
    const cleanTr = turkish.trim();
    if (!cleanEng || !cleanTr) return;
    if (notebook.some(item => (item.english || '').toLowerCase() === cleanEng.toLowerCase())) {
      alert("Bu kelime zaten defterinizde kayıtlı!");
      return;
    }
    const newNotebook = [...notebook, { id: Date.now(), english: cleanEng, turkish: cleanTr, status: 'learning' }];
    setNotebook(newNotebook);
    localStorage.setItem('yokdil_notebook', JSON.stringify(newNotebook));
  };

  const handleLoadAcademicWords = () => {
    setLoading(true);
    const category = selectedCategory || 'fen';
    
    let fallbackDict = fallbackDictFen;
    if (category === 'sosyal') fallbackDict = fallbackDictSosyal;
    else if (category === 'saglik') fallbackDict = fallbackDictSaglik;

    const processLoadedData = (dictData) => {
      const loadedWords = Object.entries(dictData).map(([eng, tr], index) => ({
        id: Date.now() + index,
        english: eng,
        turkish: tr,
        status: 'learning'
      }));
      const existingEngs = new Set(notebook.map(item => (item.english || '').toLowerCase()));
      const uniqueLoaded = loadedWords.filter(item => !existingEngs.has(item.english.toLowerCase()));

      if (uniqueLoaded.length === 0) {
        alert("Tüm kelimeler zaten defterinizde ekli!");
        setLoading(false);
        return;
      }

      const newNotebook = [...notebook, ...uniqueLoaded];
      setNotebook(newNotebook);
      localStorage.setItem('yokdil_notebook', JSON.stringify(newNotebook));
      alert(`${uniqueLoaded.length} yeni YÖKDİL Akademik Kelimesi defterinize eklendi!`);
      setLoading(false);
    };

    fetch(`${BACKEND_URL}/api/${category}/dictionary`)
      .then(res => res.json())
      .then(data => {
        const dictData = (data && typeof data === 'object') ? data : fallbackDict;
        processLoadedData(dictData);
      })
      .catch(err => {
        console.warn("Error loading dictionary from backend, using fallback:", err);
        processLoadedData(fallbackDict);
      });
  };

  const handleLoadLecture = (id) => {
    if (!id) {
      setActiveLecture(null);
      return;
    }
    setLectureLoading(true);

    const loadLocalFallback = async (lid) => {
      try {
        const text = await getLectureContent(selectedCategory || 'fen', `${lid}.md`);
        const lecInfo = FALLBACK_LECTURES.find(l => l.id === lid) || {};
        setActiveLecture({
          id: lid,
          title: lecInfo.title || lid,
          content: text || "Konu anlatım içeriği yüklenemedi."
        });
        setLectureLoading(false);
      } catch (e) {
        console.error("Failed to load local lecture:", e);
        setLectureLoading(false);
      }
    };

    if (BACKEND_URL && BACKEND_URL !== 'null' && BACKEND_URL !== 'undefined' && BACKEND_URL.trim() !== '') {
      fetch(`${BACKEND_URL}/api/lectures/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.content) {
            setActiveLecture(data);
            setLectureLoading(false);
          } else {
            loadLocalFallback(id);
          }
        })
        .catch(err => {
          console.warn("API load failed, falling back to local prebuilt lectures:", err);
          loadLocalFallback(id);
        });
    } else {
      loadLocalFallback(id);
    }
  };

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setCurrentUser(newUser);
    localStorage.setItem('yokdil_token', newToken);
    localStorage.setItem('yokdil_user', JSON.stringify(newUser));

    if (newUser) {
      fetch(`${BACKEND_URL}/api/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${newToken}`
        },
        body: JSON.stringify({
          answers,
          flagged,
          mistakes,
          notebook,
          wordStats,
          questionStats
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.syncState) {
            if (data.syncState.answers) setAnswers(data.syncState.answers);
            if (data.syncState.flagged) setFlagged(data.syncState.flagged);
            if (data.syncState.mistakes) setMistakes(data.syncState.mistakes);
            if (data.syncState.notebook) setNotebook(data.syncState.notebook);
            if (data.syncState.wordStats) setWordStats(data.syncState.wordStats);
            if (data.syncState.questionStats) {
              setQuestionStats(data.syncState.questionStats);
              localStorage.setItem('yokdil_question_stats', JSON.stringify(data.syncState.questionStats));
            }
          }
        })
        .catch(err => console.error("Initial sync error:", err));
    }
  };

  const handlePullDeviceData = async () => {
    if (!deviceLinkInfo) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deviceLinkInfo.token}`
        },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Veri çekilemedi.');

      setToken(deviceLinkInfo.token);
      const newUser = { id: Date.now().toString(), name: deviceLinkInfo.name };
      setCurrentUser(newUser);
      localStorage.setItem('yokdil_token', deviceLinkInfo.token);
      localStorage.setItem('yokdil_user', JSON.stringify(newUser));

      if (data.syncState) {
        if (data.syncState.answers) {
          setAnswers(data.syncState.answers);
          localStorage.setItem(`answers_fen2024`, JSON.stringify(data.syncState.answers));
        }
        if (data.syncState.flagged) setFlagged(data.syncState.flagged);
        if (data.syncState.mistakes) {
          setMistakes(data.syncState.mistakes);
          localStorage.setItem('yokdil_mistakes', JSON.stringify(data.syncState.mistakes));
        }
        if (data.syncState.notebook) {
          setNotebook(data.syncState.notebook);
          localStorage.setItem('yokdil_notebook', JSON.stringify(data.syncState.notebook));
        }
        if (data.syncState.wordStats) {
          setWordStats(data.syncState.wordStats);
          localStorage.setItem('yokdil_word_stats', JSON.stringify(data.syncState.wordStats));
        }
        if (data.syncState.questionStats) {
          setQuestionStats(data.syncState.questionStats);
          localStorage.setItem('yokdil_question_stats', JSON.stringify(data.syncState.questionStats));
        }
      }
      alert("Bağlantı Başarılı! Diğer cihazdaki tüm veriler ve profil bu cihaza aktarıldı.");
      setShowDeviceLinkModal(false);
    } catch (err) {
      alert("Cihaz verileri çekilemedi: " + err.message);
    }
  };

  const handlePushDeviceData = async () => {
    if (!deviceLinkInfo) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deviceLinkInfo.token}`
        },
        body: JSON.stringify({
          answers,
          flagged,
          mistakes,
          notebook,
          wordStats,
          questionStats
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Veri gönderilemedi.');

      setToken(deviceLinkInfo.token);
      const newUser = { id: Date.now().toString(), name: deviceLinkInfo.name };
      setCurrentUser(newUser);
      localStorage.setItem('yokdil_token', deviceLinkInfo.token);
      localStorage.setItem('yokdil_user', JSON.stringify(newUser));

      alert("Bağlantı Başarılı! Bu cihazdaki veriler hedef profile aktarıldı ve profil bağlandı.");
      setShowDeviceLinkModal(false);
    } catch (err) {
      alert("Cihaz verileri gönderilemedi: " + err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('yokdil_token');
    localStorage.removeItem('yokdil_user');
    setAnswers({});
    setFlagged({});
    setMistakes([]);
    setNotebook([]);
    setWordStats({});
  };

  const getStats = () => {
    let solved = 0;
    let correct = 0;
    let wrong = 0;

    const topicStats = {
      vocab: { name: "Kelime Bilgisi (Vocabulary)", solved: 0, correct: 0, total: 6 },
      tenses: { name: "Zamanlar & Pasif (Tenses)", solved: 0, correct: 0, total: 9 },
      preps: { name: "Edat Öbekleri (Prepositions)", solved: 0, correct: 0, total: 5 },
      conjs: { name: "Bağlaçlar (Conjunctions)", solved: 0, correct: 0, total: 16 },
      reading: { name: "Cümle/Paragraf (Reading/Clauses)", solved: 0, correct: 0, total: 44 }
    };

    if (Array.isArray(exams)) {
      exams.forEach(ex => {
        if (!ex || !ex.id || !ex.answers) return;
        const exAns = JSON.parse(localStorage.getItem(`answers_${ex.id}`)) || {};
        for (let i = 1; i <= 80; i++) {
          const userAns = exAns[i];
          let tKey = "reading";
          if (i >= 1 && i <= 6) tKey = "vocab";
          else if (i >= 7 && i <= 15) tKey = "tenses";
          else if (i >= 16 && i <= 20) tKey = "preps";
          else if (i >= 21 && i <= 36) tKey = "conjs";

          if (userAns) {
            solved++;
            topicStats[tKey].solved++;
            if (userAns === ex.answers[i - 1]) {
              correct++;
              topicStats[tKey].correct++;
            } else {
              wrong++;
            }
          }
        }
      });
    }

    const totalSolved = solved;
    const score = totalSolved > 0 ? Math.round((correct / totalSolved) * 100) : 0;
    return { solved: totalSolved, correct, wrong, score, topics: topicStats };
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = getStats();

  const topicsList = [
    { key: 'vocab', name: "Kelime Bilgisi (Vocabulary)", range: "Soru 1-6" },
    { key: 'tenses', name: "Dilbilgisi & Zamanlar (Grammar & Tenses)", range: "Soru 7-15" },
    { key: 'preps', name: "Edat Öbekleri (Prepositional Phrases)", range: "Soru 16-20" },
    { key: 'conjs', name: "Bağlaçlar (Conjunctions)", range: "Soru 21-36" },
    { key: 'completion', name: "Cümle Tamamlama (Sentence Completion)", range: "Soru 37-43" },
    { key: 'trans_en_tr', name: "Çeviri Soruları (İngilizce - Türkçe)", range: "Soru 44-48" },
    { key: 'trans_tr_en', name: "Çeviri Soruları (Türkçe - İngilizce)", range: "Soru 49-53" },
    { key: 'paragraph_insertion', name: "Paragraf Tamamlama (Paragraph Completion)", range: "Soru 54-59" },
    { key: 'irrelevant_sentence', name: "Anlam Akışını Bozan Cümle (Irrelevant Sentence)", range: "Soru 60-65" },
    { key: 'reading', name: "Paragraf Okuduğunu Anlama (Reading)", range: "Soru 66-80" }
  ];

  return {
    currentUser, setCurrentUser,
    token, setToken,
    showAuthModal, setShowAuthModal,
    loginName, setLoginName,
    authMode, setAuthMode,
    authUsername, setAuthUsername,
    authPassword, setAuthPassword,
    authConfirmPassword, setAuthConfirmPassword,
    chatbotName, setChatbotName,
    authFullName, setAuthFullName,
    deviceLinkInfo, setDeviceLinkInfo,
    showDeviceLinkModal, setShowDeviceLinkModal,
    customAlert, setCustomAlert,
    customConfirm, setCustomConfirm,
    activeTab, setActiveTab,
    vocabTrack, setVocabTrack,
    bookSelectedDay, setBookSelectedDay,
    bookCompletedDays, setBookCompletedDays,
    selectedTestTab, setSelectedTestTab,
    theme, setTheme,
    sidebarCollapsed, setSidebarCollapsed,
    mobileTabsConfig, setMobileTabsConfig,
    mobileNavEditMode, setMobileNavEditMode,
    customizingSlotIndex, setCustomizingSlotIndex,
    showMobileMoreSheet, setShowMobileMoreSheet,
    fontSize, setFontSize,
    sepiaActive, setSepiaActive,
    isSyncing, setIsSyncing,
    spacedRepetitionModalWord, setSpacedRepetitionModalWord,
    exams, setExams,
    selectedExam, setSelectedExam,
    selectedCategory, setSelectedCategory,
    quizActive, setQuizActive,
    quizQuestions, setQuizQuestions,
    quizMode, setQuizMode,
    loading, setLoading,
    selectedOption, setSelectedOption,
    isChecked, setIsChecked,
    confetti, setConfetti,
    mascotState, setMascotState,
    mascotSpeech, setMascotSpeech,
    mistakes, setMistakes,
    gems, setGems,
    ownedOutfits, setOwnedOutfits,
    activeOutfits, setActiveOutfits,
    streakFreezeActive, setStreakFreezeActive,
    petXp, setPetXp,
    petLevel, setPetLevel,
    pendingLevelUp, setPendingLevelUp,
    petConfig, setPetConfig,
    wordStats, setWordStats,
    questionStats, setQuestionStats,
    examQuestionSort, setExamQuestionSort,
    examQuestionSortDir, setExamQuestionSortDir,
    examDetailTab, setExamDetailTab,
    lectureProgress, setLectureProgress,
    grammarNotes, setGrammarNotes,
    achievementCategoryFilter, setAchievementCategoryFilter,
    achievementStatusFilter, setAchievementStatusFilter,
    answers, setAnswers,
    flagged, setFlagged,
    preferTextView, setPreferTextView,
    currentQuizIndex, setCurrentQuizIndex,
    examMode, setExamMode,
    examSecondsLeft, setExamSecondsLeft,
    examRunning, setExamRunning,
    examSubmitted, setExamSubmitted,
    showScoreModal, setShowScoreModal,
    timerIntervalRef,
    examDateInputRef,
    questionTimeSpent, setQuestionTimeSpent,
    lecturesList, setLecturesList,
    activeLecture, setActiveLecture,
    lectureLoading, setLectureLoading,
    isStudyingActive, setIsStudyingActive,
    selectedText, setSelectedText,
    translationResult, setTranslationResult,
    translating, setTranslating,
    popoverPosition, setPopoverPosition,
    showPopover, setShowPopover,
    notebook, setNotebook,
    vocabPracticeList, setVocabPracticeList,
    dictionaryList, setDictionaryList,
    speechRate, setSpeechRate,
    soundEnabled, setSoundEnabled,
    studyStreak, setStudyStreak,
    dailyQuestionsSolved, setDailyQuestionsSolved,
    dailyWordsStudied, setDailyWordsStudied,
    dailyLecturesStudied, setDailyLecturesStudied,
    dailyQuestionGoal, setDailyQuestionGoal,
    dailyWordGoal, setDailyWordGoal,
    purchasedOutfits, setPurchasedOutfits,
    activeOutfit, setActiveOutfit,
    autoPronounceEnabled, setAutoPronounceEnabled,
    yokdilExamDate, setYokdilExamDate,
    awardPetXp,
    getOutfitEmoji,
    handleBuyOutfit,
    getAchievementTier,
    getAchievementsList,
    getFilteredAchievements,
    activeExplanation, setActiveExplanation,
    explanationLoading, setExplanationLoading,
    startQuizSession,
    startTopicQuizSession,
    getSortedQuestionNumbers,
    startCustomExamSession,
    handleSelectExam,
    handleToggleLectureProgress,
    handleSaveGrammarNote,
    handleDeleteGrammarNote,
    handleSaveAnswer,
    addMistake,
    recordWordStat,
    handleToggleFlag,
    handleResetProgress,
    handleResetAllProgress,
    showAiChat, setShowAiChat,
    aiMessages, setAiMessages,
    aiInput, setAiInput,
    aiVoiceMode, setAiVoiceMode,
    isListening, setIsListening,
    messagesEndRef,
    chatPos, setChatPos,
    chatSize, setChatSize,
    activeChatChallenge, setActiveChatChallenge,
    showAiFloatBtn, setShowAiFloatBtn,
    floatPos, setFloatPos,
    handleHeaderMouseDown,
    handleHeaderTouchStart,
    handleFloatMouseDown,
    handleFloatTouchStart,
    handleResizeMouseDown,
    startVoiceRecognition,
    handleSendAiMessage,
    handleAskAI,
    handleSubmitExam,
    handleTextSelection,
    playSpeechAudio,
    handleAddToNotebook,
    handleDeleteFromNotebook,
    handleToggleWordStatus,
    handleUpdateWordLeitner,
    handleAddCustomWord,
    handleLoadAcademicWords,
    handleLoadLecture,
    handleAuthSuccess,
    handlePullDeviceData,
    handlePushDeviceData,
    handleLogout,
    getStats,
    formatTime,
    stats,
    topicsList,
    BACKEND_URL,
    ROOM_BACKGROUNDS,
    ALL_TABS,
    incrementDailyQuestions,
    incrementDailyWords,
    incrementDailyLectures,
    logStudyActivity,
    awardPetXP,
    triggerConfetti
  };
};
