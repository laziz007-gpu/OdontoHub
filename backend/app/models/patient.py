from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, func
from datetime import datetime

from .base import Base


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    full_name: Mapped[str]
    birth_date: Mapped[datetime | None] = mapped_column(nullable=True)
    gender: Mapped[str | None] = mapped_column(nullable=True)
    address: Mapped[str | None] = mapped_column(nullable=True)
    source: Mapped[str | None] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    user = relationship("User", back_populates="patient_profile")
    prescriptions = relationship("Prescription", back_populates="patient", cascade="all, delete-orphan")
    allergies = relationship("Allergy", back_populates="patient", cascade="all, delete-orphan")
