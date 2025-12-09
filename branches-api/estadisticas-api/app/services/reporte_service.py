from datetime import datetime
from collections import defaultdict
from core.logger import get_logger
from services.ordenes_service import obtener_ventas_por_sucursal
from services.empleados_service import obtener_empleados

logger = get_logger("REPORTE_SERVICE")

async def generar_reporte(id_sucursal: str):
    logger.info(f"Iniciando generación de reporte para sucursal={id_sucursal}")

    ventas = await obtener_ventas_por_sucursal(id_sucursal)
    empleados = await obtener_empleados()

    empleados_map = {e["id"]: e["nombre"] for e in empleados}

    ventas_mensuales = defaultdict(float)

    for v in ventas:
        fecha = datetime.fromisoformat(v["fecha_recepcion"].replace("Z", ""))
        mes = fecha.month
        ventas_mensuales[mes] += float(v["costo_total"])

    ventas_empleados = defaultdict(float)

    for v in ventas:
        ventas_empleados[v["id_empleado"]] += float(v["costo_total"])

    top_empleados = sorted(
        [
            {
                "id_empleado": emp_id,
                "nombre": empleados_map.get(emp_id, "Desconocido"),
                "total_ventas": total,
            }
            for emp_id, total in ventas_empleados.items()
        ],
        key=lambda x: x["total_ventas"],
        reverse=True,
    )

    logger.info("Reporte generado correctamente")

    return {
        "ventas_mensuales": [
            {"mes": m, "total": total}
            for m, total in sorted(ventas_mensuales.items())
        ],
        "top_empleados": top_empleados[:5],  # TOP 5
    }