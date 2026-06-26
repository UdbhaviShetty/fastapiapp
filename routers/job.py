from fastapi import APIRouter

router = APIRouter(prefix="/company",tags=["company"])

@router.get("/")
def read_():
    return {"company":"company root"}

@router.get("/{company_id}")
def read_company(company_id:int):
    return {"company_id":company_id}