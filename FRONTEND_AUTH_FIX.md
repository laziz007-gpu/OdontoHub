# 🔧 Исправление проблем авторизации в фронтенде

## 🚨 Проблема

В логах сервера видны ошибки:
- `GET /patients/ HTTP/1.1" 403 Forbidden` 
- `GET /dentists/me HTTP/1.1" 403 Forbidden`

## 🔍 Причины

1. **Пользователи не авторизованы в браузере** - токены не сохраняются или не передаются
2. **Неправильные роли** - пациенты пытаются получить данные врачей и наоборот
3. **Проблемы с CORS** - токены не передаются из-за настроек CORS

## ✅ Решения

### 1. Проверить авторизацию в браузере

Откройте **Developer Tools** (F12) в браузере:

```javascript
// Проверить токен в localStorage
console.log('Token:', localStorage.getItem('access_token'));

// Если токена нет - войти в систему
// Врач: +998901234567 / password123
// Пациент: +998911111111 / password123
```

### 2. Исправить API запросы в фронтенде

Убедитесь, что все запросы включают токен:

```javascript
// Правильный способ
const token = localStorage.getItem('access_token');
const response = await fetch('/api/endpoint', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});
```

### 3. Проверить роли пользователей

**Врачи могут:**
- `GET /dentists/me` - свой профиль
- `GET /patients/` - список пациентов
- `GET /appointments/me` - свои записи
- `GET /api/notifications/settings` - настройки уведомлений

**Пациенты могут:**
- `GET /patients/me` - свой профиль  
- `POST /appointments/` - создать запись
- `GET /appointments/me` - свои записи

**Пациенты НЕ могут:**
- `GET /patients/` - список всех пациентов (403 Forbidden)
- `GET /dentists/me` - профиль врача (403 Forbidden)

### 4. Исправить условную логику в фронтенде

```javascript
// Проверить роль пользователя перед запросом
const userRole = getUserRole(); // получить из токена или API

if (userRole === 'dentist') {
    // Делать запросы врача
    fetchPatientsList();
    fetchDentistProfile();
} else if (userRole === 'patient') {
    // Делать запросы пациента
    fetchPatientProfile();
}
```

## 🧪 Тестирование

### Использовать тестовую страницу
Откройте файл `test_frontend_auth.html` в браузере для тестирования авторизации.

### Тестовые данные
- **Врач**: `+998901234567` / `password123`
- **Пациент**: `+998911111111` / `password123`

### Проверить в браузере
1. Откройте Developer Tools (F12)
2. Перейдите на вкладку Network
3. Обновите страницу
4. Проверьте, что запросы содержат заголовок `Authorization: Bearer ...`

## 🔧 Быстрые исправления

### 1. Добавить обработку ошибок авторизации

```javascript
// В фронтенде
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    
    if (response.status === 401) {
        // Токен недействителен - перенаправить на страницу входа
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return;
    }
    
    if (response.status === 403) {
        // Нет прав доступа - показать ошибку
        console.error('Access denied:', await response.text());
        return;
    }
    
    return response;
}
```

### 2. Проверить роль перед запросами

```javascript
// Получить роль из токена
function getUserRole() {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
    } catch {
        return null;
    }
}

// Использовать роль
const userRole = getUserRole();
if (userRole === 'dentist') {
    // Запросы врача
} else if (userRole === 'patient') {
    // Запросы пациента
}
```

## 📋 Чек-лист исправлений

- [ ] Проверить сохранение токенов в localStorage
- [ ] Добавить заголовок Authorization во все API запросы
- [ ] Проверить роли пользователей перед запросами
- [ ] Добавить обработку ошибок 401/403
- [ ] Протестировать с разными ролями пользователей
- [ ] Убрать запросы к недоступным эндпоинтам

## 🎯 Результат

После исправлений в логах сервера не должно быть ошибок 403 Forbidden, и пользователи смогут нормально работать с системой в соответствии со своими ролями.