import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { TokenService } from '../../../infrastructure/auth/token.service';
import { AuthResponseDto } from '../../dtos/auth-response.dto';
import { AuthUserDto } from '../../dtos/auth-user.dto';
import { RefreshTokenDto } from '../../dtos/refresh-token.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(dto: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(
        dto.refreshToken
      );

      const user = await this.userRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.isDeleted) {
        throw new UnauthorizedException('User account is deactivated');
      }

      const newPayload = {
        sub: user.id,
        email: user.email.getValue(),
        roleId: user.roleId,
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.tokenService.generateAccessToken(newPayload),
        this.tokenService.generateRefreshToken(newPayload),
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
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
