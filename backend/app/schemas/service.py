from pydantic import BaseModel

class ServiceBase(BaseModel):
    name: str
    price: float

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(ServiceBase):
    name: str | None = None
    price: float | None = None

class Service(ServiceBase):
    id: int
    currency: str = "UZS"

    class Config:
        from_attributes = True
