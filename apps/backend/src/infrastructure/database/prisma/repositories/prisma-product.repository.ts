import { Injectable } from '@nestjs/common';
import { Product } from '../../../../domain/entities/product.entity';
import type { IProductRepository } from '../../../../domain/repositories/product.repository.interface';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    return product ? ProductMapper.toDomain(product) : null;
  }

  async findByUserId(userId: number): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(ProductMapper.toDomain);
  }

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(ProductMapper.toDomain);
  }

  async save(product: Product): Promise<Product> {
    const data = ProductMapper.toPrisma(product);

    const createdProduct = await this.prisma.product.create({
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        category: data.category,
        status: data.status,
        metadata: data.metadata ?? undefined,
      },
    });

    return ProductMapper.toDomain(createdProduct);
  }

  async update(product: Product): Promise<Product> {
    const data = ProductMapper.toPrisma(product);

    const updatedProduct = await this.prisma.product.update({
      where: { id: data.id },
      data: {
        userId: data.userId,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        category: data.category,
        status: data.status,
        metadata: data.metadata ?? undefined,
        deletedAt: data.deletedAt,
      },
    });

    return ProductMapper.toDomain(updatedProduct);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }
}
