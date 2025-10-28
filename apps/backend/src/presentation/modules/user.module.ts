import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/users/get-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { HashService } from '../../infrastructure/auth/hash.service';
import { PrismaUserRepository } from '../../infrastructure/database/prisma/repositories/prisma-user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { UserController } from '../controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    ListUsersUseCase,

    // Infrastructure
    HashService,
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
