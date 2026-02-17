"""
Исправляем роль пользователя на UPPERCASE
"""
import sqlite3

conn = sqlite3.connect("sql_app.db")
cursor = conn.cursor()

# Обновляем роль на lowercase (как в коде)
cursor.execute("UPDATE users SET role = 'dentist' WHERE phone = '+998901234567'")
conn.commit()

print("✅ Роль обновлена на DENTIST")

# Проверяем
cursor.execute("SELECT id, phone, role FROM users WHERE phone = '+998901234567'")
user = cursor.fetchone()
if user:
    print(f"ID: {user[0]}, Phone: {user[1]}, Role: {user[2]}")

conn.close()
