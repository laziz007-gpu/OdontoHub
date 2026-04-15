#!/usr/bin/env python3
"""
Простой тест авторизации
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_doctor_login():
    """Тест входа врача"""
    print("🔐 Тест входа врача...")
    
    login_data = {
        "phone": "+998901234567",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("access_token")
            print(f"✅ Вход успешен! Токен: {token[:20]}...")
            return token
        else:
            print(f"❌ Ошибка: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return None

def test_doctor_profile(token):
    """Тест профиля врача"""
    print("\n👨‍⚕️ Тест профиля врача...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/dentists/me", headers=headers)
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

def test_notifications_settings(token):
    """Тест настроек уведомлений"""
    print("\n🔔 Тест настроек уведомлений...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/api/notifications/settings", headers=headers)
        print(f"Статус: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Настройки получены: {data}")
            return True
        else:
            print(f"❌ Ошибка: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Исключение: {e}")
        return False

def main():
    print("🧪 Простой тест авторизации")
    print("=" * 40)
    
    # Тест входа врача
    token = test_doctor_login()
    if not token:
        return
    
    # Тест профиля
    profile = test_doctor_profile(token)
    if not profile:
        return
    
    # Тест настроек
    settings_ok = test_notifications_settings(token)
    
    if settings_ok:
        print("\n✅ Все тесты прошли успешно!")
    else:
        print("\n❌ Есть проблемы с настройками")

if __name__ == "__main__":
    main()