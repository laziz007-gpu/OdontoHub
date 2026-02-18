from pydantic import BaseModel
from datetime import datetime


class PhotoBase(BaseModel):
    title: str
    file_url: str
    category: str  # xray, treatment, other
    description: str | None = None


class PhotoCreate(PhotoBase):
    pass


class PhotoUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    description: str | None = None


class PhotoSchema(PhotoBase):
    id: int
    patient_id: int
    uploaded_at: datetime
    uploaded_by: int | None

    class Config:
        from_attributes = True
