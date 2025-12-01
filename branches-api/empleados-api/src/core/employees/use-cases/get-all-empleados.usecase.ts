import { EmpleadoRepository } from '../domain/empleado.repository';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

export class GetAllEmpleadosUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(currentUser: JwtPayload) {
    if (currentUser.role === 'DELETED') {
      throw new Error('Usuario eliminado no puede ver empleados');
    }

    if (currentUser.role === 'ADMIN') {
      const empleados = await this.empleadoRepo.findAll();
      return empleados.map((e) => e.toJSON());
    }

    if (currentUser.role === 'MANAGER') {
      const gerente = await this.empleadoRepo.findById(currentUser.userId);
      if (!gerente) {
        throw new Error('No se encontró el empleado asociado al usuario actual');
      }

      const empleados = await this.empleadoRepo.findBySucursal(gerente.idSucursal);
      return empleados.map((e) => e.toJSON());
    }

    throw new Error('Rol no autorizado');
  }
}