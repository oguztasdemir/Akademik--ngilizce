import React from 'react';

const Sidebar = ({ 
  selectedCategory, 
  activeTab, 
  setActiveTab, 
  setSelectedCategory, 
  setSelectedExam, 
  setQuizActive,
  onLogout
}) => {
  if (!selectedCategory) return null;

  const sidebarStyle = {
    width: '240px',
    background: 'rgba(10, 15, 30, 0.75)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const getSidebarItemStyle = (tab) => {
    const isActive = activeTab === tab;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '12px 18px',
      fontSize: '0.8rem',
      fontWeight: isActive ? '800' : '600',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.02) 100%)' : 'transparent',
      color: isActive ? '#a5b4fc' : '#94a3b8',
      borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
      boxShadow: isActive ? '0 0 12px rgba(99, 102, 241, 0.15)' : 'none',
      transition: 'all 0.25s ease',
      marginBottom: '6px',
      outline: 'none'
    };
  };

  const changeCourseBtnStyle = {
    width: '100%',
    padding: '10px 16px',
    fontSize: '0.78rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(255, 255, 255, 0.02)',
    color: '#e2e8f0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  };

  const logoutBtnStyle = {
    width: '100%',
    padding: '10px 16px',
    fontSize: '0.78rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    background: 'rgba(239, 68, 68, 0.05)',
    color: '#FEB2B2',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  };

  return (
    <aside style={sidebarStyle} className="app-sidebar-desktop-custom">
      {/* Sidebar Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <i className="fa-solid fa-graduation-cap brain-icon" style={{ fontSize: '1.25rem', color: '#6366f1' }}></i>
        <span className="font-heading" style={{ fontSize: '1.05rem', fontWeight: '800', color: 'white' }}>YÖKDİL Hazırlık</span>
      </div>

      <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px', paddingLeft: '4px' }}>
        {selectedCategory === 'fen' ? '🔬 Fen Bilimleri' : selectedCategory === 'sosyal' ? '⚖️ Sosyal Bilimler' : '🏥 Sağlık Bilimleri'}
      </div>

      {/* Nav List */}
      <nav style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <button style={getSidebarItemStyle('dashboard')} onClick={() => { setActiveTab('dashboard'); setQuizActive(false); }}>
          <i className="fa-solid fa-house"></i>
          <span>Ana Sayfa</span>
        </button>
        <button style={getSidebarItemStyle('tests')} onClick={() => { setActiveTab('tests'); setQuizActive(false); }}>
          <i className="fa-solid fa-pen-to-square"></i>
          <span>Testler</span>
        </button>
        <button style={getSidebarItemStyle('vocabulary')} onClick={() => { setActiveTab('vocabulary'); setQuizActive(false); }}>
          <i className="fa-solid fa-book"></i>
          <span>Kelimelerim</span>
        </button>
        <button style={getSidebarItemStyle('paragraphs')} onClick={() => { setActiveTab('paragraphs'); setQuizActive(false); }}>
          <i className="fa-solid fa-file-lines"></i>
          <span>Paragraflar</span>
        </button>
        <button style={getSidebarItemStyle('lectures')} onClick={() => { setActiveTab('lectures'); setQuizActive(false); }}>
          <i className="fa-solid fa-graduation-cap"></i>
          <span>Konu Anlatımı</span>
        </button>
        <button style={getSidebarItemStyle('mistakes')} onClick={() => { setActiveTab('mistakes'); setQuizActive(false); }}>
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>Hata Kutusu</span>
        </button>
        <button style={getSidebarItemStyle('minigames')} onClick={() => { setActiveTab('minigames'); setQuizActive(false); }}>
          <i className="fa-solid fa-gamepad"></i>
          <span>Oyun Parkı</span>
        </button>
        <button style={getSidebarItemStyle('performance')} onClick={() => { setActiveTab('performance'); setQuizActive(false); }}>
          <i className="fa-solid fa-chart-line"></i>
          <span>Performans</span>
        </button>
        <button style={getSidebarItemStyle('settings')} onClick={() => { setActiveTab('settings'); setQuizActive(false); }}>
          <i className="fa-solid fa-gear"></i>
          <span>Ayarlar</span>
        </button>
      </nav>

      {/* Footer Area */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button 
          style={changeCourseBtnStyle}
          onClick={() => { setSelectedCategory(null); setSelectedExam(null); setQuizActive(false); }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
        >
          <i className="fa-solid fa-arrow-right-to-bracket"></i> Alan Değiştir
        </button>
        <button 
          style={logoutBtnStyle}
          onClick={onLogout}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'; }}
        >
          <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
