import { Product } from '../entities/product.entity';

export abstract class IProductRepository {
  abstract findById(id: number): Promise<Product | null>;
  abstract findByUserId(userId: number): Promise<Product[]>;
  abstract findAll(): Promise<Product[]>;
  abstract save(product: Product): Promise<Product>;
  abstract update(product: Product): Promise<Product>;
  abstract delete(id: number): Promise<void>;
  abstract exists(id: number): Promise<boolean>;
}
