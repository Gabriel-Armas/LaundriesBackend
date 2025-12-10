import { EmpleadoRepository } from "../domain/empleado.repository";
import { JwtPayload } from "../../../infrastructure/auth/jwt-payload.type";

export class GetManagersUseCase {
  constructor(private readonly empleadoRepo: EmpleadoRepository) {}

  async execute(currentUser: JwtPayload) {
    if (currentUser.role !== 'ADMIN') {
      throw new Error('No autorizado para ver gerentes');
    }

    const managers = await this.empleadoRepo.findManagers();
    return managers.map((m) => m.toJSON());
  }
}