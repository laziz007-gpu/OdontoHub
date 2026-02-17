from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.user import User
from app.models.prescription import Prescription
from app.models.patient import PatientProfile
from app.schemas.prescription import (
    PrescriptionCreate,
    PrescriptionUpdate,
    PrescriptionSchema
)

router = APIRouter(tags=["Prescriptions"])

# Константа для роли врача
DENTIST_ROLE = "dentist"


@router.get("/patients/{patient_id}/prescriptions", response_model=List[PrescriptionSchema])
def get_patient_prescriptions(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Получить все рецепты пациента
    Отсортированы по дате назначения (новые первые)
    """
    # Проверяем существование пациента
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    prescriptions = db.query(Prescription).filter(
        Prescription.patient_id == patient_id
    ).order_by(Prescription.prescribed_at.desc()).all()
    
    return prescriptions


@router.post("/patients/{patient_id}/prescriptions", response_model=PrescriptionSchema)
def create_prescription(
    patient_id: int,
    data: PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Создать новый рецепт для пациента
    """
    # Проверяем существование пациента
    patient = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    prescription = Prescription(
        patient_id=patient_id,
        medication_name=data.medication_name,
        dosage=data.dosage,
        frequency=data.frequency,
        duration=data.duration,
        notes=data.notes,
        prescribed_by=current_user.id
    )
    
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    
    return prescription


@router.put("/{prescription_id}", response_model=PrescriptionSchema)
def update_prescription(
    prescription_id: int,
    data: PrescriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Обновить рецепт
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    # Обновляем только переданные поля
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(prescription, key, value)
    
    db.commit()
    db.refresh(prescription)
    
    return prescription


@router.delete("/{prescription_id}")
def delete_prescription(
    prescription_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    """
    Удалить рецепт
    """
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    db.delete(prescription)
    db.commit()
    
    return {"message": "Prescription deleted successfully"}
