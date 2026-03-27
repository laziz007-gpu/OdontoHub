from sqlalchemy import Column, Integer, Time, ForeignKey
from app.db.base import Base

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)

    dentist_id = Column(
        Integer,
        ForeignKey("dentist_profiles.id"),
        nullable=False
    )

    weekday = Column(Integer, nullable=False)  # 0 = Monday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    slot_duration = Column(Integer, nullable=False)
