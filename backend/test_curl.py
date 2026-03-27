import subprocess
import json

def test_with_curl(phone):
    """Тестируем с помощью curl"""
    
    data = {"phone": phone}
    json_data = json.dumps(data)
    
    curl_command = [
        "curl",
        "-X", "POST",
        "http://127.0.0.1:8000/auth/login",
        "-H", "Content-Type: application/json",
        "-d", json_data,
        "-v"  # verbose для отладки
    ]
    
    print(f"🧪 Тестируем curl с номером: {phone}")
    print(f"📡 Команда: {' '.join(curl_command)}")
    
    try:
        result = subprocess.run(
            curl_command,
            capture_output=True,
            text=True,
            timeout=10
        )
        
        print(f"\n📊 Результат:")
        print(f"   Return code: {result.returncode}")
        print(f"   STDOUT: {result.stdout}")
        print(f"   STDERR: {result.stderr}")
        
        return result.returncode == 0
        
    except subprocess.TimeoutExpired:
        print("❌ Timeout")
        return False
    except FileNotFoundError:
        print("❌ curl не найден")
        return False
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

if __name__ == "__main__":
    test_with_curl("+998903219459")