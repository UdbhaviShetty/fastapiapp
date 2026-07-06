from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from models.users import User
from schemas.users import UserCreate, UserResponse
from schemas.token import Token
from database import get_db
from utils.security import hash_password, verify_password
from utils.token import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = hash_password(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
   
@router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
        username = body.get("username") or body.get("email")
        password = body.get("password")
    else:
        form = await request.form()
        username = form.get("username") or form.get("email")
        password = form.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    username = username.strip().lower()
    existing_user = db.query(User).filter(
        or_(func.lower(User.email) == username, func.lower(User.name) == username)
    ).first()
    if not existing_user:
        raise HTTPException(status_code=400, detail="User not found")
    if not verify_password(password, existing_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    access_token = create_access_token(
        data={"sub": str(existing_user.id), "role": existing_user.role}
    )
    return {"access_token": access_token, "token_type": "Bearer"}
