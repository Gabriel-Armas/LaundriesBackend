from pydantic import BaseModel, ConfigDict
from typing import Optional

class SucursalBase(BaseModel):
    nombre: str
    direccion: str
    telefono: str

class SucursalCreate(SucursalBase):
    pass

class SucursalEdit(BaseModel):
    nombre: Optional[str] = None
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    borrar: Optional[bool] = False

class SucursalOut(SucursalBase):
    id: int
    estado: bool

    model_config = ConfigDict(from_attributes=True)

class ClaveDevolucionOut(BaseModel):
    sucursal_id: int
    clave_cancelacion: str

    model_config = ConfigDict(from_attributes=True)

class ValidarClaveRequest(BaseModel):
    clave: str

class ValidarClaveResponse(BaseModel):
    sucursal_id: int
    valida: bool