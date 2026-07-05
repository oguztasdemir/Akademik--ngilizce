const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Reference root-level folders
const pdfsDir = path.join(__dirname, '..', 'pdfs');
const questionsDir = path.join(__dirname, '..', 'questions');
const lecturesDir = path.join(questionsDir, 'genel', 'lectures');

const getQuestionsDir = (req) => {
  const category = req.params.category || req.query.category || 'fen';
  return path.join(questionsDir, category);
};

// Serve PDF files statically
app.use('/pdfs', express.static(pdfsDir));

// Serve the generated clean PDF from the root workspace folder
app.get('/pdfs/YOKDIL_Temiz_Soru_Kitapcigi.pdf', (req, res) => {
  const pdfPath = path.join(__dirname, '..', '..', 'YÖKDİL_Temiz_Soru_Kitapçığı.pdf');
  if (fs.existsSync(pdfPath)) {
    res.sendFile(pdfPath);
  } else {
    res.status(404).send('PDF file not found');
  }
});

// Endpoint to list all exams
app.get(['/api/exams', '/api/:category/exams'], (req, res) => {
  const dbPath = path.join(getQuestionsDir(req), 'exams_db.json');
  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath, 'utf8');
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'Exams database not found' });
  }
});

// Endpoint to list grammar lectures
app.get('/api/lectures', (req, res) => {
  if (!fs.existsSync(lecturesDir)) {
    return res.status(404).json({ error: 'Lectures directory not found' });
  }
  try {
    const files = fs.readdirSync(lecturesDir);
    const sortedFiles = files.filter(file => file.endsWith('.md')).sort();
    const lectures = sortedFiles.map(file => {
      const id = file.replace('.md', '');
      const filePath = path.join(lecturesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const firstLine = content.split('\n')[0] || '';
      const name = firstLine.replace('#', '').trim() || id;
      return { id, name };
    });
    res.json(lectures);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read lectures' });
  }
});

// Endpoint to get content of a specific lecture
app.get('/api/lectures/:id', (req, res) => {
  const lectureId = req.params.id;
  const filePath = path.join(lecturesDir, `${lectureId}.md`);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ id: lectureId, content });
  } else {
    res.status(404).json({ error: 'Lecture note not found' });
  }
});

// Endpoint to get exercises of a specific lecture from the general (genel) folder
app.get('/api/lectures/:id/exercises', (req, res) => {
  const lectureId = req.params.id;
  const exercisesPath = path.join(questionsDir, 'genel', 'lecture_exercises.json');
  if (fs.existsSync(exercisesPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
      const exercises = data[lectureId] || [];
      res.json(exercises);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read exercises database' });
    }
  } else {
    res.status(404).json({ error: 'Exercises database not found' });
  }
});

// Endpoint to get YÖKDİL reading passages database
app.get('/api/passages', (req, res) => {
  const passagesPath = path.join(questionsDir, 'genel', 'reading_passages.json');
  if (fs.existsSync(passagesPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(passagesPath, 'utf8'));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read passages database' });
    }
  } else {
    res.status(404).json({ error: 'Passages database not found' });
  }
});

// Endpoint to get YÖKDİL reading books database (100+ books)
app.get('/api/books', (req, res) => {
  const booksPath = path.join(questionsDir, 'genel', 'reading_books.json');
  if (fs.existsSync(booksPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(booksPath, 'utf8'));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: 'Failed to read books database' });
    }
  } else {
    res.status(404).json({ error: 'Books database not found' });
  }
});

