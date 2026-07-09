import React from 'react';
import { CheckCircle } from 'lucide-react';

export const VocabularySentenceBuilder = ({
  sbList,
  sbIndex,
  sbSelected,
  setSbSelected,
  sbScrambled,
  sbChecked,
  sbResult,
  handleSbDontKnow,
  handleCheckSentence,
  handleNextSentence,
  setSubTab,
  ALL_SENTENCES
}) => {
  return (
    <div className="space-y-4">
      {sbList.length > 0 && sbIndex < sbList.length ? (
        (() => {
          const currentWord = sbList[sbIndex];
          const sentenceObj = ALL_SENTENCES[(currentWord.english || '').toLowerCase()] || {};
          return (
            <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-5 text-left">
              <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>🧩 CÜMLE KURMA OYUNU</span>
                <span>Soru {sbIndex + 1} / {sbList.length}</span>
              </div>

              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Türkçe Anlamı:</h4>
                <p style={{ fontSize: '0.85rem', color: 'white', margin: 0, fontWeight: '700' }}>"{sentenceObj.tr || currentWord.turkish || ''}"</p>
              </div>

              {/* Built sentence area */}
              <div style={{ minHeight: '60px', padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {sbSelected.map((word, idx) => (
                  <span
                    key={idx}
                    onClick={() => {
                      if (!sbChecked) {
                        setSbSelected(prev => prev.filter((_, i) => i !== idx));
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold cursor-pointer hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-300 transition-all"
                  >
                    {word}
                  </span>
                ))}
                {sbSelected.length === 0 && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Kelimeleri sıralamak için aşağıdaki bloklara tıklayın...</span>
                )}
              </div>

              {/* Scrambled word tags options */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px 0' }}>
                {sbScrambled.map((word, idx) => {
                  const selectedCount = sbSelected.filter(w => w === word).length;
                  const scrambledCount = sbScrambled.filter(w => w === word).length;
                  const isSelected = selectedCount >= scrambledCount;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!sbChecked && !isSelected) {
                          setSbSelected(prev => [...prev, word]);
                        }
                      }}
                      className={`word-tag-btn ${isSelected ? 'tag-selected' : ''}`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {sbChecked && (
                <div className="space-y-2">
                  <div className={`p-4 border rounded-2xl text-xs font-semibold ${
                    sbResult === 'correct' 
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                      : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                  }`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>{sbResult === 'correct' ? '✔️ Harika, Doğru Cümle Yapısı!' : '❌ Sıralamada hata var!'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      Doğru Cümle: <strong>{sentenceObj.en || currentWord.english || ''}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center flex-wrap gap-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  onClick={() => setSbSelected([])}
                  disabled={sbChecked || sbSelected.length === 0}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Temizle
                </button>

                {!sbChecked ? (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleSbDontKnow}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
                    >
                      Bilmiyorum 🤷‍♂️
                    </button>
                    <button
                      onClick={handleCheckSentence}
                      disabled={sbSelected.length === 0}
                      className="btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Kontrol Et
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleNextSentence}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {sbIndex < sbList.length - 1 ? 'Sonraki Cümle ➡️' : 'Oyunu Bitir 🏁'}
                  </button>
                )}
              </div>
            </div>
          );
        })()
      ) : (
        <div className="glass-card p-6 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl space-y-4">
          <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-100">Tebrikler! Cümle kurma oyununu tamamladınız.</h4>
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

export const VocabularyDuel = ({
  duelActive,
  duelTime,
  duelScore,
  handleStartDuel,
  duelEngList,
  duelTrList,
  duelCompletedPairs,
  duelSelectedEng,
  duelSelectedTr,
  handleSelectDuelCard
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'white', margin: 0 }}>⚡ Zamana Karşı Kelime Düellosu</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Kelimeleri Türkçe karşılıkları ile en hızlı şekilde eşleştirin. Her doğru eşleştirme +10 Puan kazandırır.
            </p>
          </div>
          {duelActive && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '10px', color: '#f87171', fontSize: '0.8rem', fontWeight: 'bold' }}>
                ⏱️ {duelTime} sn
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '10px', color: '#34d399', fontSize: '0.8rem', fontWeight: 'bold' }}>
                🏆 {duelScore} Puan
              </div>
            </div>
          )}
        </div>

        {!duelActive ? (
          <div className="text-center py-6 space-y-4">
            <div style={{ fontSize: '3rem' }}>⚡</div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>Düelloya Hazır mısın?</h4>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              30 saniye içinde en çok eşleştirmeyi yapın. Defterinizdeki kelimeler karıştırılarak karşınıza çıkacaktır.
            </p>
            <button
              onClick={handleStartDuel}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Oyunu Başlat 🚀
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'stretch' }}>
            {/* English Column */}
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>İngilizce Kelimeler</div>
              {duelEngList.map(card => {
                const isMatched = duelCompletedPairs.includes(card.id);
                const isSelected = duelSelectedEng === card.id;
                if (isMatched) return null;
                
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectDuelCard('eng', card.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-bold text-xs ${
                      isSelected ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-white/2 border-white/5 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {card.val}
                  </button>
                );
              })}
            </div>

            {/* Turkish Column */}
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>Türkçe Anlamları</div>
              {duelTrList.map(card => {
                const isMatched = duelCompletedPairs.includes(card.id);
                const isSelected = duelSelectedTr === card.id;
                if (isMatched) return null;
                
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectDuelCard('tr', card.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer font-bold text-xs ${
                      isSelected ? 'bg-amber-600/20 border-amber-500 text-amber-300' : 'bg-white/2 border-white/5 text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {card.val}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {duelActive && duelCompletedPairs.length === 5 && (
          <div className="text-center py-4 space-y-2">
            <p style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 'bold' }}>Tebrikler! Tüm kelimeleri eşleştirdiniz.</p>
            <button
              onClick={handleStartDuel}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}
            >
              Yeni Tur Yükle 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
