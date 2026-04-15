#!/usr/bin/env python3
"""
Быстрая очистка базы данных
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Читаем DATABASE_URL напрямую из .env файла
def get_database_url():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('DATABASE_URL='):
                    return line.split('=', 1)[1].strip()
    return None

def clear_database():
    """Полная очистка базы данных"""
    try:
        database_url = get_database_url()
        if not database_url:
            print("❌ Не найден DATABASE_URL в .env файле")
            return
            
        print("🧹 Подключение к Neon базе данных...")
        print(f"🔗 URL: {database_url[:50]}...")
        
        conn = psycopg2.connect(database_url)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Удаляем данные в правильном порядке (от зависимых к независимым)
        delete_commands = [
            ("DELETE FROM messages;", "Удаление сообщений"),
            ("DELETE FROM notifications;", "Удаление уведомлений"),
            ("DELETE FROM reviews;", "Удаление отзывов"),
            ("DELETE FROM payments;", "Удаление платежей"),
            ("DELETE FROM prescriptions;", "Удаление рецептов"),
            ("DELETE FROM allergies;", "Удаление аллергий"),
            ("DELETE FROM patient_photos;", "Удаление фото пациентов"),
            ("DELETE FROM complaints;", "Удаление жалоб"),
            ("DELETE FROM days_off;", "Удаление выходных дней"),
            ("DELETE FROM services;", "Удаление услуг"),
            ("DELETE FROM appointments;", "Удаление записей"),
            ("DELETE FROM patient_profiles;", "Удаление профилей пациентов"),
            ("DELETE FROM dentist_profiles;", "Удаление профилей врачей"),
            ("DELETE FROM users;", "Удаление пользователей"),
        ]
        
        print("🗑️  Очистка данных...")
        for sql, description in delete_commands:
            try:
                cursor.execute(sql)
                print(f"   ✅ {description}: {cursor.rowcount} записей")
            except Exception as e:
                print(f"   ⚠️  {description}: {str(e)[:50]}...")
        
        # Сброс счетчиков автоинкремента
        print("🔄 Сброс счетчиков ID...")
        reset_commands = [
            "ALTER SEQUENCE users_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE dentist_profiles_id_seq RESTART WITH 1;", 
            "ALTER SEQUENCE patient_profiles_id_seq RESTART WITH 1;",
            "ALTER SEQUENCE appointments_id_seq RESTART WITH 1;",
        ]
        
        for sql in reset_commands:
            try:
                cursor.execute(sql)
                print(f"   ✅ Сброшен счетчик")
            except Exception as e:
                print(f"   ⚠️  Ошибка сброса: {str(e)[:30]}...")
        
        cursor.close()
        conn.close()
        
        print("\n🎉 База данных успешно очищена!")
        print("Теперь можно тестировать регистрацию с чистого листа.")
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    clear_database()