# Backend Endpoint для Админ Панели

## Что добавить

Один главный endpoint для получения списка всех врачей.

---

## Установка (2 минуты)

### Шаг 1: Открыть файл
```
D:\OdontoHUB\WebApp\Backend-new fix\Backend\app\routers\dentists.py
```

### Шаг 2: Добавить код
Скопируйте весь код из файла `BACKEND_ONLY_ENDPOINT.py` и вставьте В КОНЕЦ файла `dentists.py` (после функции `update_dentist_profile`)

### Шаг 3: Сохранить и задеплоить
```powershell
cd "D:\OdontoHUB\WebApp\Backend-new fix\Backend"
git add app/routers/dentists.py
git commit -m "Add endpoint to get all dentists"
git push origin master
```

### Шаг 4: Подождать 2-3 минуты
Render автоматически задеплоит изменения.

---

## Использование

### Получить всех врачей
```
GET https://odontohub.onrender.com/dentists
```

### С пагинацией
```
GET https://odontohub.onrender.com/dentists?skip=0&limit=20
```

### Получить конкретного врача
```
GET https://odontohub.onrender.com/dentists/1
```

### Изменить статус верификации
```
PUT https://odontohub.onrender.com/dentists/1/verification
Body: {"verification_status": "approved"}
```

---

## Пример ответа

```json
{
  "dentists": [
    {
      "id": 1,
      "user_id": 5,
      "full_name": "Иванов Иван Иванович",
      "email": "ivanov@example.com",
      "phone": "+998901234567",
      "pinfl": "12345678901234",
      "diploma_number": "DIP123456",
      "verification_status": "approved",
      "specialization": "Ортодонт",
      "address": "Ташкент, ул. Пушкина 10",
      "clinic": "Стоматология №1",
      "age": 35,
      "experience_years": 10,
      "schedule": "Пн-Пт 9:00-18:00",
      "work_hours": "09:00-18:00",
      "telegram": "@ivanov_dentist",
      "instagram": "@ivanov_dentist",
      "whatsapp": "+998901234567",
      "works_photos": "[\"url1.jpg\", \"url2.jpg\"]",
      "stats": {
        "total_appointments": 150,
        "completed_appointments": 120,
        "pending_appointments": 30
      }
    }
  ],
  "total": 25,
  "skip": 0,
  "limit": 100
}
```

---

## Тестирование

После деплоя откройте в браузере:
```
https://odontohub.onrender.com/dentists
```

Должен вернуться JSON со списком всех врачей.

---

## Готово! ✅

Теперь ваш админ сайт может получать список всех врачей через этот endpoint.
