import sqlite3

db_path = 'D:/OdontoHUB/WebApp/OdontoHub-1/sql_app.db'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute('PRAGMA table_info(services)')
cols = [c[1] for c in cur.fetchall()]
print('Before:', cols)

if 'dentist_id' not in cols:
    cur.execute('ALTER TABLE services ADD COLUMN dentist_id INTEGER REFERENCES dentist_profiles(id)')
    conn.commit()
    print('Added dentist_id column')
else:
    print('dentist_id already exists')

cur.execute('PRAGMA table_info(services)')
cols = [c[1] for c in cur.fetchall()]
print('After:', cols)
conn.close()
print('Done!')
