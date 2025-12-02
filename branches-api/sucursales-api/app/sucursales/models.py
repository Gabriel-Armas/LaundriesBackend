from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from uuid import uuid4

from app.infrastructure.db import Base


class SucursalModel(Base):
    __tablename__ = "sucursales"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String(255), nullable=False)
    telefono = Column(String(30), nullable=False)

    estado = Column(Boolean, nullable=False, default=True)

    clave_cancelacion = Column(String(50), nullable=False)