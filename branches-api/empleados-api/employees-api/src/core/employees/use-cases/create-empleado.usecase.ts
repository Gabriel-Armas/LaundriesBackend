import { Empleado } from '../domain/empleado.entity';
import { EmpleadoRepository } from '../domain/empleado.repository';
import { AuthPort } from '../domain/auth.port';

export interface CreateEmpleadoInput {
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: Date;
  idSucursal: number;   
  email: string;
  password: string;
}

export class CreateEmpleadoUseCase {
  constructor(
    private readonly empleadoRepo: EmpleadoRepository,
    private readonly authPort: AuthPort,
  ) {}

  async execute(input: CreateEmpleadoInput): Promise<Empleado> {
    const authUser = await this.authPort.createUser({
      email: input.email,
      password: input.password,
      role: 'EMPLEADO',
    });

    const empleado = new Empleado({
      id: authUser.id,
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