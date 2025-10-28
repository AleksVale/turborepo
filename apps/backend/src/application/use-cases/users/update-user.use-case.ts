import { Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { HashService } from '../../../infrastructure/auth/hash.service';

export interface UpdateUserInput {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  roleId?: number | null;
}

export interface UpdateUserOutput {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService
  ) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user || user.isDeleted) {
      throw new Error('User not found');
    }

    if (input.name !== undefined) {
      user.updateName(input.name);
    }

    if (input.email !== undefined) {
      const email = Email.create(input.email);

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== input.id) {
        throw new Error('Email already taken by another user');
      }

      user.updateEmail(email);
    }

    if (input.password !== undefined) {
      const password = Password.create(input.password);
      const hashedPassword = await this.hashService.hash(password.getValue());
      const hashedPasswordVO = Password.create(hashedPassword);
      user.updatePassword(hashedPasswordVO);
    }

    if (input.roleId !== undefined) {
      if (input.roleId === null) {
        user.removeRole();
      } else {
        user.assignRole(input.roleId);
      }
    }

    const updatedUser = await this.userRepository.update(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email.getValue(),
      roleId: updatedUser.roleId,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}
