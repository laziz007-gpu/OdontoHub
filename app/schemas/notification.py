from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional, Dict, Any


NOTIFICATION_TYPES = [
    'appointment_reminder',
    'appointment_rescheduled',
    'appointment_cancelled',
    'analytics_check',
    'rating_decreased',
    'rating_increased',
    'appointment_rated',
    'review_left',
    'payment_reminder'
]


class NotificationBase(BaseModel):
    type: str = Field(..., max_length=50)
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    
    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        if v not in NOTIFICATION_TYPES:
            raise ValueError(f'Type must be one of: {", ".join(NOTIFICATION_TYPES)}')
        return v


class NotificationCreate(NotificationBase):
    user_id: int
    notification_data: Optional[Dict[str, Any]] = None


class NotificationSchema(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    notification_data: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class UnreadCountSchema(BaseModel):
    count: int


class MarkAsReadRequest(BaseModel):
    is_read: bool
