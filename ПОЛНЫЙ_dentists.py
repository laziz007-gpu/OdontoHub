# ═══════════════════════════════════════════════════════════
# ПОЛНЫЙ КОД ДЛЯ РОУТЕРА
# ═══════════════════════════════════════════════════════════
# Файл: Backend/app/routers/dentists.py
# Скопируйте ВЕСЬ этот код и замените содержимое файла
# ═══════════════════════════════════════════════════════════

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User, UserRole
from app.models.dentist import DentistProfile, VerificationStatus

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
            full_name=user.full_name or "Dr. " + (user.email or user.phone)
        )
        db.add(profile)
        db.commit()
        db.refresh(user)

    profile = user.dentist_profile
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "pinfl": profile.pinfl,
        "diploma_number": profile.diploma_number,
        "verification_status": profile.verification_status,
        "specialization": profile.specialization,
        "phone": profile.phone or user.phone,
        "address": profile.address,
        "clinic": profile.clinic,
        "age": profile.age,
        "experience_years": profile.experience_years,
        "schedule": profile.schedule,
        "work_hours": profile.work_hours,
        "telegram": profile.telegram,
        "instagram": profile.instagram,
        "whatsapp": profile.whatsapp,
        "works_photos": profile.works_photos
    }


@router.get("/me/stats")
def get_dentist_stats(
    user: User = Depends(require_role(UserRole.DENTIST)),
    db: Session = Depends(get_db)
):
    """Get dentist statistics"""
    from app.models.appointment import Appointment
    from app.models.patient import PatientProfile
    from sqlalchemy import func
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


# ═══════════════════════════════════════════════════════════
# НОВЫЕ ENDPOINTS ДЛЯ АДМИН ПАНЕЛИ
# ═══════════════════════════════════════════════════════════

@router.get("/")
def get_all_dentists(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Get list of all dentists with their information.
    
    Query parameters:
    - skip: number of records to skip (for pagination)
    - limit: maximum number of records to return (default 100)
    
    Example: GET /dentists?skip=0&limit=20
    """
    from sqlalchemy import func
    from app.models.appointment import Appointment
    
    # Get all dentist profiles
    dentists = db.query(DentistProfile).offset(skip).limit(limit).all()
    
    result = []
    for profile in dentists:
        user = profile.user
        
        # Calculate statistics
        total_appointments = db.query(func.count(Appointment.id)).filter(
            Appointment.dentist_id == profile.id
        ).scalar() or 0
        
        completed_appointments = db.query(func.count(Appointment.id)).filter(
            Appointment.dentist_id == profile.id,
            Appointment.status == "completed"
        ).scalar() or 0
        
        pending_appointments = db.query(func.count(Appointment.id)).filter(
            Appointment.dentist_id == profile.id,
            Appointment.status.in_(["pending", "confirmed"])
        ).scalar() or 0
        
        result.append({
            "id": profile.id,
            "user_id": profile.user_id,
            "full_name": profile.full_name,
            "email": user.email,
            "phone": user.phone or profile.phone,
            "pinfl": profile.pinfl,
            "diploma_number": profile.diploma_number,
            "verification_status": profile.verification_status.value,
            "specialization": profile.specialization,
            "address": profile.address,
            "clinic": profile.clinic,
            "age": profile.age,
            "experience_years": profile.experience_years,
            "schedule": profile.schedule,
            "work_hours": profile.work_hours,
            "telegram": profile.telegram,
            "instagram": profile.instagram,
            "whatsapp": profile.whatsapp,
            "works_photos": profile.works_photos,
            "stats": {
                "total_appointments": total_appointments,
                "completed_appointments": completed_appointments,
                "pending_appointments": pending_appointments
            }
        })
    
    # Get total count
    total_count = db.query(func.count(DentistProfile.id)).scalar()
    
    return {
        "dentists": result,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }


@router.get("/{dentist_id}")
def get_dentist_by_id(
    dentist_id: int,
    db: Session = Depends(get_db)
):
    """
    Get specific dentist by ID.
    
    Example: GET /dentists/1
    """
    from sqlalchemy import func
    from app.models.appointment import Appointment
    
    profile = db.query(DentistProfile).filter(DentistProfile.id == dentist_id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Dentist not found")
    
    user = profile.user
    
    # Calculate statistics
    total_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == profile.id
    ).scalar() or 0
    
    completed_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == profile.id,
        Appointment.status == "completed"
    ).scalar() or 0
    
    pending_appointments = db.query(func.count(Appointment.id)).filter(
        Appointment.dentist_id == profile.id,
        Appointment.status.in_(["pending", "confirmed"])
    ).scalar() or 0
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "email": user.email,
        "phone": user.phone or profile.phone,
        "pinfl": profile.pinfl,
        "diploma_number": profile.diploma_number,
        "verification_status": profile.verification_status.value,
        "specialization": profile.specialization,
        "address": profile.address,
        "clinic": profile.clinic,
        "age": profile.age,
        "experience_years": profile.experience_years,
        "schedule": profile.schedule,
        "work_hours": profile.work_hours,
        "telegram": profile.telegram,
        "instagram": profile.instagram,
        "whatsapp": profile.whatsapp,
        "works_photos": profile.works_photos,
        "stats": {
            "total_appointments": total_appointments,
            "completed_appointments": completed_appointments,
            "pending_appointments": pending_appointments
        }
    }


@router.put("/{dentist_id}/verification")
def update_dentist_verification(
    dentist_id: int,
    verification_data: dict,
    db: Session = Depends(get_db)
):
    """
    Update dentist verification status.
    
    Body: {"verification_status": "approved" | "rejected" | "pending"}
    
    Example: PUT /dentists/1/verification
    """
    profile = db.query(DentistProfile).filter(DentistProfile.id == dentist_id).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Dentist not found")
    
    status = verification_data.get("verification_status")
    if status not in ["approved", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid verification status")
    
    profile.verification_status = VerificationStatus(status)
    db.commit()
    db.refresh(profile)
    
    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "verification_status": profile.verification_status.value,
        "message": f"Verification status updated to {status}"
    }
