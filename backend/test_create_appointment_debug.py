#!/usr/bin/env python3
"""
Отладка создания записи
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_create_appointment():
    """Тест создания записи с отладкой"""
    print("🧪 Отладка создания записи")
    print("=" * 40)
    
    # Вход пациента
    print("🔐 Вход пациента...")
    login_data = {
        "phone": "+998911111111",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Ошибка входа: {response.text}")
            return
        
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Создаем запись
        print("\n📅 Создание записи...")
        appointment_data = {
            "dentist_id": 2,
            "start_time": "2024-12-31T16:00:00",
            "end_time": "2024-12-31T17:00:00",
            "service": "Консультация",
            "notes": "Отладка с логами"
        }
        
        response = requests.post(f"{BASE_URL}/appointments/", json=appointment_data, headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            appointment = response.json()
            print(f"✅ Запись создана!")
            print("Полный ответ:")
            print(json.dumps(appointment, indent=2, ensure_ascii=False))
        else:
            print(f"❌ Ошибка: {response.text}")
            
    except Exception as e:
        print(f"❌ Исключение: {e}")

if __name__ == "__main__":
    test_create_appointment()