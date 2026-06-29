import json
import fitz
import re
import os

db_path = 'yokdil_app/questions/exams_db.json'
all_q_path = 'yokdil_app/all_exams_questions.json'
pdf_path = 'yokdil_app/pdfs/YOKDIL FEN CIKMIS SORULAR.pdf'

# Verify files exist
for path in [db_path, all_q_path, pdf_path]:
    if not os.path.exists(path):
        print(f"Error: {path} does not exist!")
        exit(1)

print("Loading existing database and helper files...")
with open(db_path, 'r', encoding='utf-8') as f:
    exams_db = json.load(f)

with open(all_q_path, 'r', encoding='utf-8') as f:
    all_qs = json.load(f)

all_qs_dict = {e['id']: e for e in all_qs}

doc = fitz.open(pdf_path)

def get_exam_text(start_page, end_page, is_two_column):
    lines = []
    for p in range(start_page - 1, end_page):
        page = doc[p]
        if is_two_column:
            w, h = page.rect.width, page.rect.height
            rect_left = fitz.Rect(0, 0, w / 2, h)
            rect_right = fitz.Rect(w / 2, 0, w, h)
            left_text = page.get_text('text', clip=rect_left)
            right_text = page.get_text('text', clip=rect_right)
            for l in left_text.split('\n') + right_text.split('\n'):
                lines.append(l.strip())
        else:
            page_text = page.get_text('text')
            for l in page_text.split('\n'):
                lines.append(l.strip())
    return [l for l in lines if l]

def clean_question_text(text):
    lines = text.split('\n')
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        if not l: continue
        if re.search(r'20\d\d\s*YÖKDİL', l, re.IGNORECASE): continue
        if re.search(r'^YÖKDİL\s*$', l, re.IGNORECASE): continue
        if re.search(r'^\d+\s*YÖKDİL', l, re.IGNORECASE): continue
        if re.search(r'^FEN BİLİMLERİ', l, re.IGNORECASE): continue
        if re.search(r'^İNGİLİZCE', l, re.IGNORECASE): continue
        if re.search(r'^---\s*SAYFA\s*\d+\s*---$', l, re.IGNORECASE): continue
        if re.match(r'^\d+$', l): continue
        if l in ['A', 'B', 'C', 'D', 'E']: continue
        cleaned_lines.append(l)
    
    text = ' '.join(cleaned_lines).strip()
    instructions = [
        r'\d+\s*-\s*\d+\.\s*sorularda,\s*cümlede\s*boş\s*bırakılan\s*yerlere\s*uygun\s*düşen\s*sözcük\s*ya\s*da\s*ifadeyi\s*bulunuz\.',
        r'cümlede\s*boş\s*bırakılan\s*yerlere\s*uygun\s*düşen\s*sözcük\s*ya\s*da\s*ifadeyi\s*bulunuz\.'
    ]
    for ins in instructions:
        text = re.sub(ins, '', text, flags=re.IGNORECASE)
    text = re.sub(r'^[^\w\s\(\-\{\d\.\']+', '', text)
    return text.strip()

