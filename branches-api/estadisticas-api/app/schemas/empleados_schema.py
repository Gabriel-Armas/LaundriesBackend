from pydantic import BaseModel

class Empleado(BaseModel):
    id: str
    nombre: str
    idSucursal: str