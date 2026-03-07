"""
Test local dentists endpoint
"""
import requests
import json

try:
    print("Testing http://127.0.0.1:8000/dentists/")
    response = requests.get('http://127.0.0.1:8000/dentists/')
    print(f"Status Code: {response.status_code}")
    print(f"Headers: {response.headers}")
    print(f"Content: {response.text[:500]}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nDentists found: {len(data)}")
        for dentist in data:
            print(f"  - {dentist.get('full_name')} ({dentist.get('specialization')})")
    else:
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()
