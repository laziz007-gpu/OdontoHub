"""
Script to check database structure and data
"""
import sqlite3

conn = sqlite3.connect('sql_app.db')
cursor = conn.cursor()

print("=" * 50)
print("DATABASE STRUCTURE CHECK")
print("=" * 50)

# Check dentist_profiles table structure
print("\n1. dentist_profiles table structure:")
cursor.execute("PRAGMA table_info(dentist_profiles)")
columns = cursor.fetchall()
for col in columns:
    print(f"   - {col[1]}: {col[2]} (nullable: {not col[3]})")

# Check if there are any dentist profiles
print("\n2. Dentist profiles count:")
cursor.execute("SELECT COUNT(*) FROM dentist_profiles")
count = cursor.fetchone()[0]
print(f"   Total: {count}")

if count > 0:
    print("\n3. Dentist profiles data:")
    cursor.execute("SELECT id, user_id, full_name, pinfl FROM dentist_profiles")
    profiles = cursor.fetchall()
    for p in profiles:
        print(f"   ID: {p[0]}, User ID: {p[1]}, Name: {p[2]}, PINFL: {p[3]}")

# Check users
print("\n4. Users count:")
cursor.execute("SELECT COUNT(*) FROM users")
count = cursor.fetchone()[0]
print(f"   Total: {count}")

conn.close()
print("\n" + "=" * 50)
print("✅ Database check completed!")
print("=" * 50)
