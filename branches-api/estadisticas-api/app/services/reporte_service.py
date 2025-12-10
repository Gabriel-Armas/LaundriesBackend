import logging
from datetime import datetime
from collections import defaultdict
from services.sucursales_service import obtener_sucursales
from services.ordenes_service import obtener_ventas_por_sucursal
from services.empleados_service import obtener_empleados

logger = logging.getLogger(__name__)

MESES = {
    1: "enero", 2: "febrero", 3: "marzo", 4: "abril",
    5: "mayo", 6: "junio", 7: "julio", 8: "agosto",
    9: "septiembre", 10: "octubre", 11: "noviembre", 12: "diciembre"
}


async def generar_reporte_anual(anio: int, token: str, sucursal_id: str | None = None):
    logger.info(f"[SERVICE] Iniciando agregación anual | año={anio} | filtro_sucursal={sucursal_id}")

    sucursales = await obtener_sucursales(token)
    logger.info(f"[SERVICE] Sucursales obtenidas: {len(sucursales)}")

    if sucursal_id:
        sucursales = [s for s in sucursales if s["id"] == sucursal_id]
        logger.info(f"[SERVICE] Filtrado a una sucursal: {len(sucursales)} encontrada(s)")

        if not sucursales:
            return {
                "anio": anio,
                "detalle_por_sucursal": [],
                "ventas_totales": {},
                "top_empleados": [],
                "mensaje": f"La sucursal {sucursal_id} no existe."
            }

    ventas_global = defaultdict(float)
    detalle_por_sucursal = []
    empleados_contador = defaultdict(int)

    for sucursal in sucursales:
        s_id = sucursal["id"]
        s_nombre = sucursal["nombre"]

        logger.info(f"[SERVICE] Consultando ventas para sucursal {s_nombre} ({s_id})")

        ventas = await obtener_ventas_por_sucursal(s_id, token)

        ventas_por_mes = defaultdict(float)

        for venta in ventas:
            fecha = datetime.fromisoformat(venta["fecha_recepcion"].replace("Z", ""))

            if fecha.year != anio:
                continue

            monto = float(venta["costo_total"])
            mes = MESES[fecha.month]

            ventas_por_mes[mes] += monto
            ventas_global[mes] += monto

            empleados_contador[venta["id_empleado"]] += 1

        detalle_por_sucursal.append({
            "sucursal": s_nombre,
            "sucursal_id": s_id,
            "ventas": ventas_por_mes
        })

    empleados = await obtener_empleados(token)
    empleados_por_id = {e["id"]: e["nombre"] for e in empleados}

    top_empleados = sorted(
        [
            {"empleado": empleados_por_id.get(emp_id, "Desconocido"), "ventas": count}
            for emp_id, count in empleados_contador.items()
        ],
        key=lambda x: x["ventas"],
        reverse=True
    )

    logger.info("[SERVICE] Reporte anual consolidado correctamente.")

    return {
        "anio": anio,
        "ventas_totales": ventas_global,
        "top_empleados": top_empleados,
        "detalle_por_sucursal": detalle_por_sucursal
    }