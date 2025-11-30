import os
import requests
from uuid import UUID

EMPLEADOS_API_BASE_URL = os.getenv("EMPLEADOS_API_BASE_URL")

if not EMPLEADOS_API_BASE_URL:
    raise ValueError("EMPLEADOS_API_BASE_URL no está definido en el entorno (.env)")

def is_manager_of_sucursal(empleado_id: UUID, sucursal_id: int, token: str) -> bool:
    url = f"{EMPLEADOS_API_BASE_URL}/empleados/{empleado_id}/sucursales/{sucursal_id}/validate"
    headers = {"Authorization": f"Bearer {token}"}

    try:
        resp = requests.get(url, headers=headers, timeout=5)
    except Exception:
        return False

    if resp.status_code != 200:
        return False

    data = resp.json()
    return bool(data.get("valid", False))