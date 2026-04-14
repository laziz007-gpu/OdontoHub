#!/usr/bin/env python3
"""
Изменение пользователя с пациента на врача
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

def change_to_dentist():
    env_vars = load_env()
    database_url = env_vars.get('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL не найден")
        return
    
    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        print("=== Изменение пользователя +998901234567 на врача ===")
        
        # Удаляем профиль пациента
        conn.execute(text("DELETE FROM patient_profiles WHERE user_id = 1"))
        print("✅ Удален профиль пациента")
        
        # Изменяем роль на врача
        conn.execute(text("UPDATE users SET role = 'dentist' WHERE id = 1"))
        print("✅ Роль изменена на врача")
        
        # Создаем профиль врача
        conn.execute(text("""
            INSERT INTO dentist_profiles (user_id, full_name, specialization, clinic, address, verification_status) 
            VALUES (1, 'Test Doctor', 'Общая стоматология', 'Тестовая клиника', 'Ташкент', 'approved')
        """))
        print("✅ Создан профиль врача")
        
        conn.commit()
        
        # Проверяем результат
        user_result = conn.execute(text("SELECT id, phone, role FROM users WHERE id = 1"))
        user = user_result.fetchone()
        
        dentist_result = conn.execute(text("SELECT id, full_name FROM dentist_profiles WHERE user_id = 1"))
        dentist = dentist_result.fetchone()
        
        print(f"\n=== Результат ===")
        print(f"Пользователь: ID {user[0]}, {user[1]}, роль: {user[2]}")
        print(f"Профиль врача: {dentist[1] if dentist else 'НЕТ'}")

if __name__ == "__main__":
    try:
        change_to_dentist()
        print("\n✅ Готово! Теперь можете войти как врач.")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()