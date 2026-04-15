#!/usr/bin/env python3
"""
Исправление паролей пользователей
"""

import os
import sys
from dotenv import load_dotenv

# Загружаем переменные окружения
load_dotenv()

# Добавляем путь к приложению
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def fix_passwords():
    """Исправить пароли пользователей"""
    try:
        from sqlalchemy import create_engine, text
        from app.core.config import settings
        
        engine = create_engine(settings.DATABASE_URL)
        
        with engine.begin() as conn:
            # Устанавливаем пароль для врача Махмуд Пулатов
            conn.execute(text("""
                UPDATE users 
                SET password = 'password123' 
                WHERE id = 3 AND phone = '+998901234567'
            """))
            
            # Устанавливаем пароль для пациента Test Bemor
            conn.execute(text("""
                UPDATE users 
                SET password = 'password123' 
                WHERE id = 9 AND phone = '+998911111111'
            """))
            
            print("✅ Пароли обновлены:")
            print("   Врач +998901234567 -> password123")
            print("   Пациент +998911111111 -> password123")
                
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_passwords()