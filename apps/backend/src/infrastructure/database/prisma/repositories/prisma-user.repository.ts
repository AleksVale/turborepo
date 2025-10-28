import { Injectable } from '@nestjs/common';
import { User } from '../../../../domain/entities/user.entity';
import {
  IUserRepository,
  ListUsersFilters,
  ListUsersResult,
} from '../../../../domain/repositories/user.repository.interface';
import { Email } from '../../../../domain/value-objects/email';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);

    const createdUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
      },
    });

    return UserMapper.toDomain(createdUser);
  }

  async update(user: User): Promise<User> {
    const data = UserMapper.toPrisma(user);

    const updatedUser = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
        deletedAt: data.deletedAt,
      },
    });

    return UserMapper.toDomain(updatedUser);
  }

  async findAll(filters: ListUsersFilters = {}): Promise<ListUsersResult> {
    const { search, roleId, limit = 10, offset = 0 } = filters;

    // Build where clause
    const where: any = {
      deletedAt: null, // Only active users
    };

    if (roleId !== undefined) {
      where.roleId = roleId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await this.prisma.user.count({ where });

    // Get users with pagination
    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return {
      users: users.map(UserMapper.toDomain),
      total,
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
