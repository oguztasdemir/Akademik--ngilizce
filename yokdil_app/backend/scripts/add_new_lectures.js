const fs = require('fs');
const path = require('path');

const lecturesDir = path.join(__dirname, '..', '..', 'questions', 'genel', 'lectures');
const exercisesPath = path.join(__dirname, '..', '..', 'questions', 'genel', 'lecture_exercises.json');

const newLectures = {
  "09_Modals_Semi_Modals": {
    filename: "09_Modals_Semi_Modals.md",
    content: `# Kip Belirteçleri (Modals & Semi-Modals)

YÖKDİL sınavında modals konusu, özellikle **geçmişe yönelik tahminler, olasılıklar ve pişmanlıklar** üzerinden sorgulanır.

## 1. Olasılık ve Geçmiş Çıkarım Yapıları (Past Modals)
* **Must have V3:** Geçmişe yönelik güçlü çıkarım/tahmin ("yapmış olmalı").
  * *Example:* The test tube was empty; someone must have used the sample.
* **Should have V3 / Ought to have V3:** Geçmişte yapılması gereken ama yapılmayan işler ("yapmalıydı ama yapmadı").
  * *Example:* The government should have implemented stricter environmental policies.
* **Could have V3 / Might have V3:** Geçmişe yönelik zayıf olasılık ("yapmış olabilirdi").
  * *Example:* Without the safety shield, the explosion could have injured the chemist.

## 2. Gereklilik ve Yetenek
* **Must vs. Have to:** İçsel zorunluluk (must) ve dışsal zorunluluk (have to).
* **Can vs. Be able to:** Genel yetenek (can) ve belirli bir andaki başarabilme (be able to).`,
    exercises: [
      {
        sentence: "The laboratory door was locked, so the research team ---- left early.",
        options: ["must have", "should have", "can"],
        answer: "must have",
        explanation: "Geçmişe yönelik güçlü bir çıkarım söz konusudur ('Laboratuvar kapısı kilitliydi, bu yüzden ekip erken çıkmış olmalı')."
      },
      {
        sentence: "The clinical trials ---- completed last month, but the funding was delayed.",
        options: ["should have been", "must have been", "could be"],
        answer: "should have been",
        explanation: "Geçmişte yapılması gerekip de yapılmayan bir işi belirtmek için 'should have been V3' kullanılır."
      }
    ]
  },
  "10_Conditionals_Wish_Clauses": {
    filename: "10_Conditionals_Wish_Clauses.md",
    content: `# Koşul Cümleleri & Keşkeler (Conditionals & Wish Clauses)

YÖKDİL'de koşul cümleleri hem dilbilgisi hem de cümle tamamlama sorularında sıkça karşımıza çıkar.

## 1. Temel Koşul Yapıları (Types)
* **Type 0:** Genel doğrular / Bilimsel gerçekler (\`If Present, Present\`).
  * *Example:* If you heat ice, it melts.
* **Type 1:** Gerçek olasılıklar (\`If Present, Future/Can/May\`).
* **Type 2:** Gerçek dışı durumlar (Present) (\`If Simple Past, Would/Could V1\`).
* **Type 3:** Geçmişe yönelik pişmanlıklar (\`If Had V3, Would have V3\`).

## 2. Diğer Koşul Yapıları
* **Unless:** -medikçe, -mezse (\`If... not\` anlamına gelir).
* **Providing that / Provided that:** Şartıyla (koşuluyla).
* **In case:** Durumunda (önlem amaçlı 'olursa diye' kullanımı).`,
    exercises: [
      {
        sentence: "We will not achieve the desired results ---- we increase the budget.",
        options: ["if", "unless", "in case"],
        answer: "unless",
        explanation: "Olumsuz koşul bildirmek için '-medikçe/mezse' anlamına gelen 'unless' kullanılır."
      },
      {
        sentence: "The emergency alarm will sound ---- a fire breaks out in the building.",
        options: ["unless", "in case", "if"],
        answer: "if",
        explanation: "Olası bir durumun sonucunu şart koşmak için 'if' (eğer) bağlacı uygundur."
      }
    ]
  },
  "11_Noun_Clauses_Subjunctives": {
    filename: "11_Noun_Clauses_Subjunctives.md",
    content: `# İsim Cümlecikleri & Dilek Kipi (Noun Clauses & Subjunctives)

İsim cümlecikleri, bir cümlede özne, nesne veya edat tamamlayıcısı konumunda bulunurlar.

## 1. Noun Clause Yapıları
* **That Clause:** Bir gerçeği veya iddiayı bildirir.
  * *Example:* Everyone knows that smoking causes cancer.
* **Whether / If:** -ıp ıpmadığı (olasılık / şüphe bildiren yapılardan sonra).
  * *Example:* The scientists are investigating whether the vaccine is safe.

## 2. Subjunctive (Dilek Kipi)
* Önem, tavsiye veya zorunluluk bildiren sıfat ve fiillerden sonra gelen \`that\` cümleciğinde fiil daima **yalın (V1)** kullanılır.
  * *Example:* It is essential that the researcher **follow** (follows değil!) the safety protocols.`,
    exercises: [
      {
        sentence: "The study demonstrates ---- climate change accelerates species extinction.",
        options: ["that", "whether", "what"],
        answer: "that",
        explanation: "Bilimsel bir gerçeği ('iklim değişikliğinin türlerin yok oluşunu hızlandırdığını') bildirmek için 'that' clause kullanılır."
      },
      {
        sentence: "It is mandatory that every employee ---- protective equipment in the lab.",
        options: ["wear", "wears", "wore"],
        answer: "wear",
        explanation: "Zorunluluk bildiren sıfatlardan ('mandatory') sonra gelen 'that' cümleciğinde subjunctive kuralı gereği fiil yalın kullanılır."
      }
    ]
  },
  "12_Gerunds_Infinitives": {
    filename: "12_Gerunds_Infinitives.md",
    content: `# Fiilimsiler (Gerunds & Infinitives)

Hangi fiilden veya yapıdan sonra \`to V1\` veya \`V-ing\` geleceği YÖKDİL'de doğrudan test edilir.

## 1. Gerund (V-ing) Alan Yapılar
* Edatlardan (prepositions) sonra gelen fiiller daima \`V-ing\` olur (in, on, at, about, after, before, of).
* Belli fiillerden sonra: *avoid, dynamic, prevent, suggest, postpone, involve*.
  * *Example:* We should avoid polluting the seas.

## 2. Infinitive (to V1) Alan Yapılar
* Sıfatlardan sonra daima \`to V1\` gelir (*easy to understand, difficult to do*).
* Belli fiillerden sonra: *decide, want, refuse, fail, attempt, manage*.
  * *Example:* The researcher failed to publish the article on time.`,
    exercises: [
      {
        sentence: "The laboratory team decided ---- the experiment until next month.",
        options: ["to postpone", "postponing", "postpone"],
        answer: "to postpone",
        explanation: "'decide' fiili kendisinden sonra mastar ('to infinitive') alır."
      },
      {
        sentence: "The new filter is highly effective at ---- carbon dioxide emissions.",
        options: ["to reduce", "reducing", "reduce"],
        answer: "reducing",
        explanation: "'at' edatından (preposition) sonra gelen fiil daima 'V-ing' (gerund) takısı alır."
      }
    ]
  },
  "13_Adjectives_Adverbs_Comparisons": {
    filename: "13_Adjectives_Adverbs_Comparisons.md",
    content: `# Sıfatlar, Zarflar & Karşılaştırmalar (Adjectives, Adverbs & Comparisons)

Akademik karşılaştırmalar ve nitelemeler YÖKDİL'in vazgeçilmez dilbilgisi sorularındandır.

## 1. Karşılaştırma Yapıları (Comparatives)
* **as... as:** ...kadar (eşitlik).
* **more... than:** ...-den daha (üstünlük).
* **The more..., the more...:** Ne kadar..., o kadar... (Çift karşılaştırma).
  * *Example:* The more carbon we release, the warmer the climate becomes.

## 2. Sıfat vs. Zarf
* Sıfatlar isimleri nitelemek için kullanılır (*a significant decrease*).
* Zarflar fiilleri veya sıfatları nitelemek için kullanılır (*decreased significantly*).`,
    exercises: [
      {
        sentence: "The new drug was proved to be ---- effective than the traditional treatment.",
        options: ["as", "more", "the most"],
        answer: "more",
        explanation: "Cümlede 'than' ipucu bulunduğundan karşılaştırma yapısı 'more ... than' kullanılmalıdır."
      },
      {
        sentence: "The temperature of the reaction decreased ---- after adding the catalyst.",
        options: ["significant", "significantly", "significance"],
        answer: "significantly",
        explanation: "Fiili ('decreased') nitelemek için zarf ('significantly') kullanılması gerekir."
      }
    ]
  }
};

// 1. Create MD files
for (const [id, data] of Object.entries(newLectures)) {
  const filePath = path.join(lecturesDir, data.filename);
  fs.writeFileSync(filePath, data.content, 'utf8');
  console.log(`Created: ${data.filename}`);
}

// 2. Append Exercises
let exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
for (const [id, data] of Object.entries(newLectures)) {
  exercises[id] = data.exercises;
}
fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2), 'utf8');
console.log("Updated: lecture_exercises.json with new exercises!");
