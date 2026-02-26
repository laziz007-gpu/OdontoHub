from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
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


@app.get("/init-db")
def init_database():
    """
    Initialize database tables - call this endpoint once after deployment
    This endpoint will be removed after initial setup
    """
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
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        return {
            "status": "success",
            "message": "Database tables created successfully!",
            "tables": [
                "users",
                "patient_profiles",
                "dentist_profiles",
                "services",
                "appointments",
                "prescriptions",
                "allergies",
                "payments",
                "patient_photos"
            ]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to create tables: {str(e)}"
        }
