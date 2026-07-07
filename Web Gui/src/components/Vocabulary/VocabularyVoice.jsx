import React from 'react';
import { Volume2, CheckCircle } from 'lucide-react';

export const VocabularyDictation = ({
  dictationList,
  dictationIndex,
  dictationInput,
  setDictationInput,
  dictationChecked,
  dictationResult,
  handleCheckDictation,
  handleNextDictation,
  playSpeechAudio,
  setSubTab
}) => {
  return (
    <div className="space-y-4">
      {dictationList.length > 0 && dictationIndex < dictationList.length ? (
        (() => {
          const currentWord = dictationList[dictationIndex];
          return (
            <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🎧 DİKTE (DINLE VE YAZ)</span>
                <span>Soru {dictationIndex + 1} / {dictationList.length}</span>
              </div>

              <div className="text-center py-6 space-y-4">
                <button
                  onClick={() => {
                    if (playSpeechAudio) playSpeechAudio(currentWord.english);
                  }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/40 hover:scale-105 transition-all cursor-pointer"
                  title="Tekrar Dinle"
                >
                  <Volume2 className="h-6 w-6" />
                </button>
                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Telaffuzu duyduğunuz kelimeyi yazın:</p>
              </div>

              <input 
                type="text"
                placeholder="İngilizce kelimeyi buraya yazın..."
                value={dictationInput}
                onChange={(e) => {
                  if (!dictationChecked) {
                    setDictationInput(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && dictationInput.trim() && !dictationChecked) {
                    handleCheckDictation();
                  }
                }}
                disabled={dictationChecked}
                className="duo-input"
                style={{ width: '100%', padding: '12px 16px', fontSize: '0.9rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', color: 'white', outline: 'none' }}
              />

              {dictationChecked && (
                <div className="space-y-2">
                  <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                    dictationResult === 'correct' 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                      : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                  }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>{dictationResult === 'correct' ? '✔️ Harika, Doğru!' : `❌ Hata! Doğru yazılışı: ${currentWord.english}`}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      Türkçe Anlamı: <strong>{currentWord.turkish}</strong>
                    </div>
                    {currentWord.sentence_en && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                        "{currentWord.sentence_en}"
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!dictationChecked ? (
                  <button
                    onClick={handleCheckDictation}
                    disabled={!dictationInput.trim()}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Kontrol Et
                  </button>
                ) : (
                  <button
                    onClick={handleNextDictation}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {dictationIndex < dictationList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                  </button>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-100">Tebrikler! Dikte pratik testini tamamladınız.</h4>
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

export const VocabularyPronunciation = ({
  prList,
  prIndex,
  playSpeechAudio,
  startSpeechRecognitionPr,
  prListening,
  prScore,
  setPrScore,
  setPrIndex,
  setSubTab
}) => {
  return (
    <div className="space-y-4">
      {prList.length > 0 && prIndex < prList.length ? (
        (() => {
          const currentWord = prList[prIndex];
          return (
            <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5 text-center">
              <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🎙️ TELAFFUZ LABORATUVARI</span>
                <span>Soru {prIndex + 1} / {prList.length}</span>
              </div>

              <div className="py-4 space-y-2">
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', letterSpacing: '0.02em', margin: 0 }}>{currentWord.english}</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: '700', margin: 0 }}>{currentWord.turkish}</p>
              </div>

              <div className="flex justify-center gap-4 py-4" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button
                  onClick={() => {
                    if (playSpeechAudio) playSpeechAudio(currentWord.english);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
                  title="Örnek Telaffuzu Dinle"
                >
                  <Volume2 className="h-5 w-5" />
                </button>

                <button
                  onClick={startSpeechRecognitionPr}
                  disabled={prListening}
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-all cursor-pointer ${
                    prListening 
                      ? 'bg-rose-600/30 border border-rose-500 text-rose-400 animate-pulse' 
                      : 'bg-indigo-600 border border-indigo-500 text-white hover:scale-105 shadow-lg shadow-indigo-600/20'
                  }`}
                  style={{ fontSize: '1.4rem' }}
                  title="Mikrofonu Aç ve Konuş"
                >
                  <i className="fa-solid fa-microphone"></i>
                </button>
              </div>

              {prListening && (
                <p style={{ fontSize: '0.7rem', color: '#f43f5e', fontWeight: 'bold' }}>Dinleniyor... Şimdi konuşun.</p>
              )}

              {prScore !== null && (
                <div className="space-y-2">
                  <div className={`p-4 border rounded-2xl text-xs font-semibold max-w-xs mx-auto ${
                    prScore >= 70 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                      : 'border-amber-500/20 bg-amber-500/5 text-amber-400'
                  }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '0 auto' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '900' }}>Telaffuz Skoru: {prScore} / 100</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      {prScore >= 90 ? '🥇 Kusursuz Telaffuz!' : prScore >= 70 ? '✔️ Çok İyi, Anlaşılır!' : '⚠️ Biraz daha gayret! Tekrar deneyin.'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setPrScore(null);
                    setPrIndex(prev => prev + 1);
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {prIndex < prList.length - 1 ? 'Sonraki Kelime ➡️' : 'Pratiği Bitir 🏁'}
                </button>
              </div>
            </div>
          );
        })()
      ) : (
        <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-100">Tebrikler! Telaffuz pratiğini tamamladınız.</h4>
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
