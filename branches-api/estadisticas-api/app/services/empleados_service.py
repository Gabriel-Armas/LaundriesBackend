import httpx
from core.config import settings

async def obtener_empleados(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{settings.EMPLEADOS_API_BASE_URL}/employees",
            headers=headers
        )
        res.raise_for_status()
        return res.json()