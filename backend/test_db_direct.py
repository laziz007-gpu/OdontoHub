#!/usr/bin/env python3
"""
Прямой тест базы данных
"""

import os
import sys
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Добавляем путь к приложению
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_db_direct():
    """Прямой тест БД"""
    try:
        from sqlalchemy import create_engine, text
        from app.core.config import settings
        
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.connect() as conn:
            # Проверяем врача с ID 2
            result = conn.execute(text("""
                SELECT id, full_name FROM dentist_profiles WHERE id = 2
            """))
            
            dentist = result.fetchone()
            print(f"Врач ID 2: {dentist}")
            
            # Проверяем пациента с ID 1
            result = conn.execute(text("""
                SELECT id, full_name FROM patient_profiles WHERE id = 1
            """))
            
            patient = result.fetchone()
            print(f"Пациент ID 1: {patient}")
            
            # Проверяем последнюю запись
            result = conn.execute(text("""
                SELECT id, dentist_id, patient_id FROM appointments 
                ORDER BY id DESC LIMIT 1
            """))
            
            appointment = result.fetchone()
            print(f"Последняя запись: {appointment}")
                
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_db_direct()