import * as XLSX from 'xlsx';

export const downloadExcelTemplate = () => {
  // Columns: Gün, Kelime, Kelime Türü, Türkçe Anlamı, Eş Anlamlılar, Zıt Anlamlılar, Örnek Cümle, Örnek Cümle Çevirisi
  const headers = [
    ["Gün", "Kelime", "Kelime Türü", "Türkçe Anlamı", "Eş Anlamlılar", "Zıt Anlamlılar", "Örnek Cümle", "Örnek Cümle Çevirisi"]
  ];
  
  const sampleRows = [
    [1, "abandon", "verb", "terk etmek, vazgeçmek", "give up, leave, desert", "keep, retain, maintain", "She abandoned her painting career to travel.", "Gezmek için resim kariyerini bıraktı."],
    [1, "evaluate", "verb", "değerlendirmek, ölçmek", "assess, analyze, appraise", "ignore, neglect", "The scientists need to evaluate the research results.", "Bilim insanlarının araştırma sonuçlarını değerlendirmesi gerekiyor."],
    [2, "vulnerable", "adjective", "hassas, savunmasız, kırılgan", "susceptible, fragile, exposed", "resilient, strong, protected", "Young children are vulnerable to infections.", "Küçük çocuklar enfeksiyonlara karşı hassastır."]
  ];

  const data = [...headers, ...sampleRows];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths for nice appearance
  ws['!cols'] = [
    { wch: 6 },  // Gün
    { wch: 15 }, // Kelime
    { wch: 15 }, // Kelime Türü
    { wch: 25 }, // Türkçe Anlamı
    { wch: 25 }, // Eş Anlamlılar
    { wch: 25 }, // Zıt Anlamlılar
    { wch: 45 }, // Örnek Cümle
    { wch: 45 }  // Örnek Cümle Çevirisi
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Kelime Kampı Şablonu");

  // Write file and trigger download
  XLSX.writeFile(wb, "yokdil_kelime_kampi_sablon.xlsx");
};
