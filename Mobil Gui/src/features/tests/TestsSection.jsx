import React from 'react';

const TestsSection = ({
  activeTab,
  selectedCategory,
  quizActive,
  selectedExam,
  setSelectedExam,
  BACKEND_URL,
  selectedTestTab,
  setSelectedTestTab,
  exams,
  handleSelectExam,
  topicsList,
  startTopicQuizSession,
  examDetailTab,
  setExamDetailTab,
  examQuestionSort,
  setExamQuestionSort,
  examQuestionSortDir,
  setExamQuestionSortDir,
  getSortedQuestionNumbers,
  questionStats,
  startCustomExamSession,
  answers
}) => {
  if (activeTab !== 'tests' || !selectedCategory || quizActive) return null;

  return (
    <section id="screen-tests" className="app-screen active text-left">
      {!selectedExam ? (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div className="section-title" style={{ margin: 0 }}>
              <h2>YÖKDİL Sınav ve Konu Listesi</h2>
              <p>Yıllara göre deneme çözün veya konulara göre ayrılmış soru havuzundan pratik yapın.</p>
            </div>
            <a
              href={`${BACKEND_URL}/pdfs/YOKDIL_Temiz_Soru_Kitapcigi.pdf`}
              download="YOKDIL_Temiz_Soru_Kitapcigi.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center gap-2"
              style={{
                textDecoration: 'none',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}
            >
              <i className="fa-solid fa-file-pdf"></i> Tüm Testi İndir
            </a>
          </div>

          {/* Subtabs years vs topics */}
          <div className="tab-buttons" style={{ marginBottom: '12px' }}>
            <button
              onClick={() => setSelectedTestTab('years')}
              className={`tab-btn ${selectedTestTab === 'years' ? 'active' : ''}`}
            >
              📅 Yıllara Göre
            </button>
            <button
              onClick={() => setSelectedTestTab('topics')}
              className={`tab-btn ${selectedTestTab === 'topics' ? 'active' : ''}`}
            >
              🧬 Konulara Göre
            </button>
          </div>

          {selectedTestTab === 'years' ? (
            exams && exams.length > 0 ? (
              <div className="menu-list" style={{ marginTop: '8px' }}>
                {exams.map(ex => {
                  const examAns = JSON.parse(localStorage.getItem(`answers_${ex.id}`)) || {};
                  const solvedCount = Object.keys(examAns).length;
                  return (
                    <div
                      key={ex.id}
                      className="menu-item"
                      onClick={() => { handleSelectExam(ex); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px 20px' }}
                    >
                      <div className="menu-icon subject-icon" style={{ borderColor: 'var(--primary)', color: 'var(--primary-light)' }}><i className="fa-solid fa-file-invoice"></i></div>
                      <div className="menu-text" style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ex.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>80 Soru | Çözülen: {solvedCount}/80</p>
                      </div>
                      <i className="fa-solid fa-chevron-right arrow-icon" style={{ opacity: 0.6 }}></i>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state text-center py-16 text-slate-500">
                <p style={{ fontSize: '0.85rem' }}>Bu kategori için sınav kaydı bulunmamaktadır.</p>
              </div>
            )
          ) : (
            // Topics list view
            <div className="menu-list" style={{ marginTop: '8px' }}>
              {topicsList.map(topic => (
                <button
                  key={topic.key}
                  onClick={() => startTopicQuizSession(topic.key)}
                  className="menu-item"
                >
                  <div className="menu-icon subject-icon" style={{ borderColor: 'var(--primary)', color: 'var(--primary-light)' }}><i className="fa-solid fa-graduation-cap"></i></div>
                  <div className="menu-text">
                    <h4>{topic.name}</h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{topic.range} havuzu</p>
                  </div>
                  <i className="fa-solid fa-chevron-right arrow-icon"></i>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="section-title" style={{ margin: 0 }}>
              <h2>{selectedExam.name}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sınav içeriğini çalışın ve performans raporunuzu inceleyin.</p>
            </div>
            <button
              onClick={() => setSelectedExam(null)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="fa-solid fa-arrow-left"></i> Sınav Listesine Dön
            </button>
          </div>

          {/* Sub-Tab Navigation */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
            <button
              onClick={() => setExamDetailTab('list')}
              style={{
                flex: 1,
                padding: '10px 16px',
                fontSize: '0.82rem',
                fontWeight: '800',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: examDetailTab === 'list' ? 'var(--primary-gradient)' : 'transparent',
                color: examDetailTab === 'list' ? 'white' : 'var(--text-secondary)',
                boxShadow: examDetailTab === 'list' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                border: 'none'
              }}
            >
              📝 Soru Listesi
            </button>
            <button
              onClick={() => setExamDetailTab('performance')}
              style={{
                flex: 1,
                padding: '10px 16px',
                fontSize: '0.82rem',
                fontWeight: '800',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: examDetailTab === 'performance' ? 'var(--primary-gradient)' : 'transparent',
                color: examDetailTab === 'performance' ? 'white' : 'var(--text-secondary)',
                boxShadow: examDetailTab === 'performance' ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
                border: 'none'
              }}
            >
              📊 Sınav Performansı
            </button>
          </div>

          {examDetailTab === 'list' ? (
            <>
              {/* Header Columns */}
              <div className="glass-card" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '0.78rem', borderBottom: '1px solid var(--border-color)', margin: '12px 0 6px 0' }}>
                <div
                  onClick={() => {
                    if (examQuestionSort === 'number') {
                      setExamQuestionSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setExamQuestionSort('number');
                      setExamQuestionSortDir('asc');
                    }
                  }}
                  style={{ flex: 1.5, cursor: 'pointer', userSelect: 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Soru Numarası {examQuestionSort === 'number' ? (examQuestionSortDir === 'asc' ? '🔼' : '🔽') : '🔹'}
                </div>
                <div
                  onClick={() => {
                    if (examQuestionSort === 'correct') {
                      setExamQuestionSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setExamQuestionSort('correct');
                      setExamQuestionSortDir('desc');
                    }
                  }}
                  style={{ flex: 1, cursor: 'pointer', userSelect: 'none', color: '#48BB78', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  Doğru Sayısı {examQuestionSort === 'correct' ? (examQuestionSortDir === 'asc' ? '🔼' : '🔽') : '🔹'}
                </div>
                <div
                  onClick={() => {
                    if (examQuestionSort === 'wrong') {
                      setExamQuestionSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setExamQuestionSort('wrong');
                      setExamQuestionSortDir('desc');
                    }
                  }}
                  style={{ flex: 1, cursor: 'pointer', userSelect: 'none', color: '#F56565', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  Yanlış Sayısı {examQuestionSort === 'wrong' ? (examQuestionSortDir === 'asc' ? '🔼' : '🔽') : '🔹'}
                </div>
                <div style={{ flex: 1.2, textAlign: 'right' }}>
                  <button
                    onClick={() => startCustomExamSession(0, getSortedQuestionNumbers(selectedExam.id))}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    🚀 Tümünü Çöz
                  </button>
                </div>
              </div>

              {/* Vertical List of Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                {getSortedQuestionNumbers(selectedExam.id).map((qNum, idx, arr) => {
                  const statsObj = questionStats[selectedExam.id]?.[qNum] || { correct: 0, wrong: 0 };
                  return (
                    <div
                      key={qNum}
                      onClick={() => startCustomExamSession(idx, arr)}
                      className="glass-card"
                      style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '10px', fontSize: '0.82rem' }}
                    >
                      <span style={{ flex: 1.5, fontWeight: '700', color: 'var(--text-main)' }}>Soru {qNum}</span>
                      <span style={{ flex: 1, color: '#48BB78', fontWeight: '600', textAlign: 'center' }}>✔️ {statsObj.correct} Doğru</span>
                      <span style={{ flex: 1, color: '#F56565', fontWeight: '600', textAlign: 'center' }}>❌ {statsObj.wrong} Yanlış</span>
                      <span style={{ flex: 1.2, textAlign: 'right', color: 'var(--primary-light)', fontWeight: 'bold' }}>
                        Çöz <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', marginLeft: '4px' }}></i>
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            (() => {
              const examAnswers = answers || {};
              let solvedCount = 0;
              let correctCount = 0;
              let wrongCount = 0;

              selectedExam.questions.forEach(q => {
                const userAns = examAnswers[q.number];
                if (userAns !== undefined) {
                  solvedCount++;
                  const isCorrect = userAns === selectedExam.answers[q.number - 1];
                  if (isCorrect) correctCount++;
                  else wrongCount++;
                }
              });

              const successRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;

              const incorrectQuestions = selectedExam.questions.filter(q => {
                const userAns = examAnswers[q.number];
                return userAns !== undefined && userAns !== selectedExam.answers[q.number - 1];
              });

              return (
                <div className="space-y-4">
                  {/* Summary Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Çözülen Soru</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: 'var(--text-main)' }}>{solvedCount} / 80</div>
                    </div>
                    <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Doğru Sayısı</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: '#48BB78' }}>{correctCount}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Yanlış Sayısı</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: '#F56565' }}>{wrongCount}</div>
                    </div>
                    <div className="glass-card" style={{ padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Başarı Oranı</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: 'var(--primary-light)' }}>%{successRate}</div>
                    </div>
                  </div>

                  {/* Incorrect Questions revision list */}
                  <div className="glass-card" style={{ padding: '18px', borderRadius: '14px' }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      ❌ Hatalı Çözdüğünüz Sorular ({incorrectQuestions.length})
                    </h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      Hata yaptığınız sorular aşağıda listelenmiştir. Doğrudan soruya tıklayarak yapay zeka analizi ile tekrar çözebilirsiniz.
                    </p>

                    {incorrectQuestions.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {solvedCount === 0 ? "Henüz soru çözülmedi." : "Harika! Bu sınavda hiç hatalı sorunuz yok. 🎉"}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                        {incorrectQuestions.map(q => {
                          const sortedArr = getSortedQuestionNumbers(selectedExam.id);
                          const idx = sortedArr.indexOf(q.number);
                          return (
                            <button
                              key={q.number}
                              onClick={() => startCustomExamSession(idx, sortedArr)}
                              className="btn-secondary"
                              style={{ padding: '10px', fontSize: '0.78rem', cursor: 'pointer', borderRadius: '8px', borderColor: 'rgba(245, 101, 101, 0.2)', color: '#FEB2B2', background: 'rgba(245, 101, 101, 0.03)' }}
                            >
                              Soru {q.number}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}
    </section>
  );
};

export default TestsSection;
