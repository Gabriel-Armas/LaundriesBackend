import httpx
from core.config import settings
from core.logger import get_logger

logger = get_logger("EMPLEADOS_SERVICE")

async def obtener_empleados():
    url = f"{settings.EMPLEADOS_API_BASE_URL}/employees"

    logger.info(f"Llamando API EMPLEADOS → {url}")
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    resp.raise_for_status()
    return resp.json()