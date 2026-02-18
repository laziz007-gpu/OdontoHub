from pydantic import BaseModel
from datetime import datetime


class PrescriptionBase(BaseModel):
    medication_name: str
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    notes: str | None = None


class PrescriptionCreate(PrescriptionBase):
    pass


class PrescriptionUpdate(BaseModel):
    medication_name: str | None = None
    dosage: str | None = None
    frequency: str | None = None
    duration: str | None = None
    notes: str | None = None


class PrescriptionSchema(PrescriptionBase):
    id: int
    patient_id: int
    prescribed_by: int | None
    prescribed_at: datetime

    class Config:
        from_attributes = True
