import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name!: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'The role ID assigned to the user',
    example: 1,
    nullable: true,
  })
  roleId!: number | null;
}
