# СРОЧНОЕ ИСПРАВЛЕНИЕ - 500 Internal Server Error

## Проблема
Сервер на Render падает с ошибкой 500, потому что в базе данных PostgreSQL отсутствуют 3 колонки.

## Быстрое Решение (5 минут)

### Шаг 1: Откройте Render Dashboard
1. Перейдите: https://dashboard.render.com
2. Войдите в свой аккаунт
3. Найдите вашу базу данных **odontohub-db**
4. Нажмите на неё

### Шаг 2: Откройте Shell
1. В меню базы данных найдите вкладку **"Shell"** или **"Connect"**
2. Нажмите на неё - откроется терминал PostgreSQL

### Шаг 3: Выполните SQL команды
Скопируйте эти 3 строки и вставьте в терминал:

```sql
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS works_photos TEXT;
```

Нажмите **Enter**.

Вы должны увидеть:
```
ALTER TABLE
ALTER TABLE
ALTER TABLE
```

### Шаг 4: Перезапустите сервис
1. Вернитесь в Dashboard
2. Найдите ваш сервис **odontohub-backend**
3. Нажмите **"Manual Deploy"** → **"Deploy latest commit"**

ИЛИ просто подождите 1-2 минуты - сервер автоматически перезапустится.

### Шаг 5: Проверьте
Откройте в браузере:
```
https://odontohub.onrender.com/health
```

Должно показать: `{"status": "healthy"}`

## Готово! ✅

Теперь ваш сайт должен работать без ошибок 500.

---

## Альтернатива: Если нет доступа к Shell

Если вы не можете найти Shell в Render Dashboard, используйте этот способ:

### Вариант A: Через psql локально (если установлен PostgreSQL)

1. Получите DATABASE_URL из Render:
   - Dashboard → Database → Info → Internal Database URL

2. Подключитесь:
```bash
psql "ваш_DATABASE_URL_здесь"
```

3. Выполните SQL команды выше

### Вариант B: Создать миграцию в коде

Я создам файл, который автоматически добавит колонки при следующем деплое.

---

## Почему это произошло?

Модель `DentistProfile` в коде имеет поля `age`, `experience_years`, `works_photos`, но в базе данных PostgreSQL на Render эти колонки не были созданы.

SQLite (локальная база) создала их автоматически, но PostgreSQL требует явной миграции.

---

## Что делать дальше?

После исправления базы данных:

1. ✅ Сервер заработает
2. ✅ Регистрация будет работать
3. ✅ Профиль врача будет сохраняться

Больше ничего делать не нужно!

---

**Время исправления: 5 минут**
