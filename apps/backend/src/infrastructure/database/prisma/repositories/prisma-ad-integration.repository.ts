import { Injectable } from '@nestjs/common';
import {
  AdIntegration,
  AdProvider,
} from 'src/domain/entities/ad-integration.entity';
import { AdIntegrationRepository } from 'src/domain/repositories/ad-integration.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrismaAdIntegrationRepository extends AdIntegrationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByUserAndProvider(
    userId: number,
    provider: AdProvider,
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

  async delete(id: number): Promise<void> {
    await this.prisma.adIntegration.delete({ where: { id } });
  }
}
