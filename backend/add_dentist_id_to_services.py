import sqlite3
import os

db_path = "sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("ALTER TABLE services ADD COLUMN dentist_id INTEGER REFERENCES dentists(id)")
        conn.commit()
        print("dentist_id column added to services successfully!")
    except sqlite3.OperationalError as e:
        print(f"Error (maybe column exists): {e}")
    conn.close()
else:
    print(f"DB not found at {db_path}")
