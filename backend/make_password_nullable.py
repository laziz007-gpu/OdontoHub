"""
Make password field nullable for passwordless authentication
"""
from sqlalchemy import text
from app.core.database import engine

def make_password_nullable():
    with engine.connect() as conn:
        # For SQLite
        try:
            conn.execute(text("""
                CREATE TABLE users_new (
                    id INTEGER PRIMARY KEY,
                    phone VARCHAR UNIQUE NOT NULL,
                    email VARCHAR,
                    password VARCHAR,
                    role VARCHAR NOT NULL,
                    is_active BOOLEAN DEFAULT 1
                );
            """))
            
            conn.execute(text("""
                INSERT INTO users_new (id, phone, email, password, role, is_active)
                SELECT id, phone, email, password, role, is_active FROM users;
            """))
            
            conn.execute(text("DROP TABLE users;"))
            conn.execute(text("ALTER TABLE users_new RENAME TO users;"))
            conn.commit()
            print("✅ Password field is now nullable (SQLite)")
        except Exception as e:
            print(f"SQLite migration failed (might be PostgreSQL): {e}")
            conn.rollback()
            
            # For PostgreSQL
            try:
                conn.execute(text("ALTER TABLE users ALTER COLUMN password DROP NOT NULL;"))
                conn.commit()
                print("✅ Password field is now nullable (PostgreSQL)")
            except Exception as e2:
                print(f"❌ PostgreSQL migration failed: {e2}")
                conn.rollback()

if __name__ == "__main__":
    make_password_nullable()
