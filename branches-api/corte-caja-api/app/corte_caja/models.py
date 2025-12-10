from datetime import datetime
from uuid import UUID

from sqlalchemy import Column, Integer, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func

from app.infrastructure.db import Base


class CorteCajaModel(Base):
    __tablename__ = "cortes_caja"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    sucursal_id = Column(PG_UUID(as_uuid=True), nullable=False)
    empleado_id = Column(PG_UUID(as_uuid=True), nullable=False)

    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    total_ventas = Column(Numeric(12, 2), nullable=False)
    total_devoluciones = Column(Numeric(12, 2), nullable=False)
    dinero_inicial = Column(Numeric(12, 2), nullable=False)
    monto_reportado_por_empleado = Column(Numeric(12, 2), nullable=False)
    diferencia = Column(Numeric(12, 2), nullable=False)