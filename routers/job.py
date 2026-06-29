from fastapi import APIRouter,HTTPException,Depends,status
from schemas.job import JobCreate, JobUpdate
from models.job import Job
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/job", tags=["job"])

@router.post("/",status_code=status.HTTP_201_CREATED,response_model=jobResponse)
def create_job(job: JobCreate,db:Session=Depends(get_db)):
    db_job = Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/",status_code=status.HTTP_200_OK,response_model=list[JobResponse])
def get_all_job(db:Session=Depends(get_db)):
    jobs = db.query(Job).all()
    return jobs

@router.get("/{job_id}",status_code=status.HTTP_200_OK,response_model=JobResponse)
def get_job(job_id: int,db:Session=Depends(get_db)):
    return jobs[job_id]

@router.put("/{job_id}")
def update_job(job_id: int,job: JobUpdate):
    return jobs

@router.delete("/{job_id}")
def delete_job(job_id: int):
    jobs.pop(job_id)
    return jobs

# @router.get("/")
# def read_job():
#     return {"job": "Job root"}

# @router.get("/{job_id}")
# def read_job(job_id: int):
#     return {"job_id": job_id}

