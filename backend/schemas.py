from pydantic import BaseModel, EmailStr
from datetime import datetime
from models import Role

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.CANDIDATE

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: Role
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
