"""
Обновляем таблицу notifications: переименовываем metadata в notification_data
"""
import sqlite3
import os

db_path = "sql_app.db"

if not os.path.exists(db_path):
    print(f"❌ База данных {db_path} не найдена!")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("📦 Обновляем таблицу notifications...")

try:
    # Проверяем существующие таблицы
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    existing_tables = [row[0] for row in cursor.fetchall()]
    print(f"Существующие таблицы: {existing_tables}")
    
    if 'notifications' in existing_tables:
        # Проверяем структуру таблицы
        cursor.execute("PRAGMA table_info(notifications)")
        columns = cursor.fetchall()
        column_names = [col[1] for col in columns]
        print(f"Колонки в notifications: {column_names}")
        
        if 'metadata' in column_names and 'notification_data' not in column_names:
            print("Переименовываем metadata в notification_data...")
            
            # SQLite не поддерживает ALTER COLUMN, поэтому создаем новую таблицу
            cursor.execute("""
                CREATE TABLE notifications_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    type VARCHAR(50) NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    is_read BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    notification_data TEXT,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            """)
            
            # Копируем данные
            cursor.execute("""
                INSERT INTO notifications_new 
                (id, user_id, type, title, message, is_read, created_at, notification_data)
                SELECT id, user_id, type, title, message, is_read, created_at, metadata
                FROM notifications
            """)
            
            # Удаляем старую таблицу
            cursor.execute("DROP TABLE notifications")
            
            # Переименовываем новую таблицу
            cursor.execute("ALTER TABLE notifications_new RENAME TO notifications")
            
            # Создаем индексы
            cursor.execute("CREATE INDEX ix_notifications_user_id ON notifications(user_id)")
            cursor.execute("CREATE INDEX ix_notifications_is_read ON notifications(is_read)")
            cursor.execute("CREATE INDEX ix_notifications_created_at ON notifications(created_at)")
            
            print("✅ Таблица notifications обновлена!")
        elif 'notification_data' in column_names:
            print("✅ Таблица notifications уже имеет правильную структуру!")
        else:
            print("⚠️ Таблица notifications не имеет ни metadata, ни notification_data")
    else:
        print("⚠️ Таблица notifications не существует, запустите add_prescription_allergy_notification_tables.py")
    
    conn.commit()
    print("\n✅ Готово!")
    
except sqlite3.OperationalError as e:
    if "database is locked" in str(e):
        print("❌ База данных заблокирована!")
        print("Останови backend сервер и попробуй снова")
    else:
        print(f"❌ Ошибка: {e}")
except Exception as e:
    print(f"❌ Ошибка: {e}")
    conn.rollback()
finally:
    conn.close()
    
print("\nТеперь перезапусти backend сервер")
