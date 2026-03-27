from datetime import datetime, timedelta


def build_free_slots(
    work_start: datetime,
    work_end: datetime,
    appointments: list,
    slot_minutes: int,
):
    slots = []
    current = work_start

    appointments = sorted(appointments, key=lambda a: a.start_time)

    for appt in appointments:
        while current + timedelta(minutes=slot_minutes) <= appt.start_time:
            slots.append({
                "start": current,
                "end": current + timedelta(minutes=slot_minutes)
            })
            current += timedelta(minutes=slot_minutes)

        current = max(current, appt.end_time)

    while current + timedelta(minutes=slot_minutes) <= work_end:
        slots.append({
            "start": current,
            "end": current + timedelta(minutes=slot_minutes)
        })
        current += timedelta(minutes=slot_minutes)

    return slots
