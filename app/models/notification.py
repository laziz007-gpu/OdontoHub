from sqlalchemy import String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from .base import Base


class NotificationType(enum.Enum):
    APPOINTMENT_REMINDER = "appointment_reminder"  # Напоминание о приёме
    APPOINTMENT_RESCHEDULED = "appointment_rescheduled"  # Приём перенесён
    APPOINTMENT_CANCELLED = "appointment_cancelled"  # Приём отменён
    ANALYTICS_CHECK = "analytics_check"  # Проверьте аналитику
    RATING_DECREASED = "rating_decreased"  # Рейтинг понизился
    RATING_INCREASED = "rating_increased"  # Рейтинг повысился
    APPOINTMENT_RATED = "appointment_rated"  # Пациент оценил приём
    REVIEW_LEFT = "review_left"  # Пациент оставил отзыв
    PAYMENT_REMINDER = "payment_reminder"  # Напоминание об оплате


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), index=True)
    type: Mapped[str] = mapped_column(String(50))  # NotificationType as string
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    
    # Дополнительные данные (JSON в виде строки)
    notification_data: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Связь с пользователем
    user = relationship("User", foreign_keys=[user_id])
