from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentSchema
from app.models.payment import Payment
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/patients/{patient_id}/payments", response_model=List[PaymentSchema])
def get_patient_payments(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    return db.query(Payment).filter(
        Payment.patient_id == patient_id
    ).order_by(Payment.payment_date.desc()).all()


@router.get("/patients/{patient_id}/payments/stats")
def get_payment_stats(
    patient_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    from sqlalchemy import func
    
    payments = db.query(Payment).filter(Payment.patient_id == patient_id).all()
    
    total_amount = sum(p.amount for p in payments)
    total_paid = sum(p.paid_amount for p in payments)
    total_debt = total_amount - total_paid
    
    return {
        "total_amount": total_amount,
        "total_paid": total_paid,
        "total_debt": total_debt
    }


@router.post("/patients/{patient_id}/payments", response_model=PaymentSchema)
def create_payment(
    patient_id: int,
    data: PaymentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    payment = Payment(
        patient_id=patient_id,
        amount=data.amount,
        paid_amount=data.paid_amount,
        service_name=data.service_name,
        appointment_id=data.appointment_id,
        status=data.status,
        notes=data.notes,
        recorded_by=user.id
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment


@router.patch("/patients/{patient_id}/payments/{payment_id}", response_model=PaymentSchema)
def update_payment(
    patient_id: int,
    payment_id: int,
    data: PaymentUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    payment = db.query(Payment).filter(
        Payment.id == payment_id,
        Payment.patient_id == patient_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(payment, key, value)
    
    db.commit()
    db.refresh(payment)
    return payment


@router.delete("/patients/{patient_id}/payments/{payment_id}")
def delete_payment(
    patient_id: int,
    payment_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    payment = db.query(Payment).filter(
        Payment.id == payment_id,
        Payment.patient_id == patient_id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    db.delete(payment)
    db.commit()
    return {"message": "Payment deleted successfully"}
