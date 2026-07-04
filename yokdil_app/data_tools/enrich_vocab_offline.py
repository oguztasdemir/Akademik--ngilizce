import json
import os
import re

STOP_WORDS = {
    'the', 'and', 'of', 'to', 'in', 'is', 'that', 'it', 'on', 'for', 'with', 'as', 'was', 'were', 'by', 'an', 'be', 'at', 'from',
    'this', 'which', 'or', 'but', 'not', 'are', 'their', 'they', 'have', 'has', 'had', 'been', 'more', 'about', 'some', 'there',
    'can', 'will', 'would', 'could', 'should', 'other', 'new', 'only', 'than', 'its', 'who', 'how', 'when', 'where', 'why', 'what',
    'so', 'up', 'out', 'into', 'no', 'into', 'these', 'those', 'also', 'many', 'most', 'such', 'well', 'first', 'only', 'both',
    'either', 'neither', 'nor', 'any', 'each', 'every', 'other', 'others', 'another', 'own', 'same', 'such', 'than', 'too', 'very',
    'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'some', 'such', 'no',
    'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'question', 'options',
    'correct', 'number', 'text', 'answer', 'answers', 'questions', 'under', 'down', 'take', 'around', 'mars', 'systems', 'materials',
    'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'at', 'before', 'behind', 'below', 'beneath',
    'beside', 'between', 'beyond', 'by', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like', 'near',
    'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'through', 'throughout', 'to', 'toward', 'under', 'underneath',
    'until', 'up', 'upon', 'with', 'within', 'without'
}

