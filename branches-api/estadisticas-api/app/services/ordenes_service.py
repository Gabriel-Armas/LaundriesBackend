import httpx
from core.config import settings

async def obtener_ventas_por_sucursal(id_sucursal: str, token: str):
    headers = {"Authorization": f"Bearer {token}"}
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{settings.ORDENES_API_BASE_URL}/ordenes/ventas",
            params={"idSucursal": id_sucursal},
            headers=headers
        )
        res.raise_for_status()
        return res.json()