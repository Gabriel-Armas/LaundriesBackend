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
      idSucursal: row.idSucursal,
    });
  }

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------
  async create(empleado: Empleado): Promise<Empleado> {
    const data = await this.prisma.empleado.create({
      data: empleado.toJSON(),
    });
    return this.mapToEntity(data);
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------
  async update(empleado: Empleado): Promise<Empleado> {
    const data = await this.prisma.empleado.update({
      where: { id: empleado.id },
      data: empleado.toJSON(),
    });
    return this.mapToEntity(data);
  }

  // --------------------------------------------------
  // FIND BY ID
  // --------------------------------------------------
  async findById(id: string): Promise<Empleado | null> {
    const data = await this.prisma.empleado.findUnique({ where: { id } });
    return data ? this.mapToEntity(data) : null;
  }

  // --------------------------------------------------
  // GET ALL EMPLEADOS
  // --------------------------------------------------
  async findAll(): Promise<Empleado[]> {
    const rows = await this.prisma.empleado.findMany();
    return rows.map(r => this.mapToEntity(r));
  }

  // --------------------------------------------------
  // GET EMPLEADOS DE UNA SUCURSAL
  // --------------------------------------------------
  async findBySucursal(idSucursal: string): Promise<Empleado[]> {
    const rows = await this.prisma.empleado.findMany({
      where: { idSucursal },
    });
    return rows.map(r => this.mapToEntity(r));
  }

  async findManagers(): Promise<Empleado[]> {
    const rows = await this.prisma.empleado.findMany({
      where: { role: 'MANAGER' },
    });
    return rows.map((r) => this.mapToEntity(r));
  }
}