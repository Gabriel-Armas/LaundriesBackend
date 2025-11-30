import { Module } from '@nestjs/common';
import { EmployeesModule } from './interface/http/employees/employees.module';

@Module({
  imports: [EmployeesModule],
})
export class AppModule {}