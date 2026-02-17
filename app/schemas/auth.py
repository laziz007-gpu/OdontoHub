from pydantic import BaseModel, field_validator
from enum import Enum
import re


class UserRole(str, Enum):
    patient = "patient"
    dentist = "dentist"


class RegisterSchema(BaseModel):
    phone: str
    email: str | None = None
    full_name: str
    role: UserRole

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Убираем пробелы и дефисы
        phone = v.replace(' ', '').replace('-', '')
        # Проверяем формат +998XXXXXXXXX
        if not re.match(r'^\+998\d{9}$', phone):
            raise ValueError('Неверный формат телефона. Используйте +998XXXXXXXXX')
        return phone


class LoginSchema(BaseModel):
    phone: str

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Убираем пробелы и дефисы
        phone = v.replace(' ', '').replace('-', '')
        return phone


class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
