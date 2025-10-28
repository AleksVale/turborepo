import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Advanced Digital Marketing Course',
    minLength: 1,
    maxLength: 255,
    required: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Updated course about advanced digital marketing strategies',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 149.99,
    required: false,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'The currency of the product',
    example: 'USD',
    required: false,
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Advanced Education',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'The status of the product',
    example: 'active',
    enum: ['active', 'inactive', 'draft'],
    required: false,
  })
  @IsIn(['active', 'inactive', 'draft'])
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Additional metadata for the product',
    example: { tags: ['marketing', 'advanced'], difficulty: 'expert' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
