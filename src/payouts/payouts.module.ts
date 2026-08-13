import { Module } from '@nestjs/common';
import { EmployeesModule } from '../employees/employees.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';
import { PayoutsController } from './payouts.controller';
import { PayoutsService } from './payouts.service';

@Module({
  imports: [EmployeesModule, NotificationsModule],
  controllers: [PayoutsController, ApprovalsController],
  providers: [PayoutsService, ApprovalsService],
  exports: [PayoutsService],
})
export class PayoutsModule {}
