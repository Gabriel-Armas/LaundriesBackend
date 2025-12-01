import { Empleado } from '../domain/empleado.entity';
import { EmpleadoRepository } from '../domain/empleado.repository';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';
import { CreateEmpleadoInput } from './create-empleado.usecase';

export class CreateGerenteUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(input: CreateEmpleadoInput) {
    if (input.currentUser.role !== 'ADMIN') {
      throw new Error('Solo ADMIN puede crear gerentes');
    }

    const empleado = new Empleado({
      id: crypto.randomUUID(),
      nombre: input.nombre,
      direccion: input.direccion,
      telefono: input.telefono,
      dni: input.dni,
      fechaNacimiento: input.fechaNacimiento,
      idSucursal: input.idSucursal,
    });

    return this.empleadoRepo.create(empleado);
  }
}