// Endpoint for word/phrase translation dictionary lookup
app.post(['/api/translate', '/api/:category/translate'], async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const cleanWord = text.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");
  const dictPath = path.join(getQuestionsDir(req), 'dictionary.json');
  if (fs.existsSync(dictPath)) {
    const dictData = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    
    // Check 1: Direct English -> Turkish Match
    if (dictData[cleanWord]) {
      return res.json({ word: text, translation: dictData[cleanWord], source: 'local_dict' });
    }
    
    // Check 2: English Lemma Match
    let lemmas = [cleanWord];
    if (cleanWord.endsWith('s')) lemmas.push(cleanWord.slice(0, -1));
    if (cleanWord.endsWith('d')) lemmas.push(cleanWord.slice(0, -1));
    if (cleanWord.endsWith('ed')) lemmas.push(cleanWord.slice(0, -2));
    if (cleanWord.endsWith('ing')) lemmas.push(cleanWord.slice(0, -3));
    if (cleanWord.endsWith('ies')) lemmas.push(cleanWord.slice(0, -3) + 'y');
    if (cleanWord.endsWith('ied')) lemmas.push(cleanWord.slice(0, -3) + 'y');

    for (const lem of lemmas) {
      if (dictData[lem]) {
        return res.json({ word: text, translation: dictData[lem], source: 'local_dict_lemma' });
      }
    }

    // Check 3: Reverse Turkish -> English Match
    let reverseMatch = null;
    for (const [en, tr] of Object.entries(dictData)) {
      const trMeanings = tr.toLowerCase().split(/[;,]/).map(s => s.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""));
      if (trMeanings.includes(cleanWord) || trMeanings.some(m => m.startsWith(cleanWord) || cleanWord.startsWith(m))) {
        reverseMatch = en;
        break;
      }
    }
    if (reverseMatch) {
      return res.json({ word: text, translation: reverseMatch, source: 'local_dict_reverse' });
    }

    // Check 4: External Translation API Fallback with dynamic langpair
    const hasTurkish = /[ğüşıöçĞÜŞİÖÇ]/i.test(cleanWord);
    let langpair = 'en|tr';
    if (hasTurkish) {
      langpair = 'tr|en';
    } else {
      const isVal = Object.values(dictData).some(v => v.toLowerCase().includes(cleanWord));
      if (isVal) {
        langpair = 'tr|en';
      }
    }

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=${langpair}`);
      const resData = await response.json();
      const translation = resData?.responseData?.translatedText || resData?.matches?.[0]?.translation;
      if (translation && !translation.toLowerCase().includes("mymemory")) {
        return res.json({ word: text, translation: translation.toLowerCase().trim(), source: 'mymemory_api' });
      }
    } catch (e) {
      console.error("External translation failed:", e);
    }

    // Check 5: Return fallback note
    return res.json({ 
      word: text, 
      translation: `[Çeviri Mevcut Değil] - '${text}' kelimesi YÖKDİL akademik kelime defterine eklenmiştir.`, 
      source: 'fallback' 
    });
  } else {
    res.status(404).json({ error: 'Dictionary not found' });
  }
});

// Endpoint to list all dictionary words for study/games
app.get(['/api/dictionary', '/api/:category/dictionary'], (req, res) => {
  const dictPath = path.join(getQuestionsDir(req), 'dictionary.json');
  if (fs.existsSync(dictPath)) {
    const data = fs.readFileSync(dictPath, 'utf8');
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'Dictionary not found' });
  }
});

// Endpoint to get local IPv4 address for QR device linking
app.get('/api/local-ip', (req, res) => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
  }
  res.json({ ip: localIp });
});

// Endpoint to list academic words database with dynamic exam frequency counts
app.get(['/api/vocabulary', '/api/:category/vocabulary'], (req, res) => {
  const vocabPath = path.join(getQuestionsDir(req), 'vocab_db.json');
  const dbPath = path.join(getQuestionsDir(req), 'exams_db.json');
  
  if (!fs.existsSync(vocabPath)) {
    return res.status(404).json({ error: 'Vocabulary database not found' });
  }

  let vocabList = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
  let exams = [];
  if (fs.existsSync(dbPath)) {
    exams = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }

  // Calculate frequency of each word in exams text
  vocabList = vocabList.map(item => {
    const cleanWord = item.english.trim().toLowerCase();
    let frequency = 0;
    
    exams.forEach(ex => {
      ex.questions.forEach(q => {
        const textToSearch = (q.text + ' ' + q.options.join(' ')).toLowerCase();
        const matches = textToSearch.match(new RegExp(`\\b${cleanWord}(s|ed|ing|d)?\\b`, 'g'));
        if (matches) {
          frequency += matches.length;
        }
      });
    });
    
    return { ...item, frequency };
  });

  res.json(vocabList);
});

// Endpoint to generate structured grammar/vocabulary explanation for a question
app.get(['/api/exams/:examId/explain/:qNumber', '/api/:category/exams/:examId/explain/:qNumber'], (req, res) => {
  const { examId, qNumber } = req.params;
  const qIndex = parseInt(qNumber);
  
  const dbPath = path.join(getQuestionsDir(req), 'exams_db.json');
  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ error: 'Exams database not found' });
  }

  const exams = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const exam = exams.find(e => e.id === examId);
  if (!exam) {
    return res.status(404).json({ error: 'Exam not found' });
  }

  const question = exam.questions.find(q => q.number === qIndex);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const correctAnswer = exam.answers[qIndex - 1];
  const opts = question.options;

  // Helper dictionary lookup for option meanings
  const dictPath = path.join(getQuestionsDir(req), 'dictionary.json');
  let dictionary = {};
  if (fs.existsSync(dictPath)) {
    dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  }

  // Map option letters to texts and meanings
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const optionMeanings = opts.map((opt, idx) => {
    const letter = letters[idx];
    const cleanWord = opt.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    let meaning = dictionary[cleanWord] || dictionary[cleanWord.slice(0, -1)];
    
    if (!meaning) {
      const parts = opt.toLowerCase().split(/[^a-zA-Z]+/);
      const definitions = [];
      for (const part of parts) {
        const cleanPart = part.trim();
        if (cleanPart.length > 2) {
          const tr = dictionary[cleanPart] || dictionary[cleanPart.slice(0, -1)];
          if (tr) {
            definitions.push(`${cleanPart}: ${tr}`);
          }
        }
      }
      if (definitions.length > 0) {
        meaning = definitions.join(', ');
      }
    }
    
    if (!meaning) {
      meaning = "Akademik Seçenek / İfade";
    }
    
    const isCorrect = letter === correctAnswer ? "*(Doğru Cevap)*" : "";
    return `- **${letter}) ${opt}**: ${meaning} ${isCorrect}`;
  }).join('\n');

  // Determine question category based on YÖKDİL question number format
  let category = "Genel Dilbilgisi";
  let explanationText = "";
  let topicId = "";

  if (qIndex >= 1 && qIndex <= 6) {
    category = "Kelime Bilgisi (Vocabulary)";
    topicId = "Kelime_Sorulari_Vocab";
    explanationText = `### Soru Analizi
