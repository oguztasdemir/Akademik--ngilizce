import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy, TrendingUp, Volume2, Plus, Play, ArrowRight,
  Sun, Moon, Eye, ShieldAlert
} from 'lucide-react';

// Import Modular Components
import MascotOwl from './components/common/MascotOwl';
import MascotPet from './components/common/MascotPet';
import Confetti from './components/common/Confetti';
import TranslationPopover from './components/common/TranslationPopover';
import Sidebar from './components/layout/Sidebar';
import QuizSection from './features/quiz/QuizSection';
import VocabularySection from './features/vocabulary/VocabularySection';
import LecturesSection from './features/lectures/LecturesSection';
import PerformanceSection from './features/performance/PerformanceSection';
import SettingsSection from './features/settings/SettingsSection';
import PetSection from './features/pet/PetSection';
import GamesSection from './features/games/GamesSection';
import MistakeInbox from './features/mistakes/MistakeInbox';
import ParagraphsSection from './features/paragraphs/ParagraphsSection';
import AuthModal from './components/common/AuthModal';
import SmartStudySection from './features/smart-study/SmartStudySection';
import CampSection from './features/camp/CampSection';
import BookExerciseSection from './features/book-exercise/BookExerciseSection';
import { renderMarkdown } from './utils/markdown';
import { playCorrectSound, playIncorrectSound, playGoalSound } from './utils/audio';
import achievementsData from '@dataset/yokdil/achievements.json';

import fallbackExamsFen from '@dataset/yokdil/fen/cikmis_sinavlar/sinav_listesi.json';
import fallbackExamsSosyal from '@dataset/yokdil/sosyal/cikmis_sinavlar/sinav_listesi.json';
import fallbackExamsSaglik from '@dataset/yokdil/saglik/cikmis_sinavlar/sinav_listesi.json';

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


import fallbackVocabFen from '@dataset/yokdil/fen/gelismis_kelime_kampi/akademik_kelime_listesi.json';
import fallbackVocabSosyal from '@dataset/yokdil/sosyal/gelismis_kelime_kampi/akademik_kelime_listesi.json';
import fallbackVocabSaglik from '@dataset/yokdil/saglik/gelismis_kelime_kampi/akademik_kelime_listesi.json';

import fallbackDictFen from '@dataset/yokdil/fen/dictionary.json';
import fallbackDictSosyal from '@dataset/yokdil/sosyal/dictionary.json';
import fallbackDictSaglik from '@dataset/yokdil/saglik/dictionary.json';

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

