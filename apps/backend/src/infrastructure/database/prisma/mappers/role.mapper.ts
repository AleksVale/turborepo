import { Role as PrismaRole } from '@prisma/client';
import { Role } from '../../../../domain/entities/role.entity';

export class RoleMapper {
  static toDomain(prismaRole: PrismaRole): Role {
    return Role.restore({
      id: prismaRole.id,
      name: prismaRole.name,
      createdAt: prismaRole.createdAt,
      updatedAt: prismaRole.updatedAt,
    });
  }

  static toPrisma(role: Role): Omit<PrismaRole, 'createdAt' | 'updatedAt'> {
    return {
      id: role.id,
      name: role.name,
    };
  }
}
