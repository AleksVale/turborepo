import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { Email } from '../../../domain/value-objects/email';
import { Password } from '../../../domain/value-objects/password';
import { HashService } from '../../../infrastructure/auth/hash.service';
import { RegisterUserDto } from '../../dtos/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: HashService
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const email = Email.create(dto.email);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const password = Password.create(dto.password);
    const hashedPassword = await this.hashService.hash(password.getValue());

    const user = User.create({
      id: 0,
      name: dto.name,
      email,
      password: Password.createFromHash(hashedPassword),
      roleId: dto.roleId,
    });

    return this.userRepository.save(user);
  }
}
