#!/usr/bin/env python3
"""
Прямой тест записи через API
"""

import requests

BASE_URL = "http://localhost:8000"

def test_get_appointment():
    """Тест получения записи"""
    print("🧪 Тест получения записи")
    print("=" * 40)
    
    # Вход врача
    print("🔐 Вход врача...")
    login_data = {
        "phone": "+998901234567",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code != 200:
            print(f"❌ Ошибка входа: {response.text}")
            return
        
        token = response.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Получаем записи врача
        print("\n📅 Получение записей врача...")
        response = requests.get(f"{BASE_URL}/appointments/me", headers=headers)
        
        if response.status_code == 200:
            appointments = response.json()
            print(f"✅ Найдено записей: {len(appointments)}")
            
            if appointments:
                # Показываем последнюю запись
                last_appointment = appointments[-1]
                print(f"\nПоследняя запись:")
                print(f"  ID: {last_appointment.get('id')}")
                print(f"  Пациент: {last_appointment.get('patient_name')}")
                print(f"  Врач: {last_appointment.get('dentist_name')}")
                print(f"  Время: {last_appointment.get('start_time')}")
                print(f"  Статус: {last_appointment.get('status')}")
                
                # Получаем конкретную запись
                appointment_id = last_appointment.get('id')
                print(f"\n🔍 Получение записи {appointment_id}...")
                response = requests.get(f"{BASE_URL}/appointments/{appointment_id}", headers=headers)
                
                if response.status_code == 200:
                    appointment = response.json()
                    print(f"✅ Запись получена:")
                    print(f"  ID: {appointment.get('id')}")
                    print(f"  Пациент: {appointment.get('patient_name')}")
                    print(f"  Врач: {appointment.get('dentist_name')}")
                    print(f"  Время: {appointment.get('start_time')}")
                else:
                    print(f"❌ Ошибка получения записи: {response.text}")
            else:
                print("Записей нет")
        else:
            print(f"❌ Ошибка получения записей: {response.text}")
            
    except Exception as e:
        print(f"❌ Исключение: {e}")

if __name__ == "__main__":
    test_get_appointment()