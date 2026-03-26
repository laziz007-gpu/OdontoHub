from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float, Integer, ForeignKey

from .base import Base

class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    dentist_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("dentist_profiles.id"), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String)
    price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="UZS")
