"""
Добавляем поле works_photos в таблицу dentist_profiles
"""
import sqlite3
import os

db_path = "sql_app.db"

if not os.path.exists(db_path):
    print(f"❌ База данных {db_path} не найдена!")
    print("Сначала запусти backend сервер чтобы создать базу")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("📦 Добавляем поле works_photos...")

try:
    # Проверяем есть ли уже это поле
    cursor.execute("PRAGMA table_info(dentist_profiles);")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'works_photos' not in columns:
        cursor.execute("""
            ALTER TABLE dentist_profiles 
            ADD COLUMN works_photos TEXT
        """)
        conn.commit()
        print("✅ Поле works_photos добавлено!")
    else:
        print("✅ Поле works_photos уже существует!")
        
except sqlite3.OperationalError as e:
    if "database is locked" in str(e):
        print("❌ База данных заблокирована!")
        print("Останови backend сервер и попробуй снова")
    else:
        print(f"❌ Ошибка: {e}")
except Exception as e:
    print(f"❌ Ошибка: {e}")
finally:
    conn.close()
    
print("Готово! Теперь перезапусти backend сервер")
