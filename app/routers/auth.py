from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user

from app.schemas.auth import RegisterSchema, LoginSchema, TokenSchema
from app.models.user import User, UserRole
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile
from app.core.database import get_db
from app.core.security import create_access_token

router = APIRouter()


@router.post("/register", response_model=TokenSchema)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    try:
        # Check if phone already exists
        existing_user = db.query(User).filter(User.phone == data.phone).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Phone already registered")

<<<<<<< HEAD
    # Passwordless: no password required
    # data.role is a Pydantic enum — use .value to get the string for SQLAlchemy enum
    role_value = data.role.value  # e.g. "patient" or "dentist"
    user = User(
        phone=data.phone,
        email=data.email,
        password=None,  # No password for passwordless auth
        role=UserRole(role_value),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    if role_value == "patient":
        profile = PatientProfile(
            user_id=user.id,
            full_name=data.full_name
=======
        # Passwordless: no password required
        user = User(
            phone=data.phone,
            email=data.email,
            password=None,  # No password for passwordless auth
            role=UserRole(data.role),
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
        )
        db.add(user)
        db.commit()
        db.refresh(user)

<<<<<<< HEAD
    elif role_value == "dentist":
        profile = DentistProfile(
            user_id=user.id,
            full_name=data.full_name
=======
        # Create profile based on role
        if data.role.value == UserRole.PATIENT.value:
            profile = PatientProfile(
                user_id=user.id,
                full_name=data.full_name
            )
            db.add(profile)

        elif data.role.value == UserRole.DENTIST.value:
            profile = DentistProfile(
                user_id=user.id,
                full_name=data.full_name
            )
            db.add(profile)

        db.commit()

        # Create access token
        token = create_access_token({"user_id": user.id, "role": user.role.value})
        return {"access_token": token, "token_type": "bearer"}
    
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Registration error: {str(e)}")  # Log the error
        raise HTTPException(
            status_code=500, 
            detail=f"Registration failed: {str(e)}"
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83
        )

@router.post("/login", response_model=TokenSchema)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.phone == data.phone).first()

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Пользователь не найден"
            )

        access_token = create_access_token(
            {"sub": str(user.id), "role": user.role.value}
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {str(e)}")  # Log the error
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )




@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    full_name = "User"
    if user.role.value == UserRole.PATIENT.value and user.patient_profile:
        full_name = user.patient_profile.full_name
    elif user.role.value == UserRole.DENTIST.value and user.dentist_profile:
        full_name = user.dentist_profile.full_name

    return {
        "id": user.id,
        "phone": user.phone,
        "role": user.role.value,
        "email": user.email,
        "full_name": full_name
    }


@router.delete("/me")
def delete_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Import models for deletion
        from app.models.appointment import Appointment
        from app.models.service import Service
        from app.models.prescription import Prescription
        from app.models.allergy import Allergy
        from app.models.payment import Payment
        from app.models.photo import PatientPhoto
        
        # Delete based on user role
        if user.role == UserRole.DENTIST:
            # Delete dentist's profile
            if user.dentist_profile:
                # Delete all appointments where this dentist is assigned
                db.query(Appointment).filter(Appointment.dentist_id == user.dentist_profile.id).delete()
                # Delete dentist profile
                db.delete(user.dentist_profile)
        
        elif user.role == UserRole.PATIENT:
            # Delete patient's profile and all related data
            if user.patient_profile:
                patient_id = user.patient_profile.id
                
                # Delete all appointments
                db.query(Appointment).filter(Appointment.patient_id == patient_id).delete()
                
                # Delete all prescriptions
                db.query(Prescription).filter(Prescription.patient_id == patient_id).delete()
                
                # Delete all allergies
                db.query(Allergy).filter(Allergy.patient_id == patient_id).delete()
                
                # Delete all payments
                db.query(Payment).filter(Payment.patient_id == patient_id).delete()
                
                # Delete all photos
                db.query(PatientPhoto).filter(PatientPhoto.patient_id == patient_id).delete()
                
                # Delete patient profile
                db.delete(user.patient_profile)
        
        # Finally, delete the user
        db.delete(user)
        db.commit()
        
        return {"message": "Account successfully deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete account: {str(e)}"
        )