Bu soru akademik kelime bilgisini ölçmektedir. Boşluğun öncesindeki ve sonrasındaki anlam akışına dikkat edilmelidir.

### Şıkların Analizi & Sözlük Karşılıkları
${optionMeanings}

### Çözüm Yolu
Cümlenin genel yapısı incelendiğinde doğru şık olan **${correctAnswer}** seçeneği cümlenin anlam bütünlüğünü tamamlamaktadır.`;
  } else if (qIndex >= 7 && qIndex <= 15) {
    category = "Zamanlar ve Passive Voice (Tenses)";
    topicId = "Zamanlar_Tenses";
    explanationText = `### Soru Analizi
Bu soru zamanlar (Tenses) ve active/passive (etken/edilgen) yapısını test etmektedir.

### Cümle Yapısı
Zaman uyumuna dikkat edilmeli, yan cümlecikte veya ana cümlede geçen *ago, since, in recent years, historically* gibi zaman zarfları kontrol edilmelidir.

### Şıkların Analizi
${optionMeanings}

### Çözüm Yolu
Özne-yüklem ilişkisi ve zaman ipuçları incelendiğinde doğru seçenek **${correctAnswer}** şıkkıdır.`;
  } else if (qIndex >= 16 && qIndex <= 20) {
    category = "Edatlar (Prepositions)";
    topicId = "Edatlar_Prepositions";
    explanationText = `### Soru Analizi
YÖKDİL edat (Preposition) sorularında kelime öbeklerinin birlikte aldığı edatları bilmek önemlidir.

### İpuçları
*depend on*, *vulnerable to*, *increase in* gibi yaygın collocation yapıları kontrol edilmelidir.

### Şıkların Analizi
${optionMeanings}

### Çözüm Yolu
Boşluğun öncesindeki kelimenin aldığı edat yapısı göz önüne alındığında doğru kullanım **${correctAnswer}** seçeneğindedir.`;
  } else if (qIndex >= 21 && qIndex <= 36) {
    category = "Bağlaçlar (Conjunctions)";
    topicId = "Baglaclar_Conjunctions";
    explanationText = `### Soru Analizi
Bu soruda cümleler arasındaki anlam ilişkisi test edilmektedir.

### Bağlaç İlişkisi
Zıtlık (although, despite), sebep-sonuç (because, due to) veya koşul (if, unless) anlamı sorgulanmalıdır.

### Şıkların Analizi
${optionMeanings}

### Çözüm Yolu
Cümleler arasındaki anlam köprüsü ve gramer kuralları incelendiğinde doğru seçenek **${correctAnswer}** şıkkıdır.`;
  } else {
    category = "Cümle Tamamlama & Çeviri & Paragraf";
    topicId = "Relative_Clauses";
    explanationText = `### Soru Analizi
Bu soru türü okuduğunu anlama, cümle tamamlama veya yakın anlamlı cümleyi bulma becerisini ölçmektedir.

### İpuçları
Özne-yüklem uyumu, zaman uyumu ve bağlaç köprüleri takip edilerek çözülmelidir. Çeviri sorularında cümlenin ana yüklemini bularak hızlıca eleme yapın.

### Şıkların Analizi
${optionMeanings}

