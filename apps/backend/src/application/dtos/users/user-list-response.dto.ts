import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto {
  @ApiProperty({
    description: 'List of users',
    type: [UserResponseDto],
  })
  @Type(() => UserResponseDto)
  users!: UserResponseDto[];

  @ApiProperty({
    description: 'Total number of users',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages!: number;
}
