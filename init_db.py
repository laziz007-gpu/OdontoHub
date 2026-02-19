"""
Initialize database tables for production
Run this script once to create all tables in PostgreSQL
"""
from app.core.database import engine, Base
from app.models.user import User
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile
from app.models.service import Service
from app.models.appointment import Appointment
from app.models.prescription import Prescription
from app.models.allergy import Allergy
from app.models.payment import Payment
from app.models.photo import PatientPhoto

def init_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ All tables created successfully!")

if __name__ == "__main__":
    init_database()
