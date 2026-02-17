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
    # Проверяем существование пользователя
    if db.query(User).filter(User.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Этот номер уже зарегистрирован")

    # Создаём пользователя БЕЗ пароля
    user = User(
        phone=data.phone,
        email=data.email,
        password=None,  # Без пароля
        role=data.role.value if hasattr(data.role, 'value') else data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Создаём профиль
    role_str = data.role.value if hasattr(data.role, 'value') else data.role
    if role_str == "patient":
        profile = PatientProfile(
            user_id=user.id,
            full_name=data.full_name
        )
        db.add(profile)

    elif role_str == "dentist":
        profile = DentistProfile(
            user_id=user.id,
            full_name=data.full_name
        )
        db.add(profile)

    db.commit()

    # Генерируем токен
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login", response_model=TokenSchema)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    # Ищем пользователя по телефону
    user = db.query(User).filter(User.phone == data.phone).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Пользователь с таким номером не найден"
        )

    # Генерируем токен (без проверки пароля)
    access_token = create_access_token(
        {"sub": str(user.id), "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }




@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    full_name = "User"
    if user.role == "patient" and user.patient_profile:
        full_name = user.patient_profile.full_name
    elif user.role == "dentist" and user.dentist_profile:
        full_name = user.dentist_profile.full_name

    return {
        "id": user.id,
        "phone": user.phone,
        "role": user.role,
        "email": user.email,
        "full_name": full_name
    }

