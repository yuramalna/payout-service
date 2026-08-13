import { NotFoundException } from '@nestjs/common';
import { PayoutsService } from './payouts.service';

describe('PayoutsService', () => {
  let service: PayoutsService;

  beforeEach(() => {
    service = new PayoutsService();
  });

  it('creates a pending payout request for the employee', async () => {
    const request = await service.create('emp-001', {
      amount: 1200,
      currency: 'USD',
      reason: 'Contract milestone payment',
      approvalDeadline: '2026-09-01',
    });

    expect(request.status).toBe('pending');
    expect(request.employeeId).toBe('emp-001');
    expect(request.decidedBy).toBeNull();
  });

  it('records an approval decision', async () => {
    const request = await service.create('emp-001', {
      amount: 500,
      currency: 'EUR',
      reason: 'Expense reimbursement',
      approvalDeadline: '2026-09-01',
    });

    const decided = await service.setDecision(
      request.id,
      'approved',
      'emp-010',
    );

    expect(decided.status).toBe('approved');
    expect(decided.decidedBy).toBe('emp-010');
    expect(decided.decidedAt).not.toBeNull();
  });

  it('throws for an unknown request id', async () => {
    await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
  });
});
