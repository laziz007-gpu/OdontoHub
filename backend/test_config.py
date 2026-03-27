#!/usr/bin/env python3
"""
Тест конфигурации
"""

import os
from app.core.config import settings

def test_config():
    print("⚙️ Тест конфигурации")
    print("=" * 50)
    
    print(f"📁 Текущая директория: {os.getcwd()}")
    print(f"📄 .env файл существует: {os.path.exists('.env')}")
    
    # Проверяем переменные окружения
    print(f"\n🔗 DATABASE_URL из os.getenv: {os.getenv('DATABASE_URL', 'НЕ НАЙДЕН')[:50]}...")
    print(f"🔗 DATABASE_URL из settings: {settings.DATABASE_URL[:50] if settings.DATABASE_URL else 'НЕ НАЙДЕН'}...")
    
    print(f"\n🔐 SECRET_KEY: {settings.SECRET_KEY[:20]}...")
    print(f"⏰ TOKEN_EXPIRE: {settings.ACCESS_TOKEN_EXPIRE_MINUTES} минут")

if __name__ == "__main__":
    test_config()