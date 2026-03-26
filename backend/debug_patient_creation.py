import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the application directory to the python path
sys.path.append(os.getcwd())

try:
    from app.core.database import get_db, SessionLocal
    from app.models.user import User, UserRole
    from app.models.patient import PatientProfile
    from app.schemas.patient import PatientCreate
    from app.routers.patients import create_patient
    from app.core.security import hash_password
    print("Imports successful")
except Exception as e:
    print(f"Import failed: {e}")
    sys.exit(1)

def test_hash_password():
    print("Testing hash_password...")
    try:
        pw = "1234567890"
        hashed = hash_password(pw)
        print(f"Hash successful: {hashed[:10]}...")
    except Exception as e:
        print(f"hash_password failed: {e}")
        import traceback
        traceback.print_exc()

def simulate_create_patient():
    print("Simulating create_patient...")
    db = SessionLocal()
    try:
        # Mock data
        phone = "998901234567"
        data = PatientCreate(
            phone=phone,
            full_name="Test Patient",
            source="Debugging"
        )
        
        # Check existing to avoid constraint error during test re-runs
        existing_user = db.query(User).filter(User.phone == phone).first()
        if existing_user:
            print(f"User {phone} already exists, deleting for test...")
            # Clean up both user and profile
            if existing_user.patient_profile:
                db.delete(existing_user.patient_profile)
            if existing_user.dentist_profile:
                db.delete(existing_user.dentist_profile)
            db.delete(existing_user)
            db.commit()
            print("Cleanup done.")

        # Manually run the logic from the endpoint
        print("Creating new user...")
        new_user = User(
            phone=data.phone,
            password=hash_password(data.phone),
            role=UserRole.PATIENT
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"User created with ID: {new_user.id}")

        print("Creating profile...")
        profile = PatientProfile(
            user_id=new_user.id, 
            full_name=data.full_name,
            birth_date=data.birth_date,
            gender=data.gender,
            address=data.address,
            source=data.source
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
        print(f"Profile created with ID: {profile.id}")
        
    except Exception as e:
        print(f"Simulation failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_hash_password()
    simulate_create_patient()
