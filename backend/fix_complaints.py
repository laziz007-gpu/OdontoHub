"""Fix complaints table - make patient_id nullable"""
import sys
sys.path.insert(0, '.')

from app.core.database import engine
from sqlalchemy import text, inspect

print("Connecting to database...")

try:
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables: {tables}")
    
    if 'complaints' in tables:
        cols = inspector.get_columns('complaints')
        for col in cols:
            print(f"  {col['name']}: nullable={col['nullable']}")
        
        # Make patient_id nullable
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE complaints ALTER COLUMN patient_id DROP NOT NULL"))
        print("OK: patient_id is now nullable")
    else:
        # Create the table from scratch with nullable patient_id
        from app.models.complaint import Complaint
        from app.models.base import Base
        # Import all models to register them
        from app.models.user import User
        from app.models.patient import PatientProfile
        from app.models.dentist import DentistProfile
        Base.metadata.create_all(bind=engine)
        print("OK: complaints table created")

except Exception as e:
    print(f"ERROR: {e}")
    import traceback; traceback.print_exc()
