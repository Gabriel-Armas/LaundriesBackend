import { EmpleadoRepository } from '../domain/empleado.repository';
import { EditEmpleadoInput } from './edit-empleado.usecase';

export class EditGerenteUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(input: EditEmpleadoInput) {
    if (input.currentUser.role !== 'ADMIN') {
      throw new Error('Solo ADMIN puede editar gerentes');
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