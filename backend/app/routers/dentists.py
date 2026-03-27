from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import require_role
from app.models.user import User, UserRole
from app.models.dentist import DentistProfile

router = APIRouter(prefix="/dentists", tags=["Dentists"])

@router.get("/")
def get_all_dentists(db: Session = Depends(get_db)):
    """Get all approved dentists (public endpoint)"""
    from sqlalchemy.orm import joinedload
    
    dentists = db.query(DentistProfile).options(
        joinedload(DentistProfile.user)
    ).filter(
        DentistProfile.verification_status == "approved"
    ).all()
    
    result = []
    for dentist in dentists:
        result.append({
            "id": dentist.id,
            "user_id": dentist.user_id,
            "full_name": dentist.full_name,
            "specialization": dentist.specialization,
            "phone": dentist.user.phone if dentist.user else None,  # Исправлено
            "email": dentist.user.email if dentist.user else None,  # Добавлено
            "address": dentist.address,
            "clinic": dentist.clinic,
            "schedule": dentist.schedule,
            "work_hours": dentist.work_hours,
            "telegram": dentist.telegram,
            "instagram": dentist.instagram,
            "whatsapp": dentist.whatsapp,
            "rating": dentist.rating,  # Добавлено
            "review_count": dentist.review_count,  # Добавлено
            "verification_status": dentist.verification_status.value if hasattr(dentist.verification_status, 'value') else dentist.verification_status
        })
    
    return result

@router.get("/me")
def dentist_me(
    user: User = Depends(require_role(UserRole.DENTIST)),
    db: Session = Depends(get_db)
):
    if not user.dentist_profile:
        # Не создаем автоматически профиль с мок данными
        from fastapi import HTTPException
        raise HTTPException(
            status_code=404, 
            detail="Dentist profile not found. Please complete your registration."
        )

    profile = user.dentist_profile
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": profile.full_name,
        "pinfl": profile.pinfl,
        "diploma_number": profile.diploma_number,
        "verification_status": profile.verification_status.value if hasattr(profile.verification_status, 'value') else profile.verification_status,
        "specialization": profile.specialization,
        "phone": user.phone,  # Берем из user, а не из profile
        "email": user.email,  # Добавляем email
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
        "rating": profile.rating,  # Добавляем рейтинг
        "review_count": profile.review_count  # Добавляем количество отзывов
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
    
    # Unique patients for this dentist
    total_patients = db.query(func.count(distinct(Appointment.patient_id))).filter(
        Appointment.dentist_id == dentist_id
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
    
    # New patients this week for this dentist
    new_patients_this_week = db.query(func.count(distinct(Appointment.patient_id))).filter(
        Appointment.dentist_id == dentist_id,
        Appointment.start_time >= week_ago
    ).scalar() or 0

    # Reviews
    from app.models.review import Review
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.dentist_id == dentist_id).scalar()
    total_reviews = db.query(func.count(Review.id)).filter(Review.dentist_id == dentist_id).scalar() or 0

    return {
        "total_patients": total_patients,
        "total_appointments": total_appointments,
        "completed_appointments": completed_appointments,
        "pending_appointments": pending_appointments,
        "appointments_today": appointments_today,
        "appointments_this_month": appointments_this_month,
        "new_patients_this_week": new_patients_this_week,
        "average_rating": round(float(avg_rating), 1) if avg_rating else 0,
        "total_reviews": total_reviews,
    }


