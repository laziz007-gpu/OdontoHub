from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime
import json

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.notification import Notification, NotificationType
from app.schemas.notification import (
    NotificationResponse, 
    NotificationCreate, 
    NotificationUpdate,
    UnreadCountResponse
)

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user notifications"""
    query = db.query(Notification).filter(Notification.user_id == current_user.id)
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = query.order_by(desc(Notification.created_at)).offset(skip).limit(limit).all()
    
    # Преобразуем data из JSON строки в dict
    result = []
    for notification in notifications:
        notification_dict = {
            "id": notification.id,
            "user_id": notification.user_id,
            "type": notification.type,
            "title": notification.title,
            "message": notification.message,
            "is_read": notification.is_read,
            "created_at": notification.created_at,
            "read_at": notification.read_at,
            "data": json.loads(notification.data) if notification.data else None
        }
        result.append(notification_dict)
    
    return result

@router.patch("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark notification as read"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    if not notification.is_read:
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.commit()
    
    return {
        "id": notification.id,
        "is_read": notification.is_read,
        "read_at": notification.read_at,
        "message": "Notification marked as read"
    }

@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications"""
    count = db.query(func.count(Notification.id)).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).scalar()
    
    return {"unread_count": count or 0}

@router.post("/", response_model=NotificationResponse)
def create_notification(
    notification_data: NotificationCreate,
    db: Session = Depends(get_db)
):
    """Create a new notification (internal use)"""
    # Преобразуем data в JSON строку
    data_json = json.dumps(notification_data.data) if notification_data.data else None
    
    notification = Notification(
        user_id=notification_data.user_id,
        type=notification_data.type,
        title=notification_data.title,
        message=notification_data.message,
        data=data_json
    )
    
    db.add(notification)
    db.commit()
    db.refresh(notification)
    
    return {
        "id": notification.id,
        "user_id": notification.user_id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
        "read_at": notification.read_at,
        "data": json.loads(notification.data) if notification.data else None
    }

@router.patch("/mark-all-read")
def mark_all_notifications_as_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all user notifications as read"""
    updated_count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    
    db.commit()
    
    return {
        "message": f"Marked {updated_count} notifications as read",
        "updated_count": updated_count
    }

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted successfully"}