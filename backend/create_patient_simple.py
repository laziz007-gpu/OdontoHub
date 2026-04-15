#!/usr/bin/env python3
"""
Создание пациента
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def create_patient():
    """Создать пациента"""
    print("👤 Создание пациента...")
    
    patient_data = {
        "phone": "+998901234571",
        "password": "password123", 
        "role": "patient",
        "full_name": "Тестовый Пациент Новый",
        "age": 25,
        "gender": "male"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=patient_data)
        print(f"Статус регистрации: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Пациент создан!")
            return data.get("access_token")
        else:
            print(f"❌ Ошибка: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return None

def login_patient():
    """Вход пациента"""
    print("\n🔐 Вход пациента...")
    
    login_data = {
        "phone": "+998901234571",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Статус входа: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Вход успешен!")
            return data.get("access_token")
        else:
            print(f"❌ Ошибка: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return None

def test_patient_profile(token):
    """Тест профиля пациента"""
    print("\n👤 Проверка профиля пациента...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/patients/me", headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Профиль: {data.get('full_name')}")
            return data
        else:
            print(f"❌ Ошибка: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return None

def create_appointment(token):
    """Создать запись"""
    print("\n📅 Создание записи...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    appointment_data = {
        "dentist_id": 2,
        "start_time": "2024-12-25T10:00:00",
        "end_time": "2024-12-25T11:00:00", 
        "service": "Консультация",
        "notes": "Тестовая запись"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/appointments/", json=appointment_data, headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Запись создана! ID: {data.get('id')}")
            return True
        else:
            print(f"❌ Ошибка: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def main():
    print("🧪 Тест создания пациента и записи")
    print("=" * 40)
    
    # Создаем пациента
    token = create_patient()
    if not token:
        # Пробуем войти существующим
        token = login_patient()
        if not token:
            return
    
    # Проверяем профиль
    profile = test_patient_profile(token)
    if not profile:
        return
    
    # Создаем запись
    success = create_appointment(token)
    
    if success:
        print("\n✅ Все работает!")
    else:
        print("\n❌ Проблемы с записью")

if __name__ == "__main__":
    main()