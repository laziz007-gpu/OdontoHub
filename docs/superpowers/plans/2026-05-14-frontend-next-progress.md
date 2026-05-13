# Frontend → Next.js Migration — Progress Log

**Sana:** 2026-05-14
**Branch:** `patient/abduvoris`
**Holat:** Phase 1 yakunlangan (foundation + 4 public sahifa + 2 stub). Phase 2 boshlanmagan.

---

## Bugun qilingan ish (15 ta commit)

Hammasi `patient/abduvoris` branch'iga commit qilingan, **push qilinmagan** (siz xohlasangiz `git push` qilamiz).

```
54c3c917 docs(frontend-next): replace boilerplate README with Phase 1 guide
78b1abe5 feat(frontend-next): Register Patient + Role + Menu + Home + group layouts
c276f0d2 feat(frontend-next): port Login page (POST /auth/login + role-based redirect)
4527ba46 feat(frontend-next): port Welcome page with locale switcher
96d2e78e feat(frontend-next): root + [locale] layouts wired with providers and globals.css
b3867690 refactor(frontend-next): adopt default create-next-app layout (no src/)
bb16ff38 chore(frontend-next): copy fonts and image assets to public/assets/
61414a5b feat(frontend-next): add minimal MainLayout (doctor) and PatientLayout
7d24d687 feat(frontend-next): add Redux store, axios client, providers, RoleGuard, paths
b793af00 feat(frontend-next): port TypeScript types and interfaces
a53ffb0c feat(frontend-next): port translations (uz/ru/en/kz) and adapt to ICU format
76802602 feat(frontend-next): wire next-intl routing, request handler, plugin, middleware
d2f6af89 chore(frontend-next): split path aliases (LATER REVERTED to default)
b7177631 feat(frontend-next): install Redux Toolkit, React Query, next-intl, axios, UI deps
7a75c107 feat(frontend-next): scaffold Next.js 16 project with App Router, TS, Tailwind v4
```

## Yakuniy struktura

```
frontend-next/
├── app/
│   ├── layout.tsx                  ← Server, minimal passthrough
│   ├── globals.css                 ← Tailwind + design system (Google Fonts, btn-primary, ...)
│   └── [locale]/
│       ├── layout.tsx              ← Server, NextIntlClientProvider + ReduxProvider + QueryProvider + AuthInit
│       ├── page.tsx                ← Welcome (full UI)
│       ├── (public)/
│       │   ├── login/page.tsx      ← Login (full UI, axios POST /auth/login + /auth/me)
│       │   └── register_pat/page.tsx ← Register patient (new simpler form, POST /auth/register)
│       ├── (auth)/
│       │   ├── layout.tsx          ← RoleGuard (token-only)
│       │   └── role/page.tsx       ← Manual role selection (full UI)
│       ├── (doctor)/
│       │   ├── layout.tsx          ← RoleGuard requiredRole="dentist" + MainLayout
│       │   └── menu/page.tsx       ← STUB only
│       └── (patient)/
│           ├── layout.tsx          ← RoleGuard requiredRole="patient" + PatientLayout
│           └── home/page.tsx       ← STUB only
├── api/api.ts                      ← axios + Authorization Bearer interceptor + 401 redirect
├── guards/RoleGuard.tsx            ← 'use client', useEffect with localStorage check
├── i18n/
│   ├── routing.ts                  ← locales: uz/ru/en/kz, default: ru, localePrefix: always
│   ├── navigation.ts               ← Link, useRouter, usePathname wrappers
│   └── request.ts                  ← getRequestConfig with messages from ../messages/
├── layouts/
│   ├── MainLayout.tsx              ← Doctor sidebar (minimal) + Logout
│   └── PatientLayout.tsx           ← Patient bottom nav (minimal) + Logout
├── lib/paths.ts                    ← URL constants
├── messages/                       ← next-intl convention (renamed from translations/)
│   ├── uz.json, ru.json, en.json, kz.json
├── providers/
│   ├── ReduxProvider.tsx
│   ├── QueryProvider.tsx
│   └── AuthInit.tsx
├── public/assets/                  ← fonts + img (ko'chirilgan)
├── store/
│   ├── store.ts, hooks.ts
│   └── slices/userSlice.ts
├── types/                          ← patient, allergy, notification, prescription, index
├── middleware.ts                   ← next-intl middleware
├── next.config.ts                  ← createNextIntlPlugin wrapper
└── tsconfig.json                   ← @/* → ./* (default)
```

## Sinash uchun (ertaga eslatma)

```powershell
# Terminal 1
cd backend
python run.py

# Terminal 2
cd frontend-next
npm run dev
```

`http://localhost:3000` → `/ru` redirect → Welcome.

