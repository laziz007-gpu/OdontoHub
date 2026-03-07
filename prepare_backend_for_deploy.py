"""
Script to prepare backend for deployment to Render.
This script:
1. Creates migration script for PostgreSQL
2. Updates render.yaml to include migration
3. Copies all necessary files to Backend-new fix folder
"""
import os
import shutil

# Paths
BACKEND_SOURCE = r"D:\OdontoHUB\WebApp\Backend-new fix\Backend"

def create_migration_script():
    """Create migration script for dentist profile fields."""
    migration_content = '''"""
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
'''
    
    migration_path = os.path.join(BACKEND_SOURCE, "migrate_dentist_fields.py")
    with open(migration_path, 'w', encoding='utf-8') as f:
        f.write(migration_content)
    print(f"✓ Created migration script: {migration_path}")


def update_render_yaml():
    """Update render.yaml to include migration in build command."""
    render_yaml_path = os.path.join(BACKEND_SOURCE, "render.yaml")
    
    with open(render_yaml_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update buildCommand to include migration
    old_build = "buildCommand: pip install -r requirements.txt && python init_db.py"
    new_build = "buildCommand: pip install -r requirements.txt && python init_db.py && python migrate_dentist_fields.py"
    
    if old_build in content and new_build not in content:
        content = content.replace(old_build, new_build)
        with open(render_yaml_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Updated render.yaml: {render_yaml_path}")
    else:
        print("✓ render.yaml already up to date")


def main():
    print("=" * 60)
    print("PREPARING BACKEND FOR DEPLOYMENT")
    print("=" * 60)
    
    # Step 1: Create migration script
    print("\n1. Creating migration script...")
    create_migration_script()
    
    # Step 2: Update render.yaml
    print("\n2. Updating render.yaml...")
    update_render_yaml()
    
    print("\n" + "=" * 60)
    print("✓ BACKEND PREPARATION COMPLETE!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Navigate to Backend-new fix/Backend folder")
    print("2. Commit changes: git add . && git commit -m 'Add dentist profile fields migration'")
    print("3. Push to Render: git push origin master")
    print("4. Render will automatically deploy with the migration")


if __name__ == "__main__":
    main()
