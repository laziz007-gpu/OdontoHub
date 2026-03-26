from pydantic import BaseModel
from enum import Enum


class UserRole(str, Enum):
    patient = "patient"
    dentist = "dentist"


class RegisterSchema(BaseModel):
    phone: str
    role: UserRole
    full_name: str
    email: str | None = None


class LoginSchema(BaseModel):
    phone: str


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
