import { Sale } from '../entities/sale.entity';

export abstract class ISaleRepository {
  abstract save(sale: Sale): Promise<Sale>;
  abstract findByOrderId(orderId: string): Promise<Sale | null>;
  abstract updateStatus(
    orderId: string,
    status: 'completed' | 'refunded',
  ): Promise<void>;
}
