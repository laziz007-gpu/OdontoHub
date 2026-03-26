from dotenv import load_dotenv
load_dotenv()

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./sql_app.db"
)

# Build engine kwargs based on DB type
if "sqlite" in DATABASE_URL:
    engine_kwargs = {"connect_args": {"check_same_thread": False}}
else:
    # PostgreSQL (Neon, Render, etc.) - SSL handled via URL params
    engine_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "connect_args": {"sslmode": "require"} if "neon.tech" in DATABASE_URL else {},
    }

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

from app.models.base import Base

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
