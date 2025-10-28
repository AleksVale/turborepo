import { Injectable } from '@nestjs/common';
import { WebhookEventStrategy } from '../../../domain/webhook/strategies/webhook-event.strategy';

@Injectable()
export class KiwifyWebhookStrategy extends WebhookEventStrategy {
  async handle(event: any): Promise<void> {
    // TODO: Implement Kiwify event handling logic
  }
}
