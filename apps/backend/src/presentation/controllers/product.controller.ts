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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { CreateProductDto, UpdateProductDto } from '@tcc/shared-types';
import { ProductResponseDto } from '../../application/dtos/product-response.dto';
import type { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import type { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';
import type { GetProductUseCase } from '../../application/use-cases/products/get-product.use-case';
import type { ListProductsUseCase } from '../../application/use-cases/products/list-products.use-case';
import type { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';
import { ApiOkResponseDecorator } from '../decorators/api-response.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { ControllerResponseDto } from '../dtos/controller-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product successfully created',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data',
  })
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser('sub') userId: number,
  ): Promise<ControllerResponseDto<ProductResponseDto>> {
    const product = await this.createProductUseCase.execute(dto, userId);

    const response: ProductResponseDto = {
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      price: product.price?.getValue() ?? null,
      currency: product.currency?.getValue() ?? null,
      category: product.category,
      status: product.status,
      metadata: product.metadata,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return { data: response };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Filter products by user ID',
  })
  @ApiOkResponseDecorator(ProductResponseDto)
  async findAll(
    @Query('userId', ParseIntPipe) userId?: number,
    @CurrentUser('sub') currentUserId?: number,
  ): Promise<ControllerResponseDto<ProductResponseDto[]>> {
    const products = await this.listProductsUseCase.execute(
      userId || currentUserId,
    );

    const response: ProductResponseDto[] = products.map((product) => ({
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      price: product.price?.getValue() ?? null,
      currency: product.currency?.getValue() ?? null,
      category: product.category,
      status: product.status,
      metadata: product.metadata,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return { data: response };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
  })
  @ApiOkResponseDecorator(ProductResponseDto)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ControllerResponseDto<ProductResponseDto>> {
    const product = await this.getProductUseCase.execute(id);

    const response: ProductResponseDto = {
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      price: product.price?.getValue() ?? null,
      currency: product.currency?.getValue() ?? null,
      category: product.category,
      status: product.status,
      metadata: product.metadata,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return { data: response };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
  })
  @ApiOkResponseDecorator(ProductResponseDto)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid product data',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser('sub') userId: number,
  ): Promise<ControllerResponseDto<ProductResponseDto>> {
    const product = await this.updateProductUseCase.execute(id, dto, userId);

    const response: ProductResponseDto = {
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      price: product.price?.getValue() ?? null,
      currency: product.currency?.getValue() ?? null,
      category: product.category,
      status: product.status,
      metadata: product.metadata,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return { data: response };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Product ID',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Product successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ): Promise<void> {
    await this.deleteProductUseCase.execute(id, userId);
  }
}
