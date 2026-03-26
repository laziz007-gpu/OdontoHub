import sys
import os

# Add current directory to path just in case
sys.path.append(os.getcwd())

try:
    from app.models.dentist import DentistProfile
    print("SUCCESS: app.models.dentist.DentistProfile imported successfully")
except ImportError as e:
    print(f"FAILURE: Could not import app.models.dentist: {e}")
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"ERROR: An unexpected error occurred: {e}")
    import traceback
    traceback.print_exc()
