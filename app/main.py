from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.core.database import engine, Base, get_db
from app.routers import auth, patients, dentists, services, appointments
from app.routers import prescriptions, allergies, payments, photos
import traceback

# Temporarily disabled - uncomment to enable notifications:
# from app.routers import notifications

app = FastAPI(title="OdontoHub API", version="1.0.0")


# CORS configuration - MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://odontohubapp.netlify.app",
        "https://odontohub.netlify.app",
        "https://odontohub-app.netlify.app",
        "https://statuesque-bonbon-133025.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://odontohubapp.netlify.app",
    "https://odontohub.netlify.app",
    "https://odontohub-app.netlify.app",
    "https://statuesque-bonbon-133025.netlify.app",
]


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Return CORS headers even on 500 errors so the browser shows the real error."""
    origin = request.headers.get("origin", "")
    allow_origin = origin if origin in ALLOWED_ORIGINS else ""
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal server error: {str(exc)}"},
        headers={
            "Access-Control-Allow-Origin": allow_origin,
            "Access-Control-Allow-Credentials": "true",
        },
    )

@app.on_event("startup")
def on_startup():
    """Create database tables on startup — safe for re-runs"""
    from sqlalchemy import text
    import os

    # Import all models to ensure they're registered with Base
    from app.models.user import User
    from app.models.patient import PatientProfile
    from app.models.dentist import DentistProfile
    from app.models.service import Service
    from app.models.appointment import Appointment
    from app.models.prescription import Prescription
    from app.models.allergy import Allergy
    from app.models.payment import Payment
    from app.models.photo import PatientPhoto

    db_url = str(engine.url)
    if "postgresql" in db_url or "postgres" in db_url:
        # Safely create enum types — won't fail if they already exist
        enum_types = [
            ("userrole", ["patient", "dentist"]),
            ("verificationstatus", ["pending", "approved", "rejected"]),
            ("appointment_status", ["pending", "confirmed", "moved", "cancelled", "completed"]),
        ]
        with engine.begin() as conn:
            for type_name, values in enum_types:
                values_sql = ", ".join(f"'{v}'" for v in values)
                conn.execute(text(
                    f"DO $$ BEGIN "
                    f"  CREATE TYPE {type_name} AS ENUM ({values_sql}); "
                    f"EXCEPTION WHEN duplicate_object THEN NULL; "
                    f"END $$;"
                ))

    # Create all tables (checkfirst=True skips existing tables)
    Base.metadata.create_all(bind=engine, checkfirst=True)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(patients.router, tags=["Patients"])
app.include_router(dentists.router, tags=["Dentists"])
app.include_router(services.router, tags=["Services"])
app.include_router(appointments.router, tags=["Appointments"])
# Temporarily disabled - uncomment to enable notifications:
# app.include_router(notifications.router, prefix="/api", tags=["Notifications"])
app.include_router(prescriptions.router, prefix="/api", tags=["Prescriptions"])
app.include_router(allergies.router, prefix="/api", tags=["Allergies"])
app.include_router(payments.router, prefix="/api", tags=["Payments"])
app.include_router(photos.router, prefix="/api", tags=["Photos"])


@app.get("/")
def read_root():
    return {"message": "Welcome to OdontoHub API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/migrate-dentist-fields")
def migrate_dentist_fields():
    """
    One-time migration endpoint to add missing dentist profile fields.
    Safe to call multiple times - checks if columns exist before adding.
    """
    from sqlalchemy import text, inspect

    try:
        inspector = inspect(engine)
        existing_columns = [col['name'] for col in inspector.get_columns('dentist_profiles')]

        fields_to_add = []
        if 'age' not in existing_columns:
            fields_to_add.append(('age', 'INTEGER'))
        if 'experience_years' not in existing_columns:
            fields_to_add.append(('experience_years', 'INTEGER'))
        if 'works_photos' not in existing_columns:
            fields_to_add.append(('works_photos', 'TEXT'))

        if not fields_to_add:
            return {
                "status": "success",
                "message": "All fields already exist",
                "existing_fields": ["age", "experience_years", "works_photos"]
            }

        with engine.begin() as conn:
            for field_name, field_type in fields_to_add:
                conn.execute(text(
                    f"ALTER TABLE dentist_profiles ADD COLUMN {field_name} {field_type}"
                ))

        return {
            "status": "success",
            "message": "Migration completed successfully!",
            "added_fields": [f[0] for f in fields_to_add]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": f"Migration failed: {str(e)}"
        }


@app.get("/debug-db")
def debug_db():
    """Debug endpoint: shows DB connection info and existing tables."""
    from sqlalchemy import text
    import os
    raw_url = os.getenv("DATABASE_URL", "NOT SET")
    engine_url = str(engine.url)

    # Mask password for safety
    def mask(url):
        import re
        return re.sub(r'://([^:@]+):([^@]+)@', r'://\1:****@', url)

    try:
        with engine.connect() as conn:
            if "postgresql" in engine_url or "postgres" in engine_url:
                result = conn.execute(text(
                    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
                ))
                tables = [row[0] for row in result]
            else:
                result = conn.execute(text(
                    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
                ))
                tables = [row[0] for row in result]
        return {
            "db_type": "postgresql" if "postgresql" in engine_url or "postgres" in engine_url else "sqlite",
            "engine_url_masked": mask(engine_url),
            "env_DATABASE_URL_set": raw_url != "NOT SET",
            "tables_in_db": tables,
        }
    except Exception as e:
        return {"error": str(e), "engine_url_masked": mask(engine_url)}


@app.get("/init-db")
def init_database():
    """
    Initialize database tables - safe to call multiple times.
    Creates enum types first, then tables.
    """
    from sqlalchemy import text
    try:
        # Import all models to ensure they're registered
        from app.models.user import User
        from app.models.patient import PatientProfile
        from app.models.dentist import DentistProfile
        from app.models.service import Service
        from app.models.appointment import Appointment
        from app.models.prescription import Prescription
        from app.models.allergy import Allergy
        from app.models.payment import Payment
        from app.models.photo import PatientPhoto

        db_url = str(engine.url)
        if "postgresql" in db_url or "postgres" in db_url:
            # Step 1: Create enum types safely (skip if already exist)
            enum_types = [
                ("userrole", ["patient", "dentist"]),
                ("verificationstatus", ["pending", "approved", "rejected"]),
                ("appointment_status", ["pending", "confirmed", "moved", "cancelled", "completed"]),
            ]
            with engine.begin() as conn:
                for type_name, values in enum_types:
                    values_sql = ", ".join(f"'{v}'" for v in values)
                    conn.execute(text(
                        f"DO $$ BEGIN "
                        f"  CREATE TYPE {type_name} AS ENUM ({values_sql}); "
                        f"EXCEPTION WHEN duplicate_object THEN NULL; "
                        f"END $$;"
                    ))

        # Step 2: Create all tables (skip existing ones)
        Base.metadata.create_all(bind=engine, checkfirst=True)

        return {
            "status": "success",
            "message": "Database tables created successfully!",
            "tables": [
                "users", "patient_profiles", "dentist_profiles",
                "services", "appointments", "prescriptions",
                "allergies", "payments", "patient_photos"
            ]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to create tables: {str(e)}"
        }


@app.get("/dentists/list")
async def get_all_dentists(db: Session = Depends(get_db)):
    """
    Get list of all dentists
    Returns all dentist profiles from database
    """
    from app.models.dentist import DentistProfile
    
    try:
        dentists = db.query(DentistProfile).all()

        dentists_list = []
        for dentist in dentists:
            dentist_dict = {
                "id": dentist.id,
                "user_id": dentist.user_id,
                "full_name": dentist.full_name,
                "phone": dentist.phone if hasattr(dentist, 'phone') else None,
                "specialization": dentist.specialization,
                "clinic": dentist.clinic,
                "address": dentist.address,
                "age": dentist.age,
                "experience_years": dentist.experience_years,
                "schedule": dentist.schedule,
                "work_hours": dentist.work_hours,
                "telegram": dentist.telegram,
                "instagram": dentist.instagram,
                "whatsapp": dentist.whatsapp,
                "works_photos": dentist.works_photos,
                "pinfl": dentist.pinfl,
                "diploma_number": dentist.diploma_number,
                "verification_status": dentist.verification_status,
                "created_at": dentist.created_at.isoformat() if hasattr(dentist, 'created_at') and dentist.created_at else None,
                "updated_at": dentist.updated_at.isoformat() if hasattr(dentist, 'updated_at') and dentist.updated_at else None
            }
            dentists_list.append(dentist_dict)

        return dentists_list

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dentists: {str(e)}")


