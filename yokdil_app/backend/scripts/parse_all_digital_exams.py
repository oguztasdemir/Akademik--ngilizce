import pypdf
import json
import re

reader = pypdf.PdfReader('YOKDIL FEN CIKMIS SORULAR.pdf')

def clean_question_text(text):
    text = text.strip()
    # Remove exam headers/footers/page numbers
    text = re.sub(r'20\d\d\s*YÖKDİL.*', '', text)
    text = re.sub(r'YÖKDİL.*', '', text)
    text = re.sub(r'İNGİLİZCE.*', '', text)
    text = re.sub(r'FEN BİLİMLERİ.*', '', text)
    # Remove Turkish question instructions
    instructions = [
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*cümlede\s*boş\s*bırakılan\s*yerlere\s*uygun\s*düşen\s*sözcük\s*ya\s*da\s*ifadeyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*aşağıdaki\s*parçada\s*numaralanmış\s*yerlere\s*uygun\s*düşen\s*sözcük\s*ya\s*da\s*ifadeyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*verilen\s*cümleyi\s*uygun\s*şekilde\s*tamamlayan\s*ifadeyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*verilen\s*İngilizce\s*cümleye\s*anlamca\s*en\s*yakın\s*Türkçe\s*cümleyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*verilen\s*Türkçe\s*cümleye\s*anlamca\s*en\s*yakın\s*İngilizce\s*cümleyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*parçada\s*anlam\s*bütünlüğünü\s*sağlamak\s*için\s*boş\s*bırakılan\s*yerlere\s*getirilebilecek\s*cümleyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*cümleler\s*sırasıyla\s*okunduğunda\s*parçanın\s*anlam\s*bütünlüğünü\s*bozan\s*cümleyi\s*bulunuz\.',
        r'\d+\s*-\s*\d+\.\s*soruları\s*aşağıda\s*verilen\s*parçaya\s*göre\s*cevaplayınız\.',
        r'cümlede\s*boş\s*bırakılan\s*yerlere\s*uygun\s*düşen\s*sözcük\s*ya\s*da\s*ifadeyi\s*bulunuz\.',
        r'aşağıdaki\s*parçada\s*numaralanmış\s*yerlere\s*uygun\s*düşen\s*sözcük\s*ya\s*da\s*ifadeyi\s*bulunuz\.',
        r'verilen\s*cümleyi\s*uygun\s*şekilde\s*tamamlayan\s*ifadeyi\s*bulunuz\.',
        r'verilen\s*İngilizce\s*cümleye\s*anlamca\s*en\s*yakın\s*Türkçe\s*cümleyi\s*bulunuz\.',
        r'verilen\s*Türkçe\s*cümleye\s*anlamca\s*en\s*yakın\s*İngilizce\s*cümleyi\s*bulunuz\.',
        r'parçada\s*anlam\s*bütünlüğünü\s*sağlamak\s*için\s*boş\s*bırakılan\s*yerlere\s*getirilebilecek\s*cümleyi\s*bulunuz\.',
        r'cümleler\s*sırasıyla\s*okunduğunda\s*parçanın\s*anlam\s*bütünlüğünü\s*bozan\s*cümleyi\s*bulunuz\.',
        r'soruları\s*aşağıda\s*verilen\s*parçaya\s*göre\s*cevaplayınız\.'
    ]
    for ins in instructions:
        text = re.sub(ins, '', text, flags=re.IGNORECASE)
    # Clean leading garbage
    text = re.sub(r'^[^\w\s\(\-\{\d\.\']+', '', text)
    return text.strip()

def parse_exam_2018_2019(start_page, end_page):
    # Format A
    full_text = ""
    for p in range(start_page - 1, end_page):
        full_text += reader.pages[p].extract_text() + "\n\n"
    raw_lines = [l.strip() for l in full_text.split('\n')]
    lines = [l for l in raw_lines if l]
    
    questions = []
    idx = 0
    while idx < len(lines):
        line = lines[idx]
        match = re.match(r'^(\d+)\.$', line)
        if match:
            q_num = int(match.group(1))
            q_text_lines = []
            back_idx = idx - 1
            while back_idx >= 0:
                prev_line = lines[back_idx]
                if prev_line == "E)" or re.match(r'^\d+\.$', prev_line) or "sorularda" in prev_line or "cevaplayınız" in prev_line:
                    break
                q_text_lines.insert(0, prev_line)
                back_idx -= 1
            q_text = " ".join(q_text_lines).strip()
            
            options = {}
            letters = ['A', 'B', 'C', 'D', 'E']
            current_letter_idx = 0
            fwd_idx = idx + 1
            opt_text_accumulator = []
            while fwd_idx < len(lines) and current_letter_idx < 5:
                curr_line = lines[fwd_idx]
                expected_letter = letters[current_letter_idx]
                if curr_line == f"{expected_letter})":
                    options[expected_letter] = " ".join(opt_text_accumulator).strip()
                    opt_text_accumulator = []
                    current_letter_idx += 1
                else:
                    opt_text_accumulator.append(curr_line)
                fwd_idx += 1
                
            if len(options) == 5:
                questions.append({
                    "number": q_num,
                    "text": clean_question_text(q_text),
                    "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
                })
        idx += 1
    return questions

