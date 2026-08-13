import { IsIn, IsISO8601, IsPositive, IsString, Length } from 'class-validator';

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'AED'] as const;

export class CreatePayoutRequestDto {
  @IsPositive()
  amount: number;

  @IsIn(SUPPORTED_CURRENCIES)
  currency: string;

  @IsString()
  @Length(4, 200)
  reason: string;

  @IsISO8601()
  approvalDeadline: string;
}
