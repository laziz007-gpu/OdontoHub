#!/usr/bin/env python3
"""
Тест API логина
"""
import requests
import json

def test_login():
    url = "http://localhost:8000/auth/login"
    
    data = {
        "phone": "+998901234567",
        "password": "password123"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Тестируем логин...")
        print(f"URL: {url}")
        print(f"Данные: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, headers=headers)
        
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Успешный логин!")
            print(f"Токен: {result.get('access_token', 'НЕТ')[:50]}...")
            
            # Тестируем /auth/me
            token = result.get('access_token')
            if token:
                me_response = requests.get(
                    "http://localhost:8000/auth/me",
                    headers={"Authorization": f"Bearer {token}"}
                )
                print(f"Статус /auth/me: {me_response.status_code}")
                if me_response.status_code == 200:
                    user_data = me_response.json()
                    print(f"Данные пользователя: {json.dumps(user_data, indent=2)}")
                else:
                    print(f"Ошибка /auth/me: {me_response.text}")
        else:
            print(f"❌ Ошибка логина!")
            print(f"Ответ: {response.text}")
            
    except Exception as e:
        print(f"❌ Исключение: {e}")

if __name__ == "__main__":
    test_login()