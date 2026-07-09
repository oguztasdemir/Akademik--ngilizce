import React, { useState } from 'react';
import { Trophy, TrendingUp, Award, BookOpen, Activity, CheckCircle2, XCircle, Sparkles, Gamepad2, Layers, BookOpenCheck, HelpCircle } from 'lucide-react';

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
  const [perfTab, setPerfTab] = useState('summary'); // 'summary', 'cikmis', 'daily', 'book', 'reading', 'games'
  
  if (activeTab !== 'performance') return null;

  // Retrieve progress files from localStorage
  const getProgress = (key, defaultVal) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const cikmisProgress = getProgress('yokdil_cikmis_camp_progress', { currentDay: 1, completedDays: {} });
  const dailyProgress = getProgress('yokdil_camp_progress', { currentDay: 1, completedDays: {} });
  const grammarProgress = getProgress('yokdil_grammar_camp_progress', { currentDay: 1, completedDays: {} });
  const completedPassages = getProgress('completed_passages', []);
  const bookCompletedDays = getProgress('completed_yds_days', []);

  const stats = getStats();

  // Calculations
  const cikmisDoneDays = Object.keys(cikmisProgress.completedDays || {}).length;
  const dailyDoneDays = Object.keys(dailyProgress.completedDays || {}).length;
  const grammarDoneDays = Object.keys(grammarProgress.completedDays || {}).length;

  return (
    <div className="space-y-6 text-left" style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', borderRadius: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity style={{ color: '#6366f1' }} size={24} /> Kişisel Gelişim Karnesi
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Tüm çalışma istatistiklerinizi ve ilerlemenizi tek bir panelden takip edin.</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'summary', label: 'Genel Özet', icon: Layers },
          { id: 'cikmis', label: 'Kelime Kampı (Çıkmış)', icon: Trophy },
          { id: 'daily', label: 'Günlük Kamp', icon: Sparkles },
          { id: 'book', label: 'YDS Kitap', icon: BookOpenCheck },
          { id: 'reading', label: 'Paragraflar & Okuma', icon: BookOpen },
          { id: 'games', label: 'Mini Oyunlar', icon: Gamepad2 }
        ].map(t => {
          const Icon = t.icon;
          const isActive = perfTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setPerfTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                color: isActive ? '#a5b4fc' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Summary Tab */}
      {perfTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Stats KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyAllign: 'center', justifyContent: 'center' }}>
                <Trophy style={{ color: '#818cf8' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Kelime Kampı</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cikmisDoneDays} / 60 Gün</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ color: '#34d399' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Günlük Kamp</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dailyDoneDays} / 60 Gün</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen style={{ color: '#f472b6' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Okunan Makale</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{completedPassages.length} Makale</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award style={{ color: '#fbbf24' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Çözülen Deneme</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{stats.solved} Sınav</div>
              </div>
            </div>
          </div>

          {/* Test Performance Detailed Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 16px 0' }}>
                <TrendingUp size={18} style={{ color: '#6366f1' }} /> Genel Gelişim Detayları
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Toplam Çözülen Soru</span>
                    <span style={{ fontWeight: 'bold' }}>{stats.solved * 80} Soru</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                    <div style={{ width: stats.solved > 0 ? '100%' : '0%', height: '100%', background: '#6366f1', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Dilbilgisi Kampı İlerlemesi</span>
                    <span style={{ fontWeight: 'bold' }}>{grammarDoneDays} / 60 Gün</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                    <div style={{ width: `${(grammarDoneDays / 60) * 100}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>YDS Kitap Çalışmaları</span>
                    <span style={{ fontWeight: 'bold' }}>{bookCompletedDays.length} Gün Tamamlandı</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                    <div style={{ width: `${(bookCompletedDays.length / 54) * 100}%`, height: '100%', background: '#fb923c', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="transparent" />
                  <circle cx="60" cy="60" r="45" stroke="#6366f1" strokeWidth="8" fill="transparent"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 - (stats.solved > 0 ? (stats.correct / (stats.solved * 80)) : 0) * 2 * Math.PI * 45}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {stats.solved > 0 ? Math.round((stats.correct / (stats.solved * 80)) * 100) : 0}%
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#94a3b8', textTransform: 'uppercase' }}>Doğru Oranı</div>
                </div>
              </div>
              <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.72rem', color: '#cbd5e1' }}>
                Sınavlarda toplam <strong>{stats.correct}</strong> doğru ve <strong>{stats.wrong}</strong> yanlış yapıldı.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cikmis Vocabulary Camp Performance Tab */}
      {perfTab === 'cikmis' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Kelime Kampı (Çıkmış Sorulardan Kelimeler) Gelişimi</h3>
            <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 'bold' }}>{cikmisDoneDays} / 60 Gün Tamamlandı</span>
          </div>

          {cikmisDoneDays === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış gün bulunmuyor.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(cikmisProgress.completedDays).map(([dayNum, record]) => {
                const history = record.history || [];
                return (
                  <div key={dayNum} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅 Gün {dayNum} Akademik Kelimeleri</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', background: record.isPassed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: record.isPassed ? '#a7f3d0' : '#fca5a5' }}>
                          {record.isPassed ? 'Başarılı' : 'Başarısız'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                        Son Çözüm Tarihi: {record.date} | Toplam Deneme Sayısı: {history.length || 1} (v{history.length || 1})
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#818cf8' }}>%{record.score}</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>En Yüksek Skor</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Daily Vocabulary Camp Tab */}
      {perfTab === 'daily' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Günlük Spaced Repetition Kamp İlerlemesi</h3>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 'bold' }}>{dailyDoneDays} / 60 Gün Tamamlandı</span>
          </div>

          {dailyDoneDays === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış gün bulunmuyor.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(dailyProgress.completedDays).map(([dayNum, record]) => (
                <div key={dayNum} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>📅 Gün {dayNum} Çalışması</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Tamamlanma Tarihi: {record.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>%{record.score}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Çözüm Skoru</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* YDS Book Exercises Tab */}
      {perfTab === 'book' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>YDS Kitap Alıştırmaları Gelişimi</h3>
            <span style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 'bold' }}>{bookCompletedDays.length} Gün Tamamlandı</span>
          </div>

          {bookCompletedDays.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış gün bulunmuyor.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {bookCompletedDays.map(dayNum => (
                <div key={dayNum} style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: '#fb923c' }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Gün {dayNum}</div>
                    <div style={{ fontSize: '0.62rem', color: '#cbd5e1' }}>Alıştırmalar Bitti</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reading Passages Tab */}
      {perfTab === 'reading' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Okunan Paragraflar ve Makaleler</h3>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 'bold' }}>{completedPassages.length} Makale Okundu</span>
          </div>

          {completedPassages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış makale bulunmuyor.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {completedPassages.map(pId => (
                <div key={pId} style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={18} style={{ color: '#38bdf8' }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Makale #{pId}</div>
                    <div style={{ fontSize: '0.62rem', color: '#cbd5e1' }}>Okuma Tamamlandı</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mini Games Tab */}
      {perfTab === 'games' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Mini Oyun Rekorları & Aktiviteleri</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gamepad2 size={16} /> Kart Eşleştirme Oyunu
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Kelimeleri sol-sağ paneller halinde en az hamle ile eşleştirin. Evcil hayvanınızın XP gelişimine doğrudan etki eder.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#818cf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gamepad2 size={16} /> Eş Anlamlı Kelimeler
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Kelimelerin akademik eş anlamlarını bularak doğru cevap sayısını ve puanınızı artırın.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceSection;
