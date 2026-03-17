import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

try:
    # Assign existing services to Махмуд Пулатов (id=4)
    cur.execute("UPDATE services SET dentist_id = 4 WHERE dentist_id IS NULL")
    
    # Add services for Aziz Saydazxonov (id=6)
    aziz_services = [
        ("Чистка зубов", 100000, 6),
        ("Гигиена полости рта", 80000, 6),
        ("Удаление зубного камня", 120000, 6),
    ]
    for name, price, dentist_id in aziz_services:
        cur.execute(
            "INSERT INTO services (name, price, currency, dentist_id) VALUES (%s, %s, 'UZS', %s)",
            (name, price, dentist_id)
        )
    
    conn.commit()
    
    # Show result
    cur.execute("SELECT s.id, s.name, s.price, d.full_name FROM services s LEFT JOIN dentist_profiles d ON s.dentist_id = d.id ORDER BY d.full_name")
    rows = cur.fetchall()
    print("Services by dentist:")
    for row in rows:
        print(f"  {row[3]} | {row[1]} | {row[2]} UZS")

except Exception as e:
    conn.rollback()
    print(f"❌ Error: {e}")
finally:
    cur.close()
    conn.close()
