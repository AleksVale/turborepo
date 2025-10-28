import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginatedQueryDto {
  @ApiProperty({
    description: 'Número da página (começando em 1)',
    default: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsOptional()
  page = 1;

  @ApiProperty({
    description: 'Número de registros por página',
    default: 10,
    required: false,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsOptional()
  perPage = 10;
}