Build:
```powershell
cd frontend-next
npm run build
```

Build vaqti ~9s, **24 ta static sahifa** (6 route × 4 locale) generatsiya bo'ladi.

## Muhim eslatmalar (ertaga e'tibor ber)

1. **Backend `localhost:3000` ni CORS allow'da** — qo'shimcha o'zgartirish kerak emas. `backend/app/main.py:28` da bor.

2. **Stubs:**
   - `app/[locale]/(doctor)/menu/page.tsx` — faqat placeholder matn
   - `app/[locale]/(patient)/home/page.tsx` — faqat placeholder matn
   - `layouts/MainLayout.tsx` va `PatientLayout.tsx` — minimal nav, joriy `frontend/src/Layouts/`'dan to'liq UI emas

3. **Toast komponent yo'q** — joriy kodda `toast.error(...)` chaqiruvlari `alert(...)` ga aylantirildi (Login, Register sahifalarida). Phase 2'da Toast'ni port qilish kerak.

4. **`{{var}}` → `{var}` konvertatsiya qilingan** — 4 ta translation faylida 4 ta kalit (`from_reviews`, `new_count`, `greeting`, `found_count`). Plural suffixlar yo'q.

5. **Next.js 16 deprecation:** build vaqtida `middleware` → `proxy` rename ogohlantirishi chiqadi. Hozircha ishlaydi (next-intl hali `middleware` ishlatadi). Phase 2'da `next-intl` `proxy` ga moslashganda rename qilamiz.

6. **Path alias:** `@/*` → `./*` (root). Hech qanday `~/*` yo'q. Strukturani `src/` o'rniga root'da tutamiz (user requested standard create-next-app layout).

7. **Eski Vite frontend `frontend/`'da hali ham mavjud va parallel ishlaydi** — siz uni o'chirmadingiz.

## Ertaga keyingi qadam — variantlar

### Variant A: Phase 2 Doctor (tavsiya etiladi — ko'p ma'lumot Doctor'da)
Yangi spec va plan yozish kerak, keyin 5-7 sahifa port:
- `/patients` (joriy `Patsant.tsx` — patient ro'yxati)
- `/patients/:id` (joriy `PatientDetailPage.tsx`)
- `/profile` (joriy `DoctorProfile.tsx`)
- `/profile/edit` (joriy `EditDoctorProfile.tsx`)
- `/appointments` (joriy `Appointments.tsx`)
- `/settings` (joriy `Settings.tsx`)
- Va MainLayout'ni `frontend/src/Layouts/MainLayout.tsx`'dan to'liq UI bilan port qilish

### Variant B: Phase 2 Patient
- `/calendar` (joriy `PatientAppointments.tsx`)
- `/history` (joriy `PatientHistory.tsx`)
- `/profile_pat` (joriy `PatientProfilePage.tsx`)
- `/doctors` (joriy `Doctors.tsx`)
- `/specialties` (joriy `Specialties.tsx`)
- `/booking` (joriy `Booking.tsx`)
- Va PatientLayout'ni to'liq UI bilan port qilish

### Variant C: Chat (WebSocket) — Phase 3
Bu ikkalasi uchun ham (doctor va patient) muhim. Joriy `frontend/src/api/chat.ts` va WebSocket manageri bor.

### Variant D: Toast komponent + Layout polish
Foundation polish: joriy Toast'ni port qilish, MainLayout va PatientLayout'ning to'liq UI'sini ko'chirish (sidebar items, header, etc.).

### Variant E: Mexanik port (tavsiya etilmadi, lekin tezroq)
Hamma 28+ sahifani `'use client'` qo'shib mexanik tarzda olib o'tish. Tez bo'ladi, lekin Next.js afzalligini olmaymiz va review qilish qiyin bo'ladi.

## Foydali fayllar

- **Spec:** `docs/superpowers/specs/2026-05-14-frontend-next-migration-design.md`
- **Phase 1 plan:** `docs/superpowers/plans/2026-05-14-frontend-next-phase-1.md`
- **Bu progress log:** `docs/superpowers/plans/2026-05-14-frontend-next-progress.md`
- **frontend-next README:** `frontend-next/README.md`

## Ertaga sessiyani boshlash uchun savol shabloni

> "Frontend-next migration Phase 2 ni boshlaymiz. Qaysi variantni xohlaysiz (A/B/C/D)? Spec va plan'ni shu progress log'dagi ma'lumotlar asosida yozing."

Yoki:

> "Doctor /profile sahifasini frontend/src/Pages/DoctorProfile.tsx'dan frontend-next'ga port qil."

(Birinchisi tavsiya etiladi — har bir sahifani alohida task qilish o'rniga, butun phase uchun reja tuzish samaraliroq.)
