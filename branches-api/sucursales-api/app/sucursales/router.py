from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from typing import List
from app.infrastructure.db import get_db
from app.auth.dependencies import get_current_user, CurrentUser
from app.sucursales.schemas import SucursalCreate, SucursalEdit, SucursalOut, ClaveDevolucionOut, ValidarClaveRequest, ValidarClaveResponse
from app.sucursales.service import SucursalService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/sucursales", tags=["sucursales"])


@router.post("", response_model=SucursalOut)
def create_sucursal(
    dto: SucursalCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    service = SucursalService(db)
    return service.create_sucursal(dto, current_user)


@router.put("/{sucursal_id}", response_model=SucursalOut)
def edit_sucursal(
    sucursal_id: int,
    dto: SucursalEdit,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    service = SucursalService(db)
    return service.edit_sucursal(sucursal_id, dto, current_user)


@router.get("/{sucursal_id}", response_model=SucursalOut)
def get_sucursal(
    sucursal_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    service = SucursalService(db)
    return service.get_sucursal(sucursal_id, current_user)


@router.get("/{sucursal_id}/clave-devolucion", response_model=ClaveDevolucionOut)
def get_clave_devolucion(
    sucursal_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    raw_token: str = Depends(oauth2_scheme),
):
    service = SucursalService(db)
    return service.get_clave_devolucion(sucursal_id, current_user, raw_token)

@router.get("", response_model=List[SucursalOut])
def list_sucursales(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    service = SucursalService(db)
    return service.list_sucursales(current_user)

@router.post("/{sucursal_id}/validar-clave", response_model=ValidarClaveResponse)
def validar_clave_cancelacion(
    sucursal_id: int,
    dto: ValidarClaveRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    raw_token: str = Depends(oauth2_scheme),
):
    service = SucursalService(db)
    return service.validar_clave_cancelacion(sucursal_id, dto, current_user, raw_token)