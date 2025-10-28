import { Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';

export interface DeleteUserInput {
  id: number;
}

export interface DeleteUserOutput {
  success: boolean;
  message: string;
}

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isDeleted) {
      throw new Error('User is already deleted');
    }

    await this.userRepository.delete(input.id);

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}
