#!/usr/bin/env python3
"""
Script to clear all user data from database for fresh start
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile
from app.models.appointment import Appointment

def clear_database():
    """Clear all user-related data from database"""
    db = next(get_db())
    
    try:
        print("🧹 Очистка базы данных...")
        
        # Delete appointments first (foreign key constraints)
        appointments_count = db.query(Appointment).count()
        db.query(Appointment).delete()
        print(f"   ✅ Удалено записей: {appointments_count}")
        
        # Delete patient profiles
        patients_count = db.query(PatientProfile).count()
        db.query(PatientProfile).delete()
        print(f"   ✅ Удалено профилей пациентов: {patients_count}")
        
        # Delete dentist profiles
        dentists_count = db.query(DentistProfile).count()
        db.query(DentistProfile).delete()
        print(f"   ✅ Удалено профилей врачей: {dentists_count}")
        
        # Delete users
        users_count = db.query(User).count()
        db.query(User).delete()
        print(f"   ✅ Удалено пользователей: {users_count}")
        
        db.commit()
        print("\n🎉 База данных успешно очищена!")
        print("Теперь можно тестировать регистрацию с чистого листа.")
        
    except Exception as e:
        print(f"❌ Ошибка при очистке: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_database()