from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.schemas.prescription import PrescriptionCreate, PrescriptionUpdate, PrescriptionSchema
from app.models.prescription import Prescription
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/patients/{patient_id}/prescriptions", response_model=List[PrescriptionSchema])
def get_patient_prescriptions(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    return db.query(Prescription).filter(
        Prescription.patient_id == patient_id
    ).order_by(Prescription.prescribed_at.desc()).all()


@router.post("/patients/{patient_id}/prescriptions", response_model=PrescriptionSchema)
def create_prescription(
    patient_id: int,
    data: PrescriptionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    prescription = Prescription(
        patient_id=patient_id,
        medication_name=data.medication_name,
        dosage=data.dosage,
        frequency=data.frequency,
        duration=data.duration,
        notes=data.notes,
        prescribed_by=user.id
    )
    db.add(prescription)
    db.commit()
    db.refresh(prescription)
    return prescription


@router.patch("/patients/{patient_id}/prescriptions/{prescription_id}", response_model=PrescriptionSchema)
def update_prescription(
    patient_id: int,
    prescription_id: int,
    data: PrescriptionUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    prescription = db.query(Prescription).filter(
        Prescription.id == prescription_id,
        Prescription.patient_id == patient_id
    ).first()
    
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(prescription, key, value)
    
    db.commit()
    db.refresh(prescription)
    return prescription


@router.delete("/patients/{patient_id}/prescriptions/{prescription_id}")
def delete_prescription(
    patient_id: int,
    prescription_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    prescription = db.query(Prescription).filter(
        Prescription.id == prescription_id,
        Prescription.patient_id == patient_id
    ).first()
    
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")
    
    db.delete(prescription)
    db.commit()
    return {"message": "Prescription deleted successfully"}
