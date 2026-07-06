import pypdf
import json
import re

reader = pypdf.PdfReader('YOKDIL FEN CIKMIS SORULAR.pdf')

def clean_text(text):
    if not text:
        return ""
    # Remove exam header/footer metadata lines
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        # Skip common headers/footers
        if "YÖKDİL" in l or "CEVAP ANAHTARI" in l or "A Grubu" in l or "FEN BİLİMLERİ" in l or re.match(r'^\d+$', l):
            continue
        cleaned_lines.append(line)
    return "\n".join(cleaned_lines)

def parse_exam_2018_2019(start_page, end_page, exam_id):
    # Format A:
    # Text
    # X.
    # opt_text
    # A)
    # opt_text
    # B) ...
    questions = []
    
    # Extract text from all pages
    full_text = ""
    for p in range(start_page - 1, end_page):
        full_text += reader.pages[p].extract_text() + "\n\n"
        
    # Split full text into lines
    raw_lines = [l.strip() for l in full_text.split('\n')]
    # Filter empty lines
    lines = [l for l in raw_lines if l]
    
    idx = 0
    while idx < len(lines):
        line = lines[idx]
        
        # Check if line is a question number (e.g. "1.", "2.", ... "80.")
        match = re.match(r'^(\d+)\.$', line)
        if match:
            q_num = int(match.group(1))
            
            # Backtrack to find question text
            # Question text starts after the options of the previous question
            # Let's search backwards until we hit option E) of previous question or start
            q_text_lines = []
            back_idx = idx - 1
            while back_idx >= 0:
                prev_line = lines[back_idx]
                if prev_line == "E)" or re.match(r'^\d+\.$', prev_line) or "sorularda" in prev_line or "cevaplayınız" in prev_line:
                    break
                q_text_lines.insert(0, prev_line)
                back_idx -= 1
                
            q_text = " ".join(q_text_lines).strip()
            
            # Extract options
            options = {}
            letters = ['A', 'B', 'C', 'D', 'E']
            current_letter_idx = 0
            
            fwd_idx = idx + 1
            opt_text_accumulator = []
            
            while fwd_idx < len(lines) and current_letter_idx < 5:
                curr_line = lines[fwd_idx]
                expected_letter = letters[current_letter_idx]
                
                if curr_line == fwd_letter_match(expected_letter):
                    opt_text = " ".join(opt_text_accumulator).strip()
                    options[expected_letter] = opt_text
                    opt_text_accumulator = []
                    current_letter_idx += 1
                else:
                    opt_text_accumulator.append(curr_line)
                fwd_idx += 1
                
            # If we successfully parsed all options, add it
            if len(options) == 5:
                # Clean up question text from any leaked directions
                # (e.g. "1 - 20. sorularda...")
                q_text_cleaned = re.sub(r'^\d+\s*-\s*\d+\.\s*sorularda.*?\.\s*', '', q_text)
                questions.append({
                    "number": q_num,
                    "text": q_text_cleaned,
                    "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
                })
                
        idx += 1
        
    return questions

def fwd_letter_match(letter):
    return f"{letter})"

# Let's test the 2018 İlkbahar parser
parsed_2018_ilk = parse_exam_2018_2019(1, 20, "2018-ilkbahar")
print("Parsed 2018 İlkbahar questions count:", len(parsed_2018_ilk))
if parsed_2018_ilk:
    print("Q1 Text:", parsed_2018_ilk[0]["text"])
    print("Q1 Options:", parsed_2018_ilk[0]["options"])
