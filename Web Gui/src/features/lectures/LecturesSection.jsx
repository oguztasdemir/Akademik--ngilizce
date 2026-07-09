import React, { useState, useEffect } from 'react';
import { BookOpen, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import fallbackExercises from '@dataset/yokdil/genel/lecture_exercises.json';

const LecturesSection = ({
  activeTab,
  lecturesList,
  activeLecture,
  handleLoadLecture,
  lectureLoading,
  renderMarkdown,
  startTopicQuiz,
  BACKEND_URL,
  incrementDailyQuestions,
  incrementDailyLectures,
  handleTextSelection
}) => {
  const renderInteractiveSentence = (text) => {
    return text || '';
  };

  const [lectureStep, setLectureStep] = useState(1); // 1 = explanation slides, 2 = exercise quiz
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [exerciseSelected, setExerciseSelected] = useState(null);
  const [exerciseChecked, setExerciseChecked] = useState(false);
  const [exerciseScore, setExerciseScore] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Reset states on lecture change
  useEffect(() => {
    setLectureStep(1);
    setCurrentSlideIdx(0);
    setExerciseIdx(0);
    setExerciseSelected(null);
    setExerciseChecked(false);
    setExerciseScore(0);
    setExerciseList([]);
    
    if (activeLecture) {
      const lid = activeLecture.id;
      const data = fallbackExercises[lid] || [];
      const scrambled = data.map(q => {
        if (q && Array.isArray(q.options)) {
          return {
            ...q,
            options: [...q.options].sort(() => 0.5 - Math.random())
          };
        }
        return q;
      });
      setExerciseList(scrambled);
    }
  }, [activeLecture]);

  if (activeTab !== 'lectures') return null;

  // Split markdown content into slides using "---" horizontal rules
  const getSlides = () => {
    if (!activeLecture || !activeLecture.content) return [];
    return activeLecture.content.split(/\n\s*---\s*\n/);
  };

  const slides = getSlides();

  const handleSelectOption = (opt) => {
    if (exerciseChecked) return;
    setExerciseSelected(opt);

    if (incrementDailyQuestions) incrementDailyQuestions();
    const currentEx = exerciseList[exerciseIdx];
    if (!currentEx) return;

    const isCorrect = opt === currentEx.answer;
    setExerciseChecked(true);
    if (isCorrect) {
      setExerciseScore(prev => prev + 1);
    }
  };

  const handleNextExercise = () => {
    setExerciseSelected(null);
    setExerciseChecked(false);
    setExerciseIdx(prev => prev + 1);
  };

  // Premium Option Button styling generator
  const getExerciseOptionStyle = (opt, correctAns, selectedOpt, isChecked) => {
    let base = {
      flex: '1',
      padding: '12px 20px',
      fontSize: '0.82rem',
      fontWeight: '700',
      borderRadius: '10px',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(255, 255, 255, 0.03)',
      color: '#e2e8f0',
      minWidth: '90px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
    };

    const isSelected = selectedOpt === opt;
    const isCorrect = opt === correctAns;

    if (isChecked) {
      if (isCorrect) {
        base = {
          ...base,
          background: 'rgba(16, 185, 129, 0.15)',
          borderColor: '#10b981',
          color: '#34d399',
          fontWeight: '800',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)'
        };
      } else if (isSelected) {
        base = {
          ...base,
          background: 'rgba(239, 68, 68, 0.15)',
          borderColor: '#ef4444',
          color: '#f87171',
          fontWeight: '800',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.25)'
        };
      } else {
        base = {
          ...base,
          opacity: 0.35
        };
      }
    } else if (isSelected) {
      base = {
        ...base,
        background: 'rgba(99, 102, 241, 0.18)',
        borderColor: '#6366f1',
        color: '#a5b4fc',
        fontWeight: '800',
        boxShadow: '0 0 10px rgba(99, 102, 241, 0.2)'
      };
    }

    return base;
  };

  return (
    <div className="space-y-4 text-left" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Title Header */}
      <div className="section-title">
        <h2>Gramer ve Sınav Stratejileri 📚</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>YÖKDİL sınavlarında başarı için kritik gramer konularını ve çözüm taktiklerini öğrenin.</p>
      </div>

      <div>
        {/* SCREEN 1: LECTURES LIST VIEW */}
        {!activeLecture ? (
          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-bold mb-2">Çalışmak istediğiniz konuyu seçin:</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lecturesList.map(lec => {
                return (
                  <div 
                    key={lec.id}
                    onClick={() => handleLoadLecture(lec.id)}
                    className="glass-card flex items-center justify-between hover:border-indigo-500/40 transition-all"
                    style={{ padding: '16px 20px', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifySpaceBetween: 'space-between', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div 
                        className="rounded-xl flex items-center justify-center" 
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          background: 'rgba(99, 102, 241, 0.08)', 
                          border: '1px solid rgba(99, 102, 241, 0.15)',
                          color: '#818CF8',
                          flexShrink: 0
                        }}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                          {lec.title || lec.name}
                        </h4>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                          {lec.description || "YÖKDİL Akademik gramer konusu anlatımı ve interaktif pratik soruları."}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-500" style={{ flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* SCREEN 2: ACTIVE LECTURE DETAIL READER */
          <div className="space-y-4">
            {/* Header Control Bar */}
            <div className="glass-card flex items-center justify-between" style={{ padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handleLoadLecture(null)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ChevronLeft className="h-4 w-4" /> Konu Listesine Dön
                </button>
                <button
                  onClick={() => setShowCheatSheet(true)}
                  className="rounded-lg px-3 py-1.5 text-xs font-bold border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 cursor-pointer"
                  title="Gramer Formül Kartları"
                >
                  📑 Gramer Formülleri
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aşama:</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {lectureStep === 1 ? `Konu Anlatımı (${currentSlideIdx + 1}/${slides.length})` : 'Cümle Alıştırmaları'}
                </span>
              </div>
            </div>

            {lectureLoading ? (
              <>
                <style>{`
                  @keyframes pulseShimmer {
                    0% { opacity: 0.45; }
                    50% { opacity: 0.85; }
                    100% { opacity: 0.45; }
                  }
                `}</style>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                  {/* Top Bar Skeleton */}
                  <div style={{ height: '24px', width: '50%', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                  {/* Main content body Skeleton */}
                  <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ height: '24px', width: '40%', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '6px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                    <div style={{ height: '14px', width: '90%', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', animation: 'pulseShimmer 1.5s infinite ease-in-out', marginTop: '8px' }} />
                    <div style={{ height: '14px', width: '85%', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                    <div style={{ height: '14px', width: '95%', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                    <div style={{ height: '14px', width: '60%', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '4px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                  </div>
                  {/* Bottom Navigation skeleton */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div style={{ height: '40px', width: '100px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                    <div style={{ height: '40px', width: '140px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', animation: 'pulseShimmer 1.5s infinite ease-in-out' }} />
                  </div>
                </div>
              </>
            ) : lectureStep === 1 ? (
              /* STAGE 1: STEP-BY-STEP SLIDE VIEW */
              <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl space-y-6">
                
                {/* Stepper Node Pipeline */}
                {slides.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    marginBottom: '10px'
                  }}>
                    {slides.map((_, idx) => {
                      const isActive = currentSlideIdx === idx;
                      const isCompleted = idx < currentSlideIdx;
                      
                      let nodeStyle = {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        border: '1px solid',
                        flexShrink: 0
                      };
                      
                      if (isActive) {
                        nodeStyle = {
                          ...nodeStyle,
                          background: '#4f46e5', // Indigo 600
                          borderColor: '#6366f1',
                          color: '#ffffff',
                          boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
                        };
                      } else if (isCompleted) {
                        nodeStyle = {
                          ...nodeStyle,
                          background: 'rgba(16, 185, 129, 0.15)', // Emerald
                          borderColor: '#10b981',
                          color: '#34d399'
                        };
                      } else {
                        nodeStyle = {
                          ...nodeStyle,
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          color: '#94a3b8'
                        };
                      }

                      return (
                        <React.Fragment key={idx}>
                          <button 
                            onClick={() => setCurrentSlideIdx(idx)}
                            style={nodeStyle}
                          >
                            {idx + 1}
                          </button>
                          {idx < slides.length - 1 && (
                            <div style={{
                              flexGrow: 1,
                              height: '2px',
                              background: idx < currentSlideIdx ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                              transition: 'all 0.25s ease'
                            }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}

                {/* Current Slide Content Box */}
                <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed space-y-4 py-2">
                  {renderMarkdown(slides[currentSlideIdx])}
                </div>

                {/* Back / Next Slide Navigation Buttons */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    disabled={currentSlideIdx === 0}
                    onClick={() => setCurrentSlideIdx(prev => prev - 1)}
                    className="btn-secondary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: currentSlideIdx === 0 ? 'not-allowed' : 'pointer',
                      opacity: currentSlideIdx === 0 ? 0.35 : 1
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" /> Geri
                  </button>

                  <button
                    onClick={() => {
                      if (currentSlideIdx < slides.length - 1) {
                        setCurrentSlideIdx(prev => prev + 1);
                      } else {
                        setLectureStep(2); // Go to exercises
                        if (incrementDailyLectures) incrementDailyLectures();
                      }
                    }}
                    className="btn-primary"
                    style={{
                      padding: '10px 24px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {currentSlideIdx < slides.length - 1 ? (
                      <>İleri <ChevronRight className="h-4 w-4" /></>
                    ) : (
                      <>Alıştırmalara Geç 🚀</>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* STAGE 2: INTERACTIVE PRACTICE QUESTIONS (100 Questions) */
              <div className="space-y-4">
                {exerciseList.length > 0 && exerciseIdx < exerciseList.length ? (
                  (() => {
                    const currentEx = exerciseList[exerciseIdx];
                    return (
                      <div className="glass-card p-6 border border-white/5 bg-gradient-to-br from-indigo-950/20 via-slate-900/40 to-slate-950/60 rounded-3xl space-y-6" style={{ background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(99, 102, 241, 0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.62rem', fontWeight: '800', color: '#818cf8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>✍️ INTERAKTIF CÜMLE PRATİĞİ</span>
                            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#94a3b8' }}>Soru {exerciseIdx + 1} / {exerciseList.length}</span>
                          </div>
                          {/* Sleek animated progress bar */}
                          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${((exerciseIdx + 1) / exerciseList.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #3b82f6)', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                          </div>
                        </div>

                        <div 
                          onMouseUp={(e) => {
                            if (handleTextSelection) handleTextSelection(e);
                          }}
                          onTouchEnd={(e) => {
                            if (handleTextSelection) {
                              setTimeout(() => {
                                handleTextSelection(e);
                              }, 100);
                            }
                          }}
                          className="text-sm font-semibold text-slate-100 text-center leading-relaxed py-6 border-y border-white/5" 
                          style={{ fontSize: '1.05rem', color: '#f1f5f9', cursor: 'pointer', userSelect: 'text', WebkitUserSelect: 'text', borderTop: '1px dashed rgba(255,255,255,0.06)', borderBottom: '1px dashed rgba(255,255,255,0.06)' }}
                        >
                          {currentEx.sentence}
                        </div>

                        {/* Options Grid with premium styled borders */}
                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                          {currentEx.options.map((opt) => {
                            return (
                              <button
                                key={opt}
                                onClick={() => handleSelectOption(opt)}
                                disabled={exerciseChecked}
                                style={getExerciseOptionStyle(opt, currentEx.answer, exerciseSelected, exerciseChecked)}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {exerciseChecked && (
                          <div className="glass-card p-5 border border-indigo-500/10 bg-indigo-500/5 rounded-2xl space-y-2" style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)', animation: 'slideDown 0.3s ease-out' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '900', color: exerciseSelected === currentEx.answer ? '#10b981' : '#f87171' }}>
                              {exerciseSelected === currentEx.answer ? '✔️ Tebrikler, Doğru Cevap!' : '❌ Üzgünüz, Yanlış Cevap!'}
                            </div>
                            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                              {currentEx.explanation}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                          {exerciseChecked && (
                            <button
                              onClick={handleNextExercise}
                              className="btn-primary"
                              style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '10px' }}
                            >
                              {exerciseIdx < exerciseList.length - 1 ? 'Sonraki Soru ➡️' : 'Alıştırmayı Bitir 🏁'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* SUMMARY CARD */
                  <div className="glass-card p-6 border border-indigo-500/20 bg-indigo-500/5 text-center rounded-2xl space-y-4">
                    <Sparkles className="h-8 w-8 text-indigo-400 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-100">Tebrikler! Alıştırmanın Sonuna Geldiniz.</h4>
                    <p className="text-xs text-slate-400">Bu konudaki alıştırma skorunuz: <strong style={{ color: 'var(--primary-light)' }}>{exerciseScore} / 100</strong></p>
                    
                    <div className="flex justify-center gap-3" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button 
                        onClick={() => {
                          setExerciseIdx(0);
                          setExerciseSelected(null);
                          setExerciseChecked(false);
                          setExerciseScore(0);
                        }}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Yeniden Başlat
                      </button>
                      
                      <button 
                        onClick={() => {
                          handleLoadLecture(null);
                        }}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        Ders Listesine Dön
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Grammar Cheat Sheet Modal Overlay */}
      {showCheatSheet && (
        <div className="auth-modal-overlay" style={{ zIndex: 100000 }} onClick={() => setShowCheatSheet(false)}>
          <div 
            className="auth-modal-card text-left" 
            style={{ maxWidth: '520px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(10, 15, 30, 0.95)', border: '1px solid rgba(99, 102, 241, 0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                📑 YÖKDİL Bağlaç & Gramer Formülleri
              </h3>
              <button 
                onClick={() => setShowCheatSheet(false)}
                style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                ×
              </button>
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {/* Category 1 */}
              <div>
                <h4 style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: '800', borderBottom: '1px solid rgba(251, 191, 36, 0.15)', paddingBottom: '4px', marginBottom: '6px' }}>
                  1. ZITLIK BAĞLAÇLARI (Contrast)
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <p style={{ margin: '4px 0' }}><strong>+ Cümle Alır (Clause):</strong> Although, Even though, Though, While, Whereas, Much as</p>
                  <p style={{ margin: '4px 0' }}><strong>+ İsim/Fiil Alır (Noun/Ving):</strong> Despite, In spite of, Notwithstanding</p>
                  <p style={{ margin: '4px 0' }}><strong>+ Zarf (Geçiş Kelimesi):</strong> However, Nevertheless, Nonetheless, Even so</p>
                </div>
              </div>

              {/* Category 2 */}
              <div>
                <h4 style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: '800', borderBottom: '1px solid rgba(96, 165, 250, 0.15)', paddingBottom: '4px', marginBottom: '6px' }}>
                  2. NEDEN-SONUÇ BAĞLAÇLARI (Cause & Effect)
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <p style={{ margin: '4px 0' }}><strong>+ Cümle Alır (Clause):</strong> Because, Since, As, Inasmuch as, Seeing that</p>
                  <p style={{ margin: '4px 0' }}><strong>+ İsim Alır (Noun):</strong> Because of, Due to, Owing to, On account of, As a result of</p>
                  <p style={{ margin: '4px 0' }}><strong>+ Sonuç Zarfı:</strong> Therefore, Thus, Hence, As a result, Consequently</p>
                </div>
              </div>

              {/* Category 3 */}
              <div>
                <h4 style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: '800', borderBottom: '1px solid rgba(52, 211, 153, 0.15)', paddingBottom: '4px', marginBottom: '6px' }}>
                  3. KOŞUL BAĞLAÇLARI (Condition)
                </h4>
                <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                  <p style={{ margin: '4px 0' }}><strong>+ Cümle Alır (Clause):</strong> If, Unless, Provided that, As long as, In case</p>
                  <p style={{ margin: '4px 0' }}><strong>+ İsim Alır (Noun):</strong> In case of, But for, Without</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowCheatSheet(false)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px', fontSize: '0.78rem', cursor: 'pointer' }}
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturesSection;
