import { User as PrismaUser } from '@prisma/client';
import { User } from '../../../../domain/entities/user.entity';
import { Email } from '../../../../domain/value-objects/email';
import { Password } from '../../../../domain/value-objects/password';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return User.restore({
      id: prismaUser.id,
      name: prismaUser.name,
      email: Email.create(prismaUser.email),
      password: Password.createFromHash(prismaUser.passwordHash),
      roleId: prismaUser.roleId,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt,
    });
  }

  static toPrisma(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      passwordHash: user.password.getValue(),
      roleId: user.roleId,
      deletedAt: user.deletedAt,
    };
  }
}
