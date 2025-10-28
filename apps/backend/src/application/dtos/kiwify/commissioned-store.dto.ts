import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CommissionedStoreDto {
  @IsUUID()
  id!: string;

  @IsString()
  type!: string;

  @IsString()
  custom_name!: string;

  @IsString()
  affiliate_id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  value!: string;
}
