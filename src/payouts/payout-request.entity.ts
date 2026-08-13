export type PayoutStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface PayoutRequest {
  id: string;
  employeeId: string;
  amount: number;
  currency: string;
  reason: string;
  status: PayoutStatus;
  /** ISO 8601 date by which the payout must be approved to make the pay run. */
  approvalDeadline: string;
  createdAt: string;
  decidedAt: string | null;
  decidedBy: string | null;
}
