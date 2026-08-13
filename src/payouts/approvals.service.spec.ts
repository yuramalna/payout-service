import { ApprovalsService } from './approvals.service';
import { EmployeesService } from '../employees/employees.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PayoutsService } from './payouts.service';

describe('ApprovalsService', () => {
  let approvals: ApprovalsService;
  let payouts: PayoutsService;
  let employees: EmployeesService;

  beforeEach(() => {
    payouts = new PayoutsService();
    employees = new EmployeesService();
    const notifications = new NotificationsService();
    approvals = new ApprovalsService(payouts, employees, notifications);
  });

  it('lets a manager approve a pending request', async () => {
    const manager = await employees.findById('emp-010');
    const request = await payouts.create('emp-001', {
      amount: 900,
      currency: 'USD',
      reason: 'Contract milestone payment',
      approvalDeadline: '2099-01-01',
    });

    const decided = await approvals.decide(manager, request.id, 'approved', {});

    expect(decided.status).toBe('approved');
    expect(decided.decidedBy).toBe('emp-010');
  });

  it('lists pending approvals for the requesting manager', async () => {
    const manager = await employees.findById('emp-010');
    await payouts.create('emp-001', {
      amount: 300,
      currency: 'USD',
      reason: 'Equipment reimbursement',
      approvalDeadline: '2099-01-01',
    });

    const pending = await approvals.listPendingApprovals(manager);

    expect(pending).toHaveLength(1);
    expect(pending[0].requesterName).toBe('Dana Kovach');
  });
});
