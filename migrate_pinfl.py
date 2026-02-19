"""
Migration script to make pinfl field nullable in dentist_profiles table
"""
import sqlite3

# Connect to the database
conn = sqlite3.connect('sql_app.db')
cursor = conn.cursor()

try:
    # SQLite doesn't support ALTER COLUMN directly, so we need to:
    # 1. Create a new table with the correct schema
    # 2. Copy data from old table
    # 3. Drop old table
    # 4. Rename new table
    
    print("Creating new table with nullable pinfl...")
    cursor.execute("""
        CREATE TABLE dentist_profiles_new (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL UNIQUE,
            full_name VARCHAR NOT NULL,
            pinfl VARCHAR,
            diploma_number VARCHAR,
            verification_status VARCHAR NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users (id)
        )
    """)
    
    print("Copying data from old table...")
    cursor.execute("""
        INSERT INTO dentist_profiles_new (id, user_id, full_name, pinfl, diploma_number, verification_status)
        SELECT id, user_id, full_name, pinfl, diploma_number, verification_status
        FROM dentist_profiles
    """)
    
    print("Dropping old table...")
    cursor.execute("DROP TABLE dentist_profiles")
    
    print("Renaming new table...")
    cursor.execute("ALTER TABLE dentist_profiles_new RENAME TO dentist_profiles")
    
    conn.commit()
    print("✅ Migration completed successfully!")
    
except sqlite3.Error as e:
    print(f"❌ Error during migration: {e}")
    conn.rollback()
    
finally:
    conn.close()
