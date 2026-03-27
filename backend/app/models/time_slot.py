from sqlalchemy import Column, Integer, Time, Boolean, ForeignKey
from app.db.base import Base

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("schedules.id"), nullable=False)

    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    is_booked = Column(Boolean, default=False)
