"""
Исправляем роль пользователя напрямую через SQL
Работает даже если сервер запущен
"""
import sqlite3

db_path = "sql_app.db"

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("🔍 Проверяем текущее состояние...")

# Смотрим что есть в базе
cursor.execute("SELECT id, phone, role FROM users WHERE phone = '+998901234567'")
user = cursor.fetchone()

if user:
    print(f"✅ Пользователь найден: ID={user[0]}, Phone={user[1]}, Role={user[2]}")
    
    # Обновляем роль на lowercase
    cursor.execute("UPDATE users SET role = 'dentist' WHERE phone = '+998901234567'")
    conn.commit()
    
    # Проверяем результат
    cursor.execute("SELECT id, phone, role FROM users WHERE phone = '+998901234567'")
    updated = cursor.fetchone()
    print(f"✅ Роль обновлена: {updated[2]}")
else:
    print("❌ Пользователь не найден!")

conn.close()

print("\n✅ Готово! Теперь перезапусти backend сервер:")
print("1. Останови сервер (Ctrl+C)")
print("2. Запусти снова: uvicorn app.main:app --reload")
