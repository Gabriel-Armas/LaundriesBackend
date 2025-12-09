from pydantic import BaseModel

class Sucursal(BaseModel):
    id: str
    nombre: str