from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum, String, func
from datetime import datetime
import enum

from .base import Base


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class DentistProfile(Base):
    __tablename__ = "dentist_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    full_name: Mapped[str]
    pinfl: Mapped[str | None] = mapped_column(String, nullable=True)
    diploma_number: Mapped[str | None] = mapped_column(String, nullable=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, values_callable=lambda x: [e.value for e in x], create_type=False),
        default=VerificationStatus.PENDING
    )
    
    # Profile fields from EditDoctorProfile
    specialization: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    clinic: Mapped[str | None] = mapped_column(String, nullable=True)
    age: Mapped[int | None] = mapped_column(nullable=True)
    experience_years: Mapped[int | None] = mapped_column(nullable=True)
    schedule: Mapped[str | None] = mapped_column(String, nullable=True)
    work_hours: Mapped[str | None] = mapped_column(String, nullable=True)  # Format: "08:00-16:00"
    telegram: Mapped[str | None] = mapped_column(String, nullable=True)
    instagram: Mapped[str | None] = mapped_column(String, nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String, nullable=True)
    works_photos: Mapped[str | None] = mapped_column(String, nullable=True)  # JSON string of photo URLs
<<<<<<< HEAD
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime | None] = mapped_column(nullable=True, onupdate=func.now())
=======
>>>>>>> 5a553df4cba3528c9d0f8757cfab166f5ee26e83

    user = relationship("User", back_populates="dentist_profile")
