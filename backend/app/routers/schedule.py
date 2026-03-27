from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.slot_generator import generate_slots
from datetime import datetime, time
from app.services.availability import build_free_slots
from app.models.appointment import Appointment

from app.db.deps import get_db
from app.models.schedule import Schedule
from app.models.dentist import DentistProfile
from app.schemas.schedule import ScheduleCreate, ScheduleOut

router = APIRouter(prefix="/schedule", tags=["Schedule"])







@router.post("/dentist/{dentist_id}", response_model=ScheduleOut, operation_id="create_dentist_schedule")
def create_schedule(
    dentist_id: int,
    data: ScheduleCreate,
    db: Session = Depends(get_db)
):
    dentist = db.query(DentistProfile).filter(
        DentistProfile.id == dentist_id
    ).first()

    if not dentist:
        raise HTTPException(status_code=404, detail="Dentist not found")

    schedule = Schedule(
        dentist_id=dentist_id,
        weekday=data.weekday,
        start_time=data.start_time,
        end_time=data.end_time,
        slot_duration=data.slot_duration
    )

    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    generate_slots(schedule, db)
    db.commit()

    return schedule

@router.get("/dentist/{dentist_id}/free")
def get_free_slots(
    dentist_id: int,
    date: str,
    db: Session = Depends(get_db)
):
    day = datetime.fromisoformat(date)

    work_start = datetime.combine(day.date(), time(9, 0))
    work_end = datetime.combine(day.date(), time(18, 0))

    appointments = db.query(Appointment).filter(
        Appointment.dentist_id == dentist_id,
        Appointment.start_time >= work_start,
        Appointment.start_time < work_end
    ).all()

    slots = build_free_slots(
        work_start=work_start,
        work_end=work_end,
        appointments=appointments,
        slot_minutes=30
    )

    return slots

