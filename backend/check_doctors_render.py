"""
Script to check doctors in Render PostgreSQL database
"""
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection string
DATABASE_URL = "postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql"

def check_doctors():
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print("✓ Connected to database\n")
        
        # Get all dentists
        cur.execute("""
            SELECT 
                dp.id,
                dp.full_name,
                dp.specialization,
                dp.phone,
                dp.clinic,
                dp.address,
                dp.work_hours,
                dp.verification_status,
                u.email
            FROM dentist_profiles dp
            JOIN users u ON dp.user_id = u.id
            ORDER BY dp.id
        """)
        
        dentists = cur.fetchall()
        
        if not dentists:
            print("No dentists found in database.")
        else:
            print(f"Found {len(dentists)} dentist(s):\n")
            print("=" * 80)
            
            for i, dentist in enumerate(dentists, 1):
                print(f"\n{i}. {dentist['full_name']}")
                print(f"   ID: {dentist['id']}")
                print(f"   Specialization: {dentist['specialization']}")
                print(f"   Phone: {dentist['phone']}")
                print(f"   Email: {dentist['email']}")
                print(f"   Clinic: {dentist['clinic']}")
                print(f"   Address: {dentist['address']}")
                print(f"   Work Hours: {dentist['work_hours']}")
                print(f"   Status: {dentist['verification_status']}")
                print("-" * 80)
        
        # Close connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")

if __name__ == "__main__":
    print("=" * 80)
    print("Checking Doctors in Render PostgreSQL Database")
    print("=" * 80 + "\n")
    check_doctors()
