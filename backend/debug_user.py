#!/usr/bin/env python3
"""
Отладка пользователя
"""

import requests

BASE_URL = "http://localhost:8000"

def check_user():
    """Проверить пользователя"""
    print("🔍 Проверка пользователя...")
    
    login_data = {
        "phone": "+998901234570",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Статус входа: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            
            # Проверяем информацию о пользователе
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Пользователь найден:")
                print(f"   ID: {user_data.get('id')}")
                print(f"   Телефон: {user_data.get('phone')}")
                print(f"   Роль: {user_data.get('role')}")
                print(f"   Имя: {user_data.get('full_name')}")
                print(f"   Patient ID: {user_data.get('patient_id')}")
                print(f"   Dentist ID: {user_data.get('dentist_id')}")
            else:
                print(f"❌ Ошибка получения данных: {response.text}")
        else:
            print(f"❌ Ошибка входа: {response.text}")
            
    except Exception as e:
        print(f"❌ Исключение: {e}")

if __name__ == "__main__":
    check_user()