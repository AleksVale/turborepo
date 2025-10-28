import { Injectable } from '@nestjs/common';
import {
  AdIntegration,
  AdProvider,
} from '../../../../domain/entities/ad-integration.entity';
import { AdIntegrationRepository } from '../../../../domain/repositories/ad-integration.repository';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaAdIntegrationRepository extends AdIntegrationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUserAndProvider(
    userId: string,
    provider: AdProvider
  ): Promise<AdIntegration | null> {
    const result = await this.prisma.adIntegration.findFirst({
      where: { userId, provider },
    });
    return result ? new AdIntegration(result) : null;
  }

  async save(integration: AdIntegration): Promise<void> {
    await this.prisma.adIntegration.create({ data: integration });
  }

  async update(integration: AdIntegration): Promise<void> {
    await this.prisma.adIntegration.update({
      where: { id: integration.id },
      data: integration,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.adIntegration.delete({ where: { id } });
  }
}
