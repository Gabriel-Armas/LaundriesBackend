import { Empleado } from '../domain/empleado.entity';
import { EmpleadoRepository } from '../domain/empleado.repository';
import { AuthPort } from '../domain/auth.port';
import { CreateEmpleadoInput } from './create-empleado.usecase';

export class CreateGerenteUseCase {
  constructor(
    private readonly empleadoRepo: EmpleadoRepository,
    private readonly authPort: AuthPort,
  ) {}

  async execute(input: CreateEmpleadoInput): Promise<Empleado> {
    if (input.currentUser.role !== 'ADMIN') {
      throw new Error('Solo ADMIN puede crear gerentes');
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