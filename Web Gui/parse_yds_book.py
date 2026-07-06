import os
import re
import json
from pypdf import PdfReader

def find_yds_pdf():
    pdf_dir = os.path.join(os.path.dirname(__file__), 'pdfs')
    if not os.path.exists(pdf_dir):
        return None
    for file in os.listdir(pdf_dir):
        if file.lower().endswith('.pdf') and ('yds' in file.lower() or '60_gunde' in file.lower()):
            return os.path.join(pdf_dir, file)
    return None

def clean_text(text):
    text = text.replace('\n', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def parse_pdf(pdf_path):
    print(f"Reading PDF: {pdf_path}")
    reader = PdfReader(pdf_path)
    total_pages = len(reader.pages)
    print(f"Total pages: {total_pages}")

    full_text_pages = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        full_text_pages.append((idx + 1, text))

    days_data = {}
    
    full_content = ""
    for page_num, text in full_text_pages:
        full_content += text + f"\n---PAGE_{page_num}---\n"

    # Match: X. GÜNÜN KELİMELERİ
    day_matches = list(re.finditer(r'(\d+)\.\s*GÜNÜN\s*KELİMELERİ', full_content, re.IGNORECASE))
    
    for i in range(len(day_matches)):
        start_pos = day_matches[i].end()
        end_pos = day_matches[i+1].start() if i + 1 < len(day_matches) else len(full_content)
        day_num = int(day_matches[i].group(1))
        
        day_text = full_content[start_pos:end_pos]
        
        words_list = []
        
        # Check if there is an exercises section
        ex_match = re.search(r'(\d+)\.\s*GÜNÜN\s*KELİME\s*ALIŞTIRMALARI', day_text, re.IGNORECASE)
        if ex_match:
            words_part = day_text[:ex_match.start()]
            exercises_part = day_text[ex_match.end():]
        else:
            split_points = list(re.finditer(r'1\.\s*SYNONYM\s*MATCHING', day_text, re.IGNORECASE))
            if split_points:
                words_part = day_text[:split_points[0].start()]
                exercises_part = day_text[split_points[0].start():]
            else:
                words_part = day_text
                exercises_part = ""

        # Parse word blocks
        word_heads = list(re.finditer(r'([A-Z]{3,}(?:\s+[A-Z]+)*)\s*\((v|n|adj|adv|prep|conj|v\s*/\s*n|v\s*and\s*n)\)', words_part))
        
        for w_idx in range(len(word_heads)):
            w_start = word_heads[w_idx].start()
            w_end = word_heads[w_idx+1].start() if w_idx + 1 < len(word_heads) else len(words_part)
            
            word_raw = words_part[w_start:w_end]
            word_name = word_heads[w_idx].group(1).strip()
            word_type = word_heads[w_idx].group(2).strip()
            
            meaning_m = re.search(r'Türkçe\s*Karşılığı\s*:\s*(.*?)(?=(?:Örnek Cümle|Çevirisi|Eş ya da Yakın|Zıt Anlamlılar|Diğer Halleri|$))', word_raw, re.DOTALL | re.IGNORECASE)
            sentence_m = re.search(r'Örnek Cümle\s*(?:1)?\s*:\s*(.*?)(?=(?:Çevirisi|Eş ya da Yakın|Zıt Anlamlılar|Diğer Halleri|$))', word_raw, re.DOTALL | re.IGNORECASE)
            translation_m = re.search(r'Çevirisi\s*:\s*(.*?)(?=(?:Örnek Cümle|Eş ya da Yakın|Zıt Anlamlılar|Diğer Halleri|$))', word_raw, re.DOTALL | re.IGNORECASE)
            synonyms_m = re.search(r'Eş ya da Yakın Anlamlılar\s*:\s*(.*?)(?=(?:Zıt Anlamlılar|Diğer Halleri|$))', word_raw, re.DOTALL | re.IGNORECASE)
            antonyms_m = re.search(r'Zıt Anlamlılar\s*:\s*(.*?)(?=(?:Diğer Halleri|$))', word_raw, re.DOTALL | re.IGNORECASE)
            others_m = re.search(r'Diğer Halleri\s*:\s*(.*?)$', word_raw, re.DOTALL | re.IGNORECASE)

            def clean_field(m):
                return clean_text(m.group(1)) if m else ""

            def split_list(m):
                if not m: return []
                cleaned = clean_text(m.group(1))
                return [x.strip() for x in re.split(r'[,;]\s*', cleaned) if x.strip()]

            words_list.append({
                "word": word_name,
                "type": word_type,
                "turkish": clean_field(meaning_m),
                "sentence_en": clean_field(sentence_m),
                "sentence_tr": clean_field(translation_m),
                "synonyms": split_list(synonyms_m),
                "antonyms": split_list(antonyms_m),
                "other_forms": clean_field(others_m)
            })

        parsed_exercises = parse_exercises(exercises_part)
        
        days_data[f"day_{day_num}"] = {
            "day": day_num,
            "words": words_list,
            "exercises": parsed_exercises
        }

    return days_data

def parse_exercises(text):
    synonym_matching = []
    syn_match_part = re.search(r'1\.\s*SYNONYM\s*MATCHING(.*?)(?=2\.\s*ANTONYM\s*MATCHING|$)', text, re.DOTALL | re.IGNORECASE)
    if syn_match_part:
        lines = syn_match_part.group(1).split('\n')
        left_side = []
        right_side = []
        for line in lines:
            left_item = re.search(r'(\d+)\.\s*([a-zA-Z\s,]+)', line)
            right_item = re.search(r'([a-f])\.\s*([a-zA-Z\s,]+)', line)
            if left_item:
                left_side.append({"id": int(left_item.group(1)), "word": left_item.group(2).strip()})
            if right_item:
                right_side.append({"key": right_item.group(1), "def": right_item.group(2).strip()})
        synonym_matching = {"left": left_side, "right": right_side}

    antonym_matching = []
    ant_match_part = re.search(r'2\.\s*ANTONYM\s*MATCHING(.*?)(?=3\.\s*SYNONYM|$)', text, re.DOTALL | re.IGNORECASE)
    if ant_match_part:
        lines = ant_match_part.group(1).split('\n')
        left_side = []
        right_side = []
        for line in lines:
            left_item = re.search(r'(\d+)\.\s*([a-zA-Z\s,]+)', line)
            right_item = re.search(r'([a-f])\.\s*([a-zA-Z\s,]+)', line)
            if left_item:
                left_side.append({"id": int(left_item.group(1)), "word": left_item.group(2).strip()})
            if right_item:
                right_side.append({"key": right_item.group(1), "def": right_item.group(2).strip()})
        antonym_matching = {"left": left_side, "right": right_side}

    multiple_choice = []
    mc_part = re.search(r'4\.\s*MULTIPLE\s*CHOICE(.*?)(?=5\.\s*SYNONYM\s*FINDER|$)', text, re.DOTALL | re.IGNORECASE)
    if mc_part:
        questions_raw = re.split(r'(\d+)\.\s*', mc_part.group(1))
        q_idx = 1
        while q_idx < len(questions_raw):
            q_num = questions_raw[q_idx]
            q_body = questions_raw[q_idx+1]
            
            opt_a = re.search(r'A\)\s*(.*?)(?=\s*[B-E]\)|$)', q_body)
            opt_b = re.search(r'B\)\s*(.*?)(?=\s*[C-E]\)|$)', q_body)
            opt_c = re.search(r'C\)\s*(.*?)(?=\s*[D-E]\)|$)', q_body)
            opt_d = re.search(r'D\)\s*(.*?)(?=\s*E\)|$)', q_body)
            opt_e = re.search(r'E\)\s*(.*?)$', q_body)
            
            question_text = re.split(r'[A-E]\)', q_body)[0].strip()
            
            if opt_a and opt_b:
                multiple_choice.append({
                    "id": int(q_num),
                    "question": clean_text(question_text),
                    "options": {
                        "A": clean_text(opt_a.group(1)),
                        "B": clean_text(opt_b.group(1)),
                        "C": clean_text(opt_c.group(1)) if opt_c else "",
                        "D": clean_text(opt_d.group(1)) if opt_d else "",
                        "E": clean_text(opt_e.group(1)) if opt_e else ""
                    }
                })
            q_idx += 2

    return {
        "synonym_matching": synonym_matching,
        "antonym_matching": antonym_matching,
        "multiple_choice": multiple_choice
    }

if __name__ == '__main__':
    pdf_path = find_yds_pdf()
    output_dirs = [
        os.path.join(os.path.dirname(__file__), 'dataset', 'yokdil', 'fen', 'kitap'),
        os.path.join(os.path.dirname(__file__), 'frontend', 'public', 'dataset', 'yokdil', 'fen', 'kitap')
    ]
    for output_dir in output_dirs:
        os.makedirs(output_dir, exist_ok=True)
    
    if not pdf_path:
        print("Error: YDS PDF file not found. Creating placeholder day_1.json if not present.")
    else:
        try:
            parsed_data = parse_pdf(pdf_path)
            for day_key, day_val in parsed_data.items():
                day_num = day_val["day"]
                for output_dir in output_dirs:
                    file_path = os.path.join(output_dir, f"day_{day_num}.json")
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(day_val, f, ensure_ascii=False, indent=2)
            print(f"Dataset successfully created! Saved {len(parsed_data)} day files in output directories.")
        except Exception as e:
            print(f"Error parsing PDF: {e}")
