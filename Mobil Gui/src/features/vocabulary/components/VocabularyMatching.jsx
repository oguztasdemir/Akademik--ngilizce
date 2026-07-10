import React from 'react';
import { CheckCircle, RefreshCw } from 'lucide-react';

const VocabularyMatching = ({
  matchMode,
  setMatchMode,
  matchLeft,
  matchRight,
  matchedWords,
  activeLeft,
  activeRight,
  matchErrors,
  handleMatchSelect,
  getMatchBtnStyle,
  startMatchingGame
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-[10px] text-slate-400" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Kelime Eşleştirme (5 Çift - Mobil Uyumlu 📱)</span>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '8px' }}>
        <button
          onClick={() => { setMatchMode('turkish'); }}
          style={{
            flex: 1,
            padding: '8px 14px',
            fontSize: '0.72rem',
            fontWeight: '800',
            borderRadius: '10px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            border: matchMode === 'turkish' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.05)',
            background: matchMode === 'turkish' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: matchMode === 'turkish' ? '#34d399' : 'var(--text-secondary)'
          }}
        >
          🇹🇷 İngilizce - Türkçe
        </button>
        <button
          onClick={() => { setMatchMode('synonym'); }}
          style={{
            flex: 1,
            padding: '8px 14px',
            fontSize: '0.72rem',
            fontWeight: '800',
            borderRadius: '10px',
            transition: 'all 0.25s ease',
            cursor: 'pointer',
            border: matchMode === 'synonym' ? '1px solid #8b5cf6' : '1px solid rgba(255,255,255,0.05)',
            background: matchMode === 'synonym' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
            color: matchMode === 'synonym' ? '#c084fc' : 'var(--text-secondary)'
          }}
        >
          🔄 Eş Anlamlı (Synonym)
        </button>
      </div>

      {/* Grid structured with clear side-by-side columns and row separation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
        {/* Left Column: English Words */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 12px', borderRadius: '10px', color: '#a5b4fc', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
            🇬🇧 İngilizce
          </div>
          {matchLeft.map(item => {
            const isMatched = matchedWords.has(item.id);
            const isActive = activeLeft?.id === item.id;
            const isErr = matchErrors.has(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => handleMatchSelect(item, 'left')}
                style={getMatchBtnStyle(isMatched, isActive, isErr, 'left')}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Right Column: Turkish Meanings / Synonyms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: matchMode === 'synonym' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: matchMode === 'synonym' ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '10px', color: matchMode === 'synonym' ? '#c084fc' : '#34d399', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
            {matchMode === 'synonym' ? '🔄 Eş Anlamlısı' : '🇹🇷 Karşılığı'}
          </div>
          {matchRight.map(item => {
            const isMatched = matchedWords.has(item.id);
            const isActive = activeRight?.id === item.id;
            const isErr = matchErrors.has(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => handleMatchSelect(item, 'right')}
                style={getMatchBtnStyle(isMatched, isActive, isErr, 'right')}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      {matchedWords.size === 5 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="glass-card p-4 border border-emerald-500/20 bg-emerald-500/5 text-center rounded-2xl flex items-center justify-center gap-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }}>
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400" style={{ color: '#34d399' }}>Tebrikler! 5 kelimenin tamamını başarıyla eşleştirdiniz.</span>
          </div>
          <button
            onClick={() => startMatchingGame()}
            className="btn-primary animate-pulse"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.88rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            Sonraki 5 Kelimeye Geç ➡️
          </button>
        </div>
      ) : (
        <button 
          onClick={() => startMatchingGame()}
          className="btn-secondary"
          style={{ 
            width: '100%', 
            marginTop: '16px', 
            padding: '10px', 
            fontSize: '0.82rem', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '6px',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#cbd5e1',
            borderRadius: '10px'
          }}
        >
          <RefreshCw className="h-4 w-4" /> Kartları Yeniden Karıştır / Dağıt
        </button>
      )}
    </div>
  );
};

export default VocabularyMatching;
