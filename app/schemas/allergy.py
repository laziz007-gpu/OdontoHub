from pydantic import BaseModel
from datetime import datetime


class AllergyBase(BaseModel):
    allergen_name: str
    reaction_type: str | None = None
    severity: str | None = None
    notes: str | None = None


class AllergyCreate(AllergyBase):
    pass


class AllergyUpdate(BaseModel):
    allergen_name: str | None = None
    reaction_type: str | None = None
    severity: str | None = None
    notes: str | None = None


class AllergySchema(AllergyBase):
    id: int
    patient_id: int
    documented_by: int | None
    documented_at: datetime

    class Config:
        from_attributes = True
