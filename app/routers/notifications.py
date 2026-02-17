from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.notification import Notification
from app.schemas.notification import (
    NotificationSchema,
    UnreadCountSchema,
    MarkAsReadRequest
)
from app.services import notification_service

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationSchema])
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получить все уведомления для текущего пользователя
    Отсортированы по дате создания (новые первые)
    """
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    
    # Парсим notification_data из JSON строки
    result = []
    for notif in notifications:
        notif_dict = {
            "id": notif.id,
            "user_id": notif.user_id,
            "type": notif.type,
            "title": notif.title,
            "message": notif.message,
            "is_read": notif.is_read,
            "created_at": notif.created_at,
            "notification_data": json.loads(notif.notification_data) if notif.notification_data else None
        }
        result.append(NotificationSchema(**notif_dict))
    
    return result


@router.get("/unread-count", response_model=UnreadCountSchema)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Получить количество непрочитанных уведомлений
    """
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    return UnreadCountSchema(count=count)


@router.patch("/{notification_id}/read", response_model=NotificationSchema)
def mark_notification_as_read(
    notification_id: int,
    data: MarkAsReadRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Отметить уведомление как прочитанное или непрочитанное
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = data.is_read
    db.commit()
    db.refresh(notification)
    
    # Парсим notification_data
    notif_dict = {
        "id": notification.id,
        "user_id": notification.user_id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
        "notification_data": json.loads(notification.notification_data) if notification.notification_data else None
    }
    
    return NotificationSchema(**notif_dict)


@router.post("/mark-all-read")
def mark_all_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Отметить все уведомления как прочитанные
    """
    updated_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"message": "All notifications marked as read", "updated_count": updated_count}


# Тестовый endpoint для создания уведомлений (для разработки)
@router.post("/test/create-sample")
def create_sample_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Создать тестовые уведомления для текущего пользователя
    """
    notifications_created = []
    
    # Напоминание о приёме
    notif1 = notification_service.create_appointment_reminder(
        db=db,
        user_id=current_user.id,
        patient_name="Иван Иванов",
        appointment_time="14:30",
        appointment_id=1
    )
    notifications_created.append(notif1.id)
    
    # Приём перенесён
    notif2 = notification_service.create_appointment_rescheduled(
        db=db,
        user_id=current_user.id,
        patient_name="Мария Петрова",
        old_time="10:00",
        new_time="15:00",
        appointment_id=2
    )
    notifications_created.append(notif2.id)
    
    # Приём отменён
    notif3 = notification_service.create_appointment_cancelled(
        db=db,
        user_id=current_user.id,
        patient_name="Алексей Сидоров",
        reason="Не могу прийти",
        appointment_id=3
    )
    notifications_created.append(notif3.id)
    
    # Проверьте аналитику
    notif4 = notification_service.create_analytics_check_reminder(
        db=db,
        user_id=current_user.id
    )
    notifications_created.append(notif4.id)
    
    # Рейтинг повысился
    notif5 = notification_service.create_rating_increased(
        db=db,
        user_id=current_user.id,
        old_rating=4.5,
        new_rating=4.6
    )
    notifications_created.append(notif5.id)
    
    # Пациент оценил приём
    notif6 = notification_service.create_appointment_rated(
        db=db,
        user_id=current_user.id,
        patient_name="Ольга Смирнова",
        rating=5,
        appointment_id=4
    )
    notifications_created.append(notif6.id)
    
    # Пациент оставил отзыв
    notif7 = notification_service.create_review_left(
        db=db,
        user_id=current_user.id,
        patient_name="Дмитрий Козлов",
        review_text="Отличный врач! Всё прошло безболезненно",
        appointment_id=5
    )
    notifications_created.append(notif7.id)
    
    # Напоминание об оплате
    notif8 = notification_service.create_payment_reminder(
        db=db,
        user_id=current_user.id,
        amount=500000,
        due_date="2024-12-25",
        payment_id=1
    )
    notifications_created.append(notif8.id)
    
    return {
        "message": "Sample notifications created",
        "count": len(notifications_created),
        "notification_ids": notifications_created
    }
