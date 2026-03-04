"""
Скрипт для миграции базы данных на Render.com
Запускается автоматически при деплое или вручную
"""
import os
import psycopg2
from psycopg2 import sql

def run_migration():
    # Получаем DATABASE_URL из переменных окружения
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("ERROR: DATABASE_URL not found in environment variables")
        return False
    
    try:
        # Подключаемся к базе данных
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        print("Connected to database successfully")
        
        # Выполняем миграцию
        migration_sql = """
        ALTER TABLE dentist_profiles 
        ADD COLUMN IF NOT EXISTS age INTEGER,
        ADD COLUMN IF NOT EXISTS experience_years INTEGER,
        ADD COLUMN IF NOT EXISTS works_photos TEXT;
        """
        
        cur.execute(migration_sql)
        conn.commit()
        
        print("✓ Migration completed successfully!")
        print("✓ Added columns: age, experience_years, works_photos")
        
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"✗ Migration failed: {str(e)}")
        return False

if __name__ == "__main__":
    success = run_migration()
    exit(0 if success else 1)
