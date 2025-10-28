import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(userId?: number): Promise<Product[]> {
    if (userId) {
      return this.productRepository.findByUserId(userId);
    }

    return this.productRepository.findAll();
  }
}
