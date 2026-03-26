"""
Migration script to add created_at column to patient_profiles table
"""
import sqlite3
from datetime import datetime

def migrate():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(patient_profiles)")
        columns = [col[1] for col in cursor.fetchall()]
        
        if 'created_at' not in columns:
            print("Adding created_at column to patient_profiles...")
            # SQLite doesn't support DEFAULT with functions in ALTER TABLE
            # So we add the column as nullable first, then set default values
            cursor.execute("""
                ALTER TABLE patient_profiles 
                ADD COLUMN created_at TIMESTAMP
            """)
            # Set current timestamp for existing rows
            cursor.execute("""
                UPDATE patient_profiles 
                SET created_at = CURRENT_TIMESTAMP 
                WHERE created_at IS NULL
            """)
            conn.commit()
            print("✅ created_at column added successfully!")
        else:
            print("⚠️  created_at column already exists")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