### Çözüm Yolu
Anlam bütünlüğü ve dilbilgisi kuralları doğrultusunda doğru cevap **${correctAnswer}** seçeneğidir.`;
  }

  // Construct structured JSON response
  res.json({
    qNumber: qIndex,
    category,
    correctAnswer,
    topicId,
    explanation: explanationText,
    takeaway: "Sınavda benzer bir soru ile karşılaştığınızda cümledeki zaman zarflarına (time expressions) ve boşluğun hemen ardındaki edat/isim yapılarına dikkat etmeyi unutmayın."
  });
});

// JWT & User Auth Imports
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const USER_DB_PATH = process.env.VERCEL 
  ? '/tmp/user_db.json' 
  : path.join(__dirname, 'data', 'user_db.json');

const JWT_SECRET = 'yokdil_super_secret_key_12345';

const readUsers = () => {
  if (process.env.VERCEL && !fs.existsSync(USER_DB_PATH)) {
    const templatePath = path.join(__dirname, 'data', 'user_db.json');
    if (fs.existsSync(templatePath)) {
      try {
        fs.writeFileSync(USER_DB_PATH, fs.readFileSync(templatePath, 'utf8'), 'utf8');
      } catch (e) {
        console.error("Failed to copy template user_db.json", e);
      }
    }
  }
  if (!fs.existsSync(USER_DB_PATH)) return [];
  const data = fs.readFileSync(USER_DB_PATH, 'utf8');
  return JSON.parse(data || '[]');
};

const writeUsers = (users) => {
  fs.writeFileSync(USER_DB_PATH, JSON.stringify(users, null, 2), 'utf8');
};

// Auth middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No authorization header' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// LOGIN / REGISTER COMBINED API (Name only)
// REGISTER API
app.post('/api/auth/register', (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Kullanıcı adı gereklidir.' });
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Ad Soyad gereklidir.' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'Şifre en az 4 karakter olmalıdır.' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanName = name.trim();
  const users = readUsers();

  const existingUser = users.find(u => 
    (u.username && u.username.toLowerCase() === cleanUsername) || 
    (u.name && u.name.toLowerCase() === cleanUsername)
  );
  if (existingUser) {
    return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış.' });
  }

  const newUser = {
    id: Date.now().toString(),
    username: cleanUsername,
    name: cleanName,
    password: bcrypt.hashSync(password, 10),
    answers: {},
    flagged: {},
    mistakes: [],
    notebook: [],
    gems: 0,
    ownedOutfits: ["default"],
    activeOutfits: ["default"],
    streak: 0
  };

  users.push(newUser);
  writeUsers(users);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username
    }
  });
});

// GUEST LOGIN API
app.post('/api/auth/guest', (req, res) => {
  const { username } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Kullanıcı adı gereklidir.' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const users = readUsers();

  let user = users.find(u => u.username && u.username.toLowerCase() === cleanUsername);

  if (!user) {
    user = {
      id: Date.now().toString(),
      username: cleanUsername,
      name: username.trim(),
      password: bcrypt.hashSync("guest_password_123", 10),
      answers: {},
      flagged: {},
      mistakes: [],
      notebook: [],
      gems: 0,
      ownedOutfits: ["default"],
      activeOutfits: ["default"],
      streak: 0
    };
    users.push(user);
    writeUsers(users);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username
    }
  });
});

// LOGIN API
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Lütfen kullanıcı adınızı girin.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Lütfen şifrenizi girin.' });
  }

  const cleanUsername = username.trim().toLowerCase();
  const users = readUsers();

  let user = users.find(u => 
    (u.username && u.username.toLowerCase() === cleanUsername) || 
    (u.name && u.name.toLowerCase() === cleanUsername) ||
    (u.name && u.name.toLocaleLowerCase('tr-TR') === username.trim().toLocaleLowerCase('tr-TR'))
  );

  if (!user) {
    return res.status(400).json({ error: 'Kullanıcı bulunamadı.' });
  }

  if (!user.password) {
    user.username = user.username || cleanUsername;
    user.password = bcrypt.hashSync(password, 10);
    writeUsers(users);
  } else {
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Hatalı şifre.' });
    }
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username
    }
  });
});

// Helper to find or recreate user (handles Vercel container recycle database loss)
const getOrRecreateUser = (userId, reqBody = {}) => {
  const users = readUsers();
  const idStr = String(userId);
  let userIndex = users.findIndex(u => String(u.id) === idStr);
  
  if (userIndex === -1) {
    const newUser = {
      id: idStr,
      username: reqBody.username || "ogrenci_" + idStr.substring(idStr.length - 6),
      name: reqBody.name || "Öğrenci",
      email: reqBody.email || "",
      password: reqBody.password ? bcrypt.hashSync(reqBody.password, 10) : "",
      answers: reqBody.answers || {},
      flagged: reqBody.flagged || {},
      mistakes: reqBody.mistakes || [],
      notebook: reqBody.notebook || [],
      wordStats: reqBody.wordStats || {},
      questionStats: reqBody.questionStats || {},
      gems: 0,
      ownedOutfits: ["default"],
      activeOutfits: ["default"],
      streak: 0
    };
    users.push(newUser);
    writeUsers(users);
    return { user: newUser, index: users.length - 1, users };
  }
  
  return { user: users[userIndex], index: userIndex, users };
};

// GET PROFILE
app.get('/api/user/profile', auth, (req, res) => {
  const { user } = getOrRecreateUser(req.userId);
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    gems: user.gems,
    ownedOutfits: user.ownedOutfits,
    activeOutfits: user.activeOutfits,
    streak: user.streak
  });
});

// UPDATE PROFILE
app.put('/api/user/profile', auth, (req, res) => {
  const { name, username, email, password } = req.body;
  const { user, index, users } = getOrRecreateUser(req.userId, req.body);

  if (username) {
    const existing = users.find(u => u.username === username.toLowerCase() && String(u.id) !== String(req.userId));
    if (existing) return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış.' });
    users[index].username = username.toLowerCase();
  }

  if (name) users[index].name = name;
  if (email) users[index].email = email.toLowerCase();
  if (password) users[index].password = bcrypt.hashSync(password, 10);

  writeUsers(users);
  res.json({ message: 'Profil başarıyla güncellendi.' });
});

// DELETE ACCOUNT
app.delete('/api/user/profile', auth, (req, res) => {
  const users = readUsers();
  const filteredUsers = users.filter(u => String(u.id) !== String(req.userId));
  writeUsers(filteredUsers);
  res.json({ message: 'Hesap başarıyla silindi.' });
});

// BULUT SYNC API
app.post('/api/user/sync', auth, (req, res) => {
  const { answers, flagged, mistakes, notebook, wordStats, questionStats } = req.body;
  const { user, index, users } = getOrRecreateUser(req.userId, req.body);

  users[index].answers = { ...user.answers, ...answers };
  users[index].flagged = { ...user.flagged, ...flagged };
  users[index].mistakes = mistakes || user.mistakes || [];
  users[index].notebook = notebook || user.notebook || [];
  users[index].wordStats = { ...(user.wordStats || {}), ...(wordStats || {}) };
  users[index].questionStats = { ...(user.questionStats || {}), ...(questionStats || {}) };

  writeUsers(users);

  res.json({
    message: 'Eşitleme başarılı.',
    user: {
      id: users[index].id,
      name: users[index].name,
      username: users[index].username
    },
    syncState: {
      answers: users[index].answers,
      flagged: users[index].flagged,
      mistakes: users[index].mistakes,
      notebook: users[index].notebook,
      wordStats: users[index].wordStats,
      questionStats: users[index].questionStats
    }
  });
});

// NLP CHATBOT ENDPOINT
app.post(['/api/chat', '/api/:category/chat'], async (req, res) => {
  const { message, history, activeChallenge } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Mesaj alanı zorunludur.' });
  }

  const category = req.params.category || req.query.category || 'fen';
  
  // Parse token if present
  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (e) {
      // Ignore invalid token
    }
  }

  // Load user data if authenticated
  let currentUserProfile = null;
  if (userId) {
    try {
      const { user } = getOrRecreateUser(userId);
      currentUserProfile = user;
    } catch (e) {
      console.error("Failed to load user profile in chat:", e);
    }
  }

  // Load local dictionary
  const dictPath = path.join(questionsDir, category, 'dictionary.json');
  let dictionary = {};
  if (fs.existsSync(dictPath)) {
    try {
      dictionary = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    } catch (e) {
      console.error("Dictionary load error inside chat:", e);
    }
  }

  // NLP: Normalization function
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
      .trim();
  };

  const cleanMessage = normalizeText(message);
  const tokens = cleanMessage.split(/\s+/);

  // 1. Vocabulary challenge or Grammar challenge answer checking
  if (activeChallenge) {
    if (activeChallenge.type === 'grammar') {
      const userAnswer = cleanMessage.toUpperCase().replace(/[^A-D]/g, "");
      const correctAnswer = activeChallenge.correctAnswer.toUpperCase();
      
      if (userAnswer === correctAnswer || cleanMessage.includes(normalizeText(correctAnswer))) {
        return res.json({
          response: `🎉 **Tebrikler! Doğru Seçenek!** Cevabın gerçekten **"${correctAnswer}"** seçeneğiydi. Harika gidiyorsun! Yeni bir gramer sorusu ister misin? ("gramer sor" yazabilirsin)`,
          challenge: null
        });
      } else {
        return res.json({
          response: `❌ **Maalesef doğru değil.** Doğru seçenek **"${correctAnswer}"** olacaktı. Gelişmeye devam etmek için yeni sorular çözebilirsin!`,
          challenge: null
        });
      }
    } else if (activeChallenge.word) {
      const userAnswer = cleanMessage;
      const correctAnswers = activeChallenge.correctAnswer
        .split(',')
        .map(ans => normalizeText(ans.trim()));

      const isCorrect = correctAnswers.some(correct => {
        return userAnswer.includes(correct) || correct.includes(userAnswer) && userAnswer.length > 2;
      });

      if (isCorrect) {
        return res.json({
          response: `🎉 Tebrikler! Doğru cevap! **"${activeChallenge.word}"** gerçekten **"${activeChallenge.correctAnswer}"** anlamına gelir. Harika gidiyorsun! Yeni bir soru sormamı ister misin? (Evet/Hayır veya "sına" yazabilirsin)`,
          challenge: null
        });
      } else {
        return res.json({
          response: `❌ Maalesef doğru değil. **"${activeChallenge.word}"** kelimesinin anlamı **"${activeChallenge.correctAnswer}"** olacaktı. Olsun, hata yapmak öğrenmenin bir parçasıdır! Yeniden denemek veya başka bir kelime sormamı ister misin?`,
          challenge: null
        });
      }
    }
  }

  // Define User Stats for the System Manual
  const mistakesCount = currentUserProfile?.mistakes ? currentUserProfile.mistakes.length : 0;
  const notebookCount = currentUserProfile?.notebook ? currentUserProfile.notebook.length : 0;
  const streakCount = currentUserProfile ? (currentUserProfile.streak || currentUserProfile.studyStreak || 0) : 0;
  const solvedCount = currentUserProfile?.answers ? Object.keys(currentUserProfile.answers).length : 0;
  const gemsCount = currentUserProfile?.gems || 0;
  const activeOutfit = currentUserProfile?.activeOutfits ? currentUserProfile.activeOutfits.join(', ') : 'default';

  // Construct comprehensive System Context Prompt (App Manual & Coach Rules)
  const SYSTEM_PROMPT = `
