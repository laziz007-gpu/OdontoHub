from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.schemas.allergy import AllergyCreate, AllergyUpdate, AllergySchema
from app.models.allergy import Allergy
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/patients/{patient_id}/allergies", response_model=List[AllergySchema])
def get_patient_allergies(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    return db.query(Allergy).filter(
        Allergy.patient_id == patient_id
    ).order_by(Allergy.documented_at.desc()).all()


@router.post("/patients/{patient_id}/allergies", response_model=AllergySchema)
def create_allergy(
    patient_id: int,
    data: AllergyCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    allergy = Allergy(
        patient_id=patient_id,
        allergen_name=data.allergen_name,
        reaction_type=data.reaction_type,
        severity=data.severity,
        notes=data.notes,
        documented_by=user.id
    )
    db.add(allergy)
    db.commit()
    db.refresh(allergy)
    return allergy


@router.patch("/patients/{patient_id}/allergies/{allergy_id}", response_model=AllergySchema)
def update_allergy(
    patient_id: int,
    allergy_id: int,
    data: AllergyUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    allergy = db.query(Allergy).filter(
        Allergy.id == allergy_id,
        Allergy.patient_id == patient_id
    ).first()
    
    if not allergy:
        raise HTTPException(status_code=404, detail="Allergy not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(allergy, key, value)
    
    db.commit()
    db.refresh(allergy)
    return allergy


@router.delete("/patients/{patient_id}/allergies/{allergy_id}")
def delete_allergy(
    patient_id: int,
    allergy_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    allergy = db.query(Allergy).filter(
        Allergy.id == allergy_id,
        Allergy.patient_id == patient_id
    ).first()
    
    if not allergy:
        raise HTTPException(status_code=404, detail="Allergy not found")
    
    db.delete(allergy)
    db.commit()
    return {"message": "Allergy deleted successfully"}