@router.put("/me")
def update_dentist_profile(
    profile_data: dict,
    user: User = Depends(require_role(UserRole.DENTIST)),
    db: Session = Depends(get_db)
):
    """Update dentist profile - doctors fill their own data"""
    if not user.dentist_profile:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile = user.dentist_profile
    
    # Список разрешенных полей для обновления
    allowed_fields = [
        'full_name', 'specialization', 'clinic', 'address', 'age', 
        'experience_years', 'schedule', 'work_hours', 'telegram', 
        'instagram', 'whatsapp', 'works_photos', 'pinfl', 'diploma_number'
    ]
    
    # Обновляем только разрешенные поля
    updated_fields = []
    for key, value in profile_data.items():
        if key in allowed_fields and hasattr(profile, key):
            setattr(profile, key, value)
            updated_fields.append(key)
    
    # Если заполнены основные поля, можно рассмотреть для одобрения
    required_fields = ['specialization', 'clinic', 'pinfl', 'diploma_number']
    has_required = all(getattr(profile, field) for field in required_fields)
    
    if has_required and profile.verification_status.value == 'pending':
        # Можно добавить логику автоматического одобрения или уведомления админа
        pass
    
    db.commit()
    db.refresh(profile)
    
    return {
        "id": profile.id,
        "full_name": profile.full_name,
        "verification_status": profile.verification_status.value,
        "updated_fields": updated_fields,
        "message": "Profile updated successfully",
        "ready_for_approval": has_required
    }

@router.get("/pending")
def get_pending_dentists(db: Session = Depends(get_db)):
    """Get all pending dentists for admin approval"""
    from sqlalchemy.orm import joinedload
    
    dentists = db.query(DentistProfile).options(
        joinedload(DentistProfile.user)
    ).filter(
        DentistProfile.verification_status == "pending"
    ).all()
    
    result = []
    for dentist in dentists:
        # Проверяем, заполнены ли основные поля
        required_fields = ['specialization', 'clinic', 'pinfl', 'diploma_number']
        has_required = all(getattr(dentist, field) for field in required_fields)
        
        result.append({
            "id": dentist.id,
            "user_id": dentist.user_id,
            "full_name": dentist.full_name,
            "phone": dentist.user.phone if dentist.user else None,
            "email": dentist.user.email if dentist.user else None,
            "specialization": dentist.specialization,
            "clinic": dentist.clinic,
            "address": dentist.address,
            "pinfl": dentist.pinfl,
            "diploma_number": dentist.diploma_number,
            "age": dentist.age,
            "experience_years": dentist.experience_years,
            "created_at": dentist.created_at.isoformat() if dentist.created_at else None,
            "ready_for_approval": has_required,
            "verification_status": dentist.verification_status.value
        })
    
    return result

@router.put("/{dentist_id}/approve")
def approve_dentist(dentist_id: int, db: Session = Depends(get_db)):
    """Approve a pending dentist (admin only)"""
    from app.models.dentist import VerificationStatus
    
    dentist = db.query(DentistProfile).filter(DentistProfile.id == dentist_id).first()
    
    if not dentist:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Dentist not found")
    
    if dentist.verification_status != VerificationStatus.PENDING:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Dentist is not pending approval")
    
    # Проверяем, заполнены ли обязательные поля
    required_fields = ['specialization', 'clinic', 'pinfl', 'diploma_number']
    missing_fields = [field for field in required_fields if not getattr(dentist, field)]
    
    if missing_fields:
        from fastapi import HTTPException
        raise HTTPException(
            status_code=400, 
            detail=f"Missing required fields: {', '.join(missing_fields)}"
        )
    
    dentist.verification_status = VerificationStatus.APPROVED
    db.commit()
    
    return {
        "id": dentist.id,
        "full_name": dentist.full_name,
        "verification_status": "approved",
        "message": "Dentist approved successfully"
    }

@router.put("/{dentist_id}/reject")
def reject_dentist(dentist_id: int, db: Session = Depends(get_db)):
    """Reject a pending dentist (admin only)"""
    from app.models.dentist import VerificationStatus
    
    dentist = db.query(DentistProfile).filter(DentistProfile.id == dentist_id).first()
    
    if not dentist:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Dentist not found")
    
    dentist.verification_status = VerificationStatus.REJECTED
    db.commit()
    
    return {
        "id": dentist.id,
        "full_name": dentist.full_name,
        "verification_status": "rejected",
        "message": "Dentist rejected"
    }