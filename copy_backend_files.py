"""
Script to copy updated backend files from OdontoHub-1/app to Backend-new fix/Backend/app
Run this from the OdontoHub-1 directory
"""
import shutil
import os
from pathlib import Path

# Source files in OdontoHub-1/app
source_base = Path(__file__).parent / "app"

# Destination: Backend-new fix/Backend/app
# Go up two levels from OdontoHub-1, then into Backend-new fix/Backend/app
dest_base = Path(__file__).parent.parent / "Backend-new fix" / "Backend" / "app"

# Files to copy
files_to_copy = [
    "routers/dentists.py",
    "routers/auth.py",  # Fixed merge conflicts
    "models/dentist.py"
]

print("🔄 Copying updated backend files...")
print(f"Source: {source_base}")
print(f"Destination: {dest_base}")
print()

if not dest_base.exists():
    print(f"❌ Error: Destination folder not found: {dest_base}")
    print("Please check the Backend folder path.")
    exit(1)

copied_count = 0
for file_path in files_to_copy:
    source_file = source_base / file_path
    dest_file = dest_base / file_path
    
    if not source_file.exists():
        print(f"⚠️  Source file not found: {source_file}")
        continue
    
    # Create destination directory if it doesn't exist
    dest_file.parent.mkdir(parents=True, exist_ok=True)
    
    # Copy the file
    shutil.copy2(source_file, dest_file)
    print(f"✓ Copied: {file_path}")
    copied_count += 1

print()
print(f"✅ Successfully copied {copied_count} file(s)!")
print()
print("Next steps:")
print("1. Restart your FastAPI backend server")
print("2. Test the /dentists/me endpoint")
print("3. Fill data in EditDoctorProfile and check if it displays in DoctorProfile")
