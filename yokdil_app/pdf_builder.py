"""
JSON + PDF → Düzenli Metin Tabanlı PDF Oluşturucu
==================================================
- JSON'da soru metni olan sınavlar: doğrudan JSON'dan yazar
- OCR başarısız olan sınavlar: EasyOCR ile PDF sayfalarından okur
- YOKDIL FEN CIKMIS SORULAR: ham OCR metni olarak ekler

Çıktı: pdf_output/ klasörüne metin tabanlı PDF dosyaları
"""

import sys, io, os, json, re
import fitz                         # PyMuPDF - PDF okuma
import numpy as np
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# ── Dizin ayarları ─────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
PDF_DIR    = os.path.join(BASE_DIR, "pdfs")
OUT_DIR    = os.path.join(BASE_DIR, "pdf_output")
DB_PATH    = os.path.join(BASE_DIR, "questions", "exams_db.json")

OCR_DPI         = 250
OPTION_LABELS   = ['A', 'B', 'C', 'D', 'E']
OCR_FAIL_MARKER = "OCR ile çıkarılamadı"   # placeholder tespiti

os.makedirs(OUT_DIR, exist_ok=True)

# ── ReportLab font ayarı ───────────────────────────────────────────────
# Windows'ta mevcut Unicode destekli font bul
FONT_NAME = "Helvetica"      # varsayılan (ASCII-safe)
UNICODE_FONTS = [
    ("C:/Windows/Fonts/arial.ttf",    "Arial"),
    ("C:/Windows/Fonts/calibri.ttf",  "Calibri"),
    ("C:/Windows/Fonts/tahoma.ttf",   "Tahoma"),
]
for path, name in UNICODE_FONTS:
    if os.path.exists(path):
        try:
            pdfmetrics.registerFont(TTFont(name, path))
            FONT_NAME = name
            print(f"[Font] {name} kullanılıyor.")
            break
        except Exception:
            pass

# ── Stilleri oluştur ──────────────────────────────────────────────────
def make_styles():
    styles = getSampleStyleSheet()
    base = dict(fontName=FONT_NAME, leading=14)

    title_style = ParagraphStyle(
        'ExamTitle', parent=styles['Title'],
        fontName=FONT_NAME, fontSize=16, spaceAfter=6,
        textColor=colors.HexColor('#1a237e')
    )
    q_num_style = ParagraphStyle(
        'QNum', parent=styles['Normal'],
        fontName=FONT_NAME, fontSize=11, spaceBefore=10, spaceAfter=2,
        textColor=colors.HexColor('#0d47a1'), leading=14
    )
    q_text_style = ParagraphStyle(
        'QText', parent=styles['Normal'],
        fontName=FONT_NAME, fontSize=10, spaceAfter=4, leading=15
    )
    opt_style = ParagraphStyle(
        'Opt', parent=styles['Normal'],
        fontName=FONT_NAME, fontSize=10, leftIndent=16, spaceAfter=2, leading=13
    )
    ans_style = ParagraphStyle(
        'Ans', parent=styles['Normal'],
        fontName=FONT_NAME, fontSize=10, leftIndent=16, spaceAfter=6,
        textColor=colors.HexColor('#2e7d32')
    )
    raw_style = ParagraphStyle(
        'Raw', parent=styles['Normal'],
        fontName=FONT_NAME, fontSize=9, spaceAfter=4, leading=13,
        textColor=colors.HexColor('#333333')
    )
    return title_style, q_num_style, q_text_style, opt_style, ans_style, raw_style

# ── Metni PDF için güvenli hale getir ─────────────────────────────────
def safe(text: str) -> str:
    """ReportLab için özel karakterleri temizle."""
    if not text:
        return ""
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return text

# ── EasyOCR başlatma (lazy) ────────────────────────────────────────────
_ocr_reader = None

def get_ocr_reader():
    global _ocr_reader
    if _ocr_reader is None:
        import easyocr
        print("[OCR] EasyOCR baslatiliyor...")
        _ocr_reader = easyocr.Reader(['en', 'tr'], gpu=False, verbose=False)
        print("[OCR] Hazir.")
    return _ocr_reader

# ── Tek sayfayı OCR ile oku ────────────────────────────────────────────
def ocr_page(page) -> str:
    reader = get_ocr_reader()
    pix = page.get_pixmap(dpi=OCR_DPI)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    results = reader.readtext(np.array(img), detail=0, paragraph=True)
    return "\n".join(results)

