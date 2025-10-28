import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Email } from '../../../domain/value-objects/email';
import { HashService } from '../../../infrastructure/auth/hash.service';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { AuthResponseDto } from '../../dtos/auth-response.dto';
import { AuthUserDto } from '../../dtos/auth-user.dto';
import { LoginUserDto } from '../../dtos/login-user.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: LoginUserDto): Promise<AuthResponseDto> {
    const email = Email.create(dto.email);

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      dto.password,
      user.password.getValue()
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isDeleted) {
      throw new UnauthorizedException('User account is deactivated');
    }

    const payload = {
      sub: user.id,
      email: user.email.getValue(),
      roleId: user.roleId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(payload),
      this.tokenService.generateRefreshToken(payload),
    ]);

    const authUser: AuthUserDto = {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      roleId: user.roleId,
    };

    return {
      accessToken,
      refreshToken,
      user: authUser,
    };
  }
}
