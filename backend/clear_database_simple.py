#!/usr/bin/env python3
"""
Simple script to clear database using raw SQL
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.core.database import engine

def clear_database():
    """Clear all user-related data using raw SQL"""
    
    try:
        print("🧹 Очистка базы данных...")
        
        with engine.connect() as conn:
            # Delete in correct order to avoid foreign key constraints
            tables_to_clear = [
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
            
            for table in tables_to_clear:
                try:
                    # Start new transaction for each table
                    trans = conn.begin()
                    result = conn.execute(text(f"DELETE FROM {table}"))
                    trans.commit()
                    print(f"   ✅ Очищена таблица {table}: {result.rowcount} записей")
                except Exception as table_error:
                    try:
                        trans.rollback()
                    except:
                        pass
                    print(f"   ⚠️  Таблица {table}: {str(table_error)[:100]}...")
                    continue
            
            print("\n🎉 База данных успешно очищена!")
            print("Теперь можно тестировать регистрацию с чистого листа.")
                
    except Exception as e:
        print(f"❌ Ошибка при очистке: {e}")

if __name__ == "__main__":
    clear_database()