import httpx
from core.config import settings

async def obtener_sucursales(token: str):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{settings.SUCURSALES_API_BASE_URL}/sucursales",
            headers=headers
        )
        res.raise_for_status()
        return res.json()