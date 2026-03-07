# Backend Deployment Checklist

## Current Status
The backend at `D:\OdontoHUB\WebApp\Backend-new fix\Backend` is ready for deployment with one critical issue:

### Issue
PostgreSQL database on Render is missing these columns in `dentist_profiles` table:
- `age` (INTEGER)
- `experience_years` (INTEGER)
- `works_photos` (TEXT)

## Files Ready for Deployment

### ✅ Backend Code (All Clean)
- `app/main.py` - No merge conflicts, all models imported
- `app/routers/auth.py` - Passwordless auth implemented correctly
- `app/models/dentist.py` - All fields defined (age, experience_years, works_photos)
- `app/routers/dentists.py` - Returns all profile fields including new ones
- `app/core/database.py` - Configured for PostgreSQL
- `app/core/security.py` - JWT auth working
- `app/core/config.py` - Settings configured

### ✅ Deployment Configuration
- `requirements.txt` - All dependencies listed
- `runtime.txt` - Python 3.11.0
- `render.yaml` - Configured for Render deployment
- `init_db.py` - Creates tables and enum types safely

## Required Actions

### Step 1: Create Migration Script
Create file: `Backend-new fix/Backend/migrate_dentist_fields.py`

```python
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
```

### Step 2: Update render.yaml
In `Backend-new fix/Backend/render.yaml`, change:

```yaml
buildCommand: pip install -r requirements.txt && python init_db.py
```

To:

```yaml
buildCommand: pip install -r requirements.txt && python init_db.py && python migrate_dentist_fields.py
```

### Step 3: Deploy to Render

```bash
cd "D:\OdontoHUB\WebApp\Backend-new fix\Backend"
git add .
git commit -m "Add dentist profile fields migration for PostgreSQL"
git push origin master
```

Render will automatically:
1. Install dependencies
2. Run `init_db.py` to create tables and enums
3. Run `migrate_dentist_fields.py` to add missing columns
4. Start the server

## Verification Steps

After deployment, test these endpoints:

1. **Health Check**
   ```
   GET https://odontohub.onrender.com/health
   ```

2. **Database Debug**
   ```
   GET https://odontohub.onrender.com/debug-db
   ```
   Should show `dentist_profiles` table with all columns

3. **Register Dentist**
   ```
   POST https://odontohub.onrender.com/auth/register
   {
     "phone": "+998901234567",
     "email": "test@example.com",
     "full_name": "Test Doctor",
     "role": "dentist"
   }
   ```

4. **Get Dentist Profile**
   ```
   GET https://odontohub.onrender.com/dentists/me
   Authorization: Bearer <token>
   ```
   Should return all fields including age, experience_years, works_photos

## Frontend Configuration

Frontend is already configured correctly:
- `.env.production` has `VITE_API_URL=https://odontohub.onrender.com/`
- Auth flow redirects based on role (no Role page)
- All TypeScript errors fixed

## Summary

The backend code is clean and ready. The only issue is the missing database columns on Render's PostgreSQL. Once the migration script is added and deployed, everything should work perfectly.

## Alternative: Manual SQL Migration

If you prefer to run the migration manually on Render's PostgreSQL:

1. Go to Render Dashboard → Database → Shell
2. Run:
```sql
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS works_photos TEXT;
```

Then just push the code without the migration script.
