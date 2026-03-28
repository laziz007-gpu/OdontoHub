from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class MessageCreate(BaseModel):
    appointment_id: int
    text: str
    image_data: Optional[str] = None


class MessageOut(BaseModel):
    id: int
    appointment_id: int
    sender_id: int
    text: str
    image_data: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
