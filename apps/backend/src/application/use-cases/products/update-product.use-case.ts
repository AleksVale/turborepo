import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { Currency } from '../../../domain/value-objects/currency';
import { Price } from '../../../domain/value-objects/price';
import { UpdateProductDto } from '../../dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(
    id: number,
    dto: UpdateProductDto,
    userId?: number
  ): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if user can modify this product
    if (userId && !product.canBeModifiedBy(userId)) {
      throw new ForbiddenException(
        'You do not have permission to modify this product'
      );
    }

    const updates: {
      name?: string;
      description?: string | null;
      price?: Price | null;
      currency?: Currency;
      category?: string | null;
      status?: string;
      metadata?: Record<string, unknown> | null;
    } = {};

    if (dto.name !== undefined) updates.name = dto.name;
    if (dto.description !== undefined) updates.description = dto.description;
    if (dto.price !== undefined)
      updates.price = dto.price !== null ? Price.create(dto.price) : null;
    if (dto.currency !== undefined)
      updates.currency = dto.currency
        ? Currency.create(dto.currency)
        : undefined;
    if (dto.category !== undefined) updates.category = dto.category;
    if (dto.status !== undefined) updates.status = dto.status;
    if (dto.metadata !== undefined) updates.metadata = dto.metadata;

    product.update(updates);

    return this.productRepository.update(product);
  }
}
