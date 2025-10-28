import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthResponseDto } from '../../application/dtos/auth-response.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { RefreshTokenDto } from '../../application/dtos/refresh-token.dto';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';
import type { JwtPayload } from '../../infrastructure/auth/token.service';
import { ApiOkResponseDecorator } from '../decorators/api-response.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { ControllerResponseDto } from '../dtos/controller-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exists',
  })
  async register(
    @Body() dto: RegisterUserDto
  ): Promise<ControllerResponseDto<AuthResponseDto>> {
    await this.registerUserUseCase.execute(dto);

    const loginDto: LoginUserDto = {
      email: dto.email,
      password: dto.password,
    };

    const authResponse = await this.loginUserUseCase.execute(loginDto);
    return { data: authResponse };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponseDecorator(AuthResponseDto)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
  })
  async login(
    @Body() dto: LoginUserDto
  ): Promise<ControllerResponseDto<AuthResponseDto>> {
    const authResponse = await this.loginUserUseCase.execute(dto);
    return { data: authResponse };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponseDecorator(AuthResponseDto)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid refresh token',
  })
  async refresh(
    @Body() dto: RefreshTokenDto
  ): Promise<ControllerResponseDto<AuthResponseDto>> {
    const authResponse = await this.refreshTokenUseCase.execute(dto);
    return { data: authResponse };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponseDecorator(UserResponseDto)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async getProfile(
    @CurrentUser() user: JwtPayload
  ): Promise<ControllerResponseDto<UserResponseDto>> {
    const userResponse: UserResponseDto = {
      id: user.sub,
      email: user.email,
      name: '',
      roleId: user.roleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return { data: userResponse };
  }
}
