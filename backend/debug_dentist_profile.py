#!/usr/bin/env python3
"""
Debug dentist profile loading
"""
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    env_vars = {}
    
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
    
    return env_vars

def debug_dentist_profile():
    """Debug dentist profile"""
    
    env_vars = load_env()
    database_url = env_vars.get('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL не найден в .env файле")
        return
    
    print(f"🔗 Подключаемся к БД...")
    
    engine = create_engine(database_url)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    with SessionLocal() as db:
        print("=== Проверка пользователя ID 4 (врач) ===")
        
        # Import models
        from app.models.user import User
        from app.models.dentist import DentistProfile
        
        # Get user with dentist profile
        user = db.query(User).filter(User.id == 4).first()
        
        if not user:
            print("❌ Пользователь ID 4 не найден")
            return
        
        print(f"✅ Пользователь найден:")
        print(f"   ID: {user.id}")
        print(f"   Phone: {user.phone}")
        print(f"   Role: {user.role.value}")
        print(f"   Has dentist_profile: {user.dentist_profile is not None}")
        
        if user.dentist_profile:
            profile = user.dentist_profile
            print(f"✅ Профиль врача:")
            print(f"   Profile ID: {profile.id}")
            print(f"   Full Name: {profile.full_name}")
            print(f"   User ID: {profile.user_id}")
            print(f"   Verification Status: {profile.verification_status.value}")
        else:
            print("❌ Профиль врача не найден!")
            
            # Check if profile exists in database
            profile = db.query(DentistProfile).filter(DentistProfile.user_id == 4).first()
            if profile:
                print(f"⚠️  Профиль существует в БД, но не загружается через relationship:")
                print(f"   Profile ID: {profile.id}")
                print(f"   Full Name: {profile.full_name}")
            else:
                print("❌ Профиль врача вообще не существует в БД")

if __name__ == "__main__":
    try:
        debug_dentist_profile()
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()