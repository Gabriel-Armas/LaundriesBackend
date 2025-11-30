from typing import Optional, List
from sqlalchemy.orm import Session

from .models import SucursalModel
from .schemas import SucursalCreate, SucursalEdit

class SucursalRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: SucursalCreate, clave_cancelacion: str) -> SucursalModel:
        sucursal = SucursalModel(
            nombre=data.nombre,
            direccion=data.direccion,
            telefono=data.telefono,
            clave_cancelacion=clave_cancelacion,
            estado=True,
        )
        self.db.add(sucursal)
        self.db.commit()
        self.db.refresh(sucursal)
        return sucursal

    def get_by_id(self, sucursal_id: int) -> Optional[SucursalModel]:
        return self.db.query(SucursalModel).filter(SucursalModel.id == sucursal_id).first()

    def update(self, sucursal: SucursalModel) -> SucursalModel:
        self.db.add(sucursal)
        self.db.commit()
        self.db.refresh(sucursal)
        return sucursal
    
    def list_active(self) -> List[SucursalModel]:
        return (
            self.db.query(SucursalModel)
            .filter(SucursalModel.estado.is_(True))
            .all()
        )