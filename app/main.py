from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import shutil
from pathlib import Path
from uuid import uuid4
import traceback

import boto3

from .models import Resume, MatchRequest
from .services.parser import parse_resume_file


# -----------------------------
# AWS SETUP
# -----------------------------
s3 = boto3.client("s3")
BUCKET_NAME = "resume-storage-dks"

dynamodb = boto3.resource("dynamodb", region_name="eu-north-1")
table = dynamodb.Table("resumes")

bedrock = boto3.client("bedrock-runtime", region_name="eu-north-1")


# -----------------------------
# FASTAPI INIT
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}


# -----------------------------
# SCORE LOGIC
# -----------------------------
def calculate_score(resume):
    skills = resume.skills or []
    exp = resume.total_experience or 0
    edu = resume.education or []

    return min(int(len(skills) * 5 + exp * 10 + len(edu) * 5), 100)


# -----------------------------
# LIGHTWEIGHT ML SIMILARITY
# -----------------------------
def similarity_score(left_skills, right_skills):
    left = set(left_skills or [])
    right = set(right_skills or [])

    if not left and not right:
        return 0

    return int((len(left & right) / max(len(left | right), 1)) * 100)


# -----------------------------
# BEDROCK MATCH FUNCTION
# -----------------------------
def simple_match(job_text: str, resume_text: str):
    job_words = set(job_text.lower().split())
    resume_words = set(resume_text.lower().split())

    if not job_words:
        return {
            "score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "resume_quality_score": 0,
            "summary": "No job description provided"
        }

    matched = job_words & resume_words
    missing = job_words - resume_words

    score = int((len(matched) / len(job_words)) * 100)

    return {
        "score": score,
        "matched_skills": list(matched),
        "missing_skills": list(missing),
        "resume_quality_score": score,
        "summary": f"{score}% match based on keyword similarity"
    }


# -----------------------------
# UPLOAD RESUME
# -----------------------------
@app.post("/api/resumes/upload")
async def upload_resume(file: UploadFile = File(...)):

    if not file.filename.lower().endswith((".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Invalid file type")

    tmp_dir = Path("tmp_resumes")
    tmp_dir.mkdir(exist_ok=True)

    tmp_path = tmp_dir / f"{uuid4()}_{file.filename}"

    try:
        # 1️⃣ SAVE TEMP FILE
        with tmp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 2️⃣ PARSE FILE
        resume, _ = parse_resume_file(tmp_path)

        # 3️⃣ UPLOAD TO S3
        s3.upload_file(str(tmp_path), BUCKET_NAME, file.filename)

        # 4️⃣ SCORE
        score = calculate_score(resume)

        # 5️⃣ STORE IN DYNAMODB
        table.put_item(Item={
            "id": resume.id,
            "name": resume.name,
            "email": resume.email,
            "phone": resume.phone,
            "skills": resume.skills,
            "education": resume.education,
            "experience": resume.total_experience,
            "raw_text": resume.raw_text,
            "score": score
        })

        # 6️⃣ DELETE TEMP FILE
        tmp_path.unlink(missing_ok=True)

        # ✅ RETURN FULL DATA (IMPORTANT FOR FRONTEND)
        return {
           "resume": {
               "id": resume.id,
	       "name": resume.name,
               "email": resume.email,
               "phone": resume.phone,
               "skills": resume.skills,
               "education": resume.education,
               "experience": resume.total_experience,
	       "raw_text": resume.raw_text
    	   },
    	   "confidence": {
               "skills": "high",
               "ocr_used": False
    	   }
	}
    except Exception as e:
       traceback.print_exc()
       raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# GET RESUMES
# -----------------------------
@app.get("/api/resumes")
async def get_resumes():
    return table.scan().get("Items", [])


# -----------------------------
# DELETE RESUME
# -----------------------------
@app.delete("/api/resumes/{resume_id}")
async def delete_resume(resume_id: str):
    table.delete_item(Key={"id": resume_id})
    return {"message": "Deleted"}


# -----------------------------
# COMPARE RESUMES
# -----------------------------
@app.get("/api/resumes/compare")
async def compare_resumes(left_id: str, right_id: str):

    left = table.get_item(Key={"id": left_id}).get("Item")
    right = table.get_item(Key={"id": right_id}).get("Item")

    if not left or not right:
        raise HTTPException(status_code=404, detail="Resume not found")

    left_skills = set(left.get("skills") or [])
    right_skills = set(right.get("skills") or [])

    return {
        "left_name": left.get("name"),
        "right_name": right.get("name"),
        "common_skills": list(left_skills & right_skills),
        "left_only": list(left_skills - right_skills),
        "right_only": list(right_skills - left_skills),
        "experience_diff": (left.get("experience") or 0) - (right.get("experience") or 0),
        "similarity_score": similarity_score(left_skills, right_skills),
        "left_score": left.get("score", 0),
        "right_score": right.get("score", 0)
    }


# -----------------------------
# MATCH JOB (AI)
# -----------------------------
@app.post("/api/jobs/match")
async def match_job(request: MatchRequest):

    items = table.scan().get("Items", [])
    results = []

    for item in items:
        ai = simple_match(
            request.job,
            item.get("raw_text", "")
        )

        results.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "score": ai.get("score"),
            "quality": ai.get("resume_quality_score"),
            "matched_skills": ai.get("matched_skills"),
            "missing_skills": ai.get("missing_skills"),
            "summary": ai.get("summary")
        })

    return results
