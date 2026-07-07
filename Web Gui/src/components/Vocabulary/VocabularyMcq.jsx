import React from 'react';
import { Sparkles } from 'lucide-react';

const VocabularyMcq = ({
  mcqList,
  mcqFinished,
  mcqIndex,
  mcqOptions,
  mcqSelected,
  mcqChecked,
  mcqScore,
  mcqMode,
  SYNONYM_MAP,
  handleMcqSelect,
  getMcqBtnStyle,
  handleNextMcq,
  setSubTab
}) => {
  return (
    <div className="space-y-4">
      {mcqList.length > 0 && !mcqFinished ? (
        (() => {
          const currentWord = mcqList[mcqIndex];
          return (
            <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5">
              <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>ÇOKTAN SEÇMELİ TEST</span>
                <span>Soru {mcqIndex + 1} / {mcqList.length}</span>
              </div>

              <div className="text-center py-4 space-y-1">
                <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Kelimenin İngilizcesi:</p>
                <h3 className="text-2xl font-extrabold text-slate-100 font-heading tracking-wide" style={{ fontSize: '1.8rem', color: 'white', margin: '6px 0 0 0' }}>
                  {currentWord.english}
                </h3>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mcqOptions.map((opt) => {
                  const isSelected = mcqSelected === opt;
                  const correctVal = mcqMode === 'synonym'
                    ? (SYNONYM_MAP[(currentWord.english || '').toLowerCase().trim()] || currentWord.turkish)
                    : currentWord.turkish;
                  const isCorrectAnswer = opt === correctVal;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleMcqSelect(opt)}
                      disabled={mcqChecked}
                      style={getMcqBtnStyle(isSelected, isCorrectAnswer, mcqChecked)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {mcqChecked && (
                <div className="p-4 border rounded-2xl text-xs font-semibold" style={{
                  borderColor: mcqSelected === currentWord.turkish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  background: mcqSelected === currentWord.turkish ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  color: mcqSelected === currentWord.turkish ? '#34d399' : '#f87171'
                }}>
                  {mcqSelected === currentWord.turkish ? '✔️ Tebrikler, Doğru!' : `❌ Hata! Doğru anlamı: ${currentWord.turkish}`}
                </div>
              )}

               {mcqChecked && (
                <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleNextMcq}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {mcqIndex < mcqList.length - 1 ? 'Sonraki Soru ➡️' : 'Testi Bitir 🏁'}
                  </button>
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div className="glass-card p-6 border border-indigo-500/20 bg-indigo-500/5 text-center rounded-2xl space-y-4">
          <Sparkles className="h-8 w-8 text-indigo-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-100">Tebrikler! Çoktan seçmeli testi tamamladınız.</h4>
          <p className="text-xs text-slate-400">Skorunuz: <strong style={{ color: 'var(--primary-light)' }}>{mcqScore} / 10</strong></p>
          <button 
            onClick={() => setSubTab('flashcards')}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Kartlara Dön
          </button>
        </div>
      )}
    </div>
  );
};

export default VocabularyMcq;
