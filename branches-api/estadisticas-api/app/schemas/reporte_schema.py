from pydantic import BaseModel
from typing import List, Dict

class VentasPorMes(BaseModel):
    mes: int
    total: float

class TopEmpleado(BaseModel):
    id_empleado: str
    nombre: str
    total_ventas: float

class ReporteResponse(BaseModel):
    ventas_mensuales: List[VentasPorMes]
    top_empleados: List[TopEmpleado]