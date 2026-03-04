"""
Migration script to add missing dentist profile fields to PostgreSQL database.
This script is safe to run multiple times - it checks if columns exist before adding them.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Render provides 'postgres://' but SQLAlchemy requires 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)


def column_exists(conn, table_name, column_name):
    """Check if a column exists in a table."""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def migrate_dentist_fields():
    """Add missing fields to dentist_profiles table."""
    print("Starting migration for dentist_profiles table...")
    
    # Fields to add with their SQL types
    fields_to_add = [
        ("age", "INTEGER"),
        ("experience_years", "INTEGER"),
        ("works_photos", "TEXT"),
        ("created_at", "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"),
        ("updated_at", "TIMESTAMP"),
    ]
    
    with engine.begin() as conn:
        for field_name, field_type in fields_to_add:
            if not column_exists(conn, "dentist_profiles", field_name):
                print(f"Adding column: {field_name} ({field_type})")
                conn.execute(text(
                    f"ALTER TABLE dentist_profiles ADD COLUMN {field_name} {field_type}"
                ))
                print(f"✓ Column {field_name} added successfully")
            else:
                print(f"✓ Column {field_name} already exists, skipping")
    
    print("✓ Migration completed successfully!")


if __name__ == "__main__":
    try:
        migrate_dentist_fields()
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        raise
