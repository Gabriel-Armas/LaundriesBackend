from fastapi import APIRouter, Depends
from core.security import require_admin
from schemas.reporte_schema import ReporteResponse
from services.reporte_service import generar_reporte

router = APIRouter(prefix="/reportes", tags=["Reportes"])

@router.get("/ventas", response_model=ReporteResponse)
async def reporte_ventas(idSucursal: str, user=Depends(require_admin)):
    return await generar_reporte(idSucursal)