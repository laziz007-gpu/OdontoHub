#!/usr/bin/env python3
"""
Тест регистрации для отладки ошибки 500
"""
import requests
import json

def test_register():
    url = "http://localhost:8000/auth/register"
    
    data = {
        "full_name": "Test User",
        "phone": "+998901234567",
        "email": "test@example.com",
        "password": "password123",
        "role": "patient"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        print(f"Отправляем POST запрос на {url}")
        print(f"Данные: {json.dumps(data, indent=2)}")
        
        response = requests.post(url, json=data, headers=headers)
        
        print(f"Статус: {response.status_code}")
        print(f"Заголовки ответа: {dict(response.headers)}")
        
        if response.status_code == 200:
            print(f"Успех! Ответ: {response.json()}")
        else:
            print(f"Ошибка! Ответ: {response.text}")
            
    except Exception as e:
        print(f"Исключение: {e}")

if __name__ == "__main__":
    test_register()