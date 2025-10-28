import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number, userId?: number): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (userId && !product.canBeModifiedBy(userId)) {
      throw new ForbiddenException(
        'You do not have permission to delete this product'
      );
    }

    await this.productRepository.delete(id);
  }
}
