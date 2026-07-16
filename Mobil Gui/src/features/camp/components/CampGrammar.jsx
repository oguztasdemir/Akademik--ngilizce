import React from 'react';
import { ArrowRight, Check, AlertCircle, Trophy } from 'lucide-react';

const CampGrammar = ({
  selectedDay,
  activeGrammarDay,
  phase,
  grammarIdx,
  grammarQuestions,
  grammarSelected,
  grammarChecked,
  grammarCorrect,
  correctAnswers,
  totalQuestions,
  grammarResults,
  handleGrammarNextLecture,
  handleGrammarCheck,
  handleGrammarNextQuestion,
  exitCamp,
  setActiveStudyInfo,
  startNextCampDay
}) => {
  if (!activeGrammarDay) {
    return <div style={{ color: 'white', padding: '20px' }}>Dilbilgisi verileri yükleniyor...</div>;
  }

  const [readConfirmed, setReadConfirmed] = React.useState(false);

  return (
    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px' }}>
      
      {/* Grammar Flow Header and Progress */}
      {!setActiveStudyInfo && (
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 'bold', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>GÜN #{selectedDay} DİLBİLGİSİ KAMPI</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'white', margin: 0 }}>{activeGrammarDay?.title}</h3>
            </div>
            
            {/* Grammar Progress Bar */}
            <div style={{ flex: 1, minWidth: '150px', maxWidth: '350px', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${phase === 3 ? 100 : (phase === 1 ? 33 : 33 + ((grammarIdx + 1) / (grammarQuestions.length || 5) * 66))}%`,
                background: 'linear-gradient(90deg, #10b981 0%, #6366f1 100%)',
                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* GRAMMAR PHASE 1: LECTURE CARD */}
      {phase === 1 && activeGrammarDay && (
        <div className="space-y-6 animate-scale-in">
          <div style={{ padding: '0 8px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '4px' }}>
              BUGÜNÜN KONUSU
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: 'white', margin: '0 0 20px 0' }}>
              {activeGrammarDay.title}
            </h2>
          </div>

          {(() => {
            const sections = activeGrammarDay.lecture.split('\n\n');
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sections.map((section, sIdx) => {
                  if (sIdx === 0 && !section.startsWith('1.') && !section.startsWith('2.') && !section.startsWith('3.')) {
                    // Render intro/overview card
                    return (
                      <div 
                        key={sIdx}
                        className="glass-card animate-scale-in" 
                        style={{ 
                          padding: '24px', 
                          borderRadius: '20px', 
                          background: 'rgba(15, 23, 42, 0.45)', 
                          border: '1.5px solid rgba(16, 185, 129, 0.15)',
                          textAlign: 'left'
                        }}
                      >
                        <p style={{ fontSize: '1.02rem', color: '#f1f5f9', lineHeight: 1.7, margin: 0, fontWeight: '500' }}>
                          {section}
                        </p>
                      </div>
                    );
                  }
                  
                  let sectionTitle = 'Genel Bilgi';
                  let sectionContent = section;
                  let borderLeftColor = '#10b981';
                  let bgGlow = 'rgba(16, 185, 129, 0.02)';
                  
                  if (section.includes('1. TEMEL KURALLAR VE FORMÜLLER:')) {
                    sectionTitle = '📘 1. Temel Kurallar & Formüller';
                    sectionContent = section.replace('1. TEMEL KURALLAR VE FORMÜLLER:', '').trim();
                    borderLeftColor = '#6366f1';
                    bgGlow = 'rgba(99, 102, 241, 0.05)';
                  } else if (section.includes('2. ÖRNEK AKADEMİK CÜMLELER:')) {
                    sectionTitle = '🔍 2. Örnek Akademik Cümleler';
                    sectionContent = section.replace('2. ÖRNEK AKADEMİK CÜMLELER:', '').trim();
                    borderLeftColor = '#10b981';
                    bgGlow = 'rgba(16, 185, 129, 0.05)';
                  } else if (section.includes('3. SINAV STRATEJİLERİ VE İPUÇLARI:')) {
                    sectionTitle = '💡 3. Sınav Stratejileri & İpuçları';
                    sectionContent = section.replace('3. SINAV STRATEJİLERİ VE İPUÇLARI:', '').trim();
                    borderLeftColor = '#fbbf24';
                    bgGlow = 'rgba(251, 191, 36, 0.05)';
                  } else {
                    // If it's a fallback block, display normally
                    return (
                      <div 
                        key={sIdx}
                        className="glass-card" 
                        style={{ 
                          padding: '20px 24px', 
                          borderRadius: '16px', 
                          background: 'rgba(255,255,255,0.02)', 
                          border: '1px solid rgba(255,255,255,0.06)',
                          textAlign: 'left'
                        }}
                      >
                        <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {section}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div 
                      key={sIdx}
                      className="glass-card animate-scale-in" 
                      style={{ 
                        padding: '22px 26px', 
                        borderRadius: '18px', 
                        background: bgGlow, 
                        border: '1.5px solid rgba(255, 255, 255, 0.04)',
                        borderLeft: `5px solid ${borderLeftColor}`,
                        textAlign: 'left'
                      }}
                    >
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 'bold', color: 'white', marginTop: 0, marginBottom: '12px', letterSpacing: '-0.01em' }}>
                        {sectionTitle}
                      </h4>
                      <p style={{ fontSize: '0.94rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {sectionContent}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#cbd5e1' }}>
              <input
                type="checkbox"
                checked={readConfirmed}
                onChange={(e) => setReadConfirmed(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#10b981', cursor: 'pointer' }}
              />
              Konu anlatımını okudum ve anladım.
            </label>
            <button
              onClick={handleGrammarNextLecture}
              disabled={!readConfirmed}
              className="btn-primary"
              style={{
                padding: '12px 28px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: readConfirmed ? 'pointer' : 'not-allowed',
                opacity: readConfirmed ? 1 : 0.5
              }}
            >
              Alıştırma Sorularına Geç <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* GRAMMAR PHASE 2: ACTIVE TESTING QUESTIONS */}
      {phase === 2 && grammarQuestions.length > 0 && grammarQuestions[grammarIdx] && (
        <div className="glass-card animate-fade-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>Soru {grammarIdx + 1} / {grammarQuestions.length}</span>
            <span>Doğru: {correctAnswers}</span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'white', fontWeight: '700', lineHeight: 1.5, margin: 0 }}>
              {grammarQuestions[grammarIdx].q}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {grammarQuestions[grammarIdx].options.map((opt, oIdx) => {
              const char = String.fromCharCode(65 + oIdx); // A, B, C, D
              const isSelected = grammarSelected === opt;
              const isCorrectOpt = opt === grammarQuestions[grammarIdx].answer;
              
              let bg = 'rgba(255, 255, 255, 0.02)';
              let border = '1px solid rgba(255, 255, 255, 0.06)';
              let color = '#cbd5e1';

              if (grammarChecked) {
                if (isCorrectOpt) {
                  bg = 'rgba(16, 185, 129, 0.12)';
                  border = '1px solid #10b981';
                  color = '#34d399';
                } else if (isSelected) {
                  bg = 'rgba(239, 68, 68, 0.12)';
                  border = '1px solid #ef4444';
                  color = '#f87171';
                } else {
                  bg = 'rgba(255, 255, 255, 0.01)';
                  color = '#64748b';
                }
              } else if (isSelected) {
                bg = 'rgba(99, 102, 241, 0.1)';
                border = '1px solid #6366f1';
                color = 'white';
              }

              return (
                <button
                  key={opt}
                  onClick={() => !grammarChecked && handleGrammarCheck(opt)}
                  disabled={grammarChecked}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    background: bg,
                    border: border,
                    color: color,
                    fontSize: '0.92rem',
                    fontWeight: isSelected ? '800' : '500',
                    cursor: grammarChecked ? 'default' : 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected ? '#6366f1' : 'rgba(255,255,255,0.05)',
                    color: isSelected ? 'white' : '#94a3b8',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {char}
                  </span>
                  <span style={{ flex: 1 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {grammarChecked && (
            <div className="animate-fade-in" style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 'bold', color: grammarCorrect ? '#34d399' : '#f87171' }}>
                {grammarCorrect ? (
                  <><Check className="h-4 w-4" /> Doğru Cevap!</>
                ) : (
                  <><AlertCircle className="h-4 w-4" /> Yanlış Cevap!</>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                {grammarQuestions[grammarIdx].exp}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  onClick={handleGrammarNextQuestion}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                >
                  Sonraki Soru <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* GRAMMAR PHASE 3: COMPLETED RESULT CARD */}
      {phase === 3 && (
        <div className="text-center space-y-6 animate-scale-in" style={{ padding: '40px 20px' }}>
          <div style={{ display: 'inline-flex', padding: '24px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '16px' }}>
            <Trophy className="h-16 w-16" />
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', margin: 0 }}>Tebrikler!</h2>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '400px', margin: '8px auto 24px auto', lineHeight: 1.5 }}>
            Gün {selectedDay} Dilbilgisi Kampı konu anlatımını ve tüm alıştırma sorularını başarıyla tamamladınız!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '32px 0' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#10b981' }}>{correctAnswers}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '4px' }}>Doğru</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: '#6366f1' }}>%{Math.round((correctAnswers / (totalQuestions || 5)) * 100)}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', marginTop: '4px' }}>Başarı</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '32px' }}>
            <button
              onClick={exitCamp}
              className="btn-secondary"
              style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Kampa Dön
            </button>
            {startNextCampDay && (
              <button
                onClick={startNextCampDay}
                className="btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  borderColor: '#10b981',
                  color: 'white',
                  flex: '1 1 auto',
                  minWidth: '180px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Sonraki Günü Başlat (Gün {selectedDay + 1}) ⏩
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exit Camp Button for active grammar study phases (1-2) */}
      {phase < 3 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
          <button 
            onClick={exitCamp} 
            className="btn-secondary" 
            style={{ 
              padding: '8px 24px', 
              fontSize: '0.8rem', 
              background: 'rgba(239, 68, 68, 0.08)', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              color: '#f87171',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Kampı Kapat ve Çık
          </button>
        </div>
      )}
    </div>
  );
};

export default CampGrammar;
