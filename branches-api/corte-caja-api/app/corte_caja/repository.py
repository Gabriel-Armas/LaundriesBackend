from typing import Optional, List
from uuid import UUID

from sqlalchemy.orm import Session
from sqlalchemy import extract

from app.corte_caja.models import CorteCajaModel
from app.corte_caja.schemas import CorteCajaCreate


class CorteCajaRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        data: CorteCajaCreate,
        empleado_id: UUID,
        total_ventas,
        total_devoluciones,
        diferencia,
    ) -> CorteCajaModel:
        corte = CorteCajaModel(
            sucursal_id=data.sucursal_id,
            empleado_id=empleado_id,
            fecha_inicio=data.fecha_inicio,
            fecha_fin=data.fecha_fin,
            total_ventas=total_ventas,
            total_devoluciones=total_devoluciones,
            dinero_inicial=data.dinero_inicial,
            monto_reportado_por_empleado=data.monto_reportado_por_empleado,
            diferencia=diferencia,
        )
        self.db.add(corte)
        self.db.commit()
        self.db.refresh(corte)
        return corte

    def get_by_id(self, corte_id: int) -> Optional[CorteCajaModel]:
        return (
            self.db.query(CorteCajaModel)
            .filter(CorteCajaModel.id == corte_id)
            .first()
        )

    def list_by_year(self, anio: int) -> List[CorteCajaModel]:
        return (
            self.db.query(CorteCajaModel)
            .filter(extract("year", CorteCajaModel.fecha_inicio) == anio)
            .order_by(CorteCajaModel.fecha_inicio.asc())
            .all()
        )