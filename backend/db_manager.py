#!/usr/bin/env python3
"""
Database Manager - управление базой данных Neon
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from app.core.config import settings

def get_db_connection():
    """Получить подключение к базе данных"""
    try:
        conn = psycopg2.connect(settings.DATABASE_URL)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        return conn
    except Exception as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        return None

def execute_sql(sql_command, description=""):
    """Выполнить SQL команду"""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        cursor.execute(sql_command)
        
        if cursor.rowcount >= 0:
            print(f"   ✅ {description}: {cursor.rowcount} записей")
        else:
            print(f"   ✅ {description}: выполнено")
        
        cursor.close()
        return True
    except Exception as e:
        print(f"   ❌ {description}: {e}")
        return False
    finally:
        conn.close()

def clear_all_data():
    """Полная очистка всех данных"""
    print("🧹 Полная очистка базы данных...")
    
    # Отключаем проверки внешних ключей
    execute_sql("SET session_replication_role = replica;", "Отключение FK проверок")
    
    # Список таблиц для очистки
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
    
    # Очищаем каждую таблицу
    for table in tables:
        execute_sql(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE;", f"Очистка {table}")
    
    # Включаем проверки внешних ключей обратно
    execute_sql("SET session_replication_role = DEFAULT;", "Включение FK проверок")
    
    print("\n🎉 База данных полностью очищена!")

def clear_users_only():
    """Очистка только пользователей и их профилей"""
    print("👥 Очистка пользователей...")
    
    # Удаляем в правильном порядке
    execute_sql("DELETE FROM dentist_profiles;", "Удаление профилей врачей")
    execute_sql("DELETE FROM patient_profiles;", "Удаление профилей пациентов") 
    execute_sql("DELETE FROM users;", "Удаление пользователей")
    
    print("\n✅ Пользователи очищены!")

def show_database_status():
    """Показать статус базы данных"""
    print("📊 Статус базы данных:")
    
    tables = [
        'users',
        'dentist_profiles', 
        'patient_profiles',
        'appointments',
        'messages',
        'notifications'
    ]
    
    conn = get_db_connection()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        for table in tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table};")
                count = cursor.fetchone()[0]
                print(f"   📋 {table}: {count} записей")
            except Exception as e:
                print(f"   ❌ {table}: ошибка - {e}")
        cursor.close()
    finally:
        conn.close()

def create_test_users():
    """Создать тестовых пользователей"""
    print("👤 Создание тестовых пользователей...")
    
    # Создаем врача
    doctor_sql = """
    INSERT INTO users (phone, email, password, role) 
    VALUES ('+998901234567', 'doctor@test.com', 'password123', 'dentist') 
    RETURNING id;
    """
    
    # Создаем пациента
    patient_sql = """
    INSERT INTO users (phone, email, password, role) 
    VALUES ('+998911111111', 'patient@test.com', 'password123', 'patient') 
    RETURNING id;
    """
    
    conn = get_db_connection()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        # Создаем врача
        cursor.execute(doctor_sql)
        doctor_id = cursor.fetchone()[0]
        print(f"   ✅ Создан врач с ID: {doctor_id}")
        
        # Создаем профиль врача
        cursor.execute("""
            INSERT INTO dentist_profiles (user_id, full_name, verification_status) 
            VALUES (%s, 'Тестовый Врач', 'approved');
        """, (doctor_id,))
        print(f"   ✅ Создан профиль врача")
        
        # Создаем пациента
        cursor.execute(patient_sql)
        patient_id = cursor.fetchone()[0]
        print(f"   ✅ Создан пациент с ID: {patient_id}")
        
        # Создаем профиль пациента
        cursor.execute("""
            INSERT INTO patient_profiles (user_id, full_name) 
            VALUES (%s, 'Тестовый Пациент');
        """, (patient_id,))
        print(f"   ✅ Создан профиль пациента")
        
        cursor.close()
        print("\n🎉 Тестовые пользователи созданы!")
        
    except Exception as e:
        print(f"❌ Ошибка создания пользователей: {e}")
    finally:
        conn.close()

def main():
    """Главное меню"""
    while True:
        print("\n" + "="*50)
        print("🗄️  МЕНЕДЖЕР БАЗЫ ДАННЫХ NEON")
        print("="*50)
        print("1. 📊 Показать статус БД")
        print("2. 🧹 Полная очистка БД")
        print("3. 👥 Очистить только пользователей")
        print("4. 👤 Создать тестовых пользователей")
        print("5. 🚪 Выход")
        print("="*50)
        
        choice = input("Выберите действие (1-5): ").strip()
        
        if choice == '1':
            show_database_status()
        elif choice == '2':
            confirm = input("⚠️  Вы уверены? Это удалит ВСЕ данные! (да/нет): ").strip().lower()
            if confirm in ['да', 'yes', 'y']:
                clear_all_data()
            else:
                print("❌ Отменено")
        elif choice == '3':
            confirm = input("⚠️  Удалить всех пользователей? (да/нет): ").strip().lower()
            if confirm in ['да', 'yes', 'y']:
                clear_users_only()
            else:
                print("❌ Отменено")
        elif choice == '4':
            create_test_users()
        elif choice == '5':
            print("👋 До свидания!")
            break
        else:
            print("❌ Неверный выбор!")

if __name__ == "__main__":
    main()