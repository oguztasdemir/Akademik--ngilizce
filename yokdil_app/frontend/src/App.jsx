import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, TrendingUp, Volume2, Plus, Play, ArrowRight,
  Sun, Moon, Eye, ShieldAlert
} from 'lucide-react';

// Import Modular Components
import MascotOwl from './components/MascotOwl';
import MascotPet from './components/MascotPet';
import Confetti from './components/Confetti';
import TranslationPopover from './components/TranslationPopover';
import Sidebar from './components/Sidebar';
import QuizSection from './components/QuizSection';
import VocabularySection from './components/VocabularySection';
import LecturesSection from './components/LecturesSection';
import PerformanceSection from './components/PerformanceSection';
import SettingsSection from './components/SettingsSection';
import MistakeInbox from './components/MistakeInbox';
import ParagraphsSection from './components/ParagraphsSection';
import AuthModal from './components/AuthModal';
import MinigamesSection from './components/MinigamesSection';
import VirtualShop from './components/VirtualShop';

import fallbackExamsFen from './components/exams_db_fen.json';
import fallbackExamsSosyal from './components/exams_db_sosyal.json';
import fallbackExamsSaglik from './components/exams_db_saglik.json';

import fallbackVocabFen from './components/vocab_db_fen.json';
import fallbackVocabSosyal from './components/vocab_db_sosyal.json';
import fallbackVocabSaglik from './components/vocab_db_saglik.json';

import fallbackDictFen from './components/dictionary_fen.json';
import fallbackDictSosyal from './components/dictionary_sosyal.json';
import fallbackDictSaglik from './components/dictionary_saglik.json';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
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

