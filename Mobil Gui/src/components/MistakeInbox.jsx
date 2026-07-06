import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, BookOpen, Star, ChevronLeft, RefreshCw } from 'lucide-react';

const MistakeInbox = ({
  activeTab,
  mistakes,
  setMistakes,
  exams,
  playSpeechAudio,
  renderMarkdown,
  activeExplanation,
  loadQuestionExplanation,
  setActiveExplanation,
  wordStats = {},
  vocabPracticeList = [],
  notebook = [],
  recordWordStat
}) => {
  const [mistakeSection, setMistakeSection] = useState('tests'); // 'tests', 'vocabulary'
  
  // Test mistakes states
  const [activeMistakeIndex, setActiveMistakeIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Marathon Mode states
  const [isMarathonMode, setIsMarathonMode] = useState(false);
  const [marathonIndex, setMarathonIndex] = useState(0);

  // Vocabulary mistakes states
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [vocabReveal, setVocabReveal] = useState(false);

  if (activeTab !== 'mistakes') return null;

  const safeMistakes = mistakes || [];

  // Filter vocabulary pool for words that have wrong counts > 0
  const pool = notebook.length > 0 ? notebook : vocabPracticeList;
  const vocabMistakes = pool.filter(word => {
    if (!word || !word.english) return false;
    const stats = wordStats[word.english.toLowerCase()] || { correct: 0, wrong: 0 };
    return stats.wrong > 0;
  });

  const handleSelectMistake = (index) => {
    setActiveMistakeIndex(index);
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveExplanation(null);
    const mist = safeMistakes[index];
    if (mist) {
      loadQuestionExplanation(mist.qNumber, mist.examId);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    setIsAnswered(true);
  };

  const handleRemoveMistake = (index) => {
    const newMistakes = safeMistakes.filter((_, idx) => idx !== index);
    setMistakes(newMistakes);
    localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
    setActiveMistakeIndex(null);
  };

  const handleStartMarathon = () => {
    if (safeMistakes.length === 0) return;
    setIsMarathonMode(true);
    setMarathonIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveExplanation(null);
    const firstMistake = safeMistakes[0];
    if (firstMistake) {
      loadQuestionExplanation(firstMistake.qNumber, firstMistake.examId);
    }
  };

  const handleNextMarathonQuestion = () => {
    const targetMistake = safeMistakes[marathonIndex];
    if (!targetMistake) return;
    const newMistakes = safeMistakes.filter(m => !(m.qNumber === targetMistake.qNumber && m.examId === targetMistake.examId));
    setMistakes(newMistakes);
    localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));

    if (newMistakes.length === 0) {
      setIsMarathonMode(false);
      alert("🎉 Harika! Tüm hatalı sorularınızı başarıyla temizlediniz!");
      return;
    }

    const nextIndex = marathonIndex >= newMistakes.length ? 0 : marathonIndex;
    setMarathonIndex(nextIndex);
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveExplanation(null);
    
    const nextMist = newMistakes[nextIndex];
    if (nextMist) {
      loadQuestionExplanation(nextMist.qNumber, nextMist.examId);
    }
  };

  // Mark word mistake as resolved
  const handleResolveWordMistake = (word) => {
    if (recordWordStat) {
      recordWordStat(word, true);
    }
    setActiveWordIndex(null);
    setVocabReveal(false);
  };

  // Tab Styles
  const activeTabStyle = {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    borderRadius: '12px',
    background: 'var(--primary-gradient)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
    transition: 'all 0.25s ease',
    border: 'none',
    cursor: 'pointer'
  };

  const inactiveTabStyle = {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.25s ease',
    cursor: 'pointer'
  };

  return (
    <div className="space-y-4 text-left" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="section-title">
        <h2>Hata Kutusu (Mistake Inbox) 📂</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Yanlış yaptığınız soruları ve kelimeleri tekrar çalışarak kalıcı olarak öğrenin.</p>
      </div>

      {/* Sub-Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '6px', 
        background: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '16px'
      }}>
        <button 
          onClick={() => { setMistakeSection('tests'); setActiveMistakeIndex(null); setActiveWordIndex(null); }}
          style={mistakeSection === 'tests' ? activeTabStyle : inactiveTabStyle}
        >
          📝 Test Hataları ({mistakes.length})
        </button>
        <button 
          onClick={() => { setMistakeSection('vocabulary'); setActiveMistakeIndex(null); setActiveWordIndex(null); }}
          style={mistakeSection === 'vocabulary' ? activeTabStyle : inactiveTabStyle}
        >
          📇 Kelime Hataları ({vocabMistakes.length})
        </button>
      </div>

      {/* SECTION 1: TEST MISTAKES */}
      {mistakeSection === 'tests' && (
        (activeMistakeIndex === null && !isMarathonMode) ? (
          mistakes.length === 0 ? (
            <div className="glass-card p-12 border border-white/5 text-center rounded-3xl premium-empty-state">
              <div className="empty-state-illustration animate-float">
                <i className="fa-solid fa-graduation-cap empty-state-icon" style={{ color: '#818cf8', fontSize: '3rem' }}></i>
                <div className="empty-state-sparkles">
                  <span className="sparkle-1">✨</span>
                  <span className="sparkle-2">✨</span>
                </div>
              </div>
              <h3 className="empty-state-title">Tertemiz Bir Geçmiş!</h3>
              <p className="empty-state-text">Tebrikler! Çözümlü sınavlarda henüz hiç hata yapmadınız.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleStartMarathon}
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  color: '#1e293b',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  fontSize: '0.82rem',
                  fontWeight: '800',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)',
                  marginBottom: '10px'
                }}
              >
                ⚡ Hata Temizleme Maratonu Başlat ({mistakes.length} Soru) 🏃‍♂️
              </button>
              {mistakes.map((mist, idx) => {
                const examName = exams.find(e => e.id === mist.examId)?.name || 'YÖKDİL Sınavı';
                return (
                  <div 
                    key={idx}
                    onClick={() => handleSelectMistake(idx)}
                    className="glass-card flex items-center justify-between hover:border-rose-500/30 transition-all"
                    style={{ 
                      padding: '16px 20px', 
                      borderRadius: '14px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      background: 'rgba(18, 24, 41, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div 
                        style={{ 
                          width: '42px', 
                          height: '42px', 
                          background: 'rgba(239, 68, 68, 0.08)', 
                          border: '1px solid rgba(239, 68, 68, 0.15)',
                          color: '#EF4444',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <i className="fa-solid fa-circle-xmark" style={{ fontSize: '1.2rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                          Soru {mist.qNumber}
                        </h4>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                          {examName}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #EF4444, #F87171)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none'
                      }}
                    >
                      Soruyu Çöz <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : isMarathonMode ? (
          /* Marathon mode rendering */
          (() => {
            const mist = mistakes[marathonIndex];
            if (!mist) return null;
            const exam = exams.find(e => e.id === mist.examId);
            if (!exam) return null;
            const question = exam.questions.find(q => q.number === mist.qNumber);
            if (!question) return null;

            const isCorrect = selectedOption === question.correct_option;

            return (
              <div className="duo-quiz-container" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button 
                    onClick={() => setIsMarathonMode(false)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ChevronLeft className="h-4 w-4" /> Maratondan Çık
                  </button>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    Soru: {marathonIndex + 1} / {mistakes.length}
                  </span>
                </div>

                <div className="duo-question-card">
                  <div className="duo-question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="duo-question-badge">{exam.name} - Soru {mist.qNumber}</span>
                    <button 
                      onClick={() => playSpeechAudio(question.text)}
                      className="text-slate-500 hover:text-indigo-400 ml-auto"
                      style={{ fontSize: '0.75rem', fontWeight: '700' }}
                    >
                      🔊 Dinle
                    </button>
                  </div>
                  
                  <div className="duo-question-title">
                    {question.text}
                  </div>
                </div>

                <div className="duo-options-list">
                  {['A', 'B', 'C', 'D', 'E'].map((option, idx) => {
                    const optText = question.options[idx];
                    const isSelected = selectedOption === option;
                    const correctAns = question.correct_option;
                    
                    let cardClass = '';
                    if (isAnswered) {
                      if (option === correctAns) {
                        cardClass = 'correct';
                      } else if (isSelected) {
                        cardClass = 'incorrect';
                      } else {
                        cardClass = 'disabled';
                      }
                    } else if (isSelected) {
                      cardClass = 'selected';
                    }

                    return (
                      <div
                        key={option}
                        onClick={() => {
                          if (!isAnswered) {
                            setSelectedOption(option);
                            setIsAnswered(true);
                          }
                        }}
                        className={`duo-option-card ${cardClass}`}
                      >
                        <div className="duo-option-badge">{option}</div>
                        <div className="duo-option-text">{optText || `Seçenek ${option}`}</div>
                      </div>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="space-y-3.5 mt-4" style={{ marginTop: '16px' }}>
                    <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                      isCorrect 
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                        : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                    }`}>
                      {isCorrect ? 'Tebrikler! Doğru cevap.' : `Yanlış cevap. Doğru şık: ${question.correct_option} | Cevap: ${question.correct_answer}`}
                    </div>

                    {isCorrect ? (
                      <button
                        onClick={handleNextMarathonQuestion}
                        className="w-full py-3 text-xs font-bold text-white rounded-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', cursor: 'pointer' }}
                      >
                        Doğru! Sonraki Soruya Geç ➡️
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedOption(null);
                          setIsAnswered(false);
                          setActiveExplanation(null);
                        }}
                        className="w-full py-3 text-xs font-bold text-white rounded-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', cursor: 'pointer' }}
                      >
                        Tekrar Dene 🔄
                      </button>
                    )}

                    {activeExplanation && (
                      <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-2 mt-4 text-xs">
                        <h4 className="font-bold text-slate-300 border-b border-white/5 pb-1">Gramer/Kelime Çözüm Analizi:</h4>
                        {renderMarkdown(activeExplanation.explanation)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          /* Re-solving single mistake */
          (() => {
            const mist = mistakes[activeMistakeIndex];
            const exam = exams.find(e => e.id === mist.examId);
            if (!exam) return null;
            const question = exam.questions.find(q => q.number === mist.qNumber);
            if (!question) return null;

            const isCorrect = selectedOption === question.correct_option;

            return (
              <div className="duo-quiz-container" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button 
                    onClick={() => setActiveMistakeIndex(null)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ChevronLeft className="h-4 w-4" /> Hatalarım Listesine Dön
                  </button>
                  <button
                    onClick={() => handleRemoveMistake(activeMistakeIndex)}
                    className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 transition-all"
                  >
                    Listeden Sil
                  </button>
                </div>

                <div className="duo-question-card">
                  <div className="duo-question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="duo-question-badge">Soru {mist.qNumber}</span>
                    <button 
                      onClick={() => playSpeechAudio(question.text)}
                      className="text-slate-500 hover:text-indigo-400 ml-auto"
                      style={{ fontSize: '0.75rem', fontWeight: '700' }}
                    >
                      🔊 Dinle
                    </button>
                  </div>
                  
                  <div className="duo-question-title">
                    {question.text}
                  </div>
                </div>

                <div className="duo-options-list">
                  {['A', 'B', 'C', 'D', 'E'].map((option, idx) => {
                    const optText = question.options[idx];
                    const isSelected = selectedOption === option;
                    const correctAns = question.correct_option;
                    
                    let cardClass = '';
                    if (isAnswered) {
                      if (option === correctAns) {
                        cardClass = 'correct';
                      } else if (isSelected) {
                        cardClass = 'incorrect';
                      } else {
                        cardClass = 'disabled';
                      }
                    } else if (isSelected) {
                      cardClass = 'selected';
                    }

                    return (
                      <div
                        key={option}
                        onClick={() => {
                          if (!isAnswered) {
                            setSelectedOption(option);
                            setIsAnswered(true);
                          }
                        }}
                        className={`duo-option-card ${cardClass}`}
                      >
                        <div className="duo-option-badge">{option}</div>
                        <div className="duo-option-text">{optText || `Seçenek ${option}`}</div>
                      </div>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="space-y-3.5 mt-4" style={{ marginTop: '16px' }}>
                    <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                      isCorrect 
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                        : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                    }`}>
                      {isCorrect ? 'Tebrikler! Doğru cevap.' : `Yanlış cevap. Doğru şık: ${question.correct_option} | Cevap: ${question.correct_answer}`}
                    </div>

                    {isCorrect && (
                      <button
                        onClick={() => handleRemoveMistake(activeMistakeIndex)}
                        className="w-full py-3 text-xs font-bold text-white rounded-xl transition-all"
                        style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', cursor: 'pointer' }}
                      >
                        Hatalarımdan Temizle
                      </button>
                    )}

                    {activeExplanation && (
                      <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-2 mt-4 text-xs">
                        <h4 className="font-bold text-slate-300 border-b border-white/5 pb-1">Gramer/Kelime Çözüm Analizi:</h4>
                        {renderMarkdown(activeExplanation.explanation)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()
        )
      )}

      {/* SECTION 2: VOCABULARY MISTAKES */}
      {mistakeSection === 'vocabulary' && (
        vocabMistakes.length === 0 ? (
          <div className="glass-card p-12 border border-white/5 text-center rounded-3xl premium-empty-state">
            <div className="empty-state-illustration animate-float">
              <i className="fa-solid fa-book-open-reader empty-state-icon" style={{ color: '#34d399', fontSize: '3rem' }}></i>
              <div className="empty-state-sparkles">
                <span className="sparkle-1">✨</span>
                <span className="sparkle-2">✨</span>
              </div>
            </div>
            <h3 className="empty-state-title">Kelime Bilgin Sapasağlam!</h3>
            <p className="empty-state-text">Harika! Kelime oyunlarında veya kartlarda henüz hatalı eşleşmeniz yok.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {vocabMistakes.map((word, idx) => {
              const stats = wordStats[word.english.toLowerCase()] || { correct: 0, wrong: 0 };
              return (
                <div 
                  key={idx}
                  className="glass-card animate-scale-in"
                  style={{ 
                    padding: '16px 20px', 
                    borderRadius: '16px', 
                    background: 'rgba(18, 24, 41, 0.55)',
                    border: '1px solid rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>İngilizce</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                        {word.english}
                      </h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase' }}>Türkçe</span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                        {word.turkish}
                      </h4>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 'bold' }}>
                      ❌ {stats.wrong} kez yanlış yapıldı
                    </span>
                    <button 
                      onClick={() => handleResolveWordMistake(word.english)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={12} /> Öğrendim
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default MistakeInbox;
