from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User, UserRole
from app.models.dentist import DentistProfile

router = APIRouter(prefix="/dentists", tags=["Dentists"])

@router.get("/me")
def dentist_me(
    user: User = Depends(require_role(UserRole.DENTIST)),
    db: Session = Depends(get_db)
):
    if not user.dentist_profile:
        # Auto-create missing profile
        profile = DentistProfile(
            user_id=user.id, 
            full_name="Dr. " + (user.email or user.phone)
        )
        db.add(profile)
        db.commit()
        db.refresh(user)

    return {
        "id": user.dentist_profile.id,
        "role": user.role,
        "full_name": user.dentist_profile.full_name,
        "message": "Hello dentist"
    }


@router.get("/me/stats")
def get_dentist_stats(
    user: User = Depends(require_role(UserRole.DENTIST)),
    db: Session = Depends(get_db)
):
    """Get dentist statistics"""
    from app.models.appointment import Appointment
    from app.models.patient import PatientProfile
    from sqlalchemy import func, distinct
    from datetime import datetime, timedelta
    
    # Получаем ID врача
    dentist_id = user.dentist_profile.id if user.dentist_profile else None
    
    if not dentist_id:
        return {
            "total_patients": 0,
            "total_appointments": 0,
            "completed_appointments": 0,
            "pending_appointments": 0,
            "appointments_today": 0,
            "appointments_this_month": 0,
            "new_patients_this_week": 0
        }
    
    # Считаем только пациентов добавленных врачом (с source)
    total_patients = db.query(func.count(PatientProfile.id)).filter(
        PatientProfile.source.isnot(None)
    ).scalar() or 0
    
    # Считаем все записи
    total_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == dentist_id
    ).scalar() or 0
    
    # Считаем завершенные записи
    completed_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == dentist_id,
        Appointment.status == "completed"
    ).scalar() or 0
    
    # Считаем ожидающие записи
    pending_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == dentist_id,
        Appointment.status.in_(["pending", "confirmed"])
    ).scalar() or 0
    
    # Дополнительная статистика для дашборда
    today = datetime.now().date()
    week_ago = datetime.now() - timedelta(days=7)
    month_start = datetime.now().replace(day=1)
    
    # Приёмы сегодня
    appointments_today = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == dentist_id,
        func.date(Appointment.start_time) == today
    ).scalar() or 0
    
    # Приёмы за месяц
    appointments_this_month = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == dentist_id,
        Appointment.start_time >= month_start
    ).scalar() or 0
    
    # Новые пациенты за неделю (только добавленные врачом)
    new_patients_this_week = db.query(func.count(PatientProfile.id)).filter(
        PatientProfile.source.isnot(None),
        PatientProfile.created_at >= week_ago
    ).scalar() or 0
    
    return {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "completed_appointments": completed_appointments,
        "pending_appointments": pending_appointments,
        "appointments_today": appointments_today,
        "appointments_this_month": appointments_this_month,
        "new_patients_this_week": new_patients_this_week
    }


@router.put("/me")
def update_dentist_profile(
    profile_data: dict,
    user: User = Depends(require_role(UserRole.DENTIST)),
    db: Session = Depends(get_db)
):
    """Update dentist profile"""
    if not user.dentist_profile:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Update profile fields
    for key, value in profile_data.items():
        if hasattr(user.dentist_profile, key):
            setattr(user.dentist_profile, key, value)
    
    db.commit()
    db.refresh(user.dentist_profile)
    
    return {
        "id": user.dentist_profile.id,
        "full_name": user.dentist_profile.full_name,
        "message": "Profile updated successfully"
    }
