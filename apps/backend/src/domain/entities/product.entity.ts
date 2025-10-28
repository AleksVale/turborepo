import { Currency } from '../value-objects/currency';
import { Price } from '../value-objects/price';

export interface ProductProps {
  id: number;
  userId: number | null;
  name: string;
  description: string | null;
  price: Price | null;
  currency: Currency | null;
  category: string | null;
  status: string;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Product {
  private props: ProductProps;

  private constructor(props: ProductProps) {
    this.props = props;
  }

  static create(props: {
    id: number;
    userId?: number | null;
    name: string;
    description?: string | null;
    price?: Price | null;
    currency?: Currency | null;
    category?: string | null;
    status?: string;
    metadata?: Record<string, any> | null;
  }): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (props.name.length > 255) {
      throw new Error('Product name must be less than 255 characters');
    }

    const currency = props.currency || Currency.BRL();
    const status = props.status || 'active';

    if (!['active', 'inactive', 'draft'].includes(status)) {
      throw new Error('Invalid product status');
    }

    return new Product({
      id: props.id,
      userId: props.userId ?? null,
      name: props.name.trim(),
      description: props.description ?? null,
      price: props.price ?? null,
      currency,
      category: props.category ?? null,
      status,
      metadata: props.metadata ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static restore(props: ProductProps): Product {
    return new Product(props);
  }

  update(updates: {
    name?: string;
    description?: string | null;
    price?: Price | null;
    currency?: Currency | null;
    category?: string | null;
    status?: string;
    metadata?: Record<string, any> | null;
  }): void {
    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length === 0) {
        throw new Error('Product name is required');
      }
      if (updates.name.length > 255) {
        throw new Error('Product name must be less than 255 characters');
      }
      this.props.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      this.props.description = updates.description;
    }

    if (updates.price !== undefined) {
      this.props.price = updates.price;
    }

    if (updates.currency !== undefined) {
      this.props.currency = updates.currency;
    }

    if (updates.category !== undefined) {
      this.props.category = updates.category;
    }

    if (updates.status !== undefined) {
      if (!['active', 'inactive', 'draft'].includes(updates.status)) {
        throw new Error('Invalid product status');
      }
      this.props.status = updates.status;
    }

    if (updates.metadata !== undefined) {
      this.props.metadata = updates.metadata;
    }

    this.props.updatedAt = new Date();
  }

  markAsDeleted(): void {
    this.props.deletedAt = new Date();
    this.props.status = 'inactive';
  }

  // Getters
  get id(): number {
    return this.props.id;
  }

  get userId(): number | null {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get price(): Price | null {
    return this.props.price;
  }

  get currency(): Currency | null {
    return this.props.currency;
  }

  get category(): string | null {
    return this.props.category;
  }

  get status(): string {
    return this.props.status;
  }

  get metadata(): Record<string, any> | null {
    return this.props.metadata;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  // Business logic methods
  isActive(): boolean {
    return this.props.status === 'active' && this.props.deletedAt === null;
  }

  isOwnedBy(userId: number): boolean {
    return this.props.userId === userId;
  }

  canBeModifiedBy(userId: number): boolean {
    return this.isOwnedBy(userId) || this.props.userId === null;
  }
}