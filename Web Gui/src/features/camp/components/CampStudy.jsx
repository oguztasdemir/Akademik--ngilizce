import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, AlertCircle, Trophy } from 'lucide-react';

const CampStudy = ({
  selectedDay,
  studyWords,
  currentIdx,
  setCurrentIdx,
  phase,
  setPhase,
  allWordsDb,
  sentenceIdx,
  setSentenceIdx,
  meaningOptions,
  meaningSelected,
  meaningChecked,
  meaningCorrect,
  handleMeaningCheck,
  handleMeaningNext,
  getEnglishForMeaningOption,
  synonymOptions,
  synonymSelected,
  synonymChecked,
  synonymCorrect,
  handleSynonymCheck,
  handleSynonymNext,
  antonymOptions,
  antonymSelected,
  antonymChecked,
  antonymCorrect,
  handleAntonymCheck,
  handleAntonymNext,
  getAntonym,
  clozeMode,
  setClozeMode,
  clozeInputText,
  setClozeInputText,
  clozeChecked,
  clozeCorrect,
  clozeOptions,
  clozeSelected,
  clozeShowHint,
  setClozeShowHint,
  handleClozeCheck,
  handleClozeNext,
  getBlankedSentence,
  clozeSentenceIndexes,
  wordResults,
  progress,
  exitCamp,
  formatWordType,
  getSynonymsList,
  getAntonymsList,
  getCollocationsList,
  getSentenceEn,
  getSentenceTr,
  handleWordRead,
  setActiveStudyInfo,
  totalCampDays,
  setMeaningOptions,
  vocabTrack,
  addMistake,
  setWordResults,
  vocabMeaningSelections,
  setVocabMeaningSelections
}) => {
  const getTrackTheme = () => {
    const themes = {
      'anlam': { color: '#6366f1', rgb: '99, 102, 241', name: 'Anlam Kampı' },
      'es_anlam': { color: '#a855f7', rgb: '168, 85, 247', name: 'Eş Anlam Kampı' },
      'zit_anlam': { color: '#f43f5e', rgb: '244, 63, 94', name: 'Zıt Anlam Kampı' },
      'cumle': { color: '#f59e0b', rgb: '245, 158, 11', name: 'Cümle Kampı' },
      'tumu': { color: '#10b981', rgb: '16, 185, 129', name: 'Genel Kamp' }
    };
    return themes[vocabTrack] || themes['anlam'];
  };
  const theme = getTrackTheme();

  const [learnCardFlipped, setLearnCardFlipped] = useState(false);
  const [localClozeOptions, setLocalClozeOptions] = useState([]);
  const [localClozeSelected, setLocalClozeSelected] = useState(null);
  const [localClozeChecked, setLocalClozeChecked] = useState(false);

  const [selectedMeaningsForWord, setSelectedMeaningsForWord] = useState([]);

  useEffect(() => {
    if (studyWords.length > 0 && studyWords[currentIdx]) {
      const currentWord = studyWords[currentIdx];
      if (vocabMeaningSelections && vocabMeaningSelections[currentWord.word]) {
        setSelectedMeaningsForWord(vocabMeaningSelections[currentWord.word].known || []);
      } else {
        const allMeanings = currentWord.tr ? currentWord.tr.split(',').map(s => s.trim()) : [];
        setSelectedMeaningsForWord(allMeanings);
      }
    }
  }, [currentIdx, vocabMeaningSelections, studyWords]);

  const toggleMeaningSelection = (meaning) => {
    setSelectedMeaningsForWord(prev => {
      if (prev.includes(meaning)) {
        return prev.filter(m => m !== meaning);
      } else {
        return [...prev, meaning];
      }
    });
  };

  const handleSaveMeaningSelection = (isAllUnknown = false) => {
    const currentWord = studyWords[currentIdx];
    const allMeanings = currentWord.tr.split(',').map(s => s.trim());
    
    let known = [];
    let unknown = [];

    if (isAllUnknown) {
      unknown = [...allMeanings];
    } else {
      known = [...selectedMeaningsForWord];
      unknown = allMeanings.filter(m => !known.includes(m));
    }

    if (setVocabMeaningSelections) {
      setVocabMeaningSelections(prev => ({
        ...prev,
        [currentWord.word]: { known, unknown }
      }));
    }

    const hasAnyKnown = known.length > 0;
    setWordResults?.(prev => ({ ...prev, [currentWord.word]: hasAnyKnown }));
    if (!hasAnyKnown) {
      addMistake?.(currentWord.word, currentWord.tr, 'camp_card');
    }

    setLearnCardFlipped(false);
    handleWordRead();
  };

  useEffect(() => {
    if (studyWords.length > 0 && studyWords[currentIdx]) {
      const correct = studyWords[currentIdx].word;
      const allWords = studyWords.map(w => w.word);
      const filtered = allWords.filter(w => w !== correct);
      const distractors = filtered.slice(0, 4);
      while (distractors.length < 4) {
        const randomWord = allWordsDb[Math.floor(Math.random() * allWordsDb.length)]?.word || 'word';
        if (randomWord !== correct && !distractors.includes(randomWord)) {
          distractors.push(randomWord);
        }
      }
      const options = [correct, ...distractors];
      setLocalClozeOptions(options.sort(() => Math.random() - 0.5));
      setLocalClozeSelected(null);
      setLocalClozeChecked(false);
    }
    setLearnCardFlipped(false);
  }, [currentIdx, phase, studyWords, allWordsDb]);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [slideOutDirection, setSlideOutDirection] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
    setSwipeOffset(0);
    setSlideOutDirection('');
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    setTouchEnd(currentTouch);
    setSwipeOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setTouchStart(null);
      setTouchEnd(null);
      setSwipeOffset(0);
      return;
    }
    const diff = touchEnd - touchStart;
    const threshold = 80;

    if (diff < -threshold) {
      triggerNextWord();
    } else if (diff > threshold && currentIdx > 0) {
      triggerPrevWord();
    } else {
      setSwipeOffset(0);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setTouchStart(e.clientX);
    setTouchEnd(null);
    setSwipeOffset(0);
    setSlideOutDirection('');
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !touchStart) return;
    setTouchEnd(e.clientX);
    setSwipeOffset(e.clientX - touchStart);
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    handleTouchEnd();
  };

  const triggerNextWord = () => {
    setSlideOutDirection('left');
    setTimeout(() => {
      handleWordRead();
      setSlideOutDirection('');
      setSwipeOffset(0);
    }, 200);
  };

  const triggerPrevWord = () => {
    setSlideOutDirection('right');
    setTimeout(() => {
      setCurrentIdx(prev => Math.max(0, prev - 1));
      setSlideOutDirection('');
      setSwipeOffset(0);
    }, 200);
  };

  let transformStyle = 'none';
  let transitionStyle = 'none';

  if (slideOutDirection === 'left') {
    transformStyle = 'translateX(-120vw) rotate(-20deg)';
    transitionStyle = 'transform 0.2s ease-in-out';
  } else if (slideOutDirection === 'right') {
    transformStyle = 'translateX(120vw) rotate(20deg)';
    transitionStyle = 'transform 0.2s ease-in-out';
  } else if (swipeOffset !== 0) {
    transformStyle = `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.04}deg)`;
    transitionStyle = 'none';
  } else {
    transformStyle = 'translateX(0) rotate(0)';
    transitionStyle = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }

  if (studyWords.length === 0 || !studyWords[currentIdx]) {
    return <div style={{ color: 'white', padding: '20px' }}>Yükleniyor...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
      <div className="glass-card" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
      
      {/* Flow Header and Progress */}
      {!setActiveStudyInfo && (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>GÜN #{selectedDay} KAMP ÇALIŞMASI</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'white', margin: 0 }}>Kelime Kampı ({studyWords.length} Kelime)</h3>
            </div>
            
            {/* Dynamic Progress Bar */}
            <div style={{ flex: 1, minWidth: '150px', maxWidth: '350px', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${phase === 6 ? 100 : (((phase - 1) * 20) + ((currentIdx + 1) / studyWords.length * 20))}%`,
                background: `linear-gradient(90deg, #10b981 0%, ${theme.color} 100%)`,
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* PHASE 1: LEARN CARD */}
      {phase === 1 && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 1: Akademik Kelime Kartı <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div 
            onClick={() => setLearnCardFlipped(!learnCardFlipped)}
            style={{ 
              padding: '20px 24px', 
              borderRadius: '24px', 
              background: 'rgba(15, 23, 42, 0.65)', 
              border: `1px solid rgba(${theme.rgb}, 0.35)`,
              boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.03)`,
              backdropFilter: 'blur(12px)',
              height: '430px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px',
              transform: transformStyle,
              transition: transitionStyle,
              cursor: 'pointer'
            }}
            className="glass-card animate-scale-in"
          >
            {!learnCardFlipped ? (
              // FRONT SIDE OF THE FLIP CARD
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1, gap: '20px' }}>
                <span style={{ fontSize: '0.65rem', color: theme.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  {vocabTrack === 'cumle' ? 'ÖRNEK AKADEMİK CÜMLE (BOŞLUKLU)' : 'İNGİLİZCE KELİME'}
                </span>
                
                {vocabTrack === 'cumle' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                    <p style={{ fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>
                      "{studyWords[currentIdx].sentences && studyWords[currentIdx].sentences.length > 0
                        ? (studyWords[currentIdx].sentences[sentenceIdx]?.blanked || studyWords[currentIdx].sentence_blanked || '___')
                        : '___'}"
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                      {localClozeOptions.map((opt, i) => {
                        const isSelected = localClozeSelected === opt;
                        const isCorrectAnswer = opt === studyWords[currentIdx].word;
                        let bg = 'rgba(255, 255, 255, 0.03)';
                        let border = '1px solid rgba(255, 255, 255, 0.08)';
                        let color = 'white';

                        if (localClozeChecked) {
                          if (isCorrectAnswer) {
                            bg = 'rgba(16, 185, 129, 0.15)';
                            border = '1.5px solid #10b981';
                            color = '#a7f3d0';
                          } else if (isSelected) {
                            bg = 'rgba(239, 68, 68, 0.15)';
                            border = '1.5px solid #ef4444';
                            color = '#fca5a5';
                          }
                        } else if (isSelected) {
                          bg = `rgba(${theme.rgb}, 0.15)`;
                          border = `1.5px solid ${theme.color}`;
                          color = 'white';
                        }

                        return (
                          <button
                            key={i}
                            onClick={() => {
                              if (localClozeChecked) return;
                              setLocalClozeSelected(opt);
                              setLocalClozeChecked(true);
                              const correct = opt === studyWords[currentIdx].word;
                              
                              if (correct) {
                                setWordResults?.(prev => ({ ...prev, [studyWords[currentIdx].word]: true }));
                              } else {
                                addMistake?.(studyWords[currentIdx].word, studyWords[currentIdx].tr, 'camp_card_cloze');
                                setWordResults?.(prev => ({ ...prev, [studyWords[currentIdx].word]: false }));
                              }
                              
                              setTimeout(() => {
                                setLearnCardFlipped(true);
                              }, 1200);
                            }}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '10px',
                              background: bg,
                              border: border,
                              color: color,
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              cursor: localClozeChecked ? 'default' : 'pointer',
                              transition: 'all 0.2s',
                              textAlign: 'center'
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 style={{ 
                      fontSize: studyWords[currentIdx].word.length > 15 ? '1.8rem' : (studyWords[currentIdx].word.length > 10 ? '2.2rem' : '2.6rem'), 
                      fontWeight: '900', 
                      color: '#ffffff', 
                      margin: 0, 
                      letterSpacing: '-0.02em',
                      textShadow: `0 0 20px rgba(${theme.rgb}, 0.25)`,
                      maxWidth: '100%'
                    }}>
                      {studyWords[currentIdx].word}
                    </h1>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
                      <span className="word-badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', fontSize: '0.68rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '8px' }}>
                        {formatWordType(studyWords[currentIdx].type)}
                      </span>
                      {studyWords[currentIdx].priority && (
                        <span className="word-badge" style={{ 
                          background: studyWords[currentIdx].priority === 'Çok Yüksek Sıklık' ? 'rgba(239, 68, 68, 0.15)' : (studyWords[currentIdx].priority === 'Yüksek Sıklık' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(99, 102, 241, 0.15)'), 
                          color: studyWords[currentIdx].priority === 'Çok Yüksek Sıklık' ? '#fca5a5' : (studyWords[currentIdx].priority === 'Yüksek Sıklık' ? '#fcd34d' : '#c7d2fe'), 
                          fontSize: '0.68rem',
                          fontWeight: '600',
                          border: '1px solid rgba(255,255,255,0.05)',
                          padding: '3px 10px',
                          borderRadius: '8px'
                        }}>
                          🎯 {studyWords[currentIdx].priority}
                        </span>
                      )}
                    </div>
                  </>
                )}
                
                <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', marginTop: '12px' }}>
                  Detayları ve Türkçe anlamını görmek için tıkla (Kartı Döndür)
                </span>
              </div>
            ) : (
              // BACK SIDE OF THE FLIP CARD
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, gap: '20px', textAlign: 'center' }}>
                {vocabTrack === 'cumle' ? (
                  // Back Side for Cümle Kampı
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <span style={{ fontSize: '0.65rem', color: theme.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em' }}>CÜMLE ÇÖZÜMÜ VE ANLAMI</span>
                    
                    <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', width: '100%' }}>
                      <p style={{ fontSize: '1rem', color: '#ffffff', lineHeight: 1.6, fontWeight: '600', margin: '0 0 10px 0' }}>
                        "{getSentenceEn(studyWords[currentIdx])}"
                      </p>
                      {getSentenceTr(studyWords[currentIdx]) && (
                        <p style={{ fontSize: '0.88rem', color: '#a7f3d0', fontStyle: 'italic', margin: 0, fontWeight: '600' }}>
                          {getSentenceTr(studyWords[currentIdx])}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Ana Kelime: <strong>{studyWords[currentIdx].word}</strong> ({studyWords[currentIdx].tr})</span>
                    </div>

                    {studyWords[currentIdx].sentences && studyWords[currentIdx].sentences.length > 1 && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent re-flipping when clicking button
                          setSentenceIdx(prev => (prev + 1) % studyWords[currentIdx].sentences.length);
                        }}
                        style={{
                          background: 'rgba(245, 158, 11, 0.1)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          borderRadius: '8px',
                          color: '#fbbf24',
                          padding: '6px 14px',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'all 0.2s'
                        }}
                      >
                        🔄 Sonraki Örnek Cümleye Geç ({sentenceIdx + 1}/{studyWords[currentIdx].sentences.length})
                      </button>
                    )}
                  </div>
                ) : (
                  // Back Side for anlam, es_anlam, zit_anlam, tumu
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', width: '100%', justifyContent: vocabTrack === 'anlam' ? 'center' : 'flex-start', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: (vocabTrack === 'anlam' || vocabTrack === 'tumu') ? 1 : 'none', width: '100%', margin: (vocabTrack === 'anlam' || vocabTrack === 'tumu') ? 'auto' : '10px 0' }}>
                      <span style={{ fontSize: '0.65rem', color: theme.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
                        TÜRKÇE ANLAMLARI (BİLDİKLERİNİZİ SEÇİN)
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
                        {studyWords[currentIdx].tr.split(',').map((meaning, mIdx) => {
                          const cleanMeaning = meaning.trim();
                          const isSelected = selectedMeaningsForWord.includes(cleanMeaning);
                          return (
                            <div 
                              key={mIdx}
                              onClick={() => toggleMeaningSelection(cleanMeaning)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                                border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                width: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxSizing: 'border-box',
                                textAlign: 'left'
                              }}
                            >
                              <div style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '6px',
                                border: isSelected ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.3)',
                                background: isSelected ? '#10b981' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.75rem',
                                transition: 'all 0.2s'
                              }}>
                                {isSelected && '✓'}
                              </div>
                              <span style={{ 
                                fontSize: '1.05rem', 
                                fontWeight: '700', 
                                color: isSelected ? '#34d399' : 'white',
                                transition: 'color 0.2s'
                              }}>
                                {cleanMeaning}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sub-camp conditional details */}
                    {(vocabTrack === 'es_anlam' || vocabTrack === 'tumu') && (
                      <div style={{ width: '100%', marginTop: '10px' }}>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
                        <span style={{ fontSize: '0.65rem', color: '#a855f7', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.08em' }}>
                          🔄 EŞ ANLAMLILAR VE TÜRKÇELERİ
                        </span>
                        {getSynonymsList(studyWords[currentIdx]).length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            {getSynonymsList(studyWords[currentIdx]).map((item, idx) => (
                              <div key={idx} style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700' }}>
                                {item.eng} {item.tr && <span style={{ color: '#a5b4fc', fontWeight: '500', fontSize: '0.8rem' }}>({item.tr})</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>Yok</p>
                        )}
                      </div>
                    )}

                    {(vocabTrack === 'zit_anlam' || vocabTrack === 'tumu') && (
                      <div style={{ width: '100%', marginTop: '10px' }}>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
                        <span style={{ fontSize: '0.65rem', color: '#f43f5e', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.08em' }}>
                          🔀 ZIT ANLAMLILAR VE TÜRKÇELERİ
                        </span>
                        {getAntonymsList(studyWords[currentIdx]).length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                            {getAntonymsList(studyWords[currentIdx]).map((item, idx) => (
                              <div key={idx} style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700' }}>
                                {item.eng} {item.tr && <span style={{ color: '#fca5a5', fontWeight: '500', fontSize: '0.8rem' }}>({item.tr})</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>Yok</p>
                        )}
                      </div>
                    )}

                    {vocabTrack === 'tumu' && (
                      <>
                        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />
                        
                        <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.08em' }}>
                          🔗 BİRLİKTE KULLANIMLAR (COLLOCATIONS)
                        </span>
                        {getCollocationsList(studyWords[currentIdx]).length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                            {getCollocationsList(studyWords[currentIdx]).map((item, idx) => (
                              <div key={idx} style={{ fontSize: '0.82rem', color: 'white', fontWeight: '700', fontStyle: 'italic' }}>
                                {item.eng} {item.tr && <span style={{ color: '#a7f3d0', fontWeight: '500', fontSize: '0.76rem', fontStyle: 'normal' }}>({item.tr})</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: '600', margin: 0 }}>Yok</p>
                        )}

                        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '14px 0' }} />

                        <span style={{ fontSize: '0.65rem', color: '#fbbf24', fontWeight: '900', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.08em' }}>
                          ÖRNEK AKADEMİK CÜMLE (YÖKDİL)
                        </span>
                        <div style={{ textAlign: 'left', background: 'rgba(251, 191, 36, 0.03)', padding: '12px 14px', borderRadius: '12px', border: '1px dashed rgba(251, 191, 36, 0.2)' }}>
                          <p style={{ fontSize: '0.84rem', color: 'white', margin: '0 0 6px 0', lineHeight: 1.5, fontWeight: '500' }}>
                            "{getSentenceEn(studyWords[currentIdx])}"
                          </p>
                          {getSentenceTr(studyWords[currentIdx]) && (
                            <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>
                              {getSentenceTr(studyWords[currentIdx])}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '12px' }}>
                  Ön yüzü görmek için tıklayın (Kartı Döndür)
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', width: '100%' }}>
            {vocabTrack === 'cumle' ? (
              // Cümle Kampı Button Layout
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button
                  onClick={() => { setCurrentIdx(prev => Math.max(0, prev - 1)); setLearnCardFlipped(false); }}
                  disabled={currentIdx === 0}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px 20px', fontSize: '0.8rem', opacity: currentIdx === 0 ? 0.5 : 1 }}
                >
                  Önceki Kelime
                </button>
                
                {!learnCardFlipped ? (
                  <button
                    onClick={() => {
                      addMistake?.(studyWords[currentIdx].word, studyWords[currentIdx].tr, 'camp_card_cloze');
                      setWordResults?.(prev => ({ ...prev, [studyWords[currentIdx].word]: false }));
                      setLearnCardFlipped(true);
                    }}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      background: '#ef4444',
                      borderColor: '#ef4444',
                      color: 'white',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    ❌ Bilmiyorum
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setLearnCardFlipped(false);
                      handleWordRead();
                    }}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      padding: '10px 24px',
                      fontSize: '0.85rem',
                      background: 'rgba(16, 185, 129, 0.9)',
                      borderColor: '#10b981',
                      color: 'white',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    Sıradaki Kelime ⏩
                  </button>
                )}
              </div>
            ) : (
              // Meaning, Synonyms, Antonyms Camp Button Layout
              <>
                {/* Row 1: Action Buttons based on flip state */}
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  {!learnCardFlipped ? (
                    <>
                      <button
                        onClick={() => {
                          handleSaveMeaningSelection(true);
                        }}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '10px 20px',
                          fontSize: '0.85rem',
                          borderColor: '#ef4444',
                          color: 'white',
                          background: '#ef4444',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        ❌ Bilmiyorum
                      </button>
                      <button
                        onClick={() => {
                          setLearnCardFlipped(true);
                        }}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '10px 24px',
                          fontSize: '0.85rem',
                          background: 'rgba(99, 102, 241, 0.9)',
                          borderColor: '#6366f1',
                          color: 'white',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Döndür / Göster 🔄
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          handleSaveMeaningSelection(true);
                        }}
                        className="btn-secondary"
                        style={{
                          flex: 1,
                          padding: '10px 20px',
                          fontSize: '0.85rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          borderColor: '#ef4444',
                          color: '#f87171'
                        }}
                      >
                        Bilmiyorum ❌
                      </button>
                      <button
                        onClick={() => {
                          handleSaveMeaningSelection(false);
                        }}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '10px 24px',
                          fontSize: '0.85rem',
                          background: 'rgba(16, 185, 129, 0.9)',
                          borderColor: '#10b981',
                          color: 'white',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Kaydet ve Devam Et ⏩
                      </button>
                    </>
                  )}
                </div>

                {/* Row 2: Önceki Kelime & optional Skip button */}
                <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                  <button
                    onClick={() => { setCurrentIdx(prev => Math.max(0, prev - 1)); setLearnCardFlipped(false); }}
                    disabled={currentIdx === 0}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '10px 20px', fontSize: '0.8rem', opacity: currentIdx === 0 ? 0.5 : 1 }}
                  >
                    Önceki Kelime
                  </button>

                  {((selectedDay % 7 === 0) || (selectedDay % 28 === 0) || (selectedDay === totalCampDays)) && (
                    <button
                      onClick={() => {
                        setPhase(2);
                        setCurrentIdx(0);
                        setMeaningOptions(meaningOptions);
                      }}
                      className="btn-secondary"
                      style={{ padding: '10px 16px', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171', background: 'rgba(239, 68, 68, 0.05)', fontWeight: 'bold' }}
                    >
                      ⏩ Kartları Geç ve Teste Başla
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PHASE 2: MEANING PRACTICE */}
      {phase === 2 && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 2: Kelimenin Anlamını Eşleştirin <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
                {meaningOptions.map((opt, i) => {
                  const isSelected = meaningSelected === opt;
                  const isCorrectAnswer = opt === studyWords[currentIdx].tr;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (meaningChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = `rgba(${theme.rgb}, 0.15)`;
                    border = `1.5px solid ${theme.color}`;
                    color = 'white';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleMeaningCheck(opt)}
                      disabled={meaningChecked}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: meaningChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{opt}</span>
                      {meaningChecked && (() => {
                        const eng = getEnglishForMeaningOption(opt);
                        return eng ? (
                          <span style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: '700', color: isCorrectAnswer ? '#67e8f9' : '#cbd5e1' }}>
                            ({eng})
                          </span>
                        ) : null;
                      })()}
                    </button>
                  );
                })}
              </div>

              {meaningChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: meaningCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: meaningCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: meaningCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {meaningCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Doğru Eşleşme.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{studyWords[currentIdx].tr}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            {meaningChecked && (
              <button
                onClick={handleMeaningNext}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: SYNONYM PRACTICE */}
      {phase === 3 && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 3: Eş Anlamlıyı Bulun <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
                {synonymOptions.map((opt, i) => {
                  const isSelected = synonymSelected === opt;
                  const cleanCorrect = studyWords[currentIdx].synonyms.split(',')[0].trim();
                  const isCorrectAnswer = opt === cleanCorrect;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (synonymChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = `rgba(${theme.rgb}, 0.15)`;
                    border = `1.5px solid ${theme.color}`;
                    color = 'white';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSynonymCheck(opt)}
                      disabled={synonymChecked}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: synonymChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {synonymChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: synonymCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: synonymCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: synonymCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {synonymCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Eş Anlam Doğru.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{studyWords[currentIdx].synonyms.split(',')[0].trim()}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            {synonymChecked && (
              <button
                onClick={handleSynonymNext}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: ANTONYM PRACTICE */}
      {phase === 4 && studyWords && studyWords.length > 0 && studyWords[currentIdx] && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 4: Zıt Anlamlıyı Bulun <span style={{ color: '#f87171' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(239, 68, 68, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#f87171', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
                {studyWords[currentIdx].word}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', marginTop: '10px' }}>
                {antonymOptions.map((opt, i) => {
                  const isSelected = antonymSelected === opt;
                  const antonymStr = getAntonym(studyWords[currentIdx]);
                  const cleanCorrect = antonymStr.split(',')[0].trim();
                  const isCorrectAnswer = opt === cleanCorrect;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (antonymChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = `rgba(${theme.rgb}, 0.15)`;
                    border = `1.5px solid ${theme.color}`;
                    color = 'white';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleAntonymCheck(opt)}
                      disabled={antonymChecked}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: antonymChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {antonymChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: antonymCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: antonymCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: antonymCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {antonymCorrect ? (
                    <>
                      <Check className="h-4 w-4" /> Tebrikler! Zıt Anlam Doğru.
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" /> Hatalı! Doğru cevap: "{getAntonym(studyWords[currentIdx]).split(',')[0].trim()}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
            {antonymChecked && (
              <button
                onClick={handleAntonymNext}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 5: FILL-IN-THE-BLANK (CLOZE SENTENCE TEST) */}
      {phase === 5 && studyWords && studyWords.length > 0 && studyWords[currentIdx] && (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Adım 5: Cümle Boşluğunu Doldurun (Cloze Test) <span style={{ color: '#10b981' }}>({currentIdx + 1}/{studyWords.length})</span>
            </h4>
            
            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button 
                onClick={() => { setClozeMode('choice'); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: clozeMode === 'choice' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: clozeMode === 'choice' ? '#a5b4fc' : '#94a3b8'
                }}
              >
                Çoktan Seçmeli
              </button>
              <button 
                onClick={() => { setClozeMode('write'); }}
                style={{
                  padding: '4px 10px',
                  fontSize: '0.68rem',
                  fontWeight: 'bold',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: clozeMode === 'write' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: clozeMode === 'write' ? '#a7f3d0' : '#94a3b8'
                }}
              >
                ⌨️ Yazarak Pratik
              </button>
            </div>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '20px 24px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN AKADEMİK CÜMLE</span>
              
              <div style={{ background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '16px 20px', borderRadius: '14px', width: '100%', maxWidth: '550px', marginBottom: '8px' }}>
                <p style={{ fontSize: '1.05rem', color: 'white', fontWeight: '500', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "{getBlankedSentence(studyWords[currentIdx], currentIdx)}"
                </p>
              </div>

              {clozeMode === 'write' ? (
                // WRITING/SPELLING MODE UI
                <div style={{ width: '100%', maxWidth: '550px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                    <input 
                      type="text"
                      value={clozeInputText}
                      onChange={(e) => setClozeInputText(e.target.value)}
                      disabled={clozeChecked}
                      placeholder="Boşluğa gelecek kelimeyi yazın..."
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        color: 'white',
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        outline: 'none',
                        textAlign: 'center'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !clozeChecked) {
                          handleClozeCheck();
                        }
                      }}
                    />
                    <button
                      onClick={() => handleClozeCheck()}
                      disabled={clozeChecked}
                      className="btn-primary"
                      style={{
                        padding: '0 24px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '0.88rem',
                        background: '#10b981',
                        borderColor: '#10b981',
                        cursor: clozeChecked ? 'default' : 'pointer'
                      }}
                    >
                      Kontrol Et
                    </button>
                  </div>
                  
                  {!clozeChecked && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button 
                        onClick={() => setClozeShowHint(true)}
                        style={{ background: 'transparent', border: 'none', color: '#fbbf24', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                      >
                        💡 İpucu Al
                      </button>
                    </div>
                  )}

                  {clozeShowHint && !clozeChecked && (
                    <div style={{ fontSize: '0.78rem', color: '#fde047', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', padding: '6px 12px', borderRadius: '8px' }}>
                      İpucu: Kelime <strong>"{studyWords[currentIdx].word[0].toUpperCase()}"</strong> harfiyle başlıyor ve <strong>{studyWords[currentIdx].word.length}</strong> harften oluşuyor.
                    </div>
                  )}
                </div>
              ) : (
                // CLASSIC MULTIPLE CHOICE OPTIONS
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', maxWidth: '550px', marginTop: '10px' }}>
                  {clozeOptions.map((opt, i) => {
                    const isSelected = clozeSelected === opt;
                    const isCorrectAnswer = opt === studyWords[currentIdx].word;
                    let bg = 'rgba(255, 255, 255, 0.03)';
                    let border = '1px solid rgba(255, 255, 255, 0.08)';
                    let color = 'white';

                    if (clozeChecked) {
                      if (isCorrectAnswer) {
                        bg = 'rgba(16, 185, 129, 0.15)';
                        border = '1.5px solid #10b981';
                        color = '#a7f3d0';
                      } else if (isSelected) {
                        bg = 'rgba(239, 68, 68, 0.15)';
                        border = '1.5px solid #ef4444';
                        color = '#fca5a5';
                      }
                    } else if (isSelected) {
                      bg = `rgba(${theme.rgb}, 0.15)`;
                      border = `1.5px solid ${theme.color}`;
                      color = 'white';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => handleClozeCheck(opt)}
                        disabled={clozeChecked}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '10px',
                          background: bg,
                          border: border,
                          color: color,
                          fontSize: '0.88rem',
                          fontWeight: 'bold',
                          cursor: clozeChecked ? 'default' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {clozeChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  background: clozeCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: clozeCorrect ? '1.5px solid rgba(16, 185, 129, 0.2)' : '1.5px solid rgba(239, 68, 68, 0.2)',
                  color: clozeCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: '550px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    {clozeCorrect ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span>{clozeCorrect ? 'Tebrikler! Doğru Seçim.' : `Hatalı! Doğru cevap: "${studyWords[currentIdx].word}" olmalıydı.`}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    <strong>Türkçe Çeviri:</strong> {studyWords[currentIdx].sentences && studyWords[currentIdx].sentences.length > (clozeSentenceIndexes[currentIdx] || 0) ? studyWords[currentIdx].sentences[clozeSentenceIndexes[currentIdx] || 0].tr : (studyWords[currentIdx].en_tr || studyWords[currentIdx].tr)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            {clozeChecked && (
              <button
                onClick={handleClozeNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 6: DAY SUMMARY / REPORT */}
      {phase === 6 && (
        <div className="space-y-6 text-center py-8 animate-scale-in">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}>
              <Trophy className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
            Tebrikler! Gün #{selectedDay} Başarıyla Tamamlandı! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Bugünün akademik kelimelerini; anlam okuma, anlam testi, eş anlam bulma, zıt anlam bulma ve çoktan seçmeli kelime testi ile başarıyla çalıştınız.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Kazanılan Ödül</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block', marginTop: '4px' }}>+40 Evcil Hayvan XP</span>
            </div>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Ekstra Kristal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginTop: '4px' }}>+10 Kristal 💎</span>
            </div>
          </div>

          <div style={{ textAlign: 'left', maxWidth: '480px', margin: '20px auto', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'white', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              Günlük Kelime İlerleme Raporu
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {studyWords.map((w, idx) => {
                const wasCorrect = wordResults[w.word] !== false;
                const level = progress && progress.wordMastery ? (progress.wordMastery[w.word] || 0) : 0;
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: 'white' }}>{w.word}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="word-badge" style={{
                        background: wasCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: wasCorrect ? '#34d399' : '#f87171',
                        border: wasCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                        fontSize: '0.72rem'
                      }}>
                        {wasCorrect ? 'Tam Öğrenildi' : 'Tekrar Edilecek'}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Seviye: {level}/3</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={exitCamp}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Kamp Takvimine Dön
            </button>
          </div>
        </div>
      )}

      {/* Exit Camp Button at the very bottom for all active study phases (1-5) */}
      {phase < 6 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <button 
            onClick={exitCamp} 
            className="btn-secondary" 
            style={{ 
              padding: '8px 24px', 
              fontSize: '0.8rem', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              color: '#f87171',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Kampı Kapat ve Çık
          </button>
        </div>
      )}
    </div>
  </div>
);
};

export default CampStudy;
