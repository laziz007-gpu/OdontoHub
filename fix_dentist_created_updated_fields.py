#!/usr/bin/env python3
"""
Исправление ошибки: добавление полей created_at и updated_at в таблицу dentist_profiles
"""
import sqlite3
import os
from datetime import datetime

def fix_dentist_fields():
    # Путь к базе данных
    db_paths = [
        "app.db",
        "sql_app.db", 
        "Backend/app.db",
        "Backend/sql_app.db"
    ]
    
    db_path = None
    for path in db_paths:
        if os.path.exists(path):
            db_path = path
            break
    
    if not db_path:
        print("❌ База данных SQLite не найдена!")
        print("Проверьте следующие пути:")
        for path in db_paths:
            print(f"  - {path}")
        return False
    
    print(f"📁 Найдена база данных: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Проверяем структуру таблицы
        cursor.execute("PRAGMA table_info(dentist_profiles)")
        columns = [col[1] for col in cursor.fetchall()]
        
        print(f"📋 Текущие колонки в dentist_profiles: {columns}")
        
        fields_to_add = []
        if 'created_at' not in columns:
            fields_to_add.append('created_at')
        if 'updated_at' not in columns:
            fields_to_add.append('updated_at')
        
        if not fields_to_add:
            print("✅ Поля created_at и updated_at уже существуют!")
            return True
        
        print(f"➕ Добавляем поля: {fields_to_add}")
        
        # Добавляем поля
        for field in fields_to_add:
            print(f"   Добавляем {field}...")
            cursor.execute(f"""
                ALTER TABLE dentist_profiles 
                ADD COLUMN {field} TIMESTAMP
            """)
        
        # Устанавливаем текущее время для существующих записей
        current_time = datetime.now().isoformat()
        if 'created_at' in fields_to_add:
            cursor.execute(f"""
                UPDATE dentist_profiles 
                SET created_at = '{current_time}' 
                WHERE created_at IS NULL
            """)
        
        if 'updated_at' in fields_to_add:
            cursor.execute(f"""
                UPDATE dentist_profiles 
                SET updated_at = '{current_time}' 
                WHERE updated_at IS NULL
            """)
        
        conn.commit()
        
        # Проверяем результат
        cursor.execute("PRAGMA table_info(dentist_profiles)")
        new_columns = [col[1] for col in cursor.fetchall()]
        
        print(f"✅ Обновленные колонки: {new_columns}")
        print("✅ Миграция завершена успешно!")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Ошибка при миграции: {e}")
        return False

if __name__ == "__main__":
    print("🔧 Исправление полей created_at и updated_at в dentist_profiles...")
    success = fix_dentist_fields()
    
    if success:
        print("\n🎉 Готово! Теперь можно запускать приложение.")
    else:
        print("\n💥 Миграция не удалась. Проверьте ошибки выше.")