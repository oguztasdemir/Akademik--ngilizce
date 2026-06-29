import pypdf
import os

pdf_files = [f for f in os.listdir('.') if f.endswith('.pdf')]

for pdf_file in pdf_files:
    print(f"\n--- PDF: {pdf_file} ---")
    reader = pypdf.PdfReader(pdf_file)
    print("Total Pages:", len(reader.pages))
    
    # Check page 2 text
    if len(reader.pages) > 1:
        text = reader.pages[1].extract_text()
        print("Page 2 Text length:", len(text))
        print("Page 2 Snippet:")
        print(repr(text[:200]))
