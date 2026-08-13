import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreatePayoutRequestDto } from './dto/create-payout-request.dto';
import { PayoutRequest, PayoutStatus } from './payout-request.entity';

@Injectable()
export class PayoutsService {
  private readonly requests = new Map<string, PayoutRequest>();

  async create(
    employeeId: string,
    dto: CreatePayoutRequestDto,
  ): Promise<PayoutRequest> {
    const request: PayoutRequest = {
      id: randomUUID(),
      employeeId,
      amount: dto.amount,
      currency: dto.currency,
      reason: dto.reason,
      status: 'pending',
      approvalDeadline: dto.approvalDeadline,
      createdAt: new Date().toISOString(),
      decidedAt: null,
      decidedBy: null,
    };
    this.requests.set(request.id, request);
    return request;
  }

  async findById(id: string): Promise<PayoutRequest> {
    const request = this.requests.get(id);
    if (!request) {
      throw new NotFoundException(`Payout request ${id} not found`);
    }
    return request;
  }

  async findByEmployee(employeeId: string): Promise<PayoutRequest[]> {
    return [...this.requests.values()].filter(
      (request) => request.employeeId === employeeId,
    );
  }

  async findByStatus(status: PayoutStatus): Promise<PayoutRequest[]> {
    return [...this.requests.values()].filter(
      (request) => request.status === status,
    );
  }

  async setDecision(
    id: string,
    status: Extract<PayoutStatus, 'approved' | 'rejected'>,
    decidedBy: string,
  ): Promise<PayoutRequest> {
    const request = await this.findById(id);
    request.status = status;
    request.decidedAt = new Date().toISOString();
    request.decidedBy = decidedBy;
    return request;
  }
}
