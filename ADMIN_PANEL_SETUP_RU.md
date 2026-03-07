# Настройка Админ Панели для Управления Врачами

## Что добавляется

3 новых endpoint для админ панели:

1. **GET /dentists** - Получить список всех врачей (с пагинацией)
2. **GET /dentists/{id}** - Получить конкретного врача по ID
3. **PUT /dentists/{id}/verification** - Изменить статус верификации врача

---

## Установка Backend

### Шаг 1: Добавить endpoints в dentists.py

Откройте файл: `D:\OdontoHUB\WebApp\Backend-new fix\Backend\app\routers\dentists.py`

В КОНЕЦ файла (после функции `update_dentist_profile`) добавьте код из файла `admin_dentists_endpoint.py`

### Шаг 2: Сохранить и задеплоить

```powershell
cd "D:\OdontoHUB\WebApp\Backend-new fix\Backend"
git add app/routers/dentists.py
git commit -m "Add admin endpoints for dentists management"
git push origin master
```

---

## Установка Frontend

### Шаг 1: Добавить интерфейсы

Откройте: `OdontoHub-1/src/interfaces/index.ts`

Добавьте в конец файла:

```typescript
export interface DentistStats {
  total_appointments: number;
  completed_appointments: number;
  pending_appointments: number;
}

export interface DentistForAdmin {
  id: number;
  user_id: number;
  full_name: string;
  email: string | null;
  phone: string;
  pinfl: string | null;
  diploma_number: string | null;
  verification_status: 'pending' | 'approved' | 'rejected';
  specialization: string | null;
  address: string | null;
  clinic: string | null;
  age: number | null;
  experience_years: number | null;
  schedule: string | null;
  work_hours: string | null;
  telegram: string | null;
  instagram: string | null;
  whatsapp: string | null;
  works_photos: string | null;
  stats: DentistStats;
}

export interface DentistsListResponse {
  dentists: DentistForAdmin[];
  total: number;
  skip: number;
  limit: number;
}
```

### Шаг 2: Создать API файл

Создайте новый файл: `OdontoHub-1/src/api/admin.ts`

Скопируйте код из файла `admin_dentists_frontend.ts` (секция "src/api/admin.ts")

### Шаг 3: Создать компонент админ панели

Создайте новый файл: `OdontoHub-1/src/Pages/AdminDentistsPanel.tsx`

Скопируйте код из файла `admin_dentists_frontend.ts` (секция "Пример использования")

### Шаг 4: Добавить CSS стили

Создайте файл: `OdontoHub-1/src/Pages/AdminDentistsPanel.css`

Скопируйте CSS из файла `admin_dentists_frontend.ts` (секция "CSS стили")

### Шаг 5: Добавить роут

Откройте: `OdontoHub-1/src/Routes/index.tsx`

Добавьте новый роут:

```typescript
import AdminDentistsPanel from '../Pages/AdminDentistsPanel';

// В секции роутов добавьте:
<Route path="/admin/dentists" element={<AdminDentistsPanel />} />
```

---

## Использование API

### Получить всех врачей

```typescript
import { getAllDentists } from '../api/admin';

const dentists = await getAllDentists(0, 20); // skip=0, limit=20
console.log(dentists.dentists); // массив врачей
console.log(dentists.total); // общее количество
```

### Получить конкретного врача

```typescript
import { getDentistById } from '../api/admin';

const dentist = await getDentistById(1);
console.log(dentist.full_name);
console.log(dentist.stats);
```

### Изменить статус верификации

```typescript
import { updateDentistVerification } from '../api/admin';

await updateDentistVerification(1, 'approved'); // одобрить
await updateDentistVerification(1, 'rejected'); // отклонить
await updateDentistVerification(1, 'pending'); // вернуть в ожидание
```

---

## Примеры запросов

### cURL примеры

```bash
# Получить всех врачей
curl https://odontohub.onrender.com/dentists

# Получить врачей с пагинацией
curl https://odontohub.onrender.com/dentists?skip=0&limit=10

# Получить конкретного врача
curl https://odontohub.onrender.com/dentists/1

# Изменить статус верификации
curl -X PUT https://odontohub.onrender.com/dentists/1/verification \
  -H "Content-Type: application/json" \
  -d '{"verification_status": "approved"}'
```

### Axios примеры

```typescript
// Получить всех врачей
const response = await api.get('/dentists');

// С пагинацией
const response = await api.get('/dentists?skip=0&limit=10');

// Получить конкретного врача
const response = await api.get('/dentists/1');

// Изменить статус
const response = await api.put('/dentists/1/verification', {
  verification_status: 'approved'
});
```

---

## Структура ответа

### GET /dentists

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

### GET /dentists/{id}

```json
{
  "id": 1,
  "user_id": 5,
  "full_name": "Иванов Иван Иванович",
  "email": "ivanov@example.com",
  "phone": "+998901234567",
  "verification_status": "approved",
  "specialization": "Ортодонт",
  "stats": {
    "total_appointments": 150,
    "completed_appointments": 120,
    "pending_appointments": 30
  }
}
```

### PUT /dentists/{id}/verification

```json
{
  "id": 1,
  "full_name": "Иванов Иван Иванович",
  "verification_status": "approved",
  "message": "Verification status updated to approved"
}
```

---

## Безопасность

### Важно!

Эти endpoints пока **НЕ защищены** авторизацией. Любой может получить список врачей.

### Рекомендации:

1. **Добавить роль Admin** в модель User
2. **Защитить endpoints** с помощью `require_role(UserRole.ADMIN)`
3. **Добавить JWT проверку** для всех admin endpoints

### Пример защиты:

```python
from app.core.security import get_current_user

@router.get("/")
def get_all_dentists(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Требует авторизации
    skip: int = 0,
    limit: int = 100
):
    # Проверить, что пользователь - админ
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # ... остальной код
```

---

## Дополнительные возможности

### Фильтрация

Можно добавить фильтры:

```python
@router.get("/")
def get_all_dentists(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    verification_status: str = None,  # Фильтр по статусу
    specialization: str = None  # Фильтр по специализации
):
    query = db.query(DentistProfile)
    
    if verification_status:
        query = query.filter(DentistProfile.verification_status == verification_status)
    
    if specialization:
        query = query.filter(DentistProfile.specialization.ilike(f"%{specialization}%"))
    
    dentists = query.offset(skip).limit(limit).all()
    # ... остальной код
```

### Поиск

```python
@router.get("/search")
def search_dentists(
    q: str,  # Поисковый запрос
    db: Session = Depends(get_db)
):
    dentists = db.query(DentistProfile).filter(
        DentistProfile.full_name.ilike(f"%{q}%")
    ).all()
    # ... остальной код
```

---

## Резюме

✅ 3 новых endpoint для админ панели  
✅ Полная информация о врачах  
✅ Статистика по приемам  
✅ Управление верификацией  
✅ Пагинация  
✅ Готовый React компонент  

**Время установки: 10-15 минут**
