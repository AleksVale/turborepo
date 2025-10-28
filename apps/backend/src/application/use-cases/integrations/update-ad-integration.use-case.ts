import { Injectable } from '@nestjs/common';
import {
  AdIntegration,
  AdProvider,
} from '../../../domain/entities/ad-integration.entity';
import { AdIntegrationRepository } from '../../../domain/repositories/ad-integration.repository';

export interface UpdateAdIntegrationInput {
  id: string;
  userId: string;
  provider: AdProvider;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | null;
  status: 'active' | 'inactive' | 'error';
}

@Injectable()
export class UpdateAdIntegrationUseCase {
  constructor(private readonly repository: AdIntegrationRepository) {}

  async execute(input: UpdateAdIntegrationInput): Promise<void> {
    const integration = new AdIntegration(input);
    await this.repository.update(integration);
  }
}
