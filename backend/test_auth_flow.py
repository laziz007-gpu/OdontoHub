#!/usr/bin/env python3
"""
Тест процесса аутентификации
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_auth_flow():
    print("🔐 Тест процесса аутентификации")
    print("=" * 50)
    
    # 1. Тест регистрации пациента
    print("\n1. 📝 Регистрация пациента...")
    register_data = {
        "phone": "+998901234567",
        "email": "test@example.com",
        "password": "test123",
        "role": "patient",
        "full_name": "Тест Пациент"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"Статус: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        print(f"✅ Токен получен: {token[:20]}...")
        
        # 2. Тест /auth/me
        print("\n2. 👤 Проверка /auth/me...")
        headers = {"Authorization": f"Bearer {token}"}
        me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        print(f"Статус: {me_response.status_code}")
        
        if me_response.status_code == 200:
            user_data = me_response.json()
            print(f"✅ Данные пользователя: {json.dumps(user_data, indent=2, ensure_ascii=False)}")
            
            # 3. Тест /dentists/
            print("\n3. 🦷 Проверка /dentists/...")
            dentists_response = requests.get(f"{BASE_URL}/dentists/")
            print(f"Статус: {dentists_response.status_code}")
            
            if dentists_response.status_code == 200:
                dentists = dentists_response.json()
                print(f"✅ Найдено стоматологов: {len(dentists)}")
                if dentists:
                    print(f"Первый стоматолог: {dentists[0].get('full_name', 'Без имени')}")
            else:
                print(f"❌ Ошибка получения стоматологов: {dentists_response.text}")
                
        else:
            print(f"❌ Ошибка /auth/me: {me_response.text}")
            
    else:
        print(f"❌ Ошибка регистрации: {response.text}")
        
        # Попробуем логин с существующим пользователем
        print("\n🔄 Попробуем логин...")
        login_data = {
            "phone": "+998901234567",
            "password": "test123"
        }
        
        login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Статус логина: {login_response.status_code}")
        
        if login_response.status_code == 200:
            data = login_response.json()
            token = data.get("access_token")
            print(f"✅ Токен получен через логин: {token[:20]}...")
            
            # Повторяем тесты
            headers = {"Authorization": f"Bearer {token}"}
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Статус /auth/me: {me_response.status_code}")
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print(f"✅ Данные пользователя: {json.dumps(user_data, indent=2, ensure_ascii=False)}")
            else:
                print(f"❌ Ошибка /auth/me: {me_response.text}")
        else:
            print(f"❌ Ошибка логина: {login_response.text}")

if __name__ == "__main__":
    test_auth_flow()