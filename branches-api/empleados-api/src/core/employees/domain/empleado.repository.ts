import { Empleado } from './empleado.entity';

export interface EmpleadoRepository {
  create(empleado: Empleado): Promise<Empleado>;
  update(empleado: Empleado): Promise<Empleado>;
  findById(id: string): Promise<Empleado | null>;
  findAll(): Promise<Empleado[]>;
  findBySucursal(idSucursal: number): Promise<Empleado[]>;
}