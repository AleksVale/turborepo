import { Allow, IsOptional, IsString } from 'class-validator';

export class TrackingParametersDto {
  @IsOptional()
  @IsString()
  @Allow()
  src!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  sck!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  utm_source!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  utm_medium!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  utm_campaign!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  utm_content!: string | null;

  @IsOptional()
  @IsString()
  @Allow()
  utm_term!: string | null;
}
