import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { CurrentUserGuard } from '../auth/current-user.guard';
import type { Employee } from '../employees/employee.entity';
import { CreatePayoutRequestDto } from './dto/create-payout-request.dto';
import { PayoutRequest } from './payout-request.entity';
import { PayoutsService } from './payouts.service';

@Controller('payouts')
@UseGuards(CurrentUserGuard)
export class PayoutsController {
  constructor(private readonly payouts: PayoutsService) {}

  @Post()
  async create(
    @CurrentUser() user: Employee,
    @Body() dto: CreatePayoutRequestDto,
  ): Promise<PayoutRequest> {
    return this.payouts.create(user.id, dto);
  }

  @Get('mine')
  async listMine(@CurrentUser() user: Employee): Promise<PayoutRequest[]> {
    return this.payouts.findByEmployee(user.id);
  }

  @Get(':id')
  async getById(
    @CurrentUser() user: Employee,
    @Param('id') id: string,
  ): Promise<PayoutRequest> {
    const request = await this.payouts.findById(id);
    if (request.employeeId !== user.id && user.role === 'employee') {
      throw new ForbiddenException('Not your payout request');
    }
    return request;
  }
}
