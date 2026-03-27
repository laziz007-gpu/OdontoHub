from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserRole
from app.models.review import Review
from app.models.dentist import DentistProfile
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/reviews", tags=["Reviews"])

class ReviewCreate(BaseModel):
    dentist_id: int
    appointment_id: Optional[int] = None
    rating: float
    comment: Optional[str] = None

@router.post("/")
def create_review(data: ReviewCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.PATIENT:
        raise HTTPException(status_code=403, detail="Only patients can leave reviews")

    patient_id = current_user.patient_profile.id if current_user.patient_profile else None
    if not patient_id:
        raise HTTPException(status_code=400, detail="Patient profile not found")

    if not (1 <= data.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    review = Review(
        dentist_id=data.dentist_id,
        patient_id=patient_id,
        appointment_id=data.appointment_id,
        rating=data.rating,
        comment=data.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Update dentist average rating
    avg = db.query(func.avg(Review.rating)).filter(Review.dentist_id == data.dentist_id).scalar()
    dentist = db.query(DentistProfile).filter(DentistProfile.id == data.dentist_id).first()
    if dentist and avg:
        dentist.rating = round(float(avg), 1)
        dentist.review_count = db.query(func.count(Review.id)).filter(Review.dentist_id == data.dentist_id).scalar() or 0
        db.commit()

    return {"id": review.id, "rating": review.rating, "comment": review.comment}

@router.get("/dentist/{dentist_id}")
def get_dentist_reviews(dentist_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.dentist_id == dentist_id).order_by(Review.created_at.desc()).all()
    avg = db.query(func.avg(Review.rating)).filter(Review.dentist_id == dentist_id).scalar()
    return {
        "average": round(float(avg), 1) if avg else 0,
        "count": len(reviews),
        "reviews": [{"id": r.id, "rating": r.rating, "comment": r.comment, "created_at": r.created_at} for r in reviews]
    }
