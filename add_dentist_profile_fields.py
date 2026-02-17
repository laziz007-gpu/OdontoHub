"""
Script to add new fields to dentist_profiles table
Run this script to update the database schema
"""
from sqlalchemy import text
from app.core.database import engine

def add_dentist_profile_fields():
    with engine.connect() as conn:
        # Add new columns to dentist_profiles table
        try:
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS specialization VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS address VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS clinic VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS schedule VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS work_hours VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS telegram VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS instagram VARCHAR;
            """))
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN IF NOT EXISTS whatsapp VARCHAR;
            """))
            conn.commit()
            print("✅ Successfully added new fields to dentist_profiles table")
        except Exception as e:
            print(f"❌ Error adding fields: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_dentist_profile_fields()
