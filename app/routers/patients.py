from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import require_role, hash_password, get_current_user
from app.schemas.patient import PatientCreate, PatientUpdate, PatientSchema
from app.models.patient import PatientProfile
from app.models.user import User, UserRole


router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/", response_model=List[PatientSchema])
def list_patients(
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    patients = db.query(PatientProfile).all()
    result = []
    for p in patients:
        schema = PatientSchema.model_validate(p)
        schema.phone = p.user.phone if p.user else None
        result.append(schema)
    return result

@router.post("/", response_model=PatientSchema)
def create_patient(
    data: PatientCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.phone == data.phone).first()
        if existing_user:
            profile = db.query(PatientProfile).filter(PatientProfile.user_id == existing_user.id).first()
            if profile:
                schema = PatientSchema.model_validate(profile)
                schema.phone = existing_user.phone
                return schema
            
            # If user exists but no profile, create profile
            profile = PatientProfile(
                user_id=existing_user.id, 
                full_name=data.full_name,
                birth_date=data.birth_date,
                gender=data.gender,
                address=data.address,
                source=data.source
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            schema = PatientSchema.model_validate(profile)
            schema.phone = existing_user.phone
            return schema

        # Create new user and profile
        # Use simple string for password hash debugging if needed, but hash_password should work
        hashed = hash_password(data.phone)
        
        new_user = User(
            phone=data.phone,
            password=hashed,
            role=UserRole.PATIENT
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        profile = PatientProfile(
            user_id=new_user.id, 
            full_name=data.full_name,
            birth_date=data.birth_date,
            gender=data.gender,
            address=data.address,
            source=data.source
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        # db.refresh(profile) # Redundant
        schema = PatientSchema.model_validate(profile)
        schema.phone = new_user.phone
        return schema
    except Exception as e:
        import traceback
        error_msg = f"Error creating patient: {str(e)}\n{traceback.format_exc()}"
        print(error_msg) # Print to backend console
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/me", response_model=PatientSchema)
def patient_me(
    user: User = Depends(require_role(UserRole.PATIENT))
):
    if not user.patient_profile:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Patient profile not found")
    schema = PatientSchema.model_validate(user.patient_profile)
    schema.phone = user.phone
    return schema

from fastapi import HTTPException

@router.get("/{patient_id}", response_model=PatientSchema)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    profile = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    schema = PatientSchema.model_validate(profile)
    schema.phone = profile.user.phone if profile.user else None
    return schema

@router.patch("/{patient_id}", response_model=PatientSchema)
def update_patient(
    patient_id: int,
    data: PatientUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    profile = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    schema = PatientSchema.model_validate(profile)
    schema.phone = profile.user.phone if profile.user else None
    return schema

@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    profile = db.query(PatientProfile).filter(PatientProfile.id == patient_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Optional: Delete associated user if they are JUST a patient
    associated_user = profile.user
    db.delete(profile)
    if associated_user and associated_user.role == UserRole.PATIENT:
        db.delete(associated_user)
        
    db.commit()
    return {"message": "Patient deleted successfully"}