# Hardcoded details for 17 scrambled questions of 2021-subat
subat_2021_fallbacks = {
    12: {
        'text': '------ there are various ways to define desert climate; a classification system widely used by modern scientists defines it as averaging at least twice as much potential evaporation as rainfall during the year.',
        'options': ['In case', 'Although', 'Once', 'Unless', 'Given that']
    },
    13: {
        'text': '------ the major technical problems associated with reducing emissions from gasoline-fueled cars are solved, such reductions alone might not be sufficient to solve the air pollution problems.',
        'options': ['Now that', 'Once', 'Even if', 'As soon as', 'Until']
    },
    15: {
        'text': '------ jaguars are secretive and rare, biologists have not been able to determine the exact number remaining in the wild.',
        'options': ['Unless', 'While', 'In case', 'Because', 'As if']
    },
    17: {
        'text': '------ failures such as those in the Bay Bridge and the Tacoma Narrows Bridge; engineers have developed methods for making bridges more aerodynamically sound.',
        'options': ['As a result of', 'On behalf of', 'For the sake of', 'In terms of', 'Regardless of']
    },
    24: {
        'text': '[Cloze Test (Questions 21-25)] How do you sleep in zero gravity? The crew on the International Space Station (ISS) sleep in sleeping bags (21) ----- to the wall with special equipments. On average, crew members get six hours of sleep a night; (22) ---- , since there is zero gravity, they feel drowsy and tired al the time. Many suffer (23) ---- sleep disorders. These are made worse by the fact the ISS experiences 16 sunrises and sunsets every 24 hours. This frequent switching between day and night (24) the production of the hormone melatonin, which regulates our sleep cycle. Another cause of sleep deprivation (25) ---- this are solar lightning strikes, which the astronauts can still see with their eyes closed.',
        'options': ['resumes', 'expands', 'tolerates', 'promotes', 'disturbs']
    },
    25: {
        'text': '[Cloze Test (Questions 21-25)] How do you sleep in zero gravity? The crew on the International Space Station (ISS) sleep in sleeping bags (21) ----- to the wall with special equipments. On average, crew members get six hours of sleep a night; (22) ---- , since there is zero gravity, they feel drowsy and tired al the time. Many suffer (23) ---- sleep disorders. These are made worse by the fact the ISS experiences 16 sunrises and sunsets every 24 hours. This frequent switching between day and night (24) the production of the hormone melatonin, which regulates our sleep cycle. Another cause of sleep deprivation (25) ---- this are solar lightning strikes, which the astronauts can still see with their eyes closed.',
        'options': ['instead of', 'along with', 'according to', 'because of', 'thanks to']
    },
    30: {
        'text': '[Cloze Test (Questions 26-30)] Polar bears are instantly recognisable for their vividly white coats. But believe it or not, they are not actually white - their fur (26) ---- no pigment at all. Each hair is transparent and hollow, and only appears white because it reflects and scatters visible light. (27) ---- this, polar bears seem to us masters of disguise, but not every animal sees them this way. While their fur reflects visible light, it absorbs ultraviolet light, (28) ----- the polar bears appear black to animals able to see UV light. (29) ----- polar bears are in captivity in mild environments; the colour of their fur may turn yellow or green, which may be because algae grow in warmer environments. (30) ----- the not-so-white fur, polar bears have black skin. As black reflects the least amount of light, and therefore heat, it is probable this helps the bears stay warm on the snow.',
        'options': ['On', 'At', 'Into', 'Under', 'With']
    },
    33: {
        'text': 'Despite their threatening and low-pitched buzzing sound, ----.',
        'options': [
            'we have to examine the constant characteristics to identify species of bumblebees',
            'bumblebees appear to thrive best in the temperate zones of the Northern Hemisphere',
            'some bumblebees nest underground, where they take over cavities like mouse tunnels',
            'one had better not go in the vicinity of their nests or massively threaten a single bumblebee',
            'bumblebees are very peaceful creatures who very seldom use their considerable stinger'
        ]
    },
    37: {
        'text': '------ , the protein content of it may not be as high as that of duckweed or insects.',
        'options': [
            'Although it makes financial sense to grow raw materials around near-shore wind farms',
            'Since a lot of seaweed farmers are thinking about installing their farms near windmills',
            'Even if some researchers believe seaweed carries the greatest feed-the-world potential',
            'As most of us already eat mostly protein-based meals about twice as much as we require',
            'Because there is enough land to farm seaweed or duckweed for our expanding population'
        ]
    },
    38: {
        'text': 'Pests are one of the biggest problems for agricultural lands, ----.',
        'options': [
            'even if we know caterpillars eat many vital food crops like rice',
            'so that they can destroy a farmer’s entire crop in a single night',
            'but natural predators can stop them from causing a total disaster',
            'unless they ruin crops that are worth billions of dollars annually',
            'although identifying crops that are more resistant to pests is essential'
        ]
    },
    41: {
        'text': '------ , many humans find rats frightening and revolting.',
        'options': [
            "Because the ancestor of New York's rats lived in northern China",
            'Despite the fact that rodents are seen as carriers of contagious and fatal diseases',
            'Until cities radically change how they deal with their household waste',
            'Even though rats and people have occupied shared living spaces for long',
            'Just as the populations of native rats have been reduced intentionally in New Zealand'
        ]
    },
    49: {
        'text': 'Modern kozmoloji, Hubble Uzay Teleskopu gibi teçhizatları kullanarak evrenin düzenini tanımlama girişimidir.',
        'options': [
            'Modern cosmology is an attempt to describe the order of the universe by using such instruments as the Hubble Space Telescope.',
            'Modern cosmology that uses instruments like the Hubble Space Telescope attempts to identify the order of the universe.',
            'With an attempt to describe the order of the universe, modem cosmology makes use of instruments such as the Hubble Space Telescope.',
            'Using instruments like the Hubble Space Telescope, modem cosmology attempts to describe the order in the universe.',
            'Modern cosmology is an area in which an attempt is made to describe the order of the universe by using instruments such as the Hubble Space Telescope.'
        ]
    },
    54: {
        'text': '------ The latter are quite costly and typically consist of 90% fuel, 5% hull, and only 5% payload in the shape of astronauts, satellites, and other things. The elevators, on the other hand, will be powered by solar energy and have room for much more than goods. According to a group of scientists, an elevator capsule can ferry 30 passengers to a space station some 35,000 km above Earth in 7.5 days. A trip to space could cost as much as a business-class plane-ticket very soon.',
        'options': [
            'If space elevators become a reality one day, they will be a much cheaper means of transport into space than rockets.',
            'The idea of a space elevator has existed since the late 1800s, but for almost 100 years, it seemed unrealistic.',
            'Scientists are still not sure which method is the best for building an advanced space elevator.',
            'A recent satellite experiment has eventually become the predecessor of a full scale space elevator.',
            'In theory, hundreds of kilograms are required to keep a space elevator structure stable in the orbit.'
        ]
    },
    59: {
        'text': '------ First, wind pumps are environmentally friendly. As with the atmosphere, wind turbines will not contaminate the land, they are not likely to contaminate the water either. Also, wind turbines generally do not affect the wildlife that inhabits the area. Sheep, cattle, deer, and other wildlife are not bothered by the turbines, and in fact, have been known to graze under them.',
        'options': [
            'Several types of wind pumps have been used for centuries and continue in use around the world.',
            'There are many advantages to using wind energy for pumping water.',
            'Birds have long been reported to have a tendency to collide with wind pumps.',
            'Research suggests that the impact of the wind turbines on birds does not compare to that of other things.',
            'Using fossil fuels to pump water is more costly than wind pumps.'
        ]
    },
    68: {
        'text': 'One can understand from the passage that the chimps in Zambia that had never seen stick-pounding before ----.',
        'options': [
            'successfully used sticks to open boxes before they were tested by Tennie',
            'preferred to wait for a long time before collecting sticks to mash the potatoes given',
            'had an inherent tendency to eat raw potatoes rather than the boiled ones',
            'could also display a new behaviour of mashing hard food with a stick before they sat',
            "initially struggled to use sticks to mash food before eating palm trees' hearts"
        ]
    },
    71: {
        'text': 'The passage is mainly about ----.',
        'options': [
            'the comparison of nanobionics with other fields of study',
            'nanobionics giving plants new functions',
            'alternative ways of creating ambient lighting',
            'how plants use photosynthesis to repair themselves',
            'the practicality of plants for recycling'
        ]
    },
    77: {
        'text': 'Which of the following can be inferred from the passage?',
        'options': [
            'Menthol is regarded as a safe compound, allowing its continued use as a food additive.',
            'The Egyptians developed a method for drying peppermint leaves, which affected later generations.',
            'In the 18th century, menthol used to have fewer undesirable side effects than it does today.',
            'Treating morning sickness has been the most frequent reason for the use of menthol.',
            'Europeans brought menthol to America, where it had already been used as a herbal remedy.'
        ]
    },
    80: {
        'text': 'According to the passage, corn plants ----.',
        'options': [
            'can produce grain that has a higher nutritive value as compared to wheat',
            'will help many farmers to raise livestock by feeding them with corn cobs',
            'will need a lot of sunshine to grow kernels that could be used next year',
            'can naturally grow anywhere in the world',
            'offer various benefits and uses as well as having an important nutritional value'
        ]
    }
}

