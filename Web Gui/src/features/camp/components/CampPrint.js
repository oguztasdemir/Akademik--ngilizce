export const handlePrintPDF = (dayNum, wordsList, stats, selectedCategory, totalCampDays) => {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert("Popup engelleyiciyi devre dışı bırakın!");
    return;
  }

  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const isMonthly = (dayNum % 28 === 0) || (dayNum === totalCampDays);
  const isSec = !isMonthly && ((dayNum % 7 === 0) || (dayNum === totalCampDays));
  const titleText = isMonthly 
    ? `Aylık Genel Değerlendirme Raporu - Ay ${Math.ceil(dayNum / 28)}` 
    : (isSec ? `Haftalık Değerlendirme Raporu - Hafta ${Math.ceil(dayNum / 7)}` : `Günlük Çalışma Raporu - Gün ${dayNum}`);

  let wordsRows = wordsList.map((w, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 10px; font-weight: bold; color: #1e293b;">${idx + 1}. ${w.word}</td>
      <td style="padding: 10px; color: #475569; font-style: italic;">${w.type || ''}</td>
      <td style="padding: 10px; color: #0f172a; font-weight: 500;">${w.tr || w.turkish || ''}</td>
      <td style="padding: 10px; color: #475569; font-size: 0.85rem;">${w.sentence || w.sentence_en || ''}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <html>
      <head>
        <title>${titleText}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background-color: #ffffff; }
          h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; font-size: 1.8rem; }
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
        <h1>📝 ${titleText}</h1>
        <div class="meta-box">
          <div class="meta-item">Kategori: <strong>YÖKDİL ${categoryText}</strong></div>
          <div class="meta-item">Tamamlanma Durumu: <strong>✓ Başarıyla Tamamlandı</strong></div>
          ${stats ? `<div class="meta-item">Skor / Başarı Oranı: <strong>%${stats.score || '100'}</strong></div>` : ''}
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
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
