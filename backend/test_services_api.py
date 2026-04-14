#!/usr/bin/env python3
"""
Тест API услуг
"""
import requests
import json

def test_services():
    base_url = "http://localhost:8000"
    
    # Сначала логинимся как врач
    login_data = {
        "phone": "+998998200580",
        "password": "password123"
    }
    
    print("=== Логин врача ===")
    login_response = requests.post(f"{base_url}/auth/login", json=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Ошибка логина: {login_response.status_code}")
        print(f"Ответ: {login_response.text}")
        return
    
    token = login_response.json()["access_token"]
    print(f"✅ Логин успешен, токен получен")
    
    # Получаем данные врача
    headers = {"Authorization": f"Bearer {token}"}
    me_response = requests.get(f"{base_url}/auth/me", headers=headers)
    
    if me_response.status_code != 200:
        print(f"❌ Ошибка получения данных врача: {me_response.status_code}")
        return
    
    user_data = me_response.json()
    dentist_id = user_data.get("dentist_id")
    print(f"✅ Данные врача получены, dentist_id: {dentist_id}")
    
    if not dentist_id:
        print("❌ У пользователя нет dentist_id")
        return
    
    # Тестируем создание услуги
    print("\n=== Создание услуги ===")
    service_data = {
        "name": "Тестовая услуга",
        "price": 150000.0,
        "dentist_id": dentist_id
    }
    
    create_response = requests.post(
        f"{base_url}/services/", 
        json=service_data,
        headers=headers
    )
    
    print(f"Статус создания: {create_response.status_code}")
    if create_response.status_code == 200:
        service = create_response.json()
        print(f"✅ Услуга создана: {json.dumps(service, indent=2)}")
        
        # Тестируем получение услуг
        print("\n=== Получение услуг ===")
        get_response = requests.get(f"{base_url}/services/", headers=headers)
        if get_response.status_code == 200:
            services = get_response.json()
            print(f"✅ Найдено услуг: {len(services)}")
            for s in services:
                print(f"  - {s['name']}: {s['price']} {s.get('currency', 'UZS')}")
        else:
            print(f"❌ Ошибка получения услуг: {get_response.status_code}")
            
    else:
        print(f"❌ Ошибка создания услуги: {create_response.text}")

if __name__ == "__main__":
    test_services()