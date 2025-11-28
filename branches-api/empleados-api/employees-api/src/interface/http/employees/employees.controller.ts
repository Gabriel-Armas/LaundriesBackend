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

import { CreateEmpleadoDto } from './dtos/create-empleado.dto';
import { EditEmpleadoDto } from './dtos/edit-empleado.dto';

import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { JwtPayload } from '../../../infrastructure/auth/jwt-payload.type';

// para tener req tipado con user
type RequestWithUser = Request & { user: JwtPayload };

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createEmpleado: CreateEmpleadoUseCase,
    private readonly createGerente: CreateGerenteUseCase,
    private readonly editEmpleado: EditEmpleadoUseCase,
    private readonly editGerente: EditGerenteUseCase,
    private readonly getEmpleadoGeneral: GetEmpleadoGeneralUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEmpleadoHandler(
    @Req() req: RequestWithUser,
    @Body() body: CreateEmpleadoDto,
  ) {
    const currentUser = req.user;

    const empleado = await this.createEmpleado.execute({
      ...body,
      fechaNacimiento: new Date(body.fechaNacimiento),
      idSucursal: Number(body.idSucursal),
      currentUser,
    });

    return empleado.toJSON();
  }

  @UseGuards(JwtAuthGuard)
  @Post('gerentes')
  async createGerenteHandler(
    @Req() req: RequestWithUser,
    @Body() body: CreateEmpleadoDto,
  ) {
    const currentUser = req.user;

    const empleado = await this.createGerente.execute({
      ...body,
      fechaNacimiento: new Date(body.fechaNacimiento),
      idSucursal: Number(body.idSucursal),
      currentUser,
    });

    return empleado.toJSON();
  }

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
        body.idSucursal !== undefined ? Number(body.idSucursal) : undefined,
      currentUser,
    });

    return empleado.toJSON();
  }

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
        body.idSucursal !== undefined ? Number(body.idSucursal) : undefined,
      currentUser,
    });

    return empleado.toJSON();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEmpleadoHandler(@Param('id') id: string) {
    return this.getEmpleadoGeneral.execute(id);
  }
}