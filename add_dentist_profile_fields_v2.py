"""
Add profile fields to dentist_profiles table
"""
from sqlalchemy import text
from app.core.database import engine

def add_dentist_profile_fields():
    with engine.connect() as conn:
        try:
            # Add new columns to dentist_profiles table
            columns_to_add = [
                "ALTER TABLE dentist_profiles ADD COLUMN specialization VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN phone VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN address VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN clinic VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN schedule VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN work_hours VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN telegram VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN instagram VARCHAR",
                "ALTER TABLE dentist_profiles ADD COLUMN whatsapp VARCHAR",
            ]
            
            for sql in columns_to_add:
                try:
                    conn.execute(text(sql))
                    print(f"✅ Executed: {sql}")
                except Exception as e:
                    if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                        print(f"⚠️  Column already exists, skipping: {sql}")
                    else:
                        print(f"❌ Error: {sql} - {e}")
            
            conn.commit()
            print("\n✅ All dentist profile fields added successfully!")
            
        except Exception as e:
            print(f"❌ Migration failed: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_dentist_profile_fields()
