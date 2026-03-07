# PowerShell скрипт для создания файлов миграции
# Запустите из любой папки: powershell -ExecutionPolicy Bypass -File create_migration_files.ps1

$BackendPath = "D:\OdontoHUB\WebApp\Backend-new fix\Backend"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "СОЗДАНИЕ ФАЙЛОВ ДЛЯ МИГРАЦИИ" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Создаем файл миграции
Write-Host "Шаг 1: Создание migrate_dentist_fields.py..." -ForegroundColor Yellow

$migrationContent = @'
"""
Migration script to add missing dentist profile fields to PostgreSQL database.
This script is safe to run multiple times - it checks if columns exist before adding them.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, inspect

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")

# Render provides 'postgres://' but SQLAlchemy requires 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)


def column_exists(conn, table_name, column_name):
    """Check if a column exists in a table."""
    inspector = inspect(engine)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns


def migrate_dentist_fields():
    """Add missing fields to dentist_profiles table."""
    print("Starting migration for dentist_profiles table...")
    
    # Fields to add with their SQL types
    fields_to_add = [
        ("age", "INTEGER"),
        ("experience_years", "INTEGER"),
        ("works_photos", "TEXT"),
    ]
    
    with engine.begin() as conn:
        for field_name, field_type in fields_to_add:
            if not column_exists(conn, "dentist_profiles", field_name):
                print(f"Adding column: {field_name} ({field_type})")
                conn.execute(text(
                    f"ALTER TABLE dentist_profiles ADD COLUMN {field_name} {field_type}"
                ))
                print(f"✓ Column {field_name} added successfully")
            else:
                print(f"✓ Column {field_name} already exists, skipping")
    
    print("✓ Migration completed successfully!")


if __name__ == "__main__":
    try:
        migrate_dentist_fields()
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        raise
'@

$migrationPath = Join-Path $BackendPath "migrate_dentist_fields.py"
$migrationContent | Out-File -FilePath $migrationPath -Encoding UTF8
Write-Host "✓ Создан: $migrationPath" -ForegroundColor Green
Write-Host ""

# Обновляем render.yaml
Write-Host "Шаг 2: Обновление render.yaml..." -ForegroundColor Yellow

$renderYamlPath = Join-Path $BackendPath "render.yaml"
$renderContent = Get-Content $renderYamlPath -Raw

if ($renderContent -match "buildCommand: pip install -r requirements.txt && python init_db.py$") {
    $renderContent = $renderContent -replace "buildCommand: pip install -r requirements.txt && python init_db.py", "buildCommand: pip install -r requirements.txt && python init_db.py && python migrate_dentist_fields.py"
    $renderContent | Out-File -FilePath $renderYamlPath -Encoding UTF8 -NoNewline
    Write-Host "✓ render.yaml обновлен" -ForegroundColor Green
} else {
    Write-Host "✓ render.yaml уже содержит миграцию" -ForegroundColor Green
}
Write-Host ""

# Показываем следующие шаги
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✓ ФАЙЛЫ СОЗДАНЫ УСПЕШНО!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Следующие шаги:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Перейдите в папку Backend:" -ForegroundColor White
Write-Host "   cd `"$BackendPath`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Проверьте изменения:" -ForegroundColor White
Write-Host "   git status" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Закоммитьте изменения:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m `"Add dentist profile fields migration`"" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Запушьте на Render:" -ForegroundColor White
Write-Host "   git push origin master" -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Спрашиваем, хотим ли мы сразу перейти к git операциям
$response = Read-Host "Хотите сейчас перейти к git операциям? (y/n)"
if ($response -eq "y" -or $response -eq "Y" -or $response -eq "д" -or $response -eq "Д") {
    Set-Location $BackendPath
    Write-Host ""
    Write-Host "Текущая папка: $BackendPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Выполняем git status..." -ForegroundColor Yellow
    git status
    Write-Host ""
    Write-Host "Теперь выполните:" -ForegroundColor Yellow
    Write-Host "  git add ." -ForegroundColor Cyan
    Write-Host "  git commit -m `"Add dentist profile fields migration`"" -ForegroundColor Cyan
    Write-Host "  git push origin master" -ForegroundColor Cyan
}
