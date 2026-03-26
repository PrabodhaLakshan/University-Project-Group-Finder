import os
from typing import Dict, Any, List, Tuple

import fitz  # PyMuPDF
import numpy as np
import cv2
from PIL import Image

from utils.extractor import extract_marks_from_pdf, extract_gpa_from_pdf

TEMPLATE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "templates", "sample_template.pdf")
)

def _render_page_to_bgr(doc: fitz.Document, page_index: int = 0, zoom: float = 1.2) -> np.ndarray:
    page = doc.load_page(page_index)
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

def _crop_rel(img_bgr: np.ndarray, rel: Tuple[float, float, float, float]) -> np.ndarray:
    h, w = img_bgr.shape[:2]
    x0 = int(rel[0] * w); y0 = int(rel[1] * h)
    x1 = int(rel[2] * w); y1 = int(rel[3] * h)
    x0 = max(0, min(w - 1, x0)); x1 = max(1, min(w, x1))
    y0 = max(0, min(h - 1, y0)); y1 = max(1, min(h, y1))
    return img_bgr[y0:y1, x0:x1].copy()

def _get_text(doc: fitz.Document) -> str:
    texts = []
    for i in range(min(doc.page_count, 2)):
        texts.append(doc.load_page(i).get_text("text"))
    return "\n".join(texts)

# cache logo template crop
_logo_template_bgr = None

def _load_logo_template() -> np.ndarray:
    global _logo_template_bgr
    if _logo_template_bgr is not None:
        return _logo_template_bgr

    with fitz.open(TEMPLATE_PATH) as tdoc:
        timg = _render_page_to_bgr(tdoc, 0, zoom=1.2)
    # top-center crop area where logo exists (tune later if needed)
    _logo_template_bgr = _crop_rel(timg, (0.40, 0.02, 0.60, 0.14))
    return _logo_template_bgr

def _match_logo(user_img_bgr: np.ndarray) -> Tuple[bool, float]:
    templ = _load_logo_template()
    search = _crop_rel(user_img_bgr, (0.25, 0.00, 0.75, 0.20))  # top-center search

    if search.size == 0 or templ.size == 0:
        return False, 0.0

    sh, sw = search.shape[:2]
    th, tw = templ.shape[:2]
    if th >= sh or tw >= sw:
        return False, 0.0

    sg = cv2.cvtColor(search, cv2.COLOR_BGR2GRAY)
    tg = cv2.cvtColor(templ, cv2.COLOR_BGR2GRAY)
    res = cv2.matchTemplate(sg, tg, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(res)
    return (max_val >= 0.65), float(max_val)

def verify_pdf_against_template(pdf_bytes: bytes, template_version: str = "v1") -> Dict[str, Any]:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    if doc.page_count < 1:
        return {"verified": False, "score": 0, "reasons": ["PDF has no pages"], "extractedMarks": []}

    user_img = _render_page_to_bgr(doc, 0, zoom=1.2)
    logo_ok, logo_score = _match_logo(user_img)

    text = _get_text(doc).lower()

    required = [
        "sri lanka institute of information technology",
        "student performance profile",
        "registration",
        "full name",
        "specialization",
    ]
    found = sum(1 for r in required if r in text)

    score = 0
    reasons: List[str] = []

    score += int((found / len(required)) * 40)
    if found < len(required):
        reasons.append("Missing expected headings/anchors")

    if logo_ok:
        score += 30
    else:
        reasons.append("Logo not found in expected position")

    # table header sanity
    header_tokens = ["subject code", "subject name", "credits", "attempt", "grade"]
    header_found = sum(1 for h in header_tokens if h in text)
    score += int((header_found / len(header_tokens)) * 20)
    if header_found < 3:
        reasons.append("Table header structure looks different")

    # page count confidence
    score += 10 if doc.page_count == 1 else 0

    verified = score >= 75

    extracted = extract_marks_from_pdf(doc)
    gpa = extract_gpa_from_pdf(doc)
    doc.close()

    return {
        "verified": bool(verified),
        "score": int(score),
        "reasons": [] if verified else reasons,
        "extractedMarks": extracted,
        "gpa": gpa,
        "debug": {"logo_score": logo_score, "anchors_found": found, "header_found": header_found},
    }