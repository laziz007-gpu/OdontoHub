from pydantic import BaseModel
from datetime import datetime


class PaymentBase(BaseModel):
    amount: float
    paid_amount: float = 0.0
    service_name: str
    appointment_id: int | None = None
    status: str = "unpaid"
    notes: str | None = None


class PaymentCreate(PaymentBase):
    pass


class PaymentUpdate(BaseModel):
    amount: float | None = None
    paid_amount: float | None = None
    service_name: str | None = None
    status: str | None = None
    notes: str | None = None


class PaymentSchema(PaymentBase):
    id: int
    patient_id: int
    payment_date: datetime
    recorded_by: int | None

    class Config:
        from_attributes = True
