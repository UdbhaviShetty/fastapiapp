from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title: str
    salary: int
    description: Optional[str] = None
    company_id: int

class JobUpdate(JobBase):
    pass

class JobUpdate(JobBase):
    title: Optional[str] = None
    salary: Optional[int] = None
    description: Optional[str] = None
    company_id: Optional[int] = None