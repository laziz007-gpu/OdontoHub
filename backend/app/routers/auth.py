from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.schemas.auth import RegisterSchema, LoginSchema, TokenSchema
from app.models.user import User, UserRole
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile, VerificationStatus
from app.core.database import get_db
from app.core.security import create_access_token

router = APIRouter()


@router.post("/register", response_model=TokenSchema)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    phone = data.phone.strip()
    email = data.email.strip() if data.email else None
    full_name = data.full_name.strip()

    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")

    role_value = data.role.value

    try:
        user = User(
            phone=phone,
            email=email,
            password=data.password,  # Store password directly for now (should be hashed in production)
            role=UserRole(role_value),
        )
        db.add(user)
        db.flush()

        if role_value == "patient":
            db.add(PatientProfile(user_id=user.id, full_name=full_name))
        elif role_value == "dentist":
            db.add(
                DentistProfile(
                    user_id=user.id,
                    full_name=full_name,
                    verification_status=VerificationStatus.APPROVED,
                )
            )

        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Phone already registered")
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(exc)}")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenSchema)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    print(f"[DEBUG] LOGIN: Received phone: '{data.phone}', password: '{data.password}'")
    user = db.query(User).filter(User.phone == data.phone).first()
    print(f"[DEBUG] LOGIN: User found: {user is not None}")

    if not user:
        users = db.query(User).limit(5).all()
        for u in users:
            print(f"   - ID: {u.id}, Phone: '{u.phone}', Role: {u.role}")
        raise HTTPException(status_code=401, detail="Пользователь не найден")

    # Check password
    if user.password != data.password:
        print(f"[DEBUG] LOGIN: Password mismatch. Expected: '{user.password}', Got: '{data.password}'")
        raise HTTPException(status_code=401, detail="Неверный пароль")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    full_name = "User"
    patient_id = None
    dentist_id = None

    if user.role.value == UserRole.PATIENT.value and user.patient_profile:
        full_name = user.patient_profile.full_name
        patient_id = user.patient_profile.id
    elif user.role.value == UserRole.DENTIST.value and user.dentist_profile:
        full_name = user.dentist_profile.full_name
        dentist_id = user.dentist_profile.id

    return {
        "id": user.id,
        "phone": user.phone,
        "role": user.role.value,
        "email": user.email,
        "full_name": full_name,
        "patient_id": patient_id,
        "dentist_id": dentist_id,
    }


@router.delete("/delete-account")
def delete_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        db.delete(user)
        db.commit()
        return {"message": "Account deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
