import sys
import os

# Добавляем корневую директорию в sys.path
sys.path.append(os.getcwd())

try:
    from app.models.user import User # Импортируем User для инициализации маппера
    from app.models.notification import Notification, NotificationType
    from app.core.database import SessionLocal
    from datetime import datetime

    db = SessionLocal()
    try:
        notifs = db.query(Notification).order_by(Notification.created_at.desc()).limit(10).all()
        print(f"Found {len(notifs)} recent notifications")
        for n in notifs:
            # Превращаем Enum в строку для печати
            notif_type = n.type.value if hasattr(n.type, 'value') else str(n.type)
            print(f"ID: {n.id}, UserID: {n.user_id}, Type: {notif_type}, Title: {n.title}, Message: {n.message}, CreatedAt: {n.created_at}")
    finally:
        db.close()
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
