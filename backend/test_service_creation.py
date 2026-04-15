#!/usr/bin/env python3
"""
Test service creation with proper dentist authentication
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_service_creation():
    print("=== Testing Service Creation ===")
    
    # Step 1: Login as dentist
    print("\n1. Logging in as dentist...")
    login_data = {
        "phone": "+998998200580",  # Dentist phone
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Login status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"❌ Login failed: {response.text}")
        return
    
    login_result = response.json()
    token = login_result.get("access_token")
    print(f"✅ Login successful, token: {token[:20]}...")
    
    # Step 2: Test service creation
    print("\n2. Creating service...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    service_data = {
        "name": "Чистка зубов",
        "price": 150000,
        "currency": "UZS"
    }
    
    response = requests.post(f"{BASE_URL}/services/", json=service_data, headers=headers)
    print(f"Service creation status: {response.status_code}")
    
    if response.status_code == 200 or response.status_code == 201:
        service = response.json()
        print(f"✅ Service created successfully:")
        print(f"   ID: {service.get('id')}")
        print(f"   Name: {service.get('name')}")
        print(f"   Price: {service.get('price')} {service.get('currency')}")
        print(f"   Dentist ID: {service.get('dentist_id')}")
    else:
        print(f"❌ Service creation failed: {response.text}")
    
    # Step 3: List services
    print("\n3. Listing all services...")
    response = requests.get(f"{BASE_URL}/services/")
    print(f"Services list status: {response.status_code}")
    
    if response.status_code == 200:
        services = response.json()
        print(f"✅ Found {len(services)} services:")
        for service in services:
            print(f"   - {service.get('name')}: {service.get('price')} {service.get('currency')} (Dentist: {service.get('dentist_id')})")
    else:
        print(f"❌ Failed to list services: {response.text}")

if __name__ == "__main__":
    try:
        test_service_creation()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()