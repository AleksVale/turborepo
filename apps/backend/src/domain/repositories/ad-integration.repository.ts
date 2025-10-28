import { AdIntegration, AdProvider } from '../entities/ad-integration.entity';

export abstract class AdIntegrationRepository {
  abstract findByUserAndProvider(
    userId: number,
    provider: AdProvider,
  ): Promise<AdIntegration | null>;
  abstract save(integration: AdIntegration): Promise<void>;
  abstract update(integration: AdIntegration): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
