# 🎓 YÖKDİL & YDS Akademik İngilizce Hazırlık Platformu

Bu proje; **YÖKDİL** (Fen Bilimleri, Sosyal Bilimler, Sağlık Bilimleri) ve **YDS** sınavlarına hazırlanan öğrenciler için geliştirilmiş, kapsamlı bir akademik İngilizce öğrenim ve hazırlık platformudur. Uygulama, masaüstü (Web) ve mobil cihazlar için optimize edilmiş iki farklı kullanıcı arayüzü (GUI), yerel veri tabanları, akıllı çalışma algoritmaları ve yapay zeka destekli çalışma koçu bileşenleriyle donatılmıştır.

---

## 🌟 Temel Özellikler

### 1. 📅 Katmanlı Akademik Kamplar
* **Kelime Kampı (`cikmis_kelimeler`):** Sınavlarda en sık çıkan kelimelerin telaffuzları, Türkçe karşılıkları ve interaktif kelime kartları.
* **Gelişmiş Kelime Kampı (`vocabulary`):** HSL renk kodlamalı ilerleme takibi ve zenginleştirilmiş içerikler.
* **Özel Kelime Kampı:** Kullanıcıların Excel veya metin formatından kendi kelime listelerini yükleyerek çalışabildiği dinamik yapı.
* **Gramer Kampı (`grammar`):** Dilbilgisi konuları ve her konunun ardından çözülebilen konu kavrama testleri.
* **YDS Kitap Alıştırmaları:** Günlük hedeflere bölünmüş, okuma ve kelime odaklı kitap alıştırmaları.

### 2. 📝 Sınav & Değerlendirme Modülleri
* **Sentetik YÖKDİL Deneme Sınavları:** Fen, Sosyal ve Sağlık bilimleri alanları için özel olarak hazırlanmış 80'er soruluk gerçekçi sınavlar.
* **10 Günlük Genel Değerlendirme Testleri:** Her 10 günde bir açılan, son 10 gün çalışılan kelime ve gramer konularını tarayan 15 soruluk karma sınavlar.
* **Konu Anlatımı Sınavları:** Her konu anlatımı modülünün sonunda kullanıcı seviyesini ölçen konu testleri.
* **Hata Kutusu (Mistake Inbox):** Sınav veya testlerde yanlış çözülen tüm soruların yapay zeka analizi ile birlikte saklandığı ve tekrar çözülebildiği alan.

### 3. 🔍 Çift Tıklama / Basılı Tutarak Yerel Çeviri (Offline Translation)
* Okuma parçaları veya sorularda bilinmeyen herhangi bir kelimeye **çift tıklandığında** (veya mobilde **üzerine basılı tutulduğunda**) açılan popover penceresi.
* Dış kaynaklı bir API bağımlılığı olmadan, yerel lemmatization (kök kelime bulma) ve öbek algılama motoruyla anında Türkçe karşılık gösterimi.

### 4. 🦉 Bilge Çalışma Arkadaşı (AI Chatbot & Mascot)
* Kullanıcının çalışma alanına göre tepki veren interaktif baykuş maskotu.
* Öğrencinin yanlış cevaplarına veya takıldığı gramer kurallarına anında taktikler veren, soru çözümlerini açıklayan yapay zeka entegrasyonu.

### 5. 🎮 Gelişim & Eğlence (Mini Oyunlar)
* **Kelime Eşleştirme (Synonym Match):** Eş anlamlı kelimeleri zaman karşı eşleştirme oyunu.
* **Zıt Anlam Oyunu (Antonym Match):** Zıt anlamları bularak puan toplama.
* **Kelime Yazma Oyunu (Spelling Game):** İşitsel telaffuzu verilen kelimeleri doğru yazma pratikleri.
* **Kelime Vurma (Word Shooter):** Doğru kelimeyi hedef alarak vurma oyunu.

### 6. 🐾 Evcil Hayvan & Başarımlar
* Kullanıcı kelime çalıştıkça ve test çözdükçe seviye atlayan, boyutu büyüyen evcil hayvan sistemi.
* Rozetler ve başarımlar (Achievements) ile oyunlaştırılmış motivasyon takibi.

### 7. 📄 Gelişmiş Rapor Dışa Aktarma (PDF & Docx Karne)
* Kamp çalışmalarının, çözülen kelimelerin durumuna göre (Yanlış yapılanlar 🔴, Doğru yapılanlar 🟢, Henüz çalışılmamışlar ⚪) ayrıştırılarak PDF ve Docx raporu olarak bilgisayara indirilebilmesi.

