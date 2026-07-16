import React from 'react';

const AchievementsSection = ({
  activeTab,
  selectedCategory,
  achievementCategoryFilter,
  setAchievementCategoryFilter,
  achievementStatusFilter,
  setAchievementStatusFilter,
  getFilteredAchievements
}) => {
  if (activeTab !== 'achievements' || !selectedCategory) return null;

  return (
    <section id="screen-achievements" className="app-screen active space-y-6">
      <div style={{ padding: '0 8px', textAlign: 'left', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
          AKADEMİK BAŞARILARINIZ
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: 0 }}>
          🏆 Başarı Rozetleriniz & Koleksiyonunuz
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '6px', margin: 0 }}>
          Soru çözerek, kelime ezberleyerek ve günlük serinizi devam ettirerek kilitleri açın ve ödüller kazanın!
        </p>
      </div>

      {/* Filters Row */}
      <div style={{
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        padding: '0 8px',
        marginBottom: '8px'
      }}>
        {/* Category Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#94a3b8' }}>Kategori Seçin</label>
          <select
            value={achievementCategoryFilter}
            onChange={(e) => setAchievementCategoryFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,23,42,0.6)',
              color: 'white',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tüm Kategoriler 📂</option>
            <option value="first_step">Soru Avcısı 🏁</option>
            <option value="correct_strike">İsabet Şampiyonu 🎯</option>
            <option value="word_master">Kelime Sihirbazı 🦁</option>
            <option value="grammar_master">Dilbilgisi Ustası 📚</option>
            <option value="on_fire">Günlük Seri 🔥</option>
            <option value="gem_collector">Cevher Koleksiyoneri 💎</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '180px' }}>
          <label style={{ fontSize: '0.68rem', fontWeight: 'bold', color: '#94a3b8' }}>Durum</label>
          <select
            value={achievementStatusFilter}
            onChange={(e) => setAchievementStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(15,23,42,0.6)',
              color: 'white',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">Tümü (Hepsi) 🌟</option>
            <option value="completed">Başarılanlar ✔️</option>
            <option value="incomplete">Başarılmayanlar 🔒</option>
          </select>
        </div>
      </div>

      <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(251, 191, 36, 0.15)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
          {getFilteredAchievements().map(ach => {
            const tier = ach.tier;
            return (
              <div
                key={ach.id}
                style={{
                  background: tier.completed ? 'rgba(99, 102, 241, 0.06)' : 'rgba(255, 255, 255, 0.01)',
                  border: tier.completed ? '1.5px solid rgba(251, 191, 36, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  padding: '24px 20px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px', filter: tier.completed ? 'none' : 'grayscale(100%) opacity(0.5)' }}>
                    {tier.completed ? '🏆' : '🔒'}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white', margin: '0 0 6px 0' }}>{ach.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>{ach.desc}</p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 'bold' }}>
                    <span style={{ color: tier.completed ? '#fbbf24' : '#64748b' }}>{tier.tierName}</span>
                    <span style={{ color: '#94a3b8' }}>{ach.value} / {tier.nextTarget}</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${tier.progress}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
