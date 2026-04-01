import sqlite3
import os

db_path = "odontohub.db"
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute("ALTER TABLE dentist_profiles ADD COLUMN diploma_photo_url VARCHAR")
        conn.commit()
        print("Column added successfully!")
    except sqlite3.OperationalError as e:
        print(f"Error (maybe column exists): {e}")
    conn.close()
else:
    print(f"DB not found at {db_path}")
