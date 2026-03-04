@echo off
echo ============================================================
echo BACKEND DEPLOYMENT SCRIPT
echo ============================================================
echo.

set BACKEND_PATH=D:\OdontoHUB\WebApp\Backend-new fix\Backend

echo Step 1: Creating migration script...
echo.

(
echo """
echo Migration script to add missing dentist profile fields to PostgreSQL database.
echo This script is safe to run multiple times - it checks if columns exist before adding them.
echo """
echo import os
echo from dotenv import load_dotenv
echo from sqlalchemy import create_engine, text, inspect
echo.
echo load_dotenv^(^)
echo.
echo DATABASE_URL = os.getenv^("DATABASE_URL", "sqlite:///./sql_app.db"^)
echo.
echo # Render provides 'postgres://' but SQLAlchemy requires 'postgresql://'
echo if DATABASE_URL.startswith^("postgres://"^):
echo     DATABASE_URL = DATABASE_URL.replace^("postgres://", "postgresql://", 1^)
echo.
echo engine = create_engine^(DATABASE_URL^)
echo.
echo.
echo def column_exists^(conn, table_name, column_name^):
echo     """Check if a column exists in a table."""
echo     inspector = inspect^(engine^)
echo     columns = [col['name'] for col in inspector.get_columns^(table_name^)]
echo     return column_name in columns
echo.
echo.
echo def migrate_dentist_fields^(^):
echo     """Add missing fields to dentist_profiles table."""
echo     print^("Starting migration for dentist_profiles table..."^)
echo     
echo     # Fields to add with their SQL types
echo     fields_to_add = [
echo         ^("age", "INTEGER"^),
echo         ^("experience_years", "INTEGER"^),
echo         ^("works_photos", "TEXT"^),
echo     ]
echo     
echo     with engine.begin^(^) as conn:
echo         for field_name, field_type in fields_to_add:
echo             if not column_exists^(conn, "dentist_profiles", field_name^):
echo                 print^(f"Adding column: {field_name} ^({field_type}^)"^)
echo                 conn.execute^(text^(
echo                     f"ALTER TABLE dentist_profiles ADD COLUMN {field_name} {field_type}"
echo                 ^)^)
echo                 print^(f"✓ Column {field_name} added successfully"^)
echo             else:
echo                 print^(f"✓ Column {field_name} already exists, skipping"^)
echo     
echo     print^("✓ Migration completed successfully!"^)
echo.
echo.
echo if __name__ == "__main__":
echo     try:
echo         migrate_dentist_fields^(^)
echo     except Exception as e:
echo         print^(f"❌ Migration failed: {str^(e^)}"^)
echo         raise
) > "%BACKEND_PATH%\migrate_dentist_fields.py"

echo ✓ Migration script created
echo.

echo Step 2: Updating render.yaml...
echo.

cd "%BACKEND_PATH%"

powershell -Command "(Get-Content render.yaml) -replace 'buildCommand: pip install -r requirements.txt && python init_db.py$', 'buildCommand: pip install -r requirements.txt && python init_db.py && python migrate_dentist_fields.py' | Set-Content render.yaml"

echo ✓ render.yaml updated
echo.

echo Step 3: Git operations...
echo.

git add .
git status

echo.
echo ============================================================
echo READY TO DEPLOY!
echo ============================================================
echo.
echo Review the changes above. If everything looks good, run:
echo.
echo   cd "%BACKEND_PATH%"
echo   git commit -m "Add dentist profile fields migration for PostgreSQL"
echo   git push origin master
echo.
echo Render will automatically deploy the changes.
echo ============================================================
pause
