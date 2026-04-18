from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationType
from app.models.user import User
import json
from typing import Dict, Any, Optional

class NotificationService:
    """Сервис для создания и управления уведомлениями"""
    
    @staticmethod
    def create_notification(
        db: Session,
        user_id: int,
        notification_type: NotificationType,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """Создать уведомление"""
        data_json = json.dumps(data) if data else None
        
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            data=data_json
        )
        
        db.add(notification)
        db.commit()
        db.refresh(notification)
        
        return notification
    
    @staticmethod
    def notify_appointment_confirmed(db: Session, user_id: int, appointment_data: Dict[str, Any]):
        """Уведомление о подтверждении записи"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.APPOINTMENT_CONFIRMED,
            title="Запись подтверждена",
            message=f"Ваша запись на {appointment_data.get('date')} подтверждена",
            data=appointment_data
        )
    
    @staticmethod
    def notify_appointment_cancelled(db: Session, user_id: int, appointment_data: Dict[str, Any]):
        """Уведомление об отмене записи"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.APPOINTMENT_CANCELLED,
            title="Запись отменена",
            message=f"Ваша запись на {appointment_data.get('date')} была отменена",
            data=appointment_data
        )
    
    @staticmethod
    def notify_appointment_reminder(db: Session, user_id: int, appointment_data: Dict[str, Any]):
        """Напоминание о записи"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.APPOINTMENT_REMINDER,
            title="Напоминание о записи",
            message=f"Не забудьте о записи завтра в {appointment_data.get('time')}",
            data=appointment_data
        )
    
    @staticmethod
    def notify_payment_received(db: Session, user_id: int, payment_data: Dict[str, Any]):
        """Уведомление о получении платежа"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.PAYMENT_RECEIVED,
            title="Платеж получен",
            message=f"Получен платеж на сумму {payment_data.get('amount')} сум",
            data=payment_data
        )
    
    @staticmethod
    def notify_review_received(db: Session, user_id: int, review_data: Dict[str, Any]):
        """Уведомление о новом отзыве"""
        patient_name = review_data.get('patient_name', 'Bemor')
        rating = review_data.get('rating', 0)
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.REVIEW_RECEIVED,
            title="Yangi baho",
            message=f"Sizni baholashdi! {patient_name} sizga {rating} ball berdi.",
            data=review_data
        )
    
    @staticmethod
    def notify_profile_approved(db: Session, user_id: int):
        """Уведомление об одобрении профиля"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.PROFILE_APPROVED,
            title="Профиль одобрен",
            message="Ваш профиль врача был одобрен! Теперь пациенты могут записываться к вам на прием."
        )
    
    @staticmethod
    def notify_profile_rejected(db: Session, user_id: int, reason: str = ""):
        """Уведомление об отклонении профиля"""
        message = "Ваш профиль врача был отклонен."
        if reason:
            message += f" Причина: {reason}"
        
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.PROFILE_REJECTED,
            title="Профиль отклонен",
            message=message,
            data={"reason": reason} if reason else None
        )
    
    @staticmethod
    def notify_new_message(db: Session, recipient_user_id: int, sender_name: str, text: str, appointment_id: int):
        """Yangi chat xabari keldi bildirishnomasi"""
        preview = (text[:50] + "...") if text and len(text) > 50 else (text or "📎 Rasm")
        return NotificationService.create_notification(
            db=db,
            user_id=recipient_user_id,
            notification_type=NotificationType.NEW_MESSAGE,
            title=f"💬 {sender_name}",
            message=preview,
            data={"appointment_id": appointment_id}
        )

    @staticmethod
    def notify_system_message(db: Session, user_id: int, title: str, message: str, data: Optional[Dict[str, Any]] = None):
        """Системное уведомление"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.SYSTEM_MESSAGE,
            title=title,
            message=message,
            data=data
        )

    @staticmethod
    def notify_appointment_completed(db: Session, user_id: int, appointment_data: Dict[str, Any]):
        """Уведомление о завершении приёма"""
        return NotificationService.create_notification(
            db=db,
            user_id=user_id,
            notification_type=NotificationType.APPOINTMENT_COMPLETED,
            title="Приём завершён",
            message="Приём завершён, оцените качество приёма. Нам важно ваше мнение!",
            data=appointment_data
        )