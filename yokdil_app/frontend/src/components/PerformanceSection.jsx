import React, { useState } from 'react';
import { Trophy, TrendingUp, ChevronLeft, Award } from 'lucide-react';

const PerformanceSection = ({
  activeTab,
  selectedExam,
  exams,
  answers,
  getStats,
  setActiveTab,
  wordStats = {},
  vocabPracticeList = [],
  notebook = []
}) => {
  const [perfTab, setPerfTab] = useState('tests'); // 'tests', 'vocabulary'

  if (activeTab !== 'performance') return null;

  const stats = getStats();
  const pool = notebook.length > 0 ? notebook : vocabPracticeList;

  // Filter words that have statistics recorded
  const testedWords = pool.filter(word => {
    const wStats = wordStats[word.english.toLowerCase()];
    return wStats && (wStats.correct > 0 || wStats.wrong > 0);
  });

  // Tab Styles
  const activeTabStyle = {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.8rem',
    fontWeight: '700',
    borderRadius: '12px',
    background: 'var(--primary-gradient)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.25)',
    transition: 'all 0.25s ease',
    border: 'none',
    cursor: 'pointer'
  };

  const inactiveTabStyle = {
    flex: 1,
    padding: '10px 16px',
    fontSize: '0.8rem',
    fontWeight: '600',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'all 0.25s ease',
    cursor: 'pointer'
  };

  // SVG circular progress calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const successPercentage = stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0;
  const offset = circumference - (successPercentage / 100) * circumference;

  return (
    <div className="space-y-4 text-left" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <style>{`
        @media print {
          .app-sidebar-desktop-custom, .app-sidebar-desktop, .app-header, .btn-primary, .btn-secondary, button, header, nav, aside, .change-course-btn-sidebar, .sidebar-footer {
            display: none !important;
          }
          body, .app-content-wrapper, .app-main, main, .app-content {
            background: white !important;
            color: black !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }
          .glass-card {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            color: #0f172a !important;
            box-shadow: none !important;
          }
          h2, h3, h4, p, span, td, th, div {
            color: #0f172a !important;
          }
        }
      `}</style>

      <div className="welcome-card text-left animate-fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ textAlign: 'left' }}>
          <h2>Gelişim Analiz Paneli 📊</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Çözdüğünüz testlerin başarı oranlarını ve çalıştığınız kelimelerin istatistiklerini izleyin.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          🖨️ Karneyi Yazdır / PDF Kaydet
        </button>
      </div>

      {/* Sub-Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '6px', 
        background: 'rgba(255, 255, 255, 0.02)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.05)',
        marginBottom: '16px'
      }}>
        <button 
          onClick={() => setPerfTab('tests')}
          style={perfTab === 'tests' ? activeTabStyle : inactiveTabStyle}
        >
          📝 Test Performansı
        </button>
        <button 
          onClick={() => setPerfTab('vocabulary')}
          style={perfTab === 'vocabulary' ? activeTabStyle : inactiveTabStyle}
        >
          📇 Kelime Performansı
        </button>
      </div>

      {/* SUBTAB 1: TEST PERFORMANCE */}
      {perfTab === 'tests' && (
        <div className="space-y-4">
          
          {/* Main Visual SVG Circular Progress & Numeric Stats Row */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            background: 'rgba(18, 24, 41, 0.45)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '20px', 
            padding: '20px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* SVG Circular Progress Gauge */}
            <div style={{ position: 'relative', width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.2))' }}>
                <circle cx="55" cy="55" r={radius} stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="55"
                  cy="55"
                  r={radius}
                  stroke="url(#perfGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
                <defs>
                  <linearGradient id="perfGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-heading)' }}>%{successPercentage}</span>
                <span style={{ fontSize: '0.52rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Başarı</span>
              </div>
            </div>

            {/* Numeric Info Stats */}
            <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Trophy size={16} className="text-amber-400" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Toplam Çözülen Soru</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>{stats.solved}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '8px' }}>✓</div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Doğru Sayısı</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#34d399' }}>{stats.correct}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={16} className="text-rose-400" />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Yanlış Sayısı</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#f87171' }}>{stats.wrong}</span>
              </div>
            </div>
          </div>

          {/* Weakness Topic Analytics */}
          <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5" style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '15px' }}>
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              <span>Konu Başlığı Başarı Analizi</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(stats.topics).map(([key, item]) => {
                const accuracy = item.solved > 0 ? ((item.correct / item.solved) * 100).toFixed(0) : 0;
                const isWeak = item.solved > 0 && accuracy < 60;
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '600' }}>{item.name}</span>
                      <span style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: '700', 
                        color: isWeak ? '#f87171' : '#e2e8f0' 
                      }}>
                        {item.correct} / {item.solved} ({accuracy}%)
                      </span>
                    </div>
                    
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden" style={{ height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${accuracy}%`, 
                          height: '100%', 
                          background: isWeak ? 'linear-gradient(90deg, #ef4444, #f87171)' : 'linear-gradient(90deg, #6366f1, #10b981)',
                          borderRadius: '4px',
                          transition: 'all 0.5s ease'
                        }}
                      ></div>
                    </div>
                    
                    {isWeak && item.name !== "Cümle/Paragraf (Reading/Clauses)" && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button 
                          onClick={() => setActiveTab('lectures')}
                          className="btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            borderRadius: '6px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            color: '#a5b4fc',
                            cursor: 'pointer'
                          }}
                        >
                          Konuyu Çalış &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: VOCABULARY PERFORMANCE TABLE */}
      {perfTab === 'vocabulary' && (
        <div className="space-y-3">
          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b border-white/5 bg-white/2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>Kelime</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>Türkçe Anlamı</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>Doğru</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>Yanlış</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '12px 16px', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center' }}>Başarı %</th>
                  </tr>
                </thead>
                <tbody>
                  {testedWords.map((item) => {
                    const wStats = wordStats[item.english.toLowerCase()] || { correct: 0, wrong: 0 };
                    const total = wStats.correct + wStats.wrong;
                    const accuracy = total > 0 ? Math.round((wStats.correct / total) * 100) : 0;
                    
                    return (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td className="p-3 text-xs font-bold text-indigo-300" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.english}</td>
                        <td className="p-3 text-xs text-slate-200" style={{ padding: '12px 16px', fontSize: '0.8rem' }}>{item.turkish}</td>
                        <td className="p-3 text-xs text-center font-mono font-bold" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center', color: '#34D399' }}>
                          {wStats.correct}
                        </td>
                        <td className="p-3 text-xs text-center font-mono font-bold" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center', color: '#F87171' }}>
                          {wStats.wrong}
                        </td>
                        <td className="p-3 text-xs text-center font-bold" style={{ padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center' }}>
                          <span className={`px-2 py-0.5 rounded text-[10px]`} style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            background: accuracy >= 70 ? 'rgba(16, 185, 129, 0.15)' : accuracy >= 40 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: accuracy >= 70 ? '#34d399' : accuracy >= 40 ? '#fbbf24' : '#f87171'
                          }}>
                            %{accuracy}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {testedWords.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-xs text-slate-500" style={{ padding: '24px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Henüz kelime testi çözmediniz. Kelimelerim sekmesinden oyunları oynayarak başlayın!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceSection;
