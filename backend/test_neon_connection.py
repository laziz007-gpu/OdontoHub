#!/usr/bin/env python3
"""
Тест подключения к базе данных Neon
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Загружаем переменные окружения
load_dotenv()

def test_neon_connection():
    """Тестируем подключение к Neon PostgreSQL"""
    
    # Получаем URL базы данных
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL не найден в .env файле")
        return False
    
    print(f"🔗 Подключаемся к: {database_url[:50]}...")
    
    try:
        # Создаем движок
        engine = create_engine(database_url)
        
        # Тестируем подключение
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Подключение успешно!")
            print(f"📊 Версия PostgreSQL: {version}")
            
            # Проверяем таблицы
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result.fetchall()]
            print(f"📋 Найдено таблиц: {len(tables)}")
            for table in tables:
                print(f"   - {table}")
            
            # Проверяем пользователей
            if 'users' in tables:
                result = connection.execute(text("SELECT COUNT(*) FROM users"))
                user_count = result.fetchone()[0]
                print(f"👥 Пользователей в базе: {user_count}")
                
                # Показываем несколько пользователей
                result = connection.execute(text("""
                    SELECT id, phone, role, email 
                    FROM users 
                    ORDER BY id 
                    LIMIT 5
                """))
                
                users = result.fetchall()
                print("📱 Пользователи:")
                for user in users:
                    print(f"   ID: {user[0]}, Phone: {user[1]}, Role: {user[2]}, Email: {user[3]}")
            
            return True
            
    except Exception as e:
        print(f"❌ Ошибка подключения: {e}")
        return False

def test_specific_user(phone_number):
    """Проверяем конкретного пользователя"""
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL не найден")
        return
    
    try:
        engine = create_engine(database_url)
        
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT u.id, u.phone, u.role, u.email, u.created_at,
                       p.full_name as patient_name,
                       d.full_name as dentist_name
                FROM users u
                LEFT JOIN patient_profiles p ON u.id = p.user_id
                LEFT JOIN dentist_profiles d ON u.id = d.user_id
                WHERE u.phone = :phone
            """), {"phone": phone_number})
            
            user = result.fetchone()
            
            if user:
                print(f"✅ Пользователь найден:")
                print(f"   ID: {user[0]}")
                print(f"   Phone: {user[1]}")
                print(f"   Role: {user[2]}")
                print(f"   Email: {user[3]}")
                print(f"   Created: {user[4]}")
                print(f"   Name: {user[5] or user[6] or 'Не указано'}")
            else:
                print(f"❌ Пользователь с номером {phone_number} не найден")
                
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    print("🧪 Тестирование подключения к Neon PostgreSQL")
    print("=" * 50)
    
    # Основной тест подключения
    if test_neon_connection():
        print("\n" + "=" * 50)
        
        # Если есть аргумент командной строки - проверяем конкретного пользователя
        if len(sys.argv) > 1:
            phone = sys.argv[1]
            print(f"[DEBUG] Проверяем пользователя: {phone}")
            test_specific_user(phone)
    
    print("\n✨ Тест завершен")