// src/interface/http/employees/employees.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EmployeesController } from './employees.controller';

import { PrismaService } from '../../../infrastructure/persistence/prisma.service';
import { EmpleadoPrismaRepository } from '../../../infrastructure/persistence/empleado.prisma.repository';

import { CreateEmpleadoUseCase } from '../../../core/employees/use-cases/create-empleado.usecase';
import { CreateGerenteUseCase } from '../../../core/employees/use-cases/create-gerente.usecase';
import { EditEmpleadoUseCase } from '../../../core/employees/use-cases/edit-empleado.usecase';
import { EditGerenteUseCase } from '../../../core/employees/use-cases/edit-gerente.usecase';
import { GetEmpleadoGeneralUseCase } from '../../../core/employees/use-cases/get-empleado-general.usecase';
import { GetAllEmpleadosUseCase } from '../../../core/employees/use-cases/get-all-empleados.usecase';
import { GetManagersUseCase } from '../../../core/employees/use-cases/get-managers.usecase';

import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { algorithm: 'HS256' },
    }),
  ],
  controllers: [EmployeesController],
  providers: [
    PrismaService,
    EmpleadoPrismaRepository,
    JwtAuthGuard,

    {
      provide: CreateEmpleadoUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new CreateEmpleadoUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
    {
      provide: CreateGerenteUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new CreateGerenteUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
    {
      provide: EditEmpleadoUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new EditEmpleadoUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
    {
      provide: EditGerenteUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new EditGerenteUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
    {
      provide: GetEmpleadoGeneralUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new GetEmpleadoGeneralUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
    {
      provide: GetAllEmpleadosUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new GetAllEmpleadosUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
    {
      provide: GetManagersUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new GetManagersUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
  ],
})
export class EmployeesModule {}