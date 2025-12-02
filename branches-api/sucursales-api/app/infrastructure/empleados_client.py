import os
import logging
from uuid import UUID
import requests

logger = logging.getLogger("sucursales_api")

EMPLEADOS_API_BASE_URL = os.getenv("EMPLEADOS_API_BASE_URL")


def is_manager_of_sucursal(empleado_id: UUID, sucursal_id: UUID, token: str) -> bool:

    if EMPLEADOS_API_BASE_URL is None:
        logger.error("EMPLEADOS_API_BASE_URL no está configurado")
        return False

    url = f"{EMPLEADOS_API_BASE_URL}/employees/{empleado_id}"

    headers = {
        "Authorization": f"Bearer {token}",
    }

    logger.info(
        f"[empleados-client] Llamando a empleados-api: GET {url} | headers={headers}"
    )

    try:
        resp = requests.get(url, headers=headers, timeout=5)
    except Exception as e:
        logger.error(f"[empleados-client] Error de red llamando a empleados-api: {e}")
        return False

    logger.info(
        f"[empleados-client] Respuesta empleados-api: status={resp.status_code}"
    )

    if resp.status_code != 200:
        logger.warning(
            f"[empleados-client] empleados-api respondió status {resp.status_code} (esperado 200). "
            f"Devolviendo False."
        )
        return False

    try:
        data = resp.json()
    except Exception as e:
        logger.error(
            f"[empleados-client] No se pudo parsear JSON de empleados-api: {e} | body={resp.text}"
        )
        return False

    logger.info(
        f"[empleados-client] JSON recibido desde empleados-api: {data}"
    )

    empleado_sucursal_id_str = data.get("idSucursal")

    if not empleado_sucursal_id_str:
        logger.warning(
            "[empleados-client] El JSON del empleado no trae idSucursal"
        )
        return False

    try:
        empleado_sucursal_id = UUID(empleado_sucursal_id_str)
    except ValueError:
        logger.error(
            f"[empleados-client] idSucursal en empleados-api no es UUID válido: {empleado_sucursal_id_str}"
        )
        return False

    logger.info(
        f"[empleados-client] Validando sucursal -> "
        f"idSucursalEmpleado={empleado_sucursal_id}, sucursalObjetivo={sucursal_id}"
    )

    if empleado_sucursal_id != sucursal_id:
        logger.warning(
            "[empleados-client] El empleado NO pertenece a la sucursal solicitada"
        )
        return False

    logger.info(
        "[empleados-client] Validación exitosa: empleado pertenece a la sucursal"
    )
    return True