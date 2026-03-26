import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

try:
    # Add dentist_id column
    cur.execute("""
        ALTER TABLE services 
        ADD COLUMN IF NOT EXISTS dentist_id INTEGER REFERENCES dentist_profiles(id);
    """)
    
    # Remove unique constraint on name (since different dentists can have same service name)
    cur.execute("""
        ALTER TABLE services DROP CONSTRAINT IF EXISTS services_name_key;
    """)
    
    conn.commit()
    print("✅ Added dentist_id to services table")
    
    # Check current services
    cur.execute("SELECT id, name, price, dentist_id FROM services")
    rows = cur.fetchall()
    print(f"\nCurrent services ({len(rows)}):")
    for row in rows:
        print(f"  ID:{row[0]} | {row[1]} | {row[2]} UZS | dentist_id: {row[3]}")

except Exception as e:
    conn.rollback()
    print(f"❌ Error: {e}")
finally:
    cur.close()
    conn.close()
