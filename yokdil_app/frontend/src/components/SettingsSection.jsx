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
  handleResetAllProgress
}) => {
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

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
    try {
      const res = await fetch('http://127.0.0.1:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
          password: profilePassword || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profil güncellenemedi.');
      setUpdateSuccess('Profiliniz başarıyla güncellendi.');
      setProfilePassword('');
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Hesabınızı ve buluttaki tüm verilerinizi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    try {
      const res = await fetch('http://127.0.0.1:5000/api/user/profile', {
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
    <div className="space-y-4 text-left">
      <div className="section-title">
        <h2>Uygulama Ayarları ⚙️</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uygulama temasını, yazı boyutunu ve ilerlemenizi özelleştirin.</p>
      </div>

      {/* CLOUD ACCOUNT SECTION */}
      <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-4">
        {currentUser ? (
          <div className="space-y-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>Aktif Profil: {currentUser.name} 👤</h4>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>İlerlemeniz otomatik olarak buluta yedeklenmektedir.</p>
              </div>
              <button 
                onClick={onLogout}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
              >
                Çıkış Yap
              </button>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-main)' }}>Kalıcı Hesap Silme</h5>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>Tüm verilerinizi buluttan kalıcı olarak kaldırın.</p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="px-3.5 py-2 text-[10px] font-bold rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20"
              >
                Hesabı Sil
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>Bulut Senkronizasyonu ☁️</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>İsminizi yazarak ilerlemenizi cihazlar arasında eşitleyin.</p>
            </div>
            <button 
              onClick={onOpenAuthModal}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg"
            >
              Giriş Yap
            </button>
          </div>
        )}
      </div>

      {/* DEVICE LINKING SECTION */}
      {currentUser && (
        <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>💻📱 PC - Mobil Cihaz Bağlantısı</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>QR kodu telefonunuzdan okutarak bu profili ve tüm verilerinizi bağlayın.</p>
            </div>
            <button 
              onClick={handleGenerateQR}
              disabled={qrLoading}
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 transition-all"
            >
              {qrLoading ? 'Yükleniyor...' : showQR ? 'Kapat' : 'Bağlantı Kodu (QR)'}
            </button>
          </div>

          {showQR && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
              <div style={{ padding: '10px', background: '#fff', borderRadius: '12px', display: 'inline-block' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`http://${localIp}:5173/#/link-device?token=${token}&name=${currentUser.name}`)}`}
                  alt="Sync QR Code"
                  style={{ display: 'block', width: '160px', height: '160px' }}
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.4 }}>
                Telefonunuzu PC ile aynı Wi-Fi/Yerel ağa bağlayın, ardından kameranızdan bu QR kodu okutun.
              </p>
              <div style={{ background: '#ffffff05', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.65rem', fontFamily: 'monospace', width: '100%', wordBreak: 'break-all' }}>
                {`http://${localIp}:5173/#/link-device?token=${token}&name=${currentUser.name}`}
              </div>
            </div>
          )}
        </div>
      )}

      {/* THEME & FONT SETTINGS */}
      <div className="glass-card p-4.5 border border-white/5 bg-white/1 rounded-2xl space-y-4">
        {/* Theme Settings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Görünüm Teması</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Açık veya koyu modu seçin.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setTheme('theme-light')} 
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                theme === 'theme-light' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              Açık Tema
            </button>
            <button 
              onClick={() => setTheme('theme-dark')} 
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                theme === 'theme-dark' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              Koyu Tema
            </button>
          </div>
        </div>

        {/* Font Size Settings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Soru Metin Boyutu</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Soru metinlerinin ekrandaki büyüklüğünü ayarlayın.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['sm', 'base', 'lg', 'xl'].map(sz => (
              <button
                key={sz}
                onClick={() => setFontSize(sz)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  fontSize === sz ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                {sz.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Speech Rate Settings */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Sesli Okuma Hızı (Speech Speed)</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Kelimelerin telaffuz seslendirme hızını ayarlayın.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0.5, 0.75, 1.0, 1.25].map(rate => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  speechRate === rate ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                {rate === 1.0 ? 'Normal' : `${rate}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Effects Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Çalışma Ses Efektleri</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Doğru ve yanlış cevaplardaki ses bildirimlerini açın/kapatın.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                setSoundEnabled(true);
                localStorage.setItem('yokdil_sound_enabled', 'true');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                soundEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              Açık
            </button>
            <button
              onClick={() => {
                setSoundEnabled(false);
                localStorage.setItem('yokdil_sound_enabled', 'false');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                !soundEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              Kapalı
            </button>
          </div>
        </div>

        {/* Reset Progress Section */}
        {selectedExam && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Aktif Sınav İlerlemesi</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>"{selectedExam.name}" sınavına ait tüm cevaplarınızı temizleyin.</p>
            </div>
            <button 
              onClick={handleResetProgress}
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 transition-all"
            >
              İlerlemeyi Sıfırla
            </button>
          </div>
        )}

        {/* Auto-Pronounce Switch */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Otomatik Kelime Telaffuzu</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Kelime kartını çevirdiğinizde veya açtığınızda otomatik olarak seslendirir.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                setAutoPronounceEnabled(true);
                localStorage.setItem('yokdil_auto_pronounce', 'true');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                autoPronounceEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              Açık
            </button>
            <button
              onClick={() => {
                setAutoPronounceEnabled(false);
                localStorage.setItem('yokdil_auto_pronounce', 'false');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                !autoPronounceEnabled ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
              }`}
            >
              Kapalı
            </button>
          </div>
        </div>

        {/* Custom Daily Question Goal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Günlük Soru Çözme Hedefi</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Dashboard'da gösterilen günlük soru çözüm hedefinizi seçin.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[10, 20, 35, 50].map(val => (
              <button
                key={val}
                onClick={() => {
                  setDailyQuestionGoal(val);
                  localStorage.setItem('yokdil_goal_target_questions', String(val));
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  dailyQuestionGoal === val ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                {val} Soru
              </button>
            ))}
          </div>
        </div>

        {/* Custom Daily Word Goal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem' }}>Günlük Kelime Çalışma Hedefi</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Dashboard'da gösterilen günlük yeni kelime öğrenme hedefinizi seçin.</p>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[5, 10, 15, 25].map(val => (
              <button
                key={val}
                onClick={() => {
                  setDailyWordGoal(val);
                  localStorage.setItem('yokdil_goal_target_words', String(val));
                }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  dailyWordGoal === val ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                {val} Kelime
              </button>
            ))}
          </div>
        </div>

        {/* Account Data Wipe */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(239,68,68,0.15)', paddingTop: '14px', marginTop: '10px' }}>
          <div>
            <h4 style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f87171' }}>Tüm Verileri Temizle (Hesap Sıfırlama)</h4>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Tüm sınav cevaplarınızı, istatistiklerinizi ve kelime defterinizi sıfırlayın.</p>
          </div>
          <button 
            onClick={handleResetAllProgress}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-md"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            ⚠️ Tüm Hesabı Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
