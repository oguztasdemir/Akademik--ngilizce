import fitz
import easyocr
import numpy as np
from PIL import Image
import io
import json
import os
import re

print("Initializing EasyOCR (en, tr)...")
reader = easyocr.Reader(['en', 'tr'])

exams_to_ocr = [
    {
        "id": "2024-subat",
        "filename": "2024 Subat YOKDIL - Fen Bilimleri.pdf",
        "startPage": 2,
        "endPage": 16
    },
    {
        "id": "2025-subat",
        "filename": "2025 Subat YOKDIL - Fen Bilimleri.pdf",
        "startPage": 2,
        "endPage": 15
    },
    {
        "id": "2025-temmuz",
        "filename": "2025 Temmuz YOKDIL - Fen Bilimleri.pdf",
        "startPage": 2,
        "endPage": 17
    },
    {
        "id": "2026-mart",
        "filename": "2026 Mart YOKDIL - Fen Bilimleri.pdf",
        "startPage": 2,
        "endPage": 18
    }
]

# Read existing database
db_path = "questions/exams_db.json"
if os.path.exists(db_path):
    with open(db_path, "r", encoding="utf-8") as f:
        exams_db = json.load(f)
else:
    print("Error: exams_db.json not found!")
    exit(1)

def parse_column_text(ocr_results):
    lines = []
    for bbox, text, prob in ocr_results:
        lines.append(text.strip())
        
    questions = []
    current_q = None
    accumulated_text = []
    options = {}
    
    idx = 0
    while idx < len(lines):
        line = lines[idx]
        if not line:
            idx += 1
            continue
            
        # Check if line starts with question number
        num_match = re.match(r'^(?:Soru\s+)?(\d+)\b(?:[\.\s\-]+(.*)|$)', line, re.IGNORECASE)
        if num_match:
            if current_q and len(options) == 5:
                questions.append({
                    "number": current_q,
                    "text": " ".join(accumulated_text).strip(),
                    "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
                })
            current_q = int(num_match.group(1))
            line = num_match.group(2) if num_match.group(2) else ""
            accumulated_text = []
            options = {}
            if not line:
                idx += 1
                continue
            
        # Parse inline options (e.g. A) option B) option)
        inline_opts = re.findall(r'([A-E])\)\s*([^A-E\)]+)(?=\s*[A-E]\)|$)', line)
        if inline_opts:
            for letter, opt_text in inline_opts:
                options[letter] = opt_text.strip()
            # Remove options text from the question line
            cleaned_line = re.sub(r'[A-E]\)\s*([^A-E\)]+)(?=\s*[A-E]\)|$)', '', line).strip()
            if cleaned_line and current_q:
                accumulated_text.append(cleaned_line)
        elif current_q:
            # Check for standalone option (e.g. "A) option")
            opt_match = re.match(r'^([A-E])\)\s*(.*)', line)
            if opt_match:
                options[opt_match.group(1)] = opt_match.group(2).strip()
            else:
                accumulated_text.append(line)
            
        idx += 1
        
    # Save the last question if complete
    if current_q and len(options) == 5:
        questions.append({
            "number": current_q,
            "text": " ".join(accumulated_text).strip(),
            "options": [options['A'], options['B'], options['C'], options['D'], options['E']]
        })
        
    return questions

for target in exams_to_ocr:
    print(f"\n--- Starting OCR for {target['id']} ({target['filename']}) ---")
    pdf_path = os.path.join("pdfs", target["filename"])
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue
        
    doc = fitz.open(pdf_path)
    all_exam_questions = []
    
    for page_num in range(target["startPage"], target["endPage"] + 1):
        print(f"Processing Page {page_num}/{len(doc)}...")
        page = doc[page_num - 1]
        
        # Render high-res image
        pix = page.get_pixmap(dpi=150)
        img_data = pix.tobuttons() if hasattr(pix, 'tobuttons') else pix.tobytes()
        img = Image.open(io.BytesIO(img_data))
        w, h = img.size
        
        # Split vertical
        left_img = img.crop((0, 0, w // 2, h))
        right_img = img.crop((w // 2, 0, w, h))
        
        # Run OCR
        left_results = reader.readtext(np.array(left_img))
        right_results = reader.readtext(np.array(right_img))
        
        # Parse
        left_qs = parse_column_text(left_results)
        right_qs = parse_column_text(right_results)
        
        all_exam_questions.extend(left_qs)
        all_exam_questions.extend(right_qs)
        
    # Deduplicate and sort
    q_dict = {}
    for q in all_exam_questions:
        # Keep unique question numbers (1-80)
        num = q["number"]
        if num >= 1 and num <= 80:
            q_dict[num] = q
            
    print(f"Extracted {len(q_dict)} questions from OCR.")
    
    # Merge back to the main DB
    for exam in exams_db:
        if exam["id"] == target["id"]:
            exam["questions"] = []
            for i in range(1, 81):
                if i in q_dict:
                    exam["questions"].append({
                        "number": i,
                        "text": q_dict[i]["text"],
                        "options": q_dict[i]["options"]
                    })
                else:
                    # Keep empty structure if failed
                    exam["questions"].append({
                        "number": i,
                        "text": f"Soru {i} metni OCR ile çıkarılamadı.",
                        "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D", "Seçenek E"]
                    })
            print(f"Successfully updated questions database for {exam['name']}.")

# Save updated database
with open(db_path, "w", encoding="utf-8") as f:
    json.dump(exams_db, f, ensure_ascii=False, indent=2)
print("\nAll OCR tasks completed. exams_db.json successfully updated!")