# Hardcoded dictionary for YÖKDİL academic words as a fallback if not found in dictionary_*.json
FALLBACK_DICT = {
    "abandon": "terk etmek, vazgeçmek",
    "abundant": "bol, bereketli",
    "accelerate": "hızlandırmak",
    "accumulate": "biriktirmek, yığmak",
    "accurate": "doğru, kesin",
    "achieve": "başarmak, elde etmek",
    "acquire": "edinmek, kazanmak",
    "adapt": "uyum sağlamak",
    "adequate": "yeterli",
    "adhere": "bağlı kalmak, yapışmak",
    "adjust": "ayarlamak, uyum sağlamak",
    "adopt": "benimsemek, evlat edinmek",
    "adverse": "olumsuz, zıt",
    "advocate": "savunmak, desteklemek",
    "affect": "etkilemek",
    "allay": "hafifletmek, yatıştırmak",
    "allocate": "tahsis etmek, ayırmak",
    "alter": "değiştirmek",
    "ambiguity": "belirsizlik",
    "analyze": "analiz etmek",
    "assess": "değerlendirmek",
    "assume": "varsaymak, üstlenmek",
    "barrier": "engel, bariyer",
    "beneficial": "faydalı, yararlı",
    "breakthrough": "çığır açan buluş, ilerleme",
    "challenge": "meydan okumak, zorluk",
    "clarify": "açıklığa kavuşturmak",
    "collaborate": "işbirliği yapmak",
    "comprehensive": "kapsamlı",
    "crucial": "çok önemli, hayati",
    "decline": "düşüş, reddetmek",
    "demonstrate": "göstermek, kanıtlamak",
    "diverse": "çeşitli, farklı",
    "enhance": "artırmak, geliştirmek",
    "evaluate": "değerlendirmek",
    "fluctuate": "dalgalanmak",
    "guarantee": "garanti etmek",
    "hypothesis": "hipotez",
    "implement": "uygulamak, yürürlüğe koymak",
    "inevitable": "kaçınılmaz",
    "investigate": "araştırmak",
    "maintain": "sürdürmek, korumak",
    "negligible": "ihmal edilebilir",
    "obtain": "edinmek, elde etmek",
    "predict": "tahmin etmek",
    "profound": "derin, büyük",
    "reject": "reddetmek",
    "reveal": "açığa çıkarmak",
    "significant": "önemli, anlamlı",
    "sustain": "sürdürmek, devam ettirmek",
    "transfer": "aktarmak, transfer etmek",
    "undertake": "üstlenmek",
    "validate": "doğrulamak",
    "yield": "vermek, ürün vermek, sağlamak",
    "dependency": "bağımlılık",
    "fragility": "kırılganlık",
    "depletion": "tükenme, azaltma",
    "exposure": "maruz kalma",
    "implication": "çıkarım, olası sonuç",
    "conservation": "koruma, muhafaza",
    "excessive": "aşırı, fazlasıyla",
    "substantially": "büyük ölçüde, önemli derecede",
    "arising": "ortaya çıkan",
    "perplexity": "şaşkınlık, kararsızlık",
    "exhaustion": "tükenmişlik, aşırı yorgunluk",
    "attainable": "ulaşılabilir, elde edilebilir",
    "admissible": "kabul edilebilir",
    "suspiciously": "şüpheli bir şekilde",
    "competitively": "rekabetçi bir şekilde",
    "coincidentally": "tesadüfen",
    "reluctance": "isteksizlik, gönülsüzlük",
    "contradiction": "çelişki",
    "eradicate": "kökünü kazımak, yok etmek",
    "emergence": "ortaya çıkma",
    "equivalence": "eşitlik, denklik",
    "abandonment": "terk etme",
    "conflicting": "çelişen, zıt",
    "convertible": "dönüştürülebilir",
    "corruptible": "bozulabilir, rüşvet yiyebilir",
    "comprehensively": "kapsamlı bir şekilde",
    "endlessly": "sonsuz bir şekilde",
    "capture": "yakalamak, ele geçirmek",
    "aimedat": "hedeflenen",
    "dividedby": "bölünen",
    "likenedto": "benzetilen",
    "wardsoff": "savuşturur, uzaklaştırır",
    "strikesagainst": "karşı darbe vurur",
    "rootsout": "kökünü kazır",
    "holdsback": "engeller, geri tutar",
    "incontrast": "aksine, zıt olarak",
    "incaseof": "durumunda",
    "accordingto": "göre, -e göre",
    "eventhough": "e rağmen, -se bile",
    "regardlessof": "bakılmaksızın",
    "aslongas": "sürece, -dığı sürece",
    "bothand": "hem hem de",
    "coincidental": "tesadüfi",
    "habitable": "yaşanabilir",
    "severity": "şiddet, ciddiyet",
    "overcome": "üstesinden gelmek",
    "turndown": "reddetmek, kısmak"
}

def clean_word(word):
    cleaned = re.sub(r'[^a-zA-Z]', '', word).lower().strip()
    if len(cleaned) <= 3 or cleaned in STOP_WORDS:
        return ""
    return cleaned

