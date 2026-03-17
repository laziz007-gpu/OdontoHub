"""
Script to add doctors to Render PostgreSQL database
"""
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection string
DATABASE_URL = "postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql"

def add_doctors():
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        print("✓ Connected to database")
        
        # Check if doctors already exist
        cur.execute("SELECT COUNT(*) as count FROM dentist_profiles")
        result = cur.fetchone()
        existing_count = result['count']
        
        if existing_count > 0:
            print(f"✓ Database already has {existing_count} dentist(s)")
            response = input("Do you want to add more doctors? (yes/no): ")
            if response.lower() != 'yes':
                print("Cancelled.")
                return
        
        # Doctors data
        doctors_data = [
            {
                "phone": "+998901234567",
                "email": "mahmud.pulatov@dental.uz",
                "full_name": "Махмуд Пулатов",
                "specialization": "Терапевт",
                "clinic": "Стоматология №1",
                "address": "Ташкент, Юнусабад",
                "work_hours": "09:00-18:00",
                "telegram": "@mahmud_dentist",
            },
            {
                "phone": "+998901234568",
                "email": "aziza.karimova@dental.uz",
                "full_name": "Азиза Каримова",
                "specialization": "Ортодонт",
                "clinic": "Smile Clinic",
                "address": "Ташкент, Мирабад",
                "work_hours": "10:00-19:00",
                "instagram": "@aziza_orthodontist",
            },
            {
                "phone": "+998901234569",
                "email": "rustam.alimov@dental.uz",
                "full_name": "Рустам Алимов",
                "specialization": "Хирург",
                "clinic": "Dental Care Center",
                "address": "Ташкент, Чиланзар",
                "work_hours": "08:00-17:00",
                "whatsapp": "+998901234569",
            }
        ]
        
        for doctor_data in doctors_data:
            # Check if user with this phone already exists
            cur.execute("SELECT id FROM users WHERE phone = %s", (doctor_data["phone"],))
            existing_user = cur.fetchone()
            
            if existing_user:
                print(f"⚠ User with phone {doctor_data['phone']} already exists, skipping...")
                continue
            
            # Create user
            cur.execute("""
                INSERT INTO users (phone, email, password, role)
                VALUES (%s, %s, NULL, 'dentist')
                RETURNING id
            """, (doctor_data["phone"], doctor_data["email"]))
            
            user_id = cur.fetchone()['id']
            
            # Create dentist profile
            cur.execute("""
                INSERT INTO dentist_profiles 
                (user_id, full_name, specialization, phone, address, clinic, work_hours, telegram, instagram, whatsapp, verification_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'approved')
            """, (
                user_id,
                doctor_data["full_name"],
                doctor_data["specialization"],
                doctor_data["phone"],
                doctor_data.get("address"),
                doctor_data.get("clinic"),
                doctor_data.get("work_hours"),
                doctor_data.get("telegram"),
                doctor_data.get("instagram"),
                doctor_data.get("whatsapp")
            ))
            
            print(f"✓ Created dentist: {doctor_data['full_name']}")
        
        # Commit changes
        conn.commit()
        
        # Show final count
        cur.execute("SELECT COUNT(*) as count FROM dentist_profiles")
        result = cur.fetchone()
        total_count = result['count']
        
        print(f"\n✓ Successfully completed! Total dentists in database: {total_count}")
        
        # Close connection
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()

if __name__ == "__main__":
    print("=" * 50)
    print("Adding Doctors to Render PostgreSQL Database")
    print("=" * 50)
    add_doctors()
