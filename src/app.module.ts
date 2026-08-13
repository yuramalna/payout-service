import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EmployeesModule } from './employees/employees.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PayoutsModule } from './payouts/payouts.module';

@Module({
  imports: [EmployeesModule, NotificationsModule, PayoutsModule],
  controllers: [AppController],
})
export class AppModule {}
