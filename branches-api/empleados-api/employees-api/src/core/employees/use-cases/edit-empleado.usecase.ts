import { EmpleadoRepository } from '../domain/empleado.repository';
import { AuthPort, AuthRole } from '../domain/auth.port';
import { EmpleadoBaseInput } from './dtos';

export interface EditEmpleadoInput extends EmpleadoBaseInput {
  idEmpleado: string;
  email?: string;
  password?: string;
  role?: AuthRole;
}

export class EditEmpleadoUseCase {
  constructor(
    private readonly empleadoRepo: EmpleadoRepository,
    private readonly authPort: AuthPort,
  ) {}

  async execute(input: EditEmpleadoInput) {
    const empleado = await this.empleadoRepo.findById(input.idEmpleado);
    if (!empleado) throw new Error('Empleado no encontrado');

    if (input.email || input.password || input.role) {
      await this.authPort.updateUser({
        id: input.idEmpleado,
        email: input.email,
        password: input.password,
        role: input.role,
      });
    }

    empleado.actualizarDatos({
      nombre: input.nombre,
      direccion: input.direccion,
      telefono: input.telefono,
      dni: input.dni,
      fechaNacimiento: input.fechaNacimiento,
      idSucursal: input.idSucursal,
    });

    return this.empleadoRepo.update(empleado);
  }
}