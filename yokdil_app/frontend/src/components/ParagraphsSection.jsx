import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, HelpCircle, ArrowRight, Volume2, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';

import ACADEMIC_BOOKS from './reading_books.json';

const ParagraphsSection = ({
  activeTab,
  selectedCategory,
  BACKEND_URL,
  incrementDailyQuestions,
  incrementDailyWords,
  playSpeechAudio,
  notebook,
  handleAddCustomWord,
  logStudyActivity
}) => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [activePageIdx, setActivePageIdx] = useState(0);
  
  const [translatedWord, setTranslatedWord] = useState(null);
  const [translationText, setTranslationText] = useState('');
  const [translationPos, setTranslationPos] = useState(null);
  
  // Focus Mode States
  const [focusMode, setFocusMode] = useState(false);
  const [useDyslexicFont, setUseDyslexicFont] = useState(false);
  const [useReadingRuler, setUseReadingRuler] = useState(false);
  const [hoveredParagraphIndex, setHoveredParagraphIndex] = useState(null);
  const [synonymSwapperActive, setSynonymSwapperActive] = useState(false);

  // Cloze Test States
  const [clozeMode, setClozeMode] = useState(false);
  const [clozeAnswers, setClozeAnswers] = useState({});
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeScore, setClozeScore] = useState(0);
  const [dualViewActive, setDualViewActive] = useState(false);
  const [books, setBooks] = useState(ACADEMIC_BOOKS);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (selectedBook && logStudyActivity) {
      logStudyActivity('paragraphs', 1);
    }
  }, [selectedBook, activePageIdx, activeChapterIdx]);

  useEffect(() => {
    if (selectedCategory) {
      setActiveFilter(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (activeTab === 'paragraphs' && BACKEND_URL) {
      fetch(`${BACKEND_URL}/api/books`)
        .then(res => res.json())
        .then(data => {
          setBooks(data);
        })
        .catch(err => {
          console.error("Error loading books from API:", err);
        });
    }
  }, [activeTab, BACKEND_URL]);

  useEffect(() => {
    // Reset reading progress when book changes
    setActiveChapterIdx(0);
    setActivePageIdx(0);
    setClozeMode(false);
    setClozeAnswers({});
    setClozeChecked(false);
  }, [selectedBook]);

  if (activeTab !== 'paragraphs') return null;

  const filteredBooks = books.filter(b => activeFilter === 'all' || b.category === activeFilter);

  const handleWordClick = async (event, rawWord) => {
    event.stopPropagation();
    const cleanWord = rawWord.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    if (!cleanWord) return;

    if (incrementDailyWords) incrementDailyWords();

    const rect = event.target.getBoundingClientRect();
    setTranslationPos({
      top: rect.bottom + 6,
      left: rect.left
    });
    setTranslatedWord(rawWord);
    setTranslationText('Çeviriliyor...');

    try {
      const res = await fetch(`${BACKEND_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanWord })
      });
      const data = await res.json();
      if (data.translation) {
        setTranslationText(data.translation);
      } else {
        setTranslationText('Çeviri bulunamadı.');
      }
    } catch (e) {
      setTranslationText('Çeviri hatası.');
    }
  };

  const SYNONYM_MAP = {
    "evaluate": "assess",
    "discover": "find",
    "reveal": "show",
    "significant": "important",
    "consequence": "result",
    "establish": "found",
    "develop": "grow",
    "provide": "give",
    "influence": "affect",
    "determine": "decide"
  };

  // Check if word is already in notebook
  const isWordInNotebook = (w) => {
    const clean = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    return (notebook || []).some(item => item.english.toLowerCase() === clean);
  };

  const renderInteractivePassage = (text) => {
    const words = text.split(/\s+/);
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
      const synonym = SYNONYM_MAP[cleanWord];
      const shouldSwap = synonymSwapperActive && synonym;
      const displayWord = shouldSwap ? word.toLowerCase().replace(cleanWord, synonym) : word;
      const isKnown = isWordInNotebook(cleanWord);
      
      return (
        <span
          key={idx}
          onClick={(e) => handleWordClick(e, shouldSwap ? synonym : word)}
          style={{
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            padding: '1px 2px',
            borderRadius: '4px',
            display: 'inline-block',
            color: shouldSwap ? '#f59e0b' : 'inherit',
            fontWeight: shouldSwap ? '800' : 'normal',
            borderBottom: shouldSwap ? '1px dashed #f59e0b' : 'none',
            background: isKnown ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
            textDecoration: isKnown ? 'underline' : 'none'
          }}
          title={shouldSwap ? `Orijinal: ${word}` : isKnown ? 'Deftere Kaydedildi' : ''}
          onMouseEnter={(e) => { 
            e.target.style.color = '#818cf8'; 
            e.target.style.background = 'rgba(99,102,241,0.08)'; 
          }}
          onMouseLeave={(e) => { 
            e.target.style.color = shouldSwap ? '#f59e0b' : 'inherit'; 
            e.target.style.background = isKnown ? 'rgba(245, 158, 11, 0.15)' : 'transparent'; 
          }}
        >
          {displayWord}{' '}
        </span>
      );
    });
  };

  const CLOZE_TARGETS = ["although", "significant", "however", "discover", "reveal", "consequence", "because", "despite", "therefore", "establish", "develop", "provide", "influence", "determine"];
  
  const CLOZE_DISTRACTORS = {
    "although": ["because", "despite", "therefore"],
    "significant": ["unimportant", "temporary", "minor"],
    "however": ["moreover", "therefore", "thus"],
    "discover": ["ignore", "destroy", "hide"],
    "reveal": ["conceal", "reject", "predict"],
    "consequence": ["cause", "purpose", "origin"],
    "because": ["although", "while", "unless"],
    "despite": ["because of", "even though", "instead of"],
    "therefore": ["however", "whereas", "nonetheless"],
    "establish": ["demolish", "neglect", "forget"],
    "develop": ["shrink", "decay", "collapse"],
    "provide": ["deprive", "refuse", "restrict"],
    "influence": ["result", "contain", "avoid"],
    "determine": ["guess", "doubt", "hesitate"]
  };

  const renderClozePassage = (text) => {
    const words = text.split(/\s+/);
    let clozeCounter = 0;
    
    return words.map((word, idx) => {
      const clean = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const isTarget = CLOZE_TARGETS.includes(clean);
      const punctuation = word.slice(clean.length);
      
      if (isTarget) {
        const blankId = clozeCounter++;
        const options = [clean, ...(CLOZE_DISTRACTORS[clean] || ["although", "however", "therefore"])].sort();
        
        return (
          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '0 4px' }}>
            <select
              value={clozeAnswers[blankId] || ''}
              onChange={(e) => {
                if (!clozeChecked) {
                  setClozeAnswers(prev => ({ ...prev, [blankId]: e.target.value }));
                }
              }}
              disabled={clozeChecked}
              style={{
                background: clozeChecked
                  ? (clozeAnswers[blankId] === clean ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                  : 'rgba(99, 102, 241, 0.08)',
                border: `1px solid ${
                  clozeChecked
                    ? (clozeAnswers[blankId] === clean ? '#10b981' : '#ef4444')
                    : 'rgba(99, 102, 241, 0.3)'
                }`,
                color: clozeChecked
                  ? (clozeAnswers[blankId] === clean ? '#34d399' : '#f87171')
                  : 'white',
                padding: '2px 6px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">[ Seçiniz ]</option>
              {options.map((opt, oIdx) => (
                <option key={oIdx} value={opt} style={{ background: '#0f172a', color: 'white' }}>{opt}</option>
              ))}
            </select>
            {punctuation && <span style={{ color: 'inherit' }}>{punctuation}</span>}
          </span>
        );
      }
      
      return <span key={idx} style={{ margin: '0 2px' }}>{word} </span>;
    });
  };

  const activeChapter = selectedBook?.chapters?.[activeChapterIdx];
  const fullChapterText = activeChapter?.pages?.join('\n\n') || '';
  const fullChapterTurkish = activeChapter?.turkishPages?.join('\n\n') || '';

  const progressPercent = Math.round(((activeChapterIdx + 1) / (selectedBook?.chapters?.length || 1)) * 100);

  return (
    <div style={{ position: 'relative' }} onClick={() => setTranslatedWord(null)}>
      {/* Translation Popover Bubble */}
      {translatedWord && translationPos && (
        <div style={{
          position: 'fixed',
          top: `${translationPos.top}px`,
          left: `${translationPos.left}px`,
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          backdropFilter: 'blur(8px)',
          maxWidth: '280px',
          textAlign: 'left'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>{translatedWord}</span>
            <button 
              onClick={() => {
                if (playSpeechAudio) playSpeechAudio(translatedWord);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer' }}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: '1.4', marginBottom: '8px' }}>
            {translationText}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                if (handleAddCustomWord) {
                  const clean = translatedWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                  handleAddCustomWord(clean, translationText, `Marked from book: ${selectedBook.title}`, selectedBook.category);
                  alert(`"${clean}" defterinize eklendi!`);
                }
              }}
              disabled={isWordInNotebook(translatedWord)}
              className="px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all cursor-pointer border-none"
              style={{ flex: 1, opacity: isWordInNotebook(translatedWord) ? 0.5 : 1 }}
            >
              {isWordInNotebook(translatedWord) ? '✓ Kaydedildi' : '📇 Deftere Ekle'}
            </button>
          </div>
        </div>
      )}

      {!selectedBook ? (
        /* BOOKSHELF / LIBRARY VIEW */
        <div className="space-y-6 text-left">
          <div className="section-title">
            <h2 className="flex items-center gap-2"><BookOpen className="h-6 w-6 text-indigo-400" /> Akademik Kitaplık</h2>
            <p>Seviyenize uygun kitapları okuyun, anlamını bilmediğiniz kelimelerin üzerine tıklayarak kelime defterinize ekleyin.</p>
          </div>

          {/* Category Filters */}
          <div className="tab-buttons" style={{ marginBottom: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '🌍 Tüm Kitaplar' },
              { id: 'fen', label: '🔬 Fen Bilimleri' },
              { id: 'saglik', label: '🩺 Sağlık Bilimleri' },
              { id: 'sosyal', label: '⚖️ Sosyal Bilimler' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`tab-btn ${activeFilter === f.id ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.76rem', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {filteredBooks.map((book) => (
              <div 
                key={book.id}
                className="glass-card flex flex-col justify-between hover:scale-[1.02] transition-all"
                style={{ 
                  borderRadius: '20px', 
                  padding: '24px', 
                  background: 'rgba(11, 15, 26, 0.6)', 
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
                onClick={() => setSelectedBook(book)}
              >
                {/* Book Cover Visualizer */}
                <div style={{ 
                  background: book.coverColor, 
                  height: '160px', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'flex-end', 
                  padding: '16px', 
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'inset 0 -40px 80px rgba(0,0,0,0.6)'
                }}>
                  <Bookmark className="h-5 w-5 absolute top-3 right-3 text-white/40" />
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{book.category === 'fen' ? '🔬 FEN BİLİMLERİ' : '⚖️ SOSYAL BİLİMLER'}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'white', margin: '4px 0 0 0', lineHeight: 1.2 }}>{book.title}</h3>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>{book.author}</span>
                </div>

                <div className="space-y-2">
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {book.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                    {book.chapters.length} Bölüm
                  </span>
                  <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Okumaya Başla →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ACTIVE BOOK READER VIEW */
        <div className="space-y-4 text-left">
          {/* Top Control Bar */}
          <div className="glass-card flex items-center justify-between" style={{ padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => {
                setSelectedBook(null);
                setFocusMode(false);
                setUseReadingRuler(false);
              }}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              ← Kütüphaneye Dön
            </button>

            {/* Reading Progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary-light)' }}></div>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>%{progressPercent} Okundu</span>
            </div>

            {/* Focus Options */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  focusMode ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Odaklanma Modu (Karanlık Mod & Dikkat Dağıtıcıları Gizleme)"
              >
                👁️ Odaklanma Modu
              </button>
              {focusMode && (
                <>
                  <button
                    onClick={() => setUseReadingRuler(!useReadingRuler)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      useReadingRuler ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                    title="Okuma Cetveli (Satır Hizalama)"
                  >
                    📏 Okuma Cetveli
                  </button>
                  <button
                    onClick={() => setUseDyslexicFont(!useDyslexicFont)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      useDyslexicFont ? 'bg-amber-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                    title="Disleksi Uyumlu Yazı Tipi"
                  >
                    🔤 Disleksi Fontu
                  </button>
                  <button
                    onClick={() => setSynonymSwapperActive(!synonymSwapperActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      synonymSwapperActive ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                    title="Eşanlamlı Kelime Değiştirici (Synonym Swapper)"
                  >
                    🔄 Eşanlamlı Değiştirici
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setClozeMode(!clozeMode);
                  setClozeAnswers({});
                  setClozeChecked(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  clozeMode ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Cloze Test Modu (Boşluk Doldurma)"
              >
                📝 Cloze Test Modu
              </button>
              <button
                onClick={() => setDualViewActive(!dualViewActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dualViewActive ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Eş Zamanlı Çeviri (Parallel Reading)"
              >
                📖 Eş Zamanlı Çeviri
              </button>
            </div>
          </div>

          {/* Reader Body Layout */}
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
            <div className={`glass-card ${focusMode ? 'focus-container' : ''} ${useReadingRuler ? 'reading-ruler-active' : ''}`} style={{ flex: '1', minWidth: '320px', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '16px', background: focusMode ? 'rgba(8,10,16,0.98)' : 'rgba(11, 15, 26, 0.6)' }}>
              
              {/* Book Chapter / Header */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{selectedBook.title}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>{activeChapter.title}</h3>
                </div>
                {/* Chapter Selector Dropdown */}
                <select
                  value={activeChapterIdx}
                  onChange={(e) => {
                    setActiveChapterIdx(parseInt(e.target.value));
                    setActivePageIdx(0);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {selectedBook.chapters.map((ch, idx) => (
                    <option key={idx} value={idx} style={{ background: '#0a0f1d' }}>Bölüm {idx + 1}</option>
                  ))}
                </select>
              </div>

              {/* Text Render Area */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                <div 
                  className={`focus-passage-text ${useDyslexicFont ? 'font-dyslexic' : ''}`} 
                  style={{ 
                    flex: 1, 
                    minWidth: '280px', 
                    maxHeight: '480px', 
                    overflowY: 'auto', 
                    paddingRight: '12px',
                    fontSize: '0.94rem', 
                    lineHeight: '2.0', 
                    color: '#cbd5e1', 
                    textAlign: 'justify', 
                    margin: 0 
                  }}
                >
                  {clozeMode ? (
                    <div>
                      <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 'bold' }}>
                        📝 Metindeki boş bırakılmış yerlere en uygun düşen akademik kelimeleri seçin.
                      </div>
                      {renderClozePassage(fullChapterText)}

                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {!clozeChecked ? (
                          <button
                            onClick={() => {
                              let correctCount = 0;
                              let totalTargets = 0;
                              const words = fullChapterText.split(/\s+/);
                              words.forEach(word => {
                                const clean = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                                if (CLOZE_TARGETS.includes(clean)) {
                                  const ans = clozeAnswers[totalTargets];
                                  if (ans === clean) correctCount++;
                                  totalTargets++;
                                }
                              });
                              setClozeChecked(true);
                              setClozeScore(correctCount);
                              if (incrementDailyQuestions) incrementDailyQuestions();
                            }}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            Cevapları Kontrol Et
                          </button>
                        ) : (
                          <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#34d399' }}>
                            Cloze Test Skoru: {clozeScore} / {fullChapterText.split(/\s+/).map(w => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).filter(clean => CLOZE_TARGETS.includes(clean)).length} Doğru!
                          </div>
                        )}
                        {clozeChecked && (
                          <button
                            onClick={() => {
                              setClozeAnswers({});
                              setClozeChecked(false);
                              setClozeScore(0);
                            }}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.72rem', cursor: 'pointer' }}
                          >
                            Yeniden Başlat
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    fullChapterText.split('\n\n').map((para, paraIdx) => (
                      <p 
                        key={paraIdx}
                        className={hoveredParagraphIndex === paraIdx ? 'ruler-highlight' : ''}
                        onMouseEnter={() => {
                          if (useReadingRuler) setHoveredParagraphIndex(paraIdx);
                        }}
                        onMouseLeave={() => {
                          if (useReadingRuler) setHoveredParagraphIndex(null);
                        }}
                        style={{ marginBottom: '16px' }}
                      >
                        {renderInteractivePassage(para)}
                      </p>
                    ))
                  )}
                </div>

                {dualViewActive && !clozeMode && (
                  <div 
                    style={{ 
                      flex: 1, 
                      minWidth: '280px', 
                      maxHeight: '480px', 
                      overflowY: 'auto', 
                      padding: '20px', 
                      background: 'rgba(255,255,255,0.02)', 
                      borderLeft: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '14px', 
                      alignSelf: 'stretch' 
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                      ⚖️ Türkçe Akademik Çeviri
                    </div>
                    {fullChapterTurkish.split('\n\n').map((para, paraIdx) => (
                      <p key={paraIdx} style={{ fontSize: '0.9rem', lineHeight: '2.0', color: '#94a3b8', textAlign: 'justify', marginBottom: '16px' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Reader Navigation / Chapter footer info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                  Okuma İlerlemesi: %{progressPercent}
                </div>
                {activeChapterIdx < selectedBook.chapters.length - 1 ? (
                  <button
                    onClick={() => {
                      setActiveChapterIdx(prev => prev + 1);
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                  >
                    Sonraki Bölüm <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 'bold' }}>🎉 Kitap Tamamlandı!</span>
                )}
              </div>

              <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 <span style={{ textAlign: 'left' }}>Metin içerisindeki bilinmeyen kelimelere tıklayıp anlamını görebilir ve tek tıkla Kelimelerim defterine ekleyebilirsiniz. Kaydedilen kelimelerin arka planı sarı olarak işaretlenir.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParagraphsSection;
