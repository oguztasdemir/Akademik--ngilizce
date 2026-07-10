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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
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
            .print-control-bar { display: none !important; }
          }
        </style>
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
            pdf.save("YOKDIL_Yds_Kitap_Karne.pdf");

            progressOverlay.style.display = 'none';
            controlBar.style.display = 'flex';
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const handlePrintBookExportPDF = (studiedDays, unstudiedDays, selectedCategory) => {
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
        <td style="padding: 10px; font-weight: bold; color: #1e293b;">Gün #${item.day}</td>
        <td style="padding: 10px; color: #0f172a; font-weight: 500;">${item.title}</td>
        <td style="padding: 10px; color: #64748b; font-size: 0.85rem;">${item.wordsCount} Kelime</td>
        <td style="padding: 10px;">
          ${item.isCompleted ? `<span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 8px; border-radius: 6px; font-weight: bold;">Tamamlandı</span>` : `<span style="color: #94a3b8;">Başlanmadı</span>`}
        </td>
      </tr>
    `).join('');
  };

  printWindow.document.write(`
    <html>
      <head>
        <title>YDS Kitap Çalışma Raporu</title>
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
        <h1>📊 YDS Kitap Çalışma Raporu (${categoryText})</h1>
        <div class="subtitle">Rapor Tarihi: ${reportDateTime} | Toplam Çalışılan: ${studiedDays.length} / 62 Gün</div>
        
        <h3 style="color: #10b981; border-bottom: 2px solid #a7f3d0; padding-bottom: 4px;">🟢 Tamamlanan Günler</h3>
        <table>
          <thead>
            <tr>
              <th>Gün No</th>
              <th>Çalışma Başlığı</th>
              <th>Kelime Sayısı</th>
              <th>Durum</th>
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
              <th>Gün No</th>
              <th>Çalışma Başlığı</th>
              <th>Kelime Sayısı</th>
              <th>Durum</th>
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

export const handlePrintBookExportDocx = (studiedDays, unstudiedDays, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  const reportDateTime = new Date().toLocaleString('tr-TR');

  const renderRows = (list) => {
    return list.map(item => `
      <tr style="border-bottom: 1px solid #cccccc;">
        <td style="padding: 8px;"><b>Gün #${item.day}</b></td>
        <td style="padding: 8px;">${item.title}</td>
        <td style="padding: 8px;">${item.wordsCount} Kelime</td>
        <td style="padding: 8px;">${item.isCompleted ? 'Tamamlandı' : 'Başlanmadı'}</td>
      </tr>
    `).join('');
  };

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><title>YDS Kitap Değerlendirme Raporu</title></head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>📊 YDS Kitap Çalışma Raporu (${categoryText})</h2>
      <p style="color: #555555; font-size: 12px;">Rapor Tarihi: ${reportDateTime} | İlerleme: ${studiedDays.length} / 62 Gün</p>
      
      <h3 style="color: #10b981;">🟢 Tamamlanan Günler</h3>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="background-color: #f2f2f2;">
          <th>Gün No</th>
          <th>Çalışma Başlığı</th>
          <th>Kelime Sayısı</th>
          <th>Durum</th>
        </tr>
        ${renderRows(studiedDays)}
      </table>

      <h3 style="color: #888888; margin-top: 20px;">⚪ Kalan Günler</h3>
      <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="background-color: #f2f2f2;">
          <th>Gün No</th>
          <th>Çalışma Başlığı</th>
          <th>Kelime Sayısı</th>
          <th>Durum</th>
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
  a.download = `YOKDIL_Yds_Kitap_Karne.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const handlePrintBookExportXlsx = (studiedDays, unstudiedDays, selectedCategory) => {
  const categoryText = selectedCategory === 'fen' ? 'Fen Bilimleri' : (selectedCategory === 'sosyal' ? 'Sosyal Bilimler' : 'Sağlık Bilimleri');
  
  const buildSheetRows = (list) => {
    return list.map(item => `
    <Row>
     <Cell><Data ss:Type="Number">${item.day}</Data></Cell>
     <Cell><Data ss:Type="String">${item.title}</Data></Cell>
     <Cell><Data ss:Type="Number">${item.wordsCount}</Data></Cell>
     <Cell><Data ss:Type="String">${item.isCompleted ? 'Tamamlandı' : 'Başlanmadı'}</Data></Cell>
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
    <Cell><Data ss:Type="String">Çalışma Başlığı</Data></Cell>
    <Cell><Data ss:Type="String">Kelime Sayısı</Data></Cell>
    <Cell><Data ss:Type="String">Durum</Data></Cell>
   </Row>
   ${buildSheetRows(studiedDays)}
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Kalan Günler">
  <Table>
   <Row ss:StyleID="Header">
    <Cell><Data ss:Type="String">Gün No</Data></Cell>
    <Cell><Data ss:Type="String">Çalışma Başlığı</Data></Cell>
    <Cell><Data ss:Type="String">Kelime Sayısı</Data></Cell>
    <Cell><Data ss:Type="String">Durum</Data></Cell>
   </Row>
   ${buildSheetRows(unstudiedDays)}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `YOKDIL_Yds_Kitap_Karne.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};