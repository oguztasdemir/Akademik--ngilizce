import React from 'react';
import { Award } from 'lucide-react';

const BookExerciseDashboard = ({
  totalDays,
  completedDays,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  handleDaySelect,
  setReportCardDay,
  formatWordType
}) => {

  const getMonthStats = (monthNum) => {
    const start = (monthNum - 1) * 28 + 1;
    const end = Math.min(monthNum * 28, totalDays);
    const totalDaysInMonth = end - start + 1;

    let completed = 0;
    for (let d = start; d <= end; d++) {
      if (completedDays.includes(d)) {
        completed++;
      }
    }
    return { completed, totalDaysInMonth };
  };

  const getWeekStats = (weekNum) => {
    const start = (weekNum - 1) * 7 + 1;
    const end = Math.min(weekNum * 7, totalDays);
    const totalDaysInWeek = end - start + 1;

    let completed = 0;
    for (let d = start; d <= end; d++) {
      if (completedDays.includes(d)) {
        completed++;
      }
    }
    return { completed, totalDaysInWeek };
  };

  const renderDayItem = (dayNum) => {
    const isCompleted = completedDays.includes(dayNum);
    
    // Filter logic for search
    const searchLower = searchTerm.toLowerCase().trim();
    if (searchLower) {
      const matchesDay = `gün ${dayNum}`.includes(searchLower) || String(dayNum).includes(searchLower);
      const matchesCompleted = isCompleted && ('tamamlandı'.includes(searchLower) || 'bitti'.includes(searchLower));
      const matchesPending = !isCompleted && ('başlanmadı'.includes(searchLower) || 'kaldı'.includes(searchLower) || 'başlat'.includes(searchLower));
      if (!matchesDay && !matchesCompleted && !matchesPending) return null;
    }

    const isMonthlyCamp = (dayNum % 28 === 0) || (dayNum === totalDays);
    const isSecCamp = !isMonthlyCamp && ((dayNum % 7 === 0) || (dayNum === totalDays));
    const secCampNum = Math.ceil(dayNum / 7);
    const monthlyCampNum = Math.ceil(dayNum / 28);

    let border = isMonthlyCamp 
      ? '1.5px solid rgba(239, 68, 68, 0.4)' 
      : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)');
    let bg = isMonthlyCamp 
      ? 'rgba(239, 68, 68, 0.02)' 
      : (isSecCamp ? 'rgba(251, 191, 36, 0.02)' : 'rgba(255, 255, 255, 0.02)');
    let badgeText = isCompleted ? '✓ Tamamlandı' : 'Başlanmadı';
    let badgeBg = isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)';
    let badgeColor = isCompleted ? '#34d399' : '#94a3b8';

    if (isCompleted) {
      bg = isMonthlyCamp 
        ? 'rgba(239, 68, 68, 0.06)' 
        : (isSecCamp ? 'rgba(251, 191, 36, 0.06)' : 'rgba(16, 185, 129, 0.04)');
      border = isMonthlyCamp 
        ? '1.5px solid rgba(239, 68, 68, 0.7)' 
        : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.7)' : '1px solid rgba(16, 185, 129, 0.25)');
    }

    const dayName = isMonthlyCamp 
      ? `Aylık Genel Test ${monthlyCampNum} 🏆` 
      : (isSecCamp ? `Haftanın Kampı ${secCampNum} 🏆` : `${dayNum}. Gün Çalışması`);
    const dayDesc = isMonthlyCamp 
      ? `${monthlyCampNum}. Ay Sonu Genel Değerlendirme Testi` 
      : (isSecCamp ? `${secCampNum}. Hafta Sonu Genel Bölüm Tekrarı` : `Kelime Kartları, Eş/Zıt Anlam Alıştırmaları ve Çoktan Seçmeli Test`);

    return (
      <div
        key={dayNum}
        onClick={() => {
          if (isCompleted) {
            setReportCardDay(dayNum);
          } else {
            handleDaySelect(dayNum);
          }
        }}
        className={`glass-card day-selector-row ${isCompleted ? 'completed' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderRadius: '16px',
          border: border,
          background: bg,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          textAlign: 'left',
          boxShadow: isMonthlyCamp 
            ? '0 0 15px rgba(239, 68, 68, 0.08)' 
            : (isSecCamp ? '0 0 15px rgba(251, 191, 36, 0.08)' : 'none')
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: isCompleted 
              ? (isMonthlyCamp ? 'rgba(239, 68, 68, 0.15)' : (isSecCamp ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)')) 
              : (isMonthlyCamp ? 'rgba(239, 68, 68, 0.12)' : (isSecCamp ? 'rgba(251, 191, 36, 0.12)' : 'rgba(99, 102, 241, 0.1)')),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isCompleted 
              ? (isMonthlyCamp ? '#f87171' : (isSecCamp ? '#fbbf24' : '#10b981')) 
              : (isMonthlyCamp ? '#f87171' : (isSecCamp ? '#fbbf24' : '#818cf8')),
            fontWeight: 'bold',
            fontSize: '0.95rem',
            border: (isSecCamp || isMonthlyCamp) ? `1px solid ${isMonthlyCamp ? 'rgba(239, 68, 68, 0.25)' : 'rgba(251, 191, 36, 0.25)'}` : 'none'
          }}>
            {isMonthlyCamp ? '🔥' : (isSecCamp ? '👑' : dayNum)}
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '750', color: 'white' }}>
              {dayName}
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#94a3b8' }}>
              {dayDesc}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 'bold',
            padding: '4px 10px',
            borderRadius: '8px',
            background: badgeBg,
            color: badgeColor,
            border: isCompleted 
              ? (isSecCamp ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)') 
              : '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            {badgeText}
          </span>
          <button
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              cursor: 'pointer',
              background: isMonthlyCamp && !isCompleted ? '#ef4444' : (isSecCamp && !isCompleted ? '#f59e0b' : ''),
              borderColor: isMonthlyCamp && !isCompleted ? '#ef4444' : (isSecCamp && !isCompleted ? '#f59e0b' : '')
            }}
          >
            {isCompleted ? 'Tekrar Et' : 'Başlat 🚀'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '40px' }}>
      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['daily', 'weekly', 'monthly'].map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setViewMode(mode);
              setSelectedMonth(null);
              setSelectedWeek(null);
            }}
            className="glass-button"
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: viewMode === mode ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.02)',
              border: viewMode === mode ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.08)',
              color: viewMode === mode ? 'white' : '#cbd5e1',
              transition: 'all 0.2s'
            }}
          >
            {mode === 'daily' ? '📅 Günlük Görünüm' : mode === 'weekly' ? '🔁 Haftalık Görünüm' : '🔥 Aylık Görünüm'}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Gün ara... (Örn: 1, 15, tamamlandı)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'white',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {viewMode === 'daily' && (
          Array.from({ length: totalDays }).map((_, i) => renderDayItem(i + 1))
        )}

        {viewMode === 'weekly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, wIdx) => {
              const weekNum = wIdx + 1;
              const wStats = getWeekStats(weekNum);
              const isWeekExpanded = selectedWeek === weekNum;
              const wProgressPct = Math.round((wStats.completed / wStats.totalDaysInWeek) * 100);

              return (
                <div key={weekNum} className="glass-card" style={{ padding: '16px 20px', borderRadius: '16px', border: isWeekExpanded ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.06)' }}>
                  <div onClick={() => setSelectedWeek(isWeekExpanded ? null : weekNum)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ margin: 0, fontSize: '0.98rem', color: 'white', fontWeight: 'bold' }}>
                        Hafta {weekNum} Değerlendirmesi {isWeekExpanded ? '▼' : '▶'}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                        İlerleme: {wStats.completed}/{wStats.totalDaysInWeek} Gün
                      </span>
                    </div>
                    <div style={{ width: '100px', textAlign: 'right' }}>
                      <div style={{ height: '5px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                        <div style={{ height: '100%', width: `${wProgressPct}%`, background: 'linear-gradient(90deg, #6366f1, #34d399)', borderRadius: '2px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 'bold' }}>%{wProgressPct}</span>
                    </div>
                  </div>

                  {isWeekExpanded && (
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                      {Array.from({ length: wStats.totalDaysInWeek }).map((_, dIdx) => {
                        const dNum = (weekNum - 1) * 7 + dIdx + 1;
                        return renderDayItem(dNum);
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'monthly' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Array.from({ length: Math.ceil(totalDays / 28) }).map((_, mIdx) => {
              const monthNum = mIdx + 1;
              const stats = getMonthStats(monthNum);
              const isExpanded = selectedMonth === monthNum;
              const progressPct = Math.round((stats.completed / stats.totalDaysInMonth) * 100);

              return (
                <div key={monthNum} className="glass-card" style={{ padding: '20px', borderRadius: '18px', border: isExpanded ? '1px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s' }}>
                  <div onClick={() => setSelectedMonth(isExpanded ? null : monthNum)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'white', fontWeight: 'bold' }}>
                        {monthNum}. Ay Değerlendirmesi {isExpanded ? '▼' : '▶'}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                        İlerleme: {stats.completed}/{stats.totalDaysInMonth} Gün
                      </span>
                    </div>
                    <div style={{ width: '120px', textAlign: 'right' }}>
                      <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '3px' }}></div>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold' }}>%{progressPct} Tamamlandı</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '16px', paddingLeft: '12px', borderLeft: '2px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(() => {
                        const startWeek = (monthNum - 1) * 4 + 1;
                        const endWeek = Math.min(monthNum * 4, Math.ceil(totalDays / 7));
                        const weeks = Array.from({ length: endWeek - startWeek + 1 }, (_, wIdx) => startWeek + wIdx);

                        return weeks.map(weekNum => {
                          const wStats = getWeekStats(weekNum);
                          const isWeekExpanded = selectedWeek === weekNum;
                          const wProgressPct = Math.round((wStats.completed / wStats.totalDaysInWeek) * 100);

                          return (
                            <div key={weekNum} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px 16px' }}>
                              <div onClick={() => setSelectedWeek(isWeekExpanded ? null : weekNum)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                <div style={{ textAlign: 'left' }}>
                                  <h5 style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 'bold' }}>
                                    Hafta {weekNum} {isWeekExpanded ? '▼' : '▶'}
                                  </h5>
                                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                                    {wStats.completed}/{wStats.totalDaysInWeek} Gün
                                  </span>
                                </div>
                                <div style={{ width: '90px' }}>
                                  <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2px' }}>
                                    <div style={{ height: '100%', width: `${wProgressPct}%`, background: 'linear-gradient(90deg, #6366f1, #34d399)', borderRadius: '2px' }}></div>
                                  </div>
                                </div>
                              </div>

                              {isWeekExpanded && (
                                <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '8px' }}>
                                  {Array.from({ length: wStats.totalDaysInWeek }).map((_, dIdx) => {
                                    const dNum = (weekNum - 1) * 7 + dIdx + 1;
                                    return renderDayItem(dNum);
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookExerciseDashboard;
