import { Allow, IsEmail, IsIP, IsOptional, IsString } from 'class-validator';

export class CustomerDto {
  @IsString()
  full_name!: string;

  @IsString()
  first_name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @Allow()
  mobile!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  CPF!: string | null;

  @IsIP()
  ip!: string;

  @IsOptional()
  @IsString()
  @Allow()
  country!: string | null;
}
