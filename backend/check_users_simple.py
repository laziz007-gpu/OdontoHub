#!/usr/bin/env python3
"""
Simple script to check users in database
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

def check_users():
    """Check all users in database"""
    db = next(get_db())
    
    try:
        users = db.query(User).all()
        print(f"Found {len(users)} users:")
        print("-" * 60)
        
        for user in users:
            print(f"ID: {user.id}")
            print(f"Phone: {user.phone}")
            print(f"Role: {user.role}")
            print(f"Password: {user.password}")
            print(f"Email: {user.email}")
            print("-" * 60)
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_users()