def parse_exam_questions(lines, is_format_b=False):
    parsed = {}
    if is_format_b:
        text = '\n'.join(lines)
        text = re.sub(r'(\d+)\)\s*(?=\(I\))', r'Soru No: \1 \n', text)
        blocks = re.split(r'Soru\s+No\s*:\s*', text, flags=re.IGNORECASE)
        cloze_texts = {}
        for block in blocks:
            block = block.strip()
            if not block: continue
            if 'Cloze Test 1' in block:
                match = re.search(r'(Cloze Test 1.*)', block, re.DOTALL)
                if match: cloze_texts['cloze1'] = match.group(1).strip()
            if 'Cloze Test 2' in block:
                match = re.search(r'(Cloze Test 2.*)', block, re.DOTALL)
                if match: cloze_texts['cloze2'] = match.group(1).strip()
                
            m = re.match(r'^(\d+)', block)
            if m:
                num = int(m.group(1))
                opt_matches = re.findall(r'([A-E])\)\s*(.*?)(?=\s*[A-E]\)|$)', block, re.DOTALL)
                options = {letter: opt_text.replace('\n', ' ').strip() for letter, opt_text in opt_matches}
                body_match = re.search(r'^\d+\s*(.*?)(?=\s*A\))', block, re.DOTALL)
                q_text = body_match.group(1).replace('\n', ' ').strip() if body_match else ''
                
                parsed[num] = {
                    'text': clean_question_text(q_text),
                    'options': [options.get(l, '') for l in ['A', 'B', 'C', 'D', 'E']]
                }
        if 'cloze1' in cloze_texts:
            c1 = re.sub(r'Soru\s+No.*', '', cloze_texts['cloze1'], flags=re.DOTALL | re.IGNORECASE).strip()
            for i in range(21, 26):
                if i in parsed: parsed[i]['text'] = clean_question_text(c1)
        if 'cloze2' in cloze_texts:
            c2 = re.sub(r'Soru\s+No.*', '', cloze_texts['cloze2'], flags=re.DOTALL | re.IGNORECASE).strip()
            for i in range(26, 31):
                if i in parsed: parsed[i]['text'] = clean_question_text(c2)
    else:
        current_q = 1
        q_idx = []
        idx = 0
        while idx < len(lines) and current_q <= 80:
            line = lines[idx]
            if 'sorularda' in line.lower() or 'soruları' in line.lower() or 'cevaplayınız' in line.lower() or 'bulunuz' in line.lower():
                idx += 1
                continue
            match = re.match(rf'^{current_q}(?:\.|\s|-|$)', line)
            if match:
                q_idx.append((current_q, idx))
                current_q += 1
            idx += 1
            
        for i in range(len(q_idx)):
            q_num, start_idx = q_idx[i]
            end_idx = q_idx[i+1][1] if i+1 < len(q_idx) else len(lines)
            segment = lines[start_idx:end_idx]
            
            options = ['', '', '', '', '']
            letters = ['A', 'B', 'C', 'D', 'E']
            
            has_letters_first = any(re.match(r'^[A-E]\)\s*\S+', line) for line in segment)
            
            q_num_idx = -1
            for idx_line, line in enumerate(segment):
                if re.match(rf'^{q_num}(?:\.|\s|-|$)', line):
                    q_num_idx = idx_line
                    break

            if has_letters_first:
                current_letter = None
                current_accum = []
                for line in segment:
                    m_opt = re.match(r'^([A-E])\)(.*)', line)
                    if m_opt:
                        if current_letter:
                            options[letters.index(current_letter)] = ' '.join(current_accum).strip()
                        current_letter = m_opt.group(1)
                        current_accum = [m_opt.group(2)]
                    elif current_letter:
                        current_accum.append(line)
                if current_letter:
                    options[letters.index(current_letter)] = ' '.join(current_accum).strip()
                
                body_lines = []
                for line in segment:
                    if re.match(r'^[A-E]\)', line):
                        break
                    body_lines.append(line)
                q_text = ' '.join(body_lines[1:]) if len(body_lines) > 1 else ''
            else:
                current_letter_idx = 0
                opt_accum = []
                if q_num_idx != -1:
                    for line in segment[q_num_idx + 1:]:
                        if current_letter_idx < 5 and line == f'{letters[current_letter_idx]})':
                            options[current_letter_idx] = ' '.join(opt_accum).strip()
                            opt_accum = []
                            current_letter_idx += 1
                        else:
                            opt_accum.append(line)
                q_text = ''
                
            parsed[q_num] = {
                'text': clean_question_text(q_text),
                'options': options,
                'q_num_idx': q_num_idx,
                'segment': segment
            }
            
        # Reconstruct texts for Layout A questions (which span across segments)
        for q_num in sorted(parsed.keys()):
            seg = parsed[q_num]['segment']
            has_letters_first = any(re.match(r'^[A-E]\)\s*\S+', line) for line in seg)
            if not has_letters_first:
                if q_num == 1:
                    q_idx_in_seg = parsed[1]['q_num_idx']
                    parsed[1]['text'] = clean_question_text(' '.join(seg[:q_idx_in_seg]))
                
                next_q = q_num + 1
                if next_q in parsed:
                    next_seg = parsed[next_q]['segment']
                    has_letters_first_next = any(re.match(r'^[A-E]\)\s*\S+', line) for line in next_seg)
                    if not has_letters_first_next:
                        curr_seg = parsed[q_num]['segment']
                        e_idx = -1
                        for idx_line, line in enumerate(curr_seg):
                            if line == 'E)':
                                e_idx = idx_line
                                break
                        text_parts = []
                        if e_idx != -1:
                            text_parts.extend(curr_seg[e_idx+1:])
                        next_q_idx = parsed[next_q]['q_num_idx']
                        text_parts.extend(next_seg[:next_q_idx])
                        parsed[next_q]['text'] = clean_question_text(' '.join(text_parts))

        # Post-process Cloze tests
        # Cloze 1: 21-25
        cloze_1_text = ''
        if 21 in parsed: cloze_1_text = parsed[21]['text']
        for i in range(21, 26):
            if i in parsed and (not parsed[i]['text'] or parsed[i]['text'] == '') and cloze_1_text:
                parsed[i]['text'] = '[Cloze Test (Questions 21-25)] ' + cloze_1_text
                
        # Cloze 2: 26-30
        cloze_2_text = ''
        if 26 in parsed: cloze_2_text = parsed[26]['text']
        for i in range(26, 31):
            if i in parsed and (not parsed[i]['text'] or parsed[i]['text'] == '') and cloze_2_text:
                parsed[i]['text'] = '[Cloze Test (Questions 26-30)] ' + cloze_2_text
                
    return parsed

