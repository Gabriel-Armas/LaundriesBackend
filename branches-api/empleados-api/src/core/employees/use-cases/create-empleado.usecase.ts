import { Empleado } from '../domain/empleado.entity';
import { EmpleadoRepository } from '../domain/empleado.repository';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

export interface CreateEmpleadoInput {
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: Date;
  idSucursal: number;
  currentUser: JwtPayload;
}

export class CreateEmpleadoUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(input: CreateEmpleadoInput) {
    if (input.currentUser.role !== 'MANAGER') {
      throw new Error('Solo MANAGER puede crear empleados');
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