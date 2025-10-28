import { Type } from 'class-transformer';
import {
  Allow,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CommissionsDto } from './commissions.dto';
import { CustomerDto } from './customer.dto';
import {
  KiwifyOrderStatus,
  KiwifyPaymentMethod,
  KiwifyProductType,
  KiwifyWebhookEventType,
} from './enums';
import { ProductDto } from './product.dto';
import { SubscriptionDto } from './subscription.dto';
import { TrackingParametersDto } from './tracking-parameters.dto';

export class KiwifyWebhookPayloadDto {
  @IsUUID()
  order_id!: string;

  @IsString()
  order_ref!: string;

  @IsEnum(KiwifyOrderStatus)
  order_status!: KiwifyOrderStatus;

  @IsEnum(KiwifyPaymentMethod)
  payment_method!: KiwifyPaymentMethod;

  @IsString()
  store_id!: string;

  @IsString()
  payment_merchant_id!: string;

  @IsNumber()
  installments!: number;

  @IsString()
  card_type!: string;

  @IsString()
  card_last4digits!: string;

  @IsOptional()
  @IsString()
  @Allow()
  card_rejection_reason!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  pix_code!: string | null;

  @IsOptional()
  @IsDateString()
  @Allow()
  pix_expiration!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  boleto_URL!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  boleto_barcode!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  boleto_expiry_date!: string | null;

  @IsString()
  sale_type!: string;

  @IsString()
  approved_date!: string;

  @IsString()
  created_at!: string;

  @IsString()
  updated_at!: string;

  @IsOptional()
  @IsEnum(KiwifyWebhookEventType)
  webhook_event_type?: KiwifyWebhookEventType;

  @IsEnum(KiwifyProductType)
  product_type!: KiwifyProductType;

  @ValidateNested()
  @Type(() => ProductDto)
  Product!: ProductDto;

  @ValidateNested()
  @Type(() => CustomerDto)
  Customer!: CustomerDto;

  @ValidateNested()
  @Type(() => CommissionsDto)
  Commissions!: CommissionsDto;

  @ValidateNested()
  @Type(() => TrackingParametersDto)
  TrackingParameters!: TrackingParametersDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SubscriptionDto)
  Subscription?: SubscriptionDto;

  @IsOptional()
  @IsUUID()
  subscription_id?: string;

  @IsString()
  checkout_link!: string;

  @IsUrl()
  access_url!: string;

  @IsOptional()
  @IsObject()
  @Allow()
  SmartInstallment?: any;

  @IsOptional()
  @IsObject()
  @Allow()
  event_tickets?: any;

  @IsOptional()
  @IsObject()
  @Allow()
  event_batch?: any;
}
