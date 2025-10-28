import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description:
      'The new password (must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number)',
    example: 'NewPassword123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password?: string;

  @ApiProperty({
    description: 'The role ID to assign to the user',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  roleId?: number;
}
