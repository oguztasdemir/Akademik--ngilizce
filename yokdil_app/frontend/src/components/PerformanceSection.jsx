import React, { useState } from 'react';
import { Trophy, TrendingUp, ChevronLeft, Award, Printer, BookOpen, Activity, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

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
  const [perfTab, setPerfTab] = useState('tests'); // 'tests', 'vocabulary', 'calendar'
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  if (activeTab !== 'performance') return null;

  const stats = getStats();
  const pool = notebook.length > 0 ? notebook : vocabPracticeList;

  // Filter words that have statistics recorded
  const testedWords = pool.filter(word => {
    const wStats = wordStats[word.english.toLowerCase()];
    return wStats && (wStats.correct > 0 || wStats.wrong > 0);
  });

  // SVG circular progress calculation
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const successPercentage = stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0;
  const offset = circumference - (successPercentage / 100) * circumference;

  return (
    <div className="space-y-6 text-left" style={{ maxWidth: '880px', margin: '0 auto' }}>
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
        
        .kpi-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .kpi-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary-light);
          box-shadow: 0 12px 24px -10px var(--glow-color);
        }
        
        .kpi-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .topic-row {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          padding: 16px;
          transition: all 0.2s ease;
          border-left: 4px solid var(--border-color);
        }
        
        .topic-row:hover {
          border-left-color: var(--primary);
          transform: translateX(4px);
          background: var(--bg-card-hover);
        }
      `}</style>

      {/* Modern Dashboard Header */}
      <div className="glass-card p-6 border border-white/5 rounded-3xl relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, var(--bg-card), rgba(99, 102, 241, 0.05))',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Activity className="h-5 w-5 text-indigo-400 animate-pulse" />
            <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--primary-light)', letterSpacing: '0.05em' }}>GELİŞİM ANALİZİ</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-heading)' }}>Başarı Analiz Paneli 📊</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Çözdüğünüz testlerin başarı oranlarını ve çalıştığınız kelimelerin istatistiklerini izleyin.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-primary"
          style={{ 
            padding: '10px 20px', 
            fontSize: '0.75rem', 
            fontWeight: '700',
            borderRadius: '12px',
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            cursor: 'pointer',
            boxShadow: '0 4px 12px var(--glow-color)'
          }}
        >
          <Printer className="h-4 w-4" /> Karneyi Yazdır / PDF Kaydet
        </button>
      </div>

      {/* Pill Styled Sub-Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '6px', 
        padding: '5px', 
        background: 'var(--bg-card)', 
        borderRadius: '14px', 
        border: '1px solid var(--border-color)',
        maxWidth: '520px'
      }}>
        <button 
          onClick={() => setPerfTab('tests')}
          style={{
            flex: 1,
            padding: '8px 16px',
            fontSize: '0.75rem',
            fontWeight: '700',
            borderRadius: '10px',
            background: perfTab === 'tests' ? 'var(--primary-gradient)' : 'transparent',
            color: perfTab === 'tests' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          📝 Testler
        </button>
        <button 
          onClick={() => setPerfTab('vocabulary')}
          style={{
            flex: 1,
            padding: '8px 16px',
            fontSize: '0.75rem',
            fontWeight: '700',
            borderRadius: '10px',
            background: perfTab === 'vocabulary' ? 'var(--primary-gradient)' : 'transparent',
            color: perfTab === 'vocabulary' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          📇 Kelimeler
        </button>
        <button 
          onClick={() => setPerfTab('calendar')}
          style={{
            flex: 1,
            padding: '8px 16px',
            fontSize: '0.75rem',
            fontWeight: '700',
            borderRadius: '10px',
            background: perfTab === 'calendar' ? 'var(--primary-gradient)' : 'transparent',
            color: perfTab === 'calendar' ? '#ffffff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          📅 Çalışma Takvimi
        </button>
      </div>

      {/* SUBTAB 1: TEST PERFORMANCE */}
      {perfTab === 'tests' && (
        <div className="space-y-6">
          
          {/* Circular Gauge & Interactive KPIs Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '16px' 
          }}>
            
            {/* Success Circle Gauge Card */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              position: 'relative'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>GENEL BAŞARI ORANI</span>
              
              <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 8px var(--glow-color))' }}>
                  <circle cx="60" cy="60" r={radius} stroke="rgba(255, 255, 255, 0.02)" strokeWidth="9" fill="transparent" />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="url(#perfGaugeGradient)"
                    strokeWidth="9"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                  />
                  <defs>
                    <linearGradient id="perfGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>%{successPercentage}</span>
                  <span style={{ fontSize: '0.52rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 'bold' }}>BAŞARI</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(16, 185, 129, 0.06)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <Sparkles className="h-3 w-3 text-emerald-400" />
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#34d399' }}>
                  {successPercentage >= 70 ? 'Harika Gidiyorsun!' : successPercentage >= 50 ? 'Gelişmeye Devam!' : 'Hataları Tekrar Edin'}
                </span>
              </div>
            </div>

            {/* SVG Gramer Zayıflık Radar Grafiği Card */}
            <div className="glass-card" style={{ 
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '24px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '8px' }}>Gramer Zayıflık Radar Grafiği</span>
              
              <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(() => {
                  const cx = 110;
                  const cy = 110;
                  const r = 70;
                  const axesLabels = ['Kelime', 'Zamanlar', 'Edatlar', 'Bağlaçlar', 'Cümle', 'Okuma'];
                  const keyMapping = ['vocab', 'tenses', 'preps', 'conjs', 'completion', 'reading'];
                  
                  const points = keyMapping.map((key, i) => {
                    const item = stats.topics[key] || { correct: 0, solved: 0 };
                    const success = item.solved > 0 ? (item.correct / item.solved) : 0.5;
                    const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                    const x = cx + r * success * Math.cos(angle);
                    const y = cy + r * success * Math.sin(angle);
                    return { x, y, label: axesLabels[i], success };
                  });
                  
                  const polygonPath = points.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
                  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
                  
                  return (
                    <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: 'visible' }}>
                      {rings.map((ringVal, rIdx) => {
                        const ringPoints = keyMapping.map((_, i) => {
                          const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                          const x = cx + r * ringVal * Math.cos(angle);
                          const y = cy + r * ringVal * Math.sin(angle);
                          return `${x.toFixed(1)},${y.toFixed(1)}`;
                        }).join(' ');
                        return (
                          <polygon 
                            key={rIdx} 
                            points={ringPoints} 
                            fill="none" 
                            stroke="rgba(255,255,255,0.04)" 
                            strokeWidth="1" 
                          />
                        );
                      })}
                      
                      {keyMapping.map((_, i) => {
                        const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                        const x = cx + r * Math.cos(angle);
                        const y = cy + r * Math.sin(angle);
                        return (
                          <line 
                            key={i} 
                            x1={cx} 
                            y1={cy} 
                            x2={x} 
                            y2={y} 
                            stroke="rgba(255,255,255,0.06)" 
                            strokeWidth="1" 
                          />
                        );
                      })}
                      
                      <polygon 
                        points={polygonPath} 
                        fill="rgba(99, 102, 241, 0.25)" 
                        stroke="var(--primary-light)" 
                        strokeWidth="2" 
                        style={{ filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.5))' }}
                      />
                      
                      {points.map((p, i) => (
                        <circle 
                          key={i} 
                          cx={p.x} 
                          cy={p.y} 
                          r="4" 
                          fill="#34d399" 
                          stroke="white" 
                          strokeWidth="1" 
                          title={`${p.label}: %${Math.round(p.success * 100)}`}
                        />
                      ))}
                      
                      {keyMapping.map((_, i) => {
                        const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                        const labelRadius = r + 18;
                        const x = cx + labelRadius * Math.cos(angle);
                        const y = cy + labelRadius * Math.sin(angle) + 4;
                        return (
                          <text 
                            key={i} 
                            x={x} 
                            y={y} 
                            fill="rgba(255,255,255,0.6)" 
                            fontSize="8" 
                            fontWeight="bold" 
                            textAnchor="middle"
                          >
                            {axesLabels[i]}
                          </text>
                        );
                      })}
                    </svg>
                  );
                })()}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between' }}>
              
              {/* Total Solved */}
              <div className="kpi-card">
                <div className="kpi-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-light)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Toplam Çözülen Soru</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>{stats.solved} <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>soru</span></span>
                </div>
              </div>

              {/* Correct Answers */}
              <div className="kpi-card" style={{ borderLeft: '3px solid #10b981' }}>
                <div className="kpi-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Doğru Cevaplar</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>{stats.correct} <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>adet</span></span>
                </div>
              </div>

              {/* Wrong Answers */}
              <div className="kpi-card" style={{ borderLeft: '3px solid #ef4444' }}>
                <div className="kpi-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  <XCircle className="h-5 w-5" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', display: 'block' }}>Hatalı Cevaplar</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f87171', fontFamily: 'var(--font-heading)' }}>{stats.wrong} <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>adet</span></span>
                </div>
              </div>

            </div>
          </div>

          {/* Weakness Topic Analytics */}
          <div className="glass-card p-6 border border-white/5 rounded-2xl space-y-4" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <TrendingUp className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span>Konu Başlığı Başarı Analizi</span>
            </h3>

            {/* SVG Interactive Bar Chart */}
            {Object.keys(stats.topics).length > 0 && (
              <div className="glass-card p-4" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', display: 'block' }}>Görsel Karşılaştırma Grafiği (Doğru / Hata)</span>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '140px', padding: '10px 0', gap: '8px' }}>
                  {Object.entries(stats.topics).map(([key, item]) => {
                    const maxVal = Math.max(...Object.values(stats.topics).map(t => t.solved), 1);
                    const correctHeight = (item.correct / maxVal) * 100;
                    const wrongHeight = (item.wrong / maxVal) * 100;
                    
                    return (
                      <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '50px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px', width: '100%', justifyContent: 'center' }}>
                          {/* Correct Bar */}
                          <div 
                            className="chart-bar-hover"
                            style={{ 
                              width: '12px', 
                              height: `${Math.max(correctHeight, 4)}%`, 
                              background: 'var(--success-gradient)', 
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.8s ease'
                            }}
                            title={`Doğru: ${item.correct}`}
                          />
                          {/* Wrong Bar */}
                          <div 
                            className="chart-bar-hover"
                            style={{ 
                              width: '12px', 
                              height: `${Math.max(wrongHeight, 4)}%`, 
                              background: 'var(--wrong-gradient)', 
                              borderRadius: '4px 4px 0 0',
                              transition: 'height 0.8s ease'
                            }}
                            title={`Yanlış: ${item.wrong}`}
                          />
                        </div>
                        <span style={{ fontSize: '0.58rem', fontWeight: '700', color: 'var(--text-secondary)', marginTop: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', textAlign: 'center' }} title={item.name}>
                          {item.name.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.58rem', fontWeight: '800', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--success)' }}></span> Doğru</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--wrong)' }}></span> Yanlış</div>
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(stats.topics).map(([key, item]) => {
                const accuracy = item.solved > 0 ? ((item.correct / item.solved) * 100).toFixed(0) : 0;
                const isWeak = item.solved > 0 && accuracy < 60;
                
                // Color configuration depending on weakness status
                const themeColor = isWeak ? '#ef4444' : accuracy >= 75 ? '#10b981' : '#6366f1';
                
                return (
                  <div key={key} className="topic-row" style={{ borderLeftColor: themeColor }}>
                    <div className="flex justify-between text-xs font-semibold" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: '700' }}>{item.name}</span>
                      <span style={{ 
                        fontSize: '0.82rem', 
                        fontWeight: '800', 
                        color: themeColor 
                      }}>
                        {item.correct} / {item.solved} ({accuracy}%)
                      </span>
                    </div>
                    
                    <div className="h-2.5 w-full rounded-full bg-white/5 overflow-hidden" style={{ height: '10px', borderRadius: '5px', background: 'rgba(255, 255, 255, 0.03)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <div 
                        style={{ 
                          width: `${accuracy}%`, 
                          height: '100%', 
                          background: isWeak ? 'linear-gradient(90deg, #ef4444, #f87171)' : accuracy >= 75 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #4f46e5, #818cf8)',
                          borderRadius: '5px',
                          boxShadow: `0 0 10px ${themeColor}20`,
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    
                    {isWeak && item.name !== "Cümle/Paragraf (Reading/Clauses)" && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button 
                          onClick={() => setActiveTab('lectures')}
                          className="btn-secondary"
                          style={{
                            padding: '5px 12px',
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
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
        <div className="space-y-4">
          <div className="glass-card border border-white/5 rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr className="border-b border-white/5 bg-white/2" style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255, 255, 255, 0.01)' }}>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '14px 18px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Kelime</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400" style={{ padding: '14px 18px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Türkçe Anlamı</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '14px 18px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center', color: 'var(--text-secondary)' }}>Doğru</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '14px 18px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center', color: 'var(--text-secondary)' }}>Yanlış</th>
                    <th className="p-3 text-[9px] uppercase font-bold text-slate-400 text-center" style={{ padding: '14px 18px', fontSize: '0.68rem', fontWeight: '800', letterSpacing: '0.05em', textAlign: 'center', color: 'var(--text-secondary)' }}>Başarı %</th>
                  </tr>
                </thead>
                <tbody>
                  {testedWords.map((item) => {
                    const wStats = wordStats[item.english.toLowerCase()] || { correct: 0, wrong: 0 };
                    const total = wStats.correct + wStats.wrong;
                    const accuracy = total > 0 ? Math.round((wStats.correct / total) * 100) : 0;
                    
                    return (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-white/1" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                        <td className="p-3 text-xs font-bold text-indigo-300" style={{ padding: '12px 18px', fontSize: '0.8rem', color: 'var(--primary-light)' }}>{item.english}</td>
                        <td className="p-3 text-xs text-slate-200" style={{ padding: '12px 18px', fontSize: '0.8rem', color: 'var(--text-main)' }}>{item.turkish}</td>
                        <td className="p-3 text-xs text-center font-mono font-bold" style={{ padding: '12px 18px', fontSize: '0.8rem', textAlign: 'center', color: '#10b981' }}>
                          {wStats.correct}
                        </td>
                        <td className="p-3 text-xs text-center font-mono font-bold" style={{ padding: '12px 18px', fontSize: '0.8rem', textAlign: 'center', color: '#ef4444' }}>
                          {wStats.wrong}
                        </td>
                        <td className="p-3 text-xs text-center font-bold" style={{ padding: '12px 18px', fontSize: '0.8rem', textAlign: 'center' }}>
                          <span className={`px-2 py-0.5 rounded text-[10px]`} style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            background: accuracy >= 70 ? 'rgba(16, 185, 129, 0.08)' : accuracy >= 40 ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            color: accuracy >= 70 ? '#10b981' : accuracy >= 40 ? '#fbbf24' : '#ef4444',
                            border: `1px solid ${accuracy >= 70 ? 'rgba(16, 185, 129, 0.15)' : accuracy >= 40 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`
                          }}>
                            %{accuracy}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {testedWords.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-xs text-slate-500" style={{ padding: '32px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Henüz kelime testi çözmediniz. Kelimelerim sekmesinden oyunları oynayarak başlayın!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: INTERACTIVE STUDY CALENDAR */}
      {perfTab === 'calendar' && (
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              📅 Çalışma Geçmişi Takvimi
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Yoğunluk renkleriyle çalışma takibinizi yapın. Detaylar için güne tıklayın.
            </span>
          </div>

          {/* Calendar Grid */}
          {(() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth(); // 0-indexed
            
            const monthNames = [
              "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
              "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
            ];

            const firstDayIndex = new Date(year, month, 1).getDay();
            const totalDays = new Date(year, month + 1, 0).getDate();
            const startPadding = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

            const days = [];
            for (let i = 0; i < startPadding; i++) {
              days.push(null);
            }
            for (let d = 1; d <= totalDays; d++) {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              days.push({ day: d, dateStr });
            }

            const historyRaw = localStorage.getItem('yokdil_study_history');
            const studyHistory = historyRaw ? JSON.parse(historyRaw) : {};

            const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

            return (
              <div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem', color: 'white', marginBottom: '14px' }}>
                  {monthNames[month]} {year}
                </div>

                {/* Grid header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '8px' }}>
                  {weekDays.map(wd => (
                    <div key={wd} style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                  {days.map((item, index) => {
                    if (!item) {
                      return <div key={`empty-${index}`} style={{ aspectRatio: '1', background: 'transparent' }} />;
                    }

                    const logs = studyHistory[item.dateStr] || { questions: 0, words: 0, games: 0, paragraphs: 0 };
                    const totalUnits = (logs.questions || 0) + (logs.words || 0) + (logs.games || 0) + (logs.paragraphs || 0);
                    
                    // Intensity color mapping
                    let bgColor = 'rgba(255, 255, 255, 0.02)';
                    let border = '1px solid rgba(255, 255, 255, 0.05)';
                    if (totalUnits > 0) {
                      if (totalUnits < 5) {
                        bgColor = 'rgba(99, 102, 241, 0.15)';
                        border = '1px solid rgba(99, 102, 241, 0.3)';
                      } else if (totalUnits < 15) {
                        bgColor = 'rgba(99, 102, 241, 0.4)';
                        border = '1px solid rgba(99, 102, 241, 0.6)';
                      } else {
                        bgColor = 'rgba(99, 102, 241, 0.8)';
                        border = '1px solid #a5b4fc';
                      }
                    }

                    const isToday = new Date().toISOString().split('T')[0] === item.dateStr;

                    return (
                      <button
                        key={item.dateStr}
                        onClick={() => setSelectedDayDetails({ date: item.dateStr, logs })}
                        style={{
                          aspectRatio: '1',
                          background: bgColor,
                          border: isToday ? '2px solid #34d399' : border,
                          borderRadius: '10px',
                          color: totalUnits > 15 ? 'white' : 'var(--text-main)',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          outline: 'none',
                          boxShadow: totalUnits > 15 ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
                        }}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Modal / Popover Detail */}
          {selectedDayDetails && (
            <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px', position: 'relative' }}>
              <button 
                onClick={() => setSelectedDayDetails(null)}
                style={{ position: 'absolute', right: '14px', top: '14px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                ✕ Kapat
              </button>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 14px 0' }}>
                📊 {selectedDayDetails.date} Çalışma Detayları
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Çözülen Soru</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#818cf8', marginTop: '4px' }}>{selectedDayDetails.logs.questions || 0}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Çalışılan Kelime</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>{selectedDayDetails.logs.words || 0}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Oynanan Oyun</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#f43f5e', marginTop: '4px' }}>{selectedDayDetails.logs.games || 0}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '0.62rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Okunan Sayfa</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>{selectedDayDetails.logs.paragraphs || 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Kişiselleştirilmiş Yazdırılabilir Çalışma Rehberi */}
      <div className="print-study-guide-only" style={{ marginTop: '40px', borderTop: '2px dashed #000', paddingTop: '30px', fontFamily: 'serif', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', color: '#000', marginBottom: '10px' }}>YÖKDİL Kişiselleştirilmiş Çalışma Reçetesi 📄</h2>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#333', marginBottom: '24px' }}>
          Bu karne, kullanıcının sınav performans istatistiklerine ve hata geçmişine göre dinamik olarak üretilmiştir.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '6px', fontSize: '1.2rem' }}>📊 Genel Sınav Karnesi</h3>
            <p style={{ margin: '6px 0', fontSize: '0.95rem' }}>Toplam Çözülen Soru: <strong>{stats.solved}</strong></p>
            <p style={{ margin: '6px 0', fontSize: '0.95rem' }}>Doğru Sayısı: <strong>{stats.correct}</strong></p>
            <p style={{ margin: '6px 0', fontSize: '0.95rem' }}>Hatalı Sayısı: <strong>{stats.wrong}</strong></p>
            <p style={{ margin: '6px 0', fontSize: '0.95rem' }}>Genel Başarı Oranı: <strong>%{successPercentage}</strong></p>
          </div>
          <div>
            <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '6px', fontSize: '1.2rem' }}>🎓 Zayıf & Güçlü Konu Analizi</h3>
            {Object.entries(stats.topics).map(([key, item]) => {
              const accuracy = item.solved > 0 ? ((item.correct / item.solved) * 100).toFixed(0) : 0;
              return (
                <p key={key} style={{ margin: '4px 0', fontSize: '0.88rem' }}>
                  {item.name}: <strong>%{accuracy}</strong> ({item.correct}/{item.solved} Soru)
                </p>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '6px', fontSize: '1.2rem', marginBottom: '10px' }}>🚨 Acil Tekrar Edilecek Akademik Kelimeler (Reçete)</h3>
          {testedWords.filter(w => {
            const wStats = wordStats[w.english.toLowerCase()] || { correct: 0, wrong: 0 };
            const total = wStats.correct + wStats.wrong;
            const accuracy = total > 0 ? (wStats.correct / total) * 100 : 100;
            return accuracy < 60;
          }).slice(0, 10).length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #000', textAlign: 'left' }}>
                  <th style={{ padding: '6px 0' }}>Kelime</th>
                  <th style={{ padding: '6px 0' }}>Türkçe Anlamı</th>
                  <th style={{ padding: '6px 0' }}>Başarı Oranı</th>
                </tr>
              </thead>
              <tbody>
                {testedWords.filter(w => {
                  const wStats = wordStats[w.english.toLowerCase()] || { correct: 0, wrong: 0 };
                  const total = wStats.correct + wStats.wrong;
                  const accuracy = total > 0 ? (wStats.correct / total) * 100 : 100;
                  return accuracy < 60;
                }).slice(0, 10).map(item => {
                  const wStats = wordStats[item.english.toLowerCase()] || { correct: 0, wrong: 0 };
                  const total = wStats.correct + wStats.wrong;
                  const accuracy = total > 0 ? Math.round((wStats.correct / total) * 100) : 0;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '6px 0', fontWeight: 'bold' }}>{item.english}</td>
                      <td style={{ padding: '6px 0' }}>{item.turkish}</td>
                      <td style={{ padding: '6px 0', color: 'red' }}>%{accuracy} ({wStats.wrong} Hata)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>Henüz düşük başarı oranına sahip zayıf bir kelime bulunmamaktadır. Tebrikler!</p>
          )}
        </div>

        <div>
          <h3 style={{ borderBottom: '1px solid #000', paddingBottom: '6px', fontSize: '1.2rem', marginBottom: '10px' }}>🎯 Akademisyen Sınav Koçu Çalışma Planı</h3>
          <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <li>Başarı oranınızın %70 altında kaldığı gramer/okuma konu başlıklarını Konu Anlatımı sekmesinden haftada en az 2 kere tekrar çalışın.</li>
            <li>Hatalı kelimelerinizi günde en az 10 dakika Leitner kutuları üzerinden tekrarlayarak Box 5'e taşımaya gayret edin.</li>
            <li>Sınav simülasyonlarında yanlış çözdüğünüz soruları Hata Kutusu sekmesinden en geç 3 gün içerisinde yapay zeka analizleriyle yeniden çözün.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSection;
