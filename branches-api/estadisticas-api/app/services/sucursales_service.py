import httpx
from core.config import settings
from core.logger import get_logger

logger = get_logger("SUCURSALES_SERVICE")

async def obtener_sucursales():
    url = f"{settings.SUCURSALES_API_BASE_URL}/sucursales"

    logger.info(f"Llamando API SUCURSALES → {url}")
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    resp.raise_for_status()
    return resp.json()