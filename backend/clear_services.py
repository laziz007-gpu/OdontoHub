#!/usr/bin/env python3
"""
Удаление всех услуг из базы данных
"""
import os
from sqlalchemy import create_engine, text

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

def clear_services():
    """Удаляет все услуги из базы данных"""
    
    env_vars = load_env()
    database_url = env_vars.get('DATABASE_URL')
    
    if not database_url:
        print("❌ DATABASE_URL не найден в .env файле")
        return
    
    print(f"🔗 Подключаемся к БД...")
    
    engine = create_engine(database_url)
    
    with engine.connect() as conn:
        print("=== Проверка существующих услуг ===")
        
        # Показываем текущие услуги
        services_result = conn.execute(text("SELECT id, name, price, currency, dentist_id FROM services ORDER BY id"))
        services = services_result.fetchall()
        
        print(f"Найдено услуг: {len(services)}")
        
        if services:
            print("Существующие услуги:")
            for service in services:
                service_id, name, price, currency, dentist_id = service
                print(f"  ID {service_id}: {name} - {price} {currency} (Врач: {dentist_id})")
            
            print(f"\n🗑️  Удаляем все услуги...")
            
            # Удаляем все услуги
            result = conn.execute(text("DELETE FROM services"))
            conn.commit()
            
            print(f"✅ Удалено услуг: {result.rowcount}")
        else:
            print("✅ Услуги не найдены, таблица уже пуста")
        
        print("\n=== Проверка после удаления ===")
        
        # Проверяем результат
        services_result = conn.execute(text("SELECT COUNT(*) FROM services"))
        count = services_result.scalar()
        
        print(f"Услуг в базе: {count}")
        
        if count == 0:
            print("✅ Все услуги успешно удалены!")
        else:
            print(f"⚠️  Осталось услуг: {count}")

if __name__ == "__main__":
    try:
        clear_services()
        print("\n✅ Готово! Теперь можете создавать новые услуги.")
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        import traceback
        traceback.print_exc()