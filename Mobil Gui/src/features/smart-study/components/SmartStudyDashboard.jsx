import React from 'react';
import { BookOpen } from 'lucide-react';

const SmartStudyDashboard = ({
  wordLimit,
  setWordLimit,
  handleStartStudy
}) => {
  return (
    <div className="glass-card" style={{ padding: '32px', borderRadius: '24px', background: 'rgba(11, 15, 26, 0.7)', border: '1px solid rgba(255,255,255,0.06)', minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1.5px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <BookOpen className="h-8 w-8" />
          </div>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white', margin: '8px 0 0 0' }}>Kelime Öğrenim Kampı</h2>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '28px' }}>
          Bu modülde seçtiğiniz sayıda akademik kelimeyi; önce inceleyerek öğrenir, ardından doğru anlamını seçeneklerden bularak test edersiniz.
        </p>

        <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
          Çalışmak istediğiniz kelime sayısını seçin:
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
          {[5, 10, 15, 20].map((num) => (
            <button
              key={num}
              onClick={() => setWordLimit(num)}
              style={{
                padding: '12px',
                borderRadius: '10px',
                background: wordLimit === num ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                border: wordLimit === num ? '1.5px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                color: wordLimit === num ? '#a5b4fc' : 'white',
                fontSize: '0.84rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {num} Kelime {num === 5 ? '(Hızlı)' : num === 10 ? '(Standart)' : num === 15 ? '(Detaylı)' : '(Kamp)'}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleStartStudy(wordLimit)}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          Çalışmayı Başlat 🚀
        </button>
      </div>
    </div>
  );
};

export default SmartStudyDashboard;
