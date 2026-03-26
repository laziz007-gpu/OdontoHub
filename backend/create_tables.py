from app.core.database import engine
from app.models.base import Base
from app.models import user, patient, dentist, appointment

Base.metadata.create_all(bind=engine)

print("✅ Tables created")

