"""
Сервис для создания уведомлений
"""
from sqlalchemy.orm import Session
from datetime import datetime
import json
from typing import Optional, Dict, Any

from app.models.notification import Notification


def create_notification(
    db: Session,
    user_id: int,
    notification_type: str,
    title: str,
    message: str,
    notification_data: Optional[Dict[str, Any]] = None
) -> Notification:
    """
    Базовая функция для создания уведомления
    """
    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        notification_data=json.dumps(notification_data) if notification_data else None
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return notification


def create_appointment_reminder(
    db: Session,
    user_id: int,
    patient_name: str,
    appointment_time: str,
    appointment_id: int
) -> Notification:
    """
    Создать напоминание о приёме (за 30 минут)
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="appointment_reminder",
        title="OdontoHub",
        message=f"Следующий приём через 30 минут с {patient_name}",
        notification_data={
            "appointment_id": appointment_id,
            "time": appointment_time
        }
    )


def create_appointment_rescheduled(
    db: Session,
    user_id: int,
    patient_name: str,
    old_time: str,
    new_time: str,
    appointment_id: int
) -> Notification:
    """
    Уведомление о переносе приёма
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="appointment_rescheduled",
        title="OdontoHub",
        message=f'"{patient_name}" перенёс приём на {new_time}',
        notification_data={
            "appointment_id": appointment_id,
            "old_time": old_time,
            "new_time": new_time
        }
    )


def create_appointment_cancelled(
    db: Session,
    user_id: int,
    patient_name: str,
    reason: Optional[str],
    appointment_id: int
) -> Notification:
    """
    Уведомление об отмене приёма
    """
    cancel_reason = reason if reason else "причины нет"
    
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="appointment_cancelled",
        title="OdontoHub",
        message=f'"{patient_name}" отменил приём, причина: {cancel_reason}',
        notification_data={
            "appointment_id": appointment_id,
            "reason": cancel_reason
        }
    )


def create_analytics_check_reminder(
    db: Session,
    user_id: int
) -> Notification:
    """
    Напоминание проверить аналитику
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="analytics_check",
        title="OdontoHub",
        message="Проверьте свои результаты работ в разделе аналитика",
        notification_data={}
    )


def create_rating_decreased(
    db: Session,
    user_id: int,
    old_rating: float,
    new_rating: float
) -> Notification:
    """
    Уведомление о снижении рейтинга
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="rating_decreased",
        title="OdontoHub",
        message=f"Рейтинг понизился до {new_rating}",
        notification_data={
            "old_rating": old_rating,
            "new_rating": new_rating,
            "change": new_rating - old_rating
        }
    )


def create_rating_increased(
    db: Session,
    user_id: int,
    old_rating: float,
    new_rating: float
) -> Notification:
    """
    Уведомление о повышении рейтинга
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="rating_increased",
        title="OdontoHub",
        message=f"Рейтинг повысился до {new_rating}",
        notification_data={
            "old_rating": old_rating,
            "new_rating": new_rating,
            "change": new_rating - old_rating
        }
    )


def create_appointment_rated(
    db: Session,
    user_id: int,
    patient_name: str,
    rating: int,
    appointment_id: int
) -> Notification:
    """
    Уведомление об оценке приёма пациентом
    """
    stars = "✨" * rating
    
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="appointment_rated",
        title="OdontoHub",
        message=f'"{patient_name}" оценил приём {rating}{stars}',
        notification_data={
            "appointment_id": appointment_id,
            "rating": rating
        }
    )


def create_review_left(
    db: Session,
    user_id: int,
    patient_name: str,
    review_text: str,
    appointment_id: int
) -> Notification:
    """
    Уведомление об отзыве пациента
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="review_left",
        title="OdontoHub",
        message=f'"{patient_name}" оставил отзыв: {review_text}',
        notification_data={
            "appointment_id": appointment_id,
            "review_text": review_text
        }
    )


def create_payment_reminder(
    db: Session,
    user_id: int,
    amount: float,
    due_date: str,
    payment_id: int
) -> Notification:
    """
    Напоминание об оплате (за 3 дня)
    """
    return create_notification(
        db=db,
        user_id=user_id,
        notification_type="payment_reminder",
        title="OdontoHub",
        message=f"Напоминание об оплате {amount} сум до {due_date}",
        notification_data={
            "payment_id": payment_id,
            "amount": amount,
            "due_date": due_date
        }
    )
