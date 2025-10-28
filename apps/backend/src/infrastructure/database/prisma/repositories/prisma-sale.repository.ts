import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Sale, SaleProps } from '../../../../domain/entities/sale.entity';
import { ISaleRepository } from '../../../../domain/repositories/sale.repository.interface';

@Injectable()
export class PrismaSaleRepository implements ISaleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(sale: Sale): Promise<Sale> {
    const data: SaleProps = {
      id: sale.id,
      orderId: sale.orderId,
      productId: sale.productId,
      customerId: sale.customerId,
      status: sale.status,
      amount: sale.amount,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
    const result = await this.prisma.sale.upsert({
      where: { id: sale.id },
      update: data,
      create: data,
    });
    return Sale.restore(result);
  }

  async findByOrderId(orderId: string): Promise<Sale | null> {
    const result = await this.prisma.sale.findUnique({ where: { orderId } });
    return result ? Sale.restore(result) : null;
  }

  async updateStatus(
    orderId: string,
    status: 'completed' | 'refunded',
  ): Promise<void> {
    await this.prisma.sale.update({ where: { orderId }, data: { status } });
  }
}
