import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';

@Injectable()
export class GetProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }
}
