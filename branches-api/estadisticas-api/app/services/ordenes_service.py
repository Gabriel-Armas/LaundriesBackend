import httpx
from core.config import settings
from core.logger import get_logger

logger = get_logger("ORDENES_SERVICE")

async def obtener_ventas_por_sucursal(id_sucursal: str):
    url = f"{settings.ORDENES_API_BASE_URL}/ordenes/ventas"
    logger.info(f"Llamando API ORDENES → {url}?idSucursal={id_sucursal}")

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params={"idSucursal": id_sucursal})

    logger.debug(f"Respuesta ORDENES: {resp.text}")

    resp.raise_for_status()
    return resp.json()