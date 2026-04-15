#!/usr/bin/env python3
"""
Финальный тест системы
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_doctor_workflow():
    """Тест рабочего процесса врача"""
    print("👨‍⚕️ Тест рабочего процесса врача")
    print("=" * 50)
    
    # Вход врача
    print("🔐 Вход врача...")
    login_data = {
        "phone": "+998901234567",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"❌ Ошибка входа врача: {response.text}")
        return False
    
    doctor_token = response.json().get("access_token")
    doctor_headers = {"Authorization": f"Bearer {doctor_token}"}
    print("✅ Врач вошел в систему")
    
    # Проверяем профиль врача
    response = requests.get(f"{BASE_URL}/dentists/me", headers=doctor_headers)
    if response.status_code != 200:
        print(f"❌ Ошибка профиля врача: {response.text}")
        return False
    
    doctor_profile = response.json()
    print(f"✅ Профиль врача: {doctor_profile.get('full_name')}")
    
    # Проверяем настройки уведомлений
    response = requests.get(f"{BASE_URL}/api/notifications/settings", headers=doctor_headers)
    if response.status_code != 200:
        print(f"❌ Ошибка настроек: {response.text}")
        return False
    
    print("✅ Настройки уведомлений получены")
    
    # Получаем записи врача
    response = requests.get(f"{BASE_URL}/appointments/me", headers=doctor_headers)
    if response.status_code != 200:
        print(f"❌ Ошибка получения записей: {response.text}")
        return False
    
    appointments = response.json()
    print(f"✅ Записей врача: {len(appointments)}")
    
    return True

def test_patient_workflow():
    """Тест рабочего процесса пациента"""
    print("\n👤 Тест рабочего процесса пациента")
    print("=" * 50)
    
    # Вход пациента
    print("🔐 Вход пациента...")
    login_data = {
        "phone": "+998911111111",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"❌ Ошибка входа пациента: {response.text}")
        return False
    
    patient_token = response.json().get("access_token")
    patient_headers = {"Authorization": f"Bearer {patient_token}"}
    print("✅ Пациент вошел в систему")
    
    # Проверяем профиль пациента
    response = requests.get(f"{BASE_URL}/patients/me", headers=patient_headers)
    if response.status_code != 200:
        print(f"❌ Ошибка профиля пациента: {response.text}")
        return False
    
    patient_profile = response.json()
    print(f"✅ Профиль пациента: {patient_profile.get('full_name')}")
    
    # Создаем запись
    print("\n📅 Создание записи...")
    appointment_data = {
        "dentist_id": 2,
        "start_time": "2025-01-01T10:00:00",
        "end_time": "2025-01-01T11:00:00",
        "service": "Консультация",
        "notes": "Финальный тест системы"
    }
    
    response = requests.post(f"{BASE_URL}/appointments/", json=appointment_data, headers=patient_headers)
    if response.status_code != 200:
        print(f"❌ Ошибка создания записи: {response.text}")
        return False
    
    appointment = response.json()
    print(f"✅ Запись создана! ID: {appointment.get('id')}")
    print(f"   Пациент: {appointment.get('patient_name')}")
    print(f"   Врач: {appointment.get('dentist_name')}")
    
    # Получаем записи пациента
    response = requests.get(f"{BASE_URL}/appointments/me", headers=patient_headers)
    if response.status_code != 200:
        print(f"❌ Ошибка получения записей пациента: {response.text}")
        return False
    
    patient_appointments = response.json()
    print(f"✅ Записей пациента: {len(patient_appointments)}")
    
    return True

def main():
    print("🧪 ФИНАЛЬНЫЙ ТЕСТ СИСТЕМЫ ODONTOHUB")
    print("=" * 60)
    
    # Тест врача
    doctor_ok = test_doctor_workflow()
    
    # Тест пациента
    patient_ok = test_patient_workflow()
    
    print("\n" + "=" * 60)
    print("РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ:")
    print(f"👨‍⚕️ Врач: {'✅ ОК' if doctor_ok else '❌ ОШИБКА'}")
    print(f"👤 Пациент: {'✅ ОК' if patient_ok else '❌ ОШИБКА'}")
    
    if doctor_ok and patient_ok:
        print("\n🎉 ВСЕ ТЕСТЫ ПРОШЛИ УСПЕШНО!")
        print("Система готова к использованию!")
    else:
        print("\n❌ ЕСТЬ ПРОБЛЕМЫ В СИСТЕМЕ")
        print("Требуется дополнительная отладка")

if __name__ == "__main__":
    main()