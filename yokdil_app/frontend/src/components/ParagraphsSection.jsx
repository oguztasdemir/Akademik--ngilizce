import React, { useState, useEffect } from 'react';
import { BookOpen, Check, X, HelpCircle, ArrowRight, Volume2 } from 'lucide-react';

const ParagraphsSection = ({
  activeTab,
  selectedCategory,
  BACKEND_URL,
  incrementDailyQuestions,
  incrementDailyWords,
  playSpeechAudio
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

  useEffect(() => {
    if (activeTab === 'paragraphs' && BACKEND_URL) {
      setLoading(true);
      fetch(`${BACKEND_URL}/api/passages`)
        .then(res => res.json())
        .then(data => {
          // Filter by category or show all
          const filtered = data.filter(p => p.category === selectedCategory);
          setPassages(filtered);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error loading passages:", err);
          setLoading(false);
        });
    }
  }, [activeTab, selectedCategory, BACKEND_URL]);

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

  const handleSelectOption = (qId, option) => {
    if (checkedQuestions[qId]) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleCheckQuestion = (qObj) => {
    if (checkedQuestions[qObj.id]) return;
    if (!selectedAnswers[qObj.id]) return;

    if (incrementDailyQuestions) incrementDailyQuestions();

    const isCorrect = selectedAnswers[qObj.id] === qObj.answer;
    setCheckedQuestions(prev => ({ ...prev, [qObj.id]: true }));
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  // Helper to tokenize passage sentences into clickable word tags
  const renderInteractivePassage = (text) => {
    const words = text.split(/\s+/);
    return words.map((word, idx) => {
      const displayWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      return (
        <span
          key={idx}
          onClick={(e) => handleWordClick(e, word)}
          style={{
            cursor: 'pointer',
            transition: 'color 0.15s ease',
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
        }}>
          <div style={{ fontWeight: 'bold', color: '#818cf8', marginBottom: '2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{translatedWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")}</span>
            <button 
              onClick={() => playSpeechAudio && playSpeechAudio(translatedWord)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
            >
              <Volume2 className="h-3 w-3" />
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#f8fafc' }}>{translationText}</p>
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
            {passages.map(p => (
              <div 
                key={p.id}
                onClick={() => {
                  setSelectedPassage(p);
                  setSelectedAnswers({});
                  setCheckedQuestions({});
                  setScore(0);
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
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.15)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    color: '#a5b4fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white', margin: '0 0 2px 0' }}>{p.title}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>
                      3 Adet Okuduğunu Anlama Sorusu İçerir.
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* PASSAGE SPLIT COMPREHENSION SCREEN */
        <div className="space-y-4">
          <div className="glass-card flex items-center justify-between" style={{ padding: '12px 20px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setSelectedPassage(null)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
            >
              ← Paragraf Listesine Dön
            </button>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              Doğru Sayısı: {score} / 3
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
            {/* Left side: Passage details */}
            <div className="glass-card" style={{ flex: '1', minWidth: '320px', padding: '24px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(11, 15, 26, 0.6)' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Akademik Metin</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>{selectedPassage.title}</h3>
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: '1.8', color: '#cbd5e1', textAlign: 'justify', margin: 0 }}>
                {renderInteractivePassage(selectedPassage.passage)}
              </p>
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
