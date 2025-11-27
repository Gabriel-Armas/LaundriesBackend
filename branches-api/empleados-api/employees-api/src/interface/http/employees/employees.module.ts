import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmployeesController } from './employees.controller';

import { PrismaService } from '../../../infrastructure/persistence/prisma.service';
import { EmpleadoPrismaRepository } from '../../../infrastructure/persistence/empleado.prisma.repository';
import { AuthHttpAdapter } from '../../../infrastructure/http/auth-http.adapter';

import { CreateEmpleadoUseCase } from '../../../core/employees/use-cases/create-empleado.usecase';
import { CreateGerenteUseCase } from '../../../core/employees/use-cases/create-gerente.usecase';
import { EditEmpleadoUseCase } from '../../../core/employees/use-cases/edit-empleado.usecase';
import { EditGerenteUseCase } from '../../../core/employees/use-cases/edit-gerente.usecase';
import { GetEmpleadoGeneralUseCase } from '../../../core/employees/use-cases/get-empleado-general.usecase';

@Module({
  imports: [HttpModule],
  controllers: [EmployeesController],
  providers: [
    PrismaService,
    EmpleadoPrismaRepository,
    AuthHttpAdapter,

    {
      provide: CreateEmpleadoUseCase,
      useFactory: (repo: EmpleadoPrismaRepository, auth: AuthHttpAdapter) =>
        new CreateEmpleadoUseCase(repo, auth),
      inject: [EmpleadoPrismaRepository, AuthHttpAdapter],
    },
    {
      provide: CreateGerenteUseCase,
      useFactory: (repo: EmpleadoPrismaRepository, auth: AuthHttpAdapter) =>
        new CreateGerenteUseCase(repo, auth),
      inject: [EmpleadoPrismaRepository, AuthHttpAdapter],
    },
    {
      provide: EditEmpleadoUseCase,
      useFactory: (repo: EmpleadoPrismaRepository, auth: AuthHttpAdapter) =>
        new EditEmpleadoUseCase(repo, auth),
      inject: [EmpleadoPrismaRepository, AuthHttpAdapter],
    },
    {
      provide: EditGerenteUseCase,
      useFactory: (repo: EmpleadoPrismaRepository, auth: AuthHttpAdapter) =>
        new EditGerenteUseCase(repo, auth),
      inject: [EmpleadoPrismaRepository, AuthHttpAdapter],
    },
    {
      provide: GetEmpleadoGeneralUseCase,
      useFactory: (repo: EmpleadoPrismaRepository) =>
        new GetEmpleadoGeneralUseCase(repo),
      inject: [EmpleadoPrismaRepository],
    },
  ],
})
export class EmployeesModule {}