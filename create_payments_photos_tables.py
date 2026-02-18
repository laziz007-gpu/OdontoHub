"""
Migration script to create payments and patient_photos tables
"""
import sqlite3

def migrate():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        # Check if payments table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='payments'")
        payments_exists = cursor.fetchone() is not None
        
        if not payments_exists:
            print("Creating payments table...")
            cursor.execute("""
                CREATE TABLE payments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    appointment_id INTEGER,
                    amount REAL NOT NULL,
                    paid_amount REAL DEFAULT 0.0,
                    service_name VARCHAR(255) NOT NULL,
                    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    status VARCHAR(50) DEFAULT 'unpaid',
                    notes TEXT,
                    recorded_by INTEGER,
                    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
                    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
                    FOREIGN KEY (recorded_by) REFERENCES users(id)
                )
            """)
            cursor.execute("CREATE INDEX idx_payments_patient_id ON payments(patient_id)")
            print("✅ payments table created successfully!")
        else:
            print("⚠️  payments table already exists")
        
        # Check if patient_photos table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='patient_photos'")
        photos_exists = cursor.fetchone() is not None
        
        if not photos_exists:
            print("Creating patient_photos table...")
            cursor.execute("""
                CREATE TABLE patient_photos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    patient_id INTEGER NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    file_url VARCHAR(500) NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    description TEXT,
                    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    uploaded_by INTEGER,
                    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
                    FOREIGN KEY (uploaded_by) REFERENCES users(id)
                )
            """)
            cursor.execute("CREATE INDEX idx_patient_photos_patient_id ON patient_photos(patient_id)")
            print("✅ patient_photos table created successfully!")
        else:
            print("⚠️  patient_photos table already exists")
            
        conn.commit()
        print("\n✅ All tables created successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()
