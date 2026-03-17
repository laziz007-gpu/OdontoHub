"""
Migration: Create dentist_days_off table
"""
import sqlite3

db_path = 'D:/OdontoHUB/WebApp/OdontoHub-1/sql_app.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Check existing tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cur.fetchall()]
print('Existing tables:', tables)

if 'dentist_days_off' not in tables:
    cur.execute("""
        CREATE TABLE dentist_days_off (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            dentist_id INTEGER NOT NULL REFERENCES dentist_profiles(id),
            date DATE NOT NULL,
            reason TEXT,
            is_recurring BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("CREATE INDEX ix_dentist_days_off_dentist_id ON dentist_days_off(dentist_id)")
    cur.execute("CREATE INDEX ix_dentist_days_off_date ON dentist_days_off(date)")
    conn.commit()
    print('Created dentist_days_off table!')
else:
    print('dentist_days_off table already exists')

conn.close()
print('Done!')
