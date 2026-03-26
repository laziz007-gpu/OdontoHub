"""
Add 2 dentists to Render PostgreSQL database
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Render database URL
DATABASE_URL = "postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql"

def add_dentists():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        print("Connecting to Render database...")
        
        # First, create 2 users for dentists
        print("\n1. Creating users...")
        
        # Check if users already exist
        result = db.execute(text("""
            SELECT id, phone FROM users WHERE role = 'dentist' LIMIT 5
        """))
        existing_users = result.fetchall()
        print(f"Existing dentist users: {len(existing_users)}")
        for user in existing_users:
            print(f"  User ID: {user[0]}, Phone: {user[1]}")
        
        # Create first dentist user if not exists
        result = db.execute(text("""
            INSERT INTO users (phone, email, role, password, is_active)
            VALUES ('+998901234567', 'dentist1@odonto.uz', 'dentist', NULL, TRUE)
            ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
            RETURNING id
        """))
        user1_id = result.fetchone()[0]
        db.commit()
        print(f"✓ User 1 created/found: ID {user1_id}")
        
        # Create second dentist user if not exists
        result = db.execute(text("""
            INSERT INTO users (phone, email, role, password, is_active)
            VALUES ('+998901234568', 'dentist2@odonto.uz', 'dentist', NULL, TRUE)
            ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
            RETURNING id
        """))
        user2_id = result.fetchone()[0]
        db.commit()
        print(f"✓ User 2 created/found: ID {user2_id}")
        
        # Now create dentist profiles
        print("\n2. Creating dentist profiles...")
        
        # First dentist - Махмуд Пулатов
        db.execute(text("""
            INSERT INTO dentist_profiles (
                user_id, full_name, verification_status, 
                specialization, phone, address, clinic, 
                schedule, work_hours, telegram, instagram, whatsapp
            )
            VALUES (
                :user_id, 'Махмуд Пулатов', 'approved',
                'Ортодонтия', '+998901234567', 'Ташкент, Юнусабад', 'Стоматология №1',
                'Пн-Пт: 9:00-18:00', '09:00-18:00', '@mahmud_dentist', '@mahmud_dentist', '+998901234567'
            )
            ON CONFLICT (user_id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                specialization = EXCLUDED.specialization,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                clinic = EXCLUDED.clinic,
                schedule = EXCLUDED.schedule,
                work_hours = EXCLUDED.work_hours,
                telegram = EXCLUDED.telegram,
                instagram = EXCLUDED.instagram,
                whatsapp = EXCLUDED.whatsapp
        """), {"user_id": user1_id})
        db.commit()
        print(f"✓ Dentist profile 1 created: Махмуд Пулатов (Ортодонтия)")
        
        # Second dentist - Азиза Каримова
        db.execute(text("""
            INSERT INTO dentist_profiles (
                user_id, full_name, verification_status,
                specialization, phone, address, clinic,
                schedule, work_hours, telegram, instagram, whatsapp
            )
            VALUES (
                :user_id, 'Азиза Каримова', 'approved',
                'Терапевтическая стоматология', '+998901234568', 'Ташкент, Чиланзар', 'Стоматология №2',
                'Пн-Сб: 8:00-17:00', '08:00-17:00', '@aziza_dentist', '@aziza_dentist', '+998901234568'
            )
            ON CONFLICT (user_id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                specialization = EXCLUDED.specialization,
                phone = EXCLUDED.phone,
                address = EXCLUDED.address,
                clinic = EXCLUDED.clinic,
                schedule = EXCLUDED.schedule,
                work_hours = EXCLUDED.work_hours,
                telegram = EXCLUDED.telegram,
                instagram = EXCLUDED.instagram,
                whatsapp = EXCLUDED.whatsapp
        """), {"user_id": user2_id})
        db.commit()
        print(f"✓ Dentist profile 2 created: Азиза Каримова (Терапевтическая стоматология)")
        
        # Verify
        print("\n3. Verifying dentists...")
        result = db.execute(text("""
            SELECT id, full_name, specialization, address, verification_status
            FROM dentist_profiles
            ORDER BY id
        """))
        
        dentists = result.fetchall()
        print(f"\nTotal dentists in database: {len(dentists)}")
        for dentist in dentists:
            print(f"  ID: {dentist[0]}")
            print(f"  Name: {dentist[1]}")
            print(f"  Specialization: {dentist[2]}")
            print(f"  Address: {dentist[3]}")
            print(f"  Status: {dentist[4]}")
            print()
        
        print("✅ Successfully added 2 dentists to Render database!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_dentists()
