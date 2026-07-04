import json
import os
import re
import urllib.request
import urllib.parse
import time

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

GLOBAL_DICT = {}

def load_global_dictionary(root_dir):
    global GLOBAL_DICT
    for cat in ['fen', 'sosyal', 'saglik']:
        dict_file = os.path.join(root_dir, 'frontend', 'src', 'components', f'dictionary_{cat}.json')
        if os.path.exists(dict_file):
            try:
                with open(dict_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for k, v in data.items():
                        GLOBAL_DICT[k.lower()] = v
            except Exception as e:
                print(f"Error loading dict {cat}: {e}")
    print(f"Loaded {len(GLOBAL_DICT)} translation mappings into memory.")

def translate_word(word):
    # Check memory cache first
    word_lower = word.lower()
    if word_lower in GLOBAL_DICT:
        return GLOBAL_DICT[word_lower]
        
    try:
        url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(word)}&langpair=en|tr"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        # Strict 2 second timeout to prevent hanging
        with urllib.request.urlopen(req, timeout=2) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            translation = res_data.get('matches', [{}])[0].get('translation', '')
            if translation:
                result = translation.lower().strip()
                GLOBAL_DICT[word_lower] = result
                return result
    except Exception as e:
        print(f"Translation failed/timed out for '{word}': {e}")
    
    # Return a basic placeholder instead of breaking
    return ""

def clean_word(word):
    cleaned = re.sub(r'[^a-zA-Z]', '', word).lower().strip()
    if len(cleaned) <= 3 or cleaned in STOP_WORDS:
        return ""
    return cleaned

