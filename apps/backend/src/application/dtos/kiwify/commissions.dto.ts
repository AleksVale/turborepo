import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CommissionedStoreDto } from './commissioned-store.dto';

export class CommissionsDto {
  @IsString()
  charge_amount!: string;

  @IsString()
  currency!: string;

  @IsString()
  product_base_price!: string;

  @IsString()
  product_base_price_currency!: string;

  @IsString()
  kiwify_fee!: string;

  @IsString()
  kiwify_fee_currency!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommissionedStoreDto)
  commissioned_stores!: CommissionedStoreDto[];

  @IsString()
  my_commission!: string;

  @IsOptional()
  @Allow()
  funds_status!: any;

  @IsOptional()
  @IsDateString()
  @Allow()
  estimated_deposit_date!: string | null;

  @IsOptional()
  @IsDateString()
  @Allow()
  deposit_date!: string | null;
}
