from pydantic import BaseModel
from typing import Optional

class ServiceBase(BaseModel):
    name: str
    price: float
    dentist_id: Optional[int] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: str | None = None
    price: float | None = None

class Service(ServiceBase):
    id: int
    currency: str = "UZS"

    class Config:
        from_attributes = True
