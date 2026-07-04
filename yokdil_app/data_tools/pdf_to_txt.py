import sys
import io
# Windows terminali UTF-8 olarak zorla
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
else:
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

"""
PDF → TXT Dönüştürücü
=====================
pdfs/ klasöründeki tüm PDF dosyalarını txt/ klasörüne dönüştürür.

Yöntem:
  1. PyMuPDF (fitz) ile sayfa sayfa metin çıkarma (taranmış değilse hızlı)
  2. Eğer sayfa metin içermiyorsa EasyOCR ile görüntü tabanlı OCR

Çıktı: txt/<pdf_adı>.txt
"""

import os
import fitz  # PyMuPDF
import numpy as np

# EasyOCR opsiyonel - taranmış PDF'ler için
try:
    import easyocr
    from PIL import Image
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False
    print("[UYARI] easyocr veya PIL bulunamadı. OCR desteği devre dışı.")

PDF_DIR = os.path.join(os.path.dirname(__file__), "pdfs")
TXT_DIR = os.path.join(os.path.dirname(__file__), "txt")

OCR_DPI = 250          # Daha yüksek = daha iyi kalite ama yavaş
MIN_TEXT_LEN = 200     # Bu kadar karakterden azsa sayfayı OCR'a gönder (taranmış PDF'ler için yüksek tutuldu)


def init_ocr_reader():
    if not EASYOCR_AVAILABLE:
        return None
    print("[OCR] EasyOCR baslatiliyor (ilk seferde yavas olabilir)...")
    reader = easyocr.Reader(['en', 'tr'], gpu=False, verbose=False)
    print("[OCR] EasyOCR hazir.")
    return reader


def extract_page_text_direct(page) -> str:
    """PyMuPDF ile doğrudan metin çıkar."""
    return page.get_text("text").strip()


def extract_page_text_ocr(page, ocr_reader) -> str:
    """Sayfayı görüntüye çevirip EasyOCR ile oku."""
    if ocr_reader is None:
        return ""
    pix = page.get_pixmap(dpi=OCR_DPI)
    img_bytes = pix.tobytes("png")
    img = Image.open(__import__("io").BytesIO(img_bytes))
    img_np = np.array(img)
    results = ocr_reader.readtext(img_np, detail=0, paragraph=True)
    return "\n".join(results)


def pdf_to_txt(pdf_path: str, out_path: str, ocr_reader):
    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    all_text = []
    ocr_pages = 0

    for i, page in enumerate(doc, start=1):
        sys.stdout.write(f"\r  Sayfa {i}/{total_pages} işleniyor...   ")
        sys.stdout.flush()

        text = extract_page_text_direct(page)

        if len(text) < MIN_TEXT_LEN:
            # Taranmış sayfa → OCR
            text = extract_page_text_ocr(page, ocr_reader)
            if text:
                ocr_pages += 1

        all_text.append(f"--- SAYFA {i} ---\n{text}")

    doc.close()
    print()  # satır sonu

    full_text = "\n\n".join(all_text)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_text)

    return total_pages, ocr_pages


def main():
    os.makedirs(TXT_DIR, exist_ok=True)

    pdf_files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")]
    if not pdf_files:
        print("pdfs/ klasöründe PDF bulunamadı.")
        return

    print(f"Toplam {len(pdf_files)} PDF bulundu:\n")
    for f in pdf_files:
        print(f"  - {f}")
    print()

    # OCR reader'ı bir kez başlat (tüm PDF'ler için paylaş)
    ocr_reader = init_ocr_reader() if EASYOCR_AVAILABLE else None

    results = []
    for pdf_name in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_name)
        txt_name = os.path.splitext(pdf_name)[0] + ".txt"
        out_path = os.path.join(TXT_DIR, txt_name)

        print(f"[{pdf_name}] donusturuluyor -> {txt_name}")
        try:
            total, ocr_count = pdf_to_txt(pdf_path, out_path, ocr_reader)
            size_kb = os.path.getsize(out_path) // 1024
            results.append((pdf_name, True, total, ocr_count, size_kb))
            print(f"  ✓ Tamamlandı: {total} sayfa ({ocr_count} OCR), çıktı: {size_kb} KB\n")
        except Exception as e:
            results.append((pdf_name, False, 0, 0, 0))
            print(f"  ✗ HATA: {e}\n")

    print("=" * 60)
    print("ÖZET:")
    for name, ok, pages, ocr_p, kb in results:
        status = "✓" if ok else "✗"
        print(f"  {status} {name}")
        if ok:
            print(f"      {pages} sayfa | {ocr_p} OCR sayfa | {kb} KB")
    print(f"\nTXT dosyaları: {TXT_DIR}")


if __name__ == "__main__":
    main()
