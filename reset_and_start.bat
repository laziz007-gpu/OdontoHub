@echo off
echo ========================================
echo СБРОС БАЗЫ ДАННЫХ И ЗАПУСК СЕРВЕРА
echo ========================================
echo.

echo Останавливаем сервер (если запущен)...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Удаляем старую базу данных...
if exist sql_app.db (
    del sql_app.db
    echo ✅ База данных удалена
) else (
    echo ⚠️  База данных не найдена
)

echo.
echo Запускаем сервер...
echo Сервер создаст новую базу данных автоматически
echo.
echo ========================================
echo ВАЖНО: После запуска выполни:
echo python create_test_user.py
echo ========================================
echo.

call .venv\Scripts\activate.bat
uvicorn app.main:app --reload
