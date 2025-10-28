import { Injectable } from '@nestjs/common';
import { Product } from '../../../domain/entities/product.entity';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface';
import { Currency } from '../../../domain/value-objects/currency';
import { Price } from '../../../domain/value-objects/price';
import { CreateProductDto } from '../../dtos/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: CreateProductDto, userId?: number): Promise<Product> {
    const price = dto.price !== undefined ? Price.create(dto.price) : null;
    const currency = dto.currency
      ? Currency.create(dto.currency)
      : Currency.BRL();

    const product = Product.create({
      id: 0, // Will be set by the database
      userId: userId || null,
      name: dto.name,
      description: dto.description,
      price,
      currency,
      category: dto.category,
      status: dto.status,
      metadata: dto.metadata,
    });

    return this.productRepository.save(product);
  }
}
