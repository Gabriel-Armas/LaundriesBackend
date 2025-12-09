from uuid import UUID
from decimal import Decimal
from datetime import datetime
from typing import List

from pydantic import BaseModel, ConfigDict


class CorteCajaCreate(BaseModel):
    sucursal_id: UUID
    fecha_inicio: datetime
    fecha_fin: datetime
    dinero_inicial: Decimal
    monto_reportado_por_empleado: Decimal


class CorteCajaOut(BaseModel):
    id: int
    sucursal_id: UUID
    empleado_id: UUID
    fecha_inicio: datetime
    fecha_fin: datetime
    created_at: datetime

    total_ventas: Decimal
    total_devoluciones: Decimal
    dinero_inicial: Decimal
    monto_reportado_por_empleado: Decimal
    diferencia: Decimal

    model_config = ConfigDict(from_attributes=True)


class CortesPorMes(BaseModel):
    mes: int
    cortes: List[CorteCajaOut]