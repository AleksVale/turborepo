import { Injectable } from '@nestjs/common';

import { UserResponseDto } from '../../../application/dtos/users/user-response.dto';
import type { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { PaginatedControllerResponseDto } from '../../../presentation/dtos/paginated-controller-response.dto';
import { buildPaginate } from '../../helpers/paginate.helper';
import { createPaginationQuery } from '../../helpers/pagination-query.helper';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: {
    page?: number;
    limit?: number;
    search?: string;
    roleId?: number;
  }): Promise<PaginatedControllerResponseDto<UserResponseDto>> {
    const { page, limit, offset } = createPaginationQuery({
      page: params.page,
      limit: params.limit,
    });

    const filters = {
      search: params.search,
      roleId: params.roleId,
      limit,
      offset,
    };

    const { users, total } = await this.userRepository.findAll(filters);

    const userDtos = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    const paginate = buildPaginate({ total, page, limit });

    return {
      paginate,
      registers: userDtos,
    };
  }
}
