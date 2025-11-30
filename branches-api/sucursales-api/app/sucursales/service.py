import secrets
from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import CurrentUser
from app.infrastructure.empleados_client import is_manager_of_sucursal
from .repository import SucursalRepository
from .schemas import SucursalCreate, SucursalEdit, SucursalOut, ClaveDevolucionOut, ValidarClaveRequest, ValidarClaveResponse
from .models import SucursalModel

class SucursalService:
    def __init__(self, db: Session):
        self.repo = SucursalRepository(db)

    def create_sucursal(self, dto: SucursalCreate, user: CurrentUser) -> SucursalOut:
        if user.role != "ADMIN":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")

        clave = secrets.token_hex(4)
        sucursal = self.repo.create(dto, clave)
        return SucursalOut.from_orm(sucursal)

    def edit_sucursal(self, sucursal_id: int, dto: SucursalEdit, user: CurrentUser) -> SucursalOut:
        if user.role != "ADMIN":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")

        sucursal = self.repo.get_by_id(sucursal_id)
        if not sucursal:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sucursal no encontrada")

        if dto.borrar:
            sucursal.estado = False

        if dto.nombre is not None:
            sucursal.nombre = dto.nombre
        if dto.direccion is not None:
            sucursal.direccion = dto.direccion
        if dto.telefono is not None:
            sucursal.telefono = dto.telefono

        sucursal = self.repo.update(sucursal)
        return SucursalOut.from_orm(sucursal)

    def get_sucursal(self, sucursal_id: int, user: CurrentUser) -> SucursalOut:
        if user.role not in ("ADMIN", "MANAGER", "EMPLOY"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")

        sucursal = self.repo.get_by_id(sucursal_id)
        if not sucursal or not sucursal.estado:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sucursal no encontrada")

        return SucursalOut.from_orm(sucursal)

    def get_clave_devolucion(
        self,
        sucursal_id: int,
        user: CurrentUser,
        raw_token: str,
    ) -> ClaveDevolucionOut:
        if user.role != "MANAGER":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")

        sucursal: Optional[SucursalModel] = self.repo.get_by_id(sucursal_id)
        if not sucursal or not sucursal.estado:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sucursal no encontrada")

        es_manager_de_sucursal = is_manager_of_sucursal(user.user_id, sucursal_id, raw_token)
        if not es_manager_de_sucursal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Manager no pertenece a esta sucursal",
            )

        return ClaveDevolucionOut(
            sucursal_id=sucursal.id,
            clave_cancelacion=sucursal.clave_cancelacion,
        )
    
    def validar_clave_cancelacion(
        self,
        sucursal_id: int,
        dto: ValidarClaveRequest,
        user: CurrentUser,
        raw_token: str,
    ) -> ValidarClaveResponse:
        if user.role not in ("ADMIN", "MANAGER"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado")

        sucursal = self.repo.get_by_id(sucursal_id)
        if not sucursal or not sucursal.estado:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sucursal no encontrada")

        if user.role == "MANAGER":
            es_manager_de_sucursal = is_manager_of_sucursal(user.user_id, sucursal_id, raw_token)
            if not es_manager_de_sucursal:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Manager no pertenece a esta sucursal",
                )

        valida = dto.clave == sucursal.clave_cancelacion

        return ValidarClaveResponse(
            sucursal_id=sucursal.id,
            valida=valida,
        )
    
    def list_sucursales(self, user: CurrentUser) -> List[SucursalOut]:
        if user.role not in ("ADMIN", "MANAGER", "EMPLOY"):

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No autorizado",
            )

        sucursales = self.repo.list_active()
        return [SucursalOut.from_orm(s) for s in sucursales]