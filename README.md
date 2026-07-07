# YÖKDİL Akademik İngilizce Hazırlık Uygulaması

YÖKDİL (Fen Bilimleri, Sosyal Bilimler, Sağlık Bilimleri) ve YDS sınavlarına hazırlanmak için tasarlanmış, mobil ve web arayüzleri optimize edilmiş, premium özelliklerle donatılmış akademik İngilizce öğrenim platformudur.

---

## 🌟 Öne Çıkan Özellikler

1. **Katmanlı Akademik Çalışma:**
   - **Kelimeler:** Kelime kartları, anlam okuma ve telaffuz dinleme.
   - **Eş Anlam Eşleştirme:** Görsel geri bildirimli eş anlam oyunları.
   - **Zıt Anlam Eşleştirme:** Sürükleyici zıt anlam testleri.
   - **Çoktan Seçmeli Test:** Çözdükçe ilerleyen, anlık cevap kontrolü ve yerel çeviri destekli test modülü.
2. **10 Günlük Genel Değerlendirme Testleri:**
   - Her 10 günde bir (10, 20, 30... günlerde), son 10 günün kelime ve gramer konularını harmanlayan 15 soruluk karma değerlendirme sınavları sunulur.
3. **Çift Tıklama / Basılı Tutarak Yerel Çeviri:**
   - Soru veya okuma metinleri üzerinde basılı tutarak veya çift tıklayarak yapılan kelime seçimlerinde, harici API bağımlılığı olmadan yerel sözlük yedeklerinden lemmatization (kök kelime eşleştirme) ve öbek algılama ile anında Türkçe anlam gösterilir.
4. **Sentetik Çıkmış Sınavlar:**
   - **Sosyal Bilimler** ve **Sağlık Bilimleri** için 80'er soruluk 9 adet sentetik YÖKDİL seviyesinde deneme sınavı ve kelime setleri entegredir.
5. **Görsel Arayüz (Dark Mode & Glassmorphism):**
   - HSL renk paletleri, modern animasyonlar ve tamamen mobil uyumlu (responsive) premium tasarımlar.

---

## 📁 Proje Klasör Yapısı

```text
├── api/                   # Vercel sunucusuz fonksiyon yönlendirme yapılandırması
├── Dataset/               # Tüm fen, sosyal ve sağlık sınav ve günlük kamp JSON verileri
│   └── yokdil/
│       ├── fen/
│       ├── saglik/
│       └── sosyal/
├── Mobil Gui/             # Mobil cihazlar için optimize edilmiş Vite+React uygulaması
│   ├── src/
│   │   ├── components/    # Mini oyunlar, testler, evcil hayvan, akıllı çalışma bileşenleri
│   │   └── App.jsx
│   └── package.json
├── Web Gui/               # Geniş ekranlar için optimize edilmiş web uygulaması ve Express backend
│   ├── backend/           # Statik verileri ve PDF parser API'lerini servis eden Express sunucusu
│   ├── src/
│   │   ├── components/    
│   │   └── App.jsx
│   └── package.json
├── main.py                # Tüm projeyi tek bir komutla başlatan Python orkestratör betiği
├── README.md              # Bu dosya
└── veriseti_ve_sistem_raporu.md
```

---

## 🚀 Başlangıç

### 1. Kolay Başlangıç (Python ile)

Proje dizininde terminalinizi açın ve aşağıdaki orkestrasyon betiğini çalıştırın. Bu betik Express backend'ini, Web arayüzünü ve Mobil arayüzünü aynı anda başlatarak tarayıcınızda açacaktır:

```bash
python main.py
```

### 2. Manuel Başlangıç

Eğer sunucuları elle başlatmak isterseniz:

**Backend Sunucusu:**
```bash
cd "Web Gui"
node backend/server.js
```

**Web Arayüzü:**
```bash
cd "Web Gui"
npm install
npm run dev
```

**Mobil Arayüzü:**
```bash
cd "Mobil Gui"
npm install
npm run dev
```
