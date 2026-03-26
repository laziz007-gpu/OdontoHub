"""
Fix verification_status enum values in database
The database has lowercase 'approved' but the enum type expects uppercase
"""
from sqlalchemy import create_engine, text
from app.core.config import settings

def fix_enum_values():
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        # First, check what we have
        result = conn.execute(text("""
            SELECT id, verification_status 
            FROM dentist_profiles
        """))
        
        print("Current verification_status values:")
        rows = result.fetchall()
        for row in rows:
            print(f"  ID {row[0]}: '{row[1]}'")
        
        if not rows:
            print("No dentist profiles found.")
            return
        
        # Drop the old enum type and recreate with correct values
        print("\nRecreating enum type...")
        
        # Step 1: Convert column to varchar temporarily
        conn.execute(text("""
            ALTER TABLE dentist_profiles 
            ALTER COLUMN verification_status TYPE VARCHAR(20)
        """))
        conn.commit()
        
        # Step 2: Drop old enum type if exists
        conn.execute(text("""
            DROP TYPE IF EXISTS verificationstatus CASCADE
        """))
        conn.commit()
        
        # Step 3: Create new enum type with lowercase values
        conn.execute(text("""
            CREATE TYPE verificationstatus AS ENUM ('pending', 'approved', 'rejected')
        """))
        conn.commit()
        
        # Step 4: Convert column back to enum
        conn.execute(text("""
            ALTER TABLE dentist_profiles 
            ALTER COLUMN verification_status TYPE verificationstatus 
            USING verification_status::verificationstatus
        """))
        conn.commit()
        
        print("✓ Enum type recreated successfully with lowercase values")
        
        # Verify
        result = conn.execute(text("""
            SELECT id, verification_status 
            FROM dentist_profiles
        """))
        
        print("\nVerified values:")
        for row in result:
            print(f"  ID {row[0]}: '{row[1]}'")

if __name__ == "__main__":
    fix_enum_values()
