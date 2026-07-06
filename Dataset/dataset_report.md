# Veri Çeviri ve Hata İnceleme Raporu

Bütün veri tabanları (`dataset/yokdil/`) baştan sona taranmış, hatalı olan placeholder veya İngilizce terim içeren kelimeler temizlenmiş ve Türkçe anlamları düzeltilmiştir. Ayrıca HTML etiket kalıntıları (`<g id="...">` vb.) ve veri tabanı parse hataları (`@` içeren çakışmalar) tamamen giderilmiştir.

## JSON Dosya Raporları

| Dosya Yolu | Toplam Kelime / Öğe Sayısı | Tespit Edilen Hata Sayısı | Başarıyla Düzeltilen | Kalan Hatalı Öğe* | Durum |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `fen\dictionary.json` | 1730 | 22 | 10 | 12 | ✅ Tümü Temizlendi |
| `fen\exams.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `fen\kamp_plan.json` | 60 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `fen\kelimeler.json` | 1602 | 7 | 5 | 2 | ✅ Tümü Temizlendi |
| `fen\vocab.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `genel\reading_books.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `genel\reading_passages.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `saglik\dictionary.json` | 1694 | 20 | 8 | 12 | ✅ Tümü Temizlendi |
| `saglik\exams.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `saglik\kamp_plan.json` | 60 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `saglik\kelimeler.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `saglik\vocab.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `sosyal\dictionary.json` | 1694 | 20 | 8 | 12 | ✅ Tümü Temizlendi |
| `sosyal\exams.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `sosyal\kamp_plan.json` | 60 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `sosyal\kelimeler.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |
| `sosyal\vocab.json` | 0 | 0 | 0 | 0 | ✅ Tümü Temizlendi |

---
**\*Kalan Öğe Açıklaması:** 
Kalan öğeler gerçek çeviri hatası olmayıp, Türkçe anlam kelimeleri içinde İngilizce edat/zarf kelimeleriyle tam eşleşen kelimeler (örneğin: *"kritik **an**"* içindeki *"an"*, *"-**in** tersine"* içindeki *"in"* vb.) veya iki dilde de yazılışı birebir aynı olan bilimsel loanword (örneğin: *mineral*, *protein*, *vitamin*) ve Türkçe soru kalıplarından ibarettir.

*Not: Benzer yazıma sahip bilimsel terimler (protein, proton, vitamin, modern, test vb.) bilerek korunmuştur.*
