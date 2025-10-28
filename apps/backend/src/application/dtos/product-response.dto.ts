import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'The ID of the user who owns the product',
    example: 1,
    nullable: true,
  })
  userId!: number | null;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Digital Marketing Course',
  })
  name!: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'Complete course about digital marketing strategies',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
    nullable: true,
  })
  price!: number | null;

  @ApiProperty({
    description: 'The currency of the product',
    example: 'BRL',
    nullable: true,
  })
  currency!: string | null;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Education',
    nullable: true,
  })
  category!: string | null;

  @ApiProperty({
    description: 'The status of the product',
    example: 'active',
    enum: ['active', 'inactive', 'draft'],
  })
  status!: string;

  @ApiProperty({
    description: 'Additional metadata for the product',
    example: { tags: ['marketing', 'course'], difficulty: 'intermediate' },
    nullable: true,
  })
  metadata!: Record<string, unknown> | null;

  @ApiProperty({
    description: 'The creation date of the product',
    example: '2025-01-15T10:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'The last update date of the product',
    example: '2025-01-15T10:30:00.000Z',
  })
  updatedAt!: Date;
}
