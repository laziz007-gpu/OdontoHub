# Design: Passwordless Authentication & PostgreSQL Migration

## Обзор
Этот документ описывает техническую реализацию перехода на PostgreSQL и внедрение входа без пароля (только по номеру телефона).

## Архитектурные решения

### 1. Миграция базы данных: SQLite → PostgreSQL

**Текущее состояние:**
- Локально: SQLite (`sql_app.db`)
- Production (Render): SQLite (удаляется при каждом деплое)

**Целевое состояние:**
- Локально: SQLite (для простоты разработки)
- Production (Render): PostgreSQL (постоянное хранилище)

**Механизм переключения:**
```python
# Backend/app/core/database.py
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL or "sqlite:///./sql_app.db"
```

Если `DATABASE_URL` установлена → PostgreSQL, иначе → SQLite

### 2. Passwordless Authentication

**Изменения в модели User:**
- Поле `password` становится `Optional[str]` (nullable)
- Телефон остаётся уникальным идентификатором
- Для обратной совместимости не удаляем поле password полностью

**Логика аутентификации:**
- Регистрация: принимаем только `phone`, `email`, `full_name`, `role`
- Вход: принимаем только `phone`
- Проверка: если пользователь с таким телефоном существует → выдаём токен

## Детальный дизайн компонентов

### Backend Changes

#### 1. Модель User (`Backend/app/models/user.py`)

**Изменения:**
```python
class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    phone: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    password: Mapped[Optional[str]] = mapped_column(String, nullable=True)  # Теперь опционально
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

**Обоснование:** 
- `password` nullable для поддержки passwordless auth
- Сохраняем поле для возможной будущей функциональности

#### 2. Schemas (`Backend/app/schemas/auth.py`)

**Новые схемы:**

```python
# Регистрация без пароля
class RegisterSchema(BaseModel):
    phone: str
    email: Optional[str] = None
    full_name: str
    role: str  # "patient" или "dentist"

# Вход без пароля
class LoginSchema(BaseModel):
    phone: str

# Ответ с токеном (без изменений)
class TokenSchema(BaseModel):
    access_token: str
    token_type: str = "bearer"
```

**Валидация телефона:**
```python
from pydantic import field_validator
import re

class RegisterSchema(BaseModel):
    phone: str
    
    @field_validator('phone')
    def validate_phone(cls, v):
        # Убираем пробелы и проверяем формат
        phone = v.replace(' ', '').replace('-', '')
        if not re.match(r'^\+998\d{9}$', phone):
            raise ValueError('Неверный формат телефона. Используйте +998XXXXXXXXX')
        return phone
