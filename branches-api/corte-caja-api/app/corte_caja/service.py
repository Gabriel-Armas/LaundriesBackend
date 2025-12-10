import logging
from datetime import date
from decimal import Decimal
from typing import List, Dict

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import CurrentUser
from app.infrastructure.ordenes_client import (
    get_total_ventas_por_fecha,
    VentasPorFechaError,
)
from app.corte_caja.repository import CorteCajaRepository
from app.corte_caja.schemas import (
    CorteCajaCreate,
    CorteCajaOut,
    CortesPorMes,
)
from app.corte_caja.models import CorteCajaModel

logger = logging.getLogger("corte_caja_service")


class CorteCajaService:
    def __init__(self, db: Session):
        self.repo = CorteCajaRepository(db)

    def create_corte_caja(
        self,
        dto: CorteCajaCreate,
        user: CurrentUser,
        raw_token: str,
    ) -> CorteCajaOut:
        logger.info(
            f"[SERVICE] Crear corte | user_id={user.user_id} role={user.role} "
            f"sucursal_id={dto.sucursal_id} fecha_inicio={dto.fecha_inicio} fecha_fin={dto.fecha_fin} "
            f"dinero_inicial={dto.dinero_inicial} monto_reportado={dto.monto_reportado_por_empleado}"
        )

        if user.role != "EMPLOYEE":
            logger.warning(
                f"[SERVICE] Crear corte denegado por rol | user_id={user.user_id} role={user.role}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sólo EMPLOYEE puede crear cortes de caja",
            )

        if dto.fecha_fin < dto.fecha_inicio:
            logger.warning(
                f"[SERVICE] Rango inválido de fechas | fecha_inicio={dto.fecha_inicio} "
                f"fecha_fin={dto.fecha_fin}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="fecha_fin no puede ser menor que fecha_inicio",
            )

        dia_inicio: date = dto.fecha_inicio.date()
        dia_fin: date = dto.fecha_fin.date()

        if dia_inicio != dia_fin:
            logger.warning(
                f"[SERVICE] Corte de más de un día no permitido | dia_inicio={dia_inicio} dia_fin={dia_fin}"
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El corte de caja debe ser de un solo día",
            )

        dia_corte: date = dia_inicio

        logger.info(
            f"[SERVICE] Consultando ventas del día en órdenes-api | "
            f"sucursal_id={dto.sucursal_id} fecha={dia_corte}"
        )
        try:
            total_ventas = get_total_ventas_por_fecha(
                sucursal_id=str(dto.sucursal_id),
                fecha=dia_corte,
                token=raw_token,
            )
        except VentasPorFechaError as e:
            logger.error(
                f"[SERVICE] Error consultando ventas por fecha en órdenes-api | "
                f"sucursal_id={dto.sucursal_id} fecha={dia_corte} error={e}"
            )
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=str(e),
            )

        logger.info(
            f"[SERVICE] Ventas obtenidas | sucursal_id={dto.sucursal_id} fecha={dia_corte} "
            f"total_ventas={total_ventas}"
        )

        total_devoluciones = Decimal("0.00")

        dinero_teorico = dto.dinero_inicial + total_ventas - total_devoluciones
        diferencia = dto.monto_reportado_por_empleado - dinero_teorico

        logger.info(
            f"[SERVICE] Calculando diferencias | dinero_inicial={dto.dinero_inicial} "
            f"total_ventas={total_ventas} total_devoluciones={total_devoluciones} "
            f"dinero_teorico={dinero_teorico} monto_reportado={dto.monto_reportado_por_empleado} "
            f"diferencia={diferencia}"
        )

        corte = self.repo.create(
            data=dto,
            empleado_id=user.user_id,
            total_ventas=total_ventas,
            total_devoluciones=total_devoluciones,
            diferencia=diferencia,
        )

        logger.info(
            f"[SERVICE] Corte de caja creado en DB | corte_id={corte.id} "
            f"sucursal_id={corte.sucursal_id} empleado_id={corte.empleado_id}"
        )

        return CorteCajaOut.from_orm(corte)

    def get_corte_caja(self, corte_id: int, user: CurrentUser) -> CorteCajaOut:
        logger.info(
            f"[SERVICE] Obtener corte | corte_id={corte_id} user_id={user.user_id} role={user.role}"
        )

        if user.role not in ("EMPLOYEE", "MANAGER", "ADMIN"):
            logger.warning(
                f"[SERVICE] Acceso denegado al obtener corte | corte_id={corte_id} role={user.role}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No autorizado",
            )

        corte = self.repo.get_by_id(corte_id)
        if not corte:
            logger.warning(
                f"[SERVICE] Corte no encontrado | corte_id={corte_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Corte de caja no encontrado",
            )

        logger.info(
            f"[SERVICE] Corte encontrado | corte_id={corte.id} sucursal_id={corte.sucursal_id}"
        )

        return CorteCajaOut.from_orm(corte)

    def get_cortes_por_anio(
        self, anio: int, user: CurrentUser
    ) -> List[CortesPorMes]:
        logger.info(
            f"[SERVICE] Listar cortes por año | anio={anio} user_id={user.user_id} role={user.role}"
        )

        if user.role not in ("MANAGER", "ADMIN"):
            logger.warning(
                f"[SERVICE] Acceso denegado a cortes por año | anio={anio} role={user.role}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No autorizado",
            )

        cortes = self.repo.list_by_year(anio)
        logger.info(
            f"[SERVICE] Cortes obtenidos desde DB | anio={anio} total_cortes={len(cortes)}"
        )

        por_mes: Dict[int, List[CorteCajaModel]] = {}
        for c in cortes:
            mes = c.fecha_inicio.month
            por_mes.setdefault(mes, []).append(c)

        resultado: List[CortesPorMes] = []
        for mes, cortes_mes in sorted(por_mes.items(), key=lambda x: x[0]):
            logger.info(
                f"[SERVICE] Mes agrupado | anio={anio} mes={mes} cortes_mes={len(cortes_mes)}"
            )
            resultado.append(
                CortesPorMes(
                    mes=mes,
                    cortes=[CorteCajaOut.from_orm(c) for c in cortes_mes],
                )
            )

        logger.info(
            f"[SERVICE] Resumen cortes por año listo | anio={anio} meses={len(resultado)}"
        )

        return resultado