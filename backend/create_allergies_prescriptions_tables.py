"""
Migration script to create allergies and prescriptions tables
"""
import sqlite3

def migrate():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        # Check if allergies table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='allergies'")
        allergies_exists = cursor.fetchone() is not None
        
        if not allergies_exists:
            print("Creating allergies table...")
            cursor.execute("""
                CREATE TABLE allergies (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    allergen VARCHAR NOT NULL,
                    severity VARCHAR,
                    reaction VARCHAR,
                    notes VARCHAR,
                    recorded_by INTEGER,
                    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
                    FOREIGN KEY (recorded_by) REFERENCES users(id)
                )
            """)
            print("✅ allergies table created successfully!")
        else:
            print("⚠️  allergies table already exists")
        
        # Check if prescriptions table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='prescriptions'")
        prescriptions_exists = cursor.fetchone() is not None
        
        if not prescriptions_exists:
            print("Creating prescriptions table...")
            cursor.execute("""
                CREATE TABLE prescriptions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    medication_name VARCHAR NOT NULL,
                    dosage VARCHAR,
                    frequency VARCHAR,
                    duration VARCHAR,
                    instructions VARCHAR,
                    prescribed_by INTEGER,
                    prescribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
                    FOREIGN KEY (prescribed_by) REFERENCES users(id)
                )
            """)
            print("✅ prescriptions table created successfully!")
        else:
            print("⚠️  prescriptions table already exists")
            
        conn.commit()
        print("\n✅ All tables created successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
