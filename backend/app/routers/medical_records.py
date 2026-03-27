from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.medical_record import MedicalRecord
from app.models.appointment import Appointment
from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordOut
)
from app.core.security import get_current_user

router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"]
)


@router.post(
    "/",
    response_model=MedicalRecordOut,
    status_code=status.HTTP_201_CREATED
)
def create_medical_record(
    data: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == data.appointment_id
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    record = MedicalRecord(
        patient_id=appointment.patient_id,
        dentist_id=appointment.dentist_id,
        appointment_id=appointment.id,
        diagnosis=data.diagnosis,
        treatment=data.treatment,
        notes=data.notes,
    )

    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get(
    "/patient/{patient_id}",
    response_model=list[MedicalRecordOut]
)
def get_patient_records(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == patient_id)
        .all()
    )
