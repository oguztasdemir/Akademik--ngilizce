import json
import urllib.request
import urllib.parse
import time
import os

def translate_word(word):
    try:
        # Query MyMemory Translation API (free, no key required for low volume)
        url = f"https://api.mymemory.translated.net/get?q={urllib.parse.quote(word)}&langpair=en|tr"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            translation = res_data.get('matches', [{}])[0].get('translation', '')
            if translation:
                return translation.lower().strip()
    except Exception as e:
        print(f"Translation failed for '{word}': {e}")
    return ""

def main():
    root = os.path.dirname(__file__)
    exams_path = os.path.join(root, 'all_exams_questions.json')
    
    with open(exams_path, 'r', encoding='utf-8') as f:
        exams = json.load(f)
        
    unique_words = set()
    
    for exam in exams:
        questions = exam.get('questions', [])
        # Extract options from the first 6 questions (pure vocab)
        for q in questions[:6]:
            for opt in q.get('options', []):
                cleaned = opt.strip().lower()
                if cleaned and cleaned.isalpha():
                    unique_words.add(cleaned)
                    
        # Also extract options from cloze test questions if they exist
        for q in questions[20:25]:
            for opt in q.get('options', []):
                cleaned = opt.strip().lower()
                if cleaned and cleaned.isalpha():
                    unique_words.add(cleaned)

    print(f"Found {len(unique_words)} unique academic words.")
    
    # Load existing dictionary to preserve manually verified definitions
    dict_path = os.path.join(root, 'questions', 'fen', 'dictionary.json')
    existing_dict = {}
    if os.path.exists(dict_path):
        with open(dict_path, 'r', encoding='utf-8') as f:
            existing_dict = json.load(f)
            
    final_dict = {}
    words_to_translate = []
    
    for w in sorted(unique_words):
        if w in existing_dict:
            final_dict[w] = existing_dict[w]
        else:
            words_to_translate.append(w)
            
    print(f"Preserved {len(final_dict)} existing words. Translating {len(words_to_translate)} new words...")
    
    # Translate new words
    for i, w in enumerate(words_to_translate):
        print(f"[{i+1}/{len(words_to_translate)}] Translating '{w}'...")
        tr = translate_word(w)
        if tr:
            final_dict[w] = tr
        else:
            final_dict[w] = "[Çeviri Bulunamadı]"
        time.sleep(1) # Rate limit protection
        
    # Save as fen_kelimeleri.json in root
    out_path = os.path.join(root, '..', 'fen_kelimeleri.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(final_dict, f, ensure_ascii=False, indent=2)
        
    # Also overwrite dictionary.json in backend/questions to enrich the app
    with open(dict_path, 'w', encoding='utf-8') as f:
        json.dump(final_dict, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved {len(final_dict)} words to fen_kelimeleri.json and dictionary.json!")

if __name__ == '__main__':
    main()
