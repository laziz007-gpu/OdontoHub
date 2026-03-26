from app.core.database import SessionLocal, engine, Base
from app.models.user import User, UserRole
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile, VerificationStatus
from app.models.service import Service
from app.models.appointment import Appointment
from app.models.prescription import Prescription
from app.models.allergy import Allergy
from app.models.payment import Payment
from app.models.photo import PatientPhoto
from app.core.security import hash_password

def seed_dentists():
    # Ensure tables exist
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we already have dentists
        dentist_count = db.query(User).filter(User.role == UserRole.DENTIST).count()
        if dentist_count > 0:
            print(f"Already have {dentist_count} dentists. Skipping seed.")
            return

        print("Seeding demo dentists...")
        
        dentists_to_create = [
            {
                "phone": "+998901112233",
                "full_name": "Доктор Ахмедов",
                "specialization": "Ортодонт",
                "clinic": "Stoma Clinic",
                "address": "Ташкент, Юнусабад"
            },
            {
                "phone": "+998904445566",
                "full_name": "Доктор Каримова",
                "specialization": "Терапевт",
                "clinic": "Dental Lux",
                "address": "Ташкент, Чиланзар"
            },
            {
                "phone": "+998907778899",
                "full_name": "Доктор Усманов",
                "specialization": "Хирург",
                "clinic": "Happy Smile",
                "address": "Ташкент, Мирзо-Улугбек"
            }
        ]

        for d_data in dentists_to_create:
            # Create user
            user = User(
                phone=d_data["phone"],
                password=hash_password("password123"),
                role=UserRole.DENTIST
            )
            db.add(user)
            db.flush() # Get user ID
            
            # Create profile
            profile = DentistProfile(
                user_id=user.id,
                full_name=d_data["full_name"],
                specialization=d_data["specialization"],
                clinic=d_data["clinic"],
                address=d_data["address"],
                verification_status=VerificationStatus.APPROVED
            )
            db.add(profile)
        
        db.commit()
        print("✓ Demo dentists seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_dentists()
