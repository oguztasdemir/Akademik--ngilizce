export const handlePrintPDF = (dayNum, wordsList, totalDays) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert("Popup engelleyiciyi devre dışı bırakın!");
    return;
  }

  const isMonthly = (dayNum % 28 === 0) || (dayNum === totalDays);
  const isSec = !isMonthly && ((dayNum % 7 === 0) || (dayNum === totalDays));
  const titleText = isMonthly 
    ? `YDS Kitap Aylık Genel Değerlendirme Raporu - Ay ${Math.ceil(dayNum / 28)}` 
    : (isSec ? `YDS Kitap Haftalık Değerlendirme Raporu - Hafta ${Math.ceil(dayNum / 7)}` : `YDS Kitap Günlük Çalışma Raporu - Gün ${dayNum}`);

  let wordsRows = wordsList.map((w, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px; font-weight: bold; color: #1e293b;">${idx + 1}. ${w.word}</td>
      <td style="padding: 10px; color: #475569; font-style: italic;">${w.type || ''}</td>
      <td style="padding: 10px; color: #0f172a; font-weight: 500;">${w.turkish || ''}</td>
      <td style="padding: 10px; color: #475569; font-size: 0.85rem;">${w.sentence_en || ''}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>${titleText}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background-color: #ffffff; }
          h1 { color: #818cf8; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 1.8rem; }
          .meta-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .meta-item { font-size: 0.9rem; color: #475569; }
          .meta-item strong { color: #0f172a; font-size: 1.1rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f1f5f9; color: #475569; text-align: left; padding: 12px; font-size: 0.9rem; border-bottom: 2px solid #cbd5e1; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
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

        <h1>📝 ${titleText}</h1>
        <div class="meta-box">
          <div class="meta-item">Kategori: <strong>YDS Kelime Kitabı</strong></div>
          <div class="meta-item">Tamamlanma Durumu: <strong>✓ Başarıyla Tamamlandı</strong></div>
        </div>
        <h3>📚 Kelime Listesi (${wordsList.length} Sözcük)</h3>
        <table>
          <thead>
            <tr>
              <th>Kelime</th>
              <th>Tür</th>
              <th>Türkçe Anlamı</th>
              <th>Örnek Cümle</th>
            </tr>
          </thead>
          <tbody>
            ${wordsRows}
          </tbody>
        </table>

      </body>
    </html>
  `);
  printWindow.document.close();
};
