from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.db import get_db
from app.auth.dependencies import get_current_user, CurrentUser
from app.corte_caja.schemas import CorteCajaCreate, CorteCajaOut, CortesPorMes
from app.corte_caja.service import CorteCajaService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(prefix="/cortes-caja", tags=["cortes-caja"])


@router.post("", response_model=CorteCajaOut)
def create_corte_caja(
    dto: CorteCajaCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    raw_token: str = Depends(oauth2_scheme),
):
    service = CorteCajaService(db)
    return service.create_corte_caja(dto, current_user, raw_token)


@router.get("/{corte_id}", response_model=CorteCajaOut)
def get_corte_caja(
    corte_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    service = CorteCajaService(db)
    return service.get_corte_caja(corte_id, current_user)


@router.get("/{anio}/por-mes", response_model=List[CortesPorMes])
def get_cortes_por_anio(
    anio: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    service = CorteCajaService(db)
    return service.get_cortes_por_anio(anio, current_user)