from fastapi import FastAPI
from api.reporte_router import router as reporte_router

app = FastAPI(title="API Reportes Lavandería")

app.include_router(reporte_router)

@app.get("/")
def root():
    return {"status": "ok"}