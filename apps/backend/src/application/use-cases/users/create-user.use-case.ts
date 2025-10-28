import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { HashService } from '../../../infrastructure/auth/hash.service';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export interface CreateUserOutput {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const email = Email.create(input.email);
    const password = Password.create(input.password);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.hashService.hash(password.getValue());

    const hashedPasswordVO = Password.create(hashedPassword);

    const userId = Date.now();

    const user = User.create({
      id: userId,
      name: input.name,
      email,
      password: hashedPasswordVO,
      roleId: input.roleId,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email.getValue(),
      roleId: savedUser.roleId,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
}
