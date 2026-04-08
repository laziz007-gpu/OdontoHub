import sqlite3
import os

db_path = "sql_app.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("ALTER TABLE appointments ADD COLUMN visit_type VARCHAR DEFAULT 'primary'")
        conn.commit()
        print("visit_type column added successfully!")
    except sqlite3.OperationalError as e:
        print(f"Error (maybe column exists): {e}")
    conn.close()
else:
    print(f"DB not found at {db_path}")
