from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
import base64

from app.core.database import get_db
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

    # access check - patient yoki dentist user_id orqali
    from app.models.patient import PatientProfile
    from app.models.dentist import DentistProfile

    patient_profile = db.query(PatientProfile).filter(PatientProfile.id == appointment.patient_id).first()
    dentist_profile = db.query(DentistProfile).filter(DentistProfile.id == appointment.dentist_id).first()

    allowed_user_ids = []
    if patient_profile:
        allowed_user_ids.append(patient_profile.user_id)
    if dentist_profile:
        allowed_user_ids.append(dentist_profile.user_id)

    if current_user.id not in allowed_user_ids:
        raise HTTPException(status_code=403, detail="No access to this chat")

    message = Message(
        appointment_id=data.appointment_id,
        sender_id=current_user.id,
        text=data.text,
        image_data=data.image_data,
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


@router.delete("/{message_id}")
def delete_message(
    message_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg.sender_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your message")
    db.delete(msg)
    db.commit()
    return {"ok": True}


@router.patch("/{message_id}")
def edit_message(
    message_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg.sender_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your message")
    msg.text = data.get("text", msg.text)
    db.commit()
    db.refresh(msg)
    return {"id": msg.id, "text": msg.text}
