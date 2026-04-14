#!/usr/bin/env python3
"""
Проверка пароля врача
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

def check_dentist():
    env_vars = load_env()
    database_url = env_vars.get('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL не найден")
        return
    
    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        # Найти врача
        result = conn.execute(text("""
            SELECT u.id, u.phone, u.password, u.role, d.full_name 
            FROM users u 
            JOIN dentist_profiles d ON u.id = d.user_id 
            WHERE u.role = 'dentist'
        """))
        
        dentists = result.fetchall()
        
        if not dentists:
            print("❌ Врачи не найдены")
            return
            
        print("=== Врачи в системе ===")
        for dentist in dentists:
            user_id, phone, password, role, full_name = dentist
            print(f"ID: {user_id}")
            print(f"Телефон: {phone}")
            print(f"Пароль: {password}")
            print(f"Имя: {full_name}")
            print(f"Роль: {role}")
            print("---")

if __name__ == "__main__":
    check_dentist()