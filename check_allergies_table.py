"""
Check allergies table structure
"""
import sqlite3

def check_table():
    conn = sqlite3.connect('sql_app.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("PRAGMA table_info(allergies)")
        columns = cursor.fetchall()
        
        print("Allergies table columns:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_table()
