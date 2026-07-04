import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, HelpCircle, ArrowRight, Volume2, Award, BookOpenCheck } from 'lucide-react';

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
  const [passages, setPassages] = useState([]);
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [translatedWord, setTranslatedWord] = useState(null);
  const [translationText, setTranslationText] = useState('');
  const [translationPos, setTranslationPos] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Track completed passages
  const [completedPassages, setCompletedPassages] = useState(() => {
    return JSON.parse(localStorage.getItem('completed_passages') || '[]');
  });

  // Focus Mode States
  const [focusMode, setFocusMode] = useState(false);
  const [synonymSwapperActive, setSynonymSwapperActive] = useState(false);

  // Cloze Test States
  const [clozeMode, setClozeMode] = useState(false);
  const [clozeAnswers, setClozeAnswers] = useState({});
  const [clozeChecked, setClozeChecked] = useState(false);
  const [clozeScore, setClozeScore] = useState(0);

  // Mobile/Reader Typography adjustment states
  const [readFontSize, setReadFontSize] = useState(() => localStorage.getItem('yokdil_read_fontsize') || '0.88');
  const [readLineHeight, setReadLineHeight] = useState(() => localStorage.getItem('yokdil_read_lineheight') || '1.8');
  const [layoutMode, setLayoutMode] = useState('split'); // 'split' or 'english'


  useEffect(() => {
    if (activeTab === 'paragraphs' && BACKEND_URL) {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/passages`)
        .then(res => res.json())
        .then(data => {
          // Sort passages by word count (short to long)
          const sorted = data.sort((a, b) => (a.wordCount || 0) - (b.wordCount || 0));
          
          // Filter by category or show all
          const filtered = sorted.filter(p => !selectedCategory || p.category === selectedCategory);
          setPassages(filtered);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading passages:", err);
          setLoading(false);
        });
    }
  }, [activeTab, selectedCategory, BACKEND_URL]);

  useEffect(() => {
    localStorage.setItem('completed_passages', JSON.stringify(completedPassages));
  }, [completedPassages]);

  if (activeTab !== 'paragraphs') return null;

  const handleWordClick = async (event, rawWord) => {
    event.stopPropagation();
    const cleanWord = rawWord.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    if (!cleanWord) return;

    if (incrementDailyWords) incrementDailyWords();

    const rect = event.target.getBoundingClientRect();
    setTranslationPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX
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

  const handleMouseUp = async (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Check if it looks like a phrase (at least two words, maximum 6 words)
    if (selectedText.length > 2 && selectedText.split(/\s+/).length >= 2 && selectedText.split(/\s+/).length <= 6) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setTranslationPos({
          top: rect.bottom + window.scrollY + 6,
          left: rect.left + window.scrollX
        });
        setTranslatedWord(selectedText);
        setTranslationText('Kalıp Çeviriliyor...');

        if (incrementDailyWords) incrementDailyWords();
        
        const res = await fetch(`${BACKEND_URL}/api/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: selectedText })
        });
        const data = await res.json();
        if (data.translation) {
          setTranslationText(data.translation);
        } else {
          setTranslationText('Çeviri bulunamadı.');
        }
      } catch (err) {
        console.error("Selection translate error:", err);
      }
    }
  };

  const handleSelectOption = (qId, option) => {
    if (checkedQuestions[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleCheckQuestion = (qObj) => {
    if (checkedQuestions[qObj.id]) return;
    if (!selectedAnswers[qObj.id]) return;

    if (incrementDailyQuestions) incrementDailyQuestions();

    const isCorrect = selectedAnswers[qObj.id] === qObj.answer;
    const nextChecked = { ...checkedQuestions, [qObj.id]: true };
    setCheckedQuestions(nextChecked);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // If all questions are answered, mark passage as completed
    if (selectedPassage) {
      const allAnswered = selectedPassage.questions.every(q => q.id === qObj.id || nextChecked[q.id]);
      if (allAnswered && !completedPassages.includes(selectedPassage.id)) {
        setCompletedPassages(prev => [...prev, selectedPassage.id]);
      }
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

  // Helper to tokenize passage sentences into clickable word tags
  const renderInteractivePassage = (text) => {
    const words = text.split(/\s+/);
    return words.map((word, idx) => {
      const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
      const synonym = SYNONYM_MAP[cleanWord];
      const shouldSwap = synonymSwapperActive && synonym;
      const displayWord = shouldSwap ? `${synonym} [${word}]` : word;
      
      return (
        <React.Fragment key={idx}>
          <span
            onClick={(e) => handleWordClick(e, shouldSwap ? synonym : word)}
            style={{
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              padding: '1px 2px',
              borderRadius: '4px',
              display: 'inline',
              color: shouldSwap ? '#f59e0b' : 'inherit',
              fontWeight: shouldSwap ? '800' : 'normal',
              borderBottom: shouldSwap ? '1px dashed #f59e0b' : 'none'
            }}
            title={shouldSwap ? `Orijinal: ${word}` : ''}
            onMouseEnter={(e) => { 
              e.target.style.color = '#818cf8'; 
              e.target.style.background = 'rgba(99,102,241,0.08)'; 
            }}
            onMouseLeave={(e) => { 
              e.target.style.color = shouldSwap ? '#f59e0b' : 'inherit'; 
              e.target.style.background = 'transparent'; 
            }}
          >
            {displayWord}
          </span>
          {' '}
        </React.Fragment>
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
          <React.Fragment key={idx}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', margin: '0 4px' }}>
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
              {clozeChecked && clozeAnswers[blankId] !== clean && (
                <span style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 'bold' }} title="Doğru Cevap">
                  (Doğru: {clean})
                </span>
              )}
              {punctuation && <span style={{ color: 'inherit' }}>{punctuation}</span>}
            </span>
          </React.Fragment>
        );
      }
      
      return (
        <React.Fragment key={idx}>
          <span style={{ margin: '0 2px' }}>{word}</span>
          {' '}
        </React.Fragment>
      );
    });
  };

  return (
    <div style={{ position: 'relative' }} onClick={() => setTranslatedWord(null)}>
      {/* Translation Popover Bubble */}
      {translatedWord && translationPos && (
        <div style={{
          position: 'absolute',
          top: `${translationPos.top}px`,
          left: `${translationPos.left}px`,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: '8px 12px',
          borderRadius: '8px',
          color: '#e2e8f0',
          fontSize: '0.72rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 1000,
          pointerEvents: 'auto',
          maxWidth: '220px',
          textAlign: 'left'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontWeight: 'bold', color: '#818cf8', marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
              {translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")}
            </span>
            <button 
              onClick={() => playSpeechAudio && playSpeechAudio(translatedWord)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <Volume2 className="h-3 w-3" />
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#f8fafc' }}>{translationText}</p>
          {notebook && handleAddCustomWord && (
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const cleanW = translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
                  if (cleanW && translationText && !translationText.includes('Çeviriliyor') && !translationText.includes('Çeviri hatası')) {
                    handleAddCustomWord(cleanW, translationText);
                  }
                }}
                disabled={
                  (notebook && notebook.some(item => item.english.toLowerCase() === translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase())) ||
                  translationText.includes('Çeviriliyor') || 
                  translationText.includes('hata') || 
                  translationText.includes('Mevcut Değil')
                }
                style={{
                  background: (notebook && notebook.some(item => item.english.toLowerCase() === translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase())) 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(99, 102, 241, 0.25)',
                  border: (notebook && notebook.some(item => item.english.toLowerCase() === translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase())) 
                    ? '1px solid #10b981' 
                    : '1px solid #6366f1',
                  color: (notebook && notebook.some(item => item.english.toLowerCase() === translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase())) 
                    ? '#34d399' 
                    : '#a5b4fc',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  fontSize: '0.62rem',
                  fontWeight: 'bold',
                  cursor: (notebook && notebook.some(item => item.english.toLowerCase() === translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase())) ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {(notebook && notebook.some(item => item.english.toLowerCase() === translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim().toLowerCase())) 
                  ? '✓ Defterde' 
                  : 'Deftere Ekle'}
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div style={{ height: '24px', width: '30%', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', className: 'animate-pulse' }} />
          <div className="glass-card" style={{ padding: '24px', borderRadius: '16px', height: '200px', background: 'rgba(255, 255, 255, 0.01)', className: 'animate-pulse' }} />
        </div>
      ) : !selectedPassage ? (
        /* PASSAGES LIST SCREEN */
        <div className="space-y-4">
          <div className="welcome-card text-left">
            <h2>Akademik Okuma Çalışması 📖</h2>
            <p>Paragrafları okuyun, bilmediğiniz kelimelerin üzerine tıklayarak çevirisini anında öğrenin ve okuduğunu anlama sorularını çözün.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {passages.map(p => {
              const isCompleted = completedPassages.includes(p.id);
              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    setSelectedPassage(p);
                    setSelectedAnswers({});
                    setCheckedQuestions({});
                    setScore(0);
                    setClozeMode(false);
                    setClozeChecked(false);
                  }}
                  className="glass-card flex items-center justify-between hover:bg-white/2"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                      border: isCompleted ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(99, 102, 241, 0.25)',
                      color: isCompleted ? '#34d399' : '#a5b4fc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isCompleted ? <BookOpenCheck className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white', margin: '0 0 2px 0' }}>
                        {p.title} 
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                        {p.wordCount} Kelime | 3 Anlama Sorusu
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isCompleted ? (
                      <span style={{ fontSize: '0.62rem', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        ✓ OKUNDU
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.62rem', fontWeight: 'bold', background: 'rgba(148, 163, 184, 0.08)', color: '#94a3b8', padding: '3px 8px', borderRadius: '6px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                        OKUNMADI
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* PASSAGE SPLIT COMPREHENSION SCREEN */
        <div className="space-y-4">
          <div className="glass-card flex items-center justify-between" style={{ padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => {
                setSelectedPassage(null);
                setFocusMode(false);
              }}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              ← Paragraf Listesine Dön
            </button>

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
                <button
                  onClick={() => setSynonymSwapperActive(!synonymSwapperActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    synonymSwapperActive ? 'bg-orange-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                  title="Eşanlamlı Kelime Değiştirici (Synonym Swapper)"
                >
                  🔄 Eşanlamlı Değiştirici
                </button>
              )}
              <button
                onClick={() => setLayoutMode(layoutMode === 'split' ? 'english' : 'split')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  layoutMode === 'split' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                title="Görünüm Modu (İngilizce - Türkçe Çeviri Yan Yana)"
              >
                {layoutMode === 'split' ? '📖 Yan Yana Görünüm' : '📖 Tekli Görünüm'}
              </button>
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
                ✏️ Cloze Test Modu
              </button>
            </div>

            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              Doğru Sayısı: {score} / 3
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
            {/* Left side: Passage details */}
            <div className={`glass-card ${focusMode ? 'focus-container' : ''}`} style={{ flex: layoutMode === 'split' ? '2.5' : '1.5', minWidth: '320px', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '16px', background: focusMode ? 'rgba(8,10,16,0.98)' : 'rgba(11, 15, 26, 0.6)' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akademik Metin ({selectedPassage.wordCount} Kelime)</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>{selectedPassage.title}</h3>
              </div>
              
              {/* Okuma Modu Ayarları Barı */}
              <div className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300" style={{ fontSize: '0.72rem' }}>
                <span style={{ fontWeight: 'bold', color: '#818cf8' }}>Okuma Ayarları:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => {
                      const nextVal = Math.max(0.75, parseFloat(readFontSize) - 0.05).toFixed(2);
                      setReadFontSize(nextVal);
                      localStorage.setItem('yokdil_read_fontsize', nextVal);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-bold transition-all"
                    title="Yazıyı Küçült"
                  >
                    A-
                  </button>
                  <span style={{ fontFamily: 'monospace', minWidth: '32px', textAlign: 'center' }}>{Math.round(parseFloat(readFontSize) * 100)}%</span>
                  <button 
                    onClick={() => {
                      const nextVal = Math.min(1.4, parseFloat(readFontSize) + 0.05).toFixed(2);
                      setReadFontSize(nextVal);
                      localStorage.setItem('yokdil_read_fontsize', nextVal);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-bold transition-all"
                    title="Yazıyı Büyüt"
                  >
                    A+
                  </button>
                  
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                  
                  <button 
                    onClick={() => {
                      const nextVal = Math.max(1.4, parseFloat(readLineHeight) - 0.1).toFixed(1);
                      setReadLineHeight(nextVal);
                      localStorage.setItem('yokdil_read_lineheight', nextVal);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-bold transition-all"
                    title="Satır Aralığını Azalt"
                  >
                    Satır ↕-
                  </button>
                  <button 
                    onClick={() => {
                      const nextVal = Math.min(2.4, parseFloat(readLineHeight) + 0.1).toFixed(1);
                      setReadLineHeight(nextVal);
                      localStorage.setItem('yokdil_read_lineheight', nextVal);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-bold transition-all"
                    title="Satır Aralığını Artır"
                  >
                    Satır ↕+
                  </button>
                </div>
              </div>

              <div onMouseUp={handleMouseUp} style={{ fontSize: `${readFontSize}rem`, lineHeight: readLineHeight, color: '#cbd5e1', textAlign: 'justify', margin: 0 }}>
                {clozeMode ? (
                  <div>
                    <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 'bold' }}>
                      ✏️ Metindeki boş bırakılmış yerlere en uygun düşen akademik kelimeleri seçin.
                    </div>
                    {renderClozePassage(selectedPassage.passage)}

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {!clozeChecked ? (
                        <button
                          onClick={() => {
                            let correctCount = 0;
                            let totalTargets = 0;
                            const words = selectedPassage.passage.split(/\s+/);
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
                          Cloze Test Skoru: {clozeScore} / {selectedPassage.passage.split(/\s+/).map(w => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")).filter(clean => CLOZE_TARGETS.includes(clean)).length} Doğru!
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
                ) : layoutMode === 'split' && selectedPassage.translation ? (
                  selectedPassage.passage.split('\n').filter(Boolean).map((para, idx) => {
                    const trPara = (selectedPassage.translation || "").split('\n').filter(Boolean)[idx] || "";
                    return (
                      <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 border-b border-white/5 pb-3">
                        <div className="flex-1 text-justify">
                          {renderInteractivePassage(para)}
                        </div>
                        <div className="flex-1 text-justify text-slate-400 italic bg-white/[0.02] p-3.5 rounded-xl border-l-2 border-emerald-500 text-[0.92rem] leading-relaxed">
                          {trPara}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  selectedPassage.passage.split('\n').filter(Boolean).map((para, idx) => (
                    <p key={idx} style={{ marginBottom: '12px' }}>
                      {renderInteractivePassage(para)}
                    </p>
                  ))
                )}
              </div>
              <div style={{ marginTop: 'auto', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 <span style={{ textAlign: 'left' }}>Paragraf içerisindeki herhangi bir kelimeye tıklayarak Türkçe çevirisini anında görebilirsiniz.</span>
              </div>
            </div>

            {/* Right side: Questions */}
            <div style={{ flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedPassage.questions.map((q, qIdx) => {
                const isChecked = checkedQuestions[q.id];
                const selectedOpt = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="glass-card" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <span style={{
                        background: 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        color: '#a5b4fc',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}>
                        {qIdx + 1}
                      </span>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: '800', color: 'white', margin: 0, lineHeight: '1.4' }}>{q.question}</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      {q.options.map((opt) => {
                        let btnStyle = {
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '0.74rem',
                          textAlign: 'left',
                          border: '1px solid rgba(255,255,255,0.05)',
                          background: 'rgba(255,255,255,0.02)',
                          color: '#94a3b8',
                          cursor: isChecked ? 'default' : 'pointer',
                          transition: 'all 0.2s ease'
                        };

                        if (isChecked) {
                          if (opt === q.answer) {
                            btnStyle.background = 'rgba(16, 185, 129, 0.15)';
                            btnStyle.border = '1px solid #10b981';
                            btnStyle.color = '#34d399';
                          } else if (opt === selectedOpt) {
                            btnStyle.background = 'rgba(239, 68, 68, 0.15)';
                            btnStyle.border = '1px solid #ef4444';
                            btnStyle.color = '#f87171';
                          }
                        } else if (opt === selectedOpt) {
                          btnStyle.background = 'rgba(99, 102, 241, 0.15)';
                          btnStyle.border = '1px solid #6366f1';
                          btnStyle.color = '#a5b4fc';
                        }

                        return (
                          <button
                            key={opt}
                            disabled={isChecked}
                            onClick={() => handleSelectOption(q.id, opt)}
                            style={btnStyle}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isChecked && (
                      <button
                        disabled={!selectedOpt}
                        onClick={() => handleCheckQuestion(q)}
                        className="btn-primary"
                        style={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '0.72rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: selectedOpt ? 'pointer' : 'not-allowed',
                          opacity: selectedOpt ? 1.0 : 0.5
                        }}
                      >
                        Cevabı Kontrol Et <HelpCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParagraphsSection;
