from pydantic import BaseModel
from datetime import datetime


class MessageCreate(BaseModel):
    appointment_id: int
    text: str


class MessageOut(BaseModel):
    id: int
    appointment_id: int
    sender_id: int
    text: str
    created_at: datetime

    class Config:
        from_attributes = True
