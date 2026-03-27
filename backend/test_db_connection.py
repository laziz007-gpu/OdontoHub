#!/usr/bin/env python3
"""
Тест подключения к базе данных
"""

import requests

BASE_URL = "http://127.0.0.1:8000"

def test_db_connection():
    print("🗄️ Тест подключения к базе данных")
    print("=" * 50)
    
    # Используем debug эндпоинт
    response = requests.get(f"{BASE_URL}/debug-db")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Подключение к БД успешно!")
        print(f"📊 Тип БД: {data.get('db_type', 'неизвестно')}")
        print(f"🔗 URL замаскирован: {data.get('engine_url_masked', 'неизвестно')}")
        print(f"📋 Таблиц в БД: {len(data.get('tables_in_db', []))}")
        
        tables = data.get('tables_in_db', [])
        if tables:
            print("\n📋 Список таблиц:")
            for table in tables:
                print(f"  - {table}")
        
        # Проверяем есть ли таблица messages для чата
        if 'messages' in tables:
            print("\n✅ Таблица messages найдена - чат готов к работе!")
        else:
            print("\n❌ Таблица messages не найдена - нужно создать")
            
    else:
        print(f"❌ Ошибка подключения: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_db_connection()