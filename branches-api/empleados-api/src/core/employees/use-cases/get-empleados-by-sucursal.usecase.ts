import { EmpleadoRepository } from '../domain/empleado.repository';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

export class GetEmpleadosBySucursalUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(currentUser: JwtPayload, sucursalId: string) {
    if (currentUser.role === 'DELETED') {
      throw new Error('Usuario eliminado no puede ver empleados');
    }

    if (currentUser.role === 'ADMIN') {
      const empleados = await this.empleadoRepo.findBySucursal(sucursalId);
      return empleados.map((e) => e.toJSON());
    }

    if (currentUser.role === 'MANAGER' || currentUser.role === 'EMPLOYEE') {
      const empleados = await this.empleadoRepo.findBySucursal(sucursalId);
      return empleados.map((e) => e.toJSON());
    }

    throw new Error('Rol no autorizado para ver empleados de sucursal');
  }
}