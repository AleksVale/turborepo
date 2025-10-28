import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Infrastructure
import { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { HashService } from '../../infrastructure/auth/hash.service';
import { JwtStrategy } from '../../infrastructure/auth/jwt.strategy';
import { TokenService } from '../../infrastructure/auth/token.service';
import { PrismaRoleRepository } from '../../infrastructure/database/prisma/repositories/prisma-role.repository';
import { PrismaUserRepository } from '../../infrastructure/database/prisma/repositories/prisma-user.repository';

// Use Cases
import { LoginUserUseCase } from '../../application/use-cases/auth/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/auth/refresh-token.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/auth/register-user.use-case';

// Presentation
import { AuthController } from '../controllers/auth.controller';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Infrastructure Services
    HashService,
    TokenService,
    JwtStrategy,

    // Repositories
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: IRoleRepository,
      useClass: PrismaRoleRepository,
    },

    // Use Cases
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,

    // Guards
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
