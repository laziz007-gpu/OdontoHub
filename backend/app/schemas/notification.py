from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from app.models.notification import NotificationType

class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType
    data: Optional[Dict[str, Any]] = None

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class UnreadCountResponse(BaseModel):
    unread_count: int