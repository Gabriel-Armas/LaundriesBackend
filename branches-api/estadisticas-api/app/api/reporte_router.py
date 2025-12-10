from fastapi import APIRouter, Depends, Query, Request
from datetime import datetime
from core.security import require_admin
from services.reporte_service import generar_reporte_anual
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reportes", tags=["Reportes"])


@router.get("/ventas-anuales")
async def obtener_reporte_ventas_anuales(
    request: Request,
    anio: int | None = Query(None),
    user=Depends(require_admin)
):
    token = request.headers.get("Authorization").replace("Bearer ", "")

    if not anio:
        anio = datetime.utcnow().year

    logger.info(f"[REPORTE] Generando reporte anual | año={anio}")

    reporte = await generar_reporte_anual(anio, token)

    return reporte

@router.get("/ventas-anuales/sucursal/{sucursal_id}")
async def obtener_reporte_ventas_anuales_por_sucursal(
    request: Request,
    sucursal_id: str,
    anio: int | None = Query(None),
    user=Depends(require_admin)
):
    token = request.headers.get("Authorization").replace("Bearer ", "")

    if not anio:
        anio = datetime.utcnow().year

    logger.info(
        f"[REPORTE] Generando reporte anual por sucursal | sucursal={sucursal_id} | año={anio}"
    )

    reporte = await generar_reporte_anual(anio, token, sucursal_id=sucursal_id)

    return reporte