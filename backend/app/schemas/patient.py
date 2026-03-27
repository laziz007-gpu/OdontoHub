from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PatientBase(BaseModel):
    full_name: str
    birth_date: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    source: Optional[str] = None

class PatientCreate(PatientBase):
    phone: str

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    birth_date: Optional[datetime] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    source: Optional[str] = None

class PatientSchema(PatientBase):
    id: int
    user_id: int
    phone: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True
