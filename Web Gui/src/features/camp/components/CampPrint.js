export const handlePrintPDF = (dayNum, wordsList, stats, selectedCategory, totalCampDays, vocabMeaningSelections) => {
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

    knownWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));
    unknownWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));

    const renderCikmisRows = (list) => {
      if (list.length === 0) {
        return '<tr><td colspan="3" style="padding: 16px; text-align: center; color: #94a3b8; font-style: italic;">Bu grupta kelime bulunmamaktadır.</td></tr>';
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
    let wordsRows = wordsList.map((w, idx) => {
      const selections = vocabMeaningSelections && vocabMeaningSelections[w.word];
      let trFormatted = '';
      const fullTr = w.tr || w.turkish || '';
      
      if (selections && (selections.known || selections.unknown)) {
        const knownList = selections.known || [];
        const unknownList = selections.unknown || [];
        const allMeanings = fullTr.split(',').map(s => s.trim());
        
        trFormatted = allMeanings.map(m => {
          if (knownList.includes(m)) {
            return `<div style="color: #16a34a; font-weight: bold; display: flex; align-items: center; gap: 4px; margin-bottom: 2px;"><span style="font-size: 1.1em;">✓</span> ${m}</div>`;
          } else if (unknownList.includes(m)) {
            return `<div style="color: #dc2626; font-weight: bold; display: flex; align-items: center; gap: 4px; margin-bottom: 2px;"><span style="font-size: 1.1em;">✗</span> ${m}</div>`;
          } else {
            return `<div style="color: #475569; display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">• ${m}</div>`;
          }
        }).join('');
      } else {
        trFormatted = fullTr.split(',').map(s => {
          return `<div style="color: #1e293b; margin-bottom: 2px;">• ${s.trim()}</div>`;
        }).join('');
      }

      return `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px; font-weight: bold; color: #1e293b; vertical-align: top;">${idx + 1}. ${w.word}</td>
          <td style="padding: 10px; color: #475569; font-style: italic; vertical-align: top;">${w.type || ''}</td>
          <td style="padding: 10px; vertical-align: top;">${trFormatted}</td>
          <td style="padding: 10px; color: #475569; font-size: 0.85rem; vertical-align: top;">${w.sentence || w.sentence_en || ''}</td>
        </tr>
      `;
    }).join('');

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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
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
            .print-control-bar { display: none !important; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body>
        <!-- Progress Bar Overlay -->
        <div id="progress-overlay" style="
          display: none;
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          z-index: 99999;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="background: rgba(30, 41, 59, 0.95); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); width: 340px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="font-weight: 800; font-size: 1.15rem; margin-bottom: 8px; color: #10b981;">🔄 PDF Raporu Hazırlanıyor</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 20px;">Lütfen bekleyin, sayfalar hazırlanıyor.</div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
              <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); transition: width 0.1s;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; margin-bottom: 8px;">
              <span>İlerleme:</span>
              <span id="progress-text">0%</span>
            </div>
            <div id="progress-time" style="font-size: 0.72rem; color: #cbd5e1; font-style: italic;">Hesaplanıyor...</div>
          </div>
        </div>

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
          <div style="font-weight: 800; font-size: 0.95rem;">📄 YÖKDİL Rapor Önizleme</div>
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
          <div class="meta-item">Kategori: <strong>YÖKDİL ${categoryText}</strong></div>
          <div class="meta-item">Tamamlanma Durumu: <strong>✓ Başarıyla Tamamlandı</strong></div>
          ${stats ? `<div class="meta-item">Başarı Oranı: <strong>%${stats.score || '100'}</strong></div>` : ''}
        </div>
        ${bodyContent}

        <script>
          async function downloadPDF() {
            const controlBar = document.querySelector('.print-control-bar');
            const progressOverlay = document.getElementById('progress-overlay');
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const progressTime = document.getElementById('progress-time');

            controlBar.style.display = 'none';
            progressOverlay.style.display = 'flex';

            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const totalRows = rows.length;
            
            if (totalRows === 0) {
              alert("Yazdırılacak veri bulunamadı.");
              progressOverlay.style.display = 'none';
              controlBar.style.display = 'flex';
              return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pdfWidth - 2 * margin;

            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '750px';
            tempContainer.style.background = '#ffffff';
            tempContainer.style.padding = '20px';
            document.body.appendChild(tempContainer);

            const styleTag = document.createElement('style');
            styleTag.innerHTML = "table { width: 100%; border-collapse: collapse; margin-top: 10px; } th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; } td { padding: 9px; font-size: 11px; color: #334155; border-bottom: 1px solid #e2e8f0; }";
            tempContainer.appendChild(styleTag);

            const originalHeader = document.querySelector('thead').innerHTML;
            const chunkSize = 25;
            const totalChunks = Math.ceil(totalRows / chunkSize);
            const startTime = Date.now();

            for (let i = 0; i < totalChunks; i++) {
              const existingTable = tempContainer.querySelector('table');
              if (existingTable) tempContainer.removeChild(existingTable);

              const chunkTable = document.createElement('table');
              const thead = document.createElement('thead');
              thead.innerHTML = originalHeader;
              chunkTable.appendChild(thead);

              const tbody = document.createElement('tbody');
              const startIdx = i * chunkSize;
              const endIdx = Math.min(startIdx + chunkSize, totalRows);
              
              for (let r = startIdx; r < endIdx; r++) {
                tbody.appendChild(rows[r].cloneNode(true));
              }
              chunkTable.appendChild(tbody);
              tempContainer.appendChild(chunkTable);

              const canvas = await html2canvas(tempContainer, {
                scale: 1.5,
                useCORS: true,
                logging: false
              });

              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              const imgHeight = (canvas.height * contentWidth) / canvas.width;

              if (i > 0) {
                pdf.addPage();
              }
              pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, imgHeight);

              const progress = Math.round(((i + 1) / totalChunks) * 100);
              progressBar.style.width = progress + '%';
              progressText.innerText = progress + '%';

              const elapsed = Date.now() - startTime;
              const avgTimePerChunk = elapsed / (i + 1);
              const remainingChunks = totalChunks - (i + 1);
              const estRemainingMs = remainingChunks * avgTimePerChunk;
              const estRemainingSec = Math.ceil(estRemainingMs / 1000);
              progressTime.innerText = "Tahmini Kalan Süre: " + estRemainingSec + " saniye";

              await new Promise(resolve => setTimeout(resolve, 30));
            }

            document.body.removeChild(tempContainer);
            pdf.save("YOKDIL_Akademik_Rapor.pdf");

            progressOverlay.style.display = 'none';
            controlBar.style.display = 'flex';
          }
        </script>
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

  const knownWords = studiedWords.filter(w => w.status === true);
  const unknownWords = studiedWords.filter(w => w.status === false);
  const totalWordsCount = studiedWords.length + unstudiedWords.length;
  const studiedWordsCount = studiedWords.length;
  const unstudiedWordsCount = unstudiedWords.length;
  const knowledgePercent = studiedWordsCount > 0 ? ((knownWords.length / studiedWordsCount) * 100).toFixed(0) : 0;
  const reportDateTime = new Date().toLocaleString('tr-TR');

  const renderStudiedRows = () => {
    if (studiedWords.length === 0) {
      return '<tr><td colspan="4" style="padding: 16px; text-align: center; color: #94a3b8; font-style: italic;">Henüz bu modda çalışılmış kelime bulunmamaktadır.</td></tr>';
    }
    return studiedWords.map((w, idx) => {
      let statusHtml = '';
      if (mode === 'swipe') {
        statusHtml = w.status 
          ? `<span class="badge-bildigim" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.72rem;">Bildiğim</span>`
          : `<span class="badge-bilmedigim" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.72rem;">Bilmediğim</span>`;
      } else {
        statusHtml = w.status
          ? `<span class="badge-bildigim" style="background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.72rem;">Doğru</span>`
          : `<span class="badge-bilmedigim" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.72rem;">Yanlış</span>`;
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
      return '<tr><td colspan="3" style="padding: 16px; text-align: center; color: #94a3b8; font-style: italic;">Tüm kelimeler çalışılmıştır! 🎉</td></tr>';
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
        <title>YOKDIL_${categoryText.replace(/\s+/g, '_')}_Kelime_Kampi_Karne</title>
        <meta charset="utf-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <style>
          body { font-family: 'Inter', system-ui, -apple-system, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
          h1, h2, h3 { color: #0f172a; margin-top: 0; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
          .meta-item { font-size: 0.82rem; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; margin-bottom: 30px; }
          th { background: #f1f5f9; padding: 12px 10px; text-align: left; font-size: 0.8rem; font-weight: 700; color: #475569; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; font-size: 0.85rem; color: #334155; }
          @media print {
            .print-control-bar { display: none !important; }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body>
        <!-- Progress Bar Overlay -->
        <div id="progress-overlay" style="
          display: none;
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          z-index: 99999;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="background: rgba(30, 41, 59, 0.95); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); width: 340px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
            <div style="font-weight: 800; font-size: 1.15rem; margin-bottom: 8px; color: #10b981;">🔄 PDF Raporu Hazırlanıyor</div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 20px;">Lütfen bekleyin, sayfalar hazırlanıyor.</div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 12px;">
              <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); transition: width 0.1s;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: bold; margin-bottom: 8px;">
              <span>İlerleme:</span>
              <span id="progress-text">0%</span>
            </div>
            <div id="progress-time" style="font-size: 0.72rem; color: #cbd5e1; font-style: italic;">Hesaplanıyor...</div>
          </div>
        </div>

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

        <h2>📝 YÖKDİL ${categoryText} Kelime Kampı Karnesi</h2>

        <!-- Comprehensive Report summary -->
        <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; font-family: sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h3 style="margin-top: 0; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">📊 Genel Akademik Gelişim Rapor Özeti</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; font-size: 0.85rem; color: #334155;">
            <div>🗓️ <strong>Rapor Tarihi & Saati:</strong> ${reportDateTime}</div>
            <div>🏫 <strong>Alan / Kategori:</strong> YÖKDİL ${categoryText} (${modeText})</div>
            <div>📚 <strong>Toplam Kelime Havuzu:</strong> ${totalWordsCount} Kelime</div>
            <div>🔄 <strong>Toplam Çalışılan:</strong> ${studiedWordsCount} Kelime (%${((studiedWordsCount/totalWordsCount)*100).toFixed(0)} Çalışıldı)</div>
            <div>⚪ <strong>Henüz Çalışılmayan:</strong> ${unstudiedWordsCount} Kelime</div>
            <div>🟢 <strong>Bilinen / Doğru Kelimeler:</strong> ${knownWords.length} Kelime</div>
            <div>🔴 <strong>Bilinmeyen / Yanlış Kelimeler:</strong> ${unknownWords.length} Kelime</div>
            <div>📈 <strong>Başarı / Bilme Oranı:</strong> <strong style="color: #10b981; font-size: 1rem;">%${knowledgePercent}</strong></div>
          </div>
        </div>

        <div id="content-to-print">
          <h3>🟢 Çalışılmış ve Değerlendirilmiş Kelimeler</h3>
          <table>
            <thead>
              <tr>
                <th>Kelime (İngilizce)</th>
                <th>Türkçe Anlamı</th>
                <th style="text-align: center;">Durum / Statü</th>
                <th style="border-left: 1px dashed #cbd5e1;">Çalışma Notu</th>
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
                <th style="width: 30%;">Kelime (İngilizce)</th>
                <th style="width: 50%;">Türkçe Anlamı</th>
                <th style="width: 20%; border-left: 1px dashed #cbd5e1;">Çalışma Notu</th>
              </tr>
            </thead>
            <tbody>
              ${renderUnstudiedRows()}
            </tbody>
          </table>
        </div>

        <script>
          async function downloadPDF() {
            const controlBar = document.querySelector('.print-control-bar');
            const progressOverlay = document.getElementById('progress-overlay');
            const progressBar = document.getElementById('progress-bar');
            const progressText = document.getElementById('progress-text');
            const progressTime = document.getElementById('progress-time');

            controlBar.style.display = 'none';
            progressOverlay.style.display = 'flex';

            const rows = Array.from(document.querySelectorAll('tbody tr'));
            const totalRows = rows.length;
            
            if (totalRows === 0) {
              alert("Yazdırılacak veri bulunamadı.");
              progressOverlay.style.display = 'none';
              controlBar.style.display = 'flex';
              return;
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pdfWidth - 2 * margin;

            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'fixed';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '750px';
            tempContainer.style.background = '#ffffff';
            tempContainer.style.padding = '20px';
            document.body.appendChild(tempContainer);

            const styleTag = document.createElement('style');
            styleTag.innerHTML = "table { width: 100%; border-collapse: collapse; margin-top: 10px; } th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 12px; font-weight: bold; color: #475569; border-bottom: 2px solid #cbd5e1; } td { padding: 9px; font-size: 11px; color: #334155; border-bottom: 1px solid #e2e8f0; } .badge-bildigim { background: rgba(16, 185, 129, 0.15); color: #10b981; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.72rem; } .badge-bilmedigim { background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 0.72rem; }";
            tempContainer.appendChild(styleTag);

            const originalHeader = document.querySelector('thead').innerHTML;
            const chunkSize = 25;
            const totalChunks = Math.ceil(totalRows / chunkSize);
            const startTime = Date.now();

            for (let i = 0; i < totalChunks; i++) {
              const existingTable = tempContainer.querySelector('table');
              if (existingTable) tempContainer.removeChild(existingTable);

              const chunkTable = document.createElement('table');
              const thead = document.createElement('thead');
              thead.innerHTML = originalHeader;
              chunkTable.appendChild(thead);

              const tbody = document.createElement('tbody');
              const startIdx = i * chunkSize;
              const endIdx = Math.min(startIdx + chunkSize, totalRows);
              
              for (let r = startIdx; r < endIdx; r++) {
                tbody.appendChild(rows[r].cloneNode(true));
              }
              chunkTable.appendChild(tbody);
              tempContainer.appendChild(chunkTable);

              const canvas = await html2canvas(tempContainer, {
                scale: 1.5,
                useCORS: true,
                logging: false
              });

              const imgData = canvas.toDataURL('image/jpeg', 0.95);
              const imgHeight = (canvas.height * contentWidth) / canvas.width;

              if (i > 0) {
                pdf.addPage();
              }
              pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, imgHeight);

              const progress = Math.round(((i + 1) / totalChunks) * 100);
              progressBar.style.width = progress + '%';
              progressText.innerText = progress + '%';

              const elapsed = Date.now() - startTime;
              const avgTimePerChunk = elapsed / (i + 1);
              const remainingChunks = totalChunks - (i + 1);
              const estRemainingMs = remainingChunks * avgTimePerChunk;
              const estRemainingSec = Math.ceil(estRemainingMs / 1000);
              progressTime.innerText = "Tahmini Kalan Süre: " + estRemainingSec + " saniye";

              await new Promise(resolve => setTimeout(resolve, 30));
            }

            document.body.removeChild(tempContainer);
            pdf.save("YOKDIL_Kelime_Kampi_Karne.pdf");

            progressOverlay.style.display = 'none';
            controlBar.style.display = 'flex';
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const handlePrintCikmisExportDocx = (studiedWords, unstudiedWords, mode, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const modeText = mode === 'swipe' ? 'Hızlı Kart Pratiği (Swipe)' : 'Detaylı Kelime Kampı';

  studiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));
  unstudiedWords.sort((a, b) => a.english.localeCompare(b.english, 'tr'));

  const knownWords = studiedWords.filter(w => w.status === true);
  const unknownWords = studiedWords.filter(w => w.status === false);
  const totalWordsCount = studiedWords.length + unstudiedWords.length;
  const studiedWordsCount = studiedWords.length;
  const unstudiedWordsCount = unstudiedWords.length;
  const knowledgePercent = studiedWordsCount > 0 ? ((knownWords.length / studiedWordsCount) * 100).toFixed(0) : 0;
  const reportDateTime = new Date().toLocaleString('tr-TR');

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
        <h2>📋 Kelime Kampı Karne Raporu</h2>
        
        <!-- Comprehensive Report Summary block for Docx -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 15px; margin-bottom: 20px;">
          <h3 style="margin-top: 0; color: #4f46e5;">📊 Genel Akademik Gelişim Rapor Özeti</h3>
          <p><strong>🗓️ Rapor Tarihi & Saati:</strong> ${reportDateTime}</p>
          <p><strong>🏫 Alan / Kategori:</strong> YÖKDİL ${categoryText} (${modeText})</p>
          <p><strong>📚 Toplam Kelime Havuzu:</strong> ${totalWordsCount} Kelime</p>
          <p><strong>🔄 Toplam Çalışılan:</strong> ${studiedWordsCount} Kelime (%${((studiedWordsCount/totalWordsCount)*100).toFixed(0)} Çalışıldı)</p>
          <p><strong>⚪ Henüz Çalışılmayan:</strong> ${unstudiedWordsCount} Kelime</p>
          <p><strong>🟢 Bilinen / Doğru Kelimeler:</strong> ${knownWords.length} Kelime</p>
          <p><strong>🔴 Bilinmeyen / Yanlış Kelimeler:</strong> ${unknownWords.length} Kelime</p>
          <p><strong>📈 Başarı / Bilme Oranı:</strong> <strong>%${knowledgePercent}</strong></p>
        </div>

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
  a.download = `YOKDIL_${categoryText.replace(/\s+/g, '_')}_Kelime_Kampi_Karne.doc`;
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

  const knownWords = studiedWords.filter(w => w.status === true);
  const unknownWords = studiedWords.filter(w => w.status === false);
  const totalWordsCount = studiedWords.length + unstudiedWords.length;
  const studiedWordsCount = studiedWords.length;
  const unstudiedWordsCount = unstudiedWords.length;
  const knowledgePercent = studiedWordsCount > 0 ? ((knownWords.length / studiedWordsCount) * 100).toFixed(0) : 0;
  const reportDateTime = new Date().toLocaleString('tr-TR');

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
   <Font ss:Bold="1" ss:Color="#FFFFFF" ss:Size="11"/>
   <Interior ss:Color="#4F46E5" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:Bold="1" ss:Color="#1E1B4B" ss:Size="13"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="CardTitle">
   <Font ss:Bold="1" ss:Color="#4F46E5" ss:Size="11"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="StatVal">
   <Font ss:Bold="1" ss:Color="#0F172A" ss:Size="11"/>
   <Alignment ss:Horizontal="Right"/>
  </Style>
  <Style ss:ID="StatValHighlight">
   <Font ss:Bold="1" ss:Color="#10B981" ss:Size="11"/>
   <Alignment ss:Horizontal="Right"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Genel Özet">
  <Table>
   <Column ss:Width="200"/>
   <Column ss:Width="160"/>
   <Row></Row>
   <Row ss:Height="24">
    <Cell ss:MergeAcross="1" ss:StyleID="Title"><Data ss:Type="String">YÖKDİL GENEL AKADEMİK GELİŞİM RAPORU</Data></Cell>
   </Row>
   <Row></Row>
   <Row>
    <Cell ss:StyleID="CardTitle"><Data ss:Type="String">Rapor Metriği</Data></Cell>
    <Cell ss:StyleID="CardTitle"><Data ss:Type="String">Değer / Sonuç</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">🗓️ Rapor Tarihi ve Saati:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="String">${escapeXml(reportDateTime)}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">🏫 Alan / Kategori:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="String">YÖKDİL ${escapeXml(categoryText)}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">📖 Çalışma Modu:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="String">${escapeXml(modeText)}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">📚 Toplam Kelime Havuzu:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="Number">${totalWordsCount}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">🔄 Toplam Çalışılan Kelime:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="Number">${studiedWordsCount}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">⚪ Çalışılmayan (Kalan):</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="Number">${unstudiedWordsCount}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">🟢 Bilinen / Doğru Kelimeler:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="Number">${knownWords.length}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">🔴 Bilinmeyen / Yanlış Kelimeler:</Data></Cell>
    <Cell ss:StyleID="StatVal"><Data ss:Type="Number">${unknownWords.length}</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">📈 Başarı / Bilme Yüzdesi:</Data></Cell>
    <Cell ss:StyleID="StatValHighlight"><Data ss:Type="String">%${knowledgePercent}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
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
   ${buildSheetRows(unknownWords.map(w => ({ ...w, status: w.status === undefined ? 'Çalışılmadı' : (w.status ? 'Bildiğim/Doğru' : 'Bilmediğim/Yanlış') })))}
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
   ${buildSheetRows(knownWords.map(w => ({ ...w, status: mode === 'swipe' ? 'Bildiğim' : 'Doğru' })))}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Çalışılmayanlar">
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
   ${buildSheetRows(unstudiedWords.map(w => ({ ...w, status: 'Çalışılmadı' })))}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YOKDIL_${categoryText.replace(/\s+/g, '_')}_Kelime_Kampi_Karne.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handlePrintGrammarExportPDF = (studiedDays, unstudiedDays, selectedCategory) => {
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (!printWindow) {
    alert("Popup engelleyiciyi devre dışı bırakın!");
    return;
  }
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const reportDateTime = new Date().toLocaleString('tr-TR');

  const renderRows = (list) => {
    if (list.length === 0) {
      return '<tr><td colspan="4" style="padding: 12px; text-align: center; color: #94a3b8; font-style: italic;">Gün bulunmamaktadır.</td></tr>';
    }
    return list.map((item, idx) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 10px; font-weight: bold; color: #1e293b;">${item.day}. Gün</td>
        <td style="padding: 10px; color: #0f172a; font-weight: 500;">${item.title}</td>
        <td style="padding: 10px; color: #64748b; font-size: 0.85rem;">${item.questionsCount} Soru</td>
        <td style="padding: 10px;">
          ${item.score !== null ? `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 8px; border-radius: 6px; font-weight: bold;">%${item.score} Başarı</span>` : `<span style="color: #94a3b8;">Tamamlanmadı</span>`}
        </td>
      </tr>
    `).join('');
  };

  printWindow.document.write(`
    <html>
      <head>
        <title>Gramer Kampı Değerlendirme Raporu</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #1e293b; }
          h1 { font-size: 1.6rem; color: #1e1b4b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 6px; }
          .subtitle { color: #64748b; font-size: 0.88rem; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 30px; }
          th { background: #f8fafc; color: #475569; font-weight: 600; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; font-size: 0.85rem; }
          td { font-size: 0.86rem; padding: 10px; }
        </style>
      </head>
      <body onload="window.print()">
        <h1>📖 Gramer Kampı Değerlendirme Raporu (${categoryText})</h1>
        <div class="subtitle">Rapor Tarihi: ${reportDateTime} | Toplam Çalışılan: ${studiedDays.length} / 30 Gün</div>
        
        <h3 style="color: #10b981; border-bottom: 2px solid #a7f3d0; padding-bottom: 4px;">🟢 Tamamlanan Günler</h3>
        <table>
          <thead>
            <tr>
              <th>Gün</th>
              <th>Konu Başlığı</th>
              <th>Soru Sayısı</th>
              <th>Başarı Durumu</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(studiedDays)}
          </tbody>
        </table>

        <h3 style="color: #94a3b8; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px;">⚪ Kalan Günler</h3>
        <table>
          <thead>
            <tr>
              <th>Gün</th>
              <th>Konu Başlığı</th>
              <th>Soru Sayısı</th>
              <th>Başarı Durumu</th>
            </tr>
          </thead>
          <tbody>
            ${renderRows(unstudiedDays)}
          </tbody>
        </table>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const handlePrintGrammarExportDocx = (studiedDays, unstudiedDays, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const reportDateTime = new Date().toLocaleString('tr-TR');

  const renderRows = (list) => {
    return list.map(item => `
      <tr style="border-bottom: 1px solid #cccccc;">
        <td style="padding: 8px;"><b>${item.day}. Gün</b></td>
        <td style="padding: 8px;">${item.title}</td>
        <td style="padding: 8px;">${item.questionsCount} Soru</td>
        <td style="padding: 8px;">${item.score !== null ? `%${item.score} Başarı` : 'Tamamlanmadı'}</td>
      </tr>
    `).join('');
  };

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>Gramer Kampı Değerlendirme Raporu</title></head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>📖 Gramer Kampı Değerlendirme Raporu (${categoryText})</h2>
      <p style="color: #555555; font-size: 12px;">Rapor Tarihi: ${reportDateTime} | İlerleme: ${studiedDays.length} / 30 Gün</p>
      
      <h3 style="color: #10b981;">🟢 Tamamlanan Günler</h3>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="background-color: #f2f2f2;">
          <th>Gün</th>
          <th>Konu Başlığı</th>
          <th>Soru Sayısı</th>
          <th>Başarı Derecesi</th>
        </tr>
        ${renderRows(studiedDays)}
      </table>

      <h3 style="color: #888888; margin-top: 20px;">⚪ Kalan Günler</h3>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="background-color: #f2f2f2;">
          <th>Gün</th>
          <th>Konu Başlığı</th>
          <th>Soru Sayısı</th>
          <th>Başarı Derecesi</th>
        </tr>
        ${renderRows(unstudiedDays)}
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YOKDIL_Gramer_Kampi_Karne.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handlePrintGrammarExportXlsx = (studiedDays, unstudiedDays, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  
  const buildSheetRows = (list) => {
    return list.map(item => `
    <Row>
     <Cell><Data ss:Type="Number">${item.day}</Data></Cell>
     <Cell><Data ss:Type="String">${item.title}</Data></Cell>
     <Cell><Data ss:Type="Number">${item.questionsCount}</Data></Cell>
     <Cell><Data ss:Type="String">${item.score !== null ? `%${item.score}` : 'Tamamlanmadı'}</Data></Cell>
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
   <Interior ss:Color="#1E1B4B" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Tamamlanan Günler">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Gün No</Data></Cell>
    <Cell><Data ss:Type="String">Konu Başlığı</Data></Cell>
    <Cell><Data ss:Type="String">Soru Sayısı</Data></Cell>
    <Cell><Data ss:Type="String">Başarı Oranı</Data></Cell>
   </Row>
   ${buildSheetRows(studiedDays)}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Kalan Günler">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Gün No</Data></Cell>
    <Cell><Data ss:Type="String">Konu Başlığı</Data></Cell>
    <Cell><Data ss:Type="String">Soru Sayısı</Data></Cell>
    <Cell><Data ss:Type="String">Başarı Oranı</Data></Cell>
   </Row>
   ${buildSheetRows(unstudiedDays)}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YOKDIL_Gramer_Kampi_Karne.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
