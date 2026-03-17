# 🚀 Backend Ishga Tushirish

## ❌ Hozirgi Holat:
- Backend ishlamayapti
- Frontend faqat 1 ta local doktor ko'rsatmoqda (fallback)
- API dan ma'lumot kelmayapti

## ✅ Backend Ishga Tushirish:

### Terminal Oching va Quyidagi Buyruqni Bajaring:

```bash
uvicorn app.main:app --reload
```

### Kutilgan Natija:

```
INFO:     Will watch for changes in these directories: ['C:\\Users\\...\\OdontoHub']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## 🧪 Backend Tekshirish:

### 1. Health Check:
Brauzerda oching:
```
http://localhost:8000/health
```

Natija:
```json
{"status": "healthy"}
```

### 2. Doktorlar Ro'yxati:
Brauzerda oching:
```
http://localhost:8000/dentists/
```

Natija:
```json
[
  {
    "id": 4,
    "user_id": 4,
    "full_name": "Махмуд Пулатов",
    "specialization": "Терапевт",
    ...
  },
  {
    "id": 6,
    "user_id": 6,
    "full_name": "Aziz Saydazxonov",
    "specialization": "hygienist",
    ...
  }
]
```

## 🔄 Frontend Yangilash:

Backend ishga tushgandan keyin:

1. Frontend sahifasini yangilang (F5)
2. Doktorlar sahifasiga o'ting: `/doctors`
3. **2 ta doktor ko'rinishi kerak!**

## 📊 Kutilgan Natija:

### Backend Ishlab Tursa:
- ✅ 2 ta doktor kartochkasi
- ✅ Махмуд Пулатов (Терапевт)
- ✅ Aziz Saydazxonov (Hygienist)

### Backend Ishlamasa:
- ⚠️ 1 ta doktor kartochkasi (fallback)
- ⚠️ Faqat Махмуд Пулатов

## 🐛 Muammolar:

### "ModuleNotFoundError" xatosi?
```bash
pip install -r requirements.txt
```

### "Port already in use" xatosi?
Boshqa portda ishga tushiring:
```bash
uvicorn app.main:app --reload --port 8001
```

Keyin `.env` faylini yangilang:
```env
VITE_API_URL=http://localhost:8001
```

### Database xatosi?
`.env` faylida `DATABASE_URL` to'g'ri ekanligini tekshiring.

## ✅ Tayyor!

Backend ishga tushgandan keyin frontend avtomatik ravishda 2 ta doktorni ko'rsatadi! 🎉

**Backendni ishga tushiring va sahifani yangilang!** 🚀
