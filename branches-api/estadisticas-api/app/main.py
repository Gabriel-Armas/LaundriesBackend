from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.reporte_router import router as reporte_router
import os

app = FastAPI(title="API Reportes Lavandería")

origins_str = os.getenv("FRONTEND_ORIGINS", "*")

if origins_str == "*":
    allow_origins = ["*"]
else:
    allow_origins = [
        o.strip() for o in origins_str.split(",") if o.strip()
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,    
    allow_credentials=True,
    allow_methods=["*"],           
    allow_headers=["*"],            
)

app.include_router(reporte_router)

@app.get("/")
def root():
    return {"status": "ok"}