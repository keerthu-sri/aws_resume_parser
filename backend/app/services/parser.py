from pathlib import Path
import re
import uuid
from typing import List
from datetime import datetime
from io import BytesIO
from docx import Document
import pdfplumber
import pytesseract
from pdf2image import convert_from_path

from ..models import Resume

# ================= CONFIG =================



# ================= REGEX =================

EMAIL_REGEX = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
PHONE_REGEX = re.compile(r"\+?\d[\d\s\-()]{9,}")

# ================= SKILLS =================

KNOWN_SKILLS = {
    "python", "java", "c++", "javascript", "node", "node.js", "react",
    "sql", "mysql", "postgresql", "mongodb",
    "machine learning", "deep learning", "data science",
    "pandas", "numpy", "tensorflow", "pytorch", "scikit-learn",
    "html", "css", "django", "fastapi", "flask",
    "firebase", "excel", "powerpoint", "word",
}

BLOCKED_SKILLS = {
    "english", "tamil", "hindi",
    "intern", "member", "president",
    "work experience", "soft skills",
}

# =================================================
# TEXT EXTRACTION
# =================================================

def extract_text_from_pdf(file_path: Path) -> str:
    text = []
    with pdfplumber.open(str(file_path)) as pdf:
        for page in pdf.pages:
            text.append(page.extract_text() or "")
    return "\n".join(text)

def extract_text_with_ocr(file_path: Path) -> str:
    images = convert_from_path(str(file_path))
    return "\n".join(pytesseract.image_to_string(img) for img in images)

def extract_text_from_docx(file_path: Path) -> str:
    with file_path.open("rb") as f:
        data = f.read()
    doc = Document(BytesIO(data))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs)

# =================================================
# BASIC FIELDS
# =================================================

def find_email(text: str) -> str | None:
    m = EMAIL_REGEX.search(text)
    return m.group(0) if m else None

def find_phone(text: str) -> str | None:
    for m in PHONE_REGEX.finditer(text):
        digits = "".join(c for c in m.group(0) if c.isdigit())
        if len(digits) >= 10:
            return m.group(0)
    return None

# =================================================
# NAME (simpler & more forgiving)
# =================================================

def find_name(lines: List[str]) -> str | None:
    BLOCK_WORDS = {
        "SCHOOL", "COLLEGE", "UNIVERSITY", "INSTITUTE",
        "HIGHER", "SECONDARY", "MATHEMATICS",
        "ENGINEERING", "TECHNOLOGY",
        "EDUCATION", "SKILLS", "PROFILE",
        "EXPERIENCE", "PROJECTS", "CERTIFICATIONS", "IST",
        "CAREER", "OBJECTIVE", "PROFESSIONAL"
    }

    for line in lines[:20]:
        clean = line.strip()
        if not clean:
            continue
        if EMAIL_REGEX.search(clean) or PHONE_REGEX.search(clean):
            continue

        # remove bullets and extra symbols
        clean_no_bullet = re.sub(r"^[•\-–\u2022]\s*", "", clean)

        # split into words, keep only alphabetic chars for checks
        raw_words = clean_no_bullet.split()
        words = [re.sub(r"[^A-Za-z]", "", w) for w in raw_words]
        words = [w for w in words if w]

        if not (2 <= len(words) <= 4):
            continue

        # reject obvious section headers
        if any(w.upper() in BLOCK_WORDS for w in words):
            continue

        # basic sanity: no super long tokens
        if any(len(w) > 20 for w in words):
            continue

        # looks good → treat as name
        return " ".join(w.capitalize() for w in words)

    return None

# =================================================
# SKILLS
# =================================================

def find_skills(text: str) -> List[str]:
    lower = text.lower()
    found = set()
    for skill in KNOWN_SKILLS:
        if skill in lower:
            found.add(skill.title())
    return sorted(s for s in found if s.lower() not in BLOCKED_SKILLS)

# =================================================
# EDUCATION (looser but reliable)
# =================================================

def find_education(lines: List[str]) -> List[str]:
    edu: List[str] = []

    DEGREE_KEYWORDS = {
        "BACHELOR", "MASTER", "B.TECH", "M.TECH",
        "B.E", "M.E", "B.COM", "M.COM",
        "ENGINEERING", "SCIENCE",
    }

    INSTITUTE_KEYWORDS = {
        "UNIVERSITY", "COLLEGE", "INSTITUTE", "SRM", "IST",
    }

    BLOCK_WORDS = {
        "WORK", "EXPERIENCE", "PRESIDENT", "MEMBER",
        "CLUB", "INTERN", "ROLE", "RESPONSIBILITIES",
        "PROJECTS", "SKILLS",
    }

    in_edu_section = False

    for line in lines:
        clean = line.strip()
        if not clean:
            continue

        upper = clean.upper()

        # detect we entered the Education section
        if "EDUCATION" in upper:
            in_edu_section = True
            continue

        if not in_edu_section:
            continue

        # stop when we hit next section
        if any(h in upper for h in ["PROJECTS", "ACHIEVEMENTS", "EXPERIENCE", "SKILLS"]):
            break

        if any(b in upper for b in BLOCK_WORDS):
            continue

        has_degree = any(d in upper for d in DEGREE_KEYWORDS)
        has_institute = any(i in upper for i in INSTITUTE_KEYWORDS)
        has_year = re.search(r"\b(19|20)\d{2}\b", upper)

        # if a line looks like degree or institute/year, keep it
        if has_degree or has_institute or has_year:
            edu.append(clean)

    return edu[:2]


# =================================================
# EXPERIENCE
# =================================================

def find_total_experience(text: str) -> float | None:
    m = re.search(r"(20\d{2}).*(present|till date)", text.lower())
    if not m:
        return None
    return round(datetime.now().year - int(m.group(1)), 1)

# =================================================
# MAIN PARSER
# =================================================

def parse_resume_file(file_path: Path) -> tuple[Resume, bool]:
    suffix = file_path.suffix.lower()

    if suffix == ".pdf":
        raw_text = extract_text_from_pdf(file_path)
        ocr_used = False

        if len(raw_text.strip()) < 150:
            ocr_text = extract_text_with_ocr(file_path)
            if ocr_text.strip():
                raw_text = ocr_text
                ocr_used = True

    elif suffix in {".docx", ".doc"}:
        raw_text = extract_text_from_docx(file_path)
        ocr_used = False
    else:
        raise ValueError(f"Unsupported file type: {suffix}")

    lines = raw_text.splitlines()

    resume = Resume(
        id=str(uuid.uuid4()),
        name=find_name(lines),
        email=find_email(raw_text),
        phone=find_phone(raw_text),
        skills=find_skills(raw_text),
        education=find_education(lines),
        total_experience=find_total_experience(raw_text),
        raw_text=raw_text,
        num_projects=0,
        num_certifications=0,
        top_achievement=None,
    )

    return resume, ocr_used
