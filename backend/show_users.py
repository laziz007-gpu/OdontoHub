import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

try:
    database_url = os.getenv("DATABASE_URL")
    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT u.id, u.phone, u.role, u.email, 
                   p.full_name as patient_name,
                   d.full_name as dentist_name
            FROM users u
            LEFT JOIN patient_profiles p ON u.id = p.user_id
            LEFT JOIN dentist_profiles d ON u.id = d.user_id
            ORDER BY u.id
            LIMIT 10
        """))
        
        users = result.fetchall()
        
        print("👥 Пользователи в базе данных:")
        print("-" * 80)
        for user in users:
            name = user[4] or user[5] or "Не указано"
            print(f"ID: {user[0]:2} | Phone: {user[1]:15} | Role: {user[2]:8} | Name: {name}")
        
        print(f"\nВсего показано: {len(users)} из 21 пользователей")
        
except Exception as e:
    print(f"❌ Ошибка: {e}")