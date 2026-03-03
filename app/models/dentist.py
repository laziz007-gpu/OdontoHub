


class VerificationStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class DentistProfile(Base):
    __tablename__ = "dentist_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    full_name: Mapped[str]
    pinfl: Mapped[str | None] = mapped_column(String, nullable=True)
    diploma_number: Mapped[str | None] = mapped_column(String, nullable=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, values_callable=lambda x: [e.value for e in x], create_type=False),
        default=VerificationStatus.PENDING
    )
    
    # Profile fields from EditDoctorProfile
    specialization: Mapped[str | None] = mapped_column(String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    address: Mapped[str | None] = mapped_column(String, nullable=True)
    clinic: Mapped[str | None] = mapped_column(String, nullable=True)
    age: Mapped[int | None] = mapped_column(nullable=True)
    experience_years: Mapped[int | None] = mapped_column(nullable=True)
    schedule: Mapped[str | None] = mapped_column(String, nullable=True)
    work_hours: Mapped[str | None] = mapped_column(String, nullable=True)  # Format: "08:00-16:00"
    telegram: Mapped[str | None] = mapped_column(String, nullable=True)
    instagram: Mapped[str | None] = mapped_column(String, nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String, nullable=True)
    works_photos: Mapped[str | None] = mapped_column(String, nullable=True)  # JSON string of photo URLs

    user = relationship("User", back_populates="dentist_profile")

    @router.get("/")
    def get_all_dentists(
            db: Session = Depends(get_db),
            skip: int = 0,
            limit: int = 100
    ):
        """
        Get list of all dentists with their information.

        Query parameters:
        - skip: number of records to skip (for pagination)
        - limit: maximum number of records to return (default 100)

        Example: GET /dentists?skip=0&limit=20
        """
        from sqlalchemy import func
        from app.models.appointment import Appointment

        # Get all dentist profiles
        dentists = db.query(DentistProfile).offset(skip).limit(limit).all()

        result = []
        for profile in dentists:
            user = profile.user

            # Calculate statistics
            total_appointments = db.query(func.count(Appointment.id)).filter(
                Appointment.dentist_id == profile.id
            ).scalar() or 0

            completed_appointments = db.query(func.count(Appointment.id)).filter(
                Appointment.dentist_id == profile.id,
                Appointment.status == "completed"
            ).scalar() or 0

            pending_appointments = db.query(func.count(Appointment.id)).filter(
                Appointment.dentist_id == profile.id,
                Appointment.status.in_(["pending", "confirmed"])
            ).scalar() or 0

            result.append({
                "id": profile.id,
                "user_id": profile.user_id,
                "full_name": profile.full_name,
                "email": user.email,
                "phone": user.phone or profile.phone,
                "pinfl": profile.pinfl,
                "diploma_number": profile.diploma_number,
                "verification_status": profile.verification_status.value,
                "specialization": profile.specialization,
                "address": profile.address,
                "clinic": profile.clinic,
                "age": profile.age,
                "experience_years": profile.experience_years,
                "schedule": profile.schedule,
                "work_hours": profile.work_hours,
                "telegram": profile.telegram,
                "instagram": profile.instagram,
                "whatsapp": profile.whatsapp,
                "works_photos": profile.works_photos,
                "stats": {
                    "total_appointments": total_appointments,
                    "completed_appointments": completed_appointments,
                    "pending_appointments": pending_appointments
                }
            })

        # Get total count
        total_count = db.query(func.count(DentistProfile.id)).scalar()

        return {
            "dentists": result,
            "total": total_count,
            "skip": skip,
            "limit": limit
        }

    # ═══════════════════════════════════════════════════════════
    # ДОПОЛНИТЕЛЬНЫЕ ENDPOINTS (опционально)
    # ═══════════════════════════════════════════════════════════

    @router.get("/{dentist_id}")
    def get_dentist_by_id(
            dentist_id: int,
            db: Session = Depends(get_db)
    ):
        """
        Get specific dentist by ID.

        Example: GET /dentists/1
        """
        from fastapi import HTTPException
        from sqlalchemy import func
        from app.models.appointment import Appointment

        profile = db.query(DentistProfile).filter(DentistProfile.id == dentist_id).first()

        if not profile:
            raise HTTPException(status_code=404, detail="Dentist not found")

        user = profile.user

        # Calculate statistics
        total_appointments = db.query(func.count(Appointment.id)).filter(
            Appointment.dentist_id == profile.id
        ).scalar() or 0

        completed_appointments = db.query(func.count(Appointment.id)).filter(
            Appointment.dentist_id == profile.id,
            Appointment.status == "completed"
        ).scalar() or 0

        pending_appointments = db.query(func.count(Appointment.id)).filter(
            Appointment.dentist_id == profile.id,
            Appointment.status.in_(["pending", "confirmed"])
        ).scalar() or 0

        return {
            "id": profile.id,
            "user_id": profile.user_id,
            "full_name": profile.full_name,
            "email": user.email,
            "phone": user.phone or profile.phone,
            "pinfl": profile.pinfl,
            "diploma_number": profile.diploma_number,
            "verification_status": profile.verification_status.value,
            "specialization": profile.specialization,
            "address": profile.address,
            "clinic": profile.clinic,
            "age": profile.age,
            "experience_years": profile.experience_years,
            "schedule": profile.schedule,
            "work_hours": profile.work_hours,
            "telegram": profile.telegram,
            "instagram": profile.instagram,
            "whatsapp": profile.whatsapp,
            "works_photos": profile.works_photos,
            "stats": {
                "total_appointments": total_appointments,
                "completed_appointments": completed_appointments,
                "pending_appointments": pending_appointments
            }
        }

    @router.put("/{dentist_id}/verification")
    def update_dentist_verification(
            dentist_id: int,
            verification_data: dict,
            db: Session = Depends(get_db)
    ):
        """
        Update dentist verification status.

        Body: {"verification_status": "approved" | "rejected" | "pending"}

        Example: PUT /dentists/1/verification
        """
        from fastapi import HTTPException
        from app.models.dentist import VerificationStatus

        profile = db.query(DentistProfile).filter(DentistProfile.id == dentist_id).first()

        if not profile:
            raise HTTPException(status_code=404, detail="Dentist not found")

        status = verification_data.get("verification_status")
        if status not in ["approved", "rejected", "pending"]:
            raise HTTPException(status_code=400, detail="Invalid verification status")

        profile.verification_status = VerificationStatus(status)
        db.commit()
        db.refresh(profile)

        return {
            "id": profile.id,
            "full_name": profile.full_name,
            "verification_status": profile.verification_status.value,
            "message": f"Verification status updated to {status}"
        }

