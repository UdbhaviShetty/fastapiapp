from pydantic import BaseModel

class Token(BaseModel):
    token: str
    token_type: str

class LoginResponse(BaseModel):
    token: str
    token_type: str
    user: dict