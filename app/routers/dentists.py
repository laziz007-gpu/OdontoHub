from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User
from app.models.dentist import DentistProfile

router = APIRouter(prefix="/dentists", tags=["Dentists"])

# Создаем константу для роли (используем строку)
DENTIST_ROLE = "dentist"

class UpdateDentistProfileRequest(BaseModel):
    specialization: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    clinic: Optional[str] = None
    schedule: Optional[str] = None
    work_hours: Optional[str] = None
    telegram: Optional[str] = None
    instagram: Optional[str] = None
    whatsapp: Optional[str] = None
    works_photos: Optional[str] = None  # JSON string of photo URLs

@router.get("/me")
def dentist_me(
    user: User = Depends(require_role(DENTIST_ROLE)),
    db: Session = Depends(get_db)
):
    if not user.dentist_profile:
        # Auto-create missing profile
        profile = DentistProfile(
            user_id=user.id, 
            full_name="Dr. " + (user.email or user.phone)
        )
        db.add(profile)
        db.commit()
        db.refresh(user)

    profile = user.dentist_profile
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "role": user.role,
        "full_name": profile.full_name,
        "specialization": profile.specialization,
        "phone": user.phone,
        "address": profile.address,
        "clinic": profile.clinic,
        "schedule": profile.schedule,
        "work_hours": profile.work_hours,
        "telegram": profile.telegram,
        "instagram": profile.instagram,
        "whatsapp": profile.whatsapp,
        "works_photos": profile.works_photos,
    }

@router.get("/me/stats")
def get_dentist_stats(
    user: User = Depends(require_role(DENTIST_ROLE)),
    db: Session = Depends(get_db)
):
    """Get dentist statistics: total patients, ratings, appointments"""
    from app.models.patient import PatientProfile
    from app.models.appointment import Appointment
    
    # Count total patients
    total_patients = db.query(PatientProfile).count()
    
    # Count total appointments for this dentist
    total_appointments = db.query(Appointment).filter(
        Appointment.dentist_id == user.dentist_profile.id
    ).count() if user.dentist_profile else 0
    
    # TODO: Calculate average rating from reviews (when review system is implemented)
    average_rating = 4.8
    total_reviews = 103
    
    return {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "average_rating": average_rating,
        "total_reviews": total_reviews
    }

@router.put("/me")
def update_dentist_profile(
    data: UpdateDentistProfileRequest,
    user: User = Depends(require_role(DENTIST_ROLE)),
    db: Session = Depends(get_db)
):
    print(f"🔵 PUT /dentists/me called by user {user.id}")
    print(f"🔵 Data received: {data.dict()}")
    
    if not user.dentist_profile:
        # Auto-create missing profile
        profile = DentistProfile(
            user_id=user.id, 
            full_name="Dr. " + (user.email or user.phone)
        )
        db.add(profile)
        db.commit()
        db.refresh(user)
    
    profile = user.dentist_profile
    
    # Update dentist profile fields
    if data.specialization is not None:
        profile.specialization = data.specialization
    if data.address is not None:
        profile.address = data.address
    if data.clinic is not None:
        profile.clinic = data.clinic
    if data.schedule is not None:
        profile.schedule = data.schedule
    if data.work_hours is not None:
        profile.work_hours = data.work_hours
    if data.telegram is not None:
        profile.telegram = data.telegram
    if data.instagram is not None:
        profile.instagram = data.instagram
    if data.whatsapp is not None:
        profile.whatsapp = data.whatsapp
    if data.works_photos is not None:
        profile.works_photos = data.works_photos
    
    # Update phone in user table
    if data.phone is not None:
        user.phone = data.phone
    
    db.commit()
    db.refresh(profile)
    db.refresh(user)
    
    print(f"✅ Profile updated successfully for user {user.id}")
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "specialization": profile.specialization,
        "phone": user.phone,
        "address": profile.address,
        "clinic": profile.clinic,
        "schedule": profile.schedule,
        "work_hours": profile.work_hours,
        "telegram": profile.telegram,
        "instagram": profile.instagram,
        "whatsapp": profile.whatsapp,
        "works_photos": profile.works_photos,
        "message": "Profile updated successfully"
    }
