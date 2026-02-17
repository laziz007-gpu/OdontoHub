from sqlalchemy import String, Boolean, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from .base import Base




class UserRole(enum.Enum):
    PATIENT = "patient"
    DENTIST = "dentist"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    phone: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String, nullable=True)
    password: Mapped[str | None] = mapped_column(String, nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False)
    dentist_profile = relationship("DentistProfile", back_populates="user", uselist=False)