# Process each exam in exams_db.json
for exam in exams_db:
    eid = exam['id']
    print(f"\nProcessing exam: {exam['name']} ({eid})...")
    
    if eid in ['2024-subat', '2025-subat', '2025-temmuz', '2026-mart']:
        # Retrieve from all_exams_questions.json
        if eid in all_qs_dict:
            src_questions = all_qs_dict[eid]['questions']
            exam['questions'] = []
            for sq in src_questions:
                exam['questions'].append({
                    'number': sq['number'],
                    'text': sq['text'],
                    'options': sq['options']
                })
            print(f"  Copied {len(exam['questions'])} questions from all_exams_questions.json")
        else:
            print(f"  Warning: {eid} not found in all_exams_questions.json!")
    else:
        # Older exams: parse them from the PDF
        col = True
        is_b = False
        if eid == '2018-ilkbahar':
            start, end = 1, 20
        elif eid == '2018-yaz':
            start, end = 22, 40
        elif eid == '2019-ilkbahar':
            start, end = 42, 60
        elif eid == '2019-sonbahar':
            start, end = 62, 124
            col = False
            is_b = True
        elif eid == '2021-subat':
            start, end = 126, 149
            
        lines = get_exam_text(start, end, col)
        parsed = parse_exam_questions(lines, is_b)
        
        # Merge with fallbacks
        exam['questions'] = []
        for i in range(1, 81):
            text = ''
            options = ['', '', '', '', '']
            
            # 1. Start with parsed values for text
            if i in parsed:
                text = parsed[i]['text']
                options = parsed[i]['options']
                
            # 2. Prefer clean options from all_exams_questions.json if they exist and are valid
            if eid in all_qs_dict:
                all_q_exam = all_qs_dict[eid]
                all_q_item = all_q_exam['questions'][i-1]
                all_q_opts = all_q_item.get('options', [])
                if all_q_opts and len(all_q_opts) == 5 and all(o and o.strip() != '' for o in all_q_opts) and not any('Seçenek' in o for o in all_q_opts):
                    options = all_q_opts

            # 3. Apply 2021-subat targeted fallbacks
            if eid == '2021-subat' and i in subat_2021_fallbacks:
                text = subat_2021_fallbacks[i]['text']
                options = subat_2021_fallbacks[i]['options']
                
            # 4. Fallback to all_exams_questions.json for text if parsed text is empty or has OCR warnings
            if eid in all_qs_dict:
                all_q_exam = all_qs_dict[eid]
                all_q_item = all_q_exam['questions'][i-1]
                if not text or text.strip() == '' or 'OCR' in text:
                    if all_q_item['text'] and all_q_item['text'].strip() != '' and 'OCR' not in all_q_item['text']:
                        text = all_q_item['text']
                # Strip Turkish instructions from start of text
                text = re.sub(r'^\d+\s*-\s*\d+\.\s*sorularda.*?(bulunuz\.|bulunuz)', '', text, flags=re.IGNORECASE).strip()
                text = re.sub(r'^yerlere uygun düşen.*?(bulunuz\.|bulunuz)', '', text, flags=re.IGNORECASE).strip()
            
            # 4. Clean up any weird characters or trailing/leading spaces
            text = text.replace('\ufffd', '') # Keep standard replacement char if present
            options = [opt.strip() for opt in options]
            
            exam['questions'].append({
                'number': i,
                'text': text,
                'options': options
            })
            
        print(f"  Parsed & merged {len(exam['questions'])} questions from PDF")

# Validation step before writing
print("\nValidating results...")
valid = True
for exam in exams_db:
    eid = exam['id']
    qs = exam['questions']
    if len(qs) != 80:
        print(f"  Error: {exam['name']} has {len(qs)} questions instead of 80!")
        valid = False
    
    empty_text = []
    empty_opts = []
    for q in qs:
        # Check if text is empty or contains placeholder
        if not q['text'] or q['text'].strip() == '' or 'OCR ile çıkarılamadı' in q['text']:
            empty_text.append(q['number'])
        # Check if options are empty or have placeholders
        if not q['options'] or len(q['options']) < 5 or any(not o for o in q['options']) or any('Seçenek' in o for o in q['options']):
            empty_opts.append(q['number'])
            
    if empty_text:
        print(f"  Error: {exam['name']} has empty/placeholder text in questions: {empty_text}")
        valid = False
    if empty_opts:
        print(f"  Error: {exam['name']} has empty/placeholder options in questions: {empty_opts}")
        valid = False

if valid:
    print("\nAll checks passed successfully! Overwriting exams_db.json...")
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(exams_db, f, ensure_ascii=False, indent=2)
    print("exams_db.json has been successfully updated!")
else:
    print("\nValidation failed. Not overwriting exams_db.json.")
