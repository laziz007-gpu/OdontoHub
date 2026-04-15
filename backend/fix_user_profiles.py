#!/usr/bin/env python3
"""
Скрипт для исправления пользователей без профилей
"""
import sys
import os

# Добавляем текущую директорию в PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
os.chdir(current_dir)

from sqlalchemy.orm import Session
from app.core.database import get_db, engine
from app.models.user import User, UserRole
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile, VerificationStatus

def fix_user_profiles():
    """Создает недостающие профили для пользователей"""
    db = Session(bind=engine)
    
    try:
        # Получаем всех пользователей
        users = db.query(User).all()
        print(f"Найдено пользователей: {len(users)}")
        
        fixed_count = 0
        
        for user in users:
            print(f"\nПользователь ID {user.id}: {user.phone}, роль: {user.role.value}")
            
            if user.role == UserRole.PATIENT:
                # Проверяем, есть ли профиль пациента
                patient_profile = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
                if not patient_profile:
                    print(f"  ❌ Нет профиля пациента, создаем...")
                    new_profile = PatientProfile(
                        user_id=user.id,
                        full_name=f"Patient {user.id}",  # Временное имя
                        age=25,
                        address="Не указан"
                    )
                    db.add(new_profile)
                    fixed_count += 1
                else:
                    print(f"  ✅ Профиль пациента существует: {patient_profile.full_name}")
                    
            elif user.role == UserRole.DENTIST:
                # Проверяем, есть ли профиль врача
                dentist_profile = db.query(DentistProfile).filter(DentistProfile.user_id == user.id).first()
                if not dentist_profile:
                    print(f"  ❌ Нет профиля врача, создаем...")
                    new_profile = DentistProfile(
                        user_id=user.id,
                        full_name=f"Doctor {user.id}",  # Временное имя
                        specialization="Общая стоматология",
                        clinic="Не указана",
                        address="Не указан",
                        verification_status=VerificationStatus.APPROVED
                    )
                    db.add(new_profile)
                    fixed_count += 1
                else:
                    print(f"  ✅ Профиль врача существует: {dentist_profile.full_name}")
        
        if fixed_count > 0:
            db.commit()
            print(f"\n✅ Исправлено профилей: {fixed_count}")
        else:
            print(f"\n✅ Все профили в порядке!")
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

def show_all_users():
    """Показывает всех пользователей и их профили"""
    db = Session(bind=engine)
    
    try:
        users = db.query(User).all()
        print(f"\n=== Все пользователи ({len(users)}) ===")
        
        for user in users:
            print(f"\nID: {user.id}")
            print(f"Телефон: {user.phone}")
            print(f"Email: {user.email}")
            print(f"Роль: {user.role.value}")
            print(f"Пароль: {user.password}")
            
            if user.role == UserRole.PATIENT:
                patient = db.query(PatientProfile).filter(PatientProfile.user_id == user.id).first()
                if patient:
                    print(f"Профиль пациента: {patient.full_name}")
                else:
                    print("❌ НЕТ ПРОФИЛЯ ПАЦИЕНТА")
                    
            elif user.role == UserRole.DENTIST:
                dentist = db.query(DentistProfile).filter(DentistProfile.user_id == user.id).first()
                if dentist:
                    print(f"Профиль врача: {dentist.full_name}")
                else:
                    print("❌ НЕТ ПРОФИЛЯ ВРАЧА")
                    
    except Exception as e:
        print(f"❌ Ошибка: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Диагностика пользователей ===")
    show_all_users()
    
    print("\n=== Исправление профилей ===")
    fix_user_profiles()
    
    print("\n=== Результат после исправления ===")
    show_all_users()