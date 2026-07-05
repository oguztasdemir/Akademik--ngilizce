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
  const [translatedWord, setTranslatedWord] = useState(null);
  const [translationText, setTranslationText] = useState('');
  const [translationPos, setTranslationPos] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Track completed passages
  const [completedPassages, setCompletedPassages] = useState(() => {
    return JSON.parse(localStorage.getItem('completed_passages') || '[]');
  });

  // Translation History State
  const [translationHistory, setTranslationHistory] = useState([]);
  // Drag selection states
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState(null);
  const [dragEndIdx, setDragEndIdx] = useState(null);
  const [dragOrigin, setDragOrigin] = useState(null); // 'en' or 'tr'
  const [dragSentenceIdx, setDragSentenceIdx] = useState(0);
  // Mobile/Reader Typography adjustment states
  const [readFontSize, setReadFontSize] = useState(() => localStorage.getItem('yokdil_read_fontsize') || '0.88');
  const [readLineHeight, setReadLineHeight] = useState(() => localStorage.getItem('yokdil_read_lineheight') || '1.8');

  const [currentHighlight, setCurrentHighlight] = useState(null);


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

  const handleWordClick = async (targetRectOrEvent, rawWord, dragRange = null, origin = 'en', sIdx = 0) => {
    if (targetRectOrEvent && typeof targetRectOrEvent.stopPropagation === 'function') {
      targetRectOrEvent.stopPropagation();
    }
    const cleanWord = rawWord.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    if (!cleanWord) return;

    if (incrementDailyWords) incrementDailyWords();

    let rect;
    if (targetRectOrEvent && typeof targetRectOrEvent.getBoundingClientRect === 'function') {
      rect = targetRectOrEvent.getBoundingClientRect();
    } else if (targetRectOrEvent && targetRectOrEvent.bottom !== undefined) {
      rect = targetRectOrEvent;
    } else {
      rect = { bottom: 200, left: 200 };
    }

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

        if (dragRange) {
          setCurrentHighlight({
            start: dragRange.start,
            end: dragRange.end,
            origin: origin,
            english: origin === 'en' ? rawWord : data.translation,
            turkish: origin === 'en' ? data.translation : rawWord,
            sentenceIdx: sIdx
          });
        }

        // Add to history
        setTranslationHistory(prev => {
          const keyWord = origin === 'en' ? cleanWord : data.translation.toLowerCase();
          const trWord = origin === 'en' ? data.translation : cleanWord;
          const filtered = prev.filter(item => item.english.toLowerCase() !== keyWord);
          return [{ english: keyWord, turkish: trWord }, ...filtered].slice(0, 10);
        });
      } else {
        setTranslationText('Çeviri bulunamadı.');
      }
    } catch (e) {
      setTranslationText('Çeviri hatası.');
    }
  };

  const handleDragEnd = async (event) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (dragStartIdx !== null && dragEndIdx !== null) {
      const start = Math.min(dragStartIdx, dragEndIdx);
      const end = Math.max(dragStartIdx, dragEndIdx);
      
      const passageText = dragOrigin === 'tr' ? (selectedPassage.translation || "") : selectedPassage.passage;
      const passageWords = passageText.split(/\s+/);
      const selectedPhraseWords = [];
      for (let i = start; i <= end; i++) {
        if (passageWords[i] !== undefined) {
          selectedPhraseWords.push(passageWords[i]);
        }
      }
      
      const selectedPhrase = selectedPhraseWords.join(' ');
      if (selectedPhrase.trim().length >= 2 || (start === end && selectedPhrase.trim().length > 0)) {
        const spanId = dragOrigin === 'tr' ? `tr-word-span-${dragEndIdx}` : `word-span-${dragEndIdx}`;
        const endSpan = document.getElementById(spanId);
        const rect = endSpan ? endSpan.getBoundingClientRect() : { bottom: event.clientY, left: event.clientX };
        handleWordClick(rect, selectedPhrase, { start, end }, dragOrigin || 'en', dragSentenceIdx);
      }
    }
    
    setDragStartIdx(null);
    setDragEndIdx(null);
    setDragOrigin(null);
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

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const checkEnglishWordMatch = (wordWithPunctuation, englishTranslation) => {
    if (!englishTranslation) return false;
    const cleanWord = wordWithPunctuation.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "");
    const cleanH = englishTranslation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "").trim();

    if (cleanH.includes(' ')) {
      const phraseWords = cleanH.split(/\s+/);
      return phraseWords.some(pw => {
        if (cleanWord === pw) return true;
        if (cleanWord.startsWith(pw) || pw.startsWith(cleanWord)) {
          return cleanWord.length >= 3 && pw.length >= 3;
        }
        return false;
      });
    }

    if (cleanWord === cleanH) return true;
    if (cleanWord.startsWith(cleanH) || cleanH.startsWith(cleanWord)) {
      return cleanWord.length >= 3 && cleanH.length >= 3;
    }
    return false;
  };

  const checkTurkishWordMatch = (wordWithPunctuation, turkishTranslation) => {
    if (!turkishTranslation) return false;
    const cleanWord = wordWithPunctuation.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "");
    const cleanH = turkishTranslation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "").trim();

    if (cleanH.includes(' ')) {
      const phraseWords = cleanH.split(/\s+/);
      return phraseWords.some(pw => {
        if (cleanWord === pw) return true;
        if (cleanWord.startsWith(pw) || pw.startsWith(cleanWord)) {
          return cleanWord.length >= 3 && pw.length >= 3;
        }
        return false;
      });
    }

    if (cleanWord === cleanH) return true;
    if (cleanWord.startsWith(cleanH) || cleanH.startsWith(cleanWord)) {
      return cleanWord.length >= 3 && cleanH.length >= 3;
    }

    if (cleanH.length >= 4 && cleanWord.length >= 4) {
      const rootH = cleanH.substring(0, 3);
      const rootWord = cleanWord.substring(0, 3);
      if (rootH === rootWord) {
        return Math.abs(cleanWord.length - cleanH.length) <= 3;
      }
    }
    return false;
  };

  const renderHighlightText = (text, highlightObj) => {
    if (!highlightObj || !highlightObj.turkish || highlightObj.turkish.length < 2) return text;
    
    const turkishTranslation = highlightObj.turkish;
    if (turkishTranslation.includes('Çeviri bulunamadı') || turkishTranslation.includes('Mevcut Değil')) return text;

    // Split text into tokens by spaces to preserve exact layout
    const parts = text.split(/(\s+)/);

    return parts.map((part, idx) => {
      if (part.trim() === '') return part;

      // Isolate punctuation from word characters (supports Turkish characters and hyphenated words)
      const matchWord = part.match(/^([a-zA-Z0-9çğıöşüÇĞİÖŞÜ'-]+)(.*)$/);
      if (!matchWord) return part;

      const wordOnly = matchWord[1];
      const punctuation = matchWord[2];
      const cleanWord = wordOnly.toLowerCase().trim();
      const cleanH = turkishTranslation.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()']/g, "").trim();

      let isMatch = false;

      // Multi-word phrase matches: check if the phrase contains this word
      if (cleanH.includes(' ')) {
        const phraseWords = cleanH.split(/\s+/);
        isMatch = phraseWords.some(pw => {
          if (cleanWord === pw) return true;
          if (cleanWord.startsWith(pw) || pw.startsWith(cleanWord)) {
            return cleanWord.length >= 3 && pw.length >= 3;
          }
          return false;
        });
      } else {
        // Single word matches
        if (cleanWord === cleanH) isMatch = true;
        else if (cleanWord.startsWith(cleanH) || cleanH.startsWith(cleanWord)) {
          isMatch = cleanWord.length >= 3 && cleanH.length >= 3;
        } else if (cleanH.length >= 4 && cleanWord.length >= 4) {
          // Fuzzy root match for Turkish vowel drops / suffix changes (e.g. keşif -> keşfi)
          const rootH = cleanH.substring(0, 3);
          const rootWord = cleanWord.substring(0, 3);
          if (rootH === rootWord) {
            isMatch = Math.abs(cleanWord.length - cleanH.length) <= 3;
          }
        }
      }

      if (isMatch) {
        return (
          <React.Fragment key={idx}>
            <span 
              style={{ 
                background: 'rgba(16, 185, 129, 0.35)', 
                border: '1px solid #10b981', 
                color: 'white', 
                padding: '2px 4px', 
                borderRadius: '4px', 
                fontWeight: 'bold',
                boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s',
                display: 'inline'
              }}
            >
              {wordOnly}
            </span>
            {punctuation}
          </React.Fragment>
        );
      }

      return part;
    });
  };

  // Helper to tokenize passage sentences into clickable word tags (English)
  const renderInteractivePassage = (text, startWordOffset) => {
    const sentences = text.split(/(?<=[.?!])\s+/);
    let wordIdxCounter = startWordOffset;

    return sentences.flatMap((sentence, sIdx) => {
      const sentenceWords = sentence.split(/\s+/).filter(Boolean);
      const sentenceStartIdx = wordIdxCounter;
      wordIdxCounter += sentenceWords.length;

      return sentenceWords.map((word, wIdx) => {
        const globalIdx = sentenceStartIdx + wIdx;
        
        // 1. Check if currently dragging
        let isHighlighted = false;
        if (dragStartIdx !== null && dragEndIdx !== null && dragOrigin === 'en') {
          const min = Math.min(dragStartIdx, dragEndIdx);
          const max = Math.max(dragStartIdx, dragEndIdx);
          isHighlighted = globalIdx >= min && globalIdx <= max;
        }
        
        // 2. Check if part of the current highlight
        let isSavedHighlight = false;
        if (currentHighlight) {
          if (currentHighlight.origin === 'en') {
            isSavedHighlight = globalIdx >= currentHighlight.start && globalIdx <= currentHighlight.end;
          } else if (currentHighlight.origin === 'tr') {
            isSavedHighlight = sIdx === currentHighlight.sentenceIdx && checkEnglishWordMatch(word, currentHighlight.english);
          }
        }
        
        let style = {
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          padding: '2px 3px',
          borderRadius: '4px',
          display: 'inline',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        };

        if (isHighlighted) {
          style.background = 'rgba(99, 102, 241, 0.4)';
          style.color = '#a5b4fc';
          style.border = '1px dashed #818cf8';
        } else if (isSavedHighlight) {
          style.background = 'rgba(99, 102, 241, 0.25)';
          style.border = '1px solid #818cf8';
          style.color = '#e0e7ff';
          style.fontWeight = 'bold';
        }

        return (
          <React.Fragment key={`${sIdx}-${wIdx}`}>
            <span
              id={`word-span-${globalIdx}`}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setDragStartIdx(globalIdx);
                setDragEndIdx(globalIdx);
                setDragOrigin('en');
                setDragSentenceIdx(sIdx);
              }}
              onMouseEnter={() => {
                if (isDragging && dragOrigin === 'en') {
                  setDragEndIdx(globalIdx);
                }
              }}
              style={style}
            >
              {word}
            </span>
            {' '}
          </React.Fragment>
        );
      });
    });
  };

  // Helper to tokenize comparison sentences into clickable word tags (Turkish)
  const renderInteractiveTurkishPassage = (text, startWordOffset) => {
    const sentences = text.split(/(?<=[.?!])\s+/);
    let wordIdxCounter = startWordOffset;

    return sentences.flatMap((sentence, sIdx) => {
      const sentenceWords = sentence.split(/\s+/).filter(Boolean);
      const sentenceStartIdx = wordIdxCounter;
      wordIdxCounter += sentenceWords.length;

      return sentenceWords.map((word, wIdx) => {
        const globalIdx = sentenceStartIdx + wIdx;
        
        // 1. Check if currently dragging
        let isHighlighted = false;
        if (dragStartIdx !== null && dragEndIdx !== null && dragOrigin === 'tr') {
          const min = Math.min(dragStartIdx, dragEndIdx);
          const max = Math.max(dragStartIdx, dragEndIdx);
          isHighlighted = globalIdx >= min && globalIdx <= max;
        }
        
        // 2. Check if part of the current highlight
        let isSavedHighlight = false;
        if (currentHighlight) {
          if (currentHighlight.origin === 'tr') {
            isSavedHighlight = globalIdx >= currentHighlight.start && globalIdx <= currentHighlight.end;
          } else if (currentHighlight.origin === 'en') {
            isSavedHighlight = sIdx === currentHighlight.sentenceIdx && checkTurkishWordMatch(word, currentHighlight.turkish);
          }
        }
        
        let style = {
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          padding: '2px 3px',
          borderRadius: '4px',
          display: 'inline',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        };

        if (isHighlighted) {
          style.background = 'rgba(16, 185, 129, 0.4)';
          style.color = '#a7f3d0';
          style.border = '1px dashed #10b981';
        } else if (isSavedHighlight) {
          style.background = 'rgba(16, 185, 129, 0.25)';
          style.border = '1px solid #10b981';
          style.color = '#ecfdf5';
          style.fontWeight = 'bold';
        }

        return (
          <React.Fragment key={`${sIdx}-${wIdx}`}>
            <span
              id={`tr-word-span-${globalIdx}`}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
                setDragStartIdx(globalIdx);
                setDragEndIdx(globalIdx);
                setDragOrigin('tr');
                setDragSentenceIdx(sIdx);
              }}
              onMouseEnter={() => {
                if (isDragging && dragOrigin === 'tr') {
                  setDragEndIdx(globalIdx);
                }
              }}
              style={style}
            >
              {word}
            </span>
            {' '}
          </React.Fragment>
        );
      });
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
    <div style={{ position: 'relative' }} onClick={(e) => {
      if (e.target.id && e.target.id.startsWith('word-span-')) {
        return;
      }
      setTranslatedWord(null);
    }}>
      {/* Translation Sidebar Card (Fixed to Bottom-Right) */}
      {translatedWord && (
        <div 
          className="translation-sidebar-card"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontWeight: 'bold', color: '#818cf8', fontSize: '1rem', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")}
              </span>
              <button 
                onClick={() => playSpeechAudio && playSpeechAudio(translatedWord)}
                style={{ background: 'rgba(99,102,241,0.1)', border: 'none', color: '#818cf8', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Sesli Oku"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <button 
              onClick={() => setTranslatedWord(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0 4px', fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
          <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.5 }}>
            {translationText}
          </p>
          {notebook && handleAddCustomWord && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.72rem',
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
                    setTranslatedWord(null);
                    setTranslationText('');
                    setCurrentHighlight(null);
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
                setCurrentHighlight(null);
              }}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              ← Paragraf Listesine Dön
            </button>

            <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 'bold', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '4px 10px', borderRadius: '8px' }}>
              📖 İngilizce - Türkçe Karşılaştırmalı Okuma
            </span>
          </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* The Unified Double-Page Book Card */}
            <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              
              {/* Book Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Akademik Metin Analizi ({selectedPassage.wordCount} Kelime)</span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>{selectedPassage.title}</h3>
                </div>
                
                {/* Okuma Modu Ayarları Barı */}
                <div className="flex items-center gap-3 py-1 px-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300" style={{ fontSize: '0.72rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#818cf8' }}>Yazı Boyutu:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => {
                        const nextVal = Math.max(0.75, parseFloat(readFontSize) - 0.05).toFixed(2);
                        setReadFontSize(nextVal);
                        localStorage.setItem('yokdil_read_fontsize', nextVal);
                      }}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-bold transition-all cursor-pointer"
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
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-xs font-bold transition-all cursor-pointer"
                    >
                      A+
                    </button>
                  </div>
                </div>
              </div>

              {/* Book Content - Side-by-Side Paragraph-aligned Book Reader */}
              <div 
                onMouseUp={handleDragEnd} 
                onMouseLeave={() => {
                  if (isDragging) {
                    setIsDragging(false);
                    setDragStartIdx(null);
                    setDragEndIdx(null);
                  }
                }}
                style={{ 
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              >
                {(() => {
                  const enParas = selectedPassage.passage.split('\n').filter(Boolean);
                  const trParas = (selectedPassage.translation || "").split('\n').filter(Boolean);
                  let wordOffset = 0;
                  let trWordOffset = 0;

                  return enParas.map((para, idx) => {
                    const currentOffset = wordOffset;
                    const wordCount = para.split(/\s+/).length;
                    wordOffset += wordCount;

                    const trPara = trParas[idx] || "";
                    const trOffset = trWordOffset;
                    const trWordCount = trPara.split(/\s+/).length;
                    trWordOffset += trWordCount;

                    return (
                      <div key={idx} className="comparative-grid-row">
                        
                        {/* Left Page (English) */}
                        <div className="comparative-column" style={{ fontSize: `${readFontSize}rem`, lineHeight: readLineHeight, color: '#e2e8f0', textAlign: 'justify' }}>
                          <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 'bold', color: '#818cf8', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.8 }}>[Paragraf {idx + 1}]</span>
                          {renderInteractivePassage(para, currentOffset)}
                        </div>

                        {/* Middle Visual Spine line */}
                        <div className="hidden md:block" style={{ width: '1px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.08), rgba(255,255,255,0.03))' }} />

                        {/* Right Page (Turkish) */}
                        <div className="comparative-column" style={{ fontSize: `${readFontSize}rem`, lineHeight: readLineHeight, color: '#94a3b8', textAlign: 'justify', fontStyle: 'italic' }}>
                          <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', marginBottom: '6px', opacity: 0.8 }}>[Türkçe Karşılaştırma]</span>
                          {renderInteractiveTurkishPassage(trPara, trOffset)}
                        </div>

                      </div>
                    );
                  });
                })()}
              </div>

              <div style={{ background: 'rgba(99,102,241,0.03)', border: '1px solid rgba(99,102,241,0.08)', padding: '12px 18px', borderRadius: '12px', fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
                💡 <span style={{ textAlign: 'left' }}>Çevirmek istediğiniz kelimeye tıklayabilir veya farenizle sürükleyip bırakarak kelime gruplarını doğrudan kalıp olarak çevirebilirsiniz.</span>
              </div>
            </div>

            {/* Bottom Row: Translation History & Mark Completed Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Translation History Box */}
              {translationHistory.length > 0 && (
                <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(251, 146, 60, 0.15)', textAlign: 'left', background: 'rgba(15, 23, 42, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fb923c', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      📖 Bu Okuma Metninden Çevrilen Kelimeler ({translationHistory.length})
                    </h4>
                    <button 
                      onClick={() => setTranslationHistory([])}
                      className="btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.65rem', cursor: 'pointer' }}
                    >
                      Geçmişi Temizle
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', maxHeight: '160px', overflowY: 'auto', paddingRight: '4px' }}>
                    {translationHistory.map((item, index) => (
                      <div key={index} style={{ fontSize: '0.72rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontWeight: 'bold', color: '#e2e8f0' }}>{item.english}</span>
                        <span style={{ color: '#34d399', fontWeight: 'bold' }}>{item.turkish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mark as Completed Button */}
              <button
                onClick={() => {
                  const isAlreadyCompleted = completedPassages.includes(selectedPassage.id);
                  if (!isAlreadyCompleted) {
                    const newList = [...completedPassages, selectedPassage.id];
                    setCompletedPassages(newList);
                    localStorage.setItem('completed_passages', JSON.stringify(newList));
                    
                    // Award XP and log activity
                    if (awardPetXp) awardPetXp(120);
                    if (logStudyActivity) {
                      logStudyActivity('reading', 120, `Okuma: ${selectedPassage.title}`);
                    }
                  }
                  setSelectedPassage(null);
                  setCurrentHighlight(null);
                }}
                className="btn-primary"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  background: completedPassages.includes(selectedPassage.id) 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  border: completedPassages.includes(selectedPassage.id) ? '1px solid #10b981' : 'none',
                  color: completedPassages.includes(selectedPassage.id) ? '#34d399' : 'white',
                  boxShadow: completedPassages.includes(selectedPassage.id) ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {completedPassages.includes(selectedPassage.id) ? '✓ Okuma Çalışması Tamamlandı' : 'Okumayı Bitir ve Seviye XP Kazan! ⚡'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParagraphsSection;
