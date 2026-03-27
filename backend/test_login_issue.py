import os
import requests
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def test_user_in_db(phone):
    """Проверяем пользователя в базе данных"""
    try:
        database_url = os.getenv("DATABASE_URL")
        engine = create_engine(database_url)
        
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT u.id, u.phone, u.role, u.email, 
                       p.full_name as patient_name,
                       d.full_name as dentist_name
                FROM users u
                LEFT JOIN patient_profiles p ON u.id = p.user_id
                LEFT JOIN dentist_profiles d ON u.id = d.user_id
                WHERE u.phone = :phone
            """), {"phone": phone})
            
            user = result.fetchone()
            
            if user:
                print(f"✅ Пользователь найден в БД:")
                print(f"   ID: {user[0]}")
                print(f"   Phone: {user[1]}")
                print(f"   Role: {user[2]}")
                print(f"   Email: {user[3]}")
                print(f"   Name: {user[4] or user[5] or 'Не указано'}")
                return True
            else:
                print(f"❌ Пользователь {phone} НЕ найден в БД")
                return False
                
    except Exception as e:
        print(f"❌ Ошибка БД: {e}")
        return False

def test_login_api(phone):
    """Тестируем API логина"""
    try:
        url = "http://127.0.0.1:8000/auth/login"
        data = {"phone": phone}
        
        print(f"🔄 Отправляем POST запрос на {url}")
        print(f"📱 Данные: {data}")
        
        response = requests.post(url, json=data, timeout=10)
        
        print(f"📊 Статус код: {response.status_code}")
        print(f"📄 Ответ: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"✅ Логин успешен! Токен получен: {token_data.get('access_token', '')[:50]}...")
            return True
        else:
            print(f"❌ Ошибка логина: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Сервер не запущен на http://127.0.0.1:8000")
        return False
    except Exception as e:
        print(f"❌ Ошибка API: {e}")
        return False

def main():
    phone = input("Введите номер телефона для тестирования: ").strip()
    
    if not phone:
        phone = "+998901234567"  # тестовый номер
        print(f"Используем тестовый номер: {phone}")
    
    print("=" * 50)
    print(f"🧪 Тестируем пользователя: {phone}")
    print("=" * 50)
    
    # 1. Проверяем в БД
    print("1️⃣ Проверка в базе данных:")
    db_exists = test_user_in_db(phone)
    
    print("\n" + "-" * 30)
    
    # 2. Тестируем API
    print("2️⃣ Тестирование API логина:")
    api_works = test_login_api(phone)
    
    print("\n" + "=" * 50)
    print("📋 РЕЗУЛЬТАТ:")
    print(f"   БД: {'✅ Пользователь найден' if db_exists else '❌ Пользователь не найден'}")
    print(f"   API: {'✅ Логин работает' if api_works else '❌ Ошибка логина'}")
    
    if db_exists and not api_works:
        print("\n🔍 ДИАГНОЗ: Пользователь есть в БД, но API не работает")
        print("   Возможные причины:")
        print("   - Сервер не запущен")
        print("   - Ошибка в коде аутентификации")
        print("   - Проблема с JWT токенами")

if __name__ == "__main__":
    main()