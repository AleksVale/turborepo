import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from '../../infrastructure/config/env.validation';
import { PrismaModule } from '../../prisma/prisma.module';
import { AllExceptionsFilter } from '../filters/all.exceptions.filter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ResponseInterceptor } from '../interceptors/response.interceptor';
import { AuthModule } from './auth.module';
import { ProductModule } from './product.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 200,
          ttl: 60,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env', '.env.local'],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    ProductModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