```

#### 3. Auth Router (`Backend/app/routers/auth.py`)

**Новый endpoint регистрации:**
```python
@router.post("/register", response_model=TokenSchema)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    # Проверяем существование пользователя
    existing_user = db.query(User).filter(User.phone == data.phone).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Этот номер уже зарегистрирован")
    
    # Создаём пользователя БЕЗ пароля
    user = User(
        phone=data.phone,
        email=data.email,
        password=None,  # Без пароля
        role=UserRole(data.role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Создаём профиль
    if data.role == "patient":
        profile = PatientProfile(user_id=user.id, full_name=data.full_name)
    else:
        profile = DentistProfile(user_id=user.id, full_name=data.full_name)
    
    db.add(profile)
    db.commit()
    
    # Генерируем токен
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer"}
```

**Новый endpoint входа:**
```python
@router.post("/login", response_model=TokenSchema)
def login(data: LoginSchema, db: Session = Depends(get_db)):
    # Ищем пользователя по телефону
    user = db.query(User).filter(User.phone == data.phone).first()
    
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Пользователь с таким номером не найден"
        )
    
    # Генерируем токен (без проверки пароля)
    access_token = create_access_token(
        {"sub": str(user.id), "role": user.role.value}
    )
    
    return {"access_token": access_token, "token_type": "bearer"}
```

#### 4. Database Configuration (без изменений)

`Backend/app/core/database.py` уже поддерживает PostgreSQL:
```python
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL or "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
```

### Frontend Changes

#### 1. Login Page (`OdontoHub-1/src/Pages/Login.tsx`)

**Изменения:**
- Убрать поле пароля
- Убрать кнопку показа/скрытия пароля
- Изменить placeholder на "Введите номер телефона"
- Обновить валидацию

**Новая структура формы:**
```tsx
interface LoginFormData {
  phone: string  // Только телефон, без пароля
}

// В форме:
<input
  type="tel"
  placeholder="+998 90 123 45 67"
  {...register('phone', {
    required: 'Введите номер телефона',
    pattern: {
      value: /^\+998\d{9}$/,
      message: 'Неверный формат номера'
    }
  })}
/>
```

#### 2. Register Page (`OdontoHub-1/src/Pages/RegisterPat.tsx`)

**Изменения:**
- Убрать поле пароля
- Убрать подтверждение пароля
- Оставить: телефон, email, имя, роль

**Новая структура:**
```tsx
interface RegisterFormData {
  phone: string
  email?: string
  full_name: string
  role: 'patient' | 'dentist'
}
```

#### 3. API Layer (`OdontoHub-1/src/api/auth.ts`)

**Обновлённый useLogin:**
```typescript
export const useLogin = () => {
  return useMutation({
    mutationFn: (data: { phone: string }) => {
      return api.post<TokenResponse>('/auth/login', data)
    },
    onSuccess: ({ data }) => {
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
    },
  })
}
```

**Обновлённый useRegister:**
```typescript
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => {
      return api.post<TokenResponse>('/auth/register', data)
    },
    onSuccess: ({ data }) => {
      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token)
      }
    },
  })
}
```

#### 4. TypeScript Interfaces (`OdontoHub-1/src/interfaces/index.ts`)

**Обновлённые интерфейсы:**
```typescript
export interface LoginData {
  phone: string  // Убрали password
}

export interface RegisterData {
  phone: string
  email?: string
  full_name: string
  role: 'patient' | 'dentist'
  // Убрали password
}
```

## Deployment Steps

### 1. Настройка PostgreSQL на Render

**В Render Dashboard для OdontoHub backend service:**

1. Перейти в Environment Variables
2. Добавить переменную:
   - Key: `DATABASE_URL`
   - Value: `postgresql://odonto_postgre_sql_user:ktIlPQoXTqgfmE2Fvm0YUPtZf7LZKUF3I@dpg-d69re449c44c7r38g9u50-a.oregon-postgres.render.com/odonto_postgre_sql`

3. Сохранить → автоматический редеплой

**Проверка:**
- После деплоя таблицы создадутся автоматически (SQLAlchemy)
- Логи покажут подключение к PostgreSQL

### 2. Deployment Order

1. **Backend сначала:**
   - Закоммитить изменения в бэкенде
   - Пушнуть в GitHub
   - Render автоматически задеплоит
   - Проверить через Swagger UI: https://odontohub.onrender.com/docs

2. **Frontend потом:**
   - Закоммитить изменения во фронтенде
   - Собрать: `npm run build`
   - Задеплоить на Netlify

## Security Considerations

### 1. Безопасность без пароля

**Риски:**
- Любой с номером телефона может войти
- Нет второго фактора аутентификации

**Митигация (текущая):**
- JWT токены с истечением (24 часа)
- HTTPS на всех соединениях
- CORS настроен только для Netlify домена

**Будущие улучшения (out of scope):**
- SMS верификация при входе
- Rate limiting для предотвращения брутфорса
- Логирование попыток входа

### 2. Валидация телефона

**Формат:** `+998XXXXXXXXX` (Узбекистан)
- Проверка на бэкенде через regex
- Проверка на фронтенде через HTML5 pattern
- Очистка от пробелов и дефисов

## Testing Strategy

### Backend Tests

**Unit Tests:**
```python
# test_auth.py
def test_register_without_password():
    response = client.post("/auth/register", json={
        "phone": "+998901234567",
        "email": "test@example.com",
        "full_name": "Test User",
        "role": "patient"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_with_phone_only():
    response = client.post("/auth/login", json={
        "phone": "+998901234567"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_nonexistent_phone():
    response = client.post("/auth/login", json={
        "phone": "+998999999999"
    })
    assert response.status_code == 401
```

### Frontend Tests

