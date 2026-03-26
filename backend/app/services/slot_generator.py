from datetime import datetime, timedelta
from app.models.time_slot import TimeSlot

def generate_slots(schedule, db):
    start = datetime.combine(datetime.today(), schedule.start_time)
    end = datetime.combine(datetime.today(), schedule.end_time)

    delta = timedelta(minutes=schedule.slot_duration)

    while start + delta <= end:
        slot = TimeSlot(
            schedule_id=schedule.id,
            start_time=start.time(),
            end_time=(start + delta).time(),
        )
        db.add(slot)
        start += delta
