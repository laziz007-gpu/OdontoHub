"""
Add services to Render PostgreSQL database
"""
from sqlalchemy import create_engine, text

# Render database URL
DATABASE_URL = "postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql"

def add_services():
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            print("Connecting to Render database...")
            
            # Check table structure
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'services'
            """))
            columns = [row[0] for row in result]
            print(f"Services table columns: {columns}")
            
            # Services data (using only available columns: id, name, price, currency)
            services = [
                ("Консультация", 50000, "UZS"),
                ("Лечение кариеса", 150000, "UZS"),
                ("Чистка зубов", 100000, "UZS"),
                ("Отбеливание", 300000, "UZS"),
                ("Гигиена полости рта", 80000, "UZS"),
                ("Удаление зубного камня", 120000, "UZS"),
            ]
            
            for name, price, currency in services:
                conn.execute(text("""
                    INSERT INTO services (name, price, currency)
                    VALUES (:name, :price, :currency)
                    ON CONFLICT DO NOTHING
                """), {
                    "name": name,
                    "price": price,
                    "currency": currency
                })
            
            conn.commit()
            
            print(f"✅ {len(services)} ta xizmat qo'shildi!")
            
            # Verify
            result = conn.execute(text("""
                SELECT id, name, price, currency
                FROM services
                ORDER BY id
            """))
            
            services_list = result.fetchall()
            print(f"\nJami xizmatlar: {len(services_list)}")
            
            for service in services_list:
                print(f"  - {service[1]}: {service[2]:,} {service[3]}")
            
    except Exception as e:
        print(f"❌ Xato: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_services()
