import React from 'react';

const VocabularyLeitner = ({
  pool,
  setDrawerWord
}) => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-5 border border-white/5 rounded-2xl">
        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '4px' }}>📦 Leitner Spaced Repetition (Aralıklı Tekrar)</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Ezberlediğiniz kelimeler doğru bildikçe sağdaki kutulara taşınır. Yanlış bilinen kelimeler en baştaki Kutu 1'e geri döner. Hedefiniz tüm kelimeleri Kutu 5'e ulaştırmaktır!
        </p>

        {/* Boxes shelf */}
        <div className="leitner-shelf">
          {[1, 2, 3, 4, 5].map(boxNum => {
            const wordsInBox = pool.filter(w => (w.leitnerBox || 1) === boxNum);
            
            return (
              <div key={boxNum} className="leitner-box-card">
                <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>
                  {boxNum === 5 ? '👑' : '📦'}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-main)' }}>Kutu {boxNum}</div>
                <div style={{ fontSize: '0.62rem', color: 'var(--primary-light)', fontWeight: 'bold', margin: '4px 0' }}>
                  {wordsInBox.length} Kelime
                </div>
                <div style={{ 
                  maxHeight: '120px', 
                  overflowY: 'auto', 
                  marginTop: '10px', 
                  borderTop: '1px solid rgba(255,255,255,0.05)', 
                  paddingTop: '8px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '4px',
                  alignItems: 'center' 
                }}>
                  {wordsInBox.map(w => (
                    <span 
                      key={w.id} 
                      className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 font-semibold cursor-pointer hover:bg-white/10"
                      onClick={() => setDrawerWord(w)}
                      title={w.turkish}
                    >
                      {w.english}
                    </span>
                  ))}
                  {wordsInBox.length === 0 && (
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)' }}>Boş</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VocabularyLeitner;
