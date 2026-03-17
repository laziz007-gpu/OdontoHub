import requests

def test_api():
    try:
        response = requests.get('http://localhost:8000/dentists/')
        if response.status_code == 200:
            dentists = response.data if hasattr(response, 'data') else response.json()
            print(f"Successfully fetched {len(dentists)} dentists:")
            for d in dentists:
                print(f"- {d.get('full_name')} ({d.get('specialization')})")
        else:
            print(f"Failed to fetch dentists: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
