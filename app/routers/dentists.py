from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User, UserRole
from app.models.dentist import DentistProfile

router = APIRouter(prefix="/dentists", tags=["Dentists"])

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

@router.get("/me")
def dentist_me(
    user: User = Depends(require_role(UserRole.DENTIST)),
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

    return {
        "id": user.dentist_profile.id,
        "role": user.role,
        "full_name": user.dentist_profile.full_name,
        "message": "Hello dentist"
    }

@router.put("/me")
def update_dentist_profile(
    data: UpdateDentistProfileRequest,
    user: User = Depends(require_role(UserRole.DENTIST)),
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
    
    # Update phone in user table
    if data.phone is not None:
        user.phone = data.phone
    
    db.commit()
    db.refresh(profile)
    db.refresh(user)
    
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
        "message": "Profile updated successfully"
    }
