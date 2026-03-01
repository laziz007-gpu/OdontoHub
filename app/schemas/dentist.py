from pydantic import BaseModel
from typing import Optional
from enum import Enum

class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class DentistProfileSchema(BaseModel):
    id: int
    user_id: int
    full_name: str
    pinfl: Optional[str] = None
    diploma_number: Optional[str] = None
    verification_status: VerificationStatus
    
    specialization: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    clinic: Optional[str] = None
    schedule: Optional[str] = None
    work_hours: Optional[str] = None
    telegram: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None

    class Config:
        from_attributes = True
