import React, { useState } from 'react';
import { User, Mail, ShieldAlert } from 'lucide-react';

const SettingsSection = ({
  activeTab,
  fontSize,
  setFontSize,
  theme,
  setTheme,
  handleResetProgress,
  selectedExam,
  currentUser,
  setCurrentUser,
  onLogout,
  onOpenAuthModal,
  token,
  BACKEND_URL,
  speechRate,
  setSpeechRate,
  soundEnabled,
  setSoundEnabled,
  dailyQuestionGoal,
  setDailyQuestionGoal,
  dailyWordGoal,
  setDailyWordGoal,
  autoPronounceEnabled,
  setAutoPronounceEnabled,
  handleResetAllProgress,
  yokdilExamDate,
  setYokdilExamDate,
  chatbotName,
  setChatbotName,
  setSelectedCategory,
  setSelectedExam,
  showAiFloatBtn,
  setShowAiFloatBtn
}) => {
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profileUsername, setProfileUsername] = useState(currentUser?.username || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordEnabled, setChangePasswordEnabled] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  React.useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfileUsername(currentUser.username || '');
    }
  }, [currentUser]);

  const [localIp, setLocalIp] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const handleGenerateQR = async () => {
    if (showQR) {
      setShowQR(false);
      return;
    }
    setQrLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/local-ip`);
      const data = await res.json();
      setLocalIp(data.ip || '127.0.0.1');
      setShowQR(true);
    } catch (err) {
      alert("Yerel IP adresi alınamadı: " + err.message);
    } finally {
      setQrLoading(false);
    }
  };

  if (activeTab !== 'settings') return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateSuccess('');
    setUpdateError('');

    if (changePasswordEnabled) {
      if (!profilePassword || profilePassword.length < 4) {
        setUpdateError('Yeni şifre en az 4 karakter olmalıdır.');
        return;
      }
      if (profilePassword !== confirmPassword) {
        setUpdateError('Yeni şifreler uyuşmuyor.');
        return;
      }
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileName,
          username: profileUsername,
          email: profileEmail,
          password: changePasswordEnabled ? profilePassword : undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profil güncellenemedi.');
      
      const updatedUser = {
        ...currentUser,
        name: profileName,
        username: profileUsername,
        email: profileEmail
      };
      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }
      localStorage.setItem('yokdil_user', JSON.stringify(updatedUser));
      
      setUpdateSuccess('Profiliniz başarıyla güncellendi.');
      setProfilePassword('');
      setConfirmPassword('');
      setChangePasswordEnabled(false);
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Hesabınızı ve buluttaki tüm verilerinizi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert("Hesabınız silindi.");
        onLogout();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 text-left" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '40px' }}>
      <div className="section-title mb-6">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-sliders" style={{ color: '#6366f1' }}></i> Uygulama Ayarları
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Uygulama temasını, ses hızını, günlük hedefleri ve hesap verilerinizi özelleştirin.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        
        {/* CARD 1: HESAP VE BULUT SENKRONİZASYONU */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
            <i className="fa-solid fa-user-gear" style={{ color: '#818cf8' }}></i> Profil ve Bulut Hesabı
          </h3>
          
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(99, 102, 241, 0.8)', fontWeight: '600', marginTop: '2px' }}>
                    @{currentUser.username || 'profil'} • Aktif Profil
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
                </button>
              </div>

              {/* Profile Update Form */}
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', marginBottom: '4px' }}>
                  ⚙️ Bilgileri Güncelle
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.66rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>İsim Soyisim</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Adı Soyadı"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.66rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Kullanıcı Adı</label>
                  <input
                    type="text"
                    value={profileUsername}
                    onChange={(e) => setProfileUsername(e.target.value)}
                    placeholder="kullaniciadi"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                  <input
                    type="checkbox"
                    id="change-password-toggle"
                    checked={changePasswordEnabled}
                    onChange={(e) => {
                      setChangePasswordEnabled(e.target.checked);
                      if(!e.target.checked) {
                        setProfilePassword('');
                        setConfirmPassword('');
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="change-password-toggle" style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-main)', cursor: 'pointer' }}>
                    🔒 Şifre Değiştirmek İstiyorum
                  </label>
                </div>

                {changePasswordEnabled && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.66rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Yeni Şifre</label>
                      <input
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="Yeni Şifre"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: 'white', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '0.66rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Yeni Şifre (Tekrar)</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Yeni Şifre (Tekrar)"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: 'white', outline: 'none' }}
                      />
                    </div>
                  </>
                )}

                {updateSuccess && <div style={{ fontSize: '0.66rem', color: '#34d399', fontWeight: 'bold' }}>{updateSuccess}</div>}
                {updateError && <div style={{ fontSize: '0.66rem', color: '#f87171', fontWeight: 'bold' }}>{updateError}</div>}

                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer border-none mt-2"
                >
                  Bilgileri Kaydet
                </button>
              </form>

              {/* QR Code Section */}
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>💻📱 Cihaz Eşleme (QR)</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Verilerinizi telefona aktarın.</div>
                  </div>
                  <button 
                    onClick={handleGenerateQR}
                    disabled={qrLoading}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all cursor-pointer"
                  >
                    {qrLoading ? '...' : showQR ? 'Kapat' : 'Göster'}
                  </button>
                </div>
                {showQR && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ padding: '8px', background: '#fff', borderRadius: '10px', display: 'inline-block' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`http://${localIp}:5173/#/link-device?token=${token}&name=${currentUser.name}`)}`}
                        alt="Sync QR Code"
                        style={{ display: 'block', width: '140px', height: '140px' }}
                      />
                    </div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', lineHeight: 1.3, margin: 0 }}>
                      Telefonunuzla aynı yerel ağa (Wi-Fi) bağlanıp bu QR kodu okutun.
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Kalıcı Hesap Silme</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Tüm verilerinizi buluttan kalıcı olarak siler.</div>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer transition-all"
                >
                  Hesabı Sil
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Bulut Senkronizasyonu</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Giriş yaparak ilerlemenizi kaydedin.</div>
              </div>
              <button 
                onClick={onOpenAuthModal}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md cursor-pointer"
              >
                Giriş Yap
              </button>
            </div>
          )}
        </div>

        {/* CARD 2: GÖRÜNÜM VE ARAYÜZ */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
            <i className="fa-solid fa-palette" style={{ color: '#34d399' }}></i> Görünüm & Arayüz
          </h3>

          {/* Theme Settings */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Arayüz Teması</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Açık veya koyu görünümü seçin.</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                onClick={() => setTheme('theme-light')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  theme === 'theme-light' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                Açık
              </button>
              <button 
                onClick={() => setTheme('theme-dark')} 
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  theme === 'theme-dark' ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                Koyu
              </button>
            </div>
          </div>

          {/* Font Size Settings */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Soru Metin Boyutu</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Sınav sorularının yazı büyüklüğü.</div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {['sm', 'base', 'lg', 'xl'].map(sz => (
                <button
                   key={sz}
                   onClick={() => setFontSize(sz)}
                   className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                     fontSize === sz ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                   }`}
                >
                   {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Chatbot Name Settings */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Yapay Zeka Asistanı Adı</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Chatbot asistanınızın ismi.</div>
            </div>
            <div>
              <input 
                type="text"
                value={chatbotName || ''}
                onChange={(e) => {
                  setChatbotName(e.target.value);
                  localStorage.setItem('yokdil_chatbot_name', e.target.value);
                }}
                placeholder="Örn: Bilge Asistan"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  outline: 'none',
                  width: '150px',
                  textAlign: 'right'
                }}
              />
            </div>
          </div>
        </div>

        {/* CARD 3: SES VE ÇALIŞMA TERCIHLERI */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
            <i className="fa-solid fa-volume-high" style={{ color: '#fb7185' }}></i> Ses & Çalışma Tercihleri
          </h3>

          {/* Speech Rate Settings */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Okuma Hızı</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>İngilizce kelime seslendirme hızı.</div>
            </div>
            <div>
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="duo-input"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value={0.5} style={{ background: '#0d111c' }}>0.50x</option>
                <option value={0.75} style={{ background: '#0d111c' }}>0.75x</option>
                <option value={1.0} style={{ background: '#0d111c' }}>1.00x (Normal)</option>
                <option value={1.25} style={{ background: '#0d111c' }}>1.25x</option>
              </select>
            </div>
          </div>

          {/* Sound Effects Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Çalışma Ses Efektleri</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Cevap ses bildirimleri.</div>
            </div>
            <div>
              <button
                onClick={() => {
                  const nextVal = !soundEnabled;
                  setSoundEnabled(nextVal);
                  localStorage.setItem('yokdil_sound_enabled', String(nextVal));
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: soundEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: soundEnabled ? '1px solid #10b981' : '1px solid #ef4444',
                  color: soundEnabled ? '#34d399' : '#f87171'
                }}
              >
                {soundEnabled ? 'Açık' : 'Kapalı'}
              </button>
            </div>
          </div>

          {/* Auto-Pronounce Switch */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Otomatik Kelime Seslendirme</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Kelimeleri otomatik seslendirir.</div>
            </div>
            <div>
              <button
                onClick={() => {
                  const nextVal = !autoPronounceEnabled;
                  setAutoPronounceEnabled(nextVal);
                  localStorage.setItem('yokdil_auto_pronounce', String(nextVal));
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: autoPronounceEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: autoPronounceEnabled ? '1px solid #10b981' : '1px solid #ef4444',
                  color: autoPronounceEnabled ? '#34d399' : '#f87171'
                }}
              >
                {autoPronounceEnabled ? 'Açık' : 'Kapalı'}
              </button>
            </div>
          </div>

          {/* AI Assistant Button Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Bilge Baykuş Asistanı</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Ekranda yüzen yapay zeka asistanı butonu.</div>
            </div>
            <div>
              <button
                onClick={() => {
                  const nextVal = !showAiFloatBtn;
                  setShowAiFloatBtn(nextVal);
                  localStorage.setItem('yokdil_ai_float_btn_enabled', String(nextVal));
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: showAiFloatBtn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: showAiFloatBtn ? '1px solid #10b981' : '1px solid #ef4444',
                  color: showAiFloatBtn ? '#34d399' : '#f87171'
                }}
              >
                {showAiFloatBtn ? 'Açık' : 'Kapalı'}
              </button>
            </div>
          </div>
        </div>

        {/* CARD 3.5: SINAV TARIHI */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
            <i className="fa-regular fa-calendar-days" style={{ color: '#10b981' }}></i> Hedef YÖKDİL Sınavı
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Sınav Tarihinizi Seçin</label>
            <input 
              type="date"
              value={yokdilExamDate}
              onChange={(e) => setYokdilExamDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.85rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: 'white',
                outline: 'none'
              }}
            />
            <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>Bu tarih, ana sayfada sınav gününe özel canlı geri sayım widget'ını aktifleştirecektir.</p>
          </div>
        </div>

        {/* CARD 4: GÜNLÜK HEDEFLER */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(10px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
            <i className="fa-solid fa-bullseye" style={{ color: '#fb923c' }}></i> Günlük Hedefler
          </h3>

          {/* Custom Daily Question Goal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Soru Çözme Hedefi</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Dashboard günlük soru hedefi.</div>
            </div>
            <div>
              <select
                value={dailyQuestionGoal}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDailyQuestionGoal(val);
                  localStorage.setItem('yokdil_goal_target_questions', String(val));
                }}
                className="duo-input"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value={10} style={{ background: '#0d111c' }}>10 Soru</option>
                <option value={20} style={{ background: '#0d111c' }}>20 Soru</option>
                <option value={35} style={{ background: '#0d111c' }}>35 Soru</option>
                <option value={50} style={{ background: '#0d111c' }}>50 Soru</option>
              </select>
            </div>
          </div>

          {/* Custom Daily Word Goal */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Kelime Çalışma Hedefi</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Dashboard günlük kelime hedefi.</div>
            </div>
            <div>
              <select
                value={dailyWordGoal}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDailyWordGoal(val);
                  localStorage.setItem('yokdil_goal_target_words', String(val));
                }}
                className="duo-input"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value={5} style={{ background: '#0d111c' }}>5 Kelime</option>
                <option value={10} style={{ background: '#0d111c' }}>10 Kelime</option>
                <option value={15} style={{ background: '#0d111c' }}>15 Kelime</option>
                <option value={25} style={{ background: '#0d111c' }}>25 Kelime</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* CARD 5: VERİ TEMİZLEME VE HESAP SIFIRLAMA */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(239, 68, 68, 0.15)', background: 'rgba(239, 68, 68, 0.02)', display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f87171', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(239, 68, 68, 0.1)', paddingBottom: '12px' }}>
          <i className="fa-solid fa-triangle-exclamation"></i> Veri Sıfırlama ve Temizleme
        </h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedExam && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '1 1 350px', paddingRight: '12px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>"{selectedExam.name}" Temizle</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Aktif sınava ait cevapları sıfırlar.</div>
              </div>
              <button 
                onClick={handleResetProgress}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer transition-all"
              >
                Sınavı Sıfırla
              </button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: '1 1 350px', borderLeft: selectedExam ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingLeft: selectedExam ? '16px' : '0' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#f87171' }}>Tüm İlerlemeyi Sıfırla</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Tüm sınavları, istatistikleri ve kelime defterini sıfırlar.</div>
            </div>
            <button 
              onClick={handleResetAllProgress}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md cursor-pointer border-none"
            >
              Tüm Hesabı Sıfırla
            </button>
          </div>
        </div>
      </div>

      {/* CARD 6: ACCOUNT ACTIONS FOR MOBILE/ALL */}
      <div className="glass-card" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <i className="fa-solid fa-user-gear"></i> Hesap ve Oturum Yönetimi
        </h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory(null);
              if (setSelectedExam) setSelectedExam(null);
            }}
            className="btn-secondary"
            style={{ flex: 1, padding: '12px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-arrow-right-to-bracket"></i> Alan Değiştir
          </button>
          <button 
            onClick={onLogout}
            className="btn-secondary"
            style={{ flex: 1, padding: '12px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: '#f87171', color: '#f87171', background: 'rgba(239, 68, 68, 0.03)' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
