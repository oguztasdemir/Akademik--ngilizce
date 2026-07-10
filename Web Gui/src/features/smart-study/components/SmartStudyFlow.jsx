import React from 'react';
import { Check, AlertCircle, Trophy, ArrowRight } from 'lucide-react';

const SmartStudyFlow = ({
  words,
  currentIdx,
  setCurrentIdx,
  phase,
  wordLimit,
  meaningOptions,
  meaningSelected,
  meaningChecked,
  meaningCorrect,
  handleMeaningCheck,
  getEnglishForMeaningOption,
  handleMeaningDontKnow,
  handleMeaningNext,
  synonymOptions,
  synonymSelected,
  synonymChecked,
  synonymCorrect,
  handleSynonymCheck,
  getOptionTranslation,
  handleSynonymDontKnow,
  handleSynonymNext,
  clozeOptions,
  clozeSelected,
  clozeChecked,
  clozeCorrect,
  handleClozeCheck,
  handleClozeDontKnow,
  handleClozeNext,
  strategySelected,
  strategyChecked,
  strategyCorrect,
  handleStrategyCheck,
  showStrategyTip,
  setShowStrategyTip,
  handleStrategyDontKnow,
  handleStrategyNext,
  resetStudy,
  handleWordRead
}) => {
  return (
    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px' }}>
      
      {/* Sleek Dynamic Progress Bar at the very top */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', marginBottom: '24px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${((phase - 1) * 20) + ((currentIdx + 1) / words.length * 20)}%`,
          background: 'linear-gradient(90deg, #6366f1 0%, #10b981 100%)',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }} />
      </div>

      {/* PHASE 1: LEARN WORDS */}
      {phase === 1 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 1: Akademik Kelime Kartı <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Kelimelerin anlam, eş anlam ve collocation yapılarını inceleyin.</span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>İNGİLİZCE KELİME</span>
              <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em', wordBreak: 'break-all' }}>
                {words[currentIdx].word}
              </h1>
              <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', textTransform: 'uppercase', fontWeight: '800' }}>
                {words[currentIdx].type}
              </span>
              
              <div style={{ margin: '14px 0', height: '1px', width: '48px', background: 'rgba(255,255,255,0.08)' }} />

              <span style={{ fontSize: '0.62rem', color: '#34d399', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>TÜRKÇE ANLAMI</span>
              <h2 style={{ fontSize: '1.58rem', fontWeight: '800', color: '#34d399', margin: 0 }}>
                {words[currentIdx].meaning}
              </h2>
            </div>

            {/* Modadil Synonyms & Collocations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0' }}>
              {/* Eş Anlamlılar (Synonyms) */}
              <div style={{ background: 'rgba(99, 102, 241, 0.04)', border: '1px solid rgba(99, 102, 241, 0.15)', padding: '14px 18px', borderRadius: '16px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.64rem', color: '#a5b4fc', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  🔄 EŞ ANLAMLILAR (SYNONYMS)
                </span>
                <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', margin: 0 }}>
                  {words[currentIdx].synonyms || "Yok"}
                </p>
              </div>

              {/* Birlikte Kullanılanlar (Collocations) */}
              <div style={{ background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '14px 18px', borderRadius: '16px', textAlign: 'left' }}>
                <span style={{ fontSize: '0.64rem', color: '#34d399', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  🔗 COLLOCATIONS / BİRLİKTE KULLANIM
                </span>
                <p style={{ fontSize: '0.9rem', color: 'white', fontWeight: '700', margin: 0, fontStyle: 'italic' }}>
                  {words[currentIdx].collocation || "Yok"}
                </p>
              </div>
            </div>

            {/* Academic Sentence Box */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Örnek Akademik Cümle (YÖKDİL)</span>
              <p style={{ fontSize: '0.98rem', color: 'white', lineHeight: 1.6, margin: '0 auto', fontWeight: '500', maxWidth: '500px' }}>
                {words[currentIdx].sentence}
              </p>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', marginTop: '8px', marginBottom: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                {words[currentIdx].translation}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="btn-secondary"
              style={{ padding: '10px 20px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Önceki Kelime
            </button>

            <button
              onClick={() => handleWordRead(currentIdx)}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              Öğrendim, Sıradaki <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: MEANING SELECTION PRACTICE */}
      {phase === 2 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 2: Kelimenin Anlamını Eşleştirin <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              İngilizce kelimenin doğru Türkçe anlamını bulun.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                {words[currentIdx].word}
              </h2>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
                {meaningOptions.map((opt, i) => {
                  const isSelected = meaningSelected === opt;
                  const isCorrectAnswer = opt === words[currentIdx].meaning;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (meaningChecked) {
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
                      onClick={() => handleMeaningCheck(opt)}
                      disabled={meaningChecked}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        cursor: meaningChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <span>{opt}</span>
                      {meaningChecked && (() => {
                        const eng = getEnglishForMeaningOption(opt);
                        return eng ? (
                          <span style={{ fontSize: '0.8rem', opacity: 0.85, fontWeight: '750', color: isCorrectAnswer ? '#67e8f9' : '#cbd5e1' }}>
                            ({eng})
                          </span>
                        ) : null;
                      })()}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Box */}
              {meaningChecked && (
                <div className={`glass-card animate-scale-in`} style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: meaningCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: meaningCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: meaningCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {meaningCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Doğru Eşleşme. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru cevap: "{words[currentIdx].meaning}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!meaningChecked ? (
              <button
                onClick={handleMeaningDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleMeaningNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: SYNONYM SELECTION PRACTICE */}
      {phase === 3 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 3: Eş Anlam Eşleştirin <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              İngilizce kelimenin en yakın anlamlısını (synonym) seçeneklerden bulun.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>SORULAN KELİME</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
                {words[currentIdx].word}
              </h2>

              {/* Options Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '400px', marginTop: '16px' }}>
                {synonymOptions.map((opt, i) => {
                  const isSelected = synonymSelected === opt;
                  const correctVal = words[currentIdx].synonyms ? words[currentIdx].synonyms.split(',')[0].trim() : '';
                  const isCorrectAnswer = opt === correctVal;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (synonymChecked) {
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
                      onClick={() => handleSynonymCheck(opt)}
                      disabled={synonymChecked}
                      style={{
                        padding: '14px 20px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.94rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: synonymChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}{synonymChecked && getOptionTranslation(opt) && ` (${getOptionTranslation(opt)})`}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Box */}
              {synonymChecked && (
                <div className={`glass-card animate-scale-in`} style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: synonymCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: synonymCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: synonymCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {synonymCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Eş Anlam Doğru. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru eş anlamlısı: "{words[currentIdx].synonyms.split(',')[0].trim()}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!synonymChecked ? (
              <button
                onClick={handleSynonymDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleSynonymNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 4: CLOZE / SENTENCE FILL PRACTICE */}
      {phase === 4 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 4: Cümle Boşluk Doldurma <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Cümle içindeki boşluğa gelebilecek en uygun kelimeyi seçin.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.62rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AKADEMİK CÜMLE</span>
              
              <p style={{ fontSize: '1.18rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: '8px 0', wordBreak: 'break-word' }}>
                {words[currentIdx].sentence.replace(new RegExp(`\\b${words[currentIdx].word}\\b`, 'gi'), '________')}
              </p>

              <span style={{ fontSize: '0.84rem', color: '#94a3b8', fontStyle: 'italic', display: 'block', marginBottom: '12px' }}>
                Çevirisi: {words[currentIdx].translation}
              </span>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', maxWidth: '500px', margin: '16px auto 0 auto' }}>
                {clozeOptions.map((opt, i) => {
                  const isSelected = clozeSelected === opt;
                  const isCorrectAnswer = opt === words[currentIdx].word;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (clozeChecked) {
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
                      onClick={() => handleClozeCheck(opt)}
                      disabled={clozeChecked}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.88rem',
                        fontWeight: 'bold',
                        cursor: clozeChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}{clozeChecked && getOptionTranslation(opt) && ` (${getOptionTranslation(opt)})`}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Box */}
              {clozeChecked && (
                <div className={`glass-card animate-scale-in`} style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: clozeCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: clozeCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: clozeCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'center'
                }}>
                  {clozeCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Harika! Cümle tamamlandı. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru kelime: "{words[currentIdx].word}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!clozeChecked ? (
              <button
                onClick={handleClozeDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleClozeNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Aşamaya Geç <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 5: STRATEGY & QUESTION PRACTICE */}
      {phase === 5 && (
        <div className="space-y-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white' }}>
              Adım 5: YÖKDİL Sınav Sorusu ve Çözüm Stratejisi <span style={{ color: '#818cf8' }}>({currentIdx + 1}/{words.length})</span>
            </h4>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Kelimelerin gerçek YÖKDİL cümlelerinde nasıl sorulduğunu görün.
            </span>
          </div>

          <div className="glass-card animate-scale-in" style={{ padding: '28px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.45)', border: '1.5px solid rgba(99, 102, 241, 0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
              <span style={{ fontSize: '0.62rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.12em' }}>YÖKDİL SORU KALIBI</span>
              <p style={{ fontSize: '1.05rem', color: 'white', lineHeight: 1.6, fontWeight: '500', margin: 0 }}>
                {words[currentIdx].examQuestion}
              </p>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%', marginTop: '16px' }}>
                {words[currentIdx].examOptions.map((opt, i) => {
                  const isSelected = strategySelected === opt;
                  const isCorrectAnswer = opt === words[currentIdx].word;
                  let bg = 'rgba(255, 255, 255, 0.03)';
                  let border = '1px solid rgba(255, 255, 255, 0.08)';
                  let color = 'white';

                  if (strategyChecked) {
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
                      onClick={() => handleStrategyCheck(opt)}
                      disabled={strategyChecked}
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: bg,
                        border: border,
                        color: color,
                        fontSize: '0.92rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        cursor: strategyChecked ? 'default' : 'pointer',
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      {opt}{strategyChecked && getOptionTranslation(opt) && ` (${getOptionTranslation(opt)})`}
                    </button>
                  );
                })}
              </div>

              {/* Toggle Modadil Strategy Tip Button */}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setShowStrategyTip(prev => !prev)}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1.5px dashed rgba(245, 158, 11, 0.3)',
                    color: '#f59e0b',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.78rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                   💡 Soru Çözüm Stratejisini Gör {showStrategyTip ? '▲' : '▼'}
                </button>

                {showStrategyTip && (
                  <div className="glass-card animate-scale-in" style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#fef3c7', fontSize: '0.86rem', lineHeight: 1.5 }}>
                    <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>Taktik Rehberi:</strong>
                    {words[currentIdx].strategy}
                  </div>
                )}
              </div>

              {/* Correct / Incorrect Feedback Box */}
              {strategyChecked && (
                <div className={`glass-card animate-scale-in`} style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: strategyCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: strategyCorrect ? '1.5px solid rgba(16, 185, 129, 0.3)' : '1.5px solid rgba(239, 68, 68, 0.3)',
                  color: strategyCorrect ? '#a7f3d0' : '#fca5a5',
                  marginTop: '12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {strategyCorrect ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" /> Tebrikler! Doğru Seçim. (+10 XP)
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-rose-400" /> Hatalı! Doğru cevap: "{words[currentIdx].word}" olmalıydı.
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            {!strategyChecked ? (
              <button
                onClick={handleStrategyDontKnow}
                className="btn-secondary"
                style={{ padding: '10px 16px', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
              >
                Bilmiyorum 🤷‍♂️
              </button>
            ) : (
              <button
                onClick={handleStrategyNext}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}
              >
                Sıradaki Soru <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* PHASE 6: SUMMARY / CELEBRATION */}
      {phase === 6 && (
        <div className="space-y-6 text-center py-8">
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
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              animation: 'scaleIn 0.5s'
            }}>
              <Trophy className="h-10 w-10 text-emerald-400" />
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: 0 }}>
            Tebrikler! Kelime Kampını Tamamladınız! 🎉
          </h2>
          <p style={{ fontSize: '0.94rem', color: '#94a3b8', maxWidth: '480px', margin: '12px auto 0 auto', lineHeight: 1.6 }}>
            Seçtiğiniz akademik kelimeleri; anlam okuma, Türkçe anlam eşleştirme, eş anlam bulma, cümle boşluk doldurma ve sınav soru taktikleri aşamalarını başarıyla tamamlayarak hafızanıza kazıdınız.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '28px 0', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Kazanılan Ödül</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', display: 'block', marginTop: '4px' }}>+50 Evcil Hayvan XP</span>
            </div>
            <div className="glass-card" style={{ padding: '16px 24px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Ekstra Kristal</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fbbf24', display: 'block', marginTop: '4px' }}>+5 Kristal 💎</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={resetStudy}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Tekrar Çalış
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartStudyFlow;
