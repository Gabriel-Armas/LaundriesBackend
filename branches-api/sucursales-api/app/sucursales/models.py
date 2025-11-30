from sqlalchemy import Column, Integer, String, Boolean
from app.infrastructure.db import Base

class SucursalModel(Base):
    __tablename__ = "sucursales"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    direccion = Column(String(255), nullable=False)
    telefono = Column(String(30), nullable=False)

    estado = Column(Boolean, nullable=False, default=True)

    clave_cancelacion = Column(String(50), nullable=False)