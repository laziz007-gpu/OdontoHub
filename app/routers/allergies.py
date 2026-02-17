from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.user import User
from app.models.allergy import Allergy
from app.models.patient import PatientProfile
from app.schemas.allergy import (
    AllergyCreate,
    AllergyUpdate,
    AllergySchema
)

router = APIRouter(tags=["Allergies"])

# Константа для роли врача
DENTIST_ROLE = "dentist"


@router.get("/patients/{patient_id}/allergies", response_model=List[AllergySchema])
def get_patient_allergies(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Получить все аллергии пациента
    Отсортированы по дате документирования (новые первые)
    """
    # Проверяем существование пациента
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    allergies = db.query(Allergy).filter(
        Allergy.patient_id == patient_id
    ).order_by(Allergy.documented_at.desc()).all()
    
    return allergies


@router.post("/patients/{patient_id}/allergies", response_model=AllergySchema)
def create_allergy(
    patient_id: int,
    data: AllergyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Создать новую запись об аллергии для пациента
    """
    # Проверяем существование пациента
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    allergy = Allergy(
        patient_id=patient_id,
        allergen_name=data.allergen_name,
        reaction_type=data.reaction_type,
        severity=data.severity,
        notes=data.notes,
        documented_by=current_user.id
    )
    
    db.add(allergy)
    db.commit()
    db.refresh(allergy)
    
    return allergy


@router.put("/{allergy_id}", response_model=AllergySchema)
def update_allergy(
    allergy_id: int,
    data: AllergyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Обновить запись об аллергии
    """
    allergy = db.query(Allergy).filter(Allergy.id == allergy_id).first()
    if not allergy:
        raise HTTPException(status_code=404, detail="Allergy not found")
    
    # Обновляем только переданные поля
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(allergy, key, value)
    
    db.commit()
    db.refresh(allergy)
    
    return allergy


@router.delete("/{allergy_id}")
def delete_allergy(
    allergy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Удалить запись об аллергии
    """
    allergy = db.query(Allergy).filter(Allergy.id == allergy_id).first()
    if not allergy:
        raise HTTPException(status_code=404, detail="Allergy not found")
    
    db.delete(allergy)
    db.commit()
    
    return {"message": "Allergy deleted successfully"}