def parse_exam_2019_sonbahar(start_page, end_page):
    # Format B: Soru No: X, followed by text, followed by options on lines like A) option_text
    full_text = ""
    for p in range(start_page - 1, end_page):
        full_text += reader.pages[p].extract_text() + "\n\n"
        
    # Split text into questions using "Soru No:" as delimiter
    q_blocks = re.split(r'Soru No:\s*', full_text)
    questions = []
    
    for block in q_blocks:
        block = block.strip()
        if not block:
            continue
        
        # Match number at start
        match = re.match(r'^(\d+)', block)
        if not match:
            continue
        q_num = int(match.group(1))
        
        # Extract options (A) option, B) option, C) option, D) option, E) option)
        # Options are written on their own lines or at the end
        opt_matches = re.findall(r'([A-E])\)\s*(.*?)(?=\s*[A-E]\)|$)', block, re.DOTALL)
        
        # Clean options
        options = {}
        for letter, opt_text in opt_matches:
            options[letter] = opt_text.replace('\n', ' ').strip()
            
        # Extract question body (text between number and A) option)
        body_match = re.search(r'^\d+\s*(.*?)(?=\s*A\))', block, re.DOTALL)
        q_text = body_match.group(1).replace('\n', ' ').strip() if body_match else ""
        
        if len(options) == 5:
            questions.append({
                "number": q_num,
                "text": clean_question_text(q_text),
                "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
            })
            
    return sorted(questions, key=lambda x: x["number"])

def parse_exam_2021_subat(start_page, end_page):
    # Format C: X. question_text followed by A) option B) option ...
    full_text = ""
    for p in range(start_page - 1, end_page):
        full_text += reader.pages[p].extract_text() + "\n\n"
        
    # Split by question numbers at the beginning of lines
    # We find "1.", "2.", ... "80." at the beginning of a word
    # Let's extract question blocks
    questions = []
    
    # Simple line-by-line parsing is robust here
    lines = [l.strip() for l in full_text.split('\n') if l.strip()]
    
    current_q = None
    accumulated_text = []
    options = {}
    
    for line in lines:
        # Check if line starts a new question
        match = re.match(r'^(\d+)\.\s*(.*)', line)
        if match:
            # Save previous question if complete
            if current_q and len(options) == 5:
                questions.append({
                    "number": current_q,
                    "text": clean_question_text(" ".join(accumulated_text)),
                    "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
                })
            
            current_q = int(match.group(1))
            accumulated_text = [match.group(2)]
            options = {}
            continue
            
        # Check if line contains option letters like A) ... B) ...
        # Let's see if we can find options in this line
        opt_line_matches = re.findall(r'([A-E])\)\s*(.*?)(?=\s*[A-E]\)|$)', line)
        if opt_line_matches:
            for letter, opt_text in opt_line_matches:
                options[letter] = opt_text.strip()
        elif current_q:
            # Accumulate text
            accumulated_text.append(line)
            
    # Save last question
    if current_q and len(options) == 5:
        questions.append({
            "number": current_q,
            "text": clean_question_text(" ".join(accumulated_text)),
            "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
        })
        
    return sorted(questions, key=lambda x: x["number"])

# Run all parses
print("Parsing 2018 İlkbahar...")
questions_2018_ilk = parse_exam_2018_2019(1, 20)
print(f"Found {len(questions_2018_ilk)} questions.")

print("Parsing 2018 Yaz...")
questions_2018_yaz = parse_exam_2018_2019(22, 40)
print(f"Found {len(questions_2018_yaz)} questions.")

print("Parsing 2019 İlkbahar...")
questions_2019_ilk = parse_exam_2018_2019(42, 60)
print(f"Found {len(questions_2019_ilk)} questions.")

print("Parsing 2019 Sonbahar...")
questions_2019_son = parse_exam_2019_sonbahar(62, 124)
print(f"Found {len(questions_2019_son)} questions.")

print("Parsing 2021 Şubat...")
questions_2021_sub = parse_exam_2021_subat(126, 149)
print(f"Found {len(questions_2021_sub)} questions.")

# Combine all parsed questions into a single database mapping
all_parsed_questions = {
    "2018-ilkbahar": questions_2018_ilk,
    "2018-yaz": questions_2018_yaz,
    "2019-ilkbahar": questions_2019_ilk,
    "2019-sonbahar": questions_2019_son,
    "2021-subat": questions_2021_sub
}

with open('parsed_questions_text.json', 'w', encoding='utf-8') as f:
    json.dump(all_parsed_questions, f, ensure_ascii=False, indent=2)
print("Saved parsed_questions_text.json!")
