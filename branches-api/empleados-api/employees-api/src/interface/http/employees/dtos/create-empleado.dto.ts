export class CreateEmpleadoDto {
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string; // ISO string
  idSucursal: number;      
  email: string;
  password: string;
}