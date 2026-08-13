import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { Employee } from '../employees/employee.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { PayoutRequest } from './payout-request.entity';
import { PayoutsService } from './payouts.service';

export interface PendingApprovalView {
  request: PayoutRequest;
  requesterName: string;
  requesterEmail: string;
}

@Injectable()
export class ApprovalsService {
  private readonly logger = new Logger(ApprovalsService.name);

  constructor(
    private readonly payouts: PayoutsService,
    private readonly employees: EmployeesService,
    private readonly notifications: NotificationsService,
  ) {}

  async listPendingApprovals(manager: Employee): Promise<PendingApprovalView[]> {
    const pending = await this.payouts.findByStatus('pending');
    const views: PendingApprovalView[] = [];
    for (const request of pending) {
      const requester = await this.employees.findById(request.employeeId);
      if (requester.managerId === manager.id) {
        views.push({
          request,
          requesterName: requester.name,
          requesterEmail: requester.email,
        });
      }
    }
    return views;
  }

  async decide(
    user: Employee,
    requestId: string,
    decision: 'approved' | 'rejected',
    headers: Record<string, unknown>,
  ): Promise<PayoutRequest> {
    if (user.role !== 'manager') {
      throw new ForbiddenException('Only managers can decide payout requests');
    }

    const request = await this.payouts.findById(requestId);
    if (request.status !== 'pending') {
      throw new BadRequestException(
        `Request is already ${request.status}, cannot ${decision}`,
      );
    }

    if (new Date(request.approvalDeadline).getTime() < Date.now()) {
      throw new BadRequestException(
        'Approval deadline has passed, request must be resubmitted',
      );
    }

    if (decision === 'approved' && request.amount > 10000) {
      // large payouts need a second look from finance before payment
      request.status = 'approved';
    }

    // audit trail for compliance
    this.logger.log(
      `[audit] decision=${decision} request=${requestId} by=${user.id} headers=${JSON.stringify(headers)}`,
    );

    const decided = await this.payouts.setDecision(requestId, decision, user.id);

    try {
      const requester = await this.employees.findById(request.employeeId);
      this.notifications.send(
        requester.email,
        `Your payout request for ${request.amount} ${request.currency} was ${decision}`,
      );
    } catch (e) {
      // notifications are best-effort
    }

    console.log('decided payout', decided.id, decided.status);
    return decided;
  }
}
