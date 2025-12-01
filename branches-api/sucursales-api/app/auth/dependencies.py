from typing import Literal, Optional
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.auth.jwt_utils import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

Role = Literal["ADMIN", "MANAGER", "EMPLOY", "DELETED"]


class CurrentUser:
    def __init__(self, user_id: UUID, role: Role, email: Optional[str] = None):
        self.user_id = user_id
        self.role = role
        self.email = email


def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    try:
        payload = decode_token(token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )

    user_id_str = payload.get("userId")
    role = payload.get("role")
    email = payload.get("email")

    if user_id_str is None or role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido (faltan campos userId o role)",
        )

    if role == "DELETED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario eliminado",
        )

    try:
        user_id = UUID(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido (userId no es UUID)",
        )

    return CurrentUser(user_id=user_id, role=role, email=email)