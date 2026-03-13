import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Render PostgreSQL connection
conn = psycopg2.connect(os.getenv('DATABASE_URL'))
cur = conn.cursor()

try:
    # Add price column to appointments table
    cur.execute("""
        ALTER TABLE appointments 
        ADD COLUMN IF NOT EXISTS price INTEGER;
    """)
    
    conn.commit()
    print("✅ Successfully added price column to appointments table")
    
except Exception as e:
    conn.rollback()
    print(f"❌ Error: {e}")
finally:
    cur.close()
    conn.close()
