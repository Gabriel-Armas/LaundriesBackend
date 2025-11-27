export class EditEmpleadoDto {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    dni?: string;
    fechaNacimiento?: string;
    idSucursal?: number;  
    email?: string;
    password?: string;
    role?: 'EMPLEADO' | 'GERENTE' | 'ELIMINADO';
  }