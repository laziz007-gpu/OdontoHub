"""
Script to update Mahmud Pulatov's profile in Render PostgreSQL database
"""
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection string
DATABASE_URL = "postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql"

def update_mahmud():
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print("✓ Connected to database\n")
        
        # Update Mahmud Pulatov's profile (ID: 4)
        cur.execute("""
            UPDATE dentist_profiles
            SET 
                specialization = %s,
                phone = %s,
                clinic = %s,
                address = %s,
                work_hours = %s,
                telegram = %s
            WHERE id = 4
            RETURNING full_name
        """, (
            "Терапевт",
            "+998901234567",
            "Стоматология №1",
            "Ташкент, Юнусабад",
            "09:00-18:00",
            "@mahmud_dentist"
        ))
        
        result = cur.fetchone()
        
        if result:
            print(f"✓ Updated profile: {result['full_name']}")
            print("  - Specialization: Терапевт")
            print("  - Phone: +998901234567")
            print("  - Clinic: Стоматология №1")
            print("  - Address: Ташкент, Юнусабад")
            print("  - Work Hours: 09:00-18:00")
            print("  - Telegram: @mahmud_dentist")
        else:
            print("✗ Profile not found")
        
        # Commit changes
        conn.commit()
        
        print("\n✓ Successfully updated!")
        
        # Close connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()

if __name__ == "__main__":
    print("=" * 60)
    print("Updating Mahmud Pulatov's Profile")
    print("=" * 60 + "\n")
    update_mahmud()
