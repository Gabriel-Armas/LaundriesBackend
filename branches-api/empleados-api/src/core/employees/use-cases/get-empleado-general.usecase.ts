import { EmpleadoRepository } from '../domain/empleado.repository';

export class GetEmpleadoGeneralUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(idEmpleado: string) {
    const empleado = await this.empleadoRepo.findById(idEmpleado);
    if (!empleado) throw new Error('Empleado no encontrado');

    const data = empleado.toJSON();
    return {
      idEmpleado: data.id,
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      dni: data.dni,
      fechaNacimiento: data.fechaNacimiento,
      idSucursal: data.idSucursal,
    };
  }
}