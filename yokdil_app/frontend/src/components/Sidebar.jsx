import React, { useState } from 'react';

const Sidebar = ({ 
  selectedCategory, 
  activeTab, 
  setActiveTab, 
  setSelectedCategory, 
  setSelectedExam, 
  setQuizActive,
  onLogout
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!selectedCategory) return null;

  return (
    <>
      <aside className="app-sidebar-desktop">
        {/* Sidebar Logo */}
        <div className="sidebar-logo">
          <i className="fa-solid fa-graduation-cap brain-icon" style={{ fontSize: '1.25rem', color: '#6366f1' }}></i>
          <span className="font-heading" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>YÖKDİL Hazırlık</span>
        </div>

        <div className="sidebar-subtitle">
          {selectedCategory === 'fen' ? '🔬 Fen Bilimleri' : selectedCategory === 'sosyal' ? '⚖️ Sosyal Bilimler' : '🏥 Sağlık Bilimleri'}
        </div>

        {/* Nav List */}
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-nav-item nav-dashboard ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-house"></i>
            <span>Ana Sayfa</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-tests ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tests'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Testler</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-vocabulary ${activeTab === 'vocabulary' ? 'active' : ''}`}
            onClick={() => { setActiveTab('vocabulary'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-book"></i>
            <span>Kelimelerim</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-paragraphs ${activeTab === 'paragraphs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('paragraphs'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-file-lines"></i>
            <span>Paragraflar</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-lectures ${activeTab === 'lectures' ? 'active' : ''}`}
            onClick={() => { setActiveTab('lectures'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-graduation-cap"></i>
            <span>Konu Anlatımı</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-mistakes ${activeTab === 'mistakes' ? 'active' : ''}`}
            onClick={() => { setActiveTab('mistakes'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>Hata Kutusu</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-performance ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => { setActiveTab('performance'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Performans</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-pet ${activeTab === 'pet' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pet'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-paw"></i>
            <span>Evcil Hayvanım</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-games ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => { setActiveTab('games'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-gamepad"></i>
            <span>Mini Oyunlar</span>
          </button>
          <button 
            className={`sidebar-nav-item nav-settings ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setQuizActive(false); }}
          >
            <i className="fa-solid fa-gear"></i>
            <span>Ayarlar</span>
          </button>
          <button 
            className="sidebar-nav-item nav-more-mobile"
            onClick={() => setShowMoreMenu(true)}
          >
            <i className="fa-solid fa-bars"></i>
            <span>Daha Fazla</span>
          </button>
        </nav>

        {/* Footer Area */}
        <div className="sidebar-footer">
          <button 
            className="change-course-btn-sidebar"
            onClick={() => { setSelectedCategory(null); setSelectedExam(null); setQuizActive(false); }}
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i> Alan Değiştir
          </button>
          <button 
            className="change-course-btn-sidebar"
            style={{ border: '1px solid rgba(239, 68, 68, 0.2)', background: 'rgba(239, 68, 68, 0.05)', color: '#FEB2B2' }}
            onClick={onLogout}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile More Bottom Sheet */}
      {showMoreMenu && (
        <>
          <div className="mobile-more-overlay" onClick={() => setShowMoreMenu(false)} />
          <div className="mobile-more-bottom-sheet animate-slide-up">
            <div className="mobile-sheet-drag-handle"></div>
            <div className="mobile-sheet-header">
              <span className="mobile-sheet-title">Daha Fazla Seçenek</span>
              <button className="mobile-sheet-close" onClick={() => setShowMoreMenu(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="mobile-more-grid">
              <button 
                className="mobile-more-item"
                onClick={() => { setActiveTab('lectures'); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-graduation-cap" style={{ color: '#6366f1' }}></i>
                <span>Konu Anlatımı</span>
              </button>

              <button 
                className="mobile-more-item"
                onClick={() => { setActiveTab('mistakes'); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-circle-exclamation" style={{ color: '#fb7185' }}></i>
                <span>Hata Kutusu</span>
              </button>

              <button 
                className="mobile-more-item"
                onClick={() => { setActiveTab('performance'); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-chart-line" style={{ color: '#34d399' }}></i>
                <span>Performans</span>
              </button>

              <button 
                className="mobile-more-item"
                onClick={() => { setActiveTab('pet'); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-paw" style={{ color: '#fb923c' }}></i>
                <span>Evcil Hayvanım</span>
              </button>

              <button 
                className="mobile-more-item"
                onClick={() => { setActiveTab('games'); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-gamepad" style={{ color: '#ec4899' }}></i>
                <span>Mini Oyunlar</span>
              </button>

              <button 
                className="mobile-more-item"
                onClick={() => { setActiveTab('settings'); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-gear" style={{ color: '#94a3b8' }}></i>
                <span>Ayarlar</span>
              </button>
            </div>

            <div className="mobile-sheet-footer">
              <button 
                className="change-course-btn"
                onClick={() => { setSelectedCategory(null); setSelectedExam(null); setQuizActive(false); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Alan Değiştir
              </button>
              <button 
                className="logout-btn"
                onClick={() => { onLogout(); setShowMoreMenu(false); }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
