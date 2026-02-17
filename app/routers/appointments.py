from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.user import User
from app.models.appointment import Appointment, AppointmentStatus
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate, AppointmentSchema

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# Константы для ролей (используем строки)
DENTIST_ROLE = "dentist"
PATIENT_ROLE = "patient"

@router.post("/", response_model=AppointmentSchema)
def create_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Determine patient_id
        patient_id = None
        if current_user.role == PATIENT_ROLE:
            if not current_user.patient_profile:
                raise HTTPException(status_code=400, detail="Patient profile not found")
            patient_id = current_user.patient_profile.id
        elif current_user.role == DENTIST_ROLE:
            if not appointment.patient_id:
                raise HTTPException(status_code=400, detail="patient_id is required for dentists")
            patient_id = appointment.patient_id
        
        if not patient_id:
            raise HTTPException(status_code=400, detail="Could not determine patient_id")

        # Check if dentist exists
        from app.models.dentist import DentistProfile
        dentist = db.query(DentistProfile).filter(DentistProfile.id == appointment.dentist_id).first()
        if not dentist:
            raise HTTPException(status_code=404, detail="Dentist not found")

        db_appointment = Appointment(
            dentist_id=appointment.dentist_id,
            patient_id=patient_id,
            start_time=appointment.start_time,
            end_time=appointment.end_time,
            status=AppointmentStatus.PENDING,
            service=appointment.service,
            notes=appointment.notes
        )
        db.add(db_appointment)
        db.commit()
        db.refresh(db_appointment)
        return db_appointment
    except Exception as e:
        import traceback
        error_msg = f"Error creating appointment: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/me", response_model=List[AppointmentSchema])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Appointment)
    if current_user.role == PATIENT_ROLE:
        if not current_user.patient_profile:
            return []
        query = query.filter(Appointment.patient_id == current_user.patient_profile.id)
    else:
        if not current_user.dentist_profile:
            return []
        query = query.filter(Appointment.dentist_id == current_user.dentist_profile.id)
    
    appointments = query.all()
    
    # Populate names for the schema
    for app in appointments:
        from app.models.dentist import DentistProfile
        from app.models.patient import PatientProfile
        
        dentist = db.query(DentistProfile).filter(DentistProfile.id == app.dentist_id).first()
        app.dentist_name = dentist.full_name if dentist else "Unknown Dentist"
        
        patient = db.query(PatientProfile).filter(PatientProfile.id == app.patient_id).first()
        app.patient_name = patient.full_name if patient else "Unknown Patient"
        
    return appointments

@router.get("/patient/{patient_id}", response_model=List[AppointmentSchema])
def get_patient_appointments(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(DENTIST_ROLE))
):
    appointments = db.query(Appointment).filter(Appointment.patient_id == patient_id).all()
    
    # Populate names for the schema
    for app in appointments:
        from app.models.dentist import DentistProfile
        from app.models.patient import PatientProfile
        
        dentist = db.query(DentistProfile).filter(DentistProfile.id == app.dentist_id).first()
        app.dentist_name = dentist.full_name if dentist else "Unknown Dentist"
        
        patient = db.query(PatientProfile).filter(PatientProfile.id == app.patient_id).first()
        app.patient_name = patient.full_name if patient else "Unknown Patient"
        
    return appointments

@router.patch("/{appointment_id}", response_model=AppointmentSchema)
def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Permission check
    if current_user.role == PATIENT_ROLE:
        if db_appointment.patient_id != current_user.patient_profile.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    else:
        if db_appointment.dentist_id != current_user.dentist_profile.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
            
    update_data = appointment_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_appointment, key, value)
        
    db.commit()
    db.refresh(db_appointment)
    return db_appointment
