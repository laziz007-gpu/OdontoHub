import os
from dotenv import load_dotenv
load_dotenv()

print("DATABASE_URL:", os.getenv("DATABASE_URL"))
print("SECRET_KEY:", os.getenv("SECRET_KEY"))

try:
    from sqlalchemy import create_engine, text
    
    database_url = os.getenv("DATABASE_URL")
    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Подключение к Neon успешно!")
        
        # Проверяем пользователей
        result = conn.execute(text("SELECT COUNT(*) FROM users"))
        count = result.fetchone()[0]
        print(f"Пользователей в базе: {count}")
        
except Exception as e:
    print(f"❌ Ошибка: {e}")