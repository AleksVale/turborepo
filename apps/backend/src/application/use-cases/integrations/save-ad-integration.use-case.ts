import { Injectable } from '@nestjs/common';
import {
  AdIntegration,
  AdProvider,
} from '../../../domain/entities/ad-integration.entity';
import { AdIntegrationRepository } from '../../../domain/repositories/ad-integration.repository';

export interface SaveAdIntegrationInput {
  userId: string;
  provider: AdProvider;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | null;
}

@Injectable()
export class SaveAdIntegrationUseCase {
  constructor(private readonly repository: AdIntegrationRepository) {}

  async execute(input: SaveAdIntegrationInput): Promise<void> {
    const integration = new AdIntegration({
      ...input,
      status: 'active',
    });
    await this.repository.save(integration);
  }
}
