import { Injectable } from '@nestjs/common';
import { KiwifyWebhookPayloadDto } from '../../../application/dtos/kiwify/kiwify-webhook-payload.dto';
import { WebhookEventStrategy } from '../../../domain/webhook/strategies/webhook-event.strategy';

@Injectable()
export class KiwifyWebhookStrategy extends WebhookEventStrategy {
  async handle(event: KiwifyWebhookPayloadDto): Promise<void> {
    // Implement Kiwify event handling logic using strongly typed DTO
    // Example: access event.order_id, event.Customer, etc.
  }
}