# ── JSON exam → PDF flowables ─────────────────────────────────────────
def exam_to_flowables(exam: dict, styles):
    title_st, q_num_st, q_text_st, opt_st, ans_st, raw_st = styles
    flowables = []

    name = exam.get('name', exam.get('id', ''))
    flowables.append(Paragraph(safe(name), title_st))
    flowables.append(HRFlowable(width="100%", thickness=1,
                                color=colors.HexColor('#1a237e'), spaceAfter=10))

    questions = exam.get('questions', [])
    answers   = exam.get('answers', [])

    for i, q in enumerate(questions):
        num  = q.get('number', i + 1)
        text = q.get('text', '').strip()
        opts = q.get('options', [])
        ans  = answers[i] if i < len(answers) else '?'

        flowables.append(Paragraph(f"<b>Soru {num}.</b>", q_num_st))

        if OCR_FAIL_MARKER in text:
            flowables.append(Paragraph(
                "<i>[Soru metni mevcut değil - PDF görsel tabanlı]</i>", q_text_st))
        else:
            flowables.append(Paragraph(safe(text), q_text_st))

        for j, opt in enumerate(opts):
            label = OPTION_LABELS[j] if j < len(OPTION_LABELS) else str(j)
            flowables.append(Paragraph(f"{label}) {safe(opt)}", opt_st))

        flowables.append(Paragraph(f"<b>Cevap: {ans}</b>", ans_st))
        flowables.append(HRFlowable(width="80%", thickness=0.3,
                                    color=colors.lightgrey, spaceAfter=4))

    return flowables

# ── Ham OCR metni → PDF flowables ─────────────────────────────────────
def raw_ocr_to_flowables(pdf_path: str, styles):
    title_st, _, _, _, _, raw_st = styles
    flowables = []

    pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]
    flowables.append(Paragraph(safe(pdf_name), title_st))
    flowables.append(HRFlowable(width="100%", thickness=1,
                                color=colors.HexColor('#1a237e'), spaceAfter=10))

    doc = fitz.open(pdf_path)
    total = len(doc)
    for i, page in enumerate(doc, 1):
        print(f"\r  Sayfa {i}/{total}...", end="", flush=True)

        text = page.get_text("text").strip()
        if len(text) < 150:
            text = ocr_page(page)

        flowables.append(Paragraph(f"<b>--- Sayfa {i} ---</b>", raw_st))
        for line in text.split('\n'):
            line = line.strip()
            if line:
                flowables.append(Paragraph(safe(line), raw_st))
        flowables.append(Spacer(1, 6))

    doc.close()
    print()
    return flowables

# ── Ana işlem ─────────────────────────────────────────────────────────
def build_pdf(flowables, out_path):
    doc = SimpleDocTemplate(
        out_path,
        pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm,
    )
    doc.build(flowables)

def main():
    styles = make_styles()

    with open(DB_PATH, encoding='utf-8') as f:
        db = json.load(f)

    # Sınavları ID'ye göre indexle
    db_by_id = {e['id']: e for e in db}

    # PDF → exam_id eşleştirmesi
    pdf_to_id = {
        "2024 Subat YOKDIL - Fen Bilimleri.pdf":   "2024-subat",
        "2025 Subat YOKDIL - Fen Bilimleri.pdf":   "2025-subat",
        "2025 Temmuz YOKDIL - Fen Bilimleri.pdf":  "2025-temmuz",
        "2026 Mart YOKDIL - Fen Bilimleri.pdf":    "2026-mart",
    }

    pdf_files = sorted([f for f in os.listdir(PDF_DIR) if f.lower().endswith('.pdf')])

    for pdf_name in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_name)
        out_name = os.path.splitext(pdf_name)[0] + "_metin.pdf"
        out_path = os.path.join(OUT_DIR, out_name)

        print(f"\n[{pdf_name}]")

        exam_id = pdf_to_id.get(pdf_name)
        if exam_id and exam_id in db_by_id:
            exam = db_by_id[exam_id]
            # Soru metni var mı kontrol et
            qs = exam.get('questions', [])
            has_text = qs and OCR_FAIL_MARKER not in qs[0].get('text', '')

            if has_text:
                print(f"  JSON'dan okunuyor ({len(qs)} soru)...")
                flowables = exam_to_flowables(exam, styles)
            else:
                print(f"  JSON metni yok, OCR + cevap anahtari birlestirilecek...")
                # Ham OCR al, cevapları ekle
                flowables = raw_ocr_to_flowables(pdf_path, styles)
                # Cevap anahtarı ekle
                answers = exam.get('answers', [])
                if answers:
                    flowables.append(PageBreak())
                    flowables.append(Paragraph("<b>CEVAP ANAHTARI</b>", styles[0]))
                    ans_text = "  ".join(
                        [f"{i+1}.{a}" for i, a in enumerate(answers)]
                    )
                    flowables.append(Paragraph(safe(ans_text), styles[5]))
        else:
            # YOKDIL FEN CIKMIS SORULAR gibi - sadece OCR
            print(f"  Ham OCR modunda islenecek...")
            flowables = raw_ocr_to_flowables(pdf_path, styles)

        print(f"  PDF yaziliyor: {out_path}")
        build_pdf(flowables, out_path)
        size_kb = os.path.getsize(out_path) // 1024
        print(f"  Tamamlandi: {size_kb} KB")

    print("\n" + "="*60)
    print(f"BITTI. {len(pdf_files)} dosya --> {OUT_DIR}")

if __name__ == "__main__":
    main()
