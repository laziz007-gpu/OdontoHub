from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import require_role, get_current_user
from app.schemas.photo import PhotoCreate, PhotoUpdate, PhotoSchema
from app.models.photo import PatientPhoto
from app.models.user import User, UserRole

router = APIRouter()


@router.get("/patients/{patient_id}/photos", response_model=List[PhotoSchema])
def get_patient_photos(
    patient_id: int,
    category: str | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    query = db.query(PatientPhoto).filter(PatientPhoto.patient_id == patient_id)
    
    if category and category != 'all':
        query = query.filter(PatientPhoto.category == category)
    
    return query.order_by(PatientPhoto.uploaded_at.desc()).all()


@router.post("/patients/{patient_id}/photos", response_model=PhotoSchema)
def create_photo(
    patient_id: int,
    data: PhotoCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    photo = PatientPhoto(
        patient_id=patient_id,
        title=data.title,
        file_url=data.file_url,
        category=data.category,
        description=data.description,
        uploaded_by=user.id
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)
    return photo


@router.patch("/patients/{patient_id}/photos/{photo_id}", response_model=PhotoSchema)
def update_photo(
    patient_id: int,
    photo_id: int,
    data: PhotoUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    photo = db.query(PatientPhoto).filter(
        PatientPhoto.id == photo_id,
        PatientPhoto.patient_id == patient_id
    ).first()
    
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    for key, value in data.dict(exclude_unset=True).items():
        setattr(photo, key, value)
    
    db.commit()
    db.refresh(photo)
    return photo


@router.delete("/patients/{patient_id}/photos/{photo_id}")
def delete_photo(
    patient_id: int,
    photo_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.DENTIST))
):
    photo = db.query(PatientPhoto).filter(
        PatientPhoto.id == photo_id,
        PatientPhoto.patient_id == patient_id
    ).first()
    
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    
    db.delete(photo)
    db.commit()
    return {"message": "Photo deleted successfully"}
