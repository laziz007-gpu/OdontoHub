"""
Add age, experience_years, and works_photos fields to dentist_profiles table
"""
from sqlalchemy import create_engine, text
import os
<<<<<<< HEAD
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
=======

# Use SQLite database
DATABASE_URL = "sqlite:///./sql_app.db"
>>>>>>> d841b42e906e9263abaa7f7afdc71bcb2e6af1ed
engine = create_engine(DATABASE_URL)

def add_fields():
    with engine.connect() as conn:
        # Add age column
        try:
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN age INTEGER
            """))
            conn.commit()
            print("✓ Added age column")
        except Exception as e:
            print(f"age column: {e}")
        
        # Add experience_years column
        try:
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN experience_years INTEGER
            """))
            conn.commit()
            print("✓ Added experience_years column")
        except Exception as e:
            print(f"experience_years column: {e}")
        
        # Add works_photos column
        try:
            conn.execute(text("""
                ALTER TABLE dentist_profiles 
                ADD COLUMN works_photos VARCHAR
            """))
            conn.commit()
            print("✓ Added works_photos column")
        except Exception as e:
            print(f"works_photos column: {e}")
        
        print("\n✓ Migration completed successfully!")

if __name__ == "__main__":
    add_fields()
