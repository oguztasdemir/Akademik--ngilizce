import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from './hooks/useAppState';
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
import DashboardSection from './features/dashboard/DashboardSection';
import TestsSection from './features/tests/TestsSection';
import AchievementsSection from './features/achievements/AchievementsSection';
import { renderMarkdown } from './utils/markdown';
import { playCorrectSound, playIncorrectSound, playGoalSound } from './utils/audio';
import achievementsData from '@dataset/yokdil/achievements.json';

import fallbackExamsFen from '@dataset/yokdil/fen/cikmis_sinavlar/sinav_listesi.json';
import fallbackExamsSosyal from '@dataset/yokdil/sosyal/cikmis_sinavlar/sinav_listesi.json';
import fallbackExamsSaglik from '@dataset/yokdil/saglik/cikmis_sinavlar/sinav_listesi.json';

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

function App() {
  const {
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
    incrementDailyQuestions,
    incrementDailyWords,
    incrementDailyLectures,
    logStudyActivity,
    awardPetXP,
    loadQuestionExplanation,
    triggerConfetti
  } = useAppState();

  const handleSetActiveTab = (tabName) => {
    if (selectedCategory === 'custom' && tabName !== 'camp-vocab') {
      const lastCat = localStorage.getItem('yokdil_last_standard_category') || 'fen';
      setSelectedCategory(lastCat);
    }
    setActiveTab(tabName);
  };

  const showAiChatWindow = showAiChat;

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
          mobileTabsConfig={mobileTabsConfig}
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
                <button
                  className="header-control-btn"
                  onClick={() => {
                    if (!showAiFloatBtn) {
                      setShowAiFloatBtn(true);
                      localStorage.setItem('yokdil_ai_float_btn_enabled', 'true');
                    } else {
                      setShowAiChat(prev => !prev);
                    }
                  }}
                  title="AI Asistanı Aç/Kapat 🦉"
                  style={{ marginLeft: '2px', background: 'rgba(99, 102, 241, 0.08)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                >
                  🦉
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
            <DashboardSection
              currentUser={currentUser}
              selectedCategory={selectedCategory}
              activeTab={activeTab}
              studyStreak={studyStreak}
              yokdilExamDate={yokdilExamDate}
              setYokdilExamDate={setYokdilExamDate}
              examDateInputRef={examDateInputRef}
              mascotState={mascotState}
              petConfig={petConfig}
              petLevel={petLevel}
              dailyQuestionsSolved={dailyQuestionsSolved}
              dailyWordsStudied={dailyWordsStudied}
              dailyLecturesStudied={dailyLecturesStudied}
              dailyQuestionGoal={dailyQuestionGoal}
              dailyWordGoal={dailyWordGoal}
              notebook={notebook}
              setSpacedRepetitionModalWord={setSpacedRepetitionModalWord}
              getAchievementsList={getAchievementsList}
              getAchievementTier={getAchievementTier}
              activeOutfit={activeOutfit}
              setActiveOutfit={setActiveOutfit}
              stats={stats}
              setActiveTab={handleSetActiveTab}
              ROOM_BACKGROUNDS={ROOM_BACKGROUNDS}
              MascotPet={MascotPet}
            />

            {/* TAB 2: Tests view */}
            {selectedCategory && activeTab === 'tests' && (
              <TestsSection
                activeTab={activeTab}
                selectedCategory={selectedCategory}
                quizActive={quizActive}
                selectedExam={selectedExam}
                setSelectedExam={setSelectedExam}
                BACKEND_URL={BACKEND_URL}
                selectedTestTab={selectedTestTab}
                setSelectedTestTab={setSelectedTestTab}
                exams={exams}
                handleSelectExam={handleSelectExam}
                topicsList={topicsList}
                startTopicQuizSession={startTopicQuizSession}
                examDetailTab={examDetailTab}
                setExamDetailTab={setExamDetailTab}
                examQuestionSort={examQuestionSort}
                setExamQuestionSort={setExamQuestionSort}
                examQuestionSortDir={examQuestionSortDir}
                setExamQuestionSortDir={setExamQuestionSortDir}
                getSortedQuestionNumbers={getSortedQuestionNumbers}
                questionStats={questionStats}
                startCustomExamSession={startCustomExamSession}
                answers={answers}
              />
            )}

            {/* TAB 2: ACTIVE QUIZ SECTION */}
            {selectedCategory && activeTab === 'tests' && quizActive && (
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
            )}

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
                  logStudyActivity={logStudyActivity}
                />
              </section>
            )}

            {/* TAB 7.7: ACHIEVEMENTS (BAŞARIMLAR) SECTION */}
            <AchievementsSection
              activeTab={activeTab}
              selectedCategory={selectedCategory}
              achievementCategoryFilter={achievementCategoryFilter}
              setAchievementCategoryFilter={setAchievementCategoryFilter}
              achievementStatusFilter={achievementStatusFilter}
              setAchievementStatusFilter={setAchievementStatusFilter}
              getFilteredAchievements={getFilteredAchievements}
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
              chatbotName={chatbotName}
              setChatbotName={setChatbotName}
              setSelectedCategory={setSelectedCategory}
              setSelectedExam={setSelectedExam}
              showAiFloatBtn={showAiFloatBtn}
              setShowAiFloatBtn={setShowAiFloatBtn}
              mobileTabsConfig={mobileTabsConfig}
              setMobileTabsConfig={setMobileTabsConfig}
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
      {/* Dedicated Dynamic Mobil Bottom Nav Bar */}
      {selectedCategory && (
        <div className="mobile-bottom-nav">
          {mobileNavEditMode && (
            <>
              {/* Done button */}
              <button 
                onClick={() => { setMobileNavEditMode(false); setCustomizingSlotIndex(null); }}
                style={{
                  position: 'absolute',
                  top: '-148px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '0.72rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                  zIndex: 2500,
                  cursor: 'pointer'
                }}
              >
                ✓ Düzenlemeyi Tamamla
              </button>

              {/* Extra Items Drag Tray */}
              <div 
                style={{
                  position: 'fixed',
                  bottom: '84px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  zIndex: 2400,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#a5b4fc', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px', textAlign: 'left' }}>
                  💡 Kısayolları Sürükle ve Alt Panele Bırak (Yer değiştirir)
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {Object.entries(ALL_TABS)
                    .filter(([key]) => !mobileTabsConfig.slice(0, 5).includes(key))
                    .map(([key, info]) => (
                      <div
                        key={key}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', `extra:${key}`);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 10px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '0.62rem',
                          cursor: 'grab',
                          minWidth: '64px',
                          flexShrink: 0
                        }}
                      >
                        <i className={info.icon} style={{ fontSize: '0.95rem', marginBottom: '2px', color: '#818cf8' }}></i>
                        <span style={{ whiteSpace: 'nowrap' }}>{info.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}

          {mobileTabsConfig.slice(0, 5).map((tabKey, idx) => {
            const tabInfo = ALL_TABS[tabKey] || ALL_TABS['dashboard'];
            const isActive = activeTab === tabKey;
            
            let pressTimer;
            const startPress = () => {
              pressTimer = setTimeout(() => {
                setMobileNavEditMode(true);
                if (window.navigator.vibrate) {
                  window.navigator.vibrate(80);
                }
              }, 600);
            };
            const cancelPress = () => {
              clearTimeout(pressTimer);
            };

            return (
              <button
                key={`${tabKey}-${idx}`}
                className={`mobile-bottom-nav-item ${isActive ? 'active' : ''} ${mobileNavEditMode ? 'wiggle' : ''}`}
                draggable={mobileNavEditMode}
                onDragStart={(e) => {
                  if (mobileNavEditMode) {
                    e.dataTransfer.setData('text/plain', String(idx));
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const rawData = e.dataTransfer.getData('text/plain');
                  if (rawData.startsWith('extra:')) {
                    const extraKey = rawData.split(':')[1];
                    const newConfig = [...mobileTabsConfig];
                    newConfig[idx] = extraKey;
                    setMobileTabsConfig(newConfig);
                    localStorage.setItem('yokdil_mobile_tabs_config', JSON.stringify(newConfig));
                  } else {
                    const sourceIdx = parseInt(rawData, 10);
                    if (isNaN(sourceIdx) || sourceIdx === idx) return;
                    const newConfig = [...mobileTabsConfig];
                    const temp = newConfig[sourceIdx];
                    newConfig[sourceIdx] = newConfig[idx];
                    newConfig[idx] = temp;
                    setMobileTabsConfig(newConfig);
                    localStorage.setItem('yokdil_mobile_tabs_config', JSON.stringify(newConfig));
                  }
                }}
                onPointerDown={startPress}
                onPointerUp={cancelPress}
                onPointerCancel={cancelPress}
                onTouchStart={startPress}
                onTouchEnd={cancelPress}
                onClick={() => {
                  if (mobileNavEditMode) {
                    setCustomizingSlotIndex(idx);
                  } else {
                    if (tabKey === 'more-mobile') {
                      setShowMobileMoreSheet(true);
                    } else {
                      handleSetActiveTab(tabKey);
                      setQuizActive(false);
                    }
                  }
                }}
              >
                <i className={tabInfo.icon}></i>
                <span>{tabInfo.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Dynamic Customizable Slot Change sheet */}
      {customizingSlotIndex !== null && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(4px)',
            webkitBackdropFilter: 'blur(4px)'
          }}
          onClick={() => setCustomizingSlotIndex(null)}
        >
          <div 
            className="glass-card max-w-sm w-full p-6 text-left"
            style={{ maxHeight: '80vh', overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(15, 23, 42, 0.95)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-base font-bold text-white mb-4 flex justify-between items-center">
              <span>Sekme {customizingSlotIndex + 1} İçin Özellik Seçin</span>
              <button onClick={() => setCustomizingSlotIndex(null)} className="text-slate-400 hover:text-white">✕</button>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {Object.entries(ALL_TABS).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => {
                    const newTabs = [...mobileTabsConfig];
                    newTabs[customizingSlotIndex] = key;
                    setMobileTabsConfig(newTabs);
                    localStorage.setItem('yokdil_mobile_tabs_config', JSON.stringify(newTabs));
                    setCustomizingSlotIndex(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    color: 'white',
                    textAlign: 'left',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  <i className={info.icon} style={{ color: '#818cf8', width: '16px' }}></i>
                  <span>{info.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Customizable More Menu Sheet */}
      {showMobileMoreSheet && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 1000
            }} 
            onClick={() => setShowMobileMoreSheet(false)} 
          />
          <div className="mobile-more-bottom-sheet animate-slide-up" style={{ zIndex: 2600 }}>
            <div className="mobile-sheet-drag-handle"></div>
            <div className="mobile-sheet-header">
              <span className="mobile-sheet-title">Daha Fazla Seçenek</span>
              <button className="mobile-sheet-close" onClick={() => setShowMobileMoreSheet(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="mobile-more-grid">
              {Object.entries(ALL_TABS)
                .filter(([key]) => key !== 'more-mobile' && !mobileTabsConfig.includes(key))
                .map(([key, info]) => (
                  <button 
                    key={key}
                    className="mobile-more-item"
                    onClick={() => { 
                      handleSetActiveTab(key); 
                      setQuizActive(false); 
                      setShowMobileMoreSheet(false); 
                    }}
                  >
                    <i className={info.icon} style={{ color: '#818cf8' }}></i>
                    <span>{info.label}</span>
                  </button>
                ))}
            </div>

            <div className="mobile-sheet-footer">
              <button 
                className="change-course-btn"
                onClick={() => { 
                  setSelectedCategory(null); 
                  setSelectedExam(null); 
                  setQuizActive(false); 
                  setShowMobileMoreSheet(false); 
                }}
                style={{ width: '100%', flex: 'none' }}
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Alan Değiştir
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
