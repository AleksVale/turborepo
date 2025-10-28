import { Injectable } from '@nestjs/common';
import {
  AdIntegration,
  AdProvider,
} from '../../../domain/entities/ad-integration.entity';
import { AdIntegrationRepository } from '../../../domain/repositories/ad-integration.repository';

@Injectable()
export class FindAdIntegrationUseCase {
  constructor(private readonly repository: AdIntegrationRepository) {}

  async execute(
    userId: string,
    provider: AdProvider
  ): Promise<AdIntegration | null> {
    return this.repository.findByUserAndProvider(userId, provider);
  }
}
