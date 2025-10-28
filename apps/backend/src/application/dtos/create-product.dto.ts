import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Digital Marketing Course',
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Complete course about digital marketing strategies',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
    required: false,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'The currency of the product',
    example: 'BRL',
    required: false,
    default: 'BRL',
  })
  @IsString()
  @IsOptional()
  currency?: string = 'BRL';

  @ApiProperty({
    description: 'The category of the product',
    example: 'Education',
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
    default: 'active',
  })
  @IsIn(['active', 'inactive', 'draft'])
  @IsOptional()
  status?: string = 'active';

  @ApiProperty({
    description: 'Additional metadata for the product',
    example: { tags: ['marketing', 'course'], difficulty: 'intermediate' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
