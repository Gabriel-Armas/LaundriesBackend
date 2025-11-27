import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmpleadoRepository } from '../../core/employees/domain/empleado.repository';
import { Empleado } from '../../core/employees/domain/empleado.entity';

@Injectable()
export class EmpleadoPrismaRepository implements EmpleadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToEntity(row: any): Empleado {
    return new Empleado({
      id: row.id,
      nombre: row.nombre,
      direccion: row.direccion,
      telefono: row.telefono,
      dni: row.dni,
      fechaNacimiento: row.fechaNacimiento,
      idSucursal: row.idSucursal, // INT
    });
  }

  async create(empleado: Empleado): Promise<Empleado> {
    const data = await this.prisma.empleado.create({
      data: empleado.toJSON(),
    });
    return this.mapToEntity(data);
  }

  async update(empleado: Empleado): Promise<Empleado> {
    const data = await this.prisma.empleado.update({
      where: { id: empleado.id },
      data: empleado.toJSON(),
    });
    return this.mapToEntity(data);
  }

  async findById(id: string): Promise<Empleado | null> {
    const data = await this.prisma.empleado.findUnique({ where: { id } });
    return data ? this.mapToEntity(data) : null;
  }
}