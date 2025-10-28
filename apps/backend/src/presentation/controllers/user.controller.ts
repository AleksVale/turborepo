import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { CreateUserDto, UpdateUserDto } from '@tcc/shared-types';
import { UserResponseDto } from '../../application/dtos/users/user-response.dto';
import { CreateUserUseCase } from '../../application/use-cases/users/create-user.use-case';
import { DeleteUserUseCase } from '../../application/use-cases/users/delete-user.use-case';
import { GetUserUseCase } from '../../application/use-cases/users/get-user.use-case';
import { ListUsersUseCase } from '../../application/use-cases/users/list-users.use-case';
import { UpdateUserUseCase } from '../../application/use-cases/users/update-user.use-case';
import { ApiOkResponseDecorator } from '../decorators/api-response.decorator';
import { Roles } from '../decorators/roles.decorator';
import type { ControllerResponseDto } from '../dtos/controller-response.dto';
import { PaginatedControllerResponseDto } from '../dtos/paginated-controller-response.dto';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid user data',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async create(
    @Body() dto: CreateUserDto,
  ): Promise<ControllerResponseDto<UserResponseDto>> {
    const user = await this.createUserUseCase.execute(dto);

    const response: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { data: response };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users (Admin only)' })
  @ApiOkResponseDecorator(PaginatedControllerResponseDto)
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedControllerResponseDto<UserResponseDto>> {
    const result = await this.listUsersUseCase.execute(query);
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ControllerResponseDto<UserResponseDto>> {
    const user = await this.getUserUseCase.execute({ id });

    if (!user) {
      throw new Error('User not found');
    }

    const response: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { data: response };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid user data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<ControllerResponseDto<UserResponseDto>> {
    const user = await this.updateUserUseCase.execute({ id, ...dto });

    const response: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { data: response };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.deleteUserUseCase.execute({ id });
  }
}
