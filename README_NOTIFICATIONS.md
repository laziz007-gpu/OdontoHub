# Backend API - Уведомления, Рецепты и Аллергии

## Установка и запуск

### 1. Запустить миграцию базы данных

```bash
cd Backend
python add_prescription_allergy_notification_tables.py
```

Это создаст таблицы:
- `notifications` - уведомления
- `prescriptions` - рецепты
- `allergies` - аллергии

### 2. Перезапустить backend сервер

```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Notifications (Уведомления)

#### GET /api/notifications
Получить все уведомления текущего пользователя
- Требует аутентификации
- Возвращает список уведомлений, отсортированных по дате (новые первые)

#### GET /api/notifications/unread-count
Получить количество непрочитанных уведомлений
- Требует аутентификации
- Возвращает: `{"count": 5}`

#### PATCH /api/notifications/{notification_id}/read
Отметить уведомление как прочитанное/непрочитанное
- Требует аутентификации
- Body: `{"is_read": true}`

#### POST /api/notifications/mark-all-read
Отметить все уведомления как прочитанные
- Требует аутентификации

#### POST /api/notifications/test/create-sample
Создать тестовые уведомления (для разработки)
- Требует аутентификации
- Создаёт 8 разных типов уведомлений

### Prescriptions (Рецепты)

#### GET /api/prescriptions/patients/{patient_id}/prescriptions
Получить все рецепты пациента
- Требует роль: `dentist`
- Возвращает список рецептов, отсортированных по дате

#### POST /api/prescriptions/patients/{patient_id}/prescriptions
Создать новый рецепт
- Требует роль: `dentist`
- Body:
```json
{
  "medication_name": "Амоксициллин",
  "dosage": "500mg",
  "frequency": "3 раза в день",
  "duration": "7 дней",
  "notes": "Принимать после еды"
}
```

#### PUT /api/prescriptions/{prescription_id}
Обновить рецепт
- Требует роль: `dentist`
- Body: любые поля из PrescriptionUpdate

#### DELETE /api/prescriptions/{prescription_id}
Удалить рецепт
- Требует роль: `dentist`

### Allergies (Аллергии)

#### GET /api/allergies/patients/{patient_id}/allergies
Получить все аллергии пациента
- Требует роль: `dentist`
- Возвращает список аллергий, отсортированных по дате

#### POST /api/allergies/patients/{patient_id}/allergies
Создать новую запись об аллергии
- Требует роль: `dentist`
- Body:
```json
{
  "allergen_name": "Пенициллин",
  "reaction_type": "Сыпь",
  "severity": "moderate",
  "notes": "Появляется через 2-3 часа"
}
```

Severity может быть: `mild`, `moderate`, `severe`

#### PUT /api/allergies/{allergy_id}
Обновить запись об аллергии
- Требует роль: `dentist`
- Body: любые поля из AllergyUpdate

#### DELETE /api/allergies/{allergy_id}
Удалить запись об аллергии
- Требует роль: `dentist`

## Типы уведомлений

1. **appointment_reminder** - Напоминание о приёме (за 30 минут)
2. **appointment_rescheduled** - Приём перенесён
3. **appointment_cancelled** - Приём отменён
4. **analytics_check** - Проверьте аналитику
5. **rating_decreased** - Рейтинг понизился
6. **rating_increased** - Рейтинг повысился
7. **appointment_rated** - Пациент оценил приём
8. **review_left** - Пациент оставил отзыв
9. **payment_reminder** - Напоминание об оплате

## Тестирование

### Создать тестовые уведомления

```bash
curl -X POST http://localhost:8000/api/notifications/test/create-sample \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Получить уведомления

```bash
curl http://localhost:8000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Получить количество непрочитанных

```bash
curl http://localhost:8000/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Структура БД

### Таблица notifications
- id (PRIMARY KEY)
- user_id (FOREIGN KEY -> users.id)
- type (VARCHAR 50)
- title (VARCHAR 255)
- message (TEXT)
- is_read (BOOLEAN, default=False)
- created_at (DATETIME)
- metadata (TEXT, JSON)

### Таблица prescriptions
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY -> patient_profiles.id, CASCADE DELETE)
- medication_name (VARCHAR 255)
- dosage (VARCHAR 100)
- frequency (VARCHAR 100)
- duration (VARCHAR 100)
- notes (TEXT, nullable)
- prescribed_by (FOREIGN KEY -> users.id)
- prescribed_at (DATETIME)

### Таблица allergies
- id (PRIMARY KEY)
- patient_id (FOREIGN KEY -> patient_profiles.id, CASCADE DELETE)
- allergen_name (VARCHAR 255)
- reaction_type (VARCHAR 255)
- severity (VARCHAR 20: mild/moderate/severe)
- notes (TEXT, nullable)
- documented_by (FOREIGN KEY -> users.id)
- documented_at (DATETIME)

## Сервис уведомлений

Файл: `app/services/notification_service.py`

Функции для создания уведомлений:
- `create_appointment_reminder()`
- `create_appointment_rescheduled()`
- `create_appointment_cancelled()`
- `create_analytics_check_reminder()`
- `create_rating_decreased()`
- `create_rating_increased()`
- `create_appointment_rated()`
- `create_review_left()`
- `create_payment_reminder()`

Пример использования:
```python
from app.services import notification_service

notification_service.create_appointment_reminder(
    db=db,
    user_id=1,
    patient_name="Иван Иванов",
    appointment_time="14:30",
    appointment_id=123
)
```
