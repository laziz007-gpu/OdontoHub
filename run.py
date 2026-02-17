"""
Скрипт для запуска FastAPI сервера
"""
import sys
import os

# Добавляем текущую директорию в PYTHONPATH
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
os.chdir(current_dir)

if __name__ == "__main__":
    import uvicorn
    # Запускаем без reload чтобы избежать проблем с multiprocessing
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
