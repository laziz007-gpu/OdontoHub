# ✅ Render PostgreSQL Database - Doktorlar Qo'shildi!

## 📊 Bazadagi Doktorlar:

### 1. Махмуд Пулатов ✅
- **ID**: 4
- **Mutaxassislik**: Терапевт
- **Telefon**: +998901234567
- **Email**: makhmudpulatov07@gmail.com
- **Klinika**: Стоматология №1
- **Manzil**: Ташкент, Юнусабад
- **Ish vaqti**: 09:00-18:00
- **Telegram**: @mahmud_dentist
- **Status**: approved ✅

### 2. Aziz Saydazxonov ✅
- **ID**: 6
- **Mutaxassislik**: hygienist
- **Telefon**: +998903219459
- **Klinika**: Ideal Dental
- **Ish vaqti**: 09:00-17:00
- **Status**: approved ✅

## 🔗 Database URL:
```
postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql
```

## 🚀 Backend Ishga Tushirish:

```bash
# Backend serverni ishga tushiring
uvicorn app.main:app --reload
```

Backend ishga tushgandan keyin:
- API: `http://localhost:8000`
- Doktorlar ro'yxati: `http://localhost:8000/dentists/`
- API Docs: `http://localhost:8000/docs`

## 🧪 Test Qilish:

### 1. Doktorlarni Olish (API):
```bash
curl http://localhost:8000/dentists/
```

Yoki brauzerda:
```
http://localhost:8000/dentists/
```

### 2. Frontend Test:
1. Frontend ishga tushiring: `npm run dev`
2. Doktorlar sahifasiga o'ting: `http://localhost:5173/doctors`
3. Ikkala doktor ko'rinishi kerak!

## 📝 Yaratilgan Skriptlar:

1. **check_doctors_render.py** - Bazadagi doktorlarni ko'rish
2. **update_mahmud_pulatov.py** - Mahmud Pulatov profilini yangilash
3. **add_doctors_to_render.py** - Yangi doktorlar qo'shish

## ⚙️ .env Fayl:

```env
VITE_API_URL=http://localhost:8000
DATABASE_URL=postgresql://odonto_postgre_sql_user:kflIPQoXTqgfmE2Fvm0YUPtZ7LZKUF3I@dpg-d69rs449c44c738g9u50-a.oregon-postgres.render.com/odonto_postgre_sql
```

## 🎯 Keyingi Qadamlar:

1. ✅ Backend ishga tushiring
2. ✅ Frontend ishga tushiring
3. ✅ Doktorlar sahifasiga o'ting
4. ✅ Ikkala doktor ko'rinadi!
5. ✅ Doktor kartochkasiga bosing → Profil sahifasiga o'tadi
6. ✅ "Записаться" tugmasini bosing → Booking sahifasiga o'tadi

## 🔄 Yangi Doktor Qo'shish:

Agar yangi doktor qo'shmoqchi bo'lsangiz:

```bash
python add_doctors_to_render.py
```

Keyin "yes" deb javob bering va yangi doktorlar qo'shiladi.

## ✅ Hammasi Tayyor!

Endi sizning ilovangiz Render PostgreSQL bazasiga ulangan va doktorlar ko'rsatiladi! 🎉
