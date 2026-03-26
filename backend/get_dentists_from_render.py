"""
Get dentists list from Render PostgreSQL database
"""
from sqlalchemy import create_engine, text

# Render database URL
DATABASE_URL = "postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql"

def get_dentists():
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            print("Connecting to Render database...")
            
            # Get all dentists
            result = conn.execute(text("""
                SELECT 
                    id, 
                    user_id, 
                    full_name, 
                    specialization, 
                    phone, 
                    address, 
                    clinic, 
                    schedule, 
                    work_hours,
                    verification_status,
                    telegram,
                    instagram,
                    whatsapp
                FROM dentist_profiles
                ORDER BY id
            """))
            
            dentists = result.fetchall()
            
            print(f"\n{'='*80}")
            print(f"DOKTORLAR RO'YXATI (Jami: {len(dentists)} ta)")
            print(f"{'='*80}\n")
            
            if not dentists:
                print("❌ Bazada doktorlar topilmadi!")
                return
            
            for i, dentist in enumerate(dentists, 1):
                print(f"{i}. {dentist[2]}")  # full_name
                print(f"   ID: {dentist[0]}")
                print(f"   User ID: {dentist[1]}")
                print(f"   Mutaxassislik: {dentist[3] or 'Ko\'rsatilmagan'}")
                print(f"   Telefon: {dentist[4] or 'Ko\'rsatilmagan'}")
                print(f"   Manzil: {dentist[5] or 'Ko\'rsatilmagan'}")
                print(f"   Klinika: {dentist[6] or 'Ko\'rsatilmagan'}")
                print(f"   Ish vaqti: {dentist[8] or 'Ko\'rsatilmagan'}")
                print(f"   Status: {dentist[9]}")
                print(f"   Telegram: {dentist[10] or '-'}")
                print(f"   Instagram: {dentist[11] or '-'}")
                print(f"   WhatsApp: {dentist[12] or '-'}")
                print()
            
            print(f"{'='*80}")
            print("✅ Ma'lumotlar muvaffaqiyatli olindi!")
            print(f"{'='*80}")
            
    except Exception as e:
        print(f"❌ Xato: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    get_dentists()
