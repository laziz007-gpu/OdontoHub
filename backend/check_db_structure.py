#!/usr/bin/env python3
"""
Проверка структуры базы данных
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import psycopg2

# Читаем DATABASE_URL напрямую из .env файла
def get_database_url():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('DATABASE_URL='):
                    return line.split('=', 1)[1].strip()
    return None

def check_tables():
    """Проверить все таблицы и их связи"""
    try:
        database_url = get_database_url()
        if not database_url:
            print("❌ Не найден DATABASE_URL в .env файле")
            return
            
        print("🔍 Подключение к базе данных...")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Получить все таблицы
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print("\n📋 Все таблицы в базе данных:")
        for table in tables:
            print(f"   - {table[0]}")
        
        # Получить внешние ключи
        cursor.execute("""
            SELECT 
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            ORDER BY tc.table_name;
        """)
        
        foreign_keys = cursor.fetchall()
        print("\n🔗 Внешние ключи:")
        for fk in foreign_keys:
            print(f"   {fk[0]}.{fk[1]} -> {fk[2]}.{fk[3]}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Ошибка: {e}")

if __name__ == "__main__":
    check_tables()