import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateEmpleadoUseCase } from '../../../core/employees/use-cases/create-empleado.usecase';
import { CreateGerenteUseCase } from '../../../core/employees/use-cases/create-gerente.usecase';
import { EditEmpleadoUseCase } from '../../../core/employees/use-cases/edit-empleado.usecase';
import { EditGerenteUseCase } from '../../../core/employees/use-cases/edit-gerente.usecase';
import { GetEmpleadoGeneralUseCase } from '../../../core/employees/use-cases/get-empleado-general.usecase';
import { CreateEmpleadoDto } from './dtos/create-empleado.dto';
import { EditEmpleadoDto } from './dtos/edit-empleado.dto';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly createEmpleado: CreateEmpleadoUseCase,
    private readonly createGerente: CreateGerenteUseCase,
    private readonly editEmpleado: EditEmpleadoUseCase,
    private readonly editGerente: EditGerenteUseCase,
    private readonly getEmpleadoGeneral: GetEmpleadoGeneralUseCase,
  ) {}

  @Post()
  async createEmpleadoHandler(@Body() body: CreateEmpleadoDto) {
    const empleado = await this.createEmpleado.execute({
      ...body,
      fechaNacimiento: new Date(body.fechaNacimiento),
      idSucursal: Number(body.idSucursal),
    });
    return empleado.toJSON();
  }

  @Post('gerentes')
  async createGerenteHandler(@Body() body: CreateEmpleadoDto) {
    const empleado = await this.createGerente.execute({
      ...body,
      fechaNacimiento: new Date(body.fechaNacimiento),
      idSucursal: Number(body.idSucursal),
    });
    return empleado.toJSON();
  }

  @Put(':id')
  async editEmpleadoHandler(
    @Param('id') id: string,
    @Body() body: EditEmpleadoDto,
  ) {
    const empleado = await this.editEmpleado.execute({
      idEmpleado: id,
      ...body,
      fechaNacimiento: body.fechaNacimiento
        ? new Date(body.fechaNacimiento)
        : undefined,
      idSucursal:
        body.idSucursal !== undefined
          ? Number(body.idSucursal)
          : undefined,
    });
    return empleado.toJSON();
  }

  @Put('gerentes/:id')
  async editGerenteHandler(
    @Param('id') id: string,
    @Body() body: EditEmpleadoDto,
  ) {
    const empleado = await this.editGerente.execute({
      idEmpleado: id,
      ...body,
      fechaNacimiento: body.fechaNacimiento
        ? new Date(body.fechaNacimiento)
        : undefined,
      idSucursal:
        body.idSucursal !== undefined
          ? Number(body.idSucursal)
          : undefined,
    });
    return empleado.toJSON();
  }

  @Get(':id')
  async getEmpleadoHandler(@Param('id') id: string) {
    return this.getEmpleadoGeneral.execute(id);
  }
}