import html2pdf from 'html2pdf.js';

export const handlePrintPDF = (dayNum, wordsList, stats, selectedCategory, totalCampDays) => {
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert("Popup engelleyiciyi devre dışı bırakın!");
    return;
  }

  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const isCikmis = wordsList.length > 0 && !wordsList[0].hasOwnProperty('word') && wordsList[0].hasOwnProperty('english');

  const titleText = isCikmis 
    ? `Çıkmış Kelimeler Çalışma Raporu - Gün ${dayNum}`
    : (((dayNum % 28 === 0) || (dayNum === totalCampDays))
      ? `Aylık Genel Değerlendirme Raporu - Ay ${Math.ceil(dayNum / 28)}` 
      : (((dayNum % 7 === 0) || (dayNum === totalCampDays)) ? `Haftalık Değerlendirme Raporu - Hafta ${Math.ceil(dayNum / 7)}` : `Günlük Çalışma Raporu - Gün ${dayNum}`));

  let bodyContent = '';

  if (isCikmis) {
    const swipeResults = (stats && stats.swipeResults) || {};
    const knownWords = wordsList.filter(w => swipeResults[w.english] !== false);
    const unknownWords = wordsList.filter(w => swipeResults[w.english] === false);

    // Sort alphabetically
    knownWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));
    unknownWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));

    const renderCikmisRows = (list) => {
      if (list.length === 0) {
        return `<tr><td colspan="3" style="padding: 16px; text-align: center; color: #94a3b8; font-style: italic;">Bu grupta kelime bulunmamaktadır.</td></tr>`;
      }
      return list.map((w, idx) => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px; font-weight: 600; color: #0f172a; width: 35%;">${idx + 1}. ${w.english}</td>
          <td style="padding: 12px; color: #64748b; font-style: italic; width: 25%; font-size: 0.9rem;">${w.pronunciation ? `/${w.pronunciation}/` : ''}</td>
          <td style="padding: 12px; color: #334155; font-weight: 500; width: 40%;">${w.turkish || ''}</td>
        </tr>
      `).join('');
    };

    bodyContent = `
      <div style="margin-top: 10px;">
        <h3 style="color: #10b981; font-size: 1.15rem; margin-bottom: 8px; border-bottom: 2px solid #a7f3d0; padding-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          🟢 Bildiğim Kelimeler (${knownWords.length} Adet)
        </h3>
        <table style="margin-bottom: 30px;">
          <thead>
            <tr>
              <th style="background-color: #f0fdf4; color: #166534; border-bottom: 2px solid #bbf7d0;">Kelime (İngilizce)</th>
              <th style="background-color: #f0fdf4; color: #166534; border-bottom: 2px solid #bbf7d0;">Telaffuz</th>
              <th style="background-color: #f0fdf4; color: #166534; border-bottom: 2px solid #bbf7d0;">Türkçe Anlamı</th>
            </tr>
          </thead>
          <tbody>
            ${renderCikmisRows(knownWords)}
          </tbody>
        </table>

        <h3 style="color: #ef4444; font-size: 1.15rem; margin-bottom: 8px; border-bottom: 2px solid #fca5a5; padding-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          🔴 Bilmediğim / Tekrar Etmem Gereken Kelimeler (${unknownWords.length} Adet)
        </h3>
        <table>
          <thead>
            <tr>
              <th style="background-color: #fef2f2; color: #991b1b; border-bottom: 2px solid #fecaca;">Kelime (İngilizce)</th>
              <th style="background-color: #fef2f2; color: #991b1b; border-bottom: 2px solid #fecaca;">Telaffuz</th>
              <th style="background-color: #fef2f2; color: #991b1b; border-bottom: 2px solid #fecaca;">Türkçe Anlamı</th>
            </tr>
          </thead>
          <tbody>
            ${renderCikmisRows(unknownWords)}
          </tbody>
        </table>
      </div>
    `;
  } else {
    let wordsRows = wordsList.map((w, idx) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #1e293b;">${idx + 1}. ${w.word}</td>
        <td style="padding: 10px; color: #475569; font-style: italic;">${w.type || ''}</td>
        <td style="padding: 10px; color: #0f172a; font-weight: 500;">${w.tr || w.turkish || ''}</td>
        <td style="padding: 10px; color: #475569; font-size: 0.85rem;">${w.sentence || w.sentence_en || ''}</td>
      </tr>
    `).join('');

    bodyContent = `
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
    `;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${titleText}</title>
        <style>
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            padding: 40px; 
            color: #1e293b; 
            background-color: #ffffff; 
            line-height: 1.5;
          }
          h1 { 
            color: #4f46e5; 
            border-bottom: 2.5px solid #f1f5f9; 
            padding-bottom: 12px; 
            font-size: 1.85rem; 
            font-weight: 800;
            margin-top: 0;
          }
          .meta-box { 
            background-color: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 12px; 
            padding: 16px 20px; 
            margin-bottom: 24px; 
            display: flex; 
            justify-content: space-between; 
            flex-wrap: wrap;
            gap: 12px;
          }
          .meta-item { 
            font-size: 0.88rem; 
            color: #64748b; 
          }
          .meta-item strong { 
            color: #0f172a; 
            font-size: 1.05rem; 
            margin-left: 4px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
            font-size: 0.92rem;
          }
          th { 
            background-color: #f1f5f9; 
            color: #475569; 
            text-align: left; 
            padding: 12px; 
            font-size: 0.85rem; 
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 2px solid #cbd5e1; 
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
            ">🖨️ Raporu Dışarı Aktar / Yazdır</button>
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
          <div class="meta-item">Kategori: <strong>YÖKDİL ${categoryText}</strong></div>
          <div class="meta-item">Tamamlanma Durumu: <strong>✓ Başarıyla Tamamlandı</strong></div>
          ${stats ? `<div class="meta-item">Başarı Oranı: <strong>%${stats.score || '100'}</strong></div>` : ''}
        </div>
        ${bodyContent}

      </body>
    </html>
  `);
  printWindow.document.close();
};

export const handlePrintCikmisExportPDF = (studiedWords, unstudiedWords, mode, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const modeText = mode === 'swipe' ? 'Hızlı Kart Pratiği (Swipe)' : 'Detaylı Kelime Kampı';

  studiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));
  unstudiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));

  const renderStudiedRows = () => {
    if (studiedWords.length === 0) {
      return `<tr><td colspan="4" style="padding: 16px; text-align: center; color: #94a3b8; font-style: italic;">Henüz bu modda çalışılmış kelime bulunmamaktadır.</td></tr>`;
    }
    return studiedWords.map((w, idx) => {
      let statusHtml = '';
      if (mode === 'swipe') {
        statusHtml = w.status 
          ? `<span class="badge-bildigim">Bildiğim</span>`
          : `<span class="badge-bilmedigim">Bilmediğim</span>`;
      } else {
        statusHtml = w.status
          ? `<span class="badge-bildigim">Doğru</span>`
          : `<span class="badge-bilmedigim">Yanlış</span>`;
      }

      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td class="word-english" style="padding: 10px; font-weight: 600; color: #0f172a; width: 25%;">${idx + 1}. ${w.english}</td>
          <td style="padding: 10px; color: #334155; width: 35%;">${w.turkish || ''}</td>
          <td style="padding: 10px; text-align: center; width: 20%;">${statusHtml}</td>
          <td style="padding: 10px; border-left: 1px dashed #cbd5e1; width: 20%;"></td>
        </tr>
      `;
    }).join('');
  };

  const renderUnstudiedRows = () => {
    if (unstudiedWords.length === 0) {
      return `<tr><td colspan="3" style="padding: 16px; text-align: center; color: #94a3b8; font-style: italic;">Tüm kelimeler çalışılmıştır! 🎉</td></tr>`;
    }
    return unstudiedWords.map((w, idx) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td class="word-english" style="padding: 10px; font-weight: 600; color: #475569; width: 30%;">${idx + 1}. ${w.english}</td>
        <td style="padding: 10px; color: #475569; width: 50%;">${w.turkish || ''}</td>
        <td style="padding: 10px; border-left: 1px dashed #cbd5e1; width: 20%;"></td>
      </tr>
    `).join('');
  };

  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert("Popup engelleyiciyi devre dışı bırakın!");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>YOKDIL_${categoryText.replace(' ', '_')}_Kelime_Kampi_Karne</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', system-ui, sans-serif;
            background: #ffffff;
            color: #1e293b;
            padding: 30px;
            margin: 0;
          }
          th {
            background-color: #f1f5f9;
            color: #475569;
            border-bottom: 2px solid #cbd5e1;
            font-weight: 700;
            padding: 10px;
            text-align: left;
            font-size: 0.8rem;
          }
          tr {
            border-bottom: 1px solid #e2e8f0;
          }
          td {
            padding: 10px;
            color: #334155;
            font-size: 0.88rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .badge-bildigim {
            color: #166534;
            background-color: #dcfce7;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
          }
          .badge-bilmedigim {
            color: #991b1b;
            background-color: #fee2e2;
            padding: 2px 8px;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
          }
          h1 {
            color: #4f46e5;
            border-bottom: 2.5px solid #f1f5f9;
            padding-bottom: 12px;
            font-size: 1.7rem;
            font-weight: 800;
            margin-top: 0;
          }
          h3 {
            color: #1e1b4b;
            font-size: 1.15rem;
            margin-top: 24px;
            margin-bottom: 10px;
            padding-bottom: 4px;
            border-bottom: 2px solid #e2e8f0;
          }
          .meta-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 14px 20px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            font-size: 0.88rem;
          }
          @media print {
            body { padding: 0; }
            h1 { page-break-after: avoid; }
            h3 { page-break-after: avoid; }
            tr { page-break-inside: avoid; }
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
            ">🖨️ Raporu Dışarı Aktar / Yazdır</button>
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

        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2.5px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0; border: none; padding: 0;">📋 Kelime Kampı Karne Raporu</h1>
          <span style="font-size: 0.9rem; color: #64748b;">\${new Date().toLocaleDateString()}</span>
        </div>
        
        <div class="meta-box">
          <div>Alan: <strong>YÖKDİL \${categoryText}</strong></div>
          <div>Çalışma Modu: <strong>\${modeText}</strong></div>
          <div>Çalışılan Kelime: <strong>\${studiedWords.length} Adet</strong></div>
        </div>

        <h3>🟢 Çalışmış ve Değerlendirilmiş Kelimeler</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 25%;">Kelime (İngilizce)</th>
              <th style="width: 35%;">Türkçe Anlamı</th>
              <th style="text-align: center; width: 20%;">Durum / Statü</th>
              <th style="width: 20%; border-left: 1px dashed #cbd5e1;">Çalışma Notu</th>
            </tr>
          </thead>
          <tbody>
            \${renderStudiedRows()}
          </tbody>
        </table>

        <h3>⚪ Henüz Çalışılmamış / Bilinmeyen Kelimeler (\${unstudiedWords.length} Adet)</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 30%;">Kelime (İngilizce)</th>
              <th style="width: 50%;">Türkçe Anlamı</th>
              <th style="width: 20%; border-left: 1px dashed #cbd5e1;">Çalışma Notu</th>
            </tr>
          </thead>
          <tbody>
            \${renderUnstudiedRows()}
          </tbody>
        </table>
        

      </body>
    </html>
  `);
  printWindow.document.close();
};;

export const handlePrintCikmisExportDocx = (studiedWords, unstudiedWords, mode, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const modeText = mode === 'swipe' ? 'Hızlı Kart Pratiği (Swipe)' : 'Detaylı Kelime Kampı';

  studiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));
  unstudiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));

  const renderStudiedRows = () => {
    if (studiedWords.length === 0) {
      return `<tr><td colspan="4" style="border: 1px solid #cbd5e1; padding: 10px; text-align: center; color: #94a3b8; font-style: italic;">Henüz bu modda çalışılmış kelime bulunmamaktadır.</td></tr>`;
    }
    return studiedWords.map((w, idx) => {
      const statusText = mode === 'swipe' ? (w.status ? 'Bildiğim' : 'Bilmediğim') : (w.status ? 'Doğru' : 'Yanlış');
      return `
        <tr>
          <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; width: 25%;">${idx + 1}. ${w.english}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; width: 35%;">${w.turkish || ''}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; width: 20%; font-weight: bold;">${statusText}</td>
          <td style="border: 1px solid #cbd5e1; padding: 8px; width: 20%;"></td>
        </tr>
      `;
    }).join('');
  };

  const renderUnstudiedRows = () => {
    if (unstudiedWords.length === 0) {
      return `<tr><td colspan="3" style="border: 1px solid #cbd5e1; padding: 10px; text-align: center; color: #94a3b8; font-style: italic;">Tüm kelimeler çalışılmıştır! 🎉</td></tr>`;
    }
    return unstudiedWords.map((w, idx) => `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; font-weight: bold; width: 30%;">${idx + 1}. ${w.english}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; width: 50%;">${w.turkish || ''}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; width: 20%;"></td>
      </tr>
    `).join('');
  };

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Kelime Kampı Karne Raporu</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background-color: #f1f5f9; padding: 8px; font-weight: bold; border: 1px solid #cbd5e1; }
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
            ">🖨️ Raporu Dışarı Aktar / Yazdır</button>
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

        <h2>📋 Kelime Kampı Karne Raporu (${new Date().toLocaleDateString()})</h2>
        <p><strong>Alan:</strong> YÖKDİL ${categoryText}</p>
        <p><strong>Çalışma Modu:</strong> ${modeText}</p>
        <p><strong>Çalışılan Kelime Sayısı:</strong> ${studiedWords.length} Adet</p>

        <h3>🟢 Çalışılmış ve Değerlendirilmiş Kelimeler</h3>
        <table>
          <thead>
            <tr>
              <th>Kelime (İngilizce)</th>
              <th>Türkçe Anlamı</th>
              <th>Durum / Statü</th>
              <th>Çalışma Notu</th>
            </tr>
          </thead>
          <tbody>
            ${renderStudiedRows()}
          </tbody>
        </table>

        <h3>⚪ Henüz Çalışılmamış / Bilinmeyen Kelimeler (${unstudiedWords.length} Adet)</h3>
        <table>
          <thead>
            <tr>
              <th>Kelime (İngilizce)</th>
              <th>Türkçe Anlamı</th>
              <th>Çalışma Notu</th>
            </tr>
          </thead>
          <tbody>
            ${renderUnstudiedRows()}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YOKDIL_${categoryText.replace(' ', '_')}_Kelime_Kampi_Karne.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handlePrintCikmisExportXlsx = (studiedWords, unstudiedWords, mode, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const modeText = mode === 'swipe' ? 'Hızlı Kart Pratiği (Swipe)' : 'Detaylı Kelime Kampı';

  studiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));
  unstudiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));

  const escapeXml = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Build lists for sheets
  const allWords = [];
  studiedWords.forEach(w => {
    const statusText = mode === 'swipe' ? (w.status ? 'Bildiğim' : 'Bilmediğim') : (w.status ? 'Doğru' : 'Yanlış');
    allWords.push({ english: w.english, turkish: w.turkish, status: statusText });
  });
  unstudiedWords.forEach(w => {
    allWords.push({ english: w.english, turkish: w.turkish, status: 'Çalışılmadı' });
  });

  const knownWords = studiedWords.filter(w => w.status === true);
  const unknownWords = [
    ...studiedWords.filter(w => w.status === false),
    ...unstudiedWords
  ];

  const buildSheetRows = (list) => {
    return list.map((w, idx) => `
    <Row>
     <Cell><Data ss:Type="Number">${idx + 1}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(w.english)}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(w.turkish)}</Data></Cell>
     <Cell><Data ss:Type="String">${escapeXml(w.status || (w.status === undefined ? 'Çalışılmadı' : (w.status ? 'Bildiğim' : 'Bilmediğim')))}</Data></Cell>
    </Row>`).join('');
  };

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
 <Worksheet ss:Name="Tümü">
  <Table>
   <Column ss:Width="60"/>
   <Column ss:Width="160"/>
   <Column ss:Width="260"/>
   <Column ss:Width="130"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Sıra No</Data></Cell>
    <Cell><Data ss:Type="String">Kelime (İngilizce)</Data></Cell>
    <Cell><Data ss:Type="String">Türkçe Anlamı</Data></Cell>
    <Cell><Data ss:Type="String">Durum / Statü</Data></Cell>
   </Row>
   ${buildSheetRows(allWords)}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Bilmediklerim">
  <Table>
   <Column ss:Width="60"/>
   <Column ss:Width="160"/>
   <Column ss:Width="260"/>
   <Column ss:Width="130"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Sıra No</Data></Cell>
    <Cell><Data ss:Type="String">Kelime (İngilizce)</Data></Cell>
    <Cell><Data ss:Type="String">Türkçe Anlamı</Data></Cell>
    <Cell><Data ss:Type="String">Durum / Statü</Data></Cell>
   </Row>
   \${buildSheetRows(unknownWords.map(w => ({ ...w, status: w.status === undefined ? 'Çalışılmadı' : (w.status ? 'Bildiğim/Doğru' : 'Bilmediğim/Yanlış') })))}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Bildiklerim">
  <Table>
   <Column ss:Width="60"/>
   <Column ss:Width="160"/>
   <Column ss:Width="260"/>
   <Column ss:Width="130"/>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Sıra No</Data></Cell>
    <Cell><Data ss:Type="String">Kelime (İngilizce)</Data></Cell>
    <Cell><Data ss:Type="String">Türkçe Anlamı</Data></Cell>
    <Cell><Data ss:Type="String">Durum / Statü</Data></Cell>
   </Row>
   \${buildSheetRows(knownWords.map(w => ({ ...w, status: mode === 'swipe' ? 'Bildiğim' : 'Doğru' })))}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YOKDIL_\${categoryText.replace(' ', '_')}_Kelime_Kampi_Karne.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};;
