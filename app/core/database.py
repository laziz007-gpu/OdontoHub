from sqlalchemy import create_engine


engine = create_engine(
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
