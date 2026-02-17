"""
Пересоздаём базу данных с правильной структурой
ВАЖНО: Останови backend сервер перед запуском!
"""
import sqlite3
import os

db_path = "sql_app.db"

print("⚠️  ВНИМАНИЕ: Останови backend сервер перед запуском!")
print("Нажми Enter чтобы продолжить или Ctrl+C чтобы отменить...")
input()

# Удаляем старую базу
if os.path.exists(db_path):
    try:
        os.remove(db_path)
        print("✅ Старая база удалена")
    except PermissionError:
        print("❌ ОШИБКА: База данных используется!")
        print("Останови backend сервер и попробуй снова")
        exit(1)

# Создаём новую базу
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("📦 Создаём таблицы...")

# Таблица users БЕЗ enum constraint
cursor.execute("""
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone VARCHAR NOT NULL UNIQUE,
    email VARCHAR,
    password VARCHAR,
    role VARCHAR NOT NULL,
    is_active INTEGER DEFAULT 1
)
""")

# Таблица dentist_profiles
cursor.execute("""
CREATE TABLE dentist_profiles (
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

# Таблица patient_profiles
cursor.execute("""
CREATE TABLE patient_profiles (
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

# Таблица services
cursor.execute("""
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL,
    description VARCHAR,
    price FLOAT,
    duration INTEGER
)
""")

# Таблица appointments
cursor.execute("""
CREATE TABLE appointments (
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

print("✅ Таблицы созданы")

# Создаём тестового пользователя
print("\n👨‍⚕️ Создаём тестового стоматолога...")

cursor.execute("""
    INSERT INTO users (phone, email, password, role, is_active)
    VALUES ('+998901234567', 'dentist@test.com', NULL, 'dentist', 1)
""")
user_id = cursor.lastrowid

cursor.execute("""
    INSERT INTO dentist_profiles (user_id, full_name, verification_status)
    VALUES (?, 'Dr. Test', 'approved')
""", (user_id,))

conn.commit()
conn.close()

print("✅ Пользователь создан!")
print("\n" + "="*50)
print("✅ БАЗА ДАННЫХ ГОТОВА!")
print("="*50)
print(f"📱 Телефон: +998901234567")
print(f"👨‍⚕️ Роль: dentist")
print(f"✅ Статус: approved")
print("\nТеперь запусти backend сервер:")
print("uvicorn app.main:app --reload")
