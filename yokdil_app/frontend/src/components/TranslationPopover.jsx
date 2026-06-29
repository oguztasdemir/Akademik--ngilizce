import React from 'react';
import { Volume2, Plus } from 'lucide-react';

const TranslationPopover = ({ 
  show, 
  position, 
  selectedText, 
  translating, 
  translationResult, 
  playSpeechAudio, 
  handleAddToNotebook, 
  setShowPopover 
}) => {
  if (!show) return null;

  return (
    <div 
      className="translation-popover"
      style={{ 
        left: `${Math.min(window.innerWidth - 300, Math.max(10, position.x - 140))}px`, 
        top: `${position.y - 120}px` 
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary-light)' }}>Çeviri Kutusu</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => playSpeechAudio(selectedText)}
            style={{ color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 6px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '0.8rem' }}
            title="Seslendir"
          >
            <i className="fa-solid fa-volume-high"></i>
          </button>
          <button 
            onClick={() => setShowPopover(false)}
            style={{ color: 'var(--text-main)', cursor: 'pointer', padding: '4px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}
          >
            Kapat
          </button>
        </div>
      </div>
      {translating ? (
        <div className="flex items-center gap-2 py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          <span className="text-xs text-slate-400">Aranıyor...</span>
        </div>
      ) : (
        <div>
          <div className="text-sm font-semibold text-slate-200">"{selectedText}"</div>
          <div className="mt-1 text-sm text-emerald-400 font-medium">
            {translationResult ? translationResult.translation : 'Kelime bulunamadı.'}
          </div>
          <button
            onClick={() => handleAddToNotebook(selectedText, translationResult?.translation)}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Deftere Kaydet</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TranslationPopover;
