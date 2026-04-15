#!/usr/bin/env python3
"""
Test dentist API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_dentist_api():
    print("=== Testing Dentist API ===")
    
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
    user_info = login_result.get("user", {})
    print(f"✅ Login successful")
    print(f"   Token: {token[:20]}...")
    print(f"   User ID: {user_info.get('id')}")
    print(f"   Role: {user_info.get('role')}")
    
    # Step 2: Get dentist profile
    print("\n2. Getting dentist profile...")
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(f"{BASE_URL}/dentists/me", headers=headers)
    print(f"Dentist profile status: {response.status_code}")
    
    if response.status_code == 200:
        profile = response.json()
        print(f"✅ Dentist profile found:")
        print(f"   Profile ID: {profile.get('id')}")
        print(f"   Full Name: {profile.get('full_name')}")
        print(f"   User ID: {profile.get('user_id')}")
        print(f"   Verification Status: {profile.get('verification_status')}")
        return profile.get('id')  # Return dentist profile ID
    else:
        print(f"❌ Failed to get dentist profile: {response.text}")
        return None

def test_service_with_profile_id(dentist_profile_id):
    print(f"\n=== Testing Service Creation with Profile ID {dentist_profile_id} ===")
    
    # Login again
    login_data = {
        "phone": "+998998200580",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    token = response.json().get("access_token")
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Create service
    service_data = {
        "name": "Лечение кариеса",
        "price": 200000,
        "currency": "UZS"
    }
    
    response = requests.post(f"{BASE_URL}/services/", json=service_data, headers=headers)
    print(f"Service creation status: {response.status_code}")
    
    if response.status_code == 200 or response.status_code == 201:
        service = response.json()
        print(f"✅ Service created:")
        print(f"   ID: {service.get('id')}")
        print(f"   Name: {service.get('name')}")
        print(f"   Price: {service.get('price')} {service.get('currency')}")
        print(f"   Dentist ID: {service.get('dentist_id')}")
        
        if service.get('dentist_id') == dentist_profile_id:
            print(f"✅ Dentist ID matches profile ID!")
        else:
            print(f"❌ Dentist ID mismatch: expected {dentist_profile_id}, got {service.get('dentist_id')}")
    else:
        print(f"❌ Service creation failed: {response.text}")

if __name__ == "__main__":
    try:
        dentist_profile_id = test_dentist_api()
        if dentist_profile_id:
            test_service_with_profile_id(dentist_profile_id)
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()