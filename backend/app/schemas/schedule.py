

from pydantic import BaseModel
from datetime import time

class ScheduleCreate(BaseModel):
    weekday: int
    start_time: time
    end_time: time
    slot_duration: int

class ScheduleOut(BaseModel):
    id: int
    weekday: int
    start_time: time
    end_time: time
    slot_duration: int

    class Config:
        from_attributes = True
