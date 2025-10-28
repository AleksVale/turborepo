import { Module } from '@nestjs/common';

// Use Cases
import { CreateProductUseCase } from '../../application/use-cases/products/create-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/products/delete-product.use-case';
import { GetProductUseCase } from '../../application/use-cases/products/get-product.use-case';
import { ListProductsUseCase } from '../../application/use-cases/products/list-products.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/products/update-product.use-case';

// Infrastructure
import { PrismaProductRepository } from '../../infrastructure/database/prisma/repositories/prisma-product.repository';

// Presentation
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { ProductController } from '../controllers/product.controller';

@Module({
  controllers: [ProductController],
  providers: [
    // Repositories
    {
      provide: IProductRepository,
      useClass: PrismaProductRepository,
    },

    // Use Cases
    CreateProductUseCase,
    GetProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    ListProductsUseCase,
  ],
  exports: [],
})
export class ProductModule {}
