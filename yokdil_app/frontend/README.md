pğ

p

# 🦉 YÖKDİL Akademik İngilizce Hazırlık Uygulaması

YÖKDİL (Fen, Sosyal, Sağlık) sınavlarına hazırlanan adaylar için özel olarak tasarlanmış, yapay zeka destekli, oyunlaştırılmış ve interaktif bir akademik İngilizce öğrenim platformudur.

## 🚀 Öne Çıkan Özellikler

### 📖 1. İnteraktif Karşılaştırmalı Okuma Modu (Bilingual Reader)

* **Çift Yönlü Etkileşim:** Sol kolondaki İngilizce metin ile sağ kolondaki Türkçe çeviri metni tamamen interaktiftir.
* **Akıllı Cümle Eşleme (Sentence-Level Isolation):** Seçilen kelime veya kalıbın hangi cümlede olduğu dinamik olarak algılanır ve sadece o cümledeki karşılığı renklendirilir. Diğer cümlelerdeki mükerrer kelimeler boyanmaz.
* **Renk Kodlu Dil Uyumu:**
  * İngilizce kelime/kalıp seçildiğinde **İndigo (Mavi)** tonlarında iki taraflı vurgulama yapılır.
  * Türkçe kelime/kalıp seçildiğinde **Zümrüt Yeşili** tonlarında iki taraflı vurgulama yapılır.
* **Kök & Suffix Eşleştirme (Fuzzy Match):** Kelime çekim ekleri alsa dahi akıllı algoritma ile doğru eşleşme sağlanır.
* **Çeviri Sidebar Kartı:** Sağ alt köşeye sabitlenmiş, metinlerin üstünü kapatmayan responsive bilgi paneli.

### 🎓 2. Sistematik Akıllı Çalışma (Kelime Kampı)

* **Özelleştirilebilir Kelime Miktarı:** Tek seferde 5 (Hızlı), 10 (Standart), 15 (Detaylı) veya 20 (Kamp) kelimeyle çalışma seçeneği.
* **3 Aşamalı Öğrenim Döngüsü:**
  1. **Öğren (Learn):** Kelime anlamı, türü ve akademik YÖKDİL örnek cümle analizi.
  2. **Yaz (Spell):** Klavyeden İngilizce yazılış kontrolü.
  3. **Boşluk Doldur (Fill in the Blanks):** Bağlamsal cümle tamamlama testi.
* **"Bilmiyorum 🤷‍♂️" Desteği:** Alıştırmalarda takılmayı önleyen ve doğru yanıtı anında gösteren asistan butonu.

### 📚 3. %100 Müfredat Uyumlu Konu Anlatımı

YÖKDİL sınavında çıkan tüm dilbilgisi konularını kapsayan 13 modül ve konu sonu pratik testleri:

1. Zaman ve Yer Edatları (Prepositions of Time & Place)
2. Edat Kombinasyonları (Prepositions & Collocations)
3. Zamanlar 1 - Şimdiki ve Geçmiş (Tenses: Present & Past)
4. Zamanlar 2 - Perfect ve Gelecek Zamanlar (Tenses: Perfect & Future)
5. Etken ve Edilgen Çatı (Active & Passive Voice)
6. Zıtlık Bağlaçları (Conjunctions of Contrast)
7. Sebep-Sonuç Bağlaçları (Conjunctions of Cause & Effect)
8. Sıfat Cümlecikleri & Kısaltmalar (Relative Clauses & Reductions)
9. Kip Belirteçleri (Modals & Semi-Modals)
10. Koşul Cümleleri & Keşkeler (Conditionals & Wish Clauses)
11. İsim Cümlecikleri & Dilek Kipi (Noun Clauses & Subjunctives)
12. Fiilimsiler (Gerunds & Infinitives)
13. Sıfatlar, Zarflar & Karşılaştırmalar (Adjectives, Adverbs & Comparisons)

### 🦉 4. Oyunlaştırma (Gamification) & Evcil Hayvan

* **Evcil Hayvan Gelişimi:** Soru çözdükçe, okuma yaptıkça ve kelime kamplarını bitirdikçe kazanılan XP'ler ile baykuşunuzu seviye atlatın.
* **Uygulama İçi Bildirim Modalı:** Tarayıcıyı kilitleyen senkron popuplar yerine, oyun içi şık asenkron modal pencereleri.
* **Kozmetik Mağazası:** Günlük hedeflerden kazandığınız kristallerle baykuşunuza yeni kıyafetler satın alın.

### 🕹️ 5. Mini Oyunlar & Hata Kutusu

* **Oyunlar:** Eş Anlamlı Kelimeler, Zıt Anlamlı Kelimeler ve Kelime Türleri (Noun/Verb/Adj/Adv) oyunları.
* **Hata Kutusu (Mistake Inbox):** Denemelerde yanlış yaptığınız soruları otomatik olarak biriktirir ve bunları tekrar çözerek eksiklerinizi kapatmanızı sağlar.

---

## 🛠️ Kurulum ve Çalıştırma

### Gereksinimler

* Node.js (v18+)
* npm

### Çalıştırma Adımları

1. **Backend'i Başlatın:**

   ```bash
   cd yokdil_app/backend
   npm install
   npm start
   ```

   *Varsayılan olarak `http://localhost:5000` portunda çalışacaktır.*
2. **Frontend'i Başlatın:**

   ```bash
   cd yokdil_app/frontend
   npm install
   npm run dev
   ```

   *Varsayılan olarak `http://localhost:5173` portunda çalışacaktır.*

## 🌐 Canlı Sürüm

Uygulama Vercel üzerinde sürekli güncellenmektedir: [https://yokdilapp.vercel.app](https://yokdilapp.vercel.app)
