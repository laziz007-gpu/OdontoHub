from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Enum, String
import enum

from .base import Base


class VerificationStatus(enum.Enum):
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
        Enum(VerificationStatus), default=VerificationStatus.PENDING
    )
    
    # Profile fields from EditDoctorProfile
    specialization: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    clinic: Mapped[str | None] = mapped_column(String, nullable=True)
    schedule: Mapped[str | None] = mapped_column(String, nullable=True)
    work_hours: Mapped[str | None] = mapped_column(String, nullable=True)  # Format: "08:00-16:00"
    telegram: Mapped[str | None] = mapped_column(String, nullable=True)
    instagram: Mapped[str | None] = mapped_column(String, nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String, nullable=True)

    user = relationship("User", back_populates="dentist_profile")
