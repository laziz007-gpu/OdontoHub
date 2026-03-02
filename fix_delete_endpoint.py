"""
Script to fix the delete account endpoint in Backend-new fix
This script updates the /auth/me DELETE endpoint to properly handle cascading deletions
"""

import os

# Path to the auth.py file
AUTH_FILE_PATH = r"D:\OdontoHUB\WebApp\Backend-new fix\Backend\app\routers\auth.py"

# New delete endpoint code
NEW_DELETE_ENDPOINT = '''@router.delete("/me")
def delete_account(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Import models for deletion
        from app.models.appointment import Appointment
        from app.models.service import Service
        from app.models.prescription import Prescription
        from app.models.allergy import Allergy
        from app.models.payment import Payment
        from app.models.photo import PatientPhoto
        
        # Delete based on user role
        if user.role == UserRole.DENTIST:
            # Delete dentist's profile
            if user.dentist_profile:
                # Delete all appointments where this dentist is assigned
                db.query(Appointment).filter(Appointment.dentist_id == user.dentist_profile.id).delete()
                # Delete dentist profile
                db.delete(user.dentist_profile)
        
        elif user.role == UserRole.PATIENT:
            # Delete patient's profile and all related data
            if user.patient_profile:
                patient_id = user.patient_profile.id
                
                # Delete all appointments
                db.query(Appointment).filter(Appointment.patient_id == patient_id).delete()
                
                # Delete all prescriptions
                db.query(Prescription).filter(Prescription.patient_id == patient_id).delete()
                
                # Delete all allergies
                db.query(Allergy).filter(Allergy.patient_id == patient_id).delete()
                
                # Delete all payments
                db.query(Payment).filter(Payment.patient_id == patient_id).delete()
                
                # Delete all photos
                db.query(PatientPhoto).filter(PatientPhoto.patient_id == patient_id).delete()
                
                # Delete patient profile
                db.delete(user.patient_profile)
        
        # Finally, delete the user
        db.delete(user)
        db.commit()
        
        return {"message": "Account successfully deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete account: {str(e)}"
        )
'''

def fix_delete_endpoint():
    """Fix the delete endpoint in auth.py"""
    
    if not os.path.exists(AUTH_FILE_PATH):
        print(f"❌ Error: File not found at {AUTH_FILE_PATH}")
        return False
    
    # Read the current file
    with open(AUTH_FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the old delete endpoint
    start_marker = '@router.delete("/me")'
    
    if start_marker not in content:
        print("❌ Error: Could not find @router.delete('/me') in the file")
        return False
    
    # Find the start and end of the old endpoint
    start_idx = content.find(start_marker)
    
    # Find the next @router or end of file
    next_router_idx = content.find('@router.', start_idx + 1)
    if next_router_idx == -1:
        # If no next router, find the end of the file
        end_idx = len(content)
    else:
        end_idx = next_router_idx
    
    # Replace the old endpoint with the new one
    new_content = content[:start_idx] + NEW_DELETE_ENDPOINT + '\n\n' + content[end_idx:]
    
    # Write the updated content back
    with open(AUTH_FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Successfully updated the delete endpoint!")
    print(f"📝 File updated: {AUTH_FILE_PATH}")
    return True

if __name__ == "__main__":
    print("🔧 Fixing delete account endpoint...")
    print(f"📂 Target file: {AUTH_FILE_PATH}")
    print()
    
    success = fix_delete_endpoint()
    
    if success:
        print()
        print("✅ Done! The delete endpoint has been fixed.")
        print("🚀 Now restart your backend server:")
        print("   cd D:\\OdontoHUB\\WebApp\\Backend-new fix")
        print("   py -m uvicorn app.main:app --reload --port 8000")
    else:
        print()
        print("❌ Failed to fix the endpoint. Please check the error messages above.")
