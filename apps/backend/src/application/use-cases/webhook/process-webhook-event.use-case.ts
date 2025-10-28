import { Injectable } from '@nestjs/common';
import { WebhookEventStrategy } from '../../../domain/webhook/strategies/webhook-event.strategy';
import { HotmartWebhookStrategy } from '../../../infrastructure/webhook/strategies/hotmart-webhook.strategy';
import { KiwifyWebhookStrategy } from '../../../infrastructure/webhook/strategies/kiwify-webhook.strategy';
export type WebhookSource = 'hotmart' | 'kiwify';

@Injectable()
export class ProcessWebhookEventUseCase {
  constructor(
    private readonly hotmartStrategy: HotmartWebhookStrategy,
    private readonly kiwifyStrategy: KiwifyWebhookStrategy
  ) {}

  async execute(source: WebhookSource, event: any): Promise<void> {
    let strategy: WebhookEventStrategy;
    if (source === 'hotmart') {
      strategy = this.hotmartStrategy;
    } else if (source === 'kiwify') {
      strategy = this.kiwifyStrategy;
    } else {
      throw new Error('Unsupported webhook source');
    }
    await strategy.handle(event);
  }
}
