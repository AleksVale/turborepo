import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'User full name',
    example: 'João Silva',
  })
  name!: string;

  @ApiProperty({
    description: 'User email address',
    example: 'joao.silva@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'User role ID',
    example: 1,
    nullable: true,
  })
  roleId!: number | null;

  @ApiProperty({
    description: 'User creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'User last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;
}
