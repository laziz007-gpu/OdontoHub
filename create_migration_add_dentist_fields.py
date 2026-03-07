"""
Создаёт SQL миграцию для добавления полей age, experience_years, works_photos
в таблицу dentist_profiles для PostgreSQL на Render.com
"""

migration_sql = """
-- Add new columns to dentist_profiles table
ALTER TABLE dentist_profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS works_photos TEXT;

-- Optional: Add comments
COMMENT ON COLUMN dentist_profiles.age IS 'Dentist age';
COMMENT ON COLUMN dentist_profiles.experience_years IS 'Years of experience';
COMMENT ON COLUMN dentist_profiles.works_photos IS 'JSON array of work photo URLs';
"""

print("=== SQL Migration for Render PostgreSQL ===\n")
print(migration_sql)
print("\n=== Instructions ===")
print("1. Go to Render.com dashboard")
print("2. Open your PostgreSQL database")
print("3. Go to 'Shell' or 'Query' tab")
print("4. Copy and paste the SQL above")
print("5. Execute the query")
print("\nOr run via psql:")
print("psql $DATABASE_URL -c \"ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS age INTEGER, ADD COLUMN IF NOT EXISTS experience_years INTEGER, ADD COLUMN IF NOT EXISTS works_photos TEXT;\"")
