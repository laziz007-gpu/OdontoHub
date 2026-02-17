"""
Скрипт для создания тестового пользователя
"""
from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import hash_password

def create_test_user():
    db = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        existing_user = db.query(User).filter(User.phone == "+998901234567").first()
        if existing_user:
            print("Пользователь с телефоном '+998901234567' уже существует")
            print(f"Phone: +998901234567")
            print(f"Password: test123")
            return
        
        # Создаём нового пользователя
        hashed_password = hash_password("test123")
        new_user = User(
            phone="+998901234567",
            email="test@example.com",
            password=hashed_password,
            role=UserRole.PATIENT,
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        print("✅ Тестовый пользователь создан успешно!")
        print(f"Phone: +998901234567")
        print(f"Password: test123")
        print(f"Email: test@example.com")
        print(f"Role: patient")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
