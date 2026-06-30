import json
import os

books = []
categories = ["fen", "sosyal", "saglik"]

topics = {
    "fen": [
        ("Astrophysics", "stellar evolution", "yıldız evrimi", "astronomy"),
        ("Thermodynamics", "heat transfer", "ısı transferi", "physics"),
        ("Quantum Mechanics", "subatomic particles", "atom altı parçacıklar", "physics"),
        ("Organic Chemistry", "carbon compounds", "karbon bileşikleri", "chemistry"),
        ("Genetics", "DNA replication", "DNA replikasyonu", "biology"),
        ("Ecology", "biodiversity loss", "biyoçeşitlilik kaybı", "biology"),
        ("Geology", "plate tectonics", "levha tektoniği", "earth science"),
        ("Meteorology", "atmospheric pressure", "atmosferik basınç", "climatology"),
        ("Oceanography", "marine ecosystems", "deniz ekosistemleri", "marine biology"),
        ("Nanotechnology", "molecular engineering", "moleküler mühendislik", "applied science"),
    ],
    "sosyal": [
        ("Macroeconomics", "inflation rates", "enflasyon oranları", "economics"),
        ("Sociology", "social stratification", "sosyal tabakalaşma", "social sciences"),
        ("Archaeology", "ancient civilizations", "antik uygarlıklar", "history"),
        ("Political Science", "democratic institutions", "demokratik kurumlar", "politics"),
        ("Philosophy", "epistemological doubt", "epistemolojik şüphe", "philosophy"),
        ("Linguistics", "syntactic structures", "sentaktik yapılar", "linguistics"),
        ("Psychology", "cognitive behavior", "bilişsel davranış", "psychology"),
        ("Anthropology", "cultural adaptation", "kültürel adaptasyon", "anthropology"),
        ("History", "industrial development", "endüstriyel gelişim", "history"),
        ("Human Geography", "urbanization trends", "şehirleşme eğilimleri", "geography")
    ],
    "saglik": [
        ("Cardiology", "cardiovascular health", "kardiyovasküler sağlık", "medicine"),
        ("Neurology", "synaptic plasticity", "sinaptik plastisite", "neuroscience"),
        ("Immunology", "antibody production", "antikor üretimi", "medicine"),
        ("Oncology", "cellular mutation", "hücresel mutasyon", "medicine"),
        ("Endocrinology", "hormonal regulation", "hormonal düzenleme", "medicine"),
        ("Virology", "viral replication", "viral replikasyon", "biology"),
        ("Pharmacology", "drug efficacy", "ilaç etkinliği", "medicine"),
        ("Epidemiology", "disease transmission", "hastalık bulaşması", "public health"),
        ("Pediatrics", "childhood development", "çocukluk gelişimi", "medicine"),
        ("Genomics", "gene therapy", "gen terapisi", "biotechnology")
    ]
}

colors = {
    "fen": "#064e3b",
    "sosyal": "#7c2d12",
    "saglik": "#1e3a8a"
}

book_id = 1
for i in range(102):
    cat = categories[i % 3]
    topic_list = topics[cat]
    topic_data = topic_list[(i // 3) % len(topic_list)]
    
    title = f"Introduction to {topic_data[0]} (Volume {i // 3 + 1})"
    author = f"Prof. Dr. Academic Author {book_id}"
    desc = f"An academic study focusing on {topic_data[1]} and its implications in modern scientific research."
    
    en_para = (
        f"The study of {topic_data[0]} provides significant insights into {topic_data[1]}. "
        f"Researchers evaluate these phenomena to discover new principles that reveal the fundamental nature of the discipline. "
        f"Although early experiments faced technical limitations, recent advancements have established a robust framework. "
        f"Because of this progress, we can determine the exact consequence of minor fluctuations. "
        f"This influence has a substantial effect, and therefore, scientists must continue to develop new methods. "
        f"Despite various challenges, the results provide solid evidence to influence future paradigms."
    )
    
    tr_para = (
        f"{topic_data[0]} çalışması, {topic_data[2]} hakkında önemli bilgiler sunmaktadır. "
        f"Araştırmacılar, disiplinin temel doğasını ortaya çıkaran yeni ilkeleri keşfetmek için bu olguları değerlendirirler. "
        f"İlk deneyler teknik sınırlamalarla karşılaşmış olsa da, son gelişmeler sağlam bir çerçeve oluşturmuştur. "
        f"Bu ilerleme sayesinde, küçük dalgalanmaların kesin sonucunu belirleyebiliriz. "
        f"Bu etki önemli bir sonuca sahiptir ve bu nedenle bilim insanları yeni yöntemler geliştirmeye devam etmelidir. "
        f"Çeşitli zorluklara rağmen, sonuçlar gelecekteki paradigmaları etkilemek için sağlam kanıtlar sağlamaktadır."
    )
    
    books.append({
        "id": f"book_{book_id}",
        "title": title,
        "author": author,
        "category": cat,
        "coverColor": colors[cat],
        "description": desc,
        "chapters": [
          {
            "title": "Chapter 1: Foundational Principles",
            "pages": [en_para],
            "turkishPages": [tr_para]
          }
        ]
    })
    book_id += 1

output_dir = os.path.join("questions", "genel")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "reading_books.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(books, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(books)} books at {output_path}!")
