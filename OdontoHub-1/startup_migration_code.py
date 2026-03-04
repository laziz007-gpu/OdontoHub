# Код для добавления в функцию on_startup() в app/main.py
# Добавьте ПЕРЕД строкой: Base.metadata.create_all(bind=engine, checkfirst=True)

    # Migrate dentist profile fields if missing
    try:
        from sqlalchemy import text, inspect
        inspector = inspect(engine)
        existing_columns = [col['name'] for col in inspector.get_columns('dentist_profiles')]
        
        fields_to_add = []
        if 'age' not in existing_columns:
            fields_to_add.append(('age', 'INTEGER'))
        if 'experience_years' not in existing_columns:
            fields_to_add.append(('experience_years', 'INTEGER'))
        if 'works_photos' not in existing_columns:
            fields_to_add.append(('works_photos', 'TEXT'))
        
        if fields_to_add:
            print(f"Adding missing dentist profile fields: {[f[0] for f in fields_to_add]}")
            with engine.begin() as conn:
                for field_name, field_type in fields_to_add:
                    conn.execute(text(
                        f"ALTER TABLE dentist_profiles ADD COLUMN {field_name} {field_type}"
                    ))
            print("✓ Dentist profile fields migration completed")
        else:
            print("✓ All dentist profile fields already exist")
    except Exception as e:
        print(f"Warning: Could not migrate dentist fields: {e}")
        # Don't fail startup if migration fails