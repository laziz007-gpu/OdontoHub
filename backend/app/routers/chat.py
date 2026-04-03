from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, Query
from sqlalchemy.orm import Session
from sqlalchemy import select
from jose import jwt, JWTError
from datetime import datetime

from app.core.database import get_db
from app.models.message import Message
from app.models.appointment import Appointment
from app.models.user import User
from app.models.patient import PatientProfile
from app.models.dentist import DentistProfile
from app.schemas.message import MessageCreate, MessageOut
from app.schemas.chat import WSMessage
from app.core.security import get_current_user
from app.core.config import settings
from app.services.chat_manager import manager
from app.services.notification_service import NotificationService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

def _resolve_participants(db: Session, appointment_id: int) -> tuple[Appointment, PatientProfile, DentistProfile] | None:
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return None
    p_profile = db.query(PatientProfile).filter(PatientProfile.id == appointment.patient_id).first()
    d_profile = db.query(DentistProfile).filter(DentistProfile.id == appointment.dentist_id).first()
    if not p_profile or not d_profile:
        return None
    return appointment, p_profile, d_profile


def _resolve_recipient_user_id(
    sender_user_id: int,
    patient_profile: PatientProfile,
    dentist_profile: DentistProfile
) -> int | None:
    if sender_user_id == patient_profile.user_id:
        return dentist_profile.user_id
    if sender_user_id == dentist_profile.user_id:
        return patient_profile.user_id
    return None


def get_token_user(db: Session, token: str) -> User | None:
    """Helper for WebSocket JWT authentication from query string."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            return None
        
        result = db.execute(select(User).filter(User.id == int(user_id)))
        return result.scalar_one_or_none()
    except (JWTError, ValueError):
        return None

@router.websocket("/ws")
async def websocket_chat(
    websocket: WebSocket,
    token: str = Query(...),
    db: Session = Depends(get_db)
):
    user: User | None = None
    try:
        user = get_token_user(db, token)
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

        await manager.connect(user.id, websocket)
        await websocket.send_json({"status": "connected", "user_id": user.id})

    except Exception:
        try:
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
        except:
            pass
        return

    try:
        while True:
            try:
                message_data = await websocket.receive_json()
                ws_msg = WSMessage(**message_data)
            except Exception as e:
                await websocket.send_json({"error": "Invalid format", "detail": str(e)})
                continue

            participants = _resolve_participants(db, ws_msg.appointment_id)
            if not participants:
                await websocket.send_json({"error": "Appointment not found"})
                continue
            appointment, p_profile, d_profile = participants

            recipient_user_id = _resolve_recipient_user_id(user.id, p_profile, d_profile)
            if recipient_user_id is None:
                await websocket.send_json({"error": "Not authorized for this appointment"})
                continue

            new_message = Message(
                appointment_id=ws_msg.appointment_id,
                sender_id=user.id,
                text=ws_msg.text,
                image_data=ws_msg.image_data,
                created_at=datetime.utcnow()
            )
            db.add(new_message)
            try:
                db.commit()
                db.refresh(new_message)
            except Exception:
                db.rollback()
                await websocket.send_json({"error": "Failed to save message"})
                continue

            delivery_payload = {
                "id": new_message.id,
                "appointment_id": new_message.appointment_id,
                "sender_id": new_message.sender_id,
                "text": new_message.text,
                "image_data": new_message.image_data,
                "created_at": new_message.created_at.isoformat()
            }

            await manager.send_personal_message(delivery_payload, user.id)
            if manager.is_online(recipient_user_id):
                await manager.send_personal_message(delivery_payload, recipient_user_id)
            else:
                try:
                    NotificationService.notify_new_message(
                        db=db,
                        recipient_user_id=recipient_user_id,
                        sender_name=user.dentist_profile.full_name if user.dentist_profile else (user.patient_profile.full_name if user.patient_profile else "Foydalanuvchi"),
                        text=ws_msg.text or "",
                        appointment_id=ws_msg.appointment_id
                    )
                except Exception:
                    pass

    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        if user:
            manager.disconnect(user.id)

# --- Existing Sync Endpoints (Kept for compatibility) ---

@router.post("/send", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(data: MessageCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    participants = _resolve_participants(db, data.appointment_id)
    if not participants:
        raise HTTPException(status_code=404, detail="Appointment not found")
    _, p_profile, d_profile = participants
    recipient_user_id = _resolve_recipient_user_id(current_user.id, p_profile, d_profile)
    if recipient_user_id is None:
        raise HTTPException(status_code=403, detail="Not authorized")

    message = Message(
        appointment_id=data.appointment_id,
        sender_id=current_user.id,
        text=data.text,
        image_data=data.image_data,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    delivery_payload = {
        "id": message.id,
        "appointment_id": message.appointment_id,
        "sender_id": message.sender_id,
        "text": message.text,
        "image_data": message.image_data,
        "created_at": message.created_at.isoformat() if message.created_at else datetime.utcnow().isoformat(),
    }
    if manager.is_online(recipient_user_id):
        manager.send_personal_message_sync(delivery_payload, recipient_user_id)
    else:
        try:
            NotificationService.notify_new_message(
                db=db,
                recipient_user_id=recipient_user_id,
                sender_name=current_user.dentist_profile.full_name if current_user.dentist_profile else (current_user.patient_profile.full_name if current_user.patient_profile else "Foydalanuvchi"),
                text=data.text or "",
                appointment_id=data.appointment_id
            )
        except Exception:
            pass

    return message

@router.get("/{appointment_id}", response_model=list[MessageOut])
def get_chat_messages(appointment_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Message).filter(Message.appointment_id == appointment_id).order_by(Message.created_at).all()

@router.delete("/{message_id}")
def delete_message(message_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg or msg.sender_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(msg)
    db.commit()
    return {"ok": True}
