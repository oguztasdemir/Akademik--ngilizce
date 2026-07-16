import React, { useState } from 'react';
import { Trophy, TrendingUp, Award, BookOpen, Activity, CheckCircle2, XCircle, Sparkles, Gamepad2, Layers, BookOpenCheck, HelpCircle } from 'lucide-react';

const PerformanceSection = ({
  activeTab,
  selectedExam,
  exams,
  answers,
  getStats,
  setActiveTab,
  wordStats = {},
  vocabPracticeList = [],
  notebook = []
}) => {
  const [perfTab, setPerfTab] = useState('summary'); // 'summary', 'cikmis', 'daily', 'book', 'reading', 'games'

  const exportPDF = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert("Popup engelleyiciyi devre dışı bırakın!");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>YOKDIL_Genel_Gelisim_Karnesi</title>
          <meta charset="utf-8">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; padding: 30px; color: #1e293b; }
            @media print {
              .print-control-bar {
                display: none !important;
              }
            }

            h1 { color: #4f46e5; border-bottom: 2.5px solid #f1f5f9; padding-bottom: 10px; margin-top: 0; }
            h3 { color: #1e1b4b; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px; margin-top: 24px; }
            .kpi-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
            .kpi-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; text-align: center; font-size: 0.85rem; }
            .kpi-value { font-size: 1.3rem; font-weight: 800; color: #4f46e5; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; }
            th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 0.8rem; border-bottom: 2px solid #cbd5e1; }
            td { padding: 10px; border-bottom: 1px solid #cbd5e1; font-size: 0.85rem; }
          </style>
        </head>
        <body>
        <div class="print-control-bar" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #1e1b4b;
          color: white;
          padding: 12px 24px;
          border-bottom: 2px solid #6366f1;
          font-family: system-ui, -apple-system, sans-serif;
          margin-bottom: 20px;
          border-radius: 8px;
        ">
          <div style="font-weight: 800; font-size: 0.95rem;">📄 YÖKDİL Akademik Rapor Önizleme</div>
          <div style="display: flex; gap: 8px;">
            <button onclick="downloadPDF()" style="
              background: #10b981;
              color: white;
              border: none;
              padding: 8px 16px;
              font-size: 0.8rem;
              font-weight: bold;
              border-radius: 6px;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.15);
              transition: all 0.2s;
            ">📥 PDF Olarak İndir</button>
            <button onclick="window.print()" style="
              background: #6366f1;
              color: white;
              border: none;
              padding: 8px 16px;
              font-size: 0.8rem;
              font-weight: bold;
              border-radius: 6px;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.15);
              transition: all 0.2s;
            ">🖨️ Yazdır / Kağıda Bas</button>
            <button onclick="window.close()" style="
              background: rgba(255,255,255,0.1);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              padding: 8px 16px;
              font-size: 0.8rem;
              font-weight: bold;
              border-radius: 6px;
              cursor: pointer;
            ">Kapat</button>
          </div>
        </div>

          <h1>📊 YÖKDİL Akademik Gelişim Raporu</h1>
          <p>Rapor Tarihi: ${new Date().toLocaleDateString()}</p>

          <div class="kpi-container">
            <div class="kpi-card"><div>Kelime Kampı</div><div class="kpi-value">${cikmisDoneDays} / 60 Gün</div></div>
            <div class="kpi-card"><div>Günlük Kamp</div><div class="kpi-value">${dailyDoneDays} / 60 Gün</div></div>
            <div class="kpi-card"><div>Okunan Makale</div><div class="kpi-value">${completedPassages.length} Adet</div></div>
            <div class="kpi-card"><div>Çözülen Sınav</div><div class="kpi-value">${stats.solved} Sınav</div></div>
          </div>

          <h3>🟢 Kelime Kampı İlerleme Detayları</h3>
          <table>
            <thead><tr><th>Gün</th><th>Tarih</th><th>Deneme Sayısı</th><th>Başarı Skoru</th></tr></thead>
            <tbody>
              ${Object.entries(cikmisProgress.completedDays || {}).map(([dayNum, record]) => `
                <tr><td>Gün ${dayNum}</td><td>${record.date}</td><td>${record.history?.length || 1}</td><td>%${record.score}</td></tr>
              `).join('')}
            </tbody>
          </table>

          <h3>📚 Kelime Defterim (${notebook.length} Kelime)</h3>
          <table>
            <thead><tr><th>Sıra</th><th>Kelime (İngilizce)</th><th>Türkçe Anlamı</th><th>Öğrenme Aşaması</th></tr></thead>
            <tbody>
              ${notebook.map((w, idx) => `
                <tr><td>${idx + 1}</td><td><strong>${w.english}</strong></td><td>${w.turkish}</td><td>Aşama ${w.leitnerStage || 1}</td></tr>
              `).join('')}
            </tbody>
          </table>

          <script>
            
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportExcel = () => {
    const allNotebookRows = notebook.map((w, idx) => `
      <Row>
       <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
       <Cell><Data ss:Type="String">${w.english}</Data></Cell>
       <Cell><Data ss:Type="String">${w.turkish}</Data></Cell>
       <Cell><Data ss:Type="String">Aşama ${w.leitnerStage || 1}</Data></Cell>
      </Row>`).join('');

    const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Genel İlerleme">
  <Table>
   <Column ss:Width="160"/>
   <Column ss:Width="120"/>
   <Row ss:StyleID="Header"><Cell><Data ss:Type="String">Metrik</Data></Cell><Cell><Data ss:Type="String">Değer</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Kelime Kampı (Çıkmış)</Data></Cell><Cell><Data ss:Type="String">${cikmisDoneDays} / 60 Gün</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Günlük SR Kampı</Data></Cell><Cell><Data ss:Type="String">${dailyDoneDays} / 60 Gün</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Dilbilgisi Kampı</Data></Cell><Cell><Data ss:Type="String">${grammarDoneDays} / 60 Gün</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">Okunan Makaleler</Data></Cell><Cell><Data ss:Type="String">${completedPassages.length} Adet</Data></Cell></Row>
   <Row><Cell><Data ss:Type="String">YDS Kitap Çalışmaları</Data></Cell><Cell><Data ss:Type="String">${bookCompletedDays.length} Gün</Data></Cell></Row>
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Kelime Defterim">
  <Table>
   <Column ss:Width="60"/>
   <Column ss:Width="150"/>
   <Column ss:Width="250"/>
   <Column ss:Width="140"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Sıra No</Data></Cell>
    <Cell><Data ss:Type="String">Kelime (İngilizce)</Data></Cell>
    <Cell><Data ss:Type="String">Türkçe Anlamı</Data></Cell>
    <Cell><Data ss:Type="String">Öğrenme Durumu</Data></Cell>
   </Row>
   ${allNotebookRows}
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YOKDIL_Akademik_Gelisim_Karnesi.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportDocx = () => {
    const docxContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Kelime Defteri Raporu</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h2>📝 YÖKDİL Akademik Kelime Defteri Raporu</h2>
        <p>Toplam Kayıtlı Kelime: <strong>${notebook.length}</strong></p>
        <hr/>
        <table border="1" cellspacing="0" cellpadding="8" style="border-collapse: collapse; width: 100%;">
          <tr style="background-color: #f1f5f9; font-weight: bold;">
            <th style="width: 10%;">No</th>
            <th style="width: 30%;">Kelime (İngilizce)</th>
            <th style="width: 40%;">Türkçe Anlamı</th>
            <th style="width: 20%;">Leitner Aşaması</th>
          </tr>
          ${notebook.map((w, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td style="font-weight: bold; color: #4f46e5;">${w.english}</td>
              <td>${w.turkish}</td>
              <td>Aşama ${w.leitnerStage || 1}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + docxContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `YOKDIL_Kelime_Defterim.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (activeTab !== 'performance') return null;

  // Retrieve progress files from localStorage
  const getProgress = (key, defaultVal) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const cikmisProgress = getProgress('yokdil_cikmis_camp_progress', { currentDay: 1, completedDays: {} });
  const dailyProgress = getProgress('yokdil_camp_progress', { currentDay: 1, completedDays: {} });
  const grammarProgress = getProgress('yokdil_grammar_camp_progress', { currentDay: 1, completedDays: {} });
  const completedPassages = getProgress('completed_passages', []);
  const bookCompletedDays = getProgress('completed_yds_days', []);

  const stats = getStats();

  // Calculations
  const cikmisDoneDays = Object.keys(cikmisProgress.completedDays || {}).length;
  const dailyDoneDays = Object.keys(dailyProgress.completedDays || {}).length;
  const grammarDoneDays = Object.keys(grammarProgress.completedDays || {}).length;

  return (
    <div className="space-y-6 text-left" style={{ maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      {/* Premium Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px', borderRadius: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity style={{ color: '#6366f1' }} size={24} /> Kişisel Gelişim Karnesi
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Tüm çalışma istatistiklerinizi ve ilerlemenizi tek bir panelden takip edin.</p>
        </div>
        
        {/* Export Buttons Block */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={exportPDF}
            className="btn-primary"
            style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', borderRadius: '8px' }}
          >
            📥 PDF Rapor
          </button>
          <button 
            onClick={exportExcel}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399', background: 'rgba(16,185,129,0.05)' }}
          >
            📊 Excel Rapor
          </button>
          <button 
            onClick={exportDocx}
            className="btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc', background: 'rgba(99,102,241,0.05)' }}
          >
            📝 Defteri İndir
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'summary', label: 'Genel Özet', icon: Layers },
          { id: 'cikmis', label: 'Kelime Kampı (Çıkmış)', icon: Trophy },
          { id: 'daily', label: 'Günlük Kamp', icon: Sparkles },
          { id: 'book', label: 'YDS Kitap', icon: BookOpenCheck },
          { id: 'reading', label: 'Paragraflar & Okuma', icon: BookOpen },
          { id: 'games', label: 'Mini Oyunlar', icon: Gamepad2 }
        ].map(t => {
          const Icon = t.icon;
          const isActive = perfTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setPerfTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255,255,255,0.05)',
                color: isActive ? '#a5b4fc' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Summary Tab */}
      {perfTab === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Stats KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyAllign: 'center', justifyContent: 'center' }}>
                <Trophy style={{ color: '#818cf8' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Kelime Kampı</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cikmisDoneDays} / 60 Gün</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ color: '#34d399' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Günlük Kamp</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{dailyDoneDays} / 60 Gün</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen style={{ color: '#f472b6' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Okunan Makale</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{completedPassages.length} Makale</div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award style={{ color: '#fbbf24' }} size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Çözülen Deneme</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{stats.solved} Sınav</div>
              </div>
            </div>
          </div>

          {/* Test Performance Detailed Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 16px 0' }}>
                <TrendingUp size={18} style={{ color: '#6366f1' }} /> Genel Gelişim Detayları
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Toplam Çözülen Soru</span>
                    <span style={{ fontWeight: 'bold' }}>{stats.solved * 80} Soru</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                    <div style={{ width: stats.solved > 0 ? '100%' : '0%', height: '100%', background: '#6366f1', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Dilbilgisi Kampı İlerlemesi</span>
                    <span style={{ fontWeight: 'bold' }}>{grammarDoneDays} / 60 Gün</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                    <div style={{ width: `${(grammarDoneDays / 60) * 100}%`, height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>YDS Kitap Çalışmaları</span>
                    <span style={{ fontWeight: 'bold' }}>{bookCompletedDays.length} Gün Tamamlandı</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                    <div style={{ width: `${(bookCompletedDays.length / 54) * 100}%`, height: '100%', background: '#fb923c', borderRadius: '4px' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.04)" strokeWidth="8" fill="transparent" />
                  <circle cx="60" cy="60" r="45" stroke="#6366f1" strokeWidth="8" fill="transparent"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 - (stats.solved > 0 ? (stats.correct / (stats.solved * 80)) : 0) * 2 * Math.PI * 45}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {stats.solved > 0 ? Math.round((stats.correct / (stats.solved * 80)) * 100) : 0}%
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#94a3b8', textTransform: 'uppercase' }}>Doğru Oranı</div>
                </div>
              </div>
              <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.72rem', color: '#cbd5e1' }}>
                Sınavlarda toplam <strong>{stats.correct}</strong> doğru ve <strong>{stats.wrong}</strong> yanlış yapıldı.
              </div>
            </div>
          </div>
          {/* Daily Activity Calendar Heat-map (Last 30 Days) */}
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
              <Activity size={18} style={{ color: '#10b981' }} /> Günlük Çalışma Aktivite Takvimi
            </h3>
            <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '-10px 0 16px 0' }}>
              Son 30 gün içinde tamamladığınız kelime, soru, paragraf ve mini oyun aktivitelerinin yoğunluk grafiği.
            </p>
            {(() => {
              const history = getProgress('yokdil_study_history', {});
              const today = new Date();
              const dates = [];
              for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                dates.push({ date: d, key: dateStr });
              }

              return (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px' }}>
                    {dates.map(({ date, key }) => {
                      const dayData = history[key] || { questions: 0, words: 0, games: 0, paragraphs: 0 };
                      const totalActivity = (dayData.questions || 0) + (dayData.words || 0) + (dayData.games || 0) + (dayData.paragraphs || 0);
                      
                      let bg = 'rgba(255, 255, 255, 0.03)';
                      let border = '1px solid rgba(255, 255, 255, 0.08)';
                      let tooltipTitle = `${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}: Aktivite yok`;
                      
                      if (totalActivity > 0) {
                        tooltipTitle = `${date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}: ${totalActivity} aktivite (${dayData.questions || 0} soru, ${dayData.words || 0} kelime, ${dayData.games || 0} oyun, ${dayData.paragraphs || 0} paragraf)`;
                        if (totalActivity <= 5) {
                          bg = 'rgba(16, 185, 129, 0.2)';
                          border = '1px solid rgba(16, 185, 129, 0.4)';
                        } else if (totalActivity <= 15) {
                          bg = 'rgba(16, 185, 129, 0.45)';
                          border = '1px solid rgba(16, 185, 129, 0.6)';
                        } else {
                          bg = 'rgba(16, 185, 129, 0.8)';
                          border = '1px solid rgba(16, 185, 129, 1)';
                        }
                      }

                      return (
                        <div 
                          key={key} 
                          title={tooltipTitle}
                          style={{
                            aspectRatio: '1',
                            background: bg,
                            border: border,
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          className="activity-day-cell"
                        >
                          <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: totalActivity > 15 ? 'white' : '#cbd5e1' }}>
                            {date.getDate()}
                          </span>
                          <span style={{ fontSize: '0.45rem', color: totalActivity > 15 ? 'rgba(255,255,255,0.8)' : '#94a3b8', transform: 'scale(0.95)' }}>
                            {date.toLocaleDateString('tr-TR', { month: 'short' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px', fontSize: '0.68rem', color: '#94a3b8', alignItems: 'center' }}>
                    <span>Az Aktivite</span>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.45)', border: '1px solid rgba(16, 185, 129, 0.6)' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.8)', border: '1px solid rgba(16, 185, 129, 1)' }} />
                    <span>Çok Aktivite</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Cikmis Vocabulary Camp Performance Tab */}
      {perfTab === 'cikmis' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Kelime Kampı (Çıkmış Sorulardan Kelimeler) Gelişimi</h3>
            <span style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: 'bold' }}>{cikmisDoneDays} / 60 Gün Tamamlandı</span>
          </div>

          {cikmisDoneDays === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış gün bulunmuyor.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(cikmisProgress.completedDays).map(([dayNum, record]) => {
                const history = record.history || [];
                return (
                  <div key={dayNum} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📅 Gün {dayNum} Akademik Kelimeleri</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', background: record.isPassed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: record.isPassed ? '#a7f3d0' : '#fca5a5' }}>
                          {record.isPassed ? 'Başarılı' : 'Başarısız'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                        Son Çözüm Tarihi: {record.date} | Toplam Deneme Sayısı: {history.length || 1} (v{history.length || 1})
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#818cf8' }}>%{record.score}</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>En Yüksek Skor</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Daily Vocabulary Camp Tab */}
      {perfTab === 'daily' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Günlük Spaced Repetition Kamp İlerlemesi</h3>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 'bold' }}>{dailyDoneDays} / 60 Gün Tamamlandı</span>
          </div>

          {dailyDoneDays === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış gün bulunmuyor.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(dailyProgress.completedDays).map(([dayNum, record]) => (
                <div key={dayNum} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 'bold' }}>📅 Gün {dayNum} Çalışması</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Tamamlanma Tarihi: {record.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>%{record.score}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94a3b8', textTransform: 'uppercase' }}>Çözüm Skoru</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* YDS Book Exercises Tab */}
      {perfTab === 'book' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>YDS Kitap Alıştırmaları Gelişimi</h3>
            <span style={{ fontSize: '0.78rem', color: '#fb923c', fontWeight: 'bold' }}>{bookCompletedDays.length} Gün Tamamlandı</span>
          </div>

          {bookCompletedDays.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış gün bulunmuyor.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {bookCompletedDays.map(dayNum => (
                <div key={dayNum} style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: '#fb923c' }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Gün {dayNum}</div>
                    <div style={{ fontSize: '0.62rem', color: '#cbd5e1' }}>Alıştırmalar Bitti</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reading Passages Tab */}
      {perfTab === 'reading' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Okunan Paragraflar ve Makaleler</h3>
            <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 'bold' }}>{completedPassages.length} Makale Okundu</span>
          </div>

          {completedPassages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '0.8rem' }}>Henüz tamamlanmış makale bulunmuyor.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              {completedPassages.map(pId => (
                <div key={pId} style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <BookOpen size={18} style={{ color: '#38bdf8' }} />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold' }}>Makale #{pId}</div>
                    <div style={{ fontSize: '0.62rem', color: '#cbd5e1' }}>Okuma Tamamlandı</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mini Games Tab */}
      {perfTab === 'games' && (
        <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Mini Oyun Rekorları & Aktiviteleri</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#ec4899', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gamepad2 size={16} /> Kart Eşleştirme Oyunu
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Kelimeleri sol-sağ paneller halinde en az hamle ile eşleştirin. Evcil hayvanınızın XP gelişimine doğrudan etki eder.
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#818cf8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Gamepad2 size={16} /> Eş Anlamlı Kelimeler
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                Kelimelerin akademik eş anlamlarını bularak doğru cevap sayısını ve puanınızı artırın.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceSection;