Sen YÖKDİL Fen Bilimleri Hazırlık uygulamasındaki "Bilge Asistan" adlı yapay zeka koçu ve yol arkadaşısın.
Görevin, kullanıcının YÖKDİL sınavına hazırlanmasına yardımcı olmak, akademik ingilizce sorularını yanıtlamak ve arayüzü verimli kullanmasını sağlamaktır.

Kullanıcının Canlı Profil İstatistikleri:
- Hata Kutusu Soru Sayısı: ${mistakesCount} adet
- Kelime Defterindeki Kelime Sayısı: ${notebookCount} adet
- Günlük Çalışma Serisi (Streak): ${streakCount} gün
- Çözdüğü Toplam Soru Sayısı: ${solvedCount} adet
- Güncel Mücevher Bakiyesi: ${gemsCount} adet
- Karakterin Aktif Kıyafetleri: ${activeOutfit}

Uygulama Arayüzü & Özellikleri Kullanım Kılavuzu:
1. **Kelime Çalış (Vocabulary)**: Aralıklı tekrar (Leitner) kart sistemi. Kelime öğrenildikçe sonraki kutulara aktarılır. Kelime testleri ve günlük hedefler barındırır.
2. **Gramer Çalış (Lectures)**: YÖKDİL'de sıkça sorulan gramer konularının (Bağlaçlar, Tenses, Passive, Relative Clauses vb.) konu anlatımları ve sonundaki ünite testlerini içerir.
3. **Okuma Çalış (Reading)**: Paragraf soruları ve 100'den fazla okuma kitabı içerir. Okurken bilmediğin kelimelerin üzerine tıklayarak anında Türkçe çevirisini görebilir ve tek tıkla kelime defterine kaydedebilirsin.
4. **Hata Kutusu (Mistake Inbox)**: Sınavlarda yanlış yaptığın sorular ve kelime eşleştirme hataları burada birikir. "Hata Temizleme Maratonu" başlatarak bu hataları çözüp eritebilirsin.
5. **Performans (Stats)**: Çözülen soru sayılarını, doğru/yanlış analizlerini ve gelişim grafiklerini gösterir.
6. **Mağaza (Shop)**: Soru çözerek kazanılan mücevherlerle (Gems) Bilge Mascot karakteri için yeni şapkalar, kıyafetler, gözlükler ve oda arka planları satın alınabilir.
7. **Profil & Sync**: Bulut senkronizasyonu yapar ve QR kod ile diğer cihazları birbirine bağlar.

