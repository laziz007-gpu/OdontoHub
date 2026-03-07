import shutil
import os

# Определяем пути
source_dir = r"D:\OdontoHUB\WebApp\OdontoHub-1\app"
backend_new_fix = r"D:\OdontoHUB\WebApp\Backend-new fix\Backend\app"
backendv2 = r"D:\OdontoHUB\WebApp\Backendv2\Backend\app"

# Файлы для копирования
files_to_copy = [
    "routers/auth.py",
    "main.py"
]

def copy_files(source, destination):
    """Копирует файлы из source в destination"""
    copied = []
    for file_path in files_to_copy:
        src = os.path.join(source, file_path)
        dst = os.path.join(destination, file_path)
        
        if os.path.exists(src):
            # Создаём директорию если не существует
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(src, dst)
            copied.append(file_path)
            print(f"✓ Copied {file_path}")
        else:
            print(f"✗ Source not found: {src}")
    
    return copied

print("=== Syncing backend files ===\n")

# Копируем в Backend-new fix
if os.path.exists(backend_new_fix):
    print("Copying to Backend-new fix...")
    copy_files(source_dir, backend_new_fix)
    print()

# Копируем в Backendv2
if os.path.exists(backendv2):
    print("Copying to Backendv2...")
    copy_files(source_dir, backendv2)
    print()

print("=== Sync complete! ===")
print("\nNext steps:")
print("1. Commit and push changes to git")
print("2. Render will auto-deploy the updated backend")
