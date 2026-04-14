from pydantic import BaseModel
from typing import Optional

class ServiceBase(BaseModel):
    name: str
    price: float

class ServiceCreate(ServiceBase):
    currency: Optional[str] = "UZS"

class ServiceUpdate(ServiceBase):
    name: str | None = None
    price: float | None = None
    dentist_id: Optional[int] = None

class Service(ServiceBase):
    id: int
    currency: str = "UZS"
    dentist_id: Optional[int] = None

    class Config:
        from_attributes = True
