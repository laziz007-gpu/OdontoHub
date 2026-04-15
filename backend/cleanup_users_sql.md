# SQL команды для очистки пользователей

Выполните эти команды в Neon DB в правильном порядке:

## 1. Сначала удалите профили врачей
```sql
DELETE FROM dentist_profiles WHERE user_id IN (3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33);
```

## 2. Затем удалите профили пациентов
```sql
DELETE FROM patient_profiles WHERE user_id IN (3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33);
```

## 3. Теперь можно удалить пользователей
```sql
DELETE FROM users WHERE id IN (3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,31,32,33);
```

## 4. Проверьте результат
```sql
SELECT * FROM users;
SELECT * FROM dentist_profiles;
SELECT * FROM patient_profiles;
```

## Альтернативный способ - удалить ВСЕ данные
Если хотите полностью очистить базу:

```sql
-- Отключить проверки внешних ключей
SET session_replication_role = replica;

-- Очистить все таблицы
TRUNCATE TABLE messages RESTART IDENTITY CASCADE;
TRUNCATE TABLE notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE reviews RESTART IDENTITY CASCADE;
TRUNCATE TABLE payments RESTART IDENTITY CASCADE;
TRUNCATE TABLE prescriptions RESTART IDENTITY CASCADE;
TRUNCATE TABLE allergies RESTART IDENTITY CASCADE;
TRUNCATE TABLE patient_photos RESTART IDENTITY CASCADE;
TRUNCATE TABLE appointments RESTART IDENTITY CASCADE;
TRUNCATE TABLE patient_profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE dentist_profiles RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- Включить проверки внешних ключей обратно
SET session_replication_role = DEFAULT;
```