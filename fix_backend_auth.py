import shutil
import os

# Source file (clean version)
source = r"D:\OdontoHUB\WebApp\OdontoHub-1\app\routers\auth.py"

# Destination file (with merge conflicts)
destination = r"D:\OdontoHUB\WebApp\Backend-new fix\Backend\app\routers\auth.py"

# Copy the clean file
if os.path.exists(source):
    shutil.copy2(source, destination)
    print(f"✓ Copied {source} to {destination}")
    print("✓ Merge conflicts fixed!")
else:
    print(f"✗ Source file not found: {source}")
