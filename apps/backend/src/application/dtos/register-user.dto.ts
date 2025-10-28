import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description:
      'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number',
    example: 'Password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password!: string;

  @ApiProperty({
    description: 'The role ID to assign to the user (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  roleId?: number;
}
