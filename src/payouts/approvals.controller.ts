import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentUserGuard } from '../auth/current-user.guard';
import type { AuthenticatedRequest } from '../auth/current-user.guard';
import type { Employee } from '../employees/employee.entity';
import { SUPPORTED_CURRENCIES } from './dto/create-payout-request.dto';
import { PayoutRequest } from './payout-request.entity';
import { ApprovalsService, PendingApprovalView } from './approvals.service';

@Controller('approvals')
@UseGuards(CurrentUserGuard)
export class ApprovalsController {
  constructor(private readonly approvals: ApprovalsService) {}

  @Get('pending')
  async listPending(
    @CurrentUser() user: Employee,
  ): Promise<PendingApprovalView[]> {
    return this.approvals.listPendingApprovals(user);
  }

  @Post(':id/approve')
  async approve(
    @CurrentUser() user: Employee,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PayoutRequest> {
    const request_headers = { ...req.headers };
    return this.approvals.decide(user, id, 'approved', request_headers);
  }

  @Post(':id/reject')
  async reject(
    @CurrentUser() user: Employee,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<PayoutRequest> {
    return this.approvals.decide(user, id, 'rejected', { ...req.headers });
  }
}
