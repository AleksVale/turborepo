import { Prisma, Product as PrismaProduct } from '@prisma/client';
import { Product } from '../../../../domain/entities/product.entity';
import { Currency } from '../../../../domain/value-objects/currency';
import { Price } from '../../../../domain/value-objects/price';

export class ProductMapper {
  static toDomain(prismaProduct: PrismaProduct): Product {
    return Product.restore({
      id: prismaProduct.id,
      userId: prismaProduct.userId,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price:
        prismaProduct.price !== null
          ? Price.create(Number(prismaProduct.price))
          : null,
      currency: prismaProduct.currency
        ? Currency.create(prismaProduct.currency)
        : null,
      category: prismaProduct.category,
      status: prismaProduct.status,
      metadata: prismaProduct.metadata as Record<string, unknown> | null,
      createdAt: prismaProduct.createdAt,
      updatedAt: prismaProduct.updatedAt,
      deletedAt: prismaProduct.deletedAt,
    });
  }

  static toPrisma(
    product: Product
  ): Omit<PrismaProduct, 'createdAt' | 'updatedAt'> {
    return {
      id: product.id,
      userId: product.userId,
      name: product.name,
      description: product.description,
      price: product.price
        ? new Prisma.Decimal(product.price.getValue())
        : null,
      currency: product.currency?.getValue() ?? null,
      category: product.category,
      status: product.status,
      metadata: product.metadata,
      deletedAt: product.deletedAt,
    };
  }
}
