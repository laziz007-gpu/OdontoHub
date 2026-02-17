"""
Скрипт для создания тестового пользователя
"""
from app.core.database import SessionLocal, Base, engine

# ВАЖНО: Импортируем ВСЕ модели перед созданием таблиц
from app.models.user import User, UserRole
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile
from app.models.service import Service
from app.models.appointment import Appointment

# Создаём все таблицы
print("Создаём таблицы...")
Base.metadata.create_all(bind=engine)
print("✅ Таблицы созданы")

def create_test_user():
    db = SessionLocal()
    try:
        # Проверяем, существует ли пользователь
        existing_user = db.query(User).filter(User.phone == "+998901234567").first()
        if existing_user:
            print("Пользователь с телефоном '+998901234567' уже существует")
            print(f"Phone: +998901234567")
            return
        
        # Создаём нового пользователя-стоматолога
        new_user = User(
            phone="+998901234567",
            email="dentist@example.com",
            password=None,  # Без пароля
            role="dentist",  # Используем строку вместо enum
            is_active=True
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Создаём профиль стоматолога
        dentist_profile = DentistProfile(
            user_id=new_user.id,
            full_name="Dr. Test Dentist"
        )
        db.add(dentist_profile)
        db.commit()
        
        print("✅ Тестовый стоматолог создан успешно!")
        print(f"Phone: +998901234567")
        print(f"Email: dentist@example.com")
        print(f"Role: dentist")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
