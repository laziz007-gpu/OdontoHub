from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.database import engine, Base
from app.routers import auth, patients, dentists, services, appointments

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="OdontoHub API", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    """Run migrations on startup"""
    with engine.connect() as conn:
        try:
            # Add new columns to dentist_profiles table if they don't exist
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS specialization VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS address VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS clinic VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS schedule VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS work_hours VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS telegram VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS instagram VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS whatsapp VARCHAR;
            """))
            conn.commit()
            print("✅ Database migration completed successfully")
        except Exception as e:
            print(f"⚠️ Migration warning: {e}")
            conn.rollback()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://odontohubapp.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(patients.router, tags=["Patients"])
app.include_router(dentists.router)
app.include_router(services.router, tags=["Services"])
app.include_router(appointments.router, tags=["Appointments"])


@app.get("/")
def read_root():
    return {"message": "Welcome to OdontoHub API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/routes")
def list_routes():
    """Debug endpoint to list all registered routes"""
    routes = []
    for route in app.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": route.name
            })
    return {"routes": routes}



