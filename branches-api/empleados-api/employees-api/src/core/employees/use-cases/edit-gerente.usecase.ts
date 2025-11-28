import { EmpleadoRepository } from '../domain/empleado.repository';
import { AuthPort } from '../domain/auth.port';
import { EditEmpleadoInput } from './edit-empleado.usecase';

export class EditGerenteUseCase {
  constructor(
    private readonly empleadoRepo: EmpleadoRepository,
    private readonly authPort: AuthPort,
  ) {}

  async execute(input: EditEmpleadoInput) {
    if (input.currentUser.role !== 'ADMIN') {
      throw new Error('Solo ADMIN puede editar gerentes');
    }

    const user = await this.authPort.getUserById(input.idEmpleado);
    if (!user || user.role !== 'MANAGER') {
      throw new Error('Solo se pueden editar gerentes (MANAGER) en esta ruta');
    }

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