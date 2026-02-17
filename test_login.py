"""
Тестовый скрипт для проверки логина
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("🧪 Тестируем API...")
print("=" * 50)

# Тест 1: Проверка здоровья сервера
print("\n1️⃣ Проверка сервера...")
try:
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        print("✅ Сервер работает!")
    else:
        print(f"❌ Сервер вернул код: {response.status_code}")
        exit(1)
except Exception as e:
    print(f"❌ Сервер не отвечает: {e}")
    print("Запусти сервер: uvicorn app.main:app --reload")
    exit(1)

# Тест 2: Попытка логина
print("\n2️⃣ Тестируем логин...")
login_data = {
    "phone": "+998901234567"
}

try:
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Статус: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Логин успешен!")
        print(f"Токен: {data.get('access_token', 'N/A')[:50]}...")
    elif response.status_code == 401:
        print("❌ Пользователь не найден!")
        print("Создай пользователя: python create_test_user.py")
    else:
        print(f"❌ Ошибка: {response.status_code}")
        print(f"Ответ: {response.text}")
        
except Exception as e:
    print(f"❌ Ошибка при запросе: {e}")

print("\n" + "=" * 50)
print("Тест завершён!")