function App() {
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
    let reqXp = nextLevel * 200;
    while (nextXp >= reqXp) {
      nextXp -= reqXp;
      nextLevel += 1;
      setPendingLevelUp({ oldLevel: petLevel, newLevel: nextLevel });
      reqXp = nextLevel * 200;
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
      const category = initialHashState.category || localStorage.getItem('yokdil_last_standard_category') || 'fen';
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
  }, []);

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
      const correctAns = selectedExam.questions?.[currentQuizIndex - 1]?.correct_option || selectedExam.answers?.[currentQuizIndex - 1];
      const isCorrect = answers[currentQuizIndex] === correctAns;
      setMascotState(isCorrect ? 'happy' : 'sad');
      setMascotSpeech(isCorrect ? "Bu soruyu doğru çözmüştün!" : `Bu soruyu yanlış çözmüştün. Doğru cevap: ${correctAns}`);
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
      const correctAns = selectedExam.questions?.[qIndex - 1]?.correct_option || selectedExam.answers?.[qIndex - 1];
      setMascotSpeech(`Hata yapmak öğrenmenin parçasıdır! Doğru şık: ${correctAns}`);

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
      // Prevent duplicates based on unique keys for each type
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
        // Fallback for old style exam mistakes
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
        wrong: isCorrect ? Math.max(0, current.wrong - 1) : current.wrong + 1 // Decr wrong on correct answer
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

    if (BACKEND_URL) {
      fetch(`${BACKEND_URL}/api/lectures/${id}`)
        .then(res => {
          if (!res.ok) throw new Error("HTTP error " + res.status);
          return res.json();
        })
        .then(data => {
          if (data && data.content) {
            setActiveLecture(data);
            setLectureLoading(false);
          } else {
            throw new Error("Invalid or empty lecture content returned from API");
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
        if (!ex || !ex.id) return;
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
            const correctOption = ex.questions?.[i - 1]?.correct_option || ex.answers?.[i - 1];
            if (userAns === correctOption) {
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

  // Automatically sign in guest user if no user session exists
  if (!currentUser) {
    const defaultUser = { name: 'Kullanıcı', username: 'kullanici', id: '1' };
    localStorage.setItem('yokdil_user', JSON.stringify(defaultUser));
    setTimeout(() => {
      setCurrentUser(defaultUser);
    }, 10);
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090d16',
        color: '#818cf8',
        fontSize: '1rem',
        fontWeight: 'bold',
        fontFamily: 'system-ui'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <i className="fa-solid fa-graduation-cap fa-spin" style={{ fontSize: '2.5rem' }}></i>
          <span>Oturum Hazırlanıyor...</span>
        </div>
      </div>
    );
  }

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

  return (
    <div className={`theme-wrapper ${theme} font-size-${fontSize} ${selectedCategory ? 'theme-' + selectedCategory : ''} ${sepiaActive ? 'sepia-filter' : ''} min-h-screen flex items-center justify-center p-0 md:p-4`}>

      <Confetti particles={confetti} />

      {customAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.25s ease-out'
        }} onClick={() => setCustomAlert(null)}>
          <div 
            style={{
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1.5px solid rgba(99, 102, 241, 0.4)',
              padding: '24px 32px',
              borderRadius: '24px',
              maxWidth: '420px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
              color: '#e2e8f0',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '800', 
              color: customAlert.type === 'error' ? '#f87171' : '#a5b4fc',
              marginBottom: '12px',
              marginTop: 0
            }}>
              {customAlert.title}
            </h3>
            <p style={{ 
              fontSize: '0.88rem', 
              color: '#f8fafc', 
              lineHeight: 1.6,
              marginBottom: '20px'
            }}>
              {customAlert.message}
            </p>
            <button
              onClick={() => setCustomAlert(null)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '0.85rem'
              }}
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {customConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div 
            style={{
              background: 'rgba(30, 41, 59, 0.98)',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              padding: '28px 32px',
              borderRadius: '24px',
              maxWidth: '440px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(239, 68, 68, 0.15)',
              color: '#e2e8f0',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50px',
              background: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#ef4444',
              fontSize: '1.6rem',
              border: '1.5px solid rgba(239, 68, 68, 0.3)'
            }}>
              ⚠️
            </div>
            
            <h3 style={{ 
              fontSize: '1.2rem', 
              fontWeight: '800', 
              color: '#fca5a5',
              marginBottom: '12px',
              marginTop: 0
            }}>
              {customConfirm.title}
            </h3>
            
            <p style={{ 
              fontSize: '0.88rem', 
              color: '#e2e8f0', 
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              {customConfirm.message}
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  customConfirm.onCancel?.();
                  setCustomConfirm(null);
                }}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold' }}
              >
                İptal
              </button>
              <button
                onClick={() => {
                  customConfirm.onConfirm();
                  setCustomConfirm(null);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      <TranslationPopover
        show={showPopover}
        position={popoverPosition}
        selectedText={selectedText}
        translating={translating}
        translationResult={translationResult}
        playSpeechAudio={playSpeechAudio}
        handleAddToNotebook={handleAddToNotebook}
        handleAskAI={handleAskAI}
        setShowPopover={setShowPopover}
      />

      <div className={`app-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar
          selectedCategory={selectedCategory}
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setSelectedCategory={setSelectedCategory}
          setSelectedExam={setSelectedExam}
          setQuizActive={setQuizActive}
          onLogout={handleLogout}
          vocabTrack={vocabTrack}
        />

        <div className="app-content-wrapper">
          {selectedCategory ? (
            <header className="app-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <button
                  className="desktop-sidebar-toggle-btn"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  title={sidebarCollapsed ? "Sol Paneli Aç" : "Sol Paneli Kapat"}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                >
                  <i className={`fa-solid ${sidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`} style={{ fontSize: '1rem' }}></i>
                </button>

                {activeTab === 'book-exercises' && bookSelectedDay ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                    <button 
                      className="glass-button" 
                      onClick={() => setBookSelectedDay(null)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer' }}
                    >
                      <i className="fa-solid fa-chevron-left" style={{ fontSize: '0.75rem' }}></i>
                      <span>Gün Listesi</span>
                    </button>
                    
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'white', fontFamily: 'var(--font-heading)' }}>
                      📚 {bookSelectedDay}. Gün
                    </h3>

                    <button 
                      onClick={() => {
                        const next = bookCompletedDays.includes(bookSelectedDay) 
                          ? bookCompletedDays.filter(d => d !== bookSelectedDay) 
                          : [...bookCompletedDays, bookSelectedDay];
                        setBookCompletedDays(next);
                        localStorage.setItem('completed_yds_days', JSON.stringify(next));
                      }}
                      className="glass-button"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '6px 12px', 
                        borderRadius: '10px',
                        border: bookCompletedDays.includes(bookSelectedDay) ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                        background: bookCompletedDays.includes(bookSelectedDay) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.02)',
                        color: bookCompletedDays.includes(bookSelectedDay) ? '#34d399' : 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        marginLeft: '24px'
                      }}
                    >
                      <i className="fa-solid fa-award" style={{ color: bookCompletedDays.includes(bookSelectedDay) ? '#10b981' : '#cbd5e1' }}></i>
                      <span>{bookCompletedDays.includes(bookSelectedDay) ? 'Tamamlandı' : 'Tamamlandı İşaretle'}</span>
                    </button>
                  </div>
                ) : (
                  <div 
                    className="category-back-btn" 
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
                    title={sidebarCollapsed ? "Sol Paneli Aç" : "Sol Paneli Kapat"}
                  >
                    <i className={`fa-solid ${sidebarCollapsed ? 'fa-indent' : 'fa-outdent'}`} style={{ fontSize: '0.82rem' }}></i>
                    <span className="mobile-hide-text" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-heading)' }}>
                      {sidebarCollapsed ? 'Sol Paneli Aç' : 'Sol Paneli Kapat'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mobile-header-mascot" onClick={() => { setActiveTab('settings'); setQuizActive(false); }} title="Mascot Odası">
                <MascotPet
                  state={mascotState}
                  speech={null}
                  customConfig={petConfig}
                  size={32}
                  isFloating={false}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isSyncing && (
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <i className="fa-solid fa-cloud-arrow-up animate-pulse"></i> Bulutla Eşleşiyor...
                  </span>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(249, 115, 22, 0.12)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  color: '#ff7a00',
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  boxShadow: '0 0 10px rgba(249, 115, 22, 0.25)',
                  marginRight: '4px'
                }}>
                  <span className="streak-flame-animated" style={{ display: 'inline-block' }}>🔥</span> {studyStreak} Gün
                </div>
                <button className="header-control-btn" id="theme-toggle-btn" onClick={() => setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light')} title="Tema Değiştir">
                  {theme === 'theme-light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
                <button className="header-control-btn" onClick={() => { setActiveTab('settings'); setQuizActive(false); }} title="Ayarlar" style={{ marginLeft: '2px' }}>
                  <i className="fa-solid fa-gear" style={{ fontSize: '0.85rem' }}></i>
                </button>
                {showAiFloatBtn && (
                  <button
                    className="header-control-btn"
                    onClick={() => {
                      setShowAiChat(prev => !prev);
                    }}
                    title="AI Asistanı Aç/Kapat 🦉"
                    style={{ marginLeft: '2px', background: 'rgba(99, 102, 241, 0.08)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                  >
                    🦉
                  </button>
                )}
              </div>
            </header>
          ) : (
            <header className="app-header">
              <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-brain-circuit brain-icon" id="app-logo-icon"></i>
                <span id="app-logo-title" className="font-heading">YÖKDİL Hazırlık</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="header-control-btn" id="theme-toggle-btn" onClick={() => setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light')}>
                  {theme === 'theme-light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
              </div>
            </header>
          )}

          <main className="app-main">

            {/* TAB 0: Course selection */}
            {!selectedCategory && (
              <section id="screen-landing" className="app-screen active">
                <div className="welcome-card landing-welcome text-left">
                  <h2>Merhaba, {currentUser.name}! 🎓</h2>
                  <p>Çalışmak istediğiniz YÖKDİL alanını seçerek hazırlığa başlayın.</p>
                </div>
                <div className="menu-list landing-menu">
                  <button className="menu-item subject-card ml-card" onClick={() => { setSelectedCategory('fen'); setActiveTab('dashboard'); setSelectedExam(null); setQuizActive(false); }}>
                    <div className="menu-icon subject-icon" style={{ borderColor: '#2B6CB0', color: '#4299E1' }}><i className="fa-solid fa-flask"></i></div>
                    <div className="menu-text" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <h4 style={{ margin: 0 }}>Fen Bilimleri</h4>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                  </button>
                  <button className="menu-item subject-card gai-card" onClick={() => { setSelectedCategory('sosyal'); setActiveTab('dashboard'); setSelectedExam(null); setQuizActive(false); }}>
                    <div className="menu-icon subject-icon" style={{ borderColor: '#805AD5', color: '#B794F4' }}><i className="fa-solid fa-gavel"></i></div>
                    <div className="menu-text" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <h4 style={{ margin: 0 }}>Sosyal Bilimler</h4>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                  </button>
                  <button className="menu-item subject-card ds-card" onClick={() => { setSelectedCategory('saglik'); setActiveTab('dashboard'); setSelectedExam(null); setQuizActive(false); }}>
                    <div className="menu-icon subject-icon" style={{ borderColor: '#059669', color: '#34D399' }}><i className="fa-solid fa-heart-pulse"></i></div>
                    <div className="menu-text" style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <h4 style={{ margin: 0 }}>Sağlık Bilimleri</h4>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                  </button>
                </div>
              </section>
            )}

            {/* TAB 1: Dashboard Home */}
            {selectedCategory && activeTab === 'dashboard' && (
              <section id="screen-dashboard" className="app-screen active">
                <style>{`
                  @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(3deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                  }
                `}</style>

                <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {/* Left Side: Welcome text */}
                  <div className="welcome-card text-left" style={{ flex: 1, minWidth: '280px', margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h2>Selam, {currentUser.name}! 👋</h2>
                      <p>YÖKDİL {selectedCategory === 'fen' ? 'Fen Bilimleri' : selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : selectedCategory === 'saglik' ? 'Sağlık Bilimleri' : 'Özelleştirilmiş Kelime Kampı'} hazırlık performansın aşağıda listelenmiştir.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.25)', padding: '10px 16px', borderRadius: '16px' }}>
                      <span style={{ fontSize: '1.8rem' }}>🔥</span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#ff7849' }}>{studyStreak} Gün Seri!</span>
                        <span style={{ fontSize: '0.62rem', color: '#fbd38d' }}>Harikasın! Seriyi bozma</span>
                      </div>
                    </div>
                  </div>

                  {/* YÖKDİL Countdown Card */}
                  <div className="glass-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '18px',
                    minWidth: '280px',
                    flex: '0.8',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(15, 23, 42, 0.2)',
                    textAlign: 'left'
                  }}>
                    {/* Circle Timer */}
                    <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="var(--primary-light)"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray="175.9"
                          strokeDashoffset={(() => {
                            if (!yokdilExamDate) return "175.9";
                            const examTime = new Date(yokdilExamDate).getTime();
                            const now = new Date().getTime();
                            const diff = examTime - now;
                            if (diff <= 0) return "0";
                            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                            const percent = Math.max(0, Math.min(100, (days / 120) * 100)); // assume 120 days max range
                            return (175.9 - (175.9 * percent) / 100).toFixed(1);
                          })()}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', fontSize: '0.78rem', fontWeight: '900', color: 'white' }}>
                        {(() => {
                          if (!yokdilExamDate) return "0";
                          const diff = new Date(yokdilExamDate).getTime() - new Date().getTime();
                          const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                          return days > 0 ? `${days}G` : "Sınav";
                        })()}
                      </div>
                    </div>

                    <div 
                      style={{ display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' }}
                      onClick={() => {
                        if (examDateInputRef.current) {
                          try {
                            examDateInputRef.current.showPicker();
                          } catch (e) {
                            examDateInputRef.current.click();
                          }
                        }
                      }}
                      title="Sınav tarihini belirlemek veya değiştirmek için tıklayın"
                    >
                      <span style={{ fontSize: '0.64rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YÖKDİL Geri Sayım ⏰ (Tıkla Seç)</span>
                      <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                        {yokdilExamDate ? (
                          <>
                            Hedef Sınav Tarihi: <strong>{new Date(yokdilExamDate).toLocaleDateString('tr-TR')}</strong>. Değiştirmek için tıklayın.
                          </>
                        ) : (
                          <>
                            <span style={{ color: '#fca5a5', fontWeight: 'bold' }}>Henüz sınav tarihi seçmediniz.</span> Seçmek için buraya tıklayın!
                          </>
                        )}
                      </p>
                      <input
                        type="date"
                        ref={examDateInputRef}
                        value={yokdilExamDate}
                        onChange={(e) => setYokdilExamDate(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Right Side: Bilge Baykuş Study Buddy Mascot */}
                  <div
                    className="glass-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px 20px',
                      borderRadius: '18px',
                      minWidth: '280px',
                      flex: '0.8',
                      border: `1px solid ${ROOM_BACKGROUNDS[petConfig.background]?.border || 'rgba(255, 255, 255, 0.05)'}`,
                      background: ROOM_BACKGROUNDS[petConfig.background]?.gradient || 'rgba(255,255,255,0.01)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MascotPet
                        state={mascotState}
                        speech={null}
                        customConfig={petConfig}
                        size={56 + Math.min(40, petLevel * 4)}
                        isFloating={false}
                      />
                    </div>
                    {/* Name & Speech */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'white' }}>
                        {petConfig.name || 'Bilge'}
                      </span>

                      <p style={{ fontSize: '0.74rem', color: '#e2e8f0', margin: 0, fontStyle: 'italic', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {(() => {
                          const solvedAll = dailyQuestionsSolved >= 20 && dailyWordsStudied >= 10 && dailyLecturesStudied >= 1;
                          if (solvedAll) return "İnanılmazsın! Bugünün tüm hedeflerini tamamladın. Yarın da bu seriyi devam ettirelim! 🔥";
                          if (dailyQuestionsSolved > 0 || dailyWordsStudied > 0 || dailyLecturesStudied > 0) return "Harika gidiyorsun! Günlük hedefleri tamamlamaya çok az kaldı, pes etme! 💪";
                          return "Bugün henüz ders çalışmadın. Haydi, ilk kelimeni öğrenerek başlayalım! 📖";
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QUICK FLASHCARD WIDGET */}
                <div className="glass-card text-left" style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(99, 102, 241, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '480px' }}>
                    <span style={{ fontSize: '0.64rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 Hızlı Kelime Hatırlatıcısı (Spaced Repetition)</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>
                      {(() => {
                        const wordsInNotebook = notebook || [];
                        if (wordsInNotebook.length > 0) {
                          const word = wordsInNotebook[0];
                          return `"${word.english}" kelimesinin Türkçe anlamını hatırlıyor musunuz?`;
                        }
                        return `"${"mitigate"}" kelimesinin Türkçe anlamını hatırlıyor musunuz?`;
                      })()}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      const wordsInNotebook = notebook || [];
                      if (wordsInNotebook.length > 0) {
                        setSpacedRepetitionModalWord(wordsInNotebook[0]);
                      } else {
                        setSpacedRepetitionModalWord({ english: 'mitigate', turkish: 'hafifletmek, azaltmak' });
                      }
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Anlamı Gör 👀
                  </button>
                </div>

                {/* DAILY GOALS PANEL */}
                <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🎯 Günlük Hedefleriniz
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Goal 1: Questions */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '600', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-main)' }}>Soru Çözme Hedefi (Günlük)</span>
                        <span style={{ color: dailyQuestionsSolved >= dailyQuestionGoal ? '#34d399' : 'var(--text-secondary)', fontWeight: '700' }}>
                          {dailyQuestionsSolved} / {dailyQuestionGoal} {dailyQuestionsSolved >= dailyQuestionGoal && '✓'}
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (dailyQuestionsSolved / dailyQuestionGoal) * 100)}%`,
                          background: dailyQuestionsSolved >= dailyQuestionGoal ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Goal 2: Words */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '600', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-main)' }}>Kelime Çalışma Hedefi (Günlük)</span>
                        <span style={{ color: dailyWordsStudied >= dailyWordGoal ? '#34d399' : 'var(--text-secondary)', fontWeight: '700' }}>
                          {dailyWordsStudied} / {dailyWordGoal} {dailyWordsStudied >= dailyWordGoal && '✓'}
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (dailyWordsStudied / dailyWordGoal) * 100)}%`,
                          background: dailyWordsStudied >= dailyWordGoal ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Goal 3: Lectures */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '600', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-main)' }}>Ders Tamamlama Hedefi (Günlük)</span>
                        <span style={{ color: dailyLecturesStudied >= 1 ? '#34d399' : 'var(--text-secondary)', fontWeight: '700' }}>
                          {dailyLecturesStudied} / 1 {dailyLecturesStudied >= 1 && '✓'}
                        </span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(100, (dailyLecturesStudied / 1) * 100)}%`,
                          background: dailyLecturesStudied >= 1 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  </div>

                  {dailyQuestionsSolved >= dailyQuestionGoal && dailyWordsStudied >= dailyWordGoal && dailyLecturesStudied >= 1 && (
                    <div style={{
                      marginTop: '16px',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      color: '#34d399',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      🎉 Tebrikler! Bugünün tüm hedeflerini tamamlayıp rozet kazandınız!
                    </div>
                  )}
                </div>

                {/* DAILY QUESTS & LEADERBOARD GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                  {/* Daily Quests Card */}
                  <div className="glass-card p-5 border border-white/5 rounded-2xl text-left" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🎯 Günlük Görevleriniz
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { name: 'Soru Havuzunu Erit', desc: 'Bugün en az 10 soru çözün.', progress: dailyQuestionsSolved, target: 10, reward: '+50 Kristal' },
                        { name: 'Akademik Kelime Çalış', desc: 'Bugün en az 5 kelime çalışın.', progress: dailyWordsStudied, target: 5, reward: '+20 Kristal' },
                        { name: 'Konu Anlatımı Oku', desc: 'Bugün en az 1 ders notu tamamlayın.', progress: dailyLecturesStudied, target: 1, reward: '+100 Kristal' }
                      ].map((quest, idx) => {
                        const isDone = quest.progress >= quest.target;
                        return (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: isDone ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.01)', border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)'}`, borderRadius: '12px', opacity: isDone ? 0.75 : 1 }}>
                            <div>
                              <h4 style={{ fontSize: '0.76rem', fontWeight: 'bold', color: isDone ? '#34d399' : 'white', textDecoration: isDone ? 'line-through' : 'none' }}>{quest.name}</h4>
                              <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{quest.desc}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: isDone ? '#34d399' : 'var(--primary-light)' }}>
                                {isDone ? 'Tamamlandı ✓' : `${quest.progress}/${quest.target}`}
                              </span>
                              <div style={{ fontSize: '0.55rem', color: '#fbbf24', fontWeight: 'bold' }}>{quest.reward}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Yesterday's Study Report Card */}
                  <div className="glass-card p-5 border border-white/5 rounded-2xl text-left" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      📅 Dünkü Çalışma Raporunuz
                    </h3>
                    {(() => {
                      const yesterday = new Date();
                      yesterday.setDate(yesterday.getDate() - 1);
                      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
                      const raw = localStorage.getItem('yokdil_study_history');
                      const history = raw ? JSON.parse(raw) : {};
                      const logs = history[yesterdayStr] || { questions: 0, words: 0, games: 0, paragraphs: 0 };
                      const total = (logs.questions || 0) + (logs.words || 0) + (logs.games || 0) + (logs.paragraphs || 0);

                      if (total === 0) {
                        return (
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '24px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span>Dün çalışma kaydı bulunmuyor.</span>
                            <span style={{ fontSize: '0.7rem', color: '#818cf8', marginTop: '6px' }}>Bugün harika bir başlangıç yapalım! 💪</span>
                          </div>
                        );
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Çözülen Soru</span>
                            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#6366f1' }}>{logs.questions || 0} Adet</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Çalışılan Kelime</span>
                            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#10b981' }}>{logs.words || 0} Adet</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Okunan Paragraf</span>
                            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#fbbf24' }}>{logs.paragraphs || 0} Adet</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                            <span style={{ fontSize: '0.76rem', color: 'white', fontWeight: 'bold' }}>Toplam Aktivite</span>
                            <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#a5b4fc' }}>{total} Eylem</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* ACHIEVEMENTS ROZETLER & WARDROBE CABINET */}
                <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏆 Başarı Rozetleriniz & Koleksiyonunuz
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '6px' }}>
                     {getAchievementsList().map(ach => {
                      const tier = getAchievementTier(ach.id, ach.value, ach.target);
                      return (
                        <div
                          key={ach.id}
                          style={{
                            background: tier.completed ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                            border: tier.completed ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
                            padding: '14px 12px',
                            borderRadius: '14px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{tier.completed ? '🌟' : '🔒'}</div>
                            <h4 style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0' }}>{ach.name}</h4>
                            <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: '1.2' }}>{ach.desc}</p>
                          </div>

                          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', fontWeight: 'bold' }}>
                              <span style={{ color: tier.completed ? '#cbd5e1' : 'var(--text-secondary)' }}>{tier.tierName}</span>
                              <span style={{ color: 'var(--text-secondary)' }}>{ach.value} / {tier.nextTarget}</span>
                            </div>
                            <div style={{ height: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${tier.progress}%`, background: 'linear-gradient(90deg, #6366f1, #a5b4fc)', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* WARDROBE CABINET: SELECT MASCOT OUTFITS */}
                <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🦉 Maskot Gardırobu & Özelleştirme
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '14px', textAlign: 'left' }}>
                    Bilge Baykuş maskotunuza dilediğiniz kıyafeti seçin ve aktif görünümünü anında özelleştirin!
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    {[
                      { key: 'default', name: 'Standart Baykuş', emoji: '🦉' },
                      { key: 'wizard', name: 'Büyücü Baykuş', emoji: '🧙‍♂️' },
                      { key: 'scientist', name: 'Bilim İnsanı', emoji: '👨‍🔬' },
                      { key: 'king', name: 'Kral Baykuş', emoji: '👑' },
                      { key: 'scholar', name: 'Mezun Baykuş', emoji: '🎓' }
                    ].map(outfit => {
                      const isActive = activeOutfit === outfit.key;

                      return (
                        <div
                          key={outfit.key}
                          style={{
                            background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isActive ? '#6366f1' : 'rgba(255,255,255,0.05)'}`,
                            padding: '12px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: isActive ? '0 0 10px rgba(99, 102, 241, 0.2)' : 'none'
                          }}
                        >
                          <div style={{ fontSize: '1.8rem' }}>{outfit.emoji}</div>
                          <div>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0' }}>{outfit.name}</h4>
                          </div>

                          {isActive ? (
                            <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '6px' }}>Aktif</span>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveOutfit(outfit.key);
                                localStorage.setItem('yokdil_active_outfit', outfit.key);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer border-none"
                            >
                              Giy
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>


                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon correct"><i className="fa-solid fa-circle-check"></i></div>
                    <div className="stat-info">
                      <span className="stat-val">{stats.correct}</span>
                      <span className="stat-lbl">Doğru Cevap</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon wrong"><i className="fa-solid fa-circle-xmark"></i></div>
                    <div className="stat-info">
                      <span className="stat-val">{stats.wrong}</span>
                      <span className="stat-lbl">Yanlış Cevap</span>
                    </div>
                  </div>
                  <div className="stat-card full-width">
                    <div className="progress-ring-container">
                      <div className="circular-progress" style={{ background: `conic-gradient(var(--primary-light) ${stats.solved > 0 ? (stats.correct / stats.solved) * 360 : 0}deg, var(--border-color) 0deg)` }}>
                        <span className="progress-value">{stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0}%</span>
                      </div>
                    </div>
                    <div className="progress-info text-left">
                      <h3>Genel Başarı Oranın</h3>
                      <p>{stats.solved > 0 ? `Toplam ${stats.solved} soru çözdünüz. Başarı yüzdeniz %${Math.round((stats.correct / stats.solved) * 100)}.` : 'Henüz test çözmeye başlamadın.'}</p>
                    </div>
                  </div>
                </div>

                <div className="action-card text-left" onClick={() => setActiveTab('tests')} style={{ marginBottom: '15px' }}>
                  <div className="action-content">
                    <h3><Play className="h-4 w-4 inline mr-1" /> Sınav Çözmeye Başla</h3>
                    <p>YÖKDİL çıkmış sınavlarını çözmeye başla.</p>
                  </div>
                  <i className="fa-solid fa-chevron-right arrow-icon"></i>
                </div>
              </section>
            )}

            {/* TAB 2: Tests view */}
            {selectedCategory && activeTab === 'tests' && !quizActive && (
              <section id="screen-tests" className="app-screen active text-left">
                {!selectedExam ? (
                  <div className="space-y-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div className="section-title" style={{ margin: 0 }}>
                        <h2>YÖKDİL Sınav ve Konu Listesi</h2>
                        <p>Yıllara göre deneme çözün veya konulara göre ayrılmış soru havuzundan pratik yapın.</p>
                      </div>
                      <a
                        href={`${BACKEND_URL}/pdfs/YOKDIL_Temiz_Soru_Kitapcigi.pdf`}
                        download="YOKDIL_Temiz_Soru_Kitapcigi.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary flex items-center gap-2"
                        style={{
                          textDecoration: 'none',
                          padding: '10px 18px',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#fff',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <i className="fa-solid fa-file-pdf"></i> Tüm Testi İndir
                      </a>
                    </div>

                    {/* Subtabs years vs topics */}
                    <div className="tab-buttons" style={{ marginBottom: '12px' }}>
                      <button
                        onClick={() => setSelectedTestTab('years')}
                        className={`tab-btn ${selectedTestTab === 'years' ? 'active' : ''}`}
                      >
                        📅 Yıllara Göre
                      </button>
                      <button
                        onClick={() => setSelectedTestTab('topics')}
                        className={`tab-btn ${selectedTestTab === 'topics' ? 'active' : ''}`}
                      >
                        🧬 Konulara Göre
                      </button>
                    </div>

                    {selectedTestTab === 'years' ? (
                      exams && exams.length > 0 ? (
                        <div className="menu-list" style={{ marginTop: '8px' }}>
                          {exams.map(ex => {
                            const examAns = JSON.parse(localStorage.getItem(`answers_${ex.id}`)) || {};
                            const solvedCount = Object.keys(examAns).length;
                            return (
                              <div
                                key={ex.id}
                                className="menu-item"
                                onClick={() => { handleSelectExam(ex); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px 20px' }}
                              >
                                <div className="menu-icon subject-icon" style={{ borderColor: 'var(--primary)', color: 'var(--primary-light)' }}><i className="fa-solid fa-file-invoice"></i></div>
                                <div className="menu-text" style={{ flex: 1 }}>
                                  <h4 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ex.name}</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>80 Soru | Çözülen: {solvedCount}/80</p>
                                </div>
                                <i className="fa-solid fa-chevron-right arrow-icon" style={{ opacity: 0.6 }}></i>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="empty-state text-center py-16 text-slate-500">
                          <p style={{ fontSize: '0.85rem' }}>Bu kategori için sınav kaydı bulunmamaktadır.</p>
                        </div>
                      )
                    ) : (
                      // Topics list view
                      <div className="menu-list" style={{ marginTop: '8px' }}>
                        {topicsList.map(topic => (
                          <button
                            key={topic.key}
                            onClick={() => startTopicQuizSession(topic.key)}
                            className="menu-item"
                          >
                            <div className="menu-icon subject-icon" style={{ borderColor: 'var(--primary)', color: 'var(--primary-light)' }}><i className="fa-solid fa-graduation-cap"></i></div>
                            <div className="menu-text">
                              <h4>{topic.name}</h4>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{topic.range} havuzu</p>
                            </div>
                            <i className="fa-solid fa-chevron-right arrow-icon"></i>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <div className="section-title" style={{ margin: 0 }}>
                        <h2>{selectedExam.name}</h2>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sınav içeriğini çalışın ve performans raporunuzu inceleyin.</p>
                      </div>
                      <button
                        onClick={() => setSelectedExam(null)}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <i className="fa-solid fa-arrow-left"></i> Sınav Listesine Dön
                      </button>
                    </div>

                    {/* Sub-Tab Navigation */}
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
                      <button
                        onClick={() => setExamDetailTab('list')}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: examDetailTab === 'list' ? 'var(--primary-gradient)' : 'transparent',
                          color: examDetailTab === 'list' ? 'white' : 'var(--text-secondary)',
                          boxShadow: examDetailTab === 'list' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                          border: 'none'
                        }}
                      >
                        📝 Soru Listesi
                      </button>
                      <button
                        onClick={() => setExamDetailTab('performance')}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          fontSize: '0.82rem',
                          fontWeight: '800',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: examDetailTab === 'performance' ? 'var(--primary-gradient)' : 'transparent',
                          color: examDetailTab === 'performance' ? 'white' : 'var(--text-secondary)',
                          boxShadow: examDetailTab === 'performance' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                          border: 'none'
                        }}
                      >
                        📊 Sınav Performansı
                      </button>
                    </div>

                    {examDetailTab === 'list' ? (
                      <>
                        {/* Header Columns */}
                        <div className="glass-card" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '0.78rem', borderBottom: '1px solid var(--border-color)', margin: '12px 0 6px 0' }}>
                          <div
                            onClick={() => {
                              if (examQuestionSort === 'number') {
                                setExamQuestionSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setExamQuestionSort('number');
                                setExamQuestionSortDir('asc');
                              }
                            }}
                            style={{ flex: 1.5, cursor: 'pointer', userSelect: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            Soru Numarası {examQuestionSort === 'number' ? (examQuestionSortDir === 'asc' ? '🔼' : '🔽') : '🔹'}
                          </div>
                          <div
                            onClick={() => {
                              if (examQuestionSort === 'correct') {
                                setExamQuestionSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setExamQuestionSort('correct');
                                setExamQuestionSortDir('desc');
                              }
                            }}
                            style={{ flex: 1, cursor: 'pointer', userSelect: 'none', color: '#48BB78', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            Doğru Sayısı {examQuestionSort === 'correct' ? (examQuestionSortDir === 'asc' ? '🔼' : '🔽') : '🔹'}
                          </div>
                          <div
                            onClick={() => {
                              if (examQuestionSort === 'wrong') {
                                setExamQuestionSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                              } else {
                                setExamQuestionSort('wrong');
                                setExamQuestionSortDir('desc');
                              }
                            }}
                            style={{ flex: 1, cursor: 'pointer', userSelect: 'none', color: '#F56565', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                          >
                            Yanlış Sayısı {examQuestionSort === 'wrong' ? (examQuestionSortDir === 'asc' ? '🔼' : '🔽') : '🔹'}
                          </div>
                          <div style={{ flex: 1.2, textAlign: 'right' }}>
                            <button
                              onClick={() => startCustomExamSession(0, getSortedQuestionNumbers(selectedExam.id))}
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.72rem', cursor: 'pointer' }}
                            >
                              🚀 Tümünü Çöz
                            </button>
                          </div>
                        </div>

                        {/* Vertical List of Rows */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                          {getSortedQuestionNumbers(selectedExam.id).map((qNum, idx, arr) => {
                            const stats = questionStats[selectedExam.id]?.[qNum] || { correct: 0, wrong: 0 };
                            return (
                              <div
                                key={qNum}
                                onClick={() => startCustomExamSession(idx, arr)}
                                className="glass-card"
                                style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px', fontSize: '0.82rem' }}
                              >
                                <span style={{ flex: 1.5, fontWeight: '700', color: 'var(--text-main)' }}>Soru {qNum}</span>
                                <span style={{ flex: 1, color: '#48BB78', fontWeight: '600', textAlign: 'center' }}>✔️ {stats.correct} Doğru</span>
                                <span style={{ flex: 1, color: '#F56565', fontWeight: '600', textAlign: 'center' }}>❌ {stats.wrong} Yanlış</span>
                                <span style={{ flex: 1.2, textAlign: 'right', color: 'var(--primary-light)', fontWeight: 'bold' }}>
                                  Çöz <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', marginLeft: '4px' }}></i>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      (() => {
                        const examAnswers = answers || {};
                        let solvedCount = 0;
                        let correctCount = 0;
                        let wrongCount = 0;

                        selectedExam.questions.forEach(q => {
                          const userAns = examAnswers[q.number];
                          if (userAns !== undefined) {
                            solvedCount++;
                            const correctAns = q.correct_option || selectedExam.answers?.[q.number - 1];
                            const isCorrect = userAns === correctAns;
                            if (isCorrect) correctCount++;
                            else wrongCount++;
                          }
                        });

                        const successRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;

                        const incorrectQuestions = selectedExam.questions.filter(q => {
                          const userAns = examAnswers[q.number];
                          const correctAns = q.correct_option || selectedExam.answers?.[q.number - 1];
                          return userAns !== undefined && userAns !== correctAns;
                        });

                        return (
                          <div className="space-y-4">
                            {/* Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Çözülen Soru</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: 'var(--text-main)' }}>{solvedCount} / 80</div>
                              </div>
                              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Doğru Sayısı</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: '#48BB78' }}>{correctCount}</div>
                              </div>
                              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Yanlış Sayısı</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: '#F56565' }}>{wrongCount}</div>
                              </div>
                              <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Başarı Oranı</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: 'var(--primary-light)' }}>%{successRate}</div>
                              </div>
                            </div>

                            {/* Incorrect Questions revision list */}
                            <div className="glass-card" style={{ padding: '18px', borderRadius: '14px' }}>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ❌ Hatalı Çözdüğünüz Sorular ({incorrectQuestions.length})
                              </h4>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                                Hata yaptığınız sorular aşağıda listelenmiştir. Doğrudan soruya tıklayarak yapay zeka analizi ile tekrar çözebilirsiniz.
                              </p>

                              {incorrectQuestions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '24px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                  {solvedCount === 0 ? "Henüz soru çözülmedi." : "Harika! Bu sınavda hiç hatalı sorunuz yok. 🎉"}
                                </div>
                              ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                                  {incorrectQuestions.map(q => {
                                    const sortedArr = getSortedQuestionNumbers(selectedExam.id);
                                    const idx = sortedArr.indexOf(q.number);
                                    return (
                                      <button
                                        key={q.number}
                                        onClick={() => startCustomExamSession(idx, sortedArr)}
                                        className="btn-secondary"
                                        style={{ padding: '10px', fontSize: '0.78rem', cursor: 'pointer', borderRadius: '8px', borderColor: 'rgba(245, 101, 101, 0.2)', color: '#FEB2B2', background: 'rgba(245, 101, 101, 0.03)' }}
                                      >
                                        Soru {q.number}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}
              </section>
            )}

            {/* TAB 2: ACTIVE QUIZ SECTION */}
            <QuizSection
              selectedExam={selectedExam}
              quizActive={quizActive}
              setQuizActive={setQuizActive}
              quizQuestions={quizQuestions}
              currentQuizIndex={currentQuizIndex}
              setCurrentQuizIndex={setCurrentQuizIndex}
              flagged={flagged}
              handleToggleFlag={handleToggleFlag}
              playSpeechAudio={playSpeechAudio}
              fontSize={fontSize}
              handleTextSelection={handleTextSelection}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              answers={answers}
              handleSaveAnswer={handleSaveAnswer}
              activeExplanation={activeExplanation}
              renderMarkdown={renderMarkdown}
              handleSubmitExam={handleSubmitExam}
              timerIntervalRef={timerIntervalRef}
              setExamRunning={setExamRunning}
              mascotState={mascotState}
              setMascotState={setMascotState}
              mascotSpeech={mascotSpeech}
              setMascotSpeech={setMascotSpeech}
              questionTimeSpent={questionTimeSpent}
            />

            {/* TAB 3: VOCABULARY SECTION (SWAPPED WITH KELİME KAMPI) */}
            {selectedCategory && activeTab === 'vocabulary' && (
              <section id="screen-vocabulary-camp" className="app-screen active animate-fade-in">
                <CampSection
                  key="vocabulary-camp"
                  initialCampType="cikmis_kelimeler"
                  selectedCategory={selectedCategory}
                  awardPetXP={awardPetXP}
                  triggerConfetti={triggerConfetti}
                  examsDb={{ fen: fallbackExamsFen, sosyal: fallbackExamsSosyal, saglik: fallbackExamsSaglik }}
                  dictDb={{ fen: fallbackDictFen, sosyal: fallbackDictSosyal, saglik: fallbackDictSaglik }}
                  recordWordStat={recordWordStat}
                  addMistake={addMistake}
                  setIsStudyingActive={setIsStudyingActive}
                />
              </section>
            )}

            {/* TAB 3.5: PARAGRAPHS SECTION */}
            <ParagraphsSection
              activeTab={activeTab}
              selectedCategory={selectedCategory}
              BACKEND_URL={BACKEND_URL}
              incrementDailyQuestions={incrementDailyQuestions}
              incrementDailyWords={incrementDailyWords}
              playSpeechAudio={playSpeechAudio}
              notebook={notebook}
              handleAddCustomWord={handleAddCustomWord}
              logStudyActivity={logStudyActivity}
              addMistake={addMistake}
              setIsStudyingActive={setIsStudyingActive}
            />

            {/* TAB 3.6: YDS BOOK EXERCISES SECTION */}
            <BookExerciseSection
              activeTab={activeTab}
              playSpeechAudio={playSpeechAudio}
              BACKEND_URL={BACKEND_URL}
              selectedDay={bookSelectedDay}
              setSelectedDay={setBookSelectedDay}
              completedDays={bookCompletedDays}
              setCompletedDays={setBookCompletedDays}
              addMistake={addMistake}
              setIsStudyingActive={setIsStudyingActive}
            />

            {/* TAB 4: LECTURES SECTION */}
            <LecturesSection
              activeTab={activeTab}
              lecturesList={lecturesList}
              activeLecture={activeLecture}
              handleLoadLecture={handleLoadLecture}
              lectureLoading={lectureLoading}
              renderMarkdown={renderMarkdown}
              startTopicQuiz={startTopicQuizSession}
              lectureProgress={lectureProgress}
              handleToggleLectureProgress={handleToggleLectureProgress}
              grammarNotes={grammarNotes}
              handleSaveGrammarNote={handleSaveGrammarNote}
              handleDeleteGrammarNote={handleDeleteGrammarNote}
              BACKEND_URL={BACKEND_URL}
              incrementDailyQuestions={incrementDailyQuestions}
              incrementDailyLectures={incrementDailyLectures}
              handleTextSelection={handleTextSelection}
              selectedCategory={selectedCategory}
              setIsStudyingActive={setIsStudyingActive}
            />

             <MistakeInbox
              activeTab={activeTab}
              mistakes={mistakes}
              setMistakes={setMistakes}
              exams={exams}
              playSpeechAudio={playSpeechAudio}
              renderMarkdown={renderMarkdown}
              activeExplanation={activeExplanation}
              loadQuestionExplanation={loadQuestionExplanation}
              setActiveExplanation={setActiveExplanation}
              wordStats={wordStats}
              vocabPracticeList={vocabPracticeList}
              notebook={notebook}
              recordWordStat={recordWordStat}
              questionStats={questionStats}
            />

            {/* TAB 7: PERFORMANCE SECTION */}
            <PerformanceSection
              activeTab={activeTab}
              selectedExam={selectedExam}
              exams={exams}
              answers={answers}
              getStats={getStats}
              setActiveTab={handleSetActiveTab}
              wordStats={wordStats}
              vocabPracticeList={vocabPracticeList}
              notebook={notebook}
              logStudyActivity={logStudyActivity}
            />


            {/* TAB 7.5: EVCİL HAYVANIM SECTION */}
            <PetSection
              activeTab={activeTab}
              petXp={petXp}
              petLevel={petLevel}
              petConfig={petConfig}
              setPetConfig={setPetConfig}
            />

            {/* TAB 7.55: SMART STUDY SECTION */}
            {selectedCategory && activeTab === 'smart-study' && (
              <section id="screen-smart-study" className="app-screen active animate-fade-in">
                <SmartStudySection
                  selectedCategory={selectedCategory}
                  awardPetXP={awardPetXP}
                  triggerConfetti={triggerConfetti}
                  addMistake={addMistake}
                  activeTab={activeTab}
                />
              </section>
            )}
 
            {/* TAB 7.56: DEVELOPED VOCABULARY CAMP SECTION */}
            {selectedCategory && activeTab === 'camp-vocab' && (
              <section id="screen-camp-vocab" className="app-screen active animate-fade-in">
                <CampSection
                  key="camp-vocab"
                  initialCampType="vocabulary"
                  hideSwitcher={true}
                  selectedCategory={selectedCategory}
                  awardPetXP={awardPetXP}
                  triggerConfetti={triggerConfetti}
                  examsDb={{ fen: fallbackExamsFen, sosyal: fallbackExamsSosyal, saglik: fallbackExamsSaglik }}
                  dictDb={{ fen: fallbackDictFen, sosyal: fallbackDictSosyal, saglik: fallbackDictSaglik }}
                  recordWordStat={recordWordStat}
                  addMistake={addMistake}
                  setIsStudyingActive={setIsStudyingActive}
                  vocabTrack={vocabTrack}
                  setVocabTrack={setVocabTrack}
                />
              </section>
            )}

            {/* TAB 7.57: GRAMMAR CAMP SECTION */}
            {selectedCategory && activeTab === 'camp-grammar' && (
              <section id="screen-camp-grammar" className="app-screen active animate-fade-in">
                <CampSection
                  key="camp-grammar"
                  initialCampType="grammar"
                  hideSwitcher={true}
                  selectedCategory={selectedCategory}
                  awardPetXP={awardPetXP}
                  triggerConfetti={triggerConfetti}
                  examsDb={{ fen: fallbackExamsFen, sosyal: fallbackExamsSosyal, saglik: fallbackExamsSaglik }}
                  dictDb={{ fen: fallbackDictFen, sosyal: fallbackDictSosyal, saglik: fallbackDictSaglik }}
                  recordWordStat={recordWordStat}
                  addMistake={addMistake}
                  setIsStudyingActive={setIsStudyingActive}
                  vocabTrack={vocabTrack}
                  setVocabTrack={setVocabTrack}
                />
              </section>
            )}

            {/* TAB 7.6: MINI OYUNLAR SECTION */}
            {selectedCategory && activeTab === 'games' && (
              <section id="screen-games" className="app-screen active">
                <GamesSection
                  selectedCategory={selectedCategory}
                  awardPetXp={awardPetXp}
                  activeTab={activeTab}
                  setIsStudyingActive={setIsStudyingActive}
                />
              </section>
            )}

            {/* TAB 7.7: ACHIEVEMENTS (BAŞARIMLAR) SECTION */}
            {selectedCategory && activeTab === 'achievements' && (
              <section id="screen-achievements" className="app-screen active space-y-6">
                <div style={{ padding: '0 8px', textAlign: 'left', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
                    AKADEMİK BAŞARILARINIZ
                  </span>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
                    🏆 Başarı Rozetleriniz & Koleksiyonunuz
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
                    Soru çözerek, kelime ezberleyerek ve günlük serinizi devam ettirerek kilitleri açın ve ödüller kazanın!
                  </p>
                </div>

                {/* Filters Row */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  padding: '0 8px',
                  marginBottom: '8px'
                }}>
                  {/* Category Filter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#94a3b8' }}>Kategori Seçin</label>
                    <select
                      value={achievementCategoryFilter}
                      onChange={(e) => setAchievementCategoryFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(15,23,42,0.6)',
                        color: 'white',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all">Tüm Kategoriler 📂</option>
                      <option value="first_step">Soru Avcısı 🏁</option>
                      <option value="correct_strike">İsabet Şampiyonu 🎯</option>
                      <option value="word_master">Kelime Sihirbazı 🦁</option>
                      <option value="grammar_master">Dilbilgisi Ustası 📚</option>
                      <option value="on_fire">Günlük Seri 🔥</option>
                      <option value="gem_collector">Cevher Koleksiyoneri 💎</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#94a3b8' }}>Durum</label>
                    <select
                      value={achievementStatusFilter}
                      onChange={(e) => setAchievementStatusFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 'bold',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(15,23,42,0.6)',
                        color: 'white',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all">Tümü (Hepsi) 🌟</option>
                      <option value="completed">Başarılanlar ✔️</option>
                      <option value="incomplete">Başarılmayanlar 🔒</option>
                    </select>
                  </div>
                </div>

                <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(251, 191, 36, 0.15)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                    {getFilteredAchievements().map(ach => {
                      const tier = ach.tier;
                      return (
                        <div
                          key={ach.id}
                          style={{
                            background: tier.completed ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                            border: tier.completed ? '1.5px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                            padding: '24px 20px',
                            borderRadius: '18px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '2.5rem', marginBottom: '12px', filter: tier.completed ? 'none' : 'grayscale(100%) opacity(0.5)' }}>
                              {tier.completed ? '🏆' : '🔒'}
                            </div>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', margin: '0 0 6px 0' }}>{ach.name}</h4>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>{ach.desc}</p>
                          </div>

                          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 'bold' }}>
                              <span style={{ color: tier.completed ? '#fbbf24' : '#64748b' }}>{tier.tierName}</span>
                              <span style={{ color: '#94a3b8' }}>{ach.value} / {tier.nextTarget}</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${tier.progress}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '4px' }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* TAB 8: SETTINGS SECTION */}
            <SettingsSection
              activeTab={activeTab}
              fontSize={fontSize}
              setFontSize={setFontSize}
              theme={theme}
              setTheme={setTheme}
              handleResetProgress={handleResetProgress}
              selectedExam={selectedExam}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={handleLogout}
              token={token}
              BACKEND_URL={BACKEND_URL}
              speechRate={speechRate}
              setSpeechRate={setSpeechRate}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              dailyQuestionGoal={dailyQuestionGoal}
              setDailyQuestionGoal={setDailyQuestionGoal}
              dailyWordGoal={dailyWordGoal}
              setDailyWordGoal={setDailyWordGoal}
              autoPronounceEnabled={autoPronounceEnabled}
              setAutoPronounceEnabled={setAutoPronounceEnabled}
              handleResetAllProgress={handleResetAllProgress}
              yokdilExamDate={yokdilExamDate}
              setYokdilExamDate={setYokdilExamDate}
              chatbotName={chatbotName}
              setChatbotName={setChatbotName}
              setSelectedCategory={setSelectedCategory}
              setSelectedExam={setSelectedExam}
              showAiFloatBtn={showAiFloatBtn}
              setShowAiFloatBtn={setShowAiFloatBtn}
            />


          </main>
        </div>
      </div>
      {showDeviceLinkModal && deviceLinkInfo && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-card text-center" style={{ maxWidth: '420px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="landing-gate-logo" style={{ marginBottom: '4px', background: 'rgba(99, 102, 241, 0.15)', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '24px', color: 'var(--primary-light)', margin: '0 auto' }}>
              <i className="fa-solid fa-link"></i>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Cihaz Bağlantısı Algılandı! 🔗
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0' }}>
              <strong>{deviceLinkInfo.name}</strong> profiliyle bağlantı isteği algılandı. Lütfen veri aktarım yönünü seçin:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
              <button
                onClick={handlePullDeviceData}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                📥 Diğer Cihazdaki Verileri Bu Cihaza Al
              </button>
              <button
                onClick={handlePushDeviceData}
                className="btn-secondary"
                style={{ width: '100%', padding: '12px', fontSize: '0.8rem', cursor: 'pointer', borderColor: 'var(--primary-light)' }}
              >
                📤 Bu Cihazdaki Verileri Diğer Cihaza Yaz
              </button>
              <button
                onClick={() => {
                  setShowDeviceLinkModal(false);
                  setDeviceLinkInfo(null);
                }}
                className="btn-secondary"
                style={{ width: '100%', padding: '10px', fontSize: '0.75rem', cursor: 'pointer', opacity: 0.8 }}
              >
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
      {spacedRepetitionModalWord && (
        <div
          className="auth-modal-overlay"
          style={{ zIndex: 100000 }}
          onClick={() => setSpacedRepetitionModalWord(null)}
        >
          <div
            className="auth-modal-card text-center"
            style={{
              maxWidth: '380px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-10px -10px 0 0' }}>
              <button
                onClick={() => setSpacedRepetitionModalWord(null)}
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '10px 0' }}>
              <span style={{ fontSize: '0.64rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#a5b4fc', letterSpacing: '0.05em' }}>KELİME VE ANLAMI</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', margin: '8px 0 2px 0' }}>
                {spacedRepetitionModalWord.english}
              </h3>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#34d399', marginTop: '12px' }}>
                {spacedRepetitionModalWord.turkish}
              </div>
            </div>

            <button
              onClick={() => setSpacedRepetitionModalWord(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
      {pendingLevelUp && !quizActive && !isStudyingActive && (
        <div className="auth-modal-overlay" style={{ zIndex: 100002 }} onClick={() => setPendingLevelUp(null)}>
          <div 
            className="auth-modal-card text-center" 
            style={{ 
              maxWidth: '400px', 
              padding: '32px 24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '20px', 
              background: 'rgba(15, 23, 42, 0.98)', 
              border: '2px solid #fb923c',
              boxShadow: '0 0 30px rgba(251, 146, 96, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '3rem' }}>🎉🏆</div>
            
            <div>
              <span style={{ fontSize: '0.64rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#fb923c', letterSpacing: '0.1em' }}>TEBRİKLER! SEVİYE ATLADINIZ</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'white', margin: '8px 0 4px 0' }}>
                Yeni Büyüme Evresi! 🚀
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Evcil hayvanınız akademik kelimeleri öğrendikçe büyüyor!
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '10px 0' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block' }}>Eski Seviye</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#94a3b8' }}>{pendingLevelUp.oldLevel}</span>
              </div>
              <div style={{ fontSize: '1.5rem', color: '#fb923c' }}>➡️</div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.62rem', color: '#fb923c', display: 'block', fontWeight: 'bold' }}>Yeni Seviye</span>
                <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#fb923c', textShadow: '0 0 10px rgba(251, 146, 60, 0.4)' }}>{pendingLevelUp.newLevel}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.2)', padding: '10px 14px', borderRadius: '10px', textAlign: 'left' }}>
              🐾 Evcil hayvanınızın boyutu büyüdü ve gücü arttı! Customization odasından yeni aşamasını kontrol edebilirsiniz.
            </div>

            <button 
              onClick={() => setPendingLevelUp(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.82rem', fontWeight: 'bold', cursor: 'pointer', borderRadius: '10px', background: 'linear-gradient(135deg, #fb923c, #f97316)', border: 'none', color: 'white' }}
            >
              Harika, Devam Et!
            </button>
          </div>
        </div>
      )}
      {/* Floating AI Chatbot Widget */}
      {selectedCategory && showAiFloatBtn && (
        <div
          className="ai-chat-widget"
          style={{
            position: 'fixed',
            left: floatPos ? `${floatPos.x}px` : 'auto',
            top: floatPos ? `${floatPos.y}px` : 'auto',
            right: floatPos ? 'auto' : '24px',
            bottom: floatPos ? 'auto' : '24px',
            zIndex: 9999
          }}
        >
          {!showAiChat ? (
            <div style={{ position: 'relative' }}>
              <button
                className="ai-chat-float-btn"
                onMouseDown={handleFloatMouseDown}
                onTouchStart={handleFloatTouchStart}
                title="Bilge Çalışma Arkadaşı AI Asistanı 🦉 (Sürükleyebilirsiniz)"
                style={{ overflow: 'hidden', padding: 0 }}
              >
                <MascotPet
                  state="happy"
                  speech={null}
                  customConfig={petConfig}
                  size={48}
                  isFloating={false}
                />
              </button>
              <button
                onClick={() => {
                  setShowAiFloatBtn(false);
                  localStorage.setItem('yokdil_ai_float_btn_enabled', 'false');
                }}
                className="ai-chat-close-float-btn"
                title="Asistan Butonunu Kapat"
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  zIndex: 10001
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className="ai-chat-window"
              style={{
                left: chatPos ? `${chatPos.x}px` : 'auto',
                top: chatPos ? `${chatPos.y}px` : 'auto',
                right: chatPos ? 'auto' : '24px',
                bottom: chatPos ? 'auto' : '90px',
                width: `${chatSize.width}px`,
                height: `${chatSize.height}px`,
                position: 'fixed'
              }}
            >
              <div
                className="ai-chat-header"
                onMouseDown={handleHeaderMouseDown}
                onTouchStart={handleHeaderTouchStart}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MascotPet
                      state="happy"
                      speech={null}
                      customConfig={petConfig}
                      size={36}
                      isFloating={false}
                    />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '0.82rem', color: 'white', fontWeight: '800', margin: 0 }}>{chatbotName}</h4>
                    <span style={{ fontSize: '0.62rem', color: '#34d399', fontWeight: 'bold' }}>Çevrimiçi | YÖKDİL Koçu</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiChat(false)}
                  style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="ai-chat-messages">
                {aiMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`ai-msg ${msg.sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}
                  >
                    {renderMarkdown(msg.text)}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggesters */}
              <div style={{ display: 'flex', gap: '4px', padding: '6px 12px', background: 'rgba(0,0,0,0.1)', overflowX: 'auto', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {[
                  { text: 'Taktik ver 🎯', prompt: 'YÖKDİL Fen sınavı için en iyi bağlaç taktikleri nelerdir?' },
                  { text: 'Dil bilgisi 📝', prompt: 'YÖKDİL sınavında en sık çıkan gramer konuları hangileridir?' },
                  { text: 'Beni sına 🧠', prompt: 'Beni sına ve YÖKDİL seviyesinde rastgele bir kelime sor.' }
                ].map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(sug.prompt)}
                    style={{
                      flexShrink: 0,
                      padding: '4px 10px',
                      fontSize: '0.62rem',
                      fontWeight: '800',
                      borderRadius: '10px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      color: '#a5b4fc',
                      cursor: 'pointer'
                    }}
                  >
                    {sug.text}
                  </button>
                ))}
              </div>

              <div className="ai-chat-input-area" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button
                  onClick={startVoiceRecognition}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isListening ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
                    color: isListening ? '#f87171' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                  title={isListening ? "Dinleniyor..." : "Konuşarak Sor (İngilizce)"}
                >
                  <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
                </button>

                <input
                  type="text"
                  placeholder="Kelime, gramer veya taktik sor..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendAiMessage();
                  }}
                  className="ai-chat-input"
                  style={{ flex: 1 }}
                />

                <button
                  onClick={() => setAiVoiceMode(!aiVoiceMode)}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    background: aiVoiceMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${aiVoiceMode ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                    color: aiVoiceMode ? '#34d399' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                  title={aiVoiceMode ? "Sesli Yanıt Açık" : "Sesli Yanıt Kapalı"}
                >
                  <i className={`fa-solid ${aiVoiceMode ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
                </button>

                <button
                  onClick={() => handleSendAiMessage()}
                  className="btn-primary"
                  style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '0.72rem', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>

              {/* Resize Handle */}
              <div
                className="ai-chat-resize-handle"
                onMouseDown={handleResizeMouseDown}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
