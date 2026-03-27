from pydantic import BaseModel
from datetime import datetime


class MedicalRecordCreate(BaseModel):
    appointment_id: int
    diagnosis: str
    treatment: str | None = None
    notes: str | None = None


class MedicalRecordOut(BaseModel):
    id: int
    patient_id: int
    dentist_id: int
    appointment_id: int
    diagnosis: str
    treatment: str | None
    notes: str | None
    created_at: datetime

    class Config:
        from_attributes = True
