# 🧪 Frontend + Backend Test Qo'llanmasi

## 📋 Hozirgi Holat:

✅ **Backend**: Render PostgreSQL bazasida 2 ta doktor bor
✅ **Frontend**: API dan doktorlarni olish uchun tayyor
✅ **Fallback**: Agar backend ishlamasa, local doktor ko'rsatiladi

## 🚀 Test Qilish:

### 1. Backend Ishga Tushirish:

```bash
# Terminal 1 - Backend
uvicorn app.main:app --reload
```

Backend ishga tushadi: `http://localhost:8000`

### 2. Backend Tekshirish:

Brauzerda oching:
```
http://localhost:8000/dentists/
```

Natija (JSON):
```json
[
  {
    "id": 4,
    "user_id": 4,
    "full_name": "Махмуд Пулатов",
    "specialization": "Терапевт",
    "phone": "+998901234567",
    "clinic": "Стоматология №1",
    "address": "Ташкент, Юнусабад",
    "work_hours": "09:00-18:00",
    "telegram": "@mahmud_dentist",
    "verification_status": "approved"
  },
  {
    "id": 6,
    "user_id": 6,
    "full_name": "Aziz Saydazxonov",
    "specialization": "hygienist",
    "phone": "+998903219459",
    "clinic": "Ideal Dental",
    "work_hours": "09:00-17:00",
    "verification_status": "approved"
  }
]
```

### 3. Frontend Ishga Tushirish:

```bash
# Terminal 2 - Frontend
npm run dev
```

Frontend ishga tushadi: `http://localhost:5173`

### 4. Frontend Test:

1. Brauzerda oching: `http://localhost:5173`
2. Login/Register qiling
3. Doktorlar sahifasiga o'ting: `/doctors`

**Natija**: 
- ✅ **2 ta doktor ko'rinadi** (Render bazasidan)
- ✅ Махмуд Пулатов
- ✅ Aziz Saydazxonov

### 5. Fallback Test (Backend O'chiq):

1. Backend serverni to'xtating (Ctrl+C)
2. Frontend sahifasini yangilang (F5)

**Natija**:
- ✅ **1 ta local doktor ko'rinadi** (Махмуд Пулатов)
- ⚠️ Bu fallback rejimi

## 🔍 Qanday Ishlaydi:

### API Mode (Backend Ishlab Tursa):
```
Frontend → API Request → http://localhost:8000/dentists/
         ← API Response ← [Махмуд Пулатов, Aziz Saydazxonov]
         → Ko'rsatish → 2 ta doktor kartochkasi
```

### Fallback Mode (Backend Ishlamasa):
```
Frontend → API Request → ❌ Error
         → Fallback → Local doktor (Махмуд Пулатов)
         → Ko'rsatish → 1 ta doktor kartochkasi
```

## 📊 Kutilgan Natijalar:

| Holat | Backend | Natija |
|-------|---------|--------|
| ✅ Normal | Ishlab turadi | 2 ta doktor (bazadan) |
| ⚠️ Fallback | Ishlamayapti | 1 ta doktor (local) |

## 🐛 Muammolarni Hal Qilish:

### Doktorlar ko'rinmayapti?

1. **Backend ishlab turganini tekshiring**:
   ```bash
   curl http://localhost:8000/dentists/
   ```

2. **CORS xatolarini tekshiring**:
   - Brauzer konsolini oching (F12)
   - Network tabni tanlang
   - `/dentists/` so'rovini qidiring

3. **Database ulanishini tekshiring**:
   ```bash
   python check_doctors_render.py
   ```

### CORS Xatosi?

`app/main.py` faylida `localhost:5173` qo'shilganini tekshiring:
```python
allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    ...
]
```

## ✅ Muvaffaqiyatli Test:

Agar hammasi to'g'ri ishlasa:
1. ✅ Backend `/dentists/` endpoint JSON qaytaradi
2. ✅ Frontend 2 ta doktor kartochkasini ko'rsatadi
3. ✅ Har bir doktor kartochkasiga bosish mumkin
4. ✅ "Записаться" tugmasi ishlaydi

## 🎉 Tayyor!

Endi sizning ilovangiz Render PostgreSQL bazasiga ulangan va doktorlarni ko'rsatadi!

Backend ishga tushiring va test qiling! 🚀
