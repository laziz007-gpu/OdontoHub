from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PrescriptionBase(BaseModel):
    medication_name: str = Field(..., min_length=1, max_length=255)
    dosage: str = Field(..., min_length=1, max_length=100)
    frequency: str = Field(..., min_length=1, max_length=100)
    duration: str = Field(..., min_length=1, max_length=100)
    notes: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionUpdate(BaseModel):
    medication_name: Optional[str] = Field(None, min_length=1, max_length=255)
    dosage: Optional[str] = Field(None, min_length=1, max_length=100)
    frequency: Optional[str] = Field(None, min_length=1, max_length=100)
    duration: Optional[str] = Field(None, min_length=1, max_length=100)
    notes: Optional[str] = None


class PrescriptionSchema(PrescriptionBase):
    id: int
    patient_id: int
    prescribed_by: int
    prescribed_at: datetime
    
    class Config:
        from_attributes = True
