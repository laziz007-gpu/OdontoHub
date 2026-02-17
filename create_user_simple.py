"""
Простой скрипт для создания пользователя напрямую через SQL
"""
import sqlite3
import os

# Путь к базе данных
db_path = "sql_app.db"

# Проверяем существует ли база
if not os.path.exists(db_path):
    print(f"❌ База данных {db_path} не найдена!")
    exit(1)

print(f"✅ База данных найдена: {db_path}")

# Подключаемся к базе
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Проверяем какие таблицы есть
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print(f"Таблицы в базе: {[t[0] for t in tables]}")

# Проверяем есть ли таблица users
if ('users',) not in tables:
    print("❌ Таблица users не существует!")
    conn.close()
    exit(1)

# Проверяем структуру таблицы users
cursor.execute("PRAGMA table_info(users);")
columns = cursor.fetchall()
print(f"Колонки в users: {[c[1] for c in columns]}")

# Проверяем есть ли уже пользователь
cursor.execute("SELECT * FROM users WHERE phone = '+998901234567'")
existing = cursor.fetchone()

if existing:
    print("✅ Пользователь уже существует!")
    print(f"ID: {existing[0]}, Phone: {existing[1]}")
    
    # Проверяем есть ли профиль
    cursor.execute("SELECT * FROM dentist_profiles WHERE user_id = ?", (existing[0],))
    profile = cursor.fetchone()
    if profile:
        print(f"✅ Профиль стоматолога существует: {profile[2]}")
    else:
        print("⚠️ Профиль стоматолога отсутствует, создаём...")
        cursor.execute("""
            INSERT INTO dentist_profiles (user_id, full_name, verification_status)
            VALUES (?, 'Dr. Test', 'approved')
        """, (existing[0],))
        conn.commit()
        print("✅ Профиль создан!")
else:
    print("Создаём нового пользователя...")
    # Создаём пользователя
    cursor.execute("""
        INSERT INTO users (phone, email, password, role, is_active)
        VALUES ('+998901234567', 'dentist@test.com', NULL, 'dentist', 1)
    """)
    user_id = cursor.lastrowid
    print(f"✅ Пользователь создан! ID: {user_id}")
    
    # Создаём профиль стоматолога
    cursor.execute("""
        INSERT INTO dentist_profiles (user_id, full_name, verification_status)
        VALUES (?, 'Dr. Test', 'approved')
    """, (user_id,))
    
    conn.commit()
    print("✅ Профиль стоматолога создан!")
    print(f"📱 Phone: +998901234567")
    print(f"👨‍⚕️ Role: dentist")
    print(f"✅ Status: approved")

conn.close()
