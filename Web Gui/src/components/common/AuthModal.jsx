import React, { useState } from 'react';
import { X, User, Sparkles } from 'lucide-react';

const AuthModal = ({ show, onClose, onAuthSuccess, BACKEND_URL }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Lütfen geçerli bir isim yazın.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL || (window.location.protocol + '//' + window.location.hostname + ':5000')}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Giriş işlemi başarısız.');
      }

      onAuthSuccess(data.token, data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        <button 
          onClick={onClose} 
          className="auth-modal-close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-6" style={{ textAlign: 'center' }}>
          <div className="landing-gate-logo" style={{ marginBottom: '12px' }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="landing-gate-title" style={{ fontSize: '1.1rem' }}>
            Giriş Yap / Profil Oluştur
          </h3>
          <p className="landing-gate-text" style={{ marginTop: '6px' }}>
            İsminizi yazarak anında yedekleme hesabınızı oluşturabilir veya mevcut profilinize bağlanabilirsiniz.
          </p>
        </div>

        {error && (
          <div style={{ padding: '10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.75rem', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="landing-gate-form">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="text-[10px] uppercase font-bold text-slate-400" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Adınız Soyadınız</label>
            <input 
              type="text"
              required
              placeholder="Örn: Ahmet Yılmaz"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="landing-gate-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="landing-gate-button"
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Bağlanılıyor...' : 'Devam Et'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
