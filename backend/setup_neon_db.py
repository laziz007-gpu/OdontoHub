"""
Setup script for Neon PostgreSQL database.
Creates all tables and seeds initial data (dentists + services).
Run: python setup_neon_db.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set in .env")

print(f"Connecting to: {DATABASE_URL[:60]}...")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"sslmode": "require"},
)
SessionLocal = sessionmaker(bind=engine)

# ── Import all models so Base knows about them ──────────────────────────────
from app.models.base import Base
from app.models.user import User, UserRole
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile, VerificationStatus
from app.models.service import Service
from app.models.appointment import Appointment
from app.models.prescription import Prescription
from app.models.allergy import Allergy
from app.models.payment import Payment
from app.models.photo import PatientPhoto


def create_tables():
    print("\n📦 Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")


def seed_dentists(db):
    print("\n👨‍⚕️ Seeding dentists...")

    dentists_data = [
        {
            "phone": "+998901234567",
            "email": "mahmud.pulatov@dental.uz",
            "full_name": "Махмуд Пулатов",
            "specialization": "orthodontist",
            "clinic": "Стоматология №1",
            "address": "Ташкент, Юнусабад",
            "work_hours": "09:00-18:00",
            "schedule": "weekdays",
            "telegram": "@mahmud_dentist",
            "instagram": "@mahmud_dentist",
            "whatsapp": "+998901234567",
        },
        {
            "phone": "+998901234568",
            "email": "aziza.karimova@dental.uz",
            "full_name": "Азиза Каримова",
            "specialization": "therapist",
            "clinic": "Smile Clinic",
            "address": "Ташкент, Мирабад",
            "work_hours": "10:00-19:00",
            "schedule": "weekdays",
            "instagram": "@aziza_orthodontist",
            "telegram": "@aziza_dental",
            "whatsapp": "+998901234568",
        },
        {
            "phone": "+998901234569",
            "email": "rustam.alimov@dental.uz",
            "full_name": "Рустам Алимов",
            "specialization": "surgeon",
            "clinic": "Dental Care Center",
            "address": "Ташкент, Чиланзар",
            "work_hours": "08:00-17:00",
            "schedule": "every_day",
            "whatsapp": "+998901234569",
            "telegram": "@rustam_surgeon",
            "instagram": "@rustam_dental",
        },
        {
            "phone": "+998901234570",
            "email": "dilnoza.rashidova@dental.uz",
            "full_name": "Дилноза Рашидова",
            "specialization": "pediatric",
            "clinic": "Kids Dental",
            "address": "Ташкент, Юнусабад",
            "work_hours": "09:00-16:00",
            "schedule": "weekdays",
            "telegram": "@dilnoza_kids_dental",
            "instagram": "@dilnoza_dental",
            "whatsapp": "+998901234570",
        },
        {
            "phone": "+998901234571",
            "email": "bobur.saidov@dental.uz",
            "full_name": "Бобур Саидов",
            "specialization": "implantologist",
            "clinic": "Premium Dental",
            "address": "Ташкент, Сергели",
            "work_hours": "10:00-20:00",
            "schedule": "every_day",
            "instagram": "@bobur_implants",
            "telegram": "@bobur_dental",
            "whatsapp": "+998901234571",
        },
    ]

    created = 0
    for d in dentists_data:
        # Check if user already exists
        existing = db.query(User).filter(User.phone == d["phone"]).first()
        if existing:
            print(f"  ⚠️  User already exists: {d['phone']} — skipping")
            continue

        user = User(
            phone=d["phone"],
            email=d["email"],
            password=None,
            role=UserRole.DENTIST,
            is_active=True,
        )
        db.add(user)
        db.flush()

        profile = DentistProfile(
            user_id=user.id,
            full_name=d["full_name"],
            specialization=d["specialization"],
            clinic=d.get("clinic"),
            address=d.get("address"),
            work_hours=d.get("work_hours"),
            schedule=d.get("schedule"),
            telegram=d.get("telegram"),
            instagram=d.get("instagram"),
            whatsapp=d.get("whatsapp"),
            verification_status="approved",
        )
        db.add(profile)
        db.flush()
        print(f"  ✅ Created: {d['full_name']} ({d['specialization']})")
        created += 1

    db.commit()
    print(f"  → {created} dentists added.")
    return db.query(DentistProfile).all()


def seed_services(db, dentist_profiles):
    print("\n🦷 Seeding services...")

    # Add dentist_id column if missing
    with engine.connect() as conn:
        try:
            conn.execute(text(
                "ALTER TABLE services ADD COLUMN dentist_id INTEGER REFERENCES dentist_profiles(id)"
            ))
            conn.commit()
            print("  ✅ Added dentist_id column to services")
        except Exception as e:
            if "already exists" in str(e).lower():
                print("  ℹ️  dentist_id column already exists")
            else:
                print(f"  ⚠️  Column add: {e}")

    base_services = [
        {"name": "Консультация",        "price": 50000},
        {"name": "Чистка зубов",        "price": 150000},
        {"name": "Пломбирование",       "price": 200000},
        {"name": "Удаление зуба",       "price": 100000},
        {"name": "Отбеливание",         "price": 500000},
        {"name": "Установка коронки",   "price": 800000},
        {"name": "Имплантация",         "price": 2000000},
        {"name": "Брекеты",             "price": 3000000},
        {"name": "Рентген",             "price": 80000},
        {"name": "Лечение кариеса",     "price": 180000},
    ]

    created = 0
    for dentist in dentist_profiles:
        with engine.connect() as conn:
            r = conn.execute(
                text("SELECT COUNT(*) FROM services WHERE dentist_id = :did"),
                {"did": dentist.id}
            )
            existing = r.scalar()
        if existing and existing > 0:
            print(f"  ⚠️  Services already exist for dentist ID {dentist.id} — skipping")
            continue
        for svc in base_services:
            db.add(Service(
                dentist_id=dentist.id,
                name=svc["name"],
                price=svc["price"],
                currency="UZS",
            ))
            created += 1

    db.commit()
    print(f"  → {created} services added.")


def verify(db):
    print("\n🔍 Verification:")
    users_count = db.query(User).count()
    dentists_count = db.query(DentistProfile).count()
    services_count = db.query(Service).count()
    print(f"  Users:    {users_count}")
    print(f"  Dentists: {dentists_count}")
    print(f"  Services: {services_count}")

    dentists = db.query(DentistProfile).all()
    print("\n  Dentist list:")
    for d in dentists:
        print(f"    [{d.id}] {d.full_name} — {d.specialization} — {d.clinic}")


def main():
    create_tables()

    db = SessionLocal()
    try:
        dentist_profiles = seed_dentists(db)
        # Re-fetch all dentists (including pre-existing ones) for service seeding
        all_dentists = db.query(DentistProfile).all()
        seed_services(db, all_dentists)
        verify(db)
        print("\n🎉 Neon DB setup complete!")
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    main()
