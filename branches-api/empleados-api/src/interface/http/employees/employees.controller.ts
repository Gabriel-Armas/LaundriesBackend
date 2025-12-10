import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateEmpleadoUseCase } from '../../../core/employees/use-cases/create-empleado.usecase';
import { CreateGerenteUseCase } from '../../../core/employees/use-cases/create-gerente.usecase';
import { EditEmpleadoUseCase } from '../../../core/employees/use-cases/edit-empleado.usecase';
import { EditGerenteUseCase } from '../../../core/employees/use-cases/edit-gerente.usecase';
import { GetEmpleadoGeneralUseCase } from '../../../core/employees/use-cases/get-empleado-general.usecase';
import { GetAllEmpleadosUseCase } from '../../../core/employees/use-cases/get-all-empleados.usecase';
import { GetManagersUseCase } from '../../../core/employees/use-cases/get-managers.usecase';

import { CreateEmpleadoDto } from './dtos/create-empleado.dto';
import { EditEmpleadoDto } from './dtos/edit-empleado.dto';

import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

type RequestWithUser = Request & { user: JwtPayload };

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createEmpleado: CreateEmpleadoUseCase,
    private readonly createGerente: CreateGerenteUseCase,
    private readonly editEmpleado: EditEmpleadoUseCase,
    private readonly editGerente: EditGerenteUseCase,
    private readonly getEmpleadoGeneral: GetEmpleadoGeneralUseCase,
    private readonly getAllEmpleadosUseCase: GetAllEmpleadosUseCase,
    private readonly getManagersUseCase: GetManagersUseCase,
  ) {}

  // -----------------------------------------------------
  // GET /employees/managers  ← debe ir ANTES de /:id !!!
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Get('managers')
  async getManagersHandler(@Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.getManagersUseCase.execute(currentUser);
  }

  // -----------------------------------------------------
  // CREATE EMPLOYEE
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post()
  async createEmpleadoHandler(
    @Req() req: RequestWithUser,
    @Body() body: CreateEmpleadoDto,
  ) {
    const currentUser = req.user;

    const empleado = await this.createEmpleado.execute({
      idEmpleado: body.idEmpleado,
      nombre: body.nombre,
      direccion: body.direccion,
      telefono: body.telefono,
      dni: body.dni,
      fechaNacimiento: new Date(body.fechaNacimiento),
      idSucursal: body.idSucursal,
      currentUser,
    });

    return empleado.toJSON();
  }

  // -----------------------------------------------------
  // CREATE MANAGER
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('gerentes')
  async createGerenteHandler(
    @Req() req: RequestWithUser,
    @Body() body: CreateEmpleadoDto,
  ) {
    const currentUser = req.user;

    const empleado = await this.createGerente.execute({
      idEmpleado: body.idEmpleado,
      nombre: body.nombre,
      direccion: body.direccion,
      telefono: body.telefono,
      dni: body.dni,
      fechaNacimiento: new Date(body.fechaNacimiento),
      idSucursal: body.idSucursal,
      currentUser,
    });

    return empleado.toJSON();
  }

  // -----------------------------------------------------
  // EDIT EMPLOYEE
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editEmpleadoHandler(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: EditEmpleadoDto,
  ) {
    const currentUser = req.user;

    const empleado = await this.editEmpleado.execute({
      idEmpleado: id,
      ...body,
      fechaNacimiento: body.fechaNacimiento
        ? new Date(body.fechaNacimiento)
        : undefined,
      idSucursal:
        body.idSucursal !== undefined ? String(body.idSucursal) : undefined,
      currentUser,
    });

    return empleado.toJSON();
  }

  // -----------------------------------------------------
  // EDIT MANAGER
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Put('gerentes/:id')
  async editGerenteHandler(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() body: EditEmpleadoDto,
  ) {
    const currentUser = req.user;

    const empleado = await this.editGerente.execute({
      idEmpleado: id,
      ...body,
      fechaNacimiento: body.fechaNacimiento
        ? new Date(body.fechaNacimiento)
        : undefined,
      idSucursal:
        body.idSucursal !== undefined ? String(body.idSucursal) : undefined,
      currentUser,
    });

    return empleado.toJSON();
  }

  // -----------------------------------------------------
  // GET EMPLOYEE BY ID
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEmpleadoHandler(@Param('id') id: string) {
    return this.getEmpleadoGeneral.execute(id);
  }

  // -----------------------------------------------------
  // GET ALL EMPLOYEES
  // -----------------------------------------------------
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllHandler(@Req() req: RequestWithUser) {
    const currentUser = req.user;
    return this.getAllEmpleadosUseCase.execute(currentUser);
  }
}