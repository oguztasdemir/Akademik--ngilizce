import React from 'react';
import { Trash2, Star, X, Mic, Volume2 } from 'lucide-react';

const VocabularyListView = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  showAddForm,
  setShowAddForm,
  customEnglish,
  setCustomEnglish,
  customTurkish,
  setCustomTurkish,
  handleAddCustomWord,
  filteredWords,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  setDrawerWord,
  setPronunciationScore,
  incrementDailyWords,
  handleToggleWordStatus,
  handleDeleteFromNotebook,
  formatWordType
}) => {
  return (
    <div className="space-y-4">
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <input 
            type="text"
            placeholder="Kelime ara (İngilizce veya Türkçe)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="duo-input"
            style={{ width: '100%', padding: '10px 36px 10px 14px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)', color: 'white', outline: 'none' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Aramayı Temizle"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="duo-input"
          style={{ padding: '10px', fontSize: '0.8rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white', outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">Tüm Durumlar</option>
          <option value="learning">Çalışıyorum</option>
          <option value="learned">Öğrendim</option>
        </select>

        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-secondary"
          style={{ padding: '10px 14px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {showAddForm ? 'Kapat' : '✍️ Yeni Kelime Ekle'}
        </button>
      </div>

      {/* Add custom word form */}
      {showAddForm && (
        <div className="glass-card p-4 border border-white/5 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              placeholder="İngilizce Kelime"
              value={customEnglish}
              onChange={(e) => setCustomEnglish(e.target.value)}
              className="duo-input"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white' }}
            />
            <input 
              type="text"
              placeholder="Türkçe Anlamı"
              value={customTurkish}
              onChange={(e) => setCustomTurkish(e.target.value)}
              className="duo-input"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', background: '#0d111c', color: 'white' }}
            />
          </div>
          <button 
            onClick={() => {
              if (customEnglish.trim() && customTurkish.trim()) {
                handleAddCustomWord(customEnglish, customTurkish);
                setCustomEnglish('');
                setCustomTurkish('');
                setShowAddForm(false);
              }
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Deftere Ekle
          </button>
        </div>
      )}

      {/* Word Table */}
      <div className="glass-card border border-white/5 rounded-2xl overflow-hidden vocab-table-card" style={{ maxWidth: '100%' }}>
        <div className="overflow-x-auto" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
          <table className="w-full border-collapse text-left" style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b border-white/5 bg-white/2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th 
                  onClick={() => { setSortField('english'); setSortOrder(p => p === 'asc' ? 'desc' : 'asc'); }}
                  className="p-3 text-[9px] uppercase font-bold text-slate-400 cursor-pointer"
                  style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}
                >
                  İngilizce Kelime {sortField === 'english' && (sortOrder === 'asc' ? '🔼' : '🔽')}
                </th>
                <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>Türkçe Anlamı</th>
                <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>Durum</th>
                <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filteredWords.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-white/5 hover:bg-white/1" 
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                  onClick={() => {
                    setDrawerWord(item);
                    setPronunciationScore(null);
                    if (incrementDailyWords) incrementDailyWords();
                  }}
                >
                  <td className="p-3 text-xs font-bold text-indigo-300" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.english || item.word}</td>
                  <td className="p-3 text-xs text-slate-200" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.turkish || item.meaning}</td>
                  <td className="p-3 text-xs text-center" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWordStatus(item.id);
                        }}
                        className="px-2.5 py-0.5 rounded text-[10px] font-bold"
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          background: item.status === 'learned' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: item.status === 'learned' ? '#34d399' : '#a5b4fc',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                      >
                        {item.status === 'learned' ? '✓ Öğrendim' : '📖 Çalışıyorum'}
                      </button>
                      <span style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}>
                        ⭐ Seviye: {item.leitnerStage || 1} / 5
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-center" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFromNotebook(item.id);
                      }}
                      className="text-slate-500 hover:text-rose-400"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredWords.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-xs text-slate-500" style={{ padding: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Arama kriterlerine uygun kelime bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VocabularyListView;
