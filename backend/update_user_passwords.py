#!/usr/bin/env python3
"""
Script to update existing users with passwords
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

def update_passwords():
    """Update existing users with default passwords"""
    db = next(get_db())
    
    try:
        # Update doctor user
        doctor = db.query(User).filter(User.phone == "+998901234567").first()
        if doctor:
            doctor.password = "password123"
            print(f"Updated doctor password: {doctor.phone}")
        else:
            print("Doctor user not found")
        
        # Update patient user  
        patient = db.query(User).filter(User.phone == "+998911111111").first()
        if patient:
            patient.password = "password123"
            print(f"Updated patient password: {patient.phone}")
        else:
            print("Patient user not found")
            
        db.commit()
        print("✅ Passwords updated successfully!")
        
        # Show all users
        users = db.query(User).all()
        print("\nAll users:")
        for user in users:
            print(f"  - ID: {user.id}, Phone: {user.phone}, Role: {user.role}, Password: {user.password}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_passwords()