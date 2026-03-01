# Quick Start - Doktorlarni Ko'rsatish / Показать Врачей

## 🚀 Tezkor Boshlash / Быстрый Старт

### 1. Doktorlarni Qo'shish / Добавить Врачей

```bash
# Test doktorlarni avtomatik qo'shish
# Автоматически добавить тестовых врачей
python create_test_dentists.py
```

### 2. Backend Ishga Tushirish / Запустить Backend

```bash
# Backend serverni ishga tushirish
# Запустить backend сервер
uvicorn app.main:app --reload
```

Backend ishga tushadi: `http://localhost:8000`

### 3. Frontend Ishga Tushirish / Запустить Frontend

```bash
# Frontend ni ishga tushirish
# Запустить frontend
npm run dev
```

Frontend ishga tushadi: `http://localhost:5173`

### 4. Test Qilish / Тестирование

1. **Yangi bemor yaratish / Создать нового пациента:**
   - Ilovani oching / Откройте приложение
   - "Регистрация" tugmasini bosing / Нажмите "Регистрация"
   - "Пациент" rolini tanlang / Выберите роль "Пациент"
   - Ma'lumotlarni to'ldiring / Заполните данные
   - "Зарегистрироваться" bosing / Нажмите "Зарегистрироваться"

2. **Natija / Результат:**
   - ✅ Avtomatik `/doctors` sahifasiga o'tadi / Автоматически переходит на `/doctors`
   - ✅ Xush kelibsiz banner ko'rsatiladi / Показывается приветственный баннер
   - ✅ Bazadagi doktorlar ro'yxati / Список врачей из базы данных
   - ✅ Har bir doktorga "Записаться" tugmasi / Кнопка "Записаться" для каждого врача

3. **Qabul yaratish / Создать запись:**
   - Doktor kartochkasida "Записаться" bosing / Нажмите "Записаться" на карточке врача
   - Qabul localStorage ga saqlanadi / Запись сохраняется в localStorage
   - Avtomatik `/calendar` ga o'tadi / Автоматически переходит на `/calendar`

## 📋 Yaratilgan Doktorlar / Созданные Врачи

Skript quyidagi doktorlarni yaratadi / Скрипт создает следующих врачей:

| Ism / Имя | Mutaxassislik / Специализация | Klinika / Клиника | Manzil / Адрес |
|-----------|-------------------------------|-------------------|----------------|
| Махмуд Пулатов | Терапевт | Стоматология №1 | Юнусабад |
| Азиза Каримова | Ортодонт | Smile Clinic | Мирабад |
| Рустам Алимов | Хирург | Dental Care Center | Чиланзар |
| Дилноза Рашидова | Детский стоматолог | Kids Dental | Юнусабад |
| Бобур Саидов | Имплантолог | Premium Dental | Сергели |

## 🔍 Tekshirish / Проверка

### Backend Tekshirish / Проверить Backend

```bash
# Doktorlar ro'yxatini olish
# Получить список врачей
curl http://localhost:8000/dentists/
```

Yoki brauzerda oching / Или откройте в браузере:
```
http://localhost:8000/dentists/
```

### Frontend Tekshirish / Проверить Frontend

1. Brauzer konsolini oching (F12) / Откройте консоль браузера (F12)
2. Network tabni tanlang / Выберите вкладку Network
3. Doktorlar sahifasiga o'ting / Перейдите на страницу врачей
4. `dentists` so'rovini ko'ring / Посмотрите запрос `dentists`

## ⚙️ Konfiguratsiya / Конфигурация

### .env Fayl / Файл .env

```env
# Backend URL
VITE_API_URL=http://localhost:8000

# Database (agar kerak bo'lsa / если нужно)
DATABASE_URL=postgresql://user:password@localhost/odontohub
```

## 🐛 Muammolarni Hal Qilish / Решение Проблем

### Doktorlar ko'rinmayapti / Врачи не отображаются

1. Backend ishga tushganini tekshiring / Проверьте, что backend запущен:
   ```bash
   curl http://localhost:8000/health
   ```

2. Bazada doktorlar borligini tekshiring / Проверьте наличие врачей в базе:
   ```bash
   python create_test_dentists.py
   ```

3. CORS xatolarini tekshiring / Проверьте ошибки CORS:
   - Brauzer konsolini oching / Откройте консоль браузера
   - Qizil xatolarni qidiring / Ищите красные ошибки

### Backend ulanmayapti / Backend не подключается

1. `.env` faylni tekshiring / Проверьте файл `.env`
2. Backend portini tekshiring / Проверьте порт backend
3. CORS sozlamalarini tekshiring / Проверьте настройки CORS

## 📚 Qo'shimcha Ma'lumot / Дополнительная Информация

- `DENTIST_SETUP_GUIDE.md` - To'liq qo'llanma / Полное руководство
- `VAZIFA_BAJARILDI.md` - Vazifa tavsifi / Описание задачи
- `create_test_dentists.py` - Doktorlarni qo'shish skripti / Скрипт добавления врачей

## ✅ Tayyor! / Готово!

Endi sizning ilovangiz to'liq ishlaydi! / Теперь ваше приложение полностью работает!

Yangi bemorlar ro'yxatdan o'tganda avtomatik ravishda doktorlar ro'yxatini ko'radilar va qabul yaratishlari mumkin! 🎉

Новые пациенты при регистрации автоматически видят список врачей и могут создавать записи! 🎉
