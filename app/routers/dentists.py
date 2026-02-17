from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User, UserRole
from app.models.dentist import DentistProfile

router = APIRouter(prefix="/dentists", tags=["Dentists"])

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
