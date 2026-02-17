"""
Создаем тестовые уведомления для текущего пользователя
"""
import requests
import json

# URL бэкенда
BASE_URL = "http://localhost:8000"

# Токен авторизации (замените на свой)
# Получите токен после логина: localStorage.getItem('access_token')
TOKEN = input("Введите ваш access_token: ").strip()

if not TOKEN:
    print("❌ Токен не указан!")
    exit(1)

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

print("📦 Создаем тестовые уведомления...")

try:
    # Вызываем тестовый endpoint
    response = requests.post(
        f"{BASE_URL}/api/notifications/test/create-sample",
        headers=headers
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Создано {data['count']} тестовых уведомлений!")
        print(f"IDs: {data['notification_ids']}")
    else:
        print(f"❌ Ошибка: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("❌ Не удалось подключиться к бэкенду!")
    print("Убедитесь, что бэкенд запущен на http://localhost:8000")
except Exception as e:
    print(f"❌ Ошибка: {e}")

print("\nГотово! Обновите страницу в браузере")
