import { Injectable } from '@nestjs/common';
import { Role } from '../../../../domain/entities/role.entity';
import { IRoleRepository } from '../../../../domain/repositories/role.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class PrismaRoleRepository implements IRoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    return role ? RoleMapper.toDomain(role) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findFirst({
      where: { name },
    });

    return role ? RoleMapper.toDomain(role) : null;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map(RoleMapper.toDomain);
  }

  async save(role: Role): Promise<Role> {
    const data = RoleMapper.toPrisma(role);

    const createdRole = await this.prisma.role.create({
      data: {
        name: data.name,
      },
    });

    return RoleMapper.toDomain(createdRole);
  }

  async update(role: Role): Promise<Role> {
    const data = RoleMapper.toPrisma(role);

    const updatedRole = await this.prisma.role.update({
      where: { id: data.id },
      data: {
        name: data.name,
      },
    });

    return RoleMapper.toDomain(updatedRole);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}