def enrich_category(category, root_dir):
    print(f"\n--- Processing {category.upper()} ---")
    
    # Load exams database
    exams_file = os.path.join(root_dir, 'frontend', 'src', 'components', f'exams_db_{category}.json')
    if not os.path.exists(exams_file):
        print(f"Exams database not found for {category}")
        return
        
    with open(exams_file, 'r', encoding='utf-8') as f:
        exams = json.load(f)
        
    # Load current vocabulary database
    vocab_file = os.path.join(root_dir, 'frontend', 'src', 'components', f'vocab_db_{category}.json')
    current_vocab = []
    if os.path.exists(vocab_file):
        with open(vocab_file, 'r', encoding='utf-8') as f:
            current_vocab = json.load(f)
            
    # Load existing dictionary to preserve high quality translations
    dict_file = os.path.join(root_dir, 'frontend', 'src', 'components', f'dictionary_{category}.json')
    existing_dict = {}
    if os.path.exists(dict_file):
        with open(dict_file, 'r', encoding='utf-8') as f:
            existing_dict = json.load(f)

    # Dictionary mapping english word to its existing translation details
    vocab_map = {item['english'].lower(): item for item in current_vocab}
    
    # Weight table for all words found in YÖKDİL exams
    word_weights = {}
    
    # Parse exams and extract words with weights
    for exam in exams:
        title = exam.get('title', exam.get('name', ''))
        is_recent = any(year in title for year in ['2024', '2025', '2026'])
        questions = exam.get('questions', [])
        answers = exam.get('answers', [])
        
        for i, q in enumerate(questions):
            q_num = q.get('number', i + 1)
            q_text = q.get('text', '')
            options = q.get('options', [])
            
            # Extract words from question text
            text_words = [clean_word(w) for w in q_text.split()]
            text_words = [w for w in text_words if w]
            
            # Base text weight
            text_weight = 5 if is_recent else 1
            for w in text_words:
                word_weights[w] = word_weights.get(w, 0) + text_weight
                
            # Is this a vocabulary question? (1-6)
            is_vocab_q = (1 <= q_num <= 6)
            # Is this a cloze test question? (21-25)
            is_cloze_vocab = (21 <= q_num <= 25)
            
            # Identify correct option if answers exist
            correct_opt = None
            if answers and len(answers) >= q_num:
                ans_char = answers[q_num - 1].upper()
                char_idx = ord(ans_char) - ord('A')
                if 0 <= char_idx < len(options):
                    correct_opt = options[char_idx]

            # Process options
            for opt in options:
                opt_clean = clean_word(opt)
                if not opt_clean:
                    continue
                
                is_correct = (opt == correct_opt)
                
                # Assign weights based on recency and relevance
                weight = 0
                if is_recent:
                    if is_vocab_q:
                        weight = 100 if is_correct else 50
                    elif is_cloze_vocab:
                        weight = 70 if is_correct else 35
                    else:
                        weight = 20 if is_correct else 10
                else:
                    if is_vocab_q:
                        weight = 30 if is_correct else 15
                    elif is_cloze_vocab:
                        weight = 20 if is_correct else 10
                    else:
                        weight = 5 if is_correct else 2
                        
                word_weights[opt_clean] = word_weights.get(opt_clean, 0) + weight

    # Sort all extracted words by weight in descending order
    sorted_extracted = sorted(word_weights.items(), key=lambda x: x[1], reverse=True)
    
    print(f"Extracted {len(sorted_extracted)} unique words from exams.")
    
    # Merge and update existing vocab or translate new ones
    enriched_vocab = []
    seen = set()
    
    # Process the most important words first (limit to top 1500 to keep app fast and focused on pure YÖKDİL vocab)
    target_count = 1300
    words_added = 0
    
    # 1. Add all words that have weight from exams first, sorted by relevance
    for eng_word, weight in sorted_extracted:
        if eng_word in seen:
            continue
            
        seen.add(eng_word)
        
        # Check if we already have it in existing vocab
        if eng_word in vocab_map:
            item = vocab_map[eng_word]
            enriched_vocab.append(item)
            words_added += 1
        # Check if we have it in dictionary
        elif eng_word in existing_dict:
            item = {
                "id": 20000 + len(enriched_vocab),
                "english": eng_word,
                "turkish": existing_dict[eng_word],
                "status": "learning"
            }
            enriched_vocab.append(item)
            words_added += 1
        # Translate new high-weight word (only if it has significant weight, e.g. weight >= 25, to filter out garbage tokens)
        elif weight >= 25 and words_added < target_count:
            # First look up globally
            translation = GLOBAL_DICT.get(eng_word, "")
            if not translation:
                print(f"Translating new high-priority word: '{eng_word}' (Weight: {weight})")
                translation = translate_word(eng_word)
                if translation:
                    time.sleep(0.3) # Prevent rate limits
            
            if translation and "[çeviri" not in translation.lower():
                # Save to dictionary
                existing_dict[eng_word] = translation
                item = {
                    "id": 20000 + len(enriched_vocab),
                    "english": eng_word,
                    "turkish": translation,
                    "status": "learning"
                }
                enriched_vocab.append(item)
                words_added += 1
                
    # 2. Fill the remaining spots with other existing vocab items to preserve user data size
    for item in current_vocab:
        eng_word = item['english'].lower()
        if eng_word not in seen:
            seen.add(eng_word)
            enriched_vocab.append(item)
            
    # Fix IDs sequentially
    for idx, item in enumerate(enriched_vocab):
        item['id'] = 20000 + idx
        
    print(f"Total vocabulary size after enrichment: {len(enriched_vocab)}")
    
    # Save the updated databases
    with open(vocab_file, 'w', encoding='utf-8') as f:
        json.dump(enriched_vocab, f, ensure_ascii=False, indent=2)
        
    with open(dict_file, 'w', encoding='utf-8') as f:
        json.dump(existing_dict, f, ensure_ascii=False, indent=2)
        
    print(f"Saved updated JSONs for {category}!")

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    load_global_dictionary(root)
    for cat in ['fen', 'sosyal', 'saglik']:
        enrich_category(cat, root)
    print("\n--- ENRICHMENT COMPLETED SUCCESSFULLY ---")

if __name__ == '__main__':
    main()
