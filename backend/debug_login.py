#!/usr/bin/env python3
"""
Отладка логина - проверяем что происходит на сервере
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from app.main import app
from app.core.database import get_db
from sqlalchemy.orm import Session

client = TestClient(app)

def debug_login(phone):
    """Отладка логина через TestClient"""
    
    print(f"🧪 ОТЛАДКА ЛОГИНА: {phone}")
    print("=" * 50)
    
    # Проверяем пользователя в БД
    print("1️⃣ Проверка в базе данных:")
    db = next(get_db())
    try:
        from app.models.user import User
        user = db.query(User).filter(User.phone == phone).first()
        
        if user:
            print(f"   ✅ Пользователь найден:")
            print(f"      ID: {user.id}")
            print(f"      Phone: {user.phone}")
            print(f"      Role: {user.role.value}")
            print(f"      Email: {user.email}")
        else:
            print(f"   ❌ Пользователь НЕ найден")
            return False
    finally:
        db.close()
    
    # Тестируем API
    print(f"\n2️⃣ Тестирование API:")
    
    data = {"phone": phone}
    print(f"   Отправляем: {data}")
    
    response = client.post("/auth/login", json=data)
    
    print(f"   Status: {response.status_code}")
    print(f"   Headers: {dict(response.headers)}")
    print(f"   Body: {response.text}")
    
    if response.status_code == 200:
        print(f"   ✅ API работает!")
        
        # Тестируем /auth/me
        token_data = response.json()
        token = token_data.get("access_token")
        
        print(f"\n3️⃣ Тестирование /auth/me:")
        me_response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        print(f"   Status: {me_response.status_code}")
        print(f"   Body: {me_response.text}")
        
        return True
    else:
        print(f"   ❌ API не работает")
        return False

def show_all_users():
    """Показать всех пользователей"""
    print("👥 ВСЕ ПОЛЬЗОВАТЕЛИ В БД:")
    print("-" * 50)
    
    db = next(get_db())
    try:
        from app.models.user import User
        from app.models.patient import PatientProfile
        from app.models.dentist import DentistProfile
        
        users = db.query(User).limit(10).all()
        
        for user in users:
            name = "Не указано"
            if user.role.value == "patient" and user.patient_profile:
                name = user.patient_profile.full_name
            elif user.role.value == "dentist" and user.dentist_profile:
                name = user.dentist_profile.full_name
            
            print(f"ID: {user.id:2} | {user.phone:15} | {user.role.value:8} | {name}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        phone = sys.argv[1]
        debug_login(phone)
    else:
        show_all_users()
        print(f"\nИспользование: python debug_login.py +998903219459")