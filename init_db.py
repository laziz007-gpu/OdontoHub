"""
Initialize database tables for production.
Safe to run multiple times — uses CREATE TYPE IF NOT EXISTS
and checkfirst=True so it won't fail on existing tables/enums.
"""
import os
from dotenv import load_dotenv

load_dotenv()

from sqlalchemy import create_engine, text
from app.models.base import Base

# All models must be imported so SQLAlchemy registers them with Base
from app.models.user import User
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile
from app.models.service import Service
from app.models.appointment import Appointment
from app.models.prescription import Prescription
from app.models.allergy import Allergy
from app.models.payment import Payment
from app.models.photo import PatientPhoto


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Render provides 'postgres://' but SQLAlchemy requires 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)


def create_enums(conn):
    """
    Safely create PostgreSQL enum types.
    Using IF NOT EXISTS avoids DuplicateObject errors on re-deploy.
    SQLite doesn't have enum types, so we skip this for SQLite.
    """
    if "sqlite" in DATABASE_URL:
        return

    enum_types = [
        ("userrole", ["patient", "dentist"]),
        ("verificationstatus", ["pending", "approved", "rejected"]),
        ("appointment_status", ["pending", "confirmed", "moved", "cancelled", "completed"]),
    ]

    for type_name, values in enum_types:
        values_sql = ", ".join(f"'{v}'" for v in values)
        conn.execute(text(
            f"DO $$ BEGIN "
            f"  CREATE TYPE {type_name} AS ENUM ({values_sql}); "
            f"EXCEPTION WHEN duplicate_object THEN NULL; "
            f"END $$;"
        ))
    conn.commit()


def init_database():
    """Create all database tables safely (idempotent)."""
    print("Creating database enum types...")
    with engine.begin() as conn:
        create_enums(conn)
    print("✓ Enum types ready")

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine, checkfirst=True)
    print("✓ All tables created successfully!")


if __name__ == "__main__":
    init_database()
