import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CustomerAccessDto {
  @IsBoolean()
  has_access!: boolean;

  @IsBoolean()
  active_period!: boolean;

  @IsDateString()
  access_until!: string;
}

export class PlanDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  frequency!: string;

  @IsNumber()
  qty_charges!: number;
}

export class CompletedChargeDto {
  @IsUUID()
  order_id!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  status!: string;

  @IsNumber()
  installments!: number;

  @IsString()
  card_type!: string;

  @IsString()
  card_last_digits!: string;

  @IsString()
  card_first_digits!: string;

  @IsDateString()
  created_at!: string;
}

export class FutureChargeDto {
  @IsDateString()
  charge_date!: string;
}

export class ChargesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedChargeDto)
  completed!: CompletedChargeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FutureChargeDto)
  future!: FutureChargeDto[];
}

export class SubscriptionDto {
  @IsDateString()
  start_date!: string;

  @IsDateString()
  next_payment!: string;

  @IsString()
  status!: string;

  @ValidateNested()
  @Type(() => CustomerAccessDto)
  customer_access!: CustomerAccessDto;

  @ValidateNested()
  @Type(() => PlanDto)
  plan!: PlanDto;

  @ValidateNested()
  @Type(() => ChargesDto)
  charges!: ChargesDto;
}
