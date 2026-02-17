from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="OdontoHub API", version="1.0.0")

# CORS - ПЕРВЫМ ДЕЛОМ
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Импортируем роутеры
from app.routers import auth, patients, dentists, services, appointments
from app.routers import notifications, prescriptions, allergies

# Подключаем роутеры
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(patients.router, tags=["Patients"])
app.include_router(dentists.router)
app.include_router(services.router, tags=["Services"])
app.include_router(appointments.router, tags=["Appointments"])
app.include_router(notifications.router, prefix="/api", tags=["Notifications"])
app.include_router(prescriptions.router, prefix="/api", tags=["Prescriptions"])
app.include_router(allergies.router, prefix="/api", tags=["Allergies"])


@app.get("/")
def read_root():
    return {"message": "Welcome to OdontoHub API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# Создаём таблицы при старте
@app.on_event("startup")
async def startup():
    from app.core.database import Base, engine
    from app.models import user, patient, dentist, service, appointment
    from app.models import notification, prescription, allergy
    
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
