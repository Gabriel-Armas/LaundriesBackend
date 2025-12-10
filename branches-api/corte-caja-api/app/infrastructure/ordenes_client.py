import os
import logging
from datetime import date
from decimal import Decimal

import requests

logger = logging.getLogger("corte_caja_api")

ORDENES_API_BASE_URL = os.getenv("ORDENES_API_BASE_URL")


class VentasPorFechaError(Exception):
    pass


def get_total_ventas_por_fecha(
    sucursal_id: str,
    fecha: date,
    token: str,
) -> Decimal:

    if ORDENES_API_BASE_URL is None:
        raise RuntimeError("ORDENES_API_BASE_URL no está configurado")

    url = f"{ORDENES_API_BASE_URL}/ordenes/ventas/por-fecha"
    params = {
        "idSucursal": sucursal_id,
        "fecha": fecha.isoformat(),
    }
    headers = {
        "Authorization": f"Bearer {token}",
    }

    logger.info(
        f"[ordenes-client] GET {url} params={params} headers={headers}"
    )

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=5)
    except requests.RequestException as e:
        logger.error(f"[ordenes-client] Error de red llamando a órdenes-api: {e}")
        raise VentasPorFechaError("No se pudo obtener ventas del día") from e

    logger.info(
        f"[ordenes-client] Respuesta órdenes-api: status={resp.status_code}"
    )

    if resp.status_code != 200:
        logger.error(
            f"[ordenes-client] Órdenes-api respondió {resp.status_code}: {resp.text}"
        )
        raise VentasPorFechaError(
            f"Órdenes-api respondió {resp.status_code}"
        )

    try:
        data = resp.json()
    except Exception as e:
        logger.error(
            f"[ordenes-client] No se pudo parsear JSON de órdenes-api: {e} | body={resp.text}"
        )
        raise VentasPorFechaError("Respuesta inválida de órdenes-api") from e

    logger.info(f"[ordenes-client] JSON recibido desde órdenes-api: {data}")

    total = Decimal("0")
    for orden in data:
        costo_str = str(orden.get("costo_total", "0"))
        total += Decimal(costo_str)

    logger.info(f"[ordenes-client] Total ventas del día: {total}")
    return total