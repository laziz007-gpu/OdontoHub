#!/usr/bin/env python3
"""
Тест проблемы фронтенда
"""

import requests

BASE_URL = "http://localhost:8000"

def test_patients_endpoint():
    """Тест эндпоинта пациентов"""
    print("🧪 Тест эндпоинта /patients/")
    print("=" * 40)
    
    # Тест без авторизации
    print("1. Запрос без авторизации...")
    response = requests.get(f"{BASE_URL}/patients/")
    print(f"   Статус: {response.status_code}")
    print(f"   Ответ: {response.text}")
    
    # Тест с авторизацией врача
    print("\n2. Запрос с авторизацией врача...")
    login_data = {
        "phone": "+998901234567",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/patients/", headers=headers)
        print(f"   Статус: {response.status_code}")
        if response.status_code == 200:
            patients = response.json()
            print(f"   Пациентов найдено: {len(patients)}")
        else:
            print(f"   Ошибка: {response.text}")
    else:
        print(f"   Ошибка входа: {response.text}")
    
    # Тест с авторизацией пациента
    print("\n3. Запрос с авторизацией пациента...")
    login_data = {
        "phone": "+998911111111",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/patients/", headers=headers)
        print(f"   Статус: {response.status_code}")
        print(f"   Ответ: {response.text}")
    else:
        print(f"   Ошибка входа: {response.text}")

def test_dentists_me():
    """Тест эндпоинта /dentists/me"""
    print("\n🧪 Тест эндпоинта /dentists/me")
    print("=" * 40)
    
    # Тест без авторизации
    print("1. Запрос без авторизации...")
    response = requests.get(f"{BASE_URL}/dentists/me")
    print(f"   Статус: {response.status_code}")
    print(f"   Ответ: {response.text}")
    
    # Тест с авторизацией врача
    print("\n2. Запрос с авторизацией врача...")
    login_data = {
        "phone": "+998901234567",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/dentists/me", headers=headers)
        print(f"   Статус: {response.status_code}")
        if response.status_code == 200:
            dentist = response.json()
            print(f"   Врач: {dentist.get('full_name')}")
        else:
            print(f"   Ошибка: {response.text}")
    else:
        print(f"   Ошибка входа: {response.text}")

if __name__ == "__main__":
    test_patients_endpoint()
    test_dentists_me()