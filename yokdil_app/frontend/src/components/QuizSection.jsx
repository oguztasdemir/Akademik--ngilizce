import React, { useState } from 'react';
import MascotOwl from './MascotOwl';

const cleanQuestionText = (text, qNum) => {
  if (!text) return '';
  let cleaned = text;
  cleaned = cleaned.replace(/^\[[^\]]+\]\s*/i, '');
  
  const qRegexStart = new RegExp(`^Question\\s*${qNum}:?\\s*`, 'i');
  cleaned = cleaned.replace(qRegexStart, '');
  
  const qRegexEnd = new RegExp(`\\s*Question\\s*${qNum}:?\\s*$`, 'i');
  cleaned = cleaned.replace(qRegexEnd, '');

  // Remove leading numbers like "25. ", "25- ", "25) "
  cleaned = cleaned.replace(new RegExp(`^\\s*${qNum}\\s*[.\\-)]\\s*`, 'i'), '');
  cleaned = cleaned.replace(new RegExp(`^\\s*${qNum}\\s+`, 'i'), '');

  // Replace parenthesized numbers like "(25)----" or "(25) ----" with just "----"
  cleaned = cleaned.replace(new RegExp(`\\(${qNum}\\)\\s*-*`, 'g'), '----');
  cleaned = cleaned.replace(new RegExp(`\\b${qNum}\\b\\s*-+`, 'g'), '----');
  
  return cleaned.trim();
};

