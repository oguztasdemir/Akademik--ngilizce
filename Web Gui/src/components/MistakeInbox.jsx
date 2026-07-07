import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, BookOpen, Star, ChevronLeft, RefreshCw, Trophy } from 'lucide-react';

const MistakeInbox = ({
  activeTab,
  mistakes = [],
  setMistakes,
  exams = [],
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
  const [mistakeSection, setMistakeSection] = useState('tests'); // 'tests', 'camp', 'reading', 'vocabulary'
  
  // Test mistakes states
  const [activeMistakeIndex, setActiveMistakeIndex] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Marathon Mode states
  const [isMarathonMode, setIsMarathonMode] = useState(false);
  const [marathonIndex, setMarathonIndex] = useState(0);

  // Vocabulary states
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  
  // Expanded mistake details states
  const [activeCampIndex, setActiveCampIndex] = useState(null);
  const [activeReadingIndex, setActiveReadingIndex] = useState(null);

  if (activeTab !== 'mistakes') return null;

  const safeMistakes = mistakes || [];

  // Filter mistakes by category
  const examMistakesList = safeMistakes.filter(m => !m.type || m.type === 'exam_question');
  const campMistakesList = safeMistakes.filter(m => m.type === 'camp_question');
  const readingMistakesList = safeMistakes.filter(m => m.type === 'reading_question');

  // Vocabulary / Word Mistakes Pool
  const pool = notebook.length > 0 ? notebook : vocabPracticeList;
  const oldVocabMistakes = pool.filter(word => {
    if (!word || !word.english) return false;
    const stats = wordStats[word.english.toLowerCase()] || { correct: 0, wrong: 0 };
    return stats.wrong > 0;
  });

  const wordMistakesFromType = safeMistakes.filter(m => m.type === 'word');
  
  // Combine all word mistakes, avoiding duplicates by english word
  const allWordMistakes = [...wordMistakesFromType.map(wm => ({
    english: wm.word,
    turkish: wm.meaning,
    sentence: wm.sentence,
    translation: wm.translation,
    isFromType: true,
    id: wm.id
  }))];
  
  oldVocabMistakes.forEach(ovm => {
    if (!allWordMistakes.some(awm => awm.english.toLowerCase() === ovm.english.toLowerCase())) {
      allWordMistakes.push({
        english: ovm.english,
        turkish: ovm.turkish || ovm.meaning || '',
        sentence: ovm.sentence || '',
        translation: ovm.translation || '',
        isFromType: false
      });
    }
  });

  // Resolve handlers
  const handleResolveWordMistake = (wordEnglish, id = null) => {
    if (id) {
      const newMistakes = safeMistakes.filter(m => m.id !== id);
      setMistakes(newMistakes);
      localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
    }
    if (recordWordStat) {
      recordWordStat(wordEnglish, true);
    }
  };

  const handleResolveCampMistake = (idx) => {
    const target = campMistakesList[idx];
    if (target) {
      const newMistakes = safeMistakes.filter(m => m.id !== target.id);
      setMistakes(newMistakes);
      localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
    }
    setActiveCampIndex(null);
  };

  const handleResolveReadingMistake = (idx) => {
    const target = readingMistakesList[idx];
    if (target) {
      const newMistakes = safeMistakes.filter(m => m.id !== target.id);
      setMistakes(newMistakes);
      localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
    }
    setActiveReadingIndex(null);
  };

  const handleRemoveMistake = (index) => {
    const target = examMistakesList[index];
    if (target) {
      const newMistakes = safeMistakes.filter(m => !(m.examId === target.examId && m.qNumber === target.qNumber));
      setMistakes(newMistakes);
      localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));
    }
    setActiveMistakeIndex(null);
  };

  const handleSelectMistake = (index) => {
    setActiveMistakeIndex(index);
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveExplanation(null);
    const mist = examMistakesList[index];
    if (mist) {
      loadQuestionExplanation(mist.qNumber, mist.examId);
    }
  };

  const handleStartMarathon = () => {
    if (examMistakesList.length === 0) return;
    setIsMarathonMode(true);
    setMarathonIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveExplanation(null);
    const firstMistake = examMistakesList[0];
    if (firstMistake) {
      loadQuestionExplanation(firstMistake.qNumber, firstMistake.examId);
    }
  };

  const handleNextMarathonQuestion = () => {
    const targetMistake = examMistakesList[marathonIndex];
    if (!targetMistake) return;
    const newMistakes = safeMistakes.filter(m => !(m.qNumber === targetMistake.qNumber && m.examId === targetMistake.examId));
    setMistakes(newMistakes);
    localStorage.setItem('yokdil_mistakes', JSON.stringify(newMistakes));

    const remainingExams = newMistakes.filter(m => !m.type || m.type === 'exam_question');
    if (remainingExams.length === 0) {
      setIsMarathonMode(false);
      alert("🎉 Harika! Tüm hatalı sorularınızı başarıyla temizlediniz!");
      return;
    }

    const nextIndex = marathonIndex >= remainingExams.length ? 0 : marathonIndex;
    setMarathonIndex(nextIndex);
    setSelectedOption(null);
    setIsAnswered(false);
    setActiveExplanation(null);
    
    const nextMist = remainingExams[nextIndex];
    if (nextMist) {
      loadQuestionExplanation(nextMist.qNumber, nextMist.examId);
    }
  };

  // Tab Styles
  const activeTabStyle = {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontWeight: '700',
    borderRadius: '12px',
    background: 'var(--primary-gradient)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
    transition: 'all 0.25s ease',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };

  const inactiveTabStyle = {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.78rem',
    fontWeight: '600',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  };

  return (
    <div className="space-y-4 text-left" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div className="section-title">
        <h2>Hata Kutusu (Mistake Inbox) 📂</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Farklı modlarda yaptığınız tüm hataları ve bilmediğiniz kelimeleri buradan çalışın.</p>
      </div>

      {/* Sub-Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        padding: '6px', 
        background: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '16px',
        overflowX: 'auto'
      }}>
        <button 
          onClick={() => { setMistakeSection('tests'); setActiveMistakeIndex(null); }}
          style={mistakeSection === 'tests' ? activeTabStyle : inactiveTabStyle}
        >
          📝 Sınav Hataları ({examMistakesList.length})
        </button>
        <button 
          onClick={() => { setMistakeSection('camp'); setActiveCampIndex(null); }}
          style={mistakeSection === 'camp' ? activeTabStyle : inactiveTabStyle}
        >
          ⛺ Kamp Hataları ({campMistakesList.length})
        </button>
        <button 
          onClick={() => { setMistakeSection('reading'); setActiveReadingIndex(null); }}
          style={mistakeSection === 'reading' ? activeTabStyle : inactiveTabStyle}
        >
          📖 Okuma Hataları ({readingMistakesList.length})
        </button>
        <button 
          onClick={() => { setMistakeSection('vocabulary'); }}
          style={mistakeSection === 'vocabulary' ? activeTabStyle : inactiveTabStyle}
        >
          📇 Bilinmeyen Kelimeler ({allWordMistakes.length})
        </button>
      </div>

      {/* SECTION 1: TEST MISTAKES */}
      {mistakeSection === 'tests' && (
        (activeMistakeIndex === null && !isMarathonMode) ? (
          examMistakesList.length === 0 ? (
            <div className="glass-card p-12 border border-white/5 text-center rounded-3xl premium-empty-state">
              <i className="fa-solid fa-graduation-cap" style={{ color: '#818cf8', fontSize: '3rem', marginBottom: '12px' }}></i>
              <h3 className="empty-state-title">Tertemiz Bir Geçmiş!</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Çözümlü sınavlarda henüz hiç hata yapmadınız.</p>
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
                ⚡ Hata Temizleme Maratonu Başlat ({examMistakesList.length} Soru) 🏃‍♂️
              </button>
              {examMistakesList.map((mist, idx) => {
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
                      <div style={{ width: '42px', height: '42px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '12px', display: 'flex', alignItems: 'center', justify_content: 'center', flexShrink: 0 }}>
                        <XCircle size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>Soru {mist.qNumber}</h4>
                        <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: 0 }}>{examName}</p>
                      </div>
                    </div>
                    <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem', fontWeight: '700', borderRadius: '10px' }}>Soruyu Çöz</button>
                  </div>
                );
              })}
            </div>
          )
        ) : isMarathonMode ? (
          /* Marathon mode rendering */
          (() => {
            const mist = examMistakesList[marathonIndex];
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
                    Soru: {marathonIndex + 1} / {examMistakesList.length}
                  </span>
                </div>

                <div className="duo-question-card">
                  <div className="duo-question-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span className="duo-question-badge">{exam.name} - Soru {mist.qNumber}</span>
                  </div>
                  <div className="duo-question-title">{question.text}</div>
                </div>

                <div className="duo-options-list">
                  {['A', 'B', 'C', 'D', 'E'].map((option, idx) => {
                    const optText = question.options[idx];
                    const isSelected = selectedOption === option;
                    const correctAns = question.correct_option;
                    
                    let cardClass = '';
                    if (isAnswered) {
                      if (option === correctAns) cardClass = 'correct';
                      else if (isSelected) cardClass = 'incorrect';
                      else cardClass = 'disabled';
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
                    <div className={`p-4 border rounded-2xl text-xs font-semibold ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-400'}`}>
                      {isCorrect ? 'Tebrikler! Doğru cevap.' : `Yanlış cevap. Doğru şık: ${question.correct_option}`}
                    </div>
                    {isCorrect ? (
                      <button onClick={handleNextMarathonQuestion} className="w-full py-3 text-xs font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', cursor: 'pointer' }}>Sonraki Soruya Geç ➡️</button>
                    ) : (
                      <button onClick={() => { setSelectedOption(null); setIsAnswered(false); }} className="w-full py-3 text-xs font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', cursor: 'pointer' }}>Tekrar Dene 🔄</button>
                    )}
                    {activeExplanation && (
                      <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-2 mt-4 text-xs">
                        <h4 className="font-bold text-slate-300 border-b border-white/5 pb-1">Çözüm Analizi:</h4>
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
            const mist = examMistakesList[activeMistakeIndex];
            const exam = exams.find(e => e.id === mist.examId);
            if (!exam) return null;
            const question = exam.questions.find(q => q.number === mist.qNumber);
            if (!question) return null;
            const isCorrect = selectedOption === question.correct_option;

            return (
              <div className="duo-quiz-container" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setActiveMistakeIndex(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><ChevronLeft className="h-4 w-4" /> Hatalarım Listesine Dön</button>
                  <button onClick={() => handleRemoveMistake(activeMistakeIndex)} className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-600/20 transition-all">Listeden Sil</button>
                </div>

                <div className="duo-question-card">
                  <div className="duo-question-title">{question.text}</div>
                </div>

                <div className="duo-options-list">
                  {['A', 'B', 'C', 'D', 'E'].map((option, idx) => {
                    const optText = question.options[idx];
                    const isSelected = selectedOption === option;
                    const correctAns = question.correct_option;
                    
                    let cardClass = '';
                    if (isAnswered) {
                      if (option === correctAns) cardClass = 'correct';
                      else if (isSelected) cardClass = 'incorrect';
                      else cardClass = 'disabled';
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
                    <div className={`p-4 border rounded-2xl text-xs font-semibold ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-rose-500/20 bg-rose-500/5 text-rose-400'}`}>
                      {isCorrect ? 'Tebrikler! Doğru cevap.' : `Yanlış cevap. Doğru şık: ${question.correct_option}`}
                    </div>
                    {isCorrect && (
                      <button onClick={() => handleRemoveMistake(activeMistakeIndex)} className="w-full py-3 text-xs font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', cursor: 'pointer' }}>Hatalarımdan Temizle</button>
                    )}
                    {activeExplanation && (
                      <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-2 mt-4 text-xs">
                        <h4 className="font-bold text-slate-300 border-b border-white/5 pb-1">Çözüm Analizi:</h4>
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

      {/* SECTION 2: CAMP MISTAKES */}
      {mistakeSection === 'camp' && (
        activeCampIndex === null ? (
          campMistakesList.length === 0 ? (
            <div className="glass-card p-12 border border-white/5 text-center rounded-3xl premium-empty-state">
              <i className="fa-solid fa-campground" style={{ color: '#10b981', fontSize: '3rem', marginBottom: '12px' }}></i>
              <h3 className="empty-state-title">Kusursuz Kamp Günleri!</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Günlük kamplardaki pekiştirme testlerinde henüz hiç hata yapmadınız.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {campMistakesList.map((mist, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveCampIndex(idx)}
                  className="glass-card flex items-center justify-between hover:border-emerald-500/30 transition-all"
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
                  <div>
                    <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold' }}>GÜN #{mist.day} {mist.phase === 'cloze_test' ? 'KELİME' : 'GRAMER'}</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', margin: '4px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '400px' }}>{mist.questionText}</h4>
                  </div>
                  <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem', fontWeight: '700', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>Detayları Gör</button>
                </div>
              ))}
            </div>
          )
        ) : (
          (() => {
            const mist = campMistakesList[activeCampIndex];
            return (
              <div className="duo-quiz-container" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setActiveCampIndex(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><ChevronLeft className="h-4 w-4" /> Kamp Hatalarına Dön</button>
                  <button onClick={() => handleResolveCampMistake(activeCampIndex)} className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 transition-all">Hata Listesinden Kaldır</button>
                </div>

                <div className="duo-question-card" style={{ borderLeft: '4px solid #10b981' }}>
                  <span className="duo-question-badge">Gün #{mist.day} - {mist.phase === 'cloze_test' ? 'Kelime Boşluk Doldurma' : 'Dilbilgisi Testi'}</span>
                  <div className="duo-question-title">{mist.questionText}</div>
                </div>

                <div className="space-y-3 mt-4" style={{ textAlign: 'left' }}>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                    <span style={{ fontSize: '0.62rem', color: '#f87171', display: 'block', fontWeight: 'bold' }}>SEÇTİĞİNİZ YANLIŞ CEVAP</span>
                    <span style={{ fontSize: '0.94rem', color: 'white', fontWeight: '700' }}>{mist.userAnswer}</span>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    <span style={{ fontSize: '0.62rem', color: '#34d399', display: 'block', fontWeight: 'bold' }}>DOĞRU CEVAP</span>
                    <span style={{ fontSize: '0.94rem', color: 'white', fontWeight: '700' }}>{mist.correctAnswer}</span>
                  </div>
                  {mist.options && mist.options.length > 0 && (
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>TÜM SEÇENEKLER</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {mist.options.map((opt, i) => (
                          <span key={i} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.78rem', color: opt === mist.correctAnswer ? '#34d399' : 'white' }}>{opt}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {mist.explanation && (
                    <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-2 mt-4 text-xs">
                      <h4 className="font-bold text-slate-300 border-b border-white/5 pb-1">Sınav Stratejisi & İpucu:</h4>
                      <p style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.5 }}>{mist.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )
      )}

      {/* SECTION 3: READING MISTAKES */}
      {mistakeSection === 'reading' && (
        activeReadingIndex === null ? (
          readingMistakesList.length === 0 ? (
            <div className="glass-card p-12 border border-white/5 text-center rounded-3xl premium-empty-state">
              <i className="fa-solid fa-book-open" style={{ color: '#6366f1', fontSize: '3rem', marginBottom: '12px' }}></i>
              <h3 className="empty-state-title">Harika Okuma Kavrayışı!</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Akademik metin analizlerindeki kavrama sorularında henüz hata yapmadınız.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {readingMistakesList.map((mist, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveReadingIndex(idx)}
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
                  <div>
                    <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold' }}>{mist.passageTitle || 'Akademik Paragraf'}</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'white', margin: '4px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '400px' }}>{mist.questionText}</h4>
                  </div>
                  <button className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem', fontWeight: '700', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.3)', color: '#818cf8' }}>Detayları Gör</button>
                </div>
              ))}
            </div>
          )
        ) : (
          (() => {
            const mist = readingMistakesList[activeReadingIndex];
            return (
              <div className="duo-quiz-container" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button onClick={() => setActiveReadingIndex(null)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><ChevronLeft className="h-4 w-4" /> Okuma Hatalarına Dön</button>
                  <button onClick={() => handleResolveReadingMistake(activeReadingIndex)} className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/20 transition-all">Çözüldü Olarak İşaretle</button>
                </div>

                <div className="duo-question-card" style={{ borderLeft: '4px solid #6366f1' }}>
                  <span className="duo-question-badge">{mist.passageTitle || 'Paragraf Anlama Sorusu'}</span>
                  <div className="duo-question-title">{mist.questionText}</div>
                </div>

                <div className="space-y-3 mt-4" style={{ textAlign: 'left' }}>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                    <span style={{ fontSize: '0.62rem', color: '#f87171', display: 'block', fontWeight: 'bold' }}>SEÇTİĞİNİZ YANLIŞ CEVAP</span>
                    <span style={{ fontSize: '0.94rem', color: 'white', fontWeight: '700' }}>{mist.userAnswer}</span>
                  </div>
                  <div className="p-4 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                    <span style={{ fontSize: '0.62rem', color: '#34d399', display: 'block', fontWeight: 'bold' }}>DOĞRU CEVAP</span>
                    <span style={{ fontSize: '0.94rem', color: 'white', fontWeight: '700' }}>{mist.correctAnswer}</span>
                  </div>
                </div>
              </div>
            );
          })()
        )
      )}

      {/* SECTION 4: VOCABULARY / UNKNOWN WORDS */}
      {mistakeSection === 'vocabulary' && (
        allWordMistakes.length === 0 ? (
          <div className="glass-card p-12 border border-white/5 text-center rounded-3xl premium-empty-state">
            <i className="fa-solid fa-book-open-reader" style={{ color: '#34d399', fontSize: '3rem', marginBottom: '12px' }}></i>
            <h3 className="empty-state-title">Kelime Bilginiz Sapasağlam!</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Çalışmalarınızda henüz hiç bilinmeyen kelime işaretlemediniz.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {allWordMistakes.map((word, idx) => (
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
                
                {word.sentence && (
                  <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '0.74rem', color: '#e2e8f0', margin: '0 0 4px 0', lineHeight: 1.4 }}>"{word.sentence}"</p>
                    {word.translation && (
                      <p style={{ fontSize: '0.68rem', color: '#94a3b8', margin: 0, fontStyle: 'italic' }}>{word.translation}</p>
                    )}
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  <button 
                    onClick={() => handleResolveWordMistake(word.english, word.isFromType ? word.id : null)}
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
                    <CheckCircle2 size={12} /> Öğrendim / Listeden Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default MistakeInbox;
