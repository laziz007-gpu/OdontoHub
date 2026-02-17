from pydantic import BaseModel, Field, field_validator
from datetime import datetime
from typing import Optional


class AllergyBase(BaseModel):
    allergen_name: str = Field(..., min_length=1, max_length=255)
    reaction_type: str = Field(..., min_length=1, max_length=255)
    severity: str = Field(..., pattern="^(mild|moderate|severe)$")
    notes: Optional[str] = None
    
    @field_validator('severity')
    @classmethod
    def validate_severity(cls, v):
        allowed = ['mild', 'moderate', 'severe']
        if v not in allowed:
            raise ValueError(f'Severity must be one of: {", ".join(allowed)}')
        return v


class AllergyCreate(AllergyBase):
    pass


class AllergyUpdate(BaseModel):
    allergen_name: Optional[str] = Field(None, min_length=1, max_length=255)
    reaction_type: Optional[str] = Field(None, min_length=1, max_length=255)
    severity: Optional[str] = Field(None, pattern="^(mild|moderate|severe)$")
    notes: Optional[str] = None
    
    @field_validator('severity')
    @classmethod
    def validate_severity(cls, v):
        if v is not None:
            allowed = ['mild', 'moderate', 'severe']
            if v not in allowed:
                raise ValueError(f'Severity must be one of: {", ".join(allowed)}')
        return v


class AllergySchema(AllergyBase):
    id: int
    patient_id: int
    documented_by: int
    documented_at: datetime
    
    class Config:
        from_attributes = True
