import pypdf
import re
import json

reader = pypdf.PdfReader('YOKDIL FEN CIKMIS SORULAR.pdf')

# Let's inspect page 2 to see the exact text lines
text = reader.pages[1].extract_text()
print("Page 2 Text:")
print(text[:1500])