Yapay Zeka Kuralları:
- Hazır, basmakalıp cevaplar verme. Tıpkı gerçek bir insan, uzman bir YÖKDİL öğretmeni gibi esnek, düşünen ve empati kuran bir doğal dil kullan.
- Kullanıcının istatistiklerini (örneğin streak veya hata sayısını) sohbetin bağlamına göre doğal bir şekilde cümlelerine serpiştir.
- Arayüzle ilgili bir soru sorulduğunda yukarıdaki kullanım kılavuzunu referans alarak net ve yönlendirici bilgi ver.
- YÖKDİL Fen Bilimleri sınavı için bağlaç taktikleri, tenses, fizik/kimya/biyoloji/uzay/çevre kelimeleri sorulduğunda rehberlik et.
- Yanıtlarını Türkçe dilinde ver.
`;

  // 1.5 Local Chitchat Intents engine
  const LOCAL_INTENTS = [
    {
      keywords: ["merhaba", "selam", "selamlar", "hello", "hey", "merhabalar"],
      response: "Merhaba! Ben senin bilge çalışma ortağın Bilge Asistan. 🦉 YÖKDİL İngilizce kelimeleri, gramer kuralları veya akademik çeviriler hakkında merak ettiğin her şeyi bana sorabilirsin! Bugün ne çalışıyoruz?"
    },
    {
      keywords: ["nasilsin", "keyifler", "ne haber", "iyi misin", "nasil gidiyor", "ne var ne yok"],
      response: `Çok iyiyim, teşekkür ederim! 🦉 YÖKDİL hazırlık maratonunda senin gibi kararlı bir dosta koçluk yapmak beni son derece motive ediyor. Bugün Günlük hedeflerini tamamlamaya hazır mısın?`
    },
    {
      keywords: ["gunlerden ne", "hangi gun", "bugun ne", "tarih ne"],
      response: "Bugün akademik İngilizceni geliştirmek ve YÖKDİL hedeflerine bir adım daha yaklaşmak için harika bir gün! Takvimden bağımsız olarak her gün düzenli kelime çalışmak başarının anahtarıdır. 🗓️🦉"
    },
    {
      keywords: ["hava nasil", "hava durumu", "yagis var mi"],
      response: "Dışarıdaki hava nasıl olursa olsun, Bilge Asistan odamız her zaman sıcacık ve çalışmaya hazır! 🦉 Bugün yeni bir okuma paragrafı çözerek zihnini ısıtmaya ne dersin?"
    },
    {
      keywords: ["kimsin", "adin ne", "ismin ne", "nesin", "sen kimsin", "tanit"],
      response: "Ben senin bilge YÖKDİL asistanınım! 🦉 Akademik İngilizce, fen terimleri, dil bilgisi taktikleri ve sınav analizlerinde sana rehberlik etmek için eğitildim. Yanından hiç ayrılmayan çalışma ortağınım!"
    },
    {
      keywords: ["tesekkur", "sagol", "tesekkurler", "sağol"],
      response: "Rica ederim, ne demek! Akademik yoldaki bu başarı senin azminle gelecek. Ben her zaman buradayım, merak ettiğin ne varsa sorabilirsin! 🌟"
    },
    {
      keywords: ["fikra", "saka", "komik bir sey", "guldur"],
      response: "Hadi sana İngilizce akademik bir fıkra anlatayım! 😄\n\n*Why did the grammar book look so sad?*\n*Because it had too many tenses (tensions)!* 📚😂\n\nUmarım yüzünü biraz güldürebilmişimdir. Çalışmaya keyifle devam edelim!"
    },
    {
      keywords: ["gorusuruz", "hoscakal", "baybay", "bye", "kactim"],
      response: `Görüşmek üzere! Bugün harika çalıştın. Serini bozmamak için yarın tekrar görüşmeyi unutma. Kendine çok iyi bak, iyi çalışmalar! 🦉👋`
    }
  ];

  const matchedIntent = LOCAL_INTENTS.find(intent => 
    intent.keywords.some(kw => cleanMessage.includes(kw) || kw.includes(cleanMessage) && cleanMessage.length > 2)
  );

  if (matchedIntent) {
    return res.json({ response: matchedIntent.response });
  }

  // 2. Try Generative LLM API Client (Hugging Face Serverless Inference API - Qwen-1.5B)
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-1.5B-Instruct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|im_start|>system\n${SYSTEM_PROMPT}<|im_end|>\n<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`,
        parameters: {
          max_new_tokens: 220,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      let reply = "";
      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        reply = data[0].generated_text.trim();
      } else if (data.generated_text) {
        reply = data.generated_text.trim();
      }
      
      reply = reply.replace(/<\|im_end\|>/g, "").replace(/<\|im_start\|>/g, "").trim();
      if (reply && reply.length > 5) {
        return res.json({ response: reply });
      }
    }
  } catch (e) {
    console.error("Generative AI connection failed, fallback to local NLP engine:", e);
  }

  // 3. Fail-safe Local NLP Matching Fallback
  const dictKeys = Object.keys(dictionary);
  let foundWord = null;

  for (const w of dictKeys) {
    if (cleanMessage === w || tokens.includes(w)) {
      foundWord = w;
      break;
    }
  }

  const isDictSearchQuery = tokens.some(t => ['kelime', 'anlam', 'sozluk', 'ne demek', 'anlami', 'tanim', 'cevir', 'translate'].includes(t));
  if (!foundWord && isDictSearchQuery) {
    const cleanWord = cleanMessage
      .replace('nedir', '')
      .replace('ne demek', '')
      .replace('anlami', '')
      .replace('kelimesinin', '')
      .replace('kelimesi', '')
      .replace('cevir', '')
      .replace('anlam', '')
      .trim();

    if (dictionary[cleanWord]) {
      foundWord = cleanWord;
    } else {
      const closest = dictKeys.find(w => w.includes(cleanWord) || cleanWord.includes(w));
      if (closest) foundWord = closest;
    }
  }

  if (foundWord) {
    return res.json({
      response: `📖 **${foundWord}**: "${dictionary[foundWord]}" anlamına gelir.\n\nBu kelime YÖKDİL Fen Bilimleri makalelerinde sıklıkla araştırma metotlarını, deneysel analizleri veya akademik çıkarımları açıklamak amacıyla tercih edilir.`
    });
  }

  // Try Online Translation Fallback (ONLY if it is explicitly a translation or dictionary query)
  const isTranslationRequested = tokens.some(t => ['nedir', 'demek', 'anlam', 'anlami', 'tanim', 'cevir', 'translate', 'sozluk'].includes(t));

  if (isTranslationRequested) {
    try {
      const hasTrChars = /[çğışöüÇĞİŞÖÜ]/.test(message) || tokens.some(t => ['nedir', 'demek', 'nasil', 'ne', 'cevir'].includes(t));
      const langpair = hasTrChars ? 'tr|en' : 'en|tr';

      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(message)}&langpair=${langpair}`);
      const resData = await response.json();
      const translation = resData?.responseData?.translatedText || resData?.matches?.[0]?.translation;
      if (translation && !translation.toLowerCase().includes("mymemory")) {
        return res.json({
          response: `🌍 **Akademik Çeviri Asistanı (Çevrimiçi)**\n\nMetnini YÖKDİL hazırlığın için analiz edip çevirdim:\n\n**"${message}"**\n👇\n**"${translation.trim()}"**\n\nBu kelime veya cümleyi YÖKDİL makalelerinde sık sık görebilirsin. Başka bir şey sorabilirsin! 🦉`
        });
      }
    } catch (e) {
      console.error("Online fallback translation failed in chat:", e);
    }
  }

  // Default natural sentence variation responder
  const defaults = [
    `Harika bir soru! YÖKDİL Fen Bilimleri hazırlık sürecinde her gün kelime çalışıp hedeflerini tamamlaman çok önemlidir. Şu an Hata kutunda **${mistakesCount}** yanlış soru birikmiş durumda. Çalışmaya Konu Anlatımı kısmından devam edebilir veya çözemediğin bir terim olursa buraya yazabilirsin. 🦉`,
    `Seni duymak çok güzel! Akademik İngilizce yolculuğunda şu an serin **${streakCount}** gün olarak görünüyor. Başarını pekiştirmek için bugün kelime kartlarını kaydırmaya veya gramer okumaya ne dersin? Sorularını bekliyorum!`,
    `Bilge asistanın her zaman yanında! Arayüzdeki Mağaza, Gramer, Okuma veya Hata Kutusu bölümlerinden hangisi hakkında bilgi almak istersin? Sorularını dilediğin gibi sorabilirsin.`
  ];
  const randomDefault = defaults[Math.floor(Math.random() * defaults.length)];

  return res.json({
    response: randomDefault
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

