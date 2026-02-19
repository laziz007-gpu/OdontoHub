"""
Script to seed production database with test data
Run this after deployment to add initial services and test patients
"""
import requests
import json

# Your production API URL
API_URL = "https://odontohub.onrender.com"

# First, you need to login as dentist to get access token
# Replace with your actual dentist credentials
DENTIST_PHONE = "+998901234567"  # Change this to your dentist phone

def login():
    """Login and get access token"""
    response = requests.post(
        f"{API_URL}/auth/login",
        json={"phone": DENTIST_PHONE}
    )
    if response.status_code == 200:
        data = response.json()
        return data.get("access_token")
    else:
        print(f"Login failed: {response.status_code} - {response.text}")
        return None

def add_services(token):
    """Add test services"""
    services = [
        {"name": "Консультация", "price": 50000},
        {"name": "Чистка зубов", "price": 150000},
        {"name": "Пломбирование", "price": 200000},
        {"name": "Удаление зуба", "price": 100000},
        {"name": "Отбеливание", "price": 500000},
        {"name": "Установка коронки", "price": 800000},
        {"name": "Имплантация", "price": 2000000},
        {"name": "Брекеты", "price": 3000000},
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    for service in services:
        response = requests.post(
            f"{API_URL}/services/",
            json=service,
            headers=headers
        )
        if response.status_code == 200:
            print(f"✅ Added service: {service['name']}")
        else:
            print(f"❌ Failed to add service {service['name']}: {response.text}")

def add_test_patients(token):
    """Add test patients"""
    patients = [
        {
            "full_name": "Иванов Иван Иванович",
            "phone": "+998901111111",
            "birth_date": "1990-05-15",
            "gender": "male",
            "address": "Ташкент, ул. Навои 10",
            "source": "doctor_added"
        },
        {
            "full_name": "Петрова Мария Сергеевна",
            "phone": "+998902222222",
            "birth_date": "1985-08-20",
            "gender": "female",
            "address": "Ташкент, ул. Амира Темура 25",
            "source": "doctor_added"
        },
        {
            "full_name": "Сидоров Петр Александрович",
            "phone": "+998903333333",
            "birth_date": "1995-03-10",
            "gender": "male",
            "address": "Ташкент, ул. Мустакиллик 5",
            "source": "doctor_added"
        },
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    for patient in patients:
        response = requests.post(
            f"{API_URL}/patients/",
            json=patient,
            headers=headers
        )
        if response.status_code == 200:
            print(f"✅ Added patient: {patient['full_name']}")
        else:
            print(f"❌ Failed to add patient {patient['full_name']}: {response.text}")

def main():
    print("🚀 Starting to seed production database...")
    print(f"📍 API URL: {API_URL}")
    print(f"📱 Dentist phone: {DENTIST_PHONE}")
    print()
    
    # Login
    print("🔐 Logging in...")
    token = login()
    if not token:
        print("❌ Failed to login. Please check your credentials.")
        return
    
    print("✅ Login successful!")
    print()
    
    # Add services
    print("📋 Adding services...")
    add_services(token)
    print()
    
    # Add test patients
    print("👥 Adding test patients...")
    add_test_patients(token)
    print()
    
    print("✅ Done! Check your application.")

if __name__ == "__main__":
    main()
