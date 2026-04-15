#!/usr/bin/env python3
"""
Reset database - truncate all tables
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

def reset_database():
    """Reset database by truncating all tables"""
    
    try:
        print("🔄 Сброс базы данных...")
        
        with engine.connect() as conn:
            # Disable foreign key checks temporarily
            conn.execute(text("SET session_replication_role = replica;"))
            
            # List of tables to truncate
            tables = [
                'messages',
                'notifications', 
                'reviews',
                'payments',
                'prescriptions',
                'allergies',
                'patient_photos',
                'appointments',
                'patient_profiles',
                'dentist_profiles', 
                'users'
            ]
            
            for table in tables:
                try:
                    conn.execute(text(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;"))
                    print(f"   ✅ Сброшена таблица: {table}")
                except Exception as e:
                    print(f"   ⚠️  Таблица {table}: {str(e)[:50]}...")
            
            # Re-enable foreign key checks
            conn.execute(text("SET session_replication_role = DEFAULT;"))
            conn.commit()
            
            print("\n🎉 База данных успешно сброшена!")
            print("Все таблицы очищены, можно тестировать регистрацию.")
                
    except Exception as e:
        print(f"❌ Ошибка при сбросе: {e}")

if __name__ == "__main__":
    reset_database()