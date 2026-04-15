#!/usr/bin/env python3
"""
Тест существующего пациента
"""

import requests

BASE_URL = "http://localhost:8000"

def test_patient():
    """Тест пациента"""
    print("🧪 Тест существующего пациента")
    print("=" * 40)
    
    # Вход пациента
    print("🔐 Вход пациента...")
    login_data = {
        "phone": "+998911111111",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Статус входа: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Ошибка входа: {response.text}")
            return
        
        data = response.json()
        token = data.get("access_token")
        print("✅ Вход успешен!")
        
        # Проверяем информацию о пользователе
        print("\n👤 Информация о пользователе...")
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ Пользователь: {user_data.get('full_name')} (роль: {user_data.get('role')})")
        else:
            print(f"❌ Ошибка получения данных: {response.text}")
            return
        
        # Проверяем профиль пациента
        print("\n👤 Профиль пациента...")
        response = requests.get(f"{BASE_URL}/patients/me", headers=headers)
        
        if response.status_code == 200:
            patient_data = response.json()
            print(f"✅ Профиль пациента: {patient_data.get('full_name')}")
        else:
            print(f"❌ Ошибка профиля: {response.text}")
            return
        
        # Создаем запись
        print("\n📅 Создание записи...")
        appointment_data = {
            "dentist_id": 2,
            "start_time": "2024-12-28T11:00:00",
            "end_time": "2024-12-28T12:00:00",
            "service": "Консультация",
            "notes": "Тестовая запись от пациента"
        }
        
        response = requests.post(f"{BASE_URL}/appointments/", json=appointment_data, headers=headers)
        print(f"Статус создания записи: {response.status_code}")
        
        if response.status_code == 200:
            appointment = response.json()
            print(f"✅ Запись создана! ID: {appointment.get('id')}")
            print(f"   Пациент: {appointment.get('patient_name')}")
            print(f"   Врач: {appointment.get('dentist_name')}")
            print(f"   Время: {appointment.get('start_time')}")
        else:
            print(f"❌ Ошибка создания записи: {response.text}")
            
    except Exception as e:
        print(f"❌ Исключение: {e}")

if __name__ == "__main__":
    test_patient()