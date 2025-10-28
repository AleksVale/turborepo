import { Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';

export interface GetUserInput {
  id: number;
}

export interface GetUserOutput {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput | null> {
    const user = await this.userRepository.findById(input.id);

    if (!user || user.isDeleted) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
