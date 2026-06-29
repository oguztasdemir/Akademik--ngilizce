import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, TrendingUp, Volume2, Plus, Play, ArrowRight,
  Sun, Moon, Eye, ShieldAlert
} from 'lucide-react';

// Import Modular Components
import MascotOwl from './components/MascotOwl';
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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

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
  const [deviceLinkInfo, setDeviceLinkInfo] = useState(null);
  const [showDeviceLinkModal, setShowDeviceLinkModal] = useState(false);

  // Navigation & Config States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTestTab, setSelectedTestTab] = useState('years'); // 'years', 'topics'
  const [theme, setTheme] = useState(() => localStorage.getItem('yokdil_theme') || 'theme-dark');
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('yokdil_font_size') || 'base');
  const [sepiaActive, setSepiaActive] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Data States
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
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

  // Lectures States
  const [lecturesList, setLecturesList] = useState([]);
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
  const [autoPronounceEnabled, setAutoPronounceEnabled] = useState(localStorage.getItem('yokdil_auto_pronounce') === 'true');

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
    fetch(`${BACKEND_URL}/api/${selectedCategory}/exams`)
      .then(res => res.json())
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching exams:", err);
        setLoading(false);
      });

    fetch(`${BACKEND_URL}/api/${selectedCategory}/dictionary`)
      .then(res => res.json())
      .then(data => {
        const list = Object.entries(data).map(([eng, tr]) => ({ english: eng, turkish: tr }));
        setDictionaryList(list);
      })
      .catch(err => console.error("Error fetching dictionary list:", err));

    fetch(`${BACKEND_URL}/api/${selectedCategory}/vocabulary`)
      .then(res => res.json())
      .then(data => {
        setVocabPracticeList(data);
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
    const todayStr = new Date().toISOString().split('T')[0];
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

  const updateStreakAndDate = () => {
    const todayStr = new Date().toISOString().split('T')[0];
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

  const incrementDailyQuestions = () => {
    const newQuestions = dailyQuestionsSolved + 1;
    setDailyQuestionsSolved(newQuestions);
    localStorage.setItem('yokdil_daily_questions', String(newQuestions));
    updateStreakAndDate();
  };

  const incrementDailyWords = () => {
    const newWords = dailyWordsStudied + 1;
    setDailyWordsStudied(newWords);
    localStorage.setItem('yokdil_daily_words', String(newWords));
    updateStreakAndDate();
  };

  const incrementDailyLectures = () => {
    const newLectures = dailyLecturesStudied + 1;
    setDailyLecturesStudied(newLectures);
    localStorage.setItem('yokdil_daily_lectures', String(newLectures));
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

    setQuizQuestions(collectedQuestions);
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
        console.error("Error loading lecture:", err);
        setLectureLoading(false);
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

    if (selectedExam) {
      const correctAnswers = selectedExam.answers;
      for (let i = 1; i <= 80; i++) {
        const userAns = answers[i];
        let tKey = "reading";
        if (i >= 1 && i <= 6) tKey = "vocab";
        else if (i >= 7 && i <= 15) tKey = "tenses";
        else if (i >= 16 && i <= 20) tKey = "preps";
        else if (i >= 21 && i <= 36) tKey = "conjs";

        if (userAns) {
          solved++;
          topicStats[tKey].solved++;
          if (userAns === correctAnswers[i - 1]) {
            correct++;
            topicStats[tKey].correct++;
          } else {
            wrong++;
          }
        }
      }
    } else {
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
              Akademik İngilizce serüveninize başlayın. İsminizi yazarak anında kendi bulut profilinizi oluşturun veya mevcut hesabınıza bağlanın.
            </p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            const inputVal = loginName.trim();
            if (!inputVal) return;
            try {
              const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: inputVal })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error);
              handleAuthSuccess(data.token, data.user);
            } catch (err) {
              alert("Giriş başarısız: " + err.message);
            }
          }} className="landing-gate-form">
            <input 
              type="text" 
              required
              placeholder="Adınız Soyadınız"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              className="landing-gate-input"
            />
            <button 
              type="submit" 
              className="landing-gate-button"
            >
              Başla
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
    <div className={`theme-wrapper ${theme} ${selectedCategory ? 'theme-' + selectedCategory : ''} ${sepiaActive ? 'sepia-filter' : ''} min-h-screen flex items-center justify-center p-0 md:p-4`}>
      
      <Confetti particles={confetti} />
      
      <TranslationPopover 
        show={showPopover}
        position={popoverPosition}
        selectedText={selectedText}
        translating={translating}
        translationResult={translationResult}
        playSpeechAudio={playSpeechAudio}
        handleAddToNotebook={handleAddToNotebook}
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
                  🔥 {studyStreak} Gün
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
                  <div className="welcome-card text-left" style={{ flex: 1, minWidth: '280px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2>Selam, {currentUser.name}! 👋</h2>
                    <p>YÖKDİL {selectedCategory === 'fen' ? 'Fen Bilimleri' : selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri'} hazırlık performansın aşağıda listelenmiştir.</p>
                  </div>
                  
                  {/* Right Side: Bilge Baykuş Study Buddy Mascot */}
                  <div className="glass-card" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '18px',
                    minWidth: '280px',
                    flex: '0.8',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    background: 'rgba(255,255,255,0.01)'
                  }}>
                    {/* Animated Owl Emoji Icon */}
                    <div style={{
                      fontSize: '2.4rem',
                      animation: 'float 3s ease-in-out infinite',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(99, 102, 241, 0.12)',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      boxShadow: '0 0 15px rgba(99, 102, 241, 0.25)',
                      flexShrink: 0
                    }}>
                      🦉
                    </div>
                    {/* Speech Bubble */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <span style={{ fontSize: '0.64rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Çalışma Arkadaşı (Bilge Baykuş)</span>
                      <p style={{ fontSize: '0.76rem', color: '#e2e8f0', margin: 0, fontStyle: 'italic', lineHeight: '1.4' }}>
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

                {/* ACHIEVEMENTS ROZETLER CABINET */}
                <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏆 Başarı Rozetleriniz
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    {[
                      { id: 'first_step', name: 'İlk Adım 🏁', desc: 'İlk sorunuzu çözün.', completed: getStats().solved > 0 },
                      { id: 'word_master', name: 'Kelime Avcısı 🦁', desc: 'İlk kelimeyi çalışın.', completed: Object.keys(wordStats).length > 0 },
                      { id: 'grammar_master', name: 'Gramer Ustası 🎓', desc: 'Dil bilgisi dersi tamamlayın.', completed: dailyLecturesStudied > 0 },
                      { id: 'on_fire', name: 'Alev Aldı! 🔥', desc: 'Çalışma serisi başlatın.', completed: studyStreak > 0 }
                    ].map(ach => (
                      <div 
                        key={ach.id} 
                        style={{
                          background: ach.completed ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: ach.completed ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
                          padding: '12px',
                          borderRadius: '12px',
                          textAlign: 'center',
                          opacity: ach.completed ? 1.0 : 0.45,
                          transition: 'all 0.3s ease',
                          boxShadow: ach.completed ? '0 0 10px rgba(99, 102, 241, 0.15)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '1.2rem', marginBottom: '6px' }}>{ach.completed ? '🌟' : '🔒'}</div>
                        <h4 style={{ fontSize: '0.78rem', fontWeight: 'bold', color: ach.completed ? 'white' : 'var(--text-secondary)', margin: '0 0 2px 0' }}>{ach.name}</h4>
                        <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.3' }}>{ach.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Install App Promo card */}
                <div className="action-card text-left" style={{ marginBottom: '15px', border: '1px solid var(--primary-light)', background: 'rgba(66, 153, 225, 0.06)' }}>
                  <div className="action-content">
                    <h3 style={{ color: 'var(--primary-light)', fontSize: '0.9rem', margin: 0 }}><i className="fa-solid fa-mobile-screen-button"></i> Uygulamayı Cihaza Yükle</h3>
                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0' }}>Tabletinize veya telefonunuza kurarak kesintisiz çalışın.</p>
                  </div>
                  <i className="fa-solid fa-cloud-arrow-down arrow-icon" style={{ fontSize: '1.1rem' }}></i>
                </div>

                {/* PDF download promo booklet */}
                <a 
                  href={`${BACKEND_URL}/pdfs/YOKDIL_Temiz_Soru_Kitapcigi.pdf`} 
                  download="YOKDIL_Temiz_Soru_Kitapcigi.pdf" 
                  target="_blank" 
                  rel="noreferrer"
                  className="action-card text-left" 
                  style={{ 
                    textDecoration: 'none', 
                    marginBottom: '15px', 
                    border: '1px solid #48BB78', 
                    background: 'rgba(72, 187, 120, 0.06)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: '12px'
                  }}
                >
                  <div className="action-content">
                    <h3 style={{ color: '#48BB78', fontSize: '0.9rem', margin: 0 }}><i className="fa-solid fa-file-pdf"></i> Temiz Çalışma Kitapçığını İndir</h3>
                    <p style={{ fontSize: '0.75rem', margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Dikey hizalı ve not alanlı 244 sayfalık PDF kitapçığı.</p>
                  </div>
                  <i className="fa-solid fa-download arrow-icon" style={{ fontSize: '1.1rem', color: '#48BB78' }}></i>
                </a>

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
                    <div className="section-title">
                      <h2>YÖKDİL Sınav ve Konu Listesi</h2>
                      <p>Yıllara göre deneme çözün veya konulara göre ayrılmış soru havuzundan pratik yapın.</p>
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
                      selectedCategory === 'fen' ? (
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
                          <p style={{ fontSize: '0.85rem' }}>Bu kategori için sınav kaydı bulunmamaktadır. Sosyal ve Sağlık bilimleri yakında eklenecektir.</p>
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
    </div>
  );
}

export default App;
