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
            <div className="glass-card p-8 border border-white/5 text-center text-slate-500 text-xs rounded-3xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert className="h-10 w-14 text-indigo-400 mx-auto mb-2 animate-pulse" />
              <span>Tebrikler! Çözümlü sınavlarda henüz hiç hata yapmadınız.</span>
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

            const isCorrect = selectedOption === exam.answers[mist.qNumber - 1];

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
                    const correctAns = exam.answers[mist.qNumber - 1];
                    
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

                {selectedOption && !isAnswered && (
                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition-all mt-4"
                    style={{ background: 'var(--primary-gradient)', cursor: 'pointer' }}
                  >
                    Cevabı Kontrol Et
                  </button>
                )}

                {isAnswered && (
                  <div className="space-y-3.5 mt-4" style={{ marginTop: '16px' }}>
                    <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                      isCorrect 
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                        : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                    }`}>
                      {isCorrect ? 'Tebrikler! Doğru cevap.' : `Yanlış cevap. Doğru şık: ${exam.answers[mist.qNumber - 1]}`}
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

            const isCorrect = selectedOption === exam.answers[mist.qNumber - 1];

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
                    const correctAns = exam.answers[mist.qNumber - 1];
                    
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

                {selectedOption && !isAnswered && (
                  <button
                    onClick={handleCheckAnswer}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition-all mt-4"
                    style={{ background: 'var(--primary-gradient)', cursor: 'pointer' }}
                  >
                    Cevabı Kontrol Et
                  </button>
                )}

                {isAnswered && (
                  <div className="space-y-3.5 mt-4" style={{ marginTop: '16px' }}>
                    <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                      isCorrect 
                        ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                        : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                    }`}>
                      {isCorrect ? 'Tebrikler! Doğru cevap.' : `Yanlış cevap. Doğru şık: ${exam.answers[mist.qNumber - 1]}`}
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
        activeWordIndex === null ? (
          vocabMistakes.length === 0 ? (
            <div className="glass-card p-8 border border-white/5 text-center text-slate-500 text-xs rounded-3xl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert className="h-10 w-14 text-indigo-400 mx-auto mb-2 animate-pulse" />
              <span>Harika! Kelime oyunlarında veya kartlarda henüz hatalı eşleşmeniz yok.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {vocabMistakes.map((word, idx) => {
                const stats = wordStats[word.english.toLowerCase()] || { correct: 0, wrong: 0 };
                return (
                  <div 
                    key={idx}
                    onClick={() => { setActiveWordIndex(idx); setVocabReveal(false); }}
                    className="glass-card flex items-center justify-between hover:border-indigo-500/30 transition-all"
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
                          background: 'rgba(245, 158, 11, 0.08)', 
                          border: '1px solid rgba(245, 158, 11, 0.15)',
                          color: '#F59E0B',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.2rem' }}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                          {word.english}
                        </h4>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
                          Yanlış Yapılma: {stats.wrong} kez
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: 'none'
                      }}
                    >
                      Kelimeyi Çalış <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Re-solving single vocabulary mistake */
          (() => {
            const word = vocabMistakes[activeWordIndex];
            if (!word) return null;
            const stats = wordStats[word.english.toLowerCase()] || { correct: 0, wrong: 0 };
            
            return (
              <div className="glass-card p-6 border border-white/5 rounded-3xl space-y-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={() => setActiveWordIndex(null)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ChevronLeft className="h-4 w-4" /> Hatalı Kelimeler Listesine Dön
                  </button>
                  <button 
                    onClick={() => playSpeechAudio(word.english)}
                    className="text-slate-500 hover:text-indigo-400"
                    style={{ fontSize: '0.75rem', fontWeight: '700' }}
                  >
                    🔊 Dinle
                  </button>
                </div>

                <div className="text-center py-6 space-y-4" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>İngilizce Kelime</span>
                    <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ margin: '4px 0 0 0' }}>
                      {word.english}
                    </h3>
                  </div>
                  
                  <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <Star className="h-3 w-3 inline text-rose-400" />
                    Doğru: {stats.correct} | Yanlış: {stats.wrong}
                  </span>
                </div>

                {vocabReveal ? (
                  <div className="glass-card p-5 border border-indigo-500/20 bg-indigo-950/10 text-center rounded-2xl space-y-3 animate-fade-in" style={{ padding: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#818cf8', letterSpacing: '0.05em' }}>Türkçe Anlamı</span>
                      <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399', marginTop: '6px' }}>{word.turkish}</div>
                    </div>
                    {(word.sentence_en || word.sentence_tr) && (
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: '12px', textAlign: 'left' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Örnek Cümle</span>
                        {word.sentence_en && (
                          <p style={{ fontSize: '0.8rem', color: '#e2e8f0', fontStyle: 'italic', margin: '4px 0 0 0', lineHeight: 1.4 }}>"{word.sentence_en}"</p>
                        )}
                        {word.sentence_tr && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '2px 0 0 0', lineHeight: 1.4 }}>{word.sentence_tr}</p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setVocabReveal(true)}
                    className="w-full py-3 text-xs font-bold text-white rounded-xl transition-all"
                    style={{ background: 'var(--primary-gradient)', border: 'none', cursor: 'pointer' }}
                  >
                    Anlamını Göster
                  </button>
                )}

                {vocabReveal && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2" style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                    <button 
                      onClick={() => setActiveWordIndex(null)}
                      className="flex-1 py-3 px-4 text-xs font-bold rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 transition-all text-center flex items-center justify-center gap-2"
                      style={{ cursor: 'pointer', minHeight: '46px' }}
                    >
                      <RefreshCw className="h-4 w-4 animate-spin-hover" /> Tekrar Sor
                    </button>
                    <button 
                      onClick={() => handleResolveWordMistake(word.english)}
                      className="flex-1 py-3 px-4 text-xs font-bold rounded-xl text-white hover:scale-[1.02] shadow-md transition-all text-center flex items-center justify-center gap-2"
                      style={{ 
                        cursor: 'pointer', 
                        minHeight: '46px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                      }}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Öğrendim (Kutudan Kaldır)
                    </button>
                  </div>
                )}
              </div>
            );
          })()
        )
      )}
    </div>
  );
};

export default MistakeInbox;
