# Как Открыть Shell в Render Dashboard

## Пошаговая Инструкция

### 1. Откройте Render Dashboard
```
https://dashboard.render.com
```

### 2. Найдите вашу базу данных
- В левом меню или на главной странице найдите список ваших сервисов
- Найдите базу данных с именем **"odontohub-db"** (или похожим)
- Нажмите на неё

### 3. Откройте Shell
В верхнем меню базы данных вы увидите вкладки:
- Info
- **Connect** ← Нажмите сюда
- Metrics
- Settings

После нажатия на "Connect" вы увидите несколько вариантов подключения.

### 4. Найдите раздел "PSQL Command"
На странице Connect будет показана команда типа:
```
PSQL Command
psql -h dpg-xxxxx-a.oregon-postgres.render.com -U odontohub odontohub
```

### 5. Два способа выполнить SQL:

#### Способ A: Через Web Shell (если доступен)
Некоторые планы Render имеют кнопку "Open Shell" прямо в браузере.
Если видите такую кнопку - нажмите её.

#### Способ B: Через локальный psql
1. Скопируйте PSQL Command
2. Откройте терминал на вашем компьютере
3. Вставьте команду
4. Введите пароль (он показан на той же странице)

### 6. Выполните SQL команды
После подключения выполните:

```sql
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE dentist_profiles ADD COLUMN IF NOT EXISTS works_photos TEXT;
```

### 7. Проверьте результат
Выполните:
```sql
\d dentist_profiles
```

Вы должны увидеть все колонки, включая новые:
- age
- experience_years
- works_photos

### 8. Выйдите
```sql
\q
```

---

## Если psql не установлен на вашем компьютере

### Установка psql на Windows:

1. Скачайте PostgreSQL: https://www.postgresql.org/download/windows/
2. Установите (можно выбрать только "Command Line Tools")
3. Перезапустите терминал
4. Попробуйте снова

### Альтернатива: Использовать онлайн SQL клиент

Если не хотите устанавливать psql, можно:

1. Использовать любой PostgreSQL клиент (DBeaver, pgAdmin, TablePlus)
2. Подключиться используя данные из Render Dashboard:
   - Host
   - Port
   - Database
   - Username
   - Password

---

## Самый Простой Способ (без установки psql)

Если у вас нет psql и не хотите его устанавливать:

### Создайте endpoint для миграции:

Я создам специальный endpoint в вашем backend, который выполнит миграцию при обращении к нему.

Хотите, чтобы я создал такой endpoint?

---

## Проверка после миграции

После выполнения SQL команд:

1. Откройте: https://odontohub.onrender.com/debug-db
2. Проверьте, что `dentist_profiles` есть в списке таблиц
3. Откройте: https://odontohub.onrender.com/health
4. Должно показать: `{"status": "healthy"}`

---

**Если возникли проблемы - напишите мне, я помогу!**
