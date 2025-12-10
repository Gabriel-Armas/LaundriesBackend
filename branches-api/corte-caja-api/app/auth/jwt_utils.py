from datetime import datetime
from jose import jwt, JWTError
import os

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def decode_token(token: str) -> dict:
    if not JWT_SECRET:
        raise ValueError("JWT_SECRET no está configurado")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError as e:
        raise ValueError("Token inválido o expirado") from e

    if "userId" not in payload or "role" not in payload:
        raise ValueError("Token inválido: faltan campos userId o role")

    return payload