import requests
import json

def test_cors_request():
    """Тестируем CORS запрос как с фронтенда"""
    
    # Имитируем запрос с фронтенда (порт 5173)
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',  # Фронтенд origin
        'Referer': 'http://localhost:5173/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    phone = "+998903219459"  # Тестовый номер
    data = {"phone": phone}
    
    print("🧪 ТЕСТ CORS ЗАПРОСА")
    print("=" * 50)
    print(f"📱 Phone: {phone}")
    print(f"📡 Origin: {headers['Origin']}")
    print(f"📄 Headers: {json.dumps(headers, indent=2)}")
    
    try:
        # Сначала OPTIONS запрос (preflight)
        print("\n1️⃣ Отправляем OPTIONS (preflight):")
        options_response = requests.options(
            "http://127.0.0.1:8000/auth/login",
            headers=headers,
            timeout=5
        )
        
        print(f"   Status: {options_response.status_code}")
        print(f"   Headers: {dict(options_response.headers)}")
        
        # Затем POST запрос
        print("\n2️⃣ Отправляем POST:")
        post_response = requests.post(
            "http://127.0.0.1:8000/auth/login",
            json=data,
            headers=headers,
            timeout=10
        )
        
        print(f"   Status: {post_response.status_code}")
        print(f"   Headers: {dict(post_response.headers)}")
        print(f"   Body: {post_response.text}")
        
        if post_response.status_code == 200:
            print(f"\n✅ CORS работает правильно!")
            return True
        else:
            print(f"\n❌ Ошибка: {post_response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

def test_different_phones():
    """Тестируем разные форматы номеров"""
    
    phones = [
        "+998903219459",
        "998903219459", 
        "+99890-321-94-59",
        "+998 90 321 94 59"
    ]
    
    print("\n🧪 ТЕСТ РАЗНЫХ ФОРМАТОВ НОМЕРОВ")
    print("=" * 50)
    
    for phone in phones:
        print(f"\n📱 Тестируем: '{phone}'")
        
        try:
            response = requests.post(
                "http://127.0.0.1:8000/auth/login",
                json={"phone": phone},
                headers={'Content-Type': 'application/json'},
                timeout=5
            )
            
            print(f"   Status: {response.status_code}")
            if response.status_code != 200:
                print(f"   Error: {response.text}")
            else:
                print(f"   ✅ Успех!")
                
        except Exception as e:
            print(f"   ❌ Ошибка: {e}")

if __name__ == "__main__":
    test_cors_request()
    test_different_phones()