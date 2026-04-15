#!/usr/bin/env python3
"""
Проверка пользователей в базе данных
"""

import os
import sys
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Добавляем путь к приложению
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def check_users():
    """Проверить пользователей в БД"""
    try:
        from sqlalchemy import create_engine, text
        from app.core.config import settings
        
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.connect() as conn:
            # Получаем всех пользователей
            result = conn.execute(text("""
                SELECT u.id, u.phone, u.role, u.password,
                       p.full_name as patient_name, p.id as patient_id,
                       d.full_name as dentist_name, d.id as dentist_id
                FROM users u
                LEFT JOIN patient_profiles p ON u.id = p.user_id
                LEFT JOIN dentist_profiles d ON u.id = d.user_id
                ORDER BY u.id
            """))
            
            print("📋 Пользователи в базе данных:")
            print("-" * 80)
            
            for row in result:
                print(f"ID: {row.id}")
                print(f"  Телефон: {row.phone}")
                print(f"  Роль: {row.role}")
                print(f"  Пароль: {row.password}")
                if row.patient_name:
                    print(f"  Пациент: {row.patient_name} (ID: {row.patient_id})")
                if row.dentist_name:
                    print(f"  Врач: {row.dentist_name} (ID: {row.dentist_id})")
                print("-" * 40)
                
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_users()