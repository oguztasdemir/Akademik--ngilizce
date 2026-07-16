import React from 'react';
import { Play } from 'lucide-react';

const DashboardSection = ({
  currentUser,
  selectedCategory,
  activeTab,
  studyStreak,
  yokdilExamDate,
  setYokdilExamDate,
  examDateInputRef,
  mascotState,
  petConfig,
  petLevel,
  dailyQuestionsSolved,
  dailyWordsStudied,
  dailyLecturesStudied,
  dailyQuestionGoal,
  dailyWordGoal,
  notebook,
  setSpacedRepetitionModalWord,
  getAchievementsList,
  getAchievementTier,
  activeOutfit,
  setActiveOutfit,
  stats,
  setActiveTab,
  ROOM_BACKGROUNDS,
  MascotPet
}) => {
  if (activeTab !== 'dashboard' || !selectedCategory) return null;

  return (
    <section id="screen-dashboard" className="app-screen active">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'stretch', flexWrap: 'wrap', marginBottom: '20px' }}>
        {/* Left Side: Welcome text */}
        <div className="welcome-card text-left" style={{ flex: 1, minWidth: '280px', margin: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2>Selam, {currentUser?.name || 'Öğrenci'}! 👋</h2>
            <p>YÖKDİL {selectedCategory === 'fen' ? 'Fen Bilimleri' : selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : selectedCategory === 'saglik' ? 'Sağlık Bilimleri' : 'Özelleştirilmiş Kelime Kampı'} hazırlık performansın aşağıda listelenmiştir.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.25)', padding: '10px 16px', borderRadius: '16px' }}>
            <span style={{ fontSize: '1.8rem' }}>🔥</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#ff7849' }}>{studyStreak} Gün Seri!</span>
              <span style={{ fontSize: '0.62rem', color: '#fbd38d' }}>Harikasın! Seriyi bozma</span>
            </div>
          </div>
        </div>

        {/* YÖKDİL Countdown Card */}
        <div className="glass-card" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '16px 20px',
          borderRadius: '18px',
          minWidth: '280px',
          flex: '0.8',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(15, 23, 42, 0.2)',
          textAlign: 'left'
        }}>
          {/* Circle Timer */}
          <div style={{ position: 'relative', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--primary-light)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="175.9"
                strokeDashoffset={(() => {
                  if (!yokdilExamDate) return "175.9";
                  const examTime = new Date(yokdilExamDate).getTime();
                  const now = new Date().getTime();
                  const diff = examTime - now;
                  if (diff <= 0) return "0";
                  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                  const percent = Math.max(0, Math.min(100, (days / 120) * 100)); // assume 120 days max range
                  return (175.9 - (175.9 * percent) / 100).toFixed(1);
                })()}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', fontSize: '0.78rem', fontWeight: '900', color: 'white' }}>
              {(() => {
                if (!yokdilExamDate) return "0";
                const diff = new Date(yokdilExamDate).getTime() - new Date().getTime();
                const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                return days > 0 ? `${days}G` : "Sınav";
              })()}
            </div>
          </div>

          <div 
            style={{ display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' }}
            onClick={() => {
              if (examDateInputRef?.current) {
                try {
                  examDateInputRef.current.showPicker();
                } catch (e) {
                  examDateInputRef.current.click();
                }
              }
            }}
            title="Sınav tarihini belirlemek veya değiştirmek için tıklayın"
          >
            <span style={{ fontSize: '0.64rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>YÖKDİL Geri Sayım ⏰ (Tıkla Seç)</span>
            <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
              {yokdilExamDate ? (
                <>
                  Hedef Sınav Tarihi: <strong>{new Date(yokdilExamDate).toLocaleDateString('tr-TR')}</strong>. Değiştirmek için tıklayın.
                </>
              ) : (
                <>
                  <span style={{ color: '#fca5a5', fontWeight: 'bold' }}>Henüz sınav tarihi seçmediniz.</span> Seçmek için buraya tıklayın!
                </>
              )}
            </p>
            <input
              type="date"
              ref={examDateInputRef}
              value={yokdilExamDate || ''}
              onChange={(e) => setYokdilExamDate(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Right Side: Bilge Baykuş Study Buddy Mascot */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px 20px',
            borderRadius: '18px',
            minWidth: '280px',
            flex: '0.8',
            border: `1px solid ${ROOM_BACKGROUNDS[petConfig.background]?.border || 'rgba(255, 255, 255, 0.05)'}`,
            background: ROOM_BACKGROUNDS[petConfig.background]?.gradient || 'rgba(255,255,255,0.01)',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MascotPet
              state={mascotState}
              speech={null}
              customConfig={petConfig}
              size={56 + Math.min(40, petLevel * 4)}
              isFloating={false}
            />
          </div>
          {/* Name & Speech */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'white' }}>
              {petConfig.name || 'Bilge'}
            </span>

            <p style={{ fontSize: '0.74rem', color: '#e2e8f0', margin: 0, fontStyle: 'italic', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {(() => {
                const solvedAll = dailyQuestionsSolved >= 20 && dailyWordsStudied >= 10 && dailyLecturesStudied >= 1;
                if (solvedAll) return "İnanılmazsın! Bugünün tüm hedeflerini tamamladın. Yarın da bu seriyi devam ettirelim! 🔥";
                if (dailyQuestionsSolved > 0 || dailyWordsStudied > 0 || dailyLecturesStudied > 0) return "Harika gidiyorsun! Günlük hedefleri tamamlamaya çok az kaldı, pes etme! 💪";
                return "Bugün henüz ders çalışmadın. Haydi, ilk kelimeni öğrenerek başlayalım! 📖";
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK FLASHCARD WIDGET */}
      <div className="glass-card text-left" style={{ marginBottom: '20px', padding: '16px 20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(99, 102, 241, 0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '480px' }}>
          <span style={{ fontSize: '0.64rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 Hızlı Kelime Hatırlatıcısı (Spaced Repetition)</span>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'white', margin: '4px 0 0 0' }}>
            {(() => {
              const wordsInNotebook = notebook || [];
              if (wordsInNotebook.length > 0) {
                const word = wordsInNotebook[0];
                return `"${word.english}" kelimesinin Türkçe anlamını hatırlıyor musunuz?`;
              }
              return `"${"mitigate"}" kelimesinin Türkçe anlamını hatırlıyor musunuz?`;
            })()}
          </h4>
        </div>
        <button
          onClick={() => {
            const wordsInNotebook = notebook || [];
            if (wordsInNotebook.length > 0) {
              setSpacedRepetitionModalWord(wordsInNotebook[0]);
            } else {
              setSpacedRepetitionModalWord({ english: 'mitigate', turkish: 'hafifletmek, azaltmak' });
            }
          }}
          className="btn-primary"
          style={{ padding: '8px 16px', fontSize: '0.72rem', cursor: 'pointer' }}
        >
          Anlamı Gör 👀
        </button>
      </div>

      {/* DAILY GOALS PANEL */}
      <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🎯 Günlük Hedefleriniz
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Goal 1: Questions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '600', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)' }}>Soru Çözme Hedefi (Günlük)</span>
              <span style={{ color: dailyQuestionsSolved >= dailyQuestionGoal ? '#34d399' : 'var(--text-secondary)', fontWeight: '700' }}>
                {dailyQuestionsSolved} / {dailyQuestionGoal} {dailyQuestionsSolved >= dailyQuestionGoal && '✓'}
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (dailyQuestionsSolved / dailyQuestionGoal) * 100)}%`,
                background: dailyQuestionsSolved >= dailyQuestionGoal ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Goal 2: Words */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '600', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)' }}>Kelime Çalışma Hedefi (Günlük)</span>
              <span style={{ color: dailyWordsStudied >= dailyWordGoal ? '#34d399' : 'var(--text-secondary)', fontWeight: '700' }}>
                {dailyWordsStudied} / {dailyWordGoal} {dailyWordsStudied >= dailyWordGoal && '✓'}
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (dailyWordsStudied / dailyWordGoal) * 100)}%`,
                background: dailyWordsStudied >= dailyWordGoal ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* Goal 3: Lectures */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: '600', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-main)' }}>Ders Tamamlama Hedefi (Günlük)</span>
              <span style={{ color: dailyLecturesStudied >= 1 ? '#34d399' : 'var(--text-secondary)', fontWeight: '700' }}>
                {dailyLecturesStudied} / 1 {dailyLecturesStudied >= 1 && '✓'}
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (dailyLecturesStudied / 1) * 100)}%`,
                background: dailyLecturesStudied >= 1 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #6366f1, #818cf8)',
                borderRadius: '4px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>
        </div>

        {dailyQuestionsSolved >= dailyQuestionGoal && dailyWordsStudied >= dailyWordGoal && dailyLecturesStudied >= 1 && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            color: '#34d399',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🎉 Tebrikler! Bugünün tüm hedeflerini tamamlayıp rozet kazandınız!
          </div>
        )}
      </div>

      {/* DAILY QUESTS & LEADERBOARD GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Daily Quests Card */}
        <div className="glass-card p-5 border border-white/5 rounded-2xl text-left" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 Günlük Görevleriniz
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Soru Havuzunu Erit', desc: 'Bugün en az 10 soru çözün.', progress: dailyQuestionsSolved, target: 10, reward: '+50 Kristal' },
              { name: 'Akademik Kelime Çalış', desc: 'Bugün en az 5 kelime çalışın.', progress: dailyWordsStudied, target: 5, reward: '+20 Kristal' },
              { name: 'Konu Anlatımı Oku', desc: 'Bugün en az 1 ders notu tamamlayın.', progress: dailyLecturesStudied, target: 1, reward: '+100 Kristal' }
            ].map((quest, idx) => {
              const isDone = quest.progress >= quest.target;
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: isDone ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.01)', border: `1px solid ${isDone ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)'}`, borderRadius: '12px', opacity: isDone ? 0.75 : 1 }}>
                  <div>
                    <h4 style={{ fontSize: '0.76rem', fontWeight: 'bold', color: isDone ? '#34d399' : 'white', textDecoration: isDone ? 'line-through' : 'none' }}>{quest.name}</h4>
                    <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{quest.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: isDone ? '#34d399' : 'var(--primary-light)' }}>
                      {isDone ? 'Tamamlandı ✓' : `${quest.progress}/${quest.target}`}
                    </span>
                    <div style={{ fontSize: '0.55rem', color: '#fbbf24', fontWeight: 'bold' }}>{quest.reward}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yesterday's Study Report Card */}
        <div className="glass-card p-5 border border-white/5 rounded-2xl text-left" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Dünkü Çalışma Raporunuz
          </h3>
          {(() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
            const raw = localStorage.getItem('yokdil_study_history');
            const history = raw ? JSON.parse(raw) : {};
            const logs = history[yesterdayStr] || { questions: 0, words: 0, games: 0, paragraphs: 0 };
            const total = (logs.questions || 0) + (logs.words || 0) + (logs.games || 0) + (logs.paragraphs || 0);

            if (total === 0) {
              return (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '24px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Dün çalışma kaydı bulunmuyor.</span>
                  <span style={{ fontSize: '0.7rem', color: '#818cf8', marginTop: '6px' }}>Bugün harika bir başlangıç yapalım! 💪</span>
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Çözülen Soru</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#6366f1' }}>{logs.questions || 0} Adet</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Çalışılan Kelime</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#10b981' }}>{logs.words || 0} Adet</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Okunan Paragraf</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#fbbf24' }}>{logs.paragraphs || 0} Adet</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'rgba(99,102,241,0.05)', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.1)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'white', fontWeight: 'bold' }}>Toplam Aktivite</span>
                  <span style={{ fontSize: '0.76rem', fontWeight: '800', color: '#a5b4fc' }}>{total} Eylem</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ACHIEVEMENTS ROZETLER & WARDROBE CABINET */}
      <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏆 Başarı Rozetleriniz & Koleksiyonunuz
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', paddingRight: '6px' }}>
           {getAchievementsList().map(ach => {
            const tier = getAchievementTier(ach.id, ach.value, ach.target);
            return (
              <div
                key={ach.id}
                style={{
                  background: tier.completed ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                  border: tier.completed ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(255, 255, 255, 0.04)',
                  padding: '14px 12px',
                  borderRadius: '14px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{tier.completed ? '🌟' : '🔒'}</div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0' }}>{ach.name}</h4>
                  <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', margin: '0 0 8px 0', lineHeight: '1.2' }}>{ach.desc}</p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', fontWeight: 'bold' }}>
                    <span style={{ color: tier.completed ? '#cbd5e1' : 'var(--text-secondary)' }}>{tier.tierName}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{ach.value} / {tier.nextTarget}</span>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${tier.progress}%`, background: 'linear-gradient(90deg, #6366f1, #a5b4fc)', borderRadius: '3px' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WARDROBE CABINET: SELECT MASCOT OUTFITS */}
      <div className="glass-card p-6 border border-white/5 bg-white/1 rounded-2xl" style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🦉 Maskot Gardırobu & Özelleştirme
          </h3>
        </div>

        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '14px', textAlign: 'left' }}>
          Bilge Baykuş maskotunuza dilediğiniz kıyafeti seçin ve aktif görünümünü anında özelleştirin!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          {[
            { key: 'default', name: 'Standart Baykuş', emoji: '🦉' },
            { key: 'wizard', name: 'Büyücü Baykuş', emoji: '🧙‍♂️' },
            { key: 'scientist', name: 'Bilim İnsanı', emoji: '👨‍🔬' },
            { key: 'king', name: 'Kral Baykuş', emoji: '👑' },
            { key: 'scholar', name: 'Mezun Baykuş', emoji: '🎓' }
          ].map(outfit => {
            const isActive = activeOutfit === outfit.key;

            return (
              <div
                key={outfit.key}
                style={{
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? '#6366f1' : 'rgba(255,255,255,0.05)'}`,
                  padding: '12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isActive ? '0 0 10px rgba(99, 102, 241, 0.2)' : 'none'
                }}
              >
                <div style={{ fontSize: '1.8rem' }}>{outfit.emoji}</div>
                <div>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0' }}>{outfit.name}</h4>
                </div>

                {isActive ? (
                  <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '6px' }}>Aktif</span>
                ) : (
                  <button
                    onClick={() => {
                      setActiveOutfit(outfit.key);
                      localStorage.setItem('yokdil_active_outfit', outfit.key);
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-all cursor-pointer border-none"
                  >
                    Giy
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon correct"><i className="fa-solid fa-circle-check"></i></div>
          <div className="stat-info">
            <span className="stat-val">{stats.correct}</span>
            <span className="stat-lbl">Doğru Cevap</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon wrong"><i className="fa-solid fa-circle-xmark"></i></div>
          <div className="stat-info">
            <span className="stat-val">{stats.wrong}</span>
            <span className="stat-lbl">Yanlış Cevap</span>
          </div>
        </div>
        <div className="stat-card full-width">
          <div className="progress-ring-container">
            <div className="circular-progress" style={{ background: `conic-gradient(var(--primary-light) ${stats.solved > 0 ? (stats.correct / stats.solved) * 360 : 0}deg, var(--border-color) 0deg)` }}>
              <span className="progress-value">{stats.solved > 0 ? Math.round((stats.correct / stats.solved) * 100) : 0}%</span>
            </div>
          </div>
          <div className="progress-info text-left">
            <h3>Genel Başarı Oranın</h3>
            <p>{stats.solved > 0 ? `Toplam ${stats.solved} soru çözdünüz. Başarı yüzdeniz %${Math.round((stats.correct / stats.solved) * 100)}.` : 'Henüz test çözmeye başlamadın.'}</p>
          </div>
        </div>
      </div>

      <div className="action-card text-left" onClick={() => setActiveTab('tests')} style={{ marginBottom: '15px' }}>
        <div className="action-content">
          <h3><Play className="h-4 w-4 inline mr-1" /> Sınav Çözmeye Başla</h3>
          <p>YÖKDİL çıkmış sınavlarını çözmeye başla.</p>
        </div>
        <i className="fa-solid fa-chevron-right arrow-icon"></i>
      </div>
    </section>
  );
};

export default DashboardSection;