const QuizSection = ({
  selectedExam,
  quizActive,
  setQuizActive,
  quizQuestions,
  currentQuizIndex,
  setCurrentQuizIndex,
  flagged,
  handleToggleFlag,
  playSpeechAudio,
  fontSize,
  handleTextSelection,
  selectedOption,
  setSelectedOption,
  answers,
  handleSaveAnswer,
  activeExplanation,
  renderMarkdown,
  handleSubmitExam,
  timerIntervalRef,
  setExamRunning,
  mascotState,
  setMascotState,
  mascotSpeech,
  setMascotSpeech,
  questionTimeSpent
}) => {
  const [speechSpeed, setSpeechSpeed] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180 * 60); // 3 hours countdown

  React.useEffect(() => {
    if (!quizActive) return;
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (handleSubmitExam) handleSubmitExam();
          alert("Süre doldu! Sınavınız otomatik olarak gönderilmiştir.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quizActive]);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderInteractiveQuestion = (text, qNum) => {
    const cleaned = cleanQuestionText(text, qNum);
    const words = cleaned.split(/\s+/);
    
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      return (
        <span
          key={idx}
          onClick={(e) => {
            if (handleTextSelection) {
              handleTextSelection({
                clientX: e.clientX,
                clientY: e.clientY,
                target: e.target,
                customText: cleanWord
              });
            }
          }}
          style={{
            cursor: 'pointer',
            padding: '1px 2px',
            borderRadius: '4px',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => { e.target.style.color = '#818cf8'; e.target.style.background = 'rgba(99,102,241,0.08)'; }}
          onMouseLeave={(e) => { e.target.style.color = 'inherit'; e.target.style.background = 'transparent'; }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  const getCollocations = (text) => {
    const cleaned = text.toLowerCase();
    const list = ["depend on", "lead to", "resulting in", "derived from", "refer to", "due to", "because of", "such as", "focused on", "based on", "responsible for", "associated with", "key role", "crucial role", "significant role", "deal with", "rely on", "cope with"];
    return list.filter(item => cleaned.includes(item));
  };

  React.useEffect(() => {
    setShowExplanation(false);
  }, [currentQuizIndex]);

  if (!selectedExam || !quizActive) return null;

  const handleDoubleClick = (e) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text && text.length < 50) {
      handleTextSelection(e);
    }
  };

  const handleCustomSpeech = () => {
    const text = selectedExam?.questions?.[currentQuizIndex - 1]?.text || '';
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speechSpeed;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="duo-quiz-container">
      {/* Duolingo Progress Header */}
      <div className="duo-progress-bar-container">
        <button 
          onClick={() => { 
            setQuizActive(false); 
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); 
            setExamRunning(false); 
          }} 
          className="duo-exit-btn"
          style={{ width: 'auto', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
          title="Sınavdan Çık"
        >
          <i className="fa-solid fa-arrow-left"></i> Geri Dön
        </button>
        <div className="duo-progress-bar">
          <div 
            className="duo-progress-fill" 
            style={{ width: `${((quizQuestions.indexOf(currentQuizIndex) + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '4px 10px',
            borderRadius: '12px',
            color: '#f87171',
            fontSize: '0.72rem',
            fontWeight: '800'
          }}>
            ⏱️ {formatTime(secondsLeft)}
          </div>
          {/* Pacing Coach Badge */}
          {questionTimeSpent !== undefined && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: questionTimeSpent > 90 ? 'rgba(239, 68, 68, 0.12)' : questionTimeSpent > 45 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${questionTimeSpent > 90 ? '#ef4444' : questionTimeSpent > 45 ? '#fbbf24' : '#10b981'}`,
              padding: '4px 10px',
              borderRadius: '12px',
              color: questionTimeSpent > 90 ? '#f87171' : questionTimeSpent > 45 ? '#fbbf24' : '#34d399',
              fontSize: '0.72rem',
              fontWeight: '800'
            }}>
              {questionTimeSpent > 90 ? '⚠️ Yavaş (Limit Aşıldı)' : questionTimeSpent > 45 ? '⏱️ Normal' : '⚡ Hızlı'} ({questionTimeSpent}s)
            </div>
          )}
          <button
            onClick={() => setShowCheatSheet(true)}
            className="rounded-lg px-2.5 py-1 text-[10px] font-bold border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 cursor-pointer"
            title="Gramer Formül Kartları"
          >
            📑 Gramer Formülleri
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
            {quizQuestions.indexOf(currentQuizIndex) + 1} / {quizQuestions.length}
          </span>
        </div>
      </div>

      {/* Single Question Display Card */}
      <div className="duo-question-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--primary-light)', letterSpacing: '1px' }}>
            SORU {currentQuizIndex}
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => handleToggleFlag(currentQuizIndex)}
              className={`rounded-lg px-2.5 py-1 text-[10px] font-bold border transition-all ${
                flagged[currentQuizIndex] ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-white/5 bg-white/5 text-slate-400'
              }`}
            >
              <i className="fa-solid fa-star"></i> Yıldızla
            </button>
            <button
              onClick={handleCustomSpeech}
              className="rounded-lg px-2.5 py-1 text-[10px] font-bold border border-white/5 bg-white/5 text-slate-400 hover:text-white"
              title="Seslendir"
            >
              <i className="fa-solid fa-volume-high"></i> Dinle
            </button>
          </div>
        </div>
        
        {selectedExam?.questions?.[currentQuizIndex - 1] ? (
          <div>
            <div 
              onMouseUp={handleTextSelection}
              onDoubleClick={handleDoubleClick}
              className="duo-question-title"
              style={{ fontSize: fontSize === 'sm' ? '1rem' : fontSize === 'lg' ? '1.35rem' : fontSize === 'xl' ? '1.5rem' : '1.15rem', cursor: 'pointer', lineHeight: '1.6', textAlign: 'left' }}
            >
              {renderInteractiveQuestion(
                selectedExam.questions[currentQuizIndex - 1].text,
                selectedExam.questions[currentQuizIndex - 1].number || currentQuizIndex
              )}
            </div>

            {/* Found Collocations Badges once answered */}
            {answers[currentQuizIndex] !== undefined && (() => {
              const found = getCollocations(selectedExam.questions[currentQuizIndex - 1].text);
              if (found.length === 0) return null;
              return (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Kalıp Kelimeler:</span>
                  {found.map(col => (
                    <button
                      key={col}
                      onClick={(e) => {
                        if (handleTextSelection) {
                          handleTextSelection({
                            clientX: e.clientX,
                            clientY: e.clientY,
                            target: e.target,
                            customText: col
                          });
                        }
                      }}
                      className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        color: '#a5b4fc',
                        cursor: 'pointer'
                      }}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            Soru metni bulunamadı.
          </div>
        )}
      </div>

      {/* Options Selector Cards */}
      <div className="duo-options-list">
        {['A', 'B', 'C', 'D', 'E'].map((option, idx) => {
          const optText = selectedExam?.questions?.[currentQuizIndex - 1]?.options?.[idx];
          const isSelected = selectedOption === option;
          const isCorrect = selectedExam.answers[currentQuizIndex - 1] === option;
          const hasChosenCurrent = answers[currentQuizIndex] !== undefined;
          
          let cardClass = '';
          if (hasChosenCurrent) {
            if (option === answers[currentQuizIndex]) {
              cardClass = isCorrect ? 'correct' : 'incorrect';
            } else if (isCorrect) {
              cardClass = 'correct';
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
                if (!hasChosenCurrent) {
                  setSelectedOption(option);
                  handleSaveAnswer(currentQuizIndex, option);
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

      <div style={{ position: 'relative', minHeight: '120px', marginTop: '20px' }}>
        <MascotOwl state={mascotState} speech={mascotSpeech} />
      </div>

      {/* Floating Bottom Drawer check sheet */}
      {(() => {
        const hasChosenCurrent = answers[currentQuizIndex] !== undefined;
        if (!hasChosenCurrent) return null;

        const isCorrect = selectedOption === selectedExam.answers[currentQuizIndex - 1];
        const barStateClass = isCorrect ? 'state-correct' : 'state-incorrect';

        return (
          <div className={`duo-bottom-bar ${barStateClass}`}>
            <div className="duo-bottom-bar-content">
              <div className="duo-bottom-left" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="duo-bottom-icon">
                    <i className={isCorrect ? "fa-solid fa-check" : "fa-solid fa-xmark"}></i>
                  </div>
                  <div>
                    <div className="duo-bottom-text-title" style={{ fontSize: '1.15rem' }}>
                      {isCorrect ? "Mükemmel! Doğru Cevap" : "Hatalı Seçim!"}
                    </div>
                    <div className="duo-bottom-text-sub">
                      Doğru Cevap: {selectedExam.answers[currentQuizIndex - 1]}
                    </div>
                  </div>
                </div>

                {/* Show explanation trigger only on wrong answers */}
                {!isCorrect && (
                  <>
                    {!showExplanation ? (
                      <button 
                        onClick={() => setShowExplanation(true)}
                        className="btn-secondary"
                        style={{ marginTop: '12px', padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'white', alignSelf: 'flex-start', borderRadius: '6px' }}
                      >
                        🔍 Açıklamayı Gör (Yapay Zeka)
                      </button>
                    ) : (
                      activeExplanation && (
                        <div className="duo-explanation-sheet active" style={{ display: 'block', marginTop: '16px' }}>
                          <div style={{ fontWeight: '800', marginBottom: '8px', color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fa-solid fa-wand-magic-sparkles"></i> 
                            <span>Yapay Zeka Gramer Açıklaması</span>
                          </div>
                          <div className="prose prose-invert mt-2 text-slate-300">
                            {renderMarkdown(activeExplanation.explanation)}
                          </div>
                          <div className="rounded bg-slate-950/60 p-2.5 border border-white/5" style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.3)', marginTop: '8px' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary-light)', display: 'block', marginBottom: '4px' }}>Çözüm İpucu:</span>
                            {activeExplanation.takeaway}
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>

              <div className="duo-bottom-right" style={{ flexShrink: 0 }}>
                <button
                  onClick={() => {
                    const idxInSess = quizQuestions.indexOf(currentQuizIndex);
                    if (idxInSess < quizQuestions.length - 1) {
                      setCurrentQuizIndex(quizQuestions[idxInSess + 1]);
                    } else {
                      handleSubmitExam();
                    }
                  }}
                  className="duo-check-btn"
                  style={{ cursor: 'pointer' }}
                >
                  DEVAM ET
                </button>
              </div>
            </div>
          </div>
        );
      })()}
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

export default QuizSection;
