import sqlite3
import os

# Connect to the database
db_path = "sql_app.db"
if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_column_if_not_exists(table, column, type_def):
    try:
        # Check if column exists
        cursor.execute(f"SELECT {column} FROM {table} LIMIT 1")
    except sqlite3.OperationalError:
        # Check if table exists first? No, error implies table exists but col doesn't 
        # (mostly, or table doesn't exist).
        # Let's check table existence first briefly
        try:
             cursor.execute(f"SELECT 1 FROM {table} LIMIT 1")
        except sqlite3.OperationalError:
            print(f"Table {table} does not exist!")
            return

        print(f"Adding column {column} to {table}...")
        try:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {type_def}")
            print(f"Added {column}")
        except Exception as e:
            print(f"Failed to add {column}: {e}")
    else:
        print(f"Column {column} already exists in {table}.")

# Add commonly missing columns based on the error
add_column_if_not_exists("patient_profiles", "birth_date", "DATETIME")
add_column_if_not_exists("patient_profiles", "gender", "VARCHAR")
add_column_if_not_exists("patient_profiles", "address", "VARCHAR")
add_column_if_not_exists("patient_profiles", "source", "VARCHAR")

conn.commit()
conn.close()
print("Schema update complete.")
