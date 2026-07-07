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
  handleGrammarNextLecture,
  handleGrammarCheck,
  handleGrammarNextQuestion,
  exitCamp,
  setActiveStudyInfo
}) => {
  if (!activeGrammarDay) {
    return <div style={{ color: 'white', padding: '20px' }}>Dilbilgisi verileri yükleniyor...</div>;
  }

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
                      <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {sectionContent}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
            <button
              onClick={handleGrammarNextLecture}
              className="btn-primary"
              style={{ padding: '12px 32px', fontSize: '0.88rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', background: '#10b981', borderColor: '#10b981', borderRadius: '12px' }}
            >
              Konu Testine Geç <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* GRAMMAR PHASE 2: QUIZ */}
      {phase === 2 && grammarQuestions.length > 0 && grammarQuestions[grammarIdx] && (
        <div className="space-y-6 animate-scale-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 2: Konu Pekiştirme Testi <span style={{ color: '#10b981' }}>({grammarIdx + 1}/{grammarQuestions.length})</span>
            </h4>
          </div>

          <div className="glass-card" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(16, 185, 129, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORU</span>
              <p style={{ fontSize: '1.1rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>
                {grammarQuestions[grammarIdx].q}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', width: '100%', marginTop: '16px' }}>
                {grammarQuestions[grammarIdx].options.map((opt, i) => {
                  const isSelected = grammarSelected === opt;
                  const isCorrectAnswer = opt === grammarQuestions[grammarIdx].answer;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (grammarChecked) {
                    if (isCorrectAnswer) {
                      bg = 'rgba(16, 185, 129, 0.15)';
                      border = '1.5px solid #10b981';
                      color = '#a7f3d0';
                    } else if (isSelected) {
                      bg = 'rgba(239, 68, 68, 0.15)';
                      border = '1.5px solid #ef4444';
                      color = '#fca5a5';
                    }
                  } else if (isSelected) {
                    bg = 'rgba(99, 102, 241, 0.15)';
                    border = '1.5px solid #6366f1';
                    color = '#a5b4fc';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleGrammarCheck(opt)}
                      disabled={grammarChecked}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        cursor: grammarChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {grammarChecked && (
                <div className="glass-card animate-scale-in" style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  background: grammarCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  border: grammarCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#f1f5f9',
                  marginTop: '12px',
                  fontSize: '0.88rem',
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: grammarCorrect ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    {grammarCorrect ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {grammarCorrect ? 'Doğru Cevap!' : `Hatalı! Doğru cevap: "${grammarQuestions[grammarIdx].answer}"`}
                  </strong>
                  {grammarQuestions[grammarIdx].exp}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            {grammarChecked && (
              <button
                onClick={handleGrammarNextQuestion}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {grammarIdx === grammarQuestions.length - 1 ? 'Çalışmayı Bitir' : 'Sıradaki Soru'} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* GRAMMAR PHASE 3: SUMMARY */}
      {phase === 3 && (
        <div className="space-y-6 text-center py-8 animate-scale-in">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}>
              <Trophy className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
            Tebrikler! Gün #{selectedDay} Dilbilgisi Çalışması Tamamlandı! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Bugünün dilbilgisi konusunu ve testini başarıyla tamamladınız. Skorunuz: %{Math.round((correctAnswers / totalQuestions) * 100) || 100}
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Kazanılan Ödül</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block', marginTop: '4px' }}>+45 Evcil Hayvan XP</span>
            </div>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Ekstra Kristal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginTop: '4px' }}>+10 Kristal 💎</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={exitCamp}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Gramer Takvimine Dön
            </button>
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
