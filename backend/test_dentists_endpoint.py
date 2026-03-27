#!/usr/bin/env python3
"""
Тест эндпоинта /dentists/
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_dentists():
    print("🦷 Тест эндпоинта /dentists/")
    print("=" * 50)
    
    # 1. Проверяем эндпоинт /dentists/
    print("\n1. 📋 Проверка /dentists/...")
    response = requests.get(f"{BASE_URL}/dentists/")
    print(f"Статус: {response.status_code}")
    
    if response.status_code == 200:
        dentists = response.json()
        print(f"✅ Найдено стоматологов: {len(dentists)}")
        
        if dentists:
            print("\n📋 Список стоматологов:")
            for i, dentist in enumerate(dentists, 1):
                print(f"{i}. {dentist.get('full_name', 'Без имени')} (ID: {dentist.get('id')})")
                print(f"   Статус: {dentist.get('verification_status', 'неизвестно')}")
                print(f"   Специализация: {dentist.get('specialization', 'не указана')}")
                print()
        else:
            print("❌ Список стоматологов пуст!")
            print("💡 Нужно зарегистрировать врачей или проверить статус верификации")
    else:
        print(f"❌ Ошибка: {response.text}")
    
    # 2. Регистрируем тестового врача
    print("\n2. 👨‍⚕️ Регистрация тестового врача...")
    register_data = {
        "phone": "+998902222222",
        "email": "doctor2@example.com", 
        "password": "doctor123",
        "role": "dentist",
        "full_name": "Доктор Новый"
    }
    
    register_response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"Статус регистрации: {register_response.status_code}")
    
    if register_response.status_code == 200:
        print("✅ Врач зарегистрирован")
        
        # Проверяем список снова
        print("\n3. 🔄 Проверка списка после регистрации...")
        response2 = requests.get(f"{BASE_URL}/dentists/")
        if response2.status_code == 200:
            dentists2 = response2.json()
            print(f"✅ Теперь найдено стоматологов: {len(dentists2)}")
            
            if dentists2:
                print("\n📋 Обновленный список:")
                for i, dentist in enumerate(dentists2, 1):
                    print(f"{i}. {dentist.get('full_name', 'Без имени')} (ID: {dentist.get('id')})")
                    print(f"   Статус: {dentist.get('verification_status', 'неизвестно')}")
    else:
        print(f"❌ Ошибка регистрации: {register_response.text}")

if __name__ == "__main__":
    test_dentists()