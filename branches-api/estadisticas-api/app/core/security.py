from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
import jwt
from core.config import settings
from core.logger import get_logger

logger = get_logger("SECURITY")

security = HTTPBearer()

def get_current_user(token: str = Depends(security)):
    try:
        decoded = jwt.decode(token.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        logger.info(f"Token válido: user={decoded.get('sub')} role={decoded.get('role')}")
        return decoded
    except Exception as e:
        logger.error(f"Token inválido → {e}")
        raise HTTPException(401, "Token inválido")


def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "ADMIN":
        logger.warning(f"Acceso denegado para user={current_user.get('sub')} role={current_user.get('role')}")
        raise HTTPException(403, "Solo ADMIN puede acceder a esta operación")
    return current_user

def require_manageradmin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "MANAGER" or current_user.get("role") != "MANAGER":
        logger.warning(f"Acceso denegado para user={current_user.get('sub')} role={current_user.get('role')}")
        raise HTTPException(403, "Solo ADMIN puede acceder a esta operación")
    return current_user