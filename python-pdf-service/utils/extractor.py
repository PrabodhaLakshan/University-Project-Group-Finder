import re
from typing import List, Dict, Any, Optional
import fitz  # PyMuPDF


# -------- Text helpers --------

def _get_full_text(doc: fitz.Document, max_pages: int = 2) -> str:
    texts = []
    for i in range(min(doc.page_count, max_pages)):
        page = doc.load_page(i)
        texts.append(page.get_text("text"))
    return "\n".join(texts)


def _normalize_spaces(s: str) -> str:
    return re.sub(r"[ \t]+", " ", s).strip()


# -------- Patterns --------

# Detect blocks like:
# Academic Year: 1 ... Semester: 1 ... (subject table rows) ... next Academic Year: ...
BLOCK_PAT = re.compile(
    r"(Academic\s*Year\s*:\s*(\d+).*?Semester\s*:\s*(\d+).*?)(?=Academic\s*Year\s*:|\Z)",
    re.IGNORECASE | re.DOTALL,
)

# Most common subject row style:
# IT3020  Database Systems  3  1  A
ROW_PAT_GRADE_ONLY = re.compile(
    r"\b([A-Z]{2,5}\d{3,4})\b\s+"
    r"([A-Za-z][A-Za-z0-9&(),.\-\/ ]{2,80}?)\s+"
    r"(?:\d+(?:\.\d+)?)\s+"
    r"(?:\d+)\s+"
    r"([A][+-]?|B[+-]?|C[+-]?|D[+-]?|E|F)\b"
)

# If numeric marks exist like:
# IT3020 - 85 - A
ROW_PAT_WITH_MARKS = re.compile(
    r"\b([A-Z]{2,5}\d{3,4})\b.*?"
    r"(\d{1,3})\s*.*?"
    r"\b([A][+-]?|B[+-]?|C[+-]?|D[+-]?|E|F)\b",
    re.IGNORECASE | re.DOTALL,
)

# Semester tag pattern fallback
SEM_TAG_PAT = re.compile(r"\bY\s*(\d)\s*S\s*(\d)\b", re.IGNORECASE)


def _make_sem_tag(year: Optional[str], sem: Optional[str]) -> Optional[str]:
    if year and sem:
        return f"Y{year}S{sem}"
    return None


# -------- Extraction core --------

def _extract_rows_from_text(block_text: str, semester_tag: Optional[str]) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []

    # 1) Grade-only rows (most official sheets)
    for m in ROW_PAT_GRADE_ONLY.finditer(block_text):
        code = m.group(1).strip()
        name = _normalize_spaces(m.group(2))
        grade = m.group(3).strip().upper()
        results.append({
            "moduleCode": code,
            "moduleName": name,
            "marks": None,
            "grade": grade,
            "semesterTag": semester_tag
        })

    # 2) Numeric marks rows (if your sheet has marks)
    # Only try if grade-only didn't return enough OR if you want both.
    if not results:
        for m in ROW_PAT_WITH_MARKS.finditer(block_text):
            code = m.group(1).strip()
            marks = int(m.group(2))
            grade = m.group(3).strip().upper()
            results.append({
                "moduleCode": code,
                "moduleName": "",
                "marks": marks,
                "grade": grade,
                "semesterTag": semester_tag
            })

    return results


def extract_marks_from_pdf(doc: fitz.Document) -> List[Dict[str, Any]]:
    """
    Extract marks/grades rows from a StudentPerformanceProfile-like PDF.

    Returns list of dicts:
      { moduleCode, moduleName, marks, grade, semesterTag }
    """
    text = _get_full_text(doc, max_pages=2)

    results: List[Dict[str, Any]] = []

    # 1) Block-based extraction (best accuracy)
    blocks = list(BLOCK_PAT.finditer(text))
    if blocks:
        for b in blocks:
            # b.group(2)=year, b.group(3)=semester
            year = b.group(2)
            sem = b.group(3)
            sem_tag = _make_sem_tag(year, sem)
            block_text = b.group(1)
            rows = _extract_rows_from_text(block_text, sem_tag)
            results.extend(rows)
    else:
        # 2) If no blocks found, try global semester tag once (fallback)
        sem_tag = None

        m = re.search(
            r"Academic\s*Year\s*:\s*(\d+).{0,50}Semester\s*:\s*(\d+)",
            text,
            re.IGNORECASE | re.DOTALL
        )
        if m:
            sem_tag = _make_sem_tag(m.group(1), m.group(2))

        if not sem_tag:
            m2 = SEM_TAG_PAT.search(text)
            if m2:
                sem_tag = _make_sem_tag(m2.group(1), m2.group(2))

        # Extract rows from full text
        results.extend(_extract_rows_from_text(text, sem_tag))

    # 3) Deduplicate (moduleCode + grade + semesterTag + marks)
    seen = set()
    uniq: List[Dict[str, Any]] = []
    for r in results:
        k = f"{r.get('moduleCode')}|{r.get('grade')}|{r.get('semesterTag')}|{r.get('marks')}"
        if k in seen:
            continue
        seen.add(k)
        # If semesterTag missing, return "Unknown" so frontend can group
        if not r.get("semesterTag"):
            r["semesterTag"] = "Unknown"
        uniq.append(r)

    return uniq


def extract_gpa_from_pdf(doc: fitz.Document) -> Optional[str]:
    text = _get_full_text(doc, max_pages=2)
    # Match common GPA formats like "Cumulative GPA : 3.45" or "GPA 3.4"
    m = re.search(r"(?:Cumulative\s*)?GPA\s*[:=]?\s*(\d+\.\d+)", text, re.IGNORECASE)
    if m:
        return m.group(1)
    return None