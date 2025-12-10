import logging
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from app.infrastructure.db import get_db
from app.auth.dependencies import get_current_user, CurrentUser
from app.corte_caja.schemas import CorteCajaCreate, CorteCajaOut, CortesPorMes
from app.corte_caja.service import CorteCajaService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
logger = logging.getLogger("corte_caja_api")

router = APIRouter(prefix="/corte-caja", tags=["corte-caja"])


# ------------------------------------------------------------
# CREAR CORTE DE CAJA
# ------------------------------------------------------------
@router.post("", response_model=CorteCajaOut)
def create_corte_caja(
    dto: CorteCajaCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
    raw_token: str = Depends(oauth2_scheme),
):
    logger.info(
        f"[ROUTER] Crear corte — user={current_user.user_id} role={current_user.role} "
        f"sucursal={dto.sucursal_id} fecha_inicio={dto.fecha_inicio} fecha_fin={dto.fecha_fin}"
    )

    service = CorteCajaService(db)
    result = service.create_corte_caja(dto, current_user, raw_token)

    logger.info(f"[ROUTER] Corte creado correctamente — id={result.id}")

    return result


# ------------------------------------------------------------
# OBTENER UN CORTE POR ID
# ------------------------------------------------------------
@router.get("/{corte_id}", response_model=CorteCajaOut)
def get_corte_caja(
    corte_id: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    logger.info(f"[ROUTER] Consultando corte — id={corte_id} user={current_user.user_id}")

    service = CorteCajaService(db)
    result = service.get_corte_caja(corte_id, current_user)

    logger.info(f"[ROUTER] Corte encontrado — id={result.id}")

    return result


# ------------------------------------------------------------
# LISTAR CORTES POR AÑO AGRUPADOS POR MES
# ------------------------------------------------------------
@router.get("/{anio}/por-mes", response_model=List[CortesPorMes])
def get_cortes_por_anio(
    anio: int,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    logger.info(
        f"[ROUTER] Listar cortes por año — anio={anio} user={current_user.user_id} "
        f"role={current_user.role}"
    )

    service = CorteCajaService(db)
    result = service.get_cortes_por_anio(anio, current_user)

    logger.info(f"[ROUTER] Respuesta OK — meses_encontrados={len(result)}")

    return result