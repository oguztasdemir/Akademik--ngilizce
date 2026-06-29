import pypdf

reader = pypdf.PdfReader('YOKDIL FEN CIKMIS SORULAR.pdf')
text = reader.pages[1].extract_text()
print(text)