**Manual Testing Checklist:**
- [ ] Регистрация с валидным телефоном
- [ ] Регистрация с невалидным телефоном (ошибка)
- [ ] Вход с существующим телефоном
- [ ] Вход с несуществующим телефоном (ошибка)
- [ ] Токен сохраняется в localStorage
- [ ] Редирект после успешного входа

## Migration Strategy

### Существующие пользователи

**Проблема:** У текущих пользователей есть пароли

**Решение:**
1. Поле `password` остаётся nullable
2. Старые пользователи (с паролями) продолжат работать
3. Новые пользователи создаются без паролей
4. В production на Render база пустая, так что миграция не нужна

### Rollback Plan

Если что-то пойдёт не так:

1. **Backend:** Откатить коммит в GitHub → Render автоматически задеплоит старую версию
2. **Frontend:** Задеплоить предыдущий билд на Netlify
3. **Database:** PostgreSQL данные сохранятся, можно переключиться обратно на SQLite локально

## Correctness Properties

### Property 1: Уникальность телефона
**Описание:** Два пользователя не могут иметь одинаковый номер телефона

**Проверка:**
```python
def test_phone_uniqueness():
    # Регистрируем первого пользователя
    register_user(phone="+998901234567")
    
    # Пытаемся зарегистрировать второго с тем же номером
    response = register_user(phone="+998901234567")
    
    assert response.status_code == 400
    assert "уже зарегистрирован" in response.json()["detail"]
```

### Property 2: Токен содержит корректные данные
**Описание:** JWT токен должен содержать user_id и role

**Проверка:**
```python
def test_token_contains_user_data():
    response = login_user(phone="+998901234567")
    token = response.json()["access_token"]
    
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    assert "sub" in decoded  # user_id
    assert "role" in decoded
    assert decoded["role"] in ["patient", "dentist"]
```

### Property 3: Вход без регистрации невозможен
**Описание:** Нельзя войти с номером, который не зарегистрирован

**Проверка:**
```python
def test_login_requires_registration():
    response = login_user(phone="+998999999999")  # Несуществующий номер
    
    assert response.status_code == 401
    assert "не найден" in response.json()["detail"]
```

### Property 4: PostgreSQL сохраняет данные между деплоями
**Описание:** После редеплоя бэкенда пользователи остаются в базе

**Проверка (manual):**
1. Зарегистрировать пользователя на production
2. Сделать редеплой бэкенда на Render
3. Попытаться войти с тем же номером
4. Вход должен быть успешным

## Performance Considerations

### Database Connection Pooling

PostgreSQL поддерживает connection pooling из коробки:
```python
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=5,          # Максимум 5 соединений
    max_overflow=10,      # Дополнительно 10 при нагрузке
    pool_pre_ping=True    # Проверка соединения перед использованием
)
```

### Response Time

**Ожидаемые времена ответа:**
- Регистрация: < 500ms
- Вход: < 300ms
- Получение профиля: < 200ms

**Render free tier:** Первый запрос после "сна" может занять 30-60 секунд

## Monitoring & Logging

### Логирование событий

```python
import logging

logger = logging.getLogger(__name__)

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    logger.info(f"Login attempt for phone: {data.phone}")
    
    user = db.query(User).filter(User.phone == data.phone).first()
    
    if not user:
        logger.warning(f"Login failed: user not found for phone {data.phone}")
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    
    logger.info(f"Login successful for user_id: {user.id}")
    # ...
```

### Метрики для отслеживания

- Количество регистраций в день
- Количество успешных/неуспешных входов
- Время ответа API endpoints
- Ошибки подключения к PostgreSQL

## Future Enhancements (Out of Scope)

1. **SMS Verification:**
   - Отправка кода подтверждения при регистрации
   - Интеграция с SMS провайдером (Twilio, Eskiz.uz)

2. **Rate Limiting:**
   - Ограничение попыток входа (5 попыток в минуту)
   - Защита от брутфорса

3. **Session Management:**
   - Возможность выхода со всех устройств
   - Список активных сессий

4. **Analytics:**
   - Дашборд с метриками пользователей
   - Отслеживание активности

## Conclusion

Этот дизайн обеспечивает:
- ✅ Постоянное хранение данных через PostgreSQL
- ✅ Упрощённую регистрацию без паролей
- ✅ Обратную совместимость
- ✅ Безопасность через JWT токены
- ✅ Простоту развёртывания
