from pydantic import BaseModel
from typing import List

class VentaItem(BaseModel):
    id: int
    subtotal: float

class Venta(BaseModel):
    id: str
    costo_total: float
    id_empleado: str
    fecha_recepcion: str
    items: List[VentaItem]