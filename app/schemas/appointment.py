from pydantic import BaseModel
from datetime import datetime
from app.models.appointment import AppointmentStatus

class AppointmentBase(BaseModel):
    dentist_id: int
    start_time: datetime
    end_time: datetime
    service: str | None = None

class AppointmentCreate(AppointmentBase):
    patient_id: int | None = None
    notes: str | None = None

class AppointmentUpdate(BaseModel):
    start_time: datetime | None = None
    end_time: datetime | None = None
    status: AppointmentStatus | None = None
    cancel_reason: str | None = None
    service: str | None = None
    notes: str | None = None

class AppointmentSchema(AppointmentBase):
    id: int
    patient_id: int
    dentist_name: str | None = None
    patient_name: str | None = None
    status: AppointmentStatus
    cancel_reason: str | None = None
    notes: str | None = None

    class Config:
        from_attributes = True
