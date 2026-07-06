import json

with open('exams_db.json', 'r', encoding='utf-8') as f:
    exams = json.load(f)

with open('parsed_questions_text.json', 'r', encoding='utf-8') as f:
    parsed_questions = json.load(f)

for ex in exams:
    ex_id = ex["id"]
    if ex_id in parsed_questions:
        # Convert list of questions to dict for easy lookup and ensure we only keep questions 1-80
        q_list = parsed_questions[ex_id]
        q_dict = {q["number"]: q for q in q_list}
        
        ex["questions"] = []
        for i in range(1, 81):
            if i in q_dict:
                ex["questions"].append({
                    "number": i,
                    "text": q_dict[i]["text"],
                    "options": q_dict[i]["options"]
                })
            else:
                # Placeholder if missing from parser
                ex["questions"].append({
                    "number": i,
                    "text": "",
                    "options": ["", "", "", "", ""]
                })
        print(f"Merged {len([q for q in ex['questions'] if q['text']])} text questions for {ex['name']}")
    else:
        # Scanned exams have no text questions pre-parsed
        ex["questions"] = None
        print(f"Exam {ex['name']} has NO text questions (Scanned PDF view only)")

with open('exams_db.json', 'w', encoding='utf-8') as f:
    json.dump(exams, f, ensure_ascii=False, indent=2)
print("Updated exams_db.json with merged questions!")
