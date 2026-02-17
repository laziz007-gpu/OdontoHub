"""
Добавляем таблицы prescriptions, allergies и notifications в базу данных
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

print("📦 Добавляем новые таблицы...")

try:
    # Проверяем существующие таблицы
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    existing_tables = [row[0] for row in cursor.fetchall()]
    print(f"Существующие таблицы: {existing_tables}")
    
    # Создаем таблицу prescriptions
    if 'prescriptions' not in existing_tables:
        cursor.execute("""
            CREATE TABLE prescriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                medication_name VARCHAR(255) NOT NULL,
                dosage VARCHAR(100) NOT NULL,
                frequency VARCHAR(100) NOT NULL,
                duration VARCHAR(100) NOT NULL,
                notes TEXT,
                prescribed_by INTEGER NOT NULL,
                prescribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
                FOREIGN KEY (prescribed_by) REFERENCES users(id)
            )
        """)
        cursor.execute("CREATE INDEX ix_prescriptions_patient_id ON prescriptions(patient_id)")
        cursor.execute("CREATE INDEX ix_prescriptions_prescribed_at ON prescriptions(prescribed_at)")
        print("✅ Таблица prescriptions создана!")
    else:
        print("✅ Таблица prescriptions уже существует!")
    
    # Создаем таблицу allergies
    if 'allergies' not in existing_tables:
        cursor.execute("""
            CREATE TABLE allergies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                allergen_name VARCHAR(255) NOT NULL,
                reaction_type VARCHAR(255) NOT NULL,
                severity VARCHAR(20) NOT NULL,
                notes TEXT,
                documented_by INTEGER NOT NULL,
                documented_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patient_profiles(id) ON DELETE CASCADE,
                FOREIGN KEY (documented_by) REFERENCES users(id)
            )
        """)
        cursor.execute("CREATE INDEX ix_allergies_patient_id ON allergies(patient_id)")
        cursor.execute("CREATE INDEX ix_allergies_documented_at ON allergies(documented_at)")
        print("✅ Таблица allergies создана!")
    else:
        print("✅ Таблица allergies уже существует!")
    
    # Создаем таблицу notifications
    if 'notifications' not in existing_tables:
        cursor.execute("""
            CREATE TABLE notifications (
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
        cursor.execute("CREATE INDEX ix_notifications_user_id ON notifications(user_id)")
        cursor.execute("CREATE INDEX ix_notifications_is_read ON notifications(is_read)")
        cursor.execute("CREATE INDEX ix_notifications_created_at ON notifications(created_at)")
        print("✅ Таблица notifications создана!")
    else:
        print("✅ Таблица notifications уже существует!")
    
    conn.commit()
    print("\n✅ Все таблицы успешно созданы!")
    
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
    
print("\nГотово! Теперь перезапусти backend сервер")
