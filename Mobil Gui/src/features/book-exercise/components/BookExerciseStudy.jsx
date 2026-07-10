import React from 'react';
import { Volume2, ArrowRight, Check, X, Award } from 'lucide-react';

const BookExerciseStudy = ({
  currentDayData,
  phase,
  setPhase,
  currentWordIdx,
  setCurrentWordIdx,
  playSpeechAudio,
  formatWordType,
  getTranslation,
  selectedDay,
  setSelectedDay,
  totalDays,
  matches,
  setMatches,
  matchLeftSelected,
  setMatchLeftSelected,
  wrongMatch,
  setWrongMatch,
  synonymQuestionIdx,
  setSynonymQuestionIdx,
  synonymOptions,
  synonymSelectedOption,
  synonymShowFeedback,
  quizAnswers,
  setQuizAnswers,
  quizSubmitted,
  setQuizSubmitted,
  activeQuizQIdx,
  setActiveQuizQIdx,
  setCompletedDays,
  completedDays,
  addMistake,
  findCorrectRightKey,
  handleSynonymOptionClick,
  handleMatchClick
}) => {

  if (!currentDayData || !currentDayData.words) {
    return <div style={{ color: 'white', padding: '20px' }}>Ders verileri yükleniyor...</div>;
  }

  return (
    <div>
      <div style={{ height: '8px' }} />

      {/* PHASE 1: LEARN WORDS */}
      {phase === 1 && currentDayData.words && currentDayData.words.length > 0 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 1: Kelime Öğrenimi <span style={{ color: '#818cf8' }}>({currentWordIdx + 1}/{currentDayData.words.length})</span>
            </h4>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Kelimelerin anlam, eş anlam ve zıt anlam yapılarını inceleyin.</span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 24px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '14px', gap: '4px' }}>
              <span style={{ fontSize: '0.58rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>İNGİLİZCE KELİME</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em', wordBreak: 'break-all' }}>
                  {currentDayData.words[currentWordIdx].word}
                </h1>
                {playSpeechAudio && (
                  <button 
                    onClick={() => playSpeechAudio(currentDayData.words[currentWordIdx].word)}
                    className="speak-btn-glow"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      padding: '6px',
                      borderRadius: '50%',
                      color: '#818cf8',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                <span className="word-badge" style={{ fontSize: '0.62rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: '800', padding: '2px 6px', borderRadius: '6px' }}>
                  {formatWordType(currentDayData.words[currentWordIdx].type)}
                </span>
                {currentDayData.words[currentWordIdx].priority && (
                  <span className="word-badge" style={{ 
                    background: currentDayData.words[currentWordIdx].priority === 'Çok Yüksek Sıklık' ? 'rgba(239, 68, 68, 0.12)' : (currentDayData.words[currentWordIdx].priority === 'Yüksek Sıklık' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)'), 
                    color: currentDayData.words[currentWordIdx].priority === 'Çok Yüksek Sıklık' ? '#f87171' : (currentDayData.words[currentWordIdx].priority === 'Yüksek Sıklık' ? '#fbbf24' : '#a5b4fc'), 
                    fontSize: '0.62rem',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '2px 6px',
                    borderRadius: '6px'
                  }}>
                    🎯 {currentDayData.words[currentWordIdx].priority}
                  </span>
                )}
              </div>
              
              <div style={{ margin: '8px 0', height: '1px', width: '32px', background: 'rgba(255,255,255,0.08)' }} />

              <span style={{ fontSize: '0.58rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>TÜRKÇE ANLAMI</span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                {currentDayData.words[currentWordIdx].turkish}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
              {/* Eş Anlamlılar (Synonyms) */}
              <div style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.12)', padding: '10px 14px', borderRadius: '12px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.6rem', color: '#a5b4fc', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  🔄 EŞ ANLAMLILAR (SYNONYMS)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                  {currentDayData.words[currentWordIdx].synonyms && currentDayData.words[currentWordIdx].synonyms.length > 0 ? (
                    currentDayData.words[currentWordIdx].synonyms.map((s, idx) => {
                      const tr = getTranslation(s);
                      return (
                        <span key={idx} style={{ fontSize: '0.76rem', background: 'rgba(16,185,129,0.08)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', marginBottom: '2px' }}>
                          {s} {tr ? `(${tr})` : ''}
                        </span>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Bulunmuyor</span>
                  )}
                </div>
              </div>

              {/* Zıt Anlamlılar (Antonyms) */}
              <div style={{ background: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.12)', padding: '10px 14px', borderRadius: '12px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.6rem', color: '#f87171', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  🔀 ZIT ANLAMLILAR (ANTONYMS)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                  {currentDayData.words[currentWordIdx].antonyms && currentDayData.words[currentWordIdx].antonyms.length > 0 ? (
                    currentDayData.words[currentWordIdx].antonyms.map((a, idx) => {
                      const tr = getTranslation(a);
                      return (
                        <span key={idx} style={{ fontSize: '0.76rem', background: 'rgba(239,68,68,0.08)', color: '#f87171', padding: '1px 6px', borderRadius: '4px', marginBottom: '2px' }}>
                          {a} {tr ? `(${tr})` : ''}
                        </span>
                      );
                    })
                  ) : (
                    <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Bulunmuyor</span>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Sentence Box */}
            {currentDayData.words[currentWordIdx].sentence_en && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Örnek Cümle</span>
                <p style={{ fontSize: '0.98rem', color: 'white', lineHeight: 1.6, margin: '0 auto', fontWeight: '500', maxWidth: '500px' }}>
                  "{currentDayData.words[currentWordIdx].sentence_en}"
                </p>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '8px', marginBottom: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                  {currentDayData.words[currentWordIdx].sentence_tr}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setCurrentWordIdx(prev => Math.max(0, prev - 1))}
              disabled={currentWordIdx === 0}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Önceki Kelime
            </button>

            {((selectedDay % 7 === 0) || (selectedDay % 28 === 0) || (selectedDay === totalDays)) && (
              <button
                onClick={() => {
                  setPhase(2);
                  setMatches({});
                  setMatchLeftSelected(null);
                }}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', background: 'rgba(239, 68, 68, 0.05)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                ⏩ Kartları Geç ve Alıştırmaya Başla
              </button>
            )}

            <button
              onClick={() => {
                if (currentWordIdx < currentDayData.words.length - 1) {
                  setCurrentWordIdx(prev => prev + 1);
                } else {
                  setPhase(2);
                  setMatches({});
                  setMatchLeftSelected(null);
                }
              }}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {currentWordIdx < currentDayData.words.length - 1 ? 'Öğrendim, Sıradaki' : 'Eş Anlam Eşleştirmeye Geç'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: SYNONYM MATCHING */}
      {phase === 2 && currentDayData.exercises.synonym_matching && (() => {
        const leftList = currentDayData.exercises.synonym_matching.left;
        const rightList = currentDayData.exercises.synonym_matching.right;
        const currentItem = leftList[synonymQuestionIdx];
        if (!currentItem) return null;
        
        const cleanWord = currentItem.word.replace(/\s+[a-z]$/i, '').trim();
        const correctKey = findCorrectRightKey(currentItem, rightList, currentDayData.words, false);
        
        return (
          <div className="glass-card animate-scale-in" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 'bold' }}>
                Adım 2: Eş Anlam Eşleştirme (Soru {synonymQuestionIdx + 1} / {leftList.length})
              </span>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Kelimenin eş anlamlısını seçin
              </span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '0.62rem', color: '#a5b4fc', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white', margin: '8px 0', letterSpacing: '-0.02em' }}>
                {cleanWord.toUpperCase()}
              </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {synonymOptions.map((opt) => {
                if (!opt) return null;
                const isSelected = synonymSelectedOption === opt.key;
                const isCorrectOpt = opt.key === correctKey;
                
                let btnStyle = {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: '#cbd5e1',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  fontSize: '0.92rem',
                  width: '100%'
                };

                if (synonymShowFeedback) {
                  if (isCorrectOpt) {
                    btnStyle.border = '1px solid #10b981';
                    btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                    btnStyle.color = '#34d399';
                  } else if (isSelected) {
                    btnStyle.border = '1px solid #ef4444';
                    btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                    btnStyle.color = '#f87171';
                  } else {
                    btnStyle.opacity = 0.5;
                    btnStyle.cursor = 'default';
                  }
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSynonymOptionClick(opt.key)}
                    style={btnStyle}
                    className={`mcq-option-btn ${!synonymShowFeedback ? 'hover-effect' : ''}`}
                    disabled={synonymShowFeedback}
                  >
                    <span>{opt.def}</span>
                    {synonymShowFeedback && (() => {
                      const wordsArr = opt.def.split(',').map(s => s.trim());
                      const trs = wordsArr.map(w => getTranslation(w)).filter(Boolean);
                      return trs.length > 0 ? (
                        <span style={{ fontSize: '0.78rem', opacity: 0.85, fontWeight: '700', marginLeft: 'auto', marginRight: '12px', color: isCorrectOpt ? '#67e8f9' : '#cbd5e1' }}>
                          ({trs.join(', ')})
                        </span>
                      ) : null;
                    })()}
                    {synonymShowFeedback && isCorrectOpt && <Check size={18} style={{ color: '#10b981' }} />}
                    {synonymShowFeedback && isSelected && !isCorrectOpt && <X size={18} style={{ color: '#ef4444' }} />}
                  </button>
                );
              })}
            </div>

            {synonymShowFeedback && synonymSelectedOption !== correctKey && (
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    if (synonymQuestionIdx < leftList.length - 1) {
                      setSynonymQuestionIdx(prev => prev + 1);
                    } else {
                      setPhase(3);
                      setMatches({});
                      setMatchLeftSelected(null);
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Sıradaki Kelime <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* PHASE 3: ANTONYM MATCHING */}
      {phase === 3 && currentDayData.exercises.antonym_matching && (
        <div className="glass-card" style={{ padding: '24px', borderRadius: '24px' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '6px' }}>
                Adım 3: Zıt Anlamlı Eşleştirme (Antonym Matching)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                Soldaki İngilizce kelimeleri sağdaki uygun zıt anlamlılarıyla eşleştirin.
              </p>
            </div>
            
            {Object.keys(matches).length === currentDayData.exercises.antonym_matching.left.length && (
              <button
                onClick={() => {
                  setPhase(4);
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.82rem', fontWeight: 'bold' }}
              >
                Çoktan Seçmeli Teste Geç 🚀
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', position: 'relative' }}>
            {/* Left Side (Words) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentDayData.exercises.antonym_matching.left.map((item) => {
                const matchedKey = matches[item.id];
                const isSelected = matchLeftSelected?.id === item.id;
                const isWrong = wrongMatch?.leftId === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMatchClick('left', item)}
                    className={`matching-card left-side ${isSelected ? 'selected' : ''} ${matchedKey ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: matchedKey
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : isSelected
                          ? '1px solid #818cf8'
                          : isWrong
                            ? '1px solid #ef4444'
                            : '1px solid rgba(255,255,255,0.06)',
                      background: matchedKey
                        ? 'rgba(16, 185, 129, 0.1)'
                        : isSelected
                          ? 'rgba(99, 102, 241, 0.15)'
                          : isWrong
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(255,255,255,0.02)',
                      color: matchedKey ? '#34d399' : 'white',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: matchedKey ? 'default' : 'pointer'
                    }}
                  >
                    <strong style={{ fontSize: '1rem' }}>{item.word}</strong>
                    {matchedKey && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                          Eşleşti ({matchedKey.toUpperCase()})
                        </span>
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Side (Definitions) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentDayData.exercises.antonym_matching.right.map((item) => {
                const matchingLeftId = Object.keys(matches).find(k => matches[k] === item.key);
                const isMatched = !!matchingLeftId;
                const isWrong = wrongMatch?.rightKey === item.key;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => handleMatchClick('right', item)}
                    className={`matching-card right-side ${isMatched ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: isMatched
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : isWrong
                          ? '1px solid #ef4444'
                          : '1px solid rgba(255,255,255,0.06)',
                      background: isMatched
                        ? 'rgba(16, 185, 129, 0.1)'
                        : isWrong
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(255,255,255,0.02)',
                      color: isMatched ? '#34d399' : '#cbd5e1',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      cursor: isMatched ? 'default' : 'pointer',
                      width: '100%',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: isMatched ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                        color: isMatched ? '#10b981' : '#818cf8',
                        fontSize: '0.85rem',
                        fontWeight: '800'
                      }}>
                        {item.key.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '0.9rem' }}>{item.def}</span>
                    </div>
                    {isMatched && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PHASE 4: MULTIPLE CHOICE QUIZ */}
      {phase === 4 && currentDayData.exercises.multiple_choice && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="font-heading" style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
              Adım 4: Çoktan Seçmeli Test
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' }}>
              Soru {activeQuizQIdx + 1} / {currentDayData.exercises.multiple_choice.length}
            </span>
          </div>

          {(() => {
            const q = currentDayData.exercises.multiple_choice[activeQuizQIdx];
            if (!q) return null;
            const selectedOpt = quizAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.answer;

            return (
              <div className="glass-card animate-scale-in" style={{ padding: '24px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '20px' }}>
                  <span style={{
                    background: 'rgba(99,102,241,0.15)',
                    color: '#818cf8',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {activeQuizQIdx + 1}
                  </span>
                  <p style={{ fontSize: '1.05rem', fontWeight: '600', color: 'white', lineHeight: '1.5', margin: 0, textAlign: 'left' }}>
                    {q.question}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(q.options).map(([optKey, optVal]) => {
                    if (!optVal) return null;
                    const isSelected = selectedOpt === optKey;
                    const showCorrect = isAnswered && q.answer === optKey;
                    const showWrong = isAnswered && isSelected && !isCorrect;

                    return (
                      <button
                        key={optKey}
                        disabled={isAnswered}
                        onClick={() => {
                          setQuizAnswers(prev => ({ ...prev, [q.id]: optKey }));
                          if (optKey !== q.answer && addMistake) {
                            addMistake({
                              type: 'reading_question',
                              bookId: selectedDay,
                              passageTitle: `Okuma Kitabı - Gün #${selectedDay}`,
                              questionText: q.question,
                              options: Object.values(q.options),
                              correctAnswer: q.options[q.answer] || q.answer,
                              userAnswer: optVal
                            });
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '14px 20px',
                          borderRadius: '14px',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'all 0.2s ease',
                          background: showCorrect
                            ? 'rgba(16, 185, 129, 0.15)'
                            : showWrong
                              ? 'rgba(239, 68, 68, 0.15)'
                              : isSelected
                                ? 'rgba(99, 102, 241, 0.12)'
                                : 'rgba(255,255,255,0.01)',
                          border: showCorrect
                            ? '1px solid #10b981'
                            : showWrong
                              ? '1px solid #ef4444'
                              : isSelected
                                ? '1px solid var(--primary-light)'
                                : '1px solid rgba(255,255,255,0.05)',
                          color: showCorrect ? '#10b981' : showWrong ? '#f87171' : 'white',
                          cursor: isAnswered ? 'default' : 'pointer'
                        }}
                      >
                        <span style={{
                          fontWeight: '800',
                          marginRight: '12px',
                          color: showCorrect ? '#10b981' : showWrong ? '#f87171' : isSelected ? '#818cf8' : '#cbd5e1'
                        }}>
                          {optKey})
                        </span>
                        <span style={{ fontSize: '0.9rem' }}>{optVal}</span>
                        {isAnswered && (() => {
                          const tr = getTranslation(optVal);
                          return tr ? (
                            <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '750', marginLeft: 'auto', marginRight: '12px', color: showCorrect ? '#67e8f9' : '#cbd5e1' }}>
                              ({tr})
                            </span>
                          ) : null;
                        })()}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    {activeQuizQIdx < currentDayData.exercises.multiple_choice.length - 1 ? (
                      <button
                        onClick={() => setActiveQuizQIdx(prev => prev + 1)}
                        className="btn-primary"
                        style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 'bold' }}
                      >
                        Sonraki Soru ➡️
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizSubmitted(true);
                          setPhase(5);
                          if (!completedDays.includes(selectedDay)) {
                            setCompletedDays(prev => [...prev, selectedDay]);
                          }
                        }}
                        className="btn-primary"
                        style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 'bold', background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}
                      >
                        Sonuçları Gör ve Bitir 🏁
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* PHASE 5: SUMMARY */}
      {phase === 5 && (
        <div className="glass-card animate-scale-in" style={{ padding: '40px 32px', borderRadius: '24px', textAlign: 'center', background: 'rgba(11, 15, 26, 0.8)', border: '1.5px solid rgba(16, 185, 129, 0.25)', maxWidth: '580px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981'
            }}>
              <Award size={36} />
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: '10px 0' }}>Tebrikler!</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            {currentDayData.isEvaluation 
              ? `${selectedDay - 9}-${selectedDay}. Günler Genel Değerlendirme Testini başarıyla tamamladınız! 10 günlük birikiminiz başarıyla ölçüldü.`
              : `${selectedDay}. Gün çalışmasını başarıyla tamamladınız. Kelimeleri öğrendiniz, alıştırmaları çözdünüz ve kendinizi test ettiniz.`
            }
          </p>

          {/* Score card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '16px 20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Çözülen Soru</span>
              <strong style={{ fontSize: '1.4rem', color: 'white' }}>{currentDayData.exercises.multiple_choice.length}</strong>
            </div>
            <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Doğru Sayısı</span>
              <strong style={{ fontSize: '1.4rem', color: '#10b981' }}>
                {Object.entries(quizAnswers).filter(([qId, val]) => {
                  const q = currentDayData.exercises.multiple_choice.find(item => String(item.id) === String(qId));
                  return q && q.answer === val;
                }).length}
              </strong>
            </div>
          </div>

          <button
            onClick={() => setSelectedDay(null)}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}
          >
            Gün Listesine Dön ve Devam Et 🚀
          </button>
        </div>
      )}
    </div>
  );
};

export default BookExerciseStudy;