const parseInlineMarkdown = (text) => {
  if (!text) return '';
  const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  const tokens = [];
  let match;
  let lastIdx = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      tokens.push(text.substring(lastIdx, match.index));
    }
    
    if (match[1]) { // bold
      tokens.push(<strong key={match.index} className="font-extrabold text-white">{match[2]}</strong>);
    } else if (match[3]) { // italic
      tokens.push(<em key={match.index} className="italic text-slate-200">{match[4]}</em>);
    } else if (match[5]) { // inline code
      tokens.push(<code key={match.index} className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 text-xs font-mono font-bold">{match[6]}</code>);
    }
    lastIdx = regex.lastIndex;
  }
  
  if (lastIdx < text.length) {
    tokens.push(text.substring(lastIdx));
  }
  
  return tokens.length > 0 ? tokens : text;
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  
  let inTable = false;
  let tableRows = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Parse table row
    if (trimmedLine.startsWith('|')) {
      inTable = true;
      const cells = trimmedLine.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
      
      // Skip separator row (e.g. |---|---|)
      if (cells.every(c => c.match(/^:+|-+:*$/) || c === '')) {
        return;
      }
      
      tableRows.push(cells);
      return;
    }
    
    // If table ends, flush it
    if (inTable && !trimmedLine.startsWith('|')) {
      inTable = false;
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${index}`} className="overflow-x-auto my-4 rounded-xl border border-white/5 bg-white/1">
            <table className="min-w-full divide-y divide-white/5">
              <thead className="bg-indigo-500/10">
                <tr>
                  {tableRows[0].map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                      {parseInlineMarkdown(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-transparent">
                {tableRows.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-white/2 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="px-4 py-3 text-xs text-slate-300">
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    }
    
    if (trimmedLine.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl font-extrabold text-slate-100 mt-6 mb-3 border-b border-white/10 pb-2">
          {parseInlineMarkdown(trimmedLine.substring(2))}
        </h1>
      );
    } else if (trimmedLine.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg font-bold text-indigo-400 mt-5 mb-2">
          {parseInlineMarkdown(trimmedLine.substring(3))}
        </h2>
      );
    } else if (trimmedLine.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold text-emerald-400 mt-4 mb-2">
          {parseInlineMarkdown(trimmedLine.substring(4))}
        </h3>
      );
    } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const isSub = line.startsWith('    ') || line.startsWith('\t');
      elements.push(
        <div key={index} className={`flex items-start gap-2 text-slate-300 text-sm leading-relaxed ${isSub ? 'pl-8' : 'pl-4'} mb-1`}>
          <span className="text-indigo-400 mt-1.5 flex-shrink-0 text-[10px]">•</span>
          <div>{parseInlineMarkdown(trimmedLine.substring(2))}</div>
        </div>
      );
    } else if (!trimmedLine) {
      // Empty line spacer
    } else {
      elements.push(
        <p key={index} className="text-slate-300 text-sm leading-relaxed mb-3">
          {parseInlineMarkdown(trimmedLine)}
        </p>
      );
    }
  });
  
  // Flush final table if file ends with one
  if (inTable && tableRows.length > 0) {
    elements.push(
      <div key={`table-final`} className="overflow-x-auto my-4 rounded-xl border border-white/5 bg-white/1">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-indigo-500/10">
            <tr>
              {tableRows[0].map((cell, idx) => (
                <th key={idx} className="px-4 py-3 text-left text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {parseInlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {tableRows.slice(1).map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-white/2 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3 text-xs text-slate-300">
                    {parseInlineMarkdown(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  return <div className="space-y-1">{elements}</div>;
};

// Web Audio API Sound Synthesizers for Gamification
const playCorrectSound = () => {
  if (localStorage.getItem('yokdil_sound_enabled') === 'false') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    const now = ctx.currentTime;
    
    // Melodic positive C5 -> E5 arpeggio
    osc.frequency.setValueAtTime(523.25, now); // C5
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.12);
    
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
    gain2.gain.setValueAtTime(0.12, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.22);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

const playIncorrectSound = () => {
  if (localStorage.getItem('yokdil_sound_enabled') === 'false') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    
    // Sad downturned sliding buzz
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.25);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

const playGoalSound = () => {
  if (localStorage.getItem('yokdil_sound_enabled') === 'false') return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.12, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.22);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.22);
    });
  } catch (e) {
    console.error("Audio error:", e);
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

function App() {
  // Authentication & Cloud Sync states
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('yokdil_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('yokdil_token') || 'null');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [deviceLinkInfo, setDeviceLinkInfo] = useState(null);
  const [showDeviceLinkModal, setShowDeviceLinkModal] = useState(false);

  // Navigation & Config States
  const getInitialHashState = () => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#/') && hash !== '#/landing') {
      const parts = hash.split('/');
      if (parts.length >= 3) {
        return { 
          category: parts[1], 
          tab: parts[2], 
          quiz: parts[3] === 'quiz' 
        };
      }
    }
    return { category: null, tab: 'dashboard', quiz: false };
  };

  const initialHashState = getInitialHashState();

  const [activeTab, setActiveTab] = useState(initialHashState.tab);
  const [selectedTestTab, setSelectedTestTab] = useState('years'); // 'years', 'topics'
  const [theme, setTheme] = useState(() => localStorage.getItem('yokdil_theme') || 'theme-dark');
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
  
  // Gamification & Shop States
  const [confetti, setConfetti] = useState([]);
  const [mascotState, setMascotState] = useState('neutral');
  const [mascotSpeech, setMascotSpeech] = useState("YÖKDİL'e hazır mısın?");
  const [mistakes, setMistakes] = useState(() => JSON.parse(localStorage.getItem('yokdil_mistakes') || '[]'));
  const [gems, setGems] = useState(() => parseInt(localStorage.getItem('yokdil_gems') || '0', 10));
  const [ownedOutfits, setOwnedOutfits] = useState(() => JSON.parse(localStorage.getItem('yokdil_owned_outfits') || '[]'));
  const [activeOutfits, setActiveOutfits] = useState(() => JSON.parse(localStorage.getItem('yokdil_active_outfits') || '[]'));
  const [streakFreezeActive, setStreakFreezeActive] = useState(() => localStorage.getItem('yokdil_streak_freeze') === 'true');
  const [petXp, setPetXp] = useState(() => parseInt(localStorage.getItem('yokdil_pet_xp') || '0', 10));
  const [petLevel, setPetLevel] = useState(() => parseInt(localStorage.getItem('yokdil_pet_level') || '1', 10));
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
      } catch (e) {}
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
  
  // Word stats for spacing repetition algorithm
  const [wordStats, setWordStats] = useState(() => JSON.parse(localStorage.getItem('yokdil_word_stats') || '{}'));
  const [questionStats, setQuestionStats] = useState(() => JSON.parse(localStorage.getItem('yokdil_question_stats') || '{}'));
  const [examQuestionSort, setExamQuestionSort] = useState('number'); // 'number', 'wrong', 'correct'
  const [examQuestionSortDir, setExamQuestionSortDir] = useState('asc'); // 'asc', 'desc'
  const [examDetailTab, setExamDetailTab] = useState('list'); // 'list', 'performance'
  const [lectureProgress, setLectureProgress] = useState(() => JSON.parse(localStorage.getItem('yokdil_lecture_progress') || '{}'));
  const [grammarNotes, setGrammarNotes] = useState(() => JSON.parse(localStorage.getItem('yokdil_grammar_notes') || '[]'));

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

  const [questionTimeSpent, setQuestionTimeSpent] = useState(0);

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
    { id: "08_Relative_Clauses", title: "08. Sıfat Cümlecikleri & Kısaltmalar (Relative Clauses)", description: "İsimleri niteleyen sıfat cümlecikleri (who, which, that, whose) ve kısaltma (reduction) kuralları." }
  ];

  // Lectures States
  const [lecturesList, setLecturesList] = useState(FALLBACK_LECTURES);
  const [activeLecture, setActiveLecture] = useState(null);
  const [lectureLoading, setLectureLoading] = useState(false);

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
  const [purchasedOutfits, setPurchasedOutfits] = useState(() => JSON.parse(localStorage.getItem('yokdil_purchased_outfits') || '["default"]'));
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
        } catch (e) {}
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

  const getAchievementTier = (id, value) => {
    let thresholds = [10, 50, 200, 500];
    let names = ["Bronz 🥉", "Gümüş 🥈", "Altın 🥇", "Elmas 💎"];
    
    if (id === 'word_master') {
      thresholds = [5, 25, 100, 300];
    } else if (id === 'grammar_master') {
      thresholds = [1, 5, 15, 35];
    } else if (id === 'on_fire') {
      thresholds = [1, 3, 7, 30];
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
        const tab = parts[2];
        setSelectedCategory(cat);
        setActiveTab(tab);
        if (parts[3] === 'quiz') {
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
      const expectedHash = `#/${selectedCategory}/${activeTab}${quizSuffix}`;
      if (window.location.hash !== expectedHash) {
        window.history.pushState(null, '', expectedHash);
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
    fetch(`${BACKEND_URL}/api/${category}/exams`)
      .then(res => res.json())
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching exams:", err);
        setLoading(false);
      });

    fetch(`${BACKEND_URL}/api/lectures`)
      .then(res => res.json())
      .then(data => {
        setLecturesList(data);
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
        const normalized = parsed.map(item => ({
          id: item.id || Date.now() + Math.random(),
          english: item.english || item.word || '',
          turkish: item.turkish || item.translation || '',
          status: item.status || 'learning'
        }));
        setNotebook(normalized);
      } catch (e) {
        console.error("Error loading notebook:", e);
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
    setLoading(false);

    // Fetch fresh values from backend (if online / backend is up)
    fetch(`${BACKEND_URL}/api/${selectedCategory}/exams`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setExams(data);
        }
      })
      .catch(err => {
        console.error("Error fetching exams:", err);
      });

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
    fetch(`${BACKEND_URL}/api/${category}/exams/${activeExamId}/explain/${qIndex}`)
      .then(res => res.json())
      .then(data => {
        setActiveExplanation(data);
        setExplanationLoading(false);
      })
      .catch(err => {
        console.error("Error loading explanation:", err);
        setExplanationLoading(false);
      });
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

  const startTopicQuizSession = (topicKey) => {
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

    let collectedQuestions = [];
    exams.forEach(ex => {
      ex.questions.forEach(q => {
        if (q.number >= startIdx && q.number <= endIdx) {
          collectedQuestions.push({
            ...q,
            examId: ex.id,
            examName: ex.name,
            correctAnswer: ex.answers[q.number - 1]
          });
        }
      });
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

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    setAnswers(JSON.parse(localStorage.getItem(`answers_${exam.id}`)) || {});
    setFlagged(JSON.parse(localStorage.getItem(`flags_${exam.id}`)) || {});
    setExamDetailTab('list');
    setCurrentQuizIndex(1);
    setShowPopover(false);
    setActiveExplanation(null);
    setExamMode(false);
    setExamRunning(false);
    setExamSubmitted(false);
    setShowScoreModal(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
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
    
    const isCorrect = value === selectedExam.answers[qIndex - 1];
    
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
    if (!selectedExam || !window.confirm("Bu sınavın tüm ilerlemesini sıfırlamak istediğinize emin misiniz?")) return;
    setAnswers({});
    setFlagged({});
    localStorage.removeItem(`answers_${selectedExam.id}`);
    localStorage.removeItem(`flags_${selectedExam.id}`);
    setCurrentQuizIndex(1);
    setExamRunning(false);
    setExamSubmitted(false);
    setShowScoreModal(false);
    setExamSecondsLeft(180 * 60);
  };

  const handleResetAllProgress = () => {
    if (!window.confirm("DİKKAT: Hesabınızdaki TÜM ilerlemeyi (çözülen sorular, istatistikler, kelimeler, seriler ve hedefler) sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    
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
    
    alert("Tüm verileriniz başarıyla sıfırlanmıştır.");
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

  const handleSendAiMessage = (customText = null) => {
    const textToSend = customText || aiInput;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: textToSend };
    setAiMessages(prev => [...prev, userMsg]);
    if (!customText) setAiInput('');

    // Respond
    setTimeout(() => {
      let botResponse = "";
      const lowerText = textToSend.toLowerCase();

      if (lowerText.includes("gramer") || lowerText.includes("dil bilgisi") || lowerText.includes("tense") || lowerText.includes("zamanlar")) {
        botResponse = "YÖKDİL Fen sınavlarında en çok kullanılan zamanlar *Simple Past* (geçmişte tamamlanmış çalışmalar için) ve *Present Perfect* (günümüze etkisi süren araştırmalar için) zamanlarıdır. Örneğin: 'Scientists have discovered...' cümle yapısı Present Perfect kullanır ve YÖKDİL'in vazgeçilmezidir. 📝";
      } else if (lowerText.includes("taktik") || lowerText.includes("ipucu") || lowerText.includes("tüyo")) {
        botResponse = "YÖKDİL sınavında başarılı olmak için şu 3 taktiğe dikkat et:\n1. **Bağlaçlara çalış:** Cümle tamamlama sorularında zıtlık bağlaçları (although, contrast) ve neden-sonuç bağlaçları (because, since) en çok doğru cevap çıkan yapılardır.\n2. **Kelimeleri cümle içinde öğren:** Kartlardaki örnek cümleler zihninde kalıcı olmasını sağlar.\n3. **Hata Kutunu erit:** Yanlış yaptığın soruları en az iki kere tekrar çöz. 🎯";
      } else if (lowerText.includes("kelime") || lowerText.includes("anlam") || lowerText.includes("çevir")) {
        const cleanWord = lowerText.replace("nedir", "").replace("anlamı", "").replace("ne demek", "").replace("çevir", "").trim();
        const found = dictionaryList.find(item => {
          if (!item || !item.english || !item.turkish) return false;
          return item.english.toLowerCase() === cleanWord || item.turkish.toLowerCase().includes(cleanWord);
        });
        if (found) {
          botResponse = `**${found.english}**: "${found.turkish}" anlamına gelir. Bu kelimeyi YÖKDİL Akademik Kelime Defterine kaydederek aralıklı tekrar (Leitner) yöntemiyle çalışabilirsin! 📚`;
        } else {
          botResponse = `"${textToSend}" ifadesini inceledim. Bu terim akademik İngilizce makalelerinde sıklıkla araştırma yöntemleri veya bulguları tasvir etmek için kullanılır. Gramer olarak özne-yüklem uyumuna dikkat etmelisin! 💡`;
        }
      } else if (lowerText.includes("test") || lowerText.includes("soru sor")) {
        const randomWord = dictionaryList[Math.floor(Math.random() * dictionaryList.length)] || { english: "evaluate", turkish: "değerlendirmek" };
        botResponse = `Hadi küçük bir kelime testi yapalım! **"${randomWord.english}"** kelimesinin Türkçe anlamı nedir? Cevabını buraya yazabilirsin! 🧠`;
      } else {
        botResponse = "Harika bir soru! YÖKDİL hazırlık sürecinde her gün kelime çalışıp hedeflerini tamamlaman çok önemlidir. Konu Anlatımı kısmından çalışmaya devam edebilir veya çözemediğin bir kelime olursa buraya yazabilirsin. 🦉";
      }

      setAiMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      if (aiVoiceMode) {
        // Strip markdown symbols before speaking
        const cleanText = botResponse.replace(/[*_`#]/g, "");
        playSpeechAudio(cleanText);
      }
    }, 1000);
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
        } catch (err) {}
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
    fetch(`${BACKEND_URL}/api/${category}/dictionary`)
      .then(res => res.json())
      .then(data => {
        const loadedWords = Object.entries(data).map(([eng, tr], index) => ({
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
      })
      .catch(err => {
        console.error("Dictionary load error:", err);
        setLoading(false);
      });
  };

  const handleLoadLecture = (id) => {
    if (!id) {
      setActiveLecture(null);
      return;
    }
    setLectureLoading(true);
    fetch(`${BACKEND_URL}/api/lectures/${id}`)
      .then(res => res.json())
      .then(data => {
        setActiveLecture(data);
        setLectureLoading(false);
      })
      .catch(err => {
        console.warn("API load failed, falling back to local public lectures:", err);
        fetch(`/lectures/${id}.md`)
          .then(res => res.text())
          .then(text => {
            const lecInfo = FALLBACK_LECTURES.find(l => l.id === id) || {};
            setActiveLecture({
              id,
              title: lecInfo.title || id,
              content: text
            });
            setLectureLoading(false);
          })
          .catch(e => {
            console.error("Failed to load local lecture:", e);
            setLectureLoading(false);
          });
      });
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

    exams.forEach(ex => {
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

  // Landing view when user has not logged in
  if (!currentUser) {
    return (
      <div className="landing-gate-container">
        <div className="landing-gate-card">
          <div className="landing-gate-logo">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          
          <div>
            <h1 className="landing-gate-title">YÖKDİL Akademik Hazırlık</h1>
            <p className="landing-gate-text" style={{ marginTop: '8px' }}>
              Akademik İngilizce hazırlık platformuna hoş geldiniz.
            </p>
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px', gap: '16px', justifyContent: 'center' }}>
            <button 
              type="button" 
              onClick={() => setAuthMode('login')} 
              style={{
                background: 'none',
                border: 'none',
                color: authMode === 'login' ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)',
                borderBottom: authMode === 'login' ? '2px solid var(--primary-light)' : 'none',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Giriş Yap
            </button>
            <button 
              type="button" 
              onClick={() => setAuthMode('register')} 
              style={{
                background: 'none',
                border: 'none',
                color: authMode === 'register' ? 'var(--primary-light)' : 'rgba(255,255,255,0.5)',
                borderBottom: authMode === 'register' ? '2px solid var(--primary-light)' : 'none',
                padding: '8px 16px',
                fontSize: '0.88rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Kayıt Ol
            </button>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            if (authMode === 'login') {
              const uName = authUsername.trim();
              const pass = authPassword;
              if (!uName || !pass) return;
              try {
                const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: uName, password: pass })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                handleAuthSuccess(data.token, data.user);
              } catch (err) {
                alert("Giriş başarısız: " + err.message);
              }
            } else {
              const uName = authUsername.trim();
              const fullName = authFullName.trim();
              const pass = authPassword;
              if (!uName || !fullName || !pass) return;
              try {
                const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: uName, name: fullName, password: pass })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error);
                handleAuthSuccess(data.token, data.user);
              } catch (err) {
                alert("Kayıt başarısız: " + err.message);
              }
            }
          }} className="landing-gate-form" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {authMode === 'register' && (
              <input 
                type="text" 
                required
                placeholder="Adınız Soyadınız"
                value={authFullName}
                onChange={(e) => setAuthFullName(e.target.value)}
                className="landing-gate-input"
              />
            )}
            <input 
              type="text" 
              required
              placeholder="Kullanıcı Adı"
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              className="landing-gate-input"
            />
            <input 
              type="password" 
              required
              placeholder="Şifre"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="landing-gate-input"
            />
            {authMode === 'register' && (
              <p style={{ fontSize: '0.72rem', color: '#F6AD55', margin: '-4px 0 4px 0', lineHeight: 1.3, textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '2px' }}></i>
                <span>Lütfen başka platformlarda kullandığınız şifreleri girmeyiniz. Yeni ve farklı bir şifre belirleyiniz.</span>
              </p>
            )}
            <button 
              type="submit" 
              className="landing-gate-button"
              style={{ marginTop: '8px' }}
            >
              {authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>
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

      <div className="app-container">
        <Sidebar 
          selectedCategory={selectedCategory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedCategory={setSelectedCategory}
          setSelectedExam={setSelectedExam}
          setQuizActive={setQuizActive}
          onLogout={handleLogout}
        />
        
        <div className="app-content-wrapper">
          {selectedCategory ? (
            <header className="app-header">
              <div className="logo" onClick={() => setSelectedCategory(null)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <i className="fa-solid fa-graduation-cap brain-icon"></i>
                <span id="app-logo-title" className="font-heading">
                  {selectedCategory === 'fen' ? 'Fen' : selectedCategory === 'sosyal' ? 'Sosyal' : 'Sağlık'}
                </span>
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
                {currentUser && (
                  <span className="text-[10px] text-indigo-300 font-bold hidden md:inline">
                    👤 {currentUser.name}
                  </span>
                )}
                <button className="change-course-btn" id="change-course-btn" onClick={() => { setSelectedCategory(null); setSelectedExam(null); setQuizActive(false); }}>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Alan
                </button>
                <button 
                  className={`header-control-btn ${sepiaActive ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`} 
                  onClick={() => setSepiaActive(!sepiaActive)} 
                  title="Okuma Filtresi (Sepya)"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button className="header-control-btn" id="theme-toggle-btn" onClick={() => setTheme(theme === 'theme-light' ? 'theme-dark' : 'theme-light')} title="Tema Değiştir">
                  {theme === 'theme-light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
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
                    <div className="menu-text">
                      <h4>Fen Bilimleri</h4>
                      <p>4 sınav (2024-2026) ve 320 soru (Tamamı temiz JSON olarak yüklendi).</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                  </button>
                  <button className="menu-item subject-card gai-card" onClick={() => { setSelectedCategory('sosyal'); setActiveTab('dashboard'); setSelectedExam(null); setQuizActive(false); }}>
                    <div className="menu-icon subject-icon" style={{ borderColor: '#805AD5', color: '#B794F4' }}><i className="fa-solid fa-gavel"></i></div>
                    <div className="menu-text">
                      <h4>Sosyal Bilimler <span style={{ fontSize: '0.65rem', background: '#F97316', color: '#fff', padding: '1px 4px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold' }}>Boş</span></h4>
                      <p>Sosyal bilimler sınavları ve kelimeleri yakında eklenecektir.</p>
                    </div>
                    <i className="fa-solid fa-chevron-right arrow-icon"></i>
                  </button>
                  <button className="menu-item subject-card ds-card" onClick={() => { setSelectedCategory('saglik'); setActiveTab('dashboard'); setSelectedExam(null); setQuizActive(false); }}>
                    <div className="menu-icon subject-icon" style={{ borderColor: '#059669', color: '#34D399' }}><i className="fa-solid fa-heart-pulse"></i></div>
                    <div className="menu-text">
                      <h4>Sağlık Bilimleri <span style={{ fontSize: '0.65rem', background: '#F97316', color: '#fff', padding: '1px 4px', borderRadius: '4px', marginLeft: '4px', fontWeight: 'bold' }}>Boş</span></h4>
                      <p>Tıp ve sağlık bilimleri sınavları ve kelimeleri yakında eklenecektir.</p>
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
                      <p>YÖKDİL {selectedCategory === 'fen' ? 'Fen Bilimleri' : selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri'} hazırlık performansın aşağıda listelenmiştir.</p>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.64rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YÖKDİL Geri Sayım ⏰</span>
                      <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                        {yokdilExamDate ? (
                          <>
                            Hedef Sınav Tarihi: <strong>{new Date(yokdilExamDate).toLocaleDateString('tr-TR')}</strong>. Başarılar dileriz!
                          </>
                        ) : (
                          <>
                            Henüz sınav tarihi seçmediniz. Ayarlar sekmesinden belirleyebilirsiniz.
                          </>
                        )}
                      </p>
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
                        size={64} 
                        isFloating={false} 
                      />
                    </div>
                    {/* Name, Speech & XP progression */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: '900', color: 'white' }}>
                          {petConfig.name || 'Bilge'}
                        </span>
                        <span style={{ fontSize: '0.58rem', fontWeight: 'bold', color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 6px', borderRadius: '8px' }}>
                          Seviye {petLevel}
                        </span>
                      </div>
                      
                      {/* XP Bar */}
                      <div style={{ width: '100%', margin: '2px 0 4px 0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '2px' }}>
                          <span>XP: {petXp} / 100</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${petXp}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '2px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>

                      <p style={{ fontSize: '0.7rem', color: '#e2e8f0', margin: 0, fontStyle: 'italic', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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

                  {/* Leaderboard Card */}
                  <div className="glass-card p-5 border border-white/5 rounded-2xl text-left" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🏆 Lig Sıralaması (Haftalık)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(() => {
                        const userXp = (stats.solved * 10) + (Object.keys(wordStats).length * 5) + (dailyQuestionsSolved * 10) + (dailyWordsStudied * 5);
                        
                        const today = new Date();
                        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
                        
                        const seedRandom = (str) => {
                          let hash = 0;
                          for (let i = 0; i < str.length; i++) {
                            hash = str.charCodeAt(i) + ((hash << 5) - hash);
                          }
                          return Math.abs(Math.sin(hash + dayOfYear)) * 500;
                        };

                        const names = [
                          { name: 'AcademicOwl 🦉', base: 1400 },
                          { name: 'YÖKDİL_Slayer ⚔️', base: 1200 },
                          { name: 'Dr_Arzu 🩺', base: 950 },
                          { name: 'Prof_Ahmet 🔬', base: 820 },
                          { name: 'English_Bender 🤖', base: 680 },
                          { name: 'Yeliz_Hoca 👩‍🏫', base: 590 },
                          { name: 'Mustafa_K 🚀', base: 450 },
                          { name: 'Zeynep_Bio 🧬', base: 380 },
                          { name: 'Volkan_YDS 📝', base: 210 }
                        ];

                        const competitors = names.map(comp => {
                          const variance = Math.floor(seedRandom(comp.name) % 150);
                          return {
                            name: comp.name,
                            xp: comp.base + variance,
                            isUser: false
                          };
                        });

                        competitors.push({
                          name: `${currentUser?.name || 'Kullanıcı'} (Sen) ⚡`,
                          xp: userXp,
                          isUser: true
                        });

                        competitors.sort((a, b) => b.xp - a.xp);

                        return competitors.map((comp, idx) => {
                          const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
                          return (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', background: comp.isUser ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.01)', border: `1px solid ${comp.isUser ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)'}`, borderRadius: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: '800', color: comp.isUser ? '#a5b4fc' : 'var(--text-secondary)', width: '22px' }}>{medal}</span>
                                <span style={{ fontSize: '0.76rem', fontWeight: comp.isUser ? '800' : '600', color: comp.isUser ? 'white' : '#cbd5e1' }}>{comp.name}</span>
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: comp.isUser ? '#a5b4fc' : 'var(--text-secondary)' }}>{comp.xp} XP</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                {/* ACHIEVEMENTS ROZETLER & WARDROBE CABINET */}
                <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏆 Başarı Rozetleriniz & Koleksiyonunuz
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    {[
                      { id: 'first_step', name: 'Soru Avcısı 🏁', value: getStats().solved, desc: 'Toplam çözülen akademik soru.' },
                      { id: 'word_master', name: 'Kelime Sihirbazı 🦁', value: Object.keys(wordStats).length, desc: 'Defterdeki çalışılan kelime.' },
                      { id: 'grammar_master', name: 'Derskolik 🎓', value: dailyLecturesStudied, desc: 'Bugün tamamlanan ders notu.' },
                      { id: 'on_fire', name: 'Seri Canavarı 🔥', value: studyStreak, desc: 'Çalışılan ardışık gün serisi.' }
                    ].map(ach => {
                      const tier = getAchievementTier(ach.id, ach.value);
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
                      <div className="circular-progress" style={{ background: `conic-gradient(var(--primary-light) ${stats.solved > 0 ? (stats.correct/stats.solved)*360 : 0}deg, var(--border-color) 0deg)` }}>
                        <span className="progress-value">{stats.solved > 0 ? Math.round((stats.correct/stats.solved)*100) : 0}%</span>
                      </div>
                    </div>
                    <div className="progress-info text-left">
                      <h3>Genel Başarı Oranın</h3>
                      <p>{stats.solved > 0 ? `Toplam ${stats.solved} soru çözdünüz. Başarı yüzdeniz %${Math.round((stats.correct/stats.solved)*100)}.` : 'Henüz test çözmeye başlamadın.'}</p>
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
                                onClick={() => { setSelectedExam(ex); setQuizActive(false); }}
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
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px', marginBottom: '8px' }}>
                      <button 
                        onClick={() => setExamDetailTab('list')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${examDetailTab === 'list' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                      >
                        📝 Soru Listesi
                      </button>
                      <button 
                        onClick={() => setExamDetailTab('performance')}
                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${examDetailTab === 'performance' ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
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
                            const isCorrect = userAns === selectedExam.answers[q.number - 1];
                            if (isCorrect) correctCount++;
                            else wrongCount++;
                          }
                        });
                        
                        const successRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;
                        
                        const incorrectQuestions = selectedExam.questions.filter(q => {
                          const userAns = examAnswers[q.number];
                          return userAns !== undefined && userAns !== selectedExam.answers[q.number - 1];
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

            {/* TAB 3: VOCABULARY SECTION */}
            <VocabularySection 
              activeTab={activeTab}
              notebook={notebook}
              vocabPracticeList={vocabPracticeList}
              handleDeleteFromNotebook={handleDeleteFromNotebook}
              handleToggleWordStatus={handleToggleWordStatus}
              playSpeechAudio={playSpeechAudio}
              handleLoadAcademicWords={handleLoadAcademicWords}
              handleAddCustomWord={handleAddCustomWord}
              wordStats={wordStats}
              recordWordStat={recordWordStat}
              speechRate={speechRate}
              setSpeechRate={setSpeechRate}
              incrementDailyQuestions={incrementDailyQuestions}
              incrementDailyWords={incrementDailyWords}
              autoPronounceEnabled={autoPronounceEnabled}
            />

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
            />

            {/* TAB 5: MISTAKE INBOX SECTION */}
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
            />

            {/* TAB 7: PERFORMANCE SECTION */}
            <PerformanceSection 
              activeTab={activeTab}
              selectedExam={selectedExam}
              exams={exams}
              answers={answers}
              getStats={getStats}
              setActiveTab={setActiveTab}
              wordStats={wordStats}
              vocabPracticeList={vocabPracticeList}
              notebook={notebook}
              logStudyActivity={logStudyActivity}
            />

            {/* TAB 7.5: MINIGAMES SECTION */}
            <MinigamesSection
              activeTab={activeTab}
              notebook={notebook}
              playSpeechAudio={playSpeechAudio}
              incrementDailyQuestions={incrementDailyQuestions}
              playCorrectSound={playCorrectSound}
              playIncorrectSound={playIncorrectSound}
              logStudyActivity={logStudyActivity}
            />

            {/* TAB 7.8: VIRTUAL SHOP (PET CUSTOMIZER) */}
            <VirtualShop 
              activeTab={activeTab} 
            />

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
      {/* Floating AI Chatbot Widget */}
      {selectedCategory && (
        <div className="ai-chat-widget">
          {!showAiChat ? (
            <button 
              className="ai-chat-float-btn"
              onClick={() => setShowAiChat(true)}
              title="Bilge Çalışma Arkadaşı AI Asistanı 🦉"
            >
              <i className="fa-solid fa-robot"></i>
            </button>
          ) : (
            <div className="ai-chat-window">
              <div className="ai-chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '1.2rem' }}>{getOutfitEmoji()}</div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '0.82rem', color: 'white', fontWeight: '800', margin: 0 }}>Bilge Asistan</h4>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
