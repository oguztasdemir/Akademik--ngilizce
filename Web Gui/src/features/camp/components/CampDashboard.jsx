import React, { useState } from 'react';
import { Calendar, Star, Trophy, ArrowRight, Award, Sparkles } from 'lucide-react';

const CampDashboard = ({
  campType,
  setCampType,
  vocabTrack,
  setVocabTrack,
  totalDone,
  totalSupermaster,
  selectedCategory,
  currentDay,
  completedDaysMap,
  totalCampDays,
  startDailyStudy,
  setReportCardDay,
  reportCardType,
  setReportCardType,
  getAIAnalysis,
  viewMode,
  setViewMode,
  selectedMonth,
  setSelectedMonth,
  selectedWeek,
  setSelectedWeek,
  grammarDoneCount,
  currentGrammarDay,
  grammarDoneMap,
  startGrammarStudy,
  grammarCampDb,
  cikmisDoneCount,
  currentCikmisDay,
  cikmisDoneMap,
  startCikmisStudy,
  cikmisMode = 'detailed',
  setCikmisMode,
  onExportCikmisData,
  onExportVocabData,
  cikmisPlanData,
  hideSwitcher,
  showConfirm
}) => {
  const [showGeneralReport, setShowGeneralReport] = useState(false);
  const [expandedGrammarDay, setExpandedGrammarDay] = useState(null);

  const calculateGeneralStats = () => {
    const doneMap = completedDaysMap || {};
    const completedDays = Object.keys(doneMap).map(Number);
    const totalCompleted = completedDays.length;
    const scores = Object.values(doneMap).map(d => d.score || 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const passedDaysCount = Object.values(doneMap).filter(d => d.isPassed).length;
    const failedDaysCount = totalCompleted - passedDaysCount;

    return {
      totalCompleted,
      avgScore,
      passedDaysCount,
      failedDaysCount
    };
  };

  const genStats = calculateGeneralStats();

  const getTrackColor = () => {
    if (vocabTrack === 'es_anlam') return { hex: '#a855f7', rgb: '168,85,247' };
    if (vocabTrack === 'zit_anlam') return { hex: '#f43f5e', rgb: '244,63,94' };
    if (vocabTrack === 'cumle') return { hex: '#f59e0b', rgb: '245,158,11' };
    if (vocabTrack === 'tumu') return { hex: '#10b981', rgb: '16,185,129' };
    return { hex: '#6366f1', rgb: '99,102,241' }; // default/anlam: indigo
  };
  const themeColor = getTrackColor();

  // Helper to render Turkish meanings in dashboard lists vertically
  const renderTurkishMeaningsList = (text) => {
    if (!text) return '';
    if (/\b\d+\)\s*/.test(text)) {
      const parts = text.split(/(?=\b\d+\))/).map(s => s.trim()).filter(Boolean);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end', textAlign: 'right' }}>
          {parts.map((p, idx) => (
            <span key={idx} style={{ fontSize: '0.74rem', color: '#a7f3d0', fontWeight: 'bold' }}>{p}</span>
          ))}
        </div>
      );
    }
    return <span>{text}</span>;
  };

  // Calculate stats dynamically based on cikmisPlanData and cikmisDoneMap
  const stats = (() => {
    let correct = 0;
    let wrong = 0;
    let total = 0;
    
    const doneMap = cikmisDoneMap || {};
    const plan = cikmisPlanData || {};
    
    Object.keys(plan).forEach(dayKey => {
      const dayWords = plan[dayKey] || [];
      total += dayWords.length;
      
      const dayRecord = doneMap[dayKey];
      if (dayRecord) {
        const results = dayRecord.results || dayRecord.resultsMap || dayRecord.swipeResults || dayRecord.detailedResults || {};
        dayWords.forEach(w => {
          if (!w) return;
          const eng = typeof w === 'string' ? w : w.english;
          if (!eng) return;
          const status = results[eng];
          if (status === true) {
            correct += 1;
          } else {
            wrong += 1;
          }
        });
      }
    });
    
    const unstudied = Math.max(0, total - (correct + wrong));
    return { correct, wrong, unstudied, total };
  })();

  const [showExportDropdown, setShowExportDropdown] = React.useState(false);
  const [showVocabExportDropdown, setShowVocabExportDropdown] = React.useState(false);
  const [expandedCikmisDay, setExpandedCikmisDay] = React.useState(null);

  const getMonthStats = (monthNum) => {
    const start = (monthNum - 1) * 28 + 1;
    const end = Math.min(monthNum * 28, totalCampDays);
    const totalDaysInMonth = end - start + 1;

    let completed = 0;
    let totalScore = 0;
    for (let d = start; d <= end; d++) {
      if (completedDaysMap[d]) {
        completed++;
        totalScore += completedDaysMap[d].score || 0;
      }
    }
    const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0;
    return { completed, totalDaysInMonth, avgScore };
  };

  const getWeekStats = (weekNum) => {
    const start = (weekNum - 1) * 7 + 1;
    const end = Math.min(weekNum * 7, totalCampDays);
    const totalDaysInWeek = end - start + 1;

    let completed = 0;
    let totalScore = 0;
    for (let d = start; d <= end; d++) {
      if (completedDaysMap[d]) {
        completed++;
        totalScore += completedDaysMap[d].score || 0;
      }
    }
    const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0;
    return { completed, totalDaysInWeek, avgScore };
  };

  const renderDayItem = (dayNum) => {
    const completedObj = completedDaysMap[dayNum];
    const isCompleted = completedObj ? (
      cikmisMode === 'swipe'
      ? (completedObj.swipeCompleted !== undefined ? !!completedObj.swipeCompleted : true)
      : (completedObj.detailedCompleted !== undefined ? !!completedObj.detailedCompleted : false)
    ) : false;
    const isPassed = completedObj ? (
      cikmisMode === 'swipe'
      ? (completedObj.swipePassed !== undefined ? !!completedObj.swipePassed : true)
      : (completedObj.detailedPassed !== undefined ? !!completedObj.detailedPassed : completedObj.isPassed)
    ) : false;
    const score = completedObj ? (
      cikmisMode === 'swipe'
      ? (completedObj.swipeScore !== undefined ? completedObj.swipeScore : completedObj.score)
      : (completedObj.detailedScore !== undefined ? completedObj.detailedScore : completedObj.score)
    ) : null;

    const isActive = dayNum === currentDay;
    const isMonthlyCamp = (dayNum % 28 === 0) || (dayNum === totalCampDays);
    const isSecCamp = !isMonthlyCamp && ((dayNum % 7 === 0) || (dayNum === totalCampDays));
    const secCampNum = Math.ceil(dayNum / 7);
    const monthlyCampNum = Math.ceil(dayNum / 28);

    let border = isMonthlyCamp 
      ? '1.5px solid rgba(239, 68, 68, 0.4)' 
      : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)');
    let bg = isMonthlyCamp 
      ? 'rgba(239, 68, 68, 0.02)' 
      : (isSecCamp ? 'rgba(251, 191, 36, 0.02)' : 'rgba(255, 255, 255, 0.02)');
    let badgeText = 'Çalışma Başlatılmadı';
    let badgeBg = 'rgba(255, 255, 255, 0.05)';
    let badgeColor = '#94a3b8';

    if (isCompleted) {
      if (isPassed) {
        bg = isMonthlyCamp 
          ? 'rgba(239, 68, 68, 0.06)' 
          : (isSecCamp ? 'rgba(251, 191, 36, 0.06)' : 'rgba(16, 185, 129, 0.05)');
        border = isMonthlyCamp 
          ? '1.5px solid rgba(239, 68, 68, 0.7)' 
          : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.7)' : '1px solid rgba(16, 185, 129, 0.25)');
        badgeText = `Başarılı (%${score})`;
        badgeBg = 'rgba(16, 185, 129, 0.15)';
        badgeColor = '#34d399';
      } else {
        bg = 'rgba(239, 68, 68, 0.05)';
        border = '1px solid rgba(239, 68, 68, 0.25)';
        badgeText = `Başarısız (%${score})`;
        badgeBg = 'rgba(239, 68, 68, 0.15)';
        badgeColor = '#f87171';
      }
    } else if (isActive) {
      bg = isMonthlyCamp 
        ? 'rgba(239, 68, 68, 0.08)' 
        : (isSecCamp ? 'rgba(251, 191, 36, 0.08)' : `rgba(${themeColor.rgb}, 0.05)`);
      border = isMonthlyCamp 
        ? '1.5px solid rgba(239, 68, 68, 0.9)' 
        : (isSecCamp ? '1.5px solid rgba(251, 191, 36, 0.9)' : `1.5px solid rgba(${themeColor.rgb}, 0.4)`);
      badgeText = 'Sıradaki Hedef';
      badgeBg = isMonthlyCamp 
        ? 'rgba(239, 68, 68, 0.15)' 
        : (isSecCamp ? 'rgba(251, 191, 36, 0.15)' : `rgba(${themeColor.rgb}, 0.15)`);
      badgeColor = isMonthlyCamp 
        ? '#f87171' 
        : (isSecCamp ? '#fbbf24' : themeColor.hex);
    }

    const dayName = isMonthlyCamp 
      ? `Aylık Genel Test ${monthlyCampNum} 🏆` 
      : (isSecCamp ? `Haftanın Kampı ${secCampNum} 🏆` : `${dayNum}. Gün Akademik Kelimeleri`);
    const dayDesc = isMonthlyCamp 
      ? `${monthlyCampNum}. Ay Sonu Genel Değerlendirme Testi` 
      : (isSecCamp ? `${secCampNum}. Hafta Sonu Genel Bölüm Tekrarı` : `Spaced Repetition & 20 Seçilmiş Kelime Kartı`);

    return (
      <div
        key={dayNum}
        onClick={() => {
          if (isCompleted) {
            if (showConfirm) {
              showConfirm(
                "Bu günü daha önce tamamladınız. Yeniden çözmek ister misiniz?\n(Yeni çalışmanız geçmişte v2/v3... olarak saklanacaktır. Rapor kartını görmek için İptal seçiniz.)",
                () => startDailyStudy(dayNum),
                () => setReportCardDay(dayNum)
              );
            } else {
              const restart = window.confirm("Bu günü daha önce tamamladınız. Yeniden çözmek ister misiniz?\n(Yeni çalışmanız geçmişte v2/v3... olarak saklanacaktır. Rapor kartını görmek için İptal seçiniz.)");
              if (restart) startDailyStudy(dayNum);
              else setReportCardDay(dayNum);
            }
          } else {
            startDailyStudy(dayNum);
          }
        }}
        style={{
          background: bg,
          border: border,
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s',
          gap: '12px',
          boxShadow: isMonthlyCamp 
            ? '0 0 15px rgba(239, 68, 68, 0.08)' 
            : (isSecCamp ? '0 0 15px rgba(251, 191, 36, 0.08)' : 'none')
        }}
        className="hover-card"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: isMonthlyCamp 
              ? 'rgba(239, 68, 68, 0.12)' 
              : (isSecCamp ? 'rgba(251, 191, 36, 0.12)' : (isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.04)')), 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '900', 
            color: isMonthlyCamp ? '#f87171' : (isSecCamp ? '#fbbf24' : (isActive ? '#a5b4fc' : 'white')), 
            fontSize: '1.05rem', 
            border: isMonthlyCamp 
              ? '1px solid rgba(239, 68, 68, 0.25)' 
              : (isSecCamp ? '1px solid rgba(251, 191, 36, 0.25)' : '1px solid rgba(255, 255, 255, 0.06)') 
          }}>
            {isMonthlyCamp ? '🔥' : (isSecCamp ? '👑' : dayNum)}
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              {dayName}
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
              {dayDesc}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setReportCardType('vocabulary');
                setReportCardDay(dayNum);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                color: '#93c5fd',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              📊 Karne
            </button>
          )}
          <span style={{
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.72rem',
            fontWeight: 'bold',
            background: badgeBg,
            color: badgeColor
          }}>
            {badgeText}
          </span>
          <ArrowRight className="h-4 w-4 text-slate-500" />
        </div>
      </div>
    );
  };

  const aiReport = getAIAnalysis();

  return (
    <div className="space-y-6">
      {/* Camp Type Switcher */}
      {!hideSwitcher && (
        <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '4px', maxWidth: '600px', margin: '0 auto 10px auto' }}>
          <button
            onClick={() => setCampType('vocabulary')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              background: campType === 'vocabulary' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              border: campType === 'vocabulary' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
              color: campType === 'vocabulary' ? '#a5b4fc' : '#94a3b8',
              fontWeight: 'bold',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            📖 Kelime Kampı
          </button>
          <button
            onClick={() => setCampType('grammar')}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: '10px',
              background: campType === 'grammar' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              border: campType === 'grammar' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
              color: campType === 'grammar' ? '#a7f3d0' : '#94a3b8',
              fontWeight: 'bold',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            🧠 Dilbilgisi Kampı
          </button>
        </div>
      )}

      {campType === 'vocabulary' ? (
        <>
          {/* Mode Switcher for Gelişmiş Kelime Kampı */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '4px', maxWidth: '500px', margin: '0 auto 20px auto' }}>
            <button
              onClick={() => setCikmisMode('swipe')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                background: cikmisMode === 'swipe' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                border: cikmisMode === 'swipe' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                color: cikmisMode === 'swipe' ? '#fca5a5' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              🎴 Hızlı Kart Pratiği
            </button>
            <button
              onClick={() => setCikmisMode('detailed')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                background: cikmisMode === 'detailed' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: cikmisMode === 'detailed' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
                color: cikmisMode === 'detailed' ? '#a5b4fc' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              🧠 Detaylı Kelime Kampı
            </button>
          </div>

          {vocabTrack && setVocabTrack && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              padding: '6px',
              background: 'rgba(255,255,255,0.02)',
              border: '1.5px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              marginBottom: '20px',
              justifyContent: 'center'
            }}>
              {[
                { id: 'anlam', label: 'Anlam Kampı', color: '#6366f1', icon: 'fa-book-open' },
                { id: 'es_anlam', label: 'Eş Anlam Kampı', color: '#a855f7', icon: 'fa-link' },
                { id: 'zit_anlam', label: 'Zıt Anlam Kampı', color: '#f43f5e', icon: 'fa-left-right' },
                { id: 'cumle', label: 'Cümle Kampı', color: '#f59e0b', icon: 'fa-pen-clip' },
                { id: 'tumu', label: 'Genel Kamp (Tümü)', color: '#10b981', icon: 'fa-globe' }
              ].map(t => {
                const isActive = vocabTrack === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setVocabTrack(t.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      border: '1.5px solid',
                      borderColor: isActive ? t.color : 'rgba(255,255,255,0.08)',
                      background: isActive ? `rgba(${isActive ? (t.id === 'anlam' ? '99,102,241' : t.id === 'es_anlam' ? '168,85,247' : t.id === 'zit_anlam' ? '244,63,94' : t.id === 'cumle' ? '245,158,11' : '16,185,129') : ''}, 0.15)` : 'transparent',
                      color: isActive ? 'white' : '#94a3b8',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? `0 4px 12px rgba(${t.id === 'anlam' ? '99,102,241' : t.id === 'es_anlam' ? '168,85,247' : t.id === 'zit_anlam' ? '244,63,94' : t.id === 'cumle' ? '245,158,11' : '16,185,129'}, 0.2)` : 'none'
                    }}
                  >
                    <i className={`fa-solid ${t.icon}`} style={{ color: isActive ? 'white' : t.color }}></i>
                    {t.label}
                  </button>
                );
              })}
            </div>
          )}
          {/* Vocabulary Camp Menu */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '12px', borderRadius: '12px', color: '#6366f1' }}>
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Kelime İlerlemesi</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{totalDone} / 60 Gün</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
                <Star className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Supermaster Kelimeler</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{totalSupermaster} / {selectedCategory === 'fen' ? 1730 : 1744}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Aktif Hedef Gün</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>Gün #{currentDay}</strong>
              </div>
            </div>
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid rgba(251, 191, 36, 0.2)' }} onClick={() => setShowGeneralReport(true)}>
              <div style={{ background: 'rgba(251, 191, 36, 0.12)', padding: '12px', borderRadius: '12px', color: '#fbbf24' }}>
                <Award className="h-6 w-6" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Kamp Karnesi</span>
                <strong style={{ fontSize: '0.94rem', color: '#fbbf24', display: 'block', textDecoration: 'underline' }}>Karne & Durum Raporu 📊</strong>
              </div>
            </div>
          </div>

          {/* Start Daily Button Card */}
          <div className="glass-card text-center" style={{ padding: '36px 20px', borderRadius: '24px', background: `linear-gradient(135deg, rgba(${themeColor.rgb}, 0.1) 0%, rgba(16, 185, 129, 0.04) 100%)`, border: `1.5px solid rgba(${themeColor.rgb}, 0.25)` }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
              Akademik Kelime Master Kampı 🚀
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#cbd5e1', maxWidth: '520px', margin: '8px auto 24px auto', lineHeight: 1.6 }}>
              Her gün 5 kelimeyi; anlam, eş anlam, boşluk doldurma ve soru stratejileriyle çalışarak hafızanıza sabitleyin. Akıllı spaced repetition algoritması öğrenemediğiniz kelimeleri sonraki günlerde tekrar karşınıza çıkaracaktır.
            </p>

            {(() => {
              const completedObj = completedDaysMap[currentDay];
              const isPassed = completedObj ? completedObj.isPassed : false;
              
              return (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                  {completedObj && isPassed ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        🎉 Bugünün kelime kampını %{completedObj.score} başarıyla tamamladınız!
                      </div>
                      <button
                        onClick={() => startDailyStudy(currentDay)}
                        className="btn-secondary"
                        style={{ padding: '8px 24px', fontSize: '0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        Tekrar Çalış (Puan Yükselt)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startDailyStudy(currentDay)}
                      className="btn-primary"
                      style={{ padding: '14px 36px', fontSize: '0.94rem', fontWeight: 'bold', borderRadius: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', background: themeColor.hex, borderColor: themeColor.hex, boxShadow: `0 4px 14px rgba(${themeColor.rgb}, 0.35)` }}
                    >
                      Gün #{currentDay} Çalışmasını Başlat <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <button
                      onClick={() => setShowVocabExportDropdown(!showVocabExportDropdown)}
                      className="btn-secondary"
                      style={{ padding: '14px 28px', fontSize: '0.94rem', fontWeight: 'bold', borderRadius: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      📤 Karne Raporunu Dışarı Aktar
                    </button>
                    {showVocabExportDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '8px',
                        background: '#151c2c',
                        border: '1.5px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        zIndex: 50,
                        minWidth: '220px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <div 
                          onClick={() => { onExportVocabData('pdf'); setShowVocabExportDropdown(false); }}
                          className="hover-card"
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#a7f3d0', textAlign: 'left' }}
                        >
                          <span>📄</span> PDF Belgesi (.pdf)
                        </div>
                        <div 
                          onClick={() => { onExportVocabData('docx'); setShowVocabExportDropdown(false); }}
                          className="hover-card"
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#93c5fd', textAlign: 'left' }}
                        >
                          <span>📝</span> Microsoft Word (.docx)
                        </div>
                        <div 
                          onClick={() => { onExportVocabData('xlsx'); setShowVocabExportDropdown(false); }}
                          className="hover-card"
                          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#fde047', textAlign: 'left' }}
                        >
                          <span>📊</span> Microsoft Excel (.xlsx)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* AI Analysis section */}
          {aiReport && (
            <div className="glass-card animate-scale-in" style={{ padding: '24px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.05)', border: '1.5px solid rgba(99, 102, 241, 0.2)', textAlign: 'left', marginTop: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Award className="h-5 w-5 text-indigo-400 animate-pulse" />
                <h4 style={{ fontSize: '1.02rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  🤖 Yapay Zeka Kelime İlişki Analiz Raporu
                </h4>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                Son yaptığınız çalışmalara göre analiz edilen <strong>{aiReport.totalWrong} hatalı kelime</strong> üzerinden kurulan anlamsal ve gramatik ilişkiler:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3.5px solid #6366f1' }}>
                  <span style={{ fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gramer (Sözcük Türü) Analizi</span>
                  <span style={{ fontSize: '0.86rem', color: '#f1f5f9', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                    En çok hata yapılan sözcük türü: <strong>{aiReport.primaryType}</strong>. {aiReport.typeTip}
                  </span>
                </div>

                {aiReport.semanticInsight && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3.5px solid #10b981' }}>
                    <span style={{ fontSize: '0.78rem', color: '#a7f3d0', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Anlamsal Kümeleme (Semantic Cluster)</span>
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9', display: 'block', marginTop: '3px', lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: aiReport.semanticInsight }} />
                  </div>
                )}

                {aiReport.synonymPairs && aiReport.synonymPairs.length > 0 && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: '10px', borderLeft: '3.5px solid #fbbf24' }}>
                    <span style={{ fontSize: '0.78rem', color: '#fde047', fontWeight: 'bold', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Eş Anlamlı Karışıklık Riski</span>
                    <span style={{ fontSize: '0.86rem', color: '#f1f5f9', display: 'block', marginTop: '3px', lineHeight: 1.4 }}>
                      Şu kelimeler benzer akademik anlamları sebebiyle zihninizde karışıyor olabilir: <strong>{aiReport.synonymPairs.join(', ')}</strong>. Bunları eş anlam kartlarıyla tekrar etmelisiniz.
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Day List Panels with Filters */}
          <div>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {viewMode === 'daily' && (
                Array.from({ length: totalCampDays }).map((_, i) => renderDayItem(i + 1))
              )}

              {viewMode === 'weekly' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Array.from({ length: Math.ceil(totalCampDays / 7) }).map((_, wIdx) => {
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
                              Ortalama Başarı: <strong style={{ color: '#fbbf24' }}>%{wStats.avgScore}</strong> | İlerleme: {wStats.completed}/{wStats.totalDaysInWeek} Gün
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
                  {Array.from({ length: Math.ceil(totalCampDays / 28) }).map((_, mIdx) => {
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
                              Ortalama Başarı: <strong style={{ color: '#fbbf24' }}>%{stats.avgScore}</strong> | İlerleme: {stats.completed}/{stats.totalDaysInMonth} Gün
                            </span>
                          </div>
                          <div style={{ width: '120px', textAlign: 'right' }}>
                            <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #6366f1, #10b981)', borderRadius: '3px' }}></div>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold' }}>%{progressPct} Tamamlandı</span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{ marginTop: '16px', paddingLeft: '12px', borderLeft: '2px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {(() => {
                              const startWeek = (monthNum - 1) * 4 + 1;
                              const endWeek = Math.min(monthNum * 4, Math.ceil(totalCampDays / 7));
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
                                          Ortalama: <strong style={{ color: '#fbbf24' }}>%{wStats.avgScore}</strong> | {wStats.completed}/{wStats.totalDaysInWeek} Gün
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
        </>
      ) : campType === 'grammar' ? (
        <>
          {/* Grammar Camp Menu */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Gramer İlerlemesi</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{grammarDoneCount} / 30 Gün</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Aktif Hedef Gün</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>Gün #{currentGrammarDay}</strong>
              </div>
            </div>
          </div>

          {/* Start Grammar Camp Card */}
          <div className="glass-card text-center" style={{ padding: '36px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.04) 100%)', border: '1.5px solid rgba(16, 185, 129, 0.25)' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
              Akademik Dilbilgisi (Grammar) Kampı 🧠
            </h2>
            <p style={{ fontSize: '0.94rem', color: '#cbd5e1', maxWidth: '520px', margin: '8px auto 24px auto', lineHeight: 1.6 }}>
              YÖKDİL ve YDS sınavlarında en çok test edilen gramer konularını (Zamanlar, Bağlaçlar, Kısaltmalar, Edatlar) interaktif konu özetleri ve mini testlerle 30 günde tamamlayın.
            </p>

            {(() => {
              const completedObj = grammarDoneMap[currentGrammarDay];
              const isPassed = completedObj ? completedObj.isPassed : false;
              
              if (completedObj && isPassed) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      🎉 Bugünün dilbilgisi çalışmasını %{completedObj.score} başarıyla tamamladınız!
                    </div>
                    <button
                      onClick={() => startGrammarStudy(currentGrammarDay)}
                      className="btn-secondary"
                      style={{ padding: '8px 24px', fontSize: '0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                    >
                      Tekrar Çalış (Puan Yükselt)
                    </button>
                  </div>
                );
              } else {
                return (
                  <button
                    onClick={() => startGrammarStudy(currentGrammarDay)}
                    className="btn-primary"
                    style={{ padding: '14px 36px', fontSize: '0.94rem', fontWeight: 'bold', borderRadius: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#10b981', borderColor: '#10b981' }}
                  >
                    Gün #{currentGrammarDay} Gramer Çalışmasını Başlat <ArrowRight className="h-4 w-4" />
                  </button>
                );
              }
            })()}
          </div>

          {/* Grammar 30 Day List Panels */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Günlük Kamp</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNum = i + 1;
                const completedObj = grammarDoneMap[dayNum];
                const isCompleted = !!completedObj;
                const isPassed = completedObj ? completedObj.isPassed : false;
                const score = completedObj ? completedObj.score : null;

                const isActive = dayNum === currentGrammarDay;
                const dayData = grammarCampDb[String(dayNum)];

                let border = '1px solid rgba(255, 255, 255, 0.06)';
                let bg = 'rgba(255, 255, 255, 0.02)';
                let badgeText = 'Çalışma Başlatılmadı';
                let badgeBg = 'rgba(255, 255, 255, 0.05)';
                let badgeColor = '#94a3b8';

                if (isCompleted) {
                  if (isPassed) {
                    bg = 'rgba(16, 185, 129, 0.05)';
                    border = '1px solid rgba(16, 185, 129, 0.25)';
                    badgeText = `Başarılı (%${score})`;
                    badgeBg = 'rgba(16, 185, 129, 0.15)';
                    badgeColor = '#34d399';
                  } else {
                    bg = 'rgba(239, 68, 68, 0.05)';
                    border = '1px solid rgba(239, 68, 68, 0.25)';
                    badgeText = `Başarısız (%${score})`;
                    badgeBg = 'rgba(239, 68, 68, 0.15)';
                    badgeColor = '#f87171';
                  }
                } else if (isActive) {
                  bg = 'rgba(16, 185, 129, 0.05)';
                  border = '1.5px solid rgba(16, 185, 129, 0.4)';
                  badgeText = 'Sıradaki Hedef';
                  badgeBg = 'rgba(16, 185, 129, 0.15)';
                  badgeColor = '#a7f3d0';
                }

                const isExpanded = expandedGrammarDay === dayNum;

                return (
                  <div key={dayNum} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      onClick={() => startGrammarStudy(dayNum)}
                      style={{
                        background: bg,
                        border: border,
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        gap: '12px'
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isActive ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: isActive ? '#a7f3d0' : 'white', fontSize: '1.05rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {dayNum}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            {dayData?.title || `${dayNum}. Gün Dilbilgisi Konusu`}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                            Konu Anlatımı & 5 Pekiştirme Sorusu
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedGrammarDay(isExpanded ? null : dayNum);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 'bold',
                            background: isExpanded ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: isExpanded ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                            color: isExpanded ? '#a5b4fc' : '#cbd5e1',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                        >
                          📖 Konu Özeti
                        </button>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          background: badgeBg,
                          color: badgeColor
                        }}>
                          {badgeText}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>

                    {isExpanded && dayData && (
                      <div className="glass-card animate-scale-in" style={{
                        padding: '20px 24px',
                        borderRadius: '16px',
                        background: 'rgba(15, 23, 42, 0.55)',
                        border: '1.5px solid rgba(16, 185, 129, 0.2)',
                        marginTop: '-4px',
                        marginBottom: '10px',
                        textAlign: 'left'
                      }}>
                        <h5 style={{ fontSize: '0.88rem', fontWeight: 'bold', color: '#10b981', marginBottom: '12px' }}>
                          📝 {dayData.title} - Konu Anlatım Özeti
                        </h5>
                        <p style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {dayData.lecture}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Mode Switcher for Çıkmış Kelimeler */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '4px', maxWidth: '500px', margin: '0 auto 20px auto' }}>
            <button
              onClick={() => setCikmisMode('swipe')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                background: cikmisMode === 'swipe' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                border: cikmisMode === 'swipe' ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                color: cikmisMode === 'swipe' ? '#fca5a5' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              🎴 Hızlı Kart Pratiği
            </button>
            <button
              onClick={() => setCikmisMode('detailed')}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                background: cikmisMode === 'detailed' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: cikmisMode === 'detailed' ? '1px solid rgba(99, 102, 241, 0.3)' : 'none',
                color: cikmisMode === 'detailed' ? '#a5b4fc' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              🧠 Detaylı Kelime Kampı
            </button>
          </div>

          {/* Çıkmış Kelimeler Camp Menu Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '12px', borderRadius: '12px', color: '#ef4444' }}>
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>İlerleme</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>{cikmisDoneCount} / 60 Gün</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '12px', borderRadius: '12px', color: '#ef4444' }}>
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Aktif Hedef</span>
                <strong style={{ fontSize: '1.25rem', color: 'white', display: 'block' }}>Gün #{currentCikmisDay}</strong>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.12)', padding: '12px', borderRadius: '12px', color: '#3b82f6' }}>
                <Sparkles className="h-6 w-6" />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Kelime İstatistikleri</span>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold' }}>{stats.correct} D</span>
                  <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{stats.wrong} Y</span>
                  <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>{stats.unstudied} B</span>
                  <span style={{ color: '#cbd5e1', fontWeight: '600' }}>({stats.total} Toplam)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Start Çıkmış Kelimeler Camp Card */}
          <div className="glass-card text-center" style={{ padding: '30px 20px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(99, 102, 241, 0.04) 100%)', border: '1.5px solid rgba(239, 68, 68, 0.25)', marginBottom: '24px' }}>
            {cikmisMode === 'swipe' ? (
              <>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'white', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  🎴 Hızlı Kart Pratiği
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '520px', margin: '8px auto 20px auto', lineHeight: 1.5 }}>
                  Biliyorum / Bilmiyorum formatında kaydırmalı kartlarla hızlı pratik yaparak kelimeleri hafızanıza atın.
                </p>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'white', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  🧠 Detaylı Kelime Kampı
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '520px', margin: '8px auto 20px auto', lineHeight: 1.5 }}>
                  Kart Kaydırma ➔ Eşleştirme ➔ İngilizce-Türkçe Test ➔ Türkçe-İngilizce Test ➔ Örnek Cümle Tamamlama adımlarıyla tam akademik öğrenim.
                </p>
              </>
            )}

            {(() => {
              const completedObj = cikmisDoneMap[currentCikmisDay];
              const isModeCompleted = completedObj ? (
                cikmisMode === 'swipe' 
                  ? (completedObj.swipeCompleted !== undefined ? completedObj.swipeCompleted : true)
                  : (completedObj.detailedCompleted !== undefined ? completedObj.detailedCompleted : true)
              ) : false;
              const score = completedObj ? (cikmisMode === 'swipe' ? completedObj.swipeScore || completedObj.score : completedObj.detailedScore || completedObj.score) : null;
              
              if (isModeCompleted) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.94rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      🎉 Bugünün mod çalışmasını başarıyla tamamladınız! (Skor: %{score})
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        onClick={() => startCikmisStudy(currentCikmisDay, cikmisMode)}
                        className="btn-secondary"
                        style={{ padding: '8px 24px', fontSize: '0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        Modu Yeniden Başlat
                      </button>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          onClick={() => setShowExportDropdown(!showExportDropdown)}
                          className="btn-primary"
                          style={{ padding: '8px 24px', fontSize: '0.8rem', borderRadius: '10px', cursor: 'pointer', background: '#3b82f6', borderColor: '#3b82f6', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          📤 Karne Raporunu Dışarı Aktar
                        </button>
                        {showExportDropdown && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            marginTop: '8px',
                            background: '#151c2c',
                            border: '1.5px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                            zIndex: 50,
                            minWidth: '220px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            <div 
                              onClick={() => { onExportCikmisData('pdf'); setShowExportDropdown(false); }}
                              className="hover-card"
                              style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#a7f3d0', textAlign: 'left' }}
                            >
                              <span>📄</span> PDF Belgesi (.pdf)
                            </div>
                            <div 
                              onClick={() => { onExportCikmisData('docx'); setShowExportDropdown(false); }}
                              className="hover-card"
                              style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#93c5fd', textAlign: 'left' }}
                            >
                              <span>📝</span> Microsoft Word (.docx)
                            </div>
                            <div 
                              onClick={() => { onExportCikmisData('xlsx'); setShowExportDropdown(false); }}
                              className="hover-card"
                              style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#fde047', textAlign: 'left' }}
                            >
                              <span>📊</span> Microsoft Excel (.xlsx)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button
                      onClick={() => startCikmisStudy(currentCikmisDay, cikmisMode)}
                      className="btn-primary"
                      style={{ padding: '12px 30px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', background: cikmisMode === 'swipe' ? '#ef4444' : '#6366f1', borderColor: cikmisMode === 'swipe' ? '#ef4444' : '#6366f1' }}
                    >
                      Gün #{currentCikmisDay} Çalışmasını Başlat <ArrowRight className="h-4 w-4" />
                    </button>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <button
                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                        className="btn-secondary"
                        style={{ padding: '12px 24px', fontSize: '0.9rem', fontWeight: 'bold', borderRadius: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                      >
                        📤 Karne Raporunu Dışarı Aktar
                      </button>
                      {showExportDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          marginTop: '8px',
                          background: '#151c2c',
                          border: '1.5px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          zIndex: 50,
                          minWidth: '220px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <div 
                            onClick={() => { onExportCikmisData('pdf'); setShowExportDropdown(false); }}
                            className="hover-card"
                            style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#a7f3d0', textAlign: 'left' }}
                          >
                            <span>📄</span> PDF Belgesi (.pdf)
                          </div>
                          <div 
                            onClick={() => { onExportCikmisData('docx'); setShowExportDropdown(false); }}
                            className="hover-card"
                            style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#93c5fd', textAlign: 'left' }}
                          >
                            <span>📝</span> Microsoft Word (.docx)
                          </div>
                          <div 
                            onClick={() => { onExportCikmisData('xlsx'); setShowExportDropdown(false); }}
                            className="hover-card"
                            style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: '#fde047', textAlign: 'left' }}
                          >
                            <span>📊</span> Microsoft Excel (.xlsx)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            })()}
          </div>

          {/* Çıkmış Kelimeler 60 Day List Panels */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Günlük Kamp Listesi ({cikmisMode === 'swipe' ? 'Pratik' : 'Detaylı'})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: 60 }).map((_, i) => {
                const dayNum = i + 1;
                const completedObj = cikmisDoneMap[dayNum];
                
                const isCompleted = completedObj ? (
                  cikmisMode === 'swipe'
                    ? (completedObj.swipeCompleted !== undefined ? !!completedObj.swipeCompleted : true)
                    : (completedObj.detailedCompleted !== undefined ? !!completedObj.detailedCompleted : true)
                ) : false;

                const isPassed = completedObj ? (
                  cikmisMode === 'swipe'
                    ? (completedObj.swipePassed !== undefined ? !!completedObj.swipePassed : true)
                    : (completedObj.detailedPassed !== undefined ? !!completedObj.detailedPassed : true)
                ) : false;

                const score = completedObj ? (
                  cikmisMode === 'swipe' 
                    ? (completedObj.swipeScore !== undefined ? completedObj.swipeScore : completedObj.score)
                    : (completedObj.detailedScore !== undefined ? completedObj.detailedScore : completedObj.score)
                ) : null;

                const isActive = dayNum === currentCikmisDay;

                let border = '1px solid rgba(255, 255, 255, 0.06)';
                let bg = 'rgba(255, 255, 255, 0.02)';
                let badgeText = 'Tamamlanmadı';
                let badgeBg = 'rgba(255, 255, 255, 0.05)';
                let badgeColor = '#94a3b8';

                if (isCompleted) {
                  if (isPassed) {
                    bg = 'rgba(16, 185, 129, 0.05)';
                    border = '1px solid rgba(16, 185, 129, 0.25)';
                    badgeText = `Tamamlandı (%${score})`;
                    badgeBg = 'rgba(16, 185, 129, 0.15)';
                    badgeColor = '#34d399';
                  } else {
                    bg = 'rgba(239, 68, 68, 0.05)';
                    border = '1px solid rgba(239, 68, 68, 0.25)';
                    badgeText = `Tekrar Gerekli (%${score})`;
                    badgeBg = 'rgba(239, 68, 68, 0.15)';
                    badgeColor = '#f87171';
                  }
                } else if (isActive) {
                  bg = 'rgba(239, 68, 68, 0.05)';
                  border = '1.5px solid rgba(239, 68, 68, 0.4)';
                  badgeText = 'Sıradaki Gün';
                  badgeBg = 'rgba(239, 68, 68, 0.15)';
                  badgeColor = '#fca5a5';
                }

                const resultsMap = completedObj ? (
                  cikmisMode === 'swipe'
                    ? completedObj.swipeResults || completedObj.resultsMap || {}
                    : completedObj.detailedResults || completedObj.resultsMap || {}
                ) : {};

                const knownCount = Object.values(resultsMap).filter(v => v === true).length;
                const unknownCount = Object.values(resultsMap).filter(v => v === false).length;
                const isExpanded = expandedCikmisDay === dayNum;

                return (
                  <div key={dayNum} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div
                      onClick={() => {
                        if (isCompleted) {
                          if (showConfirm) {
                            showConfirm(
                              "Bu günü daha önce tamamladınız. Yeniden çözmek ister misiniz?\n(Yeni çalışmanız geçmişte v2/v3... olarak saklanacaktır. Rapor kartını görmek için İptal seçiniz.)",
                              () => startCikmisStudy(dayNum, cikmisMode),
                              () => {
                                setReportCardType('cikmis_kelimeler');
                                setReportCardDay(dayNum);
                              }
                            );
                          } else {
                            const restart = window.confirm("Bu günü daha önce tamamladınız. Yeniden çözmek ister misiniz?\n(Yeni çalışmanız geçmişte v2/v3... olarak saklanacaktır. Rapor kartını görmek için İptal seçiniz.)");
                            if (restart) startCikmisStudy(dayNum, cikmisMode);
                            else {
                              setReportCardType('cikmis_kelimeler');
                              setReportCardDay(dayNum);
                            }
                          }
                        } else {
                          startCikmisStudy(dayNum, cikmisMode);
                        }
                      }}
                      style={{
                        background: bg,
                        border: border,
                        borderRadius: '16px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        gap: '12px'
                      }}
                      className="hover-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isActive ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: isActive ? '#fca5a5' : 'white', fontSize: '1.05rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                          {dayNum}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <h4 style={{ fontSize: '0.94rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                            Çıkmış Kelimeler {dayNum}. Gün
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '2px' }}>
                            {cikmisMode === 'swipe' ? 'Kaydırmalı Kart Pratiği' : 'Detaylı Kelime Çalışma Aşamaları'}
                          </span>
                          {isCompleted && (
                            <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'block', marginTop: '4px', fontWeight: '600' }}>
                              {cikmisMode === 'swipe' ? (
                                <>🟢 Bilinen: {knownCount} | 🔴 Bilinmeyen: {unknownCount}</>
                              ) : (
                                <>🟢 Doğru: {knownCount} | 🔴 Yanlış: {unknownCount}</>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCikmisDay(isExpanded ? null : dayNum);
                            }}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              background: 'rgba(99, 102, 241, 0.15)',
                              border: '1px solid rgba(99, 102, 241, 0.4)',
                              color: '#a5b4fc',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isExpanded ? '👁️ Detay Kapat' : '🔍 Detay Göster'}
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportCardType('cikmis_kelimeler');
                            setReportCardDay(dayNum);
                          }}
                          disabled={!isCompleted}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            background: isCompleted ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                            border: isCompleted ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)',
                            color: isCompleted ? '#fca5a5' : '#475569',
                            cursor: isCompleted ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          📊 Karne
                        </button>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 'bold',
                          background: badgeBg,
                          color: badgeColor
                        }}>
                          {badgeText}
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                    {isExpanded && isCompleted && (
                      <div className="glass-card animate-scale-in" style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: 'rgba(15, 23, 42, 0.55)',
                        border: '1.5px solid rgba(255, 255, 255, 0.08)',
                        marginTop: '-4px',
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                          <div>
                            <h5 style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              🟢 {cikmisMode === 'swipe' ? 'Bildiğim Kelimeler' : 'Doğru Kelimeler'} ({knownCount})
                            </h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                              {(() => {
                                const dayWords = (cikmisPlanData && cikmisPlanData[String(dayNum)]) || [];
                                const knownList = dayWords.filter(w => {
  if (!w) return false;
  const eng = typeof w === 'string' ? w : w.english;
  return resultsMap[eng] !== false;
});
                                if (knownList.length === 0) return <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>Hiç yok</span>;
                                return knownList.map((w, idx) => (
                                  <div key={idx} style={{ fontSize: '0.78rem', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <strong style={{ color: 'white', minWidth: '90px' }}>{w.english}</strong>
                                    <span style={{ color: '#94a3b8', flex: 1, textAlign: 'right' }}>{renderTurkishMeaningsList(w.turkish)}</span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          <div>
                            <h5 style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#f87171', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              🔴 {cikmisMode === 'swipe' ? 'Bilmediğim Kelimeler' : 'Yanlış/Eksik Kelimeler'} ({unknownCount})
                            </h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }} className="custom-scrollbar">
                              {(() => {
                                const dayWords = (cikmisPlanData && cikmisPlanData[String(dayNum)]) || [];
                                const unknownList = dayWords.filter(w => {
  if (!w) return false;
  const eng = typeof w === 'string' ? w : w.english;
  return resultsMap[eng] === false;
});
                                if (unknownList.length === 0) return <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>Hiç yok</span>;
                                return unknownList.map((w, idx) => (
                                  <div key={idx} style={{ fontSize: '0.78rem', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                    <strong style={{ color: 'white', minWidth: '90px' }}>{w.english}</strong>
                                    <span style={{ color: '#94a3b8', flex: 1, textAlign: 'right' }}>{renderTurkishMeaningsList(w.turkish)}</span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showGeneralReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 15, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }} onClick={() => setShowGeneralReport(false)}>
          <div className="glass-card animate-scale-in" style={{
            width: '100%',
            maxWidth: '520px',
            borderRadius: '24px',
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1.5px solid rgba(255, 255, 255, 0.08)',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(251, 191, 36, 0.12)', padding: '10px', borderRadius: '12px', color: '#fbbf24' }}>
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: 'white', margin: 0 }}>Genel Kamp Karnesi 📊</h3>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {selectedCategory === 'fen' ? 'Fen Bilimleri' : selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri'}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowGeneralReport(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Tamamlanan Günler</span>
                <strong style={{ fontSize: '1.5rem', color: 'white' }}>{genStats.totalCompleted} / 60</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Başarı Ortalaması</span>
                <strong style={{ fontSize: '1.5rem', color: '#34d399' }}>%{genStats.avgScore}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Başarılı Günler</span>
                <strong style={{ fontSize: '1.5rem', color: '#10b981' }}>{genStats.passedDaysCount} Gün</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Tekrar Gereken</span>
                <strong style={{ fontSize: '1.5rem', color: '#f43f5e' }}>{genStats.failedDaysCount} Gün</strong>
              </div>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1.5px solid rgba(99, 102, 241, 0.15)', borderRadius: '18px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', color: '#a5b4fc' }}>
                <Sparkles className="h-5 w-5" />
                <span style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>Yapay Zeka Karne Analizi</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                {genStats.totalCompleted === 0 
                  ? "Henüz kampa başlamadınız. Günlük kelime çalışmalarını tamamladıkça burası sizin için detaylı başarı analizleri üretecektir!" 
                  : `Tebrikler! Kampın %${Math.round((genStats.totalCompleted / 60) * 100)}'lik kısmını geride bıraktınız. %${genStats.avgScore} başarı ortalaması ile ilerliyorsunuz. ${genStats.failedDaysCount > 0 ? `${genStats.failedDaysCount} günü tekrar etmeniz kelime haznenizi daha da güçlendirecektir.` : 'Harika! Şu ana kadar hata yapmadan tertemiz ilerlediniz!'}`}
              </p>
            </div>

            <button onClick={() => setShowGeneralReport(false)} className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Kapat ve Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampDashboard;
