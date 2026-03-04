# Скопируйте этот код и вставьте в app/main.py
# Добавьте ПОСЛЕ функции health_check() и ПЕРЕД функцией debug_db()

@app.get("/migrate-dentist-fields")
def migrate_dentist_fields():
    """
    One-time migration endpoint to add missing dentist profile fields.
    Safe to call multiple times - checks if columns exist before adding.
    """
    from sqlalchemy import text, inspect
    
    try:
        inspector = inspect(engine)
        existing_columns = [col['name'] for col in inspector.get_columns('dentist_profiles')]
        
        fields_to_add = []
        if 'age' not in existing_columns:
            fields_to_add.append(('age', 'INTEGER'))
        if 'experience_years' not in existing_columns:
            fields_to_add.append(('experience_years', 'INTEGER'))
        if 'works_photos' not in existing_columns:
            fields_to_add.append(('works_photos', 'TEXT'))
        
        if not fields_to_add:
            return {
                "status": "success",
                "message": "All fields already exist",
                "existing_fields": ["age", "experience_years", "works_photos"]
            }
        
        with engine.begin() as conn:
            for field_name, field_type in fields_to_add:
                conn.execute(text(
                    f"ALTER TABLE dentist_profiles ADD COLUMN {field_name} {field_type}"
                ))
        
        return {
            "status": "success",
            "message": "Migration completed successfully!",
            "added_fields": [f[0] for f in fields_to_add]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": f"Migration failed: {str(e)}"
        }
