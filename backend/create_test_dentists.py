"""
Script to create test dentists in the database
"""
from sqlalchemy.orm import Session
from app.core.database import engine, SessionLocal
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.dentist import DentistProfile, VerificationStatus

# Import all models to register them with SQLAlchemy
from app.models.patient import PatientProfile
from app.models.prescription import Prescription
from app.models.allergy import Allergy
from app.models.appointment import Appointment
from app.models.payment import Payment
from app.models.photo import PatientPhoto
from app.models.service import Service

def create_test_dentists():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Check if dentists already exist
        existing_dentists = db.query(DentistProfile).count()
        if existing_dentists > 0:
            print(f"✓ Database already has {existing_dentists} dentist(s)")
            return
        
        # Create test dentists
        dentists_data = [
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
            },
            {
                "phone": "+998901234570",
                "email": "dilnoza.rashidova@dental.uz",
                "full_name": "Дилноза Рашидова",
                "specialization": "Детский стоматолог",
                "clinic": "Kids Dental",
                "address": "Ташкент, Юнусабад",
                "work_hours": "09:00-16:00",
                "telegram": "@dilnoza_kids_dental",
            },
            {
                "phone": "+998901234571",
                "email": "bobur.saidov@dental.uz",
                "full_name": "Бобур Саидов",
                "specialization": "Имплантолог",
                "clinic": "Premium Dental",
                "address": "Ташкент, Сергели",
                "work_hours": "10:00-20:00",
                "instagram": "@bobur_implants",
            }
        ]
        
        for dentist_data in dentists_data:
            # Create user
            user = User(
                phone=dentist_data["phone"],
                email=dentist_data["email"],
                password=None,  # Passwordless
                role=UserRole.DENTIST
            )
            db.add(user)
            db.flush()  # Get user.id
            
            # Create dentist profile
            profile = DentistProfile(
                user_id=user.id,
                full_name=dentist_data["full_name"],
                specialization=dentist_data["specialization"],
                clinic=dentist_data.get("clinic"),
                address=dentist_data.get("address"),
                work_hours=dentist_data.get("work_hours"),
                telegram=dentist_data.get("telegram"),
                instagram=dentist_data.get("instagram"),
                whatsapp=dentist_data.get("whatsapp"),
                verification_status=VerificationStatus.APPROVED
            )
            db.add(profile)
            print(f"✓ Created dentist: {dentist_data['full_name']}")
        
        db.commit()
        print(f"\n✓ Successfully created {len(dentists_data)} test dentists!")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    create_test_dentists()
