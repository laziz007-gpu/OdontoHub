from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate, Service as ServiceSchema

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("/", response_model=List[ServiceSchema])
def read_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    services = db.query(Service).offset(skip).limit(limit).all()
    return services

@router.post("/", response_model=ServiceSchema)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.name == service.name).first()
    if db_service:
        raise HTTPException(status_code=400, detail="Service already exists")
    new_service = Service(name=service.name, price=service.price)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.patch("/{service_id}", response_model=ServiceSchema)
def update_service(service_id: int, service: ServiceUpdate, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_service, key, value)
    
    db.commit()
    db.refresh(db_service)
    return db_service

@router.delete("/{service_id}", response_model=ServiceSchema)
def delete_service(service_id: int, db: Session = Depends(get_db)):
    db_service = db.query(Service).filter(Service.id == service_id).first()
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(db_service)
    db.commit()
    return db_service
