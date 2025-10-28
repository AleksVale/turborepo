import { IsString, IsUUID } from 'class-validator';

export class ProductDto {
  @IsUUID()
  product_id!: string;

  @IsString()
  product_name!: string;
}
