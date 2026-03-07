"""
Test dentist query to verify enum fix
"""
from app.db.session import SessionLocal
from app.db.base import Base  # This imports all models
from app.models.dentist import DentistProfile

def test_query():
    db = SessionLocal()
    
    try:
        print("Querying dentist profiles...")
        dentists = db.query(DentistProfile).all()
        
        print(f"\nFound {len(dentists)} dentist(s):")
        for dentist in dentists:
            print(f"  ID: {dentist.id}")
            print(f"  Name: {dentist.full_name}")
            print(f"  Status: {dentist.verification_status}")
            print(f"  Status value: {dentist.verification_status.value}")
            print()
        
        print("✓ Query successful!")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_query()
