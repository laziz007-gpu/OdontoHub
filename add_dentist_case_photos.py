import psycopg2
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Render PostgreSQL connection
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

try:
    # Sample case photos for Махмуд Пулатов (dentist_id = 4)
    case_photos = [
        {
            "id": 1,
            "title": "Отбеливание зубов",
            "before": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
            "after": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400",
            "description": "Профессиональное отбеливание"
        },
        {
            "id": 2,
            "title": "Установка виниров",
            "before": "https://images.unsplash.com/photo-1609840114035-3c981407e31f?w=400",
            "after": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400",
            "description": "Керамические виниры"
        },
        {
            "id": 3,
            "title": "Исправление прикуса",
            "before": "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400",
            "after": "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=400",
            "description": "Ортодонтическое лечение"
        }
    ]
    
    # Update Махмуд Пулатов's profile with case photos
    cur.execute("""
        UPDATE dentist_profiles 
        SET works_photos = %s
        WHERE full_name = 'Махмуд Пулатов'
    """, (json.dumps(case_photos),))
    
    conn.commit()
    print("✅ Successfully added case photos to Махмуд Пулатов's profile")
    print(f"Added {len(case_photos)} cases")
    
except Exception as e:
    conn.rollback()
    print(f"❌ Error: {e}")
finally:
    cur.close()
    conn.close()
