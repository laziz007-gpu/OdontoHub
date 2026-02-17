from sqlalchemy import String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from .base import Base


class AllergySeverity(str, enum.Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"


class Allergy(Base):
    __tablename__ = "allergies"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("patient_profiles.id"), index=True)
    allergen_name: Mapped[str] = mapped_column(String(255))  # e.g., "Penicillin", "Latex"
    reaction_type: Mapped[str] = mapped_column(String(255))  # e.g., "Rash", "Anaphylaxis"
    severity: Mapped[str] = mapped_column(String(20))  # AllergySeverity enum value as string
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    documented_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))  # Doctor user_id
    documented_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    patient = relationship("PatientProfile", back_populates="allergies")
    doctor = relationship("User", foreign_keys=[documented_by])
