from sqlalchemy import String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .base import Base


class Prescription(Base):
    __tablename__ = "prescriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("patient_profiles.id"), index=True)
    medication_name: Mapped[str] = mapped_column(String(255))
    dosage: Mapped[str] = mapped_column(String(100))  # e.g., "500mg", "2 tablets"
    frequency: Mapped[str] = mapped_column(String(100))  # e.g., "twice daily", "every 8 hours"
    duration: Mapped[str] = mapped_column(String(100))  # e.g., "7 days", "2 weeks"
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    prescribed_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))  # Doctor user_id
    prescribed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    patient = relationship("PatientProfile", back_populates="prescriptions")
    doctor = relationship("User", foreign_keys=[prescribed_by])
