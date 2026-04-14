#Import BaseModel
from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import List, Optional
from sqlalchemy import Column, JSON

class Resume(SQLModel, table=True):
    id: str = Field(primary_key=True)
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    skills: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )

    education: List[str] = Field(
        default_factory=list,
        sa_column=Column(JSON)
    )
    
    total_experience: Optional[float] = None
    raw_text: Optional[str] = None
    manually_corrected: bool = False

class ResumeResponse(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    skills: List[str]
    total_experience: Optional[float]
    education: List[str]
    raw_text: Optional[str]

    class Config:
        from_attributes = True


#Response after upload
class UploadResponse(BaseModel):
    message: str
    resume: ResumeResponse
    confidence: dict

#Job description input
class JobDescription(BaseModel):
    title: Optional[str] = None
    description: str

#Matching request
class MatchRequest(BaseModel):
    job: str
    resume_ids: Optional[List[str]] = None
    
class MatchResult(BaseModel):
    resume_id: str
    candidate_name: Optional[str] = None
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    extra_skills: List[str]
    
class ResumeUpdateRequest(BaseModel):
    name: Optional[str] = None
    skills: Optional[List[str]] = None
    total_experience: Optional[float] = None
    education: Optional[List[str]] = None

class ResumeComparisonResult(BaseModel):
    left_resume_id: str
    right_resume_id: str

    # ✅ New (human-friendly)
    left_candidate_name: Optional[str] = None
    right_candidate_name: Optional[str] = None

    common_skills: List[str]
    left_only_skills: List[str]
    right_only_skills: List[str]
    experience_diff: Optional[float] = None



