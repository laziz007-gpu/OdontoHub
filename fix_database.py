"""
ФИНАЛЬНОЕ РЕШЕНИЕ - создаём базу данных с нуля
"""
import sqlite3
import os

db_path = "sql_app.db"

# Подключаемся к базе (создаст если не существует)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("📦 Создаём таблицы (если не существуют)...")

# Создаём таблицу users
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone VARCHAR NOT NULL UNIQUE,
    email VARCHAR,
    password VARCHAR,
    role VARCHAR NOT NULL,
    is_active INTEGER DEFAULT 1
)
""")
print("✅ Таблица users создана")

# Создаём таблицу dentist_profiles
cursor.execute("""
CREATE TABLE IF NOT EXISTS dentist_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name VARCHAR NOT NULL,
    pinfl VARCHAR,
    diploma_number VARCHAR,
    verification_status VARCHAR DEFAULT 'pending',
    specialization VARCHAR,
    address VARCHAR,
    clinic VARCHAR,
    schedule VARCHAR,
    work_hours VARCHAR,
    telegram VARCHAR,
    instagram VARCHAR,
    whatsapp VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")
print("✅ Таблица dentist_profiles создана")

# Создаём таблицу patient_profiles
cursor.execute("""
CREATE TABLE IF NOT EXISTS patient_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name VARCHAR NOT NULL,
    date_of_birth DATE,
    gender VARCHAR,
    address VARCHAR,
    pinfl VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")
print("✅ Таблица patient_profiles создана")

# Создаём таблицу services
cursor.execute("""
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL,
    description VARCHAR,
    price FLOAT,
    duration INTEGER
)
""")
print("✅ Таблица services создана")

# Создаём таблицу appointments
cursor.execute("""
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    dentist_id INTEGER NOT NULL,
    service_id INTEGER,
    appointment_date DATETIME NOT NULL,
    status VARCHAR DEFAULT 'scheduled',
    notes VARCHAR,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (dentist_id) REFERENCES dentist_profiles(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
)
""")
print("✅ Таблица appointments создана")

conn.commit()

print("\n👨‍⚕️ Создаём тестового стоматолога...")

# Проверяем есть ли уже пользователь
cursor.execute("SELECT id FROM users WHERE phone = '+998901234567'")
existing = cursor.fetchone()

if existing:
    print(f"✅ Пользователь уже существует! ID: {existing[0]}")
    user_id = existing[0]
    
    # Проверяем профиль
    cursor.execute("SELECT id FROM dentist_profiles WHERE user_id = ?", (user_id,))
    profile = cursor.fetchone()
    if not profile:
        cursor.execute("""
            INSERT INTO dentist_profiles (user_id, full_name, verification_status)
            VALUES (?, 'Dr. Test', 'approved')
        """, (user_id,))
        conn.commit()
        print("✅ Профиль стоматолога создан!")
    else:
        print("✅ Профиль стоматолога уже существует!")
else:
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

conn.close()

print("\n" + "="*50)
print("✅ ВСЁ ГОТОВО!")
print("="*50)
print(f"📱 Телефон: +998901234567")
print(f"👨‍⚕️ Роль: dentist")
print(f"✅ Статус: approved")
print("\nТеперь можешь войти в систему!")