def run_offline_enrichment():
    root = os.path.dirname(os.path.abspath(__file__))
    
    # Load all category dictionaries into a global cache
    global_dict = {}
    for cat in ['fen', 'sosyal', 'saglik']:
        dict_file = os.path.join(root, 'frontend', 'src', 'components', f'dictionary_{cat}.json')
        if os.path.exists(dict_file):
            try:
                with open(dict_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for k, v in data.items():
                        global_dict[k.lower()] = v
            except Exception as e:
                print(f"Error loading dict {cat}: {e}")

    # Merge hardcoded fallback dict
    for k, v in FALLBACK_DICT.items():
        if k not in global_dict:
            global_dict[k] = v

    print(f"Global dictionary compiled with {len(global_dict)} entries.")

    for cat in ['fen', 'sosyal', 'saglik']:
        print(f"\n--- Processing {cat.upper()} (Offline) ---")
        
        # Load exams
        exams_file = os.path.join(root, 'frontend', 'src', 'components', f'exams_db_{cat}.json')
        if not os.path.exists(exams_file):
            print(f"Exams db not found for {cat}")
            continue
            
        with open(exams_file, 'r', encoding='utf-8') as f:
            exams = json.load(f)
            
        # Load current vocabulary
        vocab_file = os.path.join(root, 'frontend', 'src', 'components', f'vocab_db_{cat}.json')
        current_vocab = []
        if os.path.exists(vocab_file):
            with open(vocab_file, 'r', encoding='utf-8') as f:
                current_vocab = json.load(f)

        vocab_map = {item['english'].lower(): item for item in current_vocab}
        word_weights = {}

        # Parse exams and extract weights
        for exam in exams:
            title = exam.get('title', exam.get('name', ''))
            is_recent = any(year in title for year in ['2024', '2025', '2026'])
            questions = exam.get('questions', [])
            answers = exam.get('answers', [])
            
            for i, q in enumerate(questions):
                q_num = q.get('number', i + 1)
                q_text = q.get('text', '')
                options = q.get('options', [])
                
                # Extract words from text
                text_words = [clean_word(w) for w in q_text.split()]
                for w in text_words:
                    if w:
                        word_weights[w] = word_weights.get(w, 0) + (5 if is_recent else 1)
                        
                is_vocab_q = (1 <= q_num <= 6)
                is_cloze_vocab = (21 <= q_num <= 25)
                
                correct_opt = None
                if answers and len(answers) >= q_num:
                    ans_char = answers[q_num - 1].upper()
                    char_idx = ord(ans_char) - ord('A')
                    if 0 <= char_idx < len(options):
                        correct_opt = options[char_idx]

                for opt in options:
                    opt_clean = clean_word(opt)
                    if not opt_clean:
                        continue
                    
                    is_correct = (opt == correct_opt)
                    
                    weight = 0
                    if is_recent:
                        if is_vocab_q:
                            weight = 150 if is_correct else 75
                        elif is_cloze_vocab:
                            weight = 100 if is_correct else 50
                        else:
                            weight = 30 if is_correct else 15
                    else:
                        if is_vocab_q:
                            weight = 40 if is_correct else 20
                        elif is_cloze_vocab:
                            weight = 30 if is_correct else 15
                        else:
                            weight = 10 if is_correct else 5
                            
                    word_weights[opt_clean] = word_weights.get(opt_clean, 0) + weight

        # Sort extracted words by weight
        sorted_extracted = sorted(word_weights.items(), key=lambda x: x[1], reverse=True)
        print(f"Extracted {len(sorted_extracted)} unique words from YÖKDİL exams.")

        enriched_vocab = []
        seen = set()
        
        # 1. Add all exam words that we have a translation for (sorted by weight/recency)
        for eng_word, weight in sorted_extracted:
            if eng_word in seen:
                continue
                
            seen.add(eng_word)
            
            # Reuse from existing vocab if present
            if eng_word in vocab_map:
                enriched_vocab.append(vocab_map[eng_word])
            # Or translate from global dict
            elif eng_word in global_dict:
                item = {
                    "id": 20000 + len(enriched_vocab),
                    "english": eng_word,
                    "turkish": global_dict[eng_word],
                    "status": "learning"
                }
                enriched_vocab.append(item)

        # 2. Add remaining current vocab words
        for item in current_vocab:
            eng_word = item['english'].lower()
            if eng_word not in seen:
                seen.add(eng_word)
                enriched_vocab.append(item)

        # Fix IDs sequentially
        for idx, item in enumerate(enriched_vocab):
            item['id'] = 20000 + idx
            
        print(f"Total vocabulary size: {len(enriched_vocab)} (Top items ordered by YÖKDİL exam weight).")
        
        # Save to vocab file
        with open(vocab_file, 'w', encoding='utf-8') as f:
            json.dump(enriched_vocab, f, ensure_ascii=False, indent=2)

    print("\n--- OFFLINE ENRICHMENT COMPLETED SUCCESSFULLY ---")

if __name__ == '__main__':
    run_offline_enrichment()
