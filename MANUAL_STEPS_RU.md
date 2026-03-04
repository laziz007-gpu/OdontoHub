# Ручная Инструкция по Деплою - На Русском

## Что нужно сделать

У вас есть 2 варианта:

---

## Вариант 1: Автоматическая миграция (Рекомендуется)

### Шаг 1: Создать файл миграции

Создайте файл `D:\OdontoHUB\WebApp\Backend-new fix\Backend\migrate_dentist_fields.py` со следующим содержимым:

```python
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
```

### Шаг 2: Обновить render.yaml

Откройте файл `D:\OdontoHUB\WebApp\Backend-new fix\Backend\render.yaml`

Найдите строку:
```yaml
buildCommand: pip install -r requirements.txt && python init_db.py
```

Замените на:
```yaml
buildCommand: pip install -r requirements.txt && python init_db.py && python migrate_dentist_fields.py
```

### Шаг 3: Закоммитить и запушить

```powershell
cd "D:\OdontoHUB\WebApp\Backend-new fix\Backend"
git add .
git status
git commit -m "Add dentist profile fields migration for PostgreSQL"
git push origin master
```

### Шаг 4: Подождать

Render автоматически:
- Установит зависимости
- Запустит миграцию
- Запустит сервер

---

## Вариант 2: Ручная SQL миграция (Быстрее)

### Шаг 1: Зайти в Render Dashboard

1. Откройте: https://dashboard.render.com
2. Выберите вашу базу данных `odontohub-db`
3. Нажмите на вкладку "Shell"

### Шаг 2: Выполнить SQL команды

Скопируйте и вставьте:

```sql
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS works_photos TEXT;
```

Нажмите Enter.

### Шаг 3: Запушить код

```powershell
cd "D:\OdontoHUB\WebApp\Backend-new fix\Backend"
git add .
git commit -m "Update backend code"
git push origin master
```

**Готово!** ✅

---

## Проверка после деплоя

### 1. Проверить здоровье сервера
Откройте в браузере:
```
https://odontohub.onrender.com/health
```

Должно показать: `{"status": "healthy"}`

### 2. Проверить базу данных
Откройте в браузере:
```
https://odontohub.onrender.com/debug-db
```

Должно показать список таблиц, включая `dentist_profiles`

### 3. Протестировать регистрацию
Используйте ваш фронтенд для регистрации нового врача. Должно работать без ошибок.

---

## Что было исправлено

✅ Все конфликты слияния устранены  
✅ Все модели правильно импортированы  
✅ CORS настроен правильно  
✅ Аутентификация без пароля работает  
✅ Все поля профиля врача определены  

---

## Если что-то пошло не так

1. **Проверьте логи Render:**
   - Dashboard → Ваш сервис → Logs

2. **Проверьте переменные окружения:**
   - Dashboard → Ваш сервис → Environment
   - Должны быть: DATABASE_URL, SECRET_KEY, ALGORITHM

3. **Проверьте базу данных:**
   - Dashboard → Database → Shell
   - Выполните: `\d dentist_profiles` (покажет структуру таблицы)

---

## Время выполнения

- Вариант 1 (автоматическая миграция): ~10 минут
- Вариант 2 (ручная SQL миграция): ~5 минут

---

## Рекомендация

Используйте **Вариант 2** (ручная SQL миграция) - это быстрее и проще!

1. Зайдите в Render Dashboard
2. Выполните 3 SQL команды
3. Запушьте код
4. Готово!

---

**Удачи с деплоем! 🚀**
