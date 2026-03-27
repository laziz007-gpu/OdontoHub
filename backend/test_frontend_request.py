import requests
import json

def test_frontend_like_request():
    """Тестируем запрос точно как отправляет фронтенд"""
    
    # URL как в фронтенде
    url = "http://127.0.0.1:8000/auth/login"
    
    # Данные как в фронтенде
    phone = input("Введите номер телефона (или Enter для тестового): ").strip()
    if not phone:
        phone = "+998903219459"  # тестовый номер
    
    data = {"phone": phone}
    
    # Заголовки как в фронтенде
    headers = {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
    }
    
    print("🧪 ТЕСТ ЗАПРОСА КАК С ФРОНТЕНДА")
    print("=" * 50)
    print(f"📡 URL: {url}")
    print(f"📱 Phone: {phone}")
    print(f"📄 Headers: {json.dumps(headers, indent=2)}")
    print(f"📦 Data: {json.dumps(data, ensure_ascii=False)}")
    
    try:
        print("\n🔄 Отправляем запрос...")
        
        response = requests.post(
            url,
            json=data,  # Отправляем как JSON
            headers=headers,
            timeout=10
        )
        
        print(f"\n📊 ОТВЕТ:")
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        print(f"   Body: {response.text}")
        
        if response.status_code == 200:
            print(f"\n✅ УСПЕХ! Логин работает")
            token_data = response.json()
            print(f"   Token: {token_data.get('access_token', '')[:50]}...")
            
            # Тестируем /auth/me с полученным токеном
            print(f"\n🔄 Тестируем /auth/me с токеном...")
            me_headers = headers.copy()
            me_headers['Authorization'] = f"Bearer {token_data.get('access_token')}"
            
            me_response = requests.get(
                "http://127.0.0.1:8000/auth/me",
                headers=me_headers,
                timeout=10
            )
            
            print(f"   /auth/me Status: {me_response.status_code}")
            print(f"   /auth/me Body: {me_response.text}")
            
        else:
            print(f"\n❌ ОШИБКА {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data}")
            except:
                print(f"   Raw error: {response.text}")
        
        return response.status_code == 200
        
    except requests.exceptions.ConnectionError:
        print("❌ Сервер недоступен на http://127.0.0.1:8000")
        print("   Проверьте, что бэкенд запущен")
        return False
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

if __name__ == "__main__":
    test_frontend_like_request()