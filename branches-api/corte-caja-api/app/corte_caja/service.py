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


class CorteCajaService:
    def __init__(self, db: Session):
        self.repo = CorteCajaRepository(db)

    def create_corte_caja(
        self,
        dto: CorteCajaCreate,
        user: CurrentUser,
        raw_token: str,
    ) -> CorteCajaOut:
        # Reglas de rol: sólo EMPLOY puede crear
        if user.role != "EMPLOY":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Sólo EMPLOY puede crear cortes de caja",
            )

        if dto.fecha_fin < dto.fecha_inicio:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="fecha_fin no puede ser menor que fecha_inicio",
            )

        # Validamos que sea un corte de un solo día (si así lo quieres)
        dia_inicio: date = dto.fecha_inicio.date()
        dia_fin: date = dto.fecha_fin.date()

        if dia_inicio != dia_fin:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El corte de caja debe ser de un solo día",
            )

        dia_corte: date = dia_inicio

        # Llamar a órdenes-api para obtener las ventas del día
        try:
            total_ventas = get_total_ventas_por_fecha(
                sucursal_id=str(dto.sucursal_id),
                fecha=dia_corte,
                token=raw_token,
            )
        except VentasPorFechaError as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=str(e),
            )

        # De momento no tenemos devoluciones en otra API: lo dejamos en 0.00
        total_devoluciones = Decimal("0.00")

        dinero_teorico = dto.dinero_inicial + total_ventas - total_devoluciones
        diferencia = dto.monto_reportado_por_empleado - dinero_teorico

        corte = self.repo.create(
            data=dto,
            empleado_id=user.user_id,
            total_ventas=total_ventas,
            total_devoluciones=total_devoluciones,
            diferencia=diferencia,
        )

        return CorteCajaOut.from_orm(corte)

    def get_corte_caja(self, corte_id: int, user: CurrentUser) -> CorteCajaOut:
        # EMPLOY, MANAGER, ADMIN
        if user.role not in ("EMPLOY", "MANAGER", "ADMIN"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No autorizado",
            )

        corte = self.repo.get_by_id(corte_id)
        if not corte:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Corte de caja no encontrado",
            )

        return CorteCajaOut.from_orm(corte)

    def get_cortes_por_anio(
        self, anio: int, user: CurrentUser
    ) -> List[CortesPorMes]:
        # Sólo MANAGER y ADMIN
        if user.role not in ("MANAGER", "ADMIN"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No autorizado",
            )

        cortes = self.repo.list_by_year(anio)
        # Agrupar por mes
        por_mes: Dict[int, List[CorteCajaModel]] = {}
        for c in cortes:
            mes = c.fecha_inicio.month
            por_mes.setdefault(mes, []).append(c)

        resultado: List[CortesPorMes] = []
        for mes, cortes_mes in sorted(por_mes.items(), key=lambda x: x[0]):
            resultado.append(
                CortesPorMes(
                    mes=mes,
                    cortes=[CorteCajaOut.from_orm(c) for c in cortes_mes],
                )
            )

        return resultado