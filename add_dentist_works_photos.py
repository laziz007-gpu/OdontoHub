import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Render PostgreSQL connection
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

try:
    # Add works_photos column to dentist_profiles table
    cur.execute("""
        ALTER TABLE dentist_profiles 
        ADD COLUMN IF NOT EXISTS works_photos TEXT;
    """)
    
    conn.commit()
    print("✅ Successfully added works_photos column to dentist_profiles table")
    
except Exception as e:
    conn.rollback()
    print(f"❌ Error: {e}")
finally:
    cur.close()
    conn.close()
