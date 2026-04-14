from typing import List, Optional
from sqlmodel import Session, select
from .models import Resume
from .database import engine


def add_resume(resume: Resume) -> None:
    with Session(engine) as session:
        session.add(resume)
        session.commit()


def list_resumes() -> List[Resume]:
    with Session(engine) as session:
        return session.exec(select(Resume)).all()


def get_resume_by_id(resume_id: str) -> Optional[Resume]:
    with Session(engine) as session:
        return session.get(Resume, resume_id)


def update_resume(resume_id: str, updates: dict) -> Optional[Resume]:
    with Session(engine) as session:
        resume = session.get(Resume, resume_id)
        if not resume:
            return None

        for key, value in updates.items():
            if value is not None and hasattr(resume, key):
                setattr(resume, key, value)

        resume.manually_corrected = True
        session.add(resume)
        session.commit()
        session.refresh(resume)
        return resume
    
def delete_resume(resume_id: str) -> bool:
    with Session(engine) as session:
        resume = session.get(Resume, resume_id)
        if not resume:
            return False
        session.delete(resume)
        session.commit()
        return True