---

## 🛠️ Teknoloji Yığını (Tech Stack)

### Frontend (Arayüz Katmanı)
* **React 18 & Vite:** Hızlı derleme ve modern component mimarisi.
* **Vanilla CSS (Premium Design):** Glassmorphic kartlar, yumuşak gradyan geçişleri ve HSL tabanlı 20 farklı renk teması desteği.
* **Lucide React & FontAwesome:** Vektörel ikon kütüphaneleri.

### Backend & API (Servis Katmanı)
* **Node.js & Express:** Sınav verilerini, PDF şablonlarını ve yerel sözlük verilerini servis eden sunucu.
* **Vercel Serverless Functions:** `/api/server.js` üzerinden Vercel platformunda sunucusuz mimariyle çalışma.

---

## 📁 Proje Klasör Yapısı

```text
├── api/                   # Vercel Serverless fonksiyon yönlendirme ve API sunucusu
│   └── server.js          # API giriş noktası (Express entegrasyonlu)
├── Dataset/               # Tüm sınav, kelime listesi, gramer notları ve başarımların JSON veritabanı
│   └── yokdil/
│       ├── fen/           # Fen Bilimleri verileri (sözlük, sınavlar, akademik kelimeler)
│       ├── saglik/        # Sağlık Bilimleri verileri
│       └── sosyal/        # Sosyal Bilimler verileri
├── Mobil Gui/             # Mobil cihazlar için optimize edilmiş Vite + React PWA uygulaması
│   ├── src/
│   │   ├── components/    # Alt-üst menüler, ortak pop-up'lar, maskot bileşenleri
│   │   ├── features/      # Kamplar, oyunlar, testler, profil ve evcil hayvan özellikleri
│   │   └── App.jsx        # Mobil ana uygulama bileşeni
│   └── index.css          # Mobil tasarım ve medya sorguları (Responsive breakpoints)
├── Web Gui/               # Geniş ekranlar (Masaüstü) için optimize edilmiş web uygulaması
│   ├── src/
│   │   ├── features/      # Masaüstü uyumlu oyun, kamp ve sınav modülleri
│   │   └── App.jsx        # Web ana uygulama bileşeni
│   └── package.json
├── main.py                # Tüm projeyi tek bir komutla başlatan Python orkestratör betiği
├── vercel.json            # Vercel yönlendirmeleri ve build konfigürasyon dosyası
└── README.md              # Bu dökümantasyon dosyası
```

---

## 🚀 Başlangıç ve Çalıştırma

### 1. Kolay Başlangıç (Tavsiye Edilen)
Projenin ana dizininde terminali açıp aşağıdaki Python komutunu çalıştırarak Express sunucusunu, Web arayüzünü ve Mobil arayüzünü tek komutla eşzamanlı olarak başlatabilirsiniz:

```bash
python main.py
```
*Bu komut gerekli bağımlılıkları kontrol edecek ve uygulamaları tarayıcınızda otomatik olarak açacaktır.*

### 2. Manuel Başlangıç

Eğer bileşenleri bağımsız olarak başlatmak isterseniz sırasıyla şu adımları izleyin:

#### A. Backend Sunucusunu Başlatma
```bash
cd "Web Gui"
npm install
node backend/server.js
```
*Sunucu varsayılan olarak `http://localhost:5000` portunda çalışacaktır.*

#### B. Web Arayüzünü Başlatma
```bash
cd "Web Gui"
npm install
npm run dev
```
*Web uygulaması varsayılan olarak `http://localhost:5173` portunda çalışacaktır.*

#### C. Mobil Arayüzünü Başlatma
```bash
cd "Mobil Gui"
npm install
npm run dev
```
*Mobil uygulaması varsayılan olarak `http://localhost:5174` (veya uygun ilk portta) çalışacaktır.*

---

## ☁️ Dağıtım (Deployment)

Proje Vercel platformuna tam uyumludur. Dağıtım yapmak için kök dizinde Vercel CLI komutunu kullanabilirsiniz:

```bash
vercel --prod
```
Tüm statik varlık yönlendirmeleri, `/api/*` istekleri ve sunucusuz fonksiyonlar `vercel.json` içerisinde konfigüre edilmiştir.
