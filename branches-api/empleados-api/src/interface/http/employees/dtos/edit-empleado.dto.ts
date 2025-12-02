export class EditEmpleadoDto {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    dni?: string;
    fechaNacimiento?: string;
    idSucursal?: string;
    email?: string;
    password?: string;
    role?: 'ADMIN' | 'MANAGER' | 'DELETED';
  }