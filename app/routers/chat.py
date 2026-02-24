from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.message import Message
from app.models.appointment import Appointment
from app.schemas.message import MessageCreate, MessageOut
from app.core.security import get_current_user

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


@router.post(
    "/send",
    response_model=MessageOut,
    status_code=status.HTTP_201_CREATED
)
def send_message(
    data: MessageCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    appointment = db.query(Appointment).filter(
        Appointment.id == data.appointment_id
    ).first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # простая проверка доступа
    if current_user.id not in [
        appointment.patient_id,
        appointment.dentist_id
    ]:
        raise HTTPException(status_code=403, detail="No access to this chat")

    message = Message(
        appointment_id=data.appointment_id,
        sender_id=current_user.id,
        text=data.text
    )

    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get(
    "/{appointment_id}",
    response_model=list[MessageOut]
)
def get_chat_messages(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return (
        db.query(Message)
        .filter(Message.appointment_id == appointment_id)
        .order_by(Message.created_at)
        .all()
    )
