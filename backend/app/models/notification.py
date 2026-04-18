from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from app.models.base import Base
import enum

class NotificationType(enum.Enum):
    APPOINTMENT_CONFIRMED = "appointment_confirmed"
    APPOINTMENT_CANCELLED = "appointment_cancelled"
    APPOINTMENT_REMINDER = "appointment_reminder"
    PAYMENT_RECEIVED = "payment_received"
    REVIEW_RECEIVED = "review_received"
    PROFILE_APPROVED = "profile_approved"
    PROFILE_REJECTED = "profile_rejected"
    SYSTEM_MESSAGE = "system_message"
    NEW_MESSAGE = "new_message"
    APPOINTMENT_COMPLETED = "appointment_completed"

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(NotificationType), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    read_at = Column(DateTime, nullable=True)
    
    # Дополнительные данные (JSON как строка)
    data = Column(Text, nullable=True)  # JSON string for additional data
    
    # Связи
    user = relationship("User", back_populates="notifications")