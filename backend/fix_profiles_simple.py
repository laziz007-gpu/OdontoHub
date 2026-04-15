#!/usr/bin/env python3
"""
Простой скрипт для исправления профилей пользователей
"""
import sys
import os

# Добавляем текущую директорию в PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
os.chdir(current_dir)

from sqlalchemy import create_engine, text
from app.core.config import settings

def fix_profiles():
    """Исправляет недостающие профили"""
    
    # Создаем подключение к БД
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("=== Проверка пользователей ===")
        
        # Получаем всех пользователей
        users_result = conn.execute(text("SELECT id, phone, email, role, password FROM users"))
        users = users_result.fetchall()
        
        print(f"Найдено пользователей: {len(users)}")
        
        for user in users:
            user_id, phone, email, role, password = user
            print(f"\nПользователь ID {user_id}: {phone}, роль: {role}")
            
            if role == "patient":
                # Проверяем профиль пациента
                patient_result = conn.execute(text("SELECT id, full_name FROM patient_profiles WHERE user_id = :user_id"), {"user_id": user_id})
                patient = patient_result.fetchone()
                
                if not patient:
                    print(f"  ❌ Нет профиля пациента, создаем...")
                    conn.execute(text("""
                        INSERT INTO patient_profiles (user_id, full_name, age, address) 
                        VALUES (:user_id, :full_name, 25, 'Не указан')
                    """), {
                        "user_id": user_id,
                        "full_name": f"Patient {user_id}"
                    })
                    conn.commit()
                    print(f"  ✅ Создан профиль пациента")
                else:
                    print(f"  ✅ Профиль пациента существует: {patient[1]}")
                    
            elif role == "dentist":
                # Проверяем профиль врача
                dentist_result = conn.execute(text("SELECT id, full_name FROM dentist_profiles WHERE user_id = :user_id"), {"user_id": user_id})
                dentist = dentist_result.fetchone()
                
                if not dentist:
                    print(f"  ❌ Нет профиля врача, создаем...")
                    conn.execute(text("""
                        INSERT INTO dentist_profiles (user_id, full_name, specialization, clinic, address, verification_status) 
                        VALUES (:user_id, :full_name, 'Общая стоматология', 'Не указана', 'Не указан', 'approved')
                    """), {
                        "user_id": user_id,
                        "full_name": f"Doctor {user_id}"
                    })
                    conn.commit()
                    print(f"  ✅ Создан профиль врача")
                else:
                    print(f"  ✅ Профиль врача существует: {dentist[1]}")
        
        print("\n=== Итоговая проверка ===")
        
        # Проверяем результат
        users_result = conn.execute(text("""
            SELECT u.id, u.phone, u.role, 
                   p.full_name as patient_name,
                   d.full_name as dentist_name
            FROM users u
            LEFT JOIN patient_profiles p ON u.id = p.user_id AND u.role = 'patient'
            LEFT JOIN dentist_profiles d ON u.id = d.user_id AND u.role = 'dentist'
        """))
        
        for row in users_result:
            user_id, phone, role, patient_name, dentist_name = row
            profile_name = patient_name if role == "patient" else dentist_name
            status = "✅" if profile_name else "❌"
            print(f"{status} ID {user_id}: {phone} ({role}) - {profile_name or 'НЕТ ПРОФИЛЯ'}")

if __name__ == "__main__":
    try:
        fix_profiles()
        print("\n✅ Готово!")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()