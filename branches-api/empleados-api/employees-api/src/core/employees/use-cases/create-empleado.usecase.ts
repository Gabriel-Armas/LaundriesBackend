import { Empleado } from '../domain/empleado.entity';
import { EmpleadoRepository } from '../domain/empleado.repository';
import { AuthPort } from '../domain/auth.port';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

export interface CreateEmpleadoInput {
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: Date;
  idSucursal: number;
  email: string;
  password: string;
  currentUser: JwtPayload;
}

export class CreateEmpleadoUseCase {
  constructor(
    private readonly empleadoRepo: EmpleadoRepository,
    private readonly authPort: AuthPort,
  ) {}

  async execute(input: CreateEmpleadoInput): Promise<Empleado> {
    if (input.currentUser.role !== 'MANAGER') {
      throw new Error('Solo MANAGER puede crear empleados');
    }

    const authUser = await this.authPort.createUser({
      email: input.email,
      password: input.password,
      role: 'MANAGER',
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