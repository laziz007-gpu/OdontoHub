#!/usr/bin/env python3
"""
Проверка роли пользователя в БД
"""
import os
from sqlalchemy import create_engine, text

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    env_vars = {}
    
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    
    return env_vars

def check_user():
    env_vars = load_env()
    database_url = env_vars.get('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL не найден")
        return
    
    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        print("=== Проверка пользователя +998901234567 ===")
        
        # Проверяем пользователя
        user_result = conn.execute(text("""
            SELECT id, phone, email, role, password 
            FROM users 
            WHERE phone = '+998901234567'
        """))
        user = user_result.fetchone()
        
        if not user:
            print("❌ Пользователь не найден!")
            return
        
        user_id, phone, email, role, password = user
        print(f"✅ Пользователь найден:")
        print(f"   ID: {user_id}")
        print(f"   Телефон: {phone}")
        print(f"   Email: {email}")
        print(f"   Роль: {role}")
        print(f"   Пароль: {password}")
        
        # Проверяем профили
        if role == "patient":
            patient_result = conn.execute(text("SELECT id, full_name FROM patient_profiles WHERE user_id = :user_id"), {"user_id": user_id})
            patient = patient_result.fetchone()
            if patient:
                print(f"   Профиль пациента: {patient[1]}")
            else:
                print("   ❌ НЕТ профиля пациента")
                
        elif role == "dentist":
            dentist_result = conn.execute(text("SELECT id, full_name FROM dentist_profiles WHERE user_id = :user_id"), {"user_id": user_id})
            dentist = dentist_result.fetchone()
            if dentist:
                print(f"   Профиль врача: {dentist[1]}")
            else:
                print("   ❌ НЕТ профиля врача")
        
        # Показываем всех пользователей
        print("\n=== Все пользователи в БД ===")
        all_users = conn.execute(text("SELECT id, phone, role FROM users ORDER BY id"))
        for u in all_users:
            print(f"ID {u[0]}: {u[1]} ({u[2]})")

if __name__ == "__main__":
    try:
        check_user()
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()