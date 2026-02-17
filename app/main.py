from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


        "http://localhost:5173",
        "https://odontohubapp.netlify.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



