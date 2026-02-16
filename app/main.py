from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, patients, dentists, appointments, services
from app.core.database import engine
from app.models.base import Base
from app.models import user, patient, dentist, appointment, service

# Автоматическое создание таблиц при запуске (теперь в SQLite)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dental App API",
    version="0.1.0"
)

# Настройка CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://odontohubapp.netlify.app",
    "https://*.netlify.app",  # Для preview deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(appointments.router, tags=["Appointments"])
app.include_router(patients.router, tags=["Patients"])
app.include_router(dentists.router, tags=["Dentists"])
app.include_router(services.router, tags=["Services"])
