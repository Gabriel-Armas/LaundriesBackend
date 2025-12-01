import { EmpleadoRepository } from '../domain/empleado.repository';
import { EmpleadoBaseInput } from './dtos';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

export interface EditEmpleadoInput extends EmpleadoBaseInput {
  idEmpleado: string;
  currentUser: JwtPayload;
}

export class EditEmpleadoUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(input: EditEmpleadoInput) {
    if (input.currentUser.role !== 'MANAGER' && input.currentUser.role !== 'ADMIN') {
      throw new Error('No tienes permisos para editar empleados');
    }

    const empleado = await this.empleadoRepo.findById(input.idEmpleado);
    if (!empleado) throw new Error('Empleado no encontrado');

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