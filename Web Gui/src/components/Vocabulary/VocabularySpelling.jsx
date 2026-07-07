import React from 'react';
import { CheckCircle, Volume2 } from 'lucide-react';

const VocabularySpelling = ({
  spellingList,
  spellingIndex,
  spellingInput,
  setSpellingInput,
  spellingChecked,
  spellingResult,
  handleCheckSpelling,
  handleSpellingDontKnow,
  handleNextSpelling,
  setSubTab,
  playSpeechAudio
}) => {
  return (
    <div className="space-y-4">
      {spellingList.length > 0 && spellingIndex < spellingList.length ? (
        (() => {
          const currentWord = spellingList[spellingIndex];
          return (
            <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>YAZMA TESTİ (Klavye Pratiği)</span>
                <span>Soru {spellingIndex + 1} / {spellingList.length}</span>
              </div>

              <div className="text-center py-4 space-y-2">
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Kelimenin Türkçe Anlamı:</p>
                <h3 className="text-xl font-bold text-indigo-400 font-heading" style={{ fontSize: '1.5rem', color: '#818cf8', margin: '6px 0 0 0' }}>
                  {currentWord.turkish}
                </h3>
              </div>

              <input 
                type="text"
                placeholder="İngilizce karşılığını yazın..."
                value={spellingInput}
                onChange={(e) => {
                  if (!spellingChecked) {
                    setSpellingInput(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && spellingInput.trim() && !spellingChecked) {
                    handleCheckSpelling();
                  }
                }}
                disabled={spellingChecked}
                className="duo-input"
                style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
              />

              {spellingChecked && (
                <div className="space-y-2">
                  <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                    spellingResult === 'correct' 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                      : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                  }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>{spellingResult === 'correct' ? '✔️ Harika, Doğru!' : `❌ Hata! Doğru yazılışı: ${currentWord.english}`}</div>
                    {currentWord.sentence_en && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                        "{currentWord.sentence_en}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                {!spellingChecked ? (
                  <>
                    <button
                      onClick={handleSpellingDontKnow}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
                    >
                      Bilmiyorum 🤷‍♂️
                    </button>
                    <button
                      onClick={handleCheckSpelling}
                      disabled={!spellingInput.trim()}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Kontrol Et
                    </button>
                  </>
                ) : (
                  <>
                    <div />
                    <button
                      onClick={handleNextSpelling}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      {spellingIndex < spellingList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-100">Tebrikler! Yazma testini tamamladınız.</h4>
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

export default VocabularySpelling;
