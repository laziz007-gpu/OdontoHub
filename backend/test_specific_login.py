import requests
import json

def test_login(phone):
    try:
        url = "http://127.0.0.1:8000/auth/login"
        data = {"phone": phone}
        
        print(f"🔄 Тестируем логин для: {phone}")
        print(f"📡 URL: {url}")
        print(f"📱 Данные: {json.dumps(data, ensure_ascii=False)}")
        
        response = requests.post(
            url, 
            json=data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"\n📊 Статус код: {response.status_code}")
        print(f"📄 Заголовки ответа: {dict(response.headers)}")
        print(f"📝 Тело ответа: {response.text}")
        
        if response.status_code == 200:
            token_data = response.json()
            print(f"\n✅ УСПЕХ! Токен получен:")
            print(f"   Access Token: {token_data.get('access_token', '')[:50]}...")
            print(f"   Token Type: {token_data.get('token_type', '')}")
        else:
            print(f"\n❌ ОШИБКА {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Детали: {error_data}")
            except:
                print(f"   Текст ошибки: {response.text}")
        
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print("❌ Не удается подключиться к серверу на http://127.0.0.1:8000")
        print("   Убедитесь, что сервер запущен")
        return False
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {e}")
        return False

if __name__ == "__main__":
    # Тестируем с существующим номером
    test_phone = "+998903219459"  # Азиз Сайдазхонов (dentist)
    
    print("🧪 ТЕСТ ЛОГИНА")
    print("=" * 50)
    
    success = test_login(test_phone)
    
    print("\n" + "=" * 50)
    print(f"📋 РЕЗУЛЬТАТ: {'✅ УСПЕХ' if success else '❌ НЕУДАЧА'}")