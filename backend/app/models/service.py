from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float, Integer, ForeignKey
from typing import Optional

from .base import Base

class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, index=True)
    price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String, default="UZS")
    dentist_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("dentists.id"), nullable=True)
