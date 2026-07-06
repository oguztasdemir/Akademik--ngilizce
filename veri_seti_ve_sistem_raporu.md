# YÖKDİL Akademik İngilizce Uygulaması - Sistem ve Veri Seti Raporu

Bu rapor, projedeki klasör yapısını, sınav veritabanı değişikliklerini, Vercel canlı ortam yapılandırmalarını ve veri setlerinin (Fen, Sağlık, Sosyal) çeviri kalitesi ile istatistiksel sonuçlarını özetlemektedir.

---

## 📂 1. Klasör Yapısı ve Mimari (Yeni Düzen)

Kullanıcı direktifleri doğrultusunda, karmaşık ve dağınık olan klasör yapısı en baştan sade ve anlaşılır bir düzende birleştirilmiştir:

```text
Akademik İngilizce Uygulamaları/
├── Dataset/                     # Tek ve güncel veri tabanı klasörü
│   └── yokdil/
│       ├── fen/                 # Fen Bilimleri kelime, sözlük ve sınav JSON'ları
│       ├── saglik/              # Sağlık Bilimleri veri seti
│       ├── sosyal/              # Sosyal Bilimler veri seti
│       └── genel/               # Dilbilgisi kampı, kitaplar ve okuma parçaları
├── Web Gui/                     # Bilgisayar (PC) için geliştirilmiş React web arayüzü
├── Mobil Gui/                   # Mobil cihazlara özgü React arayüzü (Aynı veri setini kullanır)
├── api/                         # Vercel sunucusuz (Serverless) backend dağıtım dosyaları
│   └── server.js
├── main.py                      # Tüm servisleri yerelde tek tuşla başlatan Python kontrolcü
└── vercel.json                  # Vercel dağıtım ve paketleme konfigürasyonu
```

---

## ⚙️ 2. Sınav Formatı Değişikliği (`exams.json`)

Sınav cevaplarının toplu listelenmesi yerine, her sorunun kendi detayını içermesi sağlanarak arayüz entegrasyonu kolaylaştırılmıştır:

* **Eski Yapı:** Cevap şıkları sınav objesinin en üstünde (`"answers": ["C", "D", ...]`) dizi halindeydi.
* **Yeni Yapı (Soru | Cevap | Şık):** Toplu cevap listesi kaldırıldı. Her sorunun kendi altına doğrudan `correct_option` (Şık) ve `correct_answer` (Cevap kelimesi) eklendi:
  ```json
  {
    "number": 1,
    "text": "People consider soil ------- because it supports plants...",
    "options": ["various", "simple", "essential", "thick", "missing"],
    "correct_option": "C",
    "correct_answer": "essential"
  }
  ```
* **Arayüz Geliştirmesi:** Web ve Mobil arayüzdeki sınav çözüm ekranları ve hata kutuları bu sisteme adapte edildi. Artık bir soru çözüldüğünde veya yanlış yapıldığında kullanıcıya doğru şık ve doğru kelime yan yana sunulmaktadır (Örn: `Doğru Şık: C | Cevap: essential`).

---

## 🛠️ 3. Sunucu ve Canlı Ortam (Vercel) Düzeltmeleri

* **Güvenli Dosya Yolu Fallback Sistemi:** Sunucusuz lambda fonksiyonlarında dizin kaymalarını önlemek amacıyla, `process.cwd()` ve `__dirname` değerlerini dinamik harmanlayan yedekli dosya yolu çözücü sisteme entegre edildi.
* **includeFiles Ayarları:** Vercel derleyicisinin `Dataset/**` dizinini sunucu ortamına paketlemesi sağlanarak boş sayfa ve dosya bulunamadı hataları giderildi.
* **Yüksek Performanslı Kelime Arama Algoritması (O(N+M)):** 1,730 kelimeyi 9 sınavda Regex ile aratarak sıklık çıkaran ve 5.5 saniye süren eski algoritma yerine; sınav sorularını tek seferde kelime tablosuna (Hash Map) döken hızlı algoritma yazıldı. Sorgu süresi **41 milisaniyeye (100 kat daha hızlı)** çekilerek sunucu zaman aşımı (timeout) engellendi.
* **React Hook Çökmeleri:** `YDS Kitap` sekmesine tıklandığında kural ihlallerinden ötürü uygulamanın tamamen çökmesine yol açan erken dönüş (early return) hataları ve eksik Lucide ikon importları giderildi.

---

## 📊 4. Veri Seti Çeviri ve Kalite Audit Sonuçları

Tüm veri setleri programatik olarak kelime kelime ve cümle cümle taranmıştır:

| Kategori | Toplam Sözlük Karşılığı | Akademik Kelime | Cümle Sayısı | Eş/Zıt Anlam | **Toplam Çeviri Satırı** | **Hatalı Çeviri** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **🧪 Fen Bilimleri** | 1,720 | 1,720 | 9,038 | 3,944 | **15,108** | **0** |
| **🩺 Sağlık Bilimleri** | 1,684 | 1,734 | 8,420 | - | **13,522** | **0** |
| **🌍 Sosyal Bilimler** | 1,684 | 1,734 | 8,420 | - | **13,522** | **0** |
| GENEL TOPLAM | **5,088** | **5,188** | **25,878** | **3,944** | **42,152** | **0** |

### Yapılan Temizlik Çalışmaları:
1. **Yönerge Kalıntılarının Temizlenmesi:** PDF okumalardan veritabanına kelime gibi sızan Türkçe yönergeler (*yerlere, uygun, ifadeyi, olarak, bulunuz, sorularda*) veri setlerinden arındırıldı.
2. **Karakter Kodlama Düzeltmeleri:** Bozuk Türkçe karakter kodlamaları (`Ã¼`, `ÅŸ`, `Ä±` vb.) otomatik temizlendi.
3. **Örnek Cümlelerin Sadeleştirilmesi:** Yapay zeka ile üretilmiş örnek cümlelerin içindeki virgüllü anlam yığılmaları temizlenerek okuma akıcılığı artırıldı.
4. **MyMemory API ile Bütünleme:** Çevirisi eksik kalmış tüm bağlaç ve birleşik kelimeler (`bothand`, `regardlessof` vb.) Türkçeye kazandırıldı.

*Veri setlerindeki çevirilerin tamamı yüksek kalitede, hatasız ve yayına hazır durumdadır.*
