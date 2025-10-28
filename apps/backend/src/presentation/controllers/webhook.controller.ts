import { Body, Controller, Post, Query } from '@nestjs/common';
import { KiwifyWebhookPayloadDto } from '../../application/dtos/kiwify/kiwify-webhook-payload.dto';
import type { WebhookSource } from '../../application/use-cases/webhook/process-webhook-event.use-case';
import { ProcessWebhookEventUseCase } from '../../application/use-cases/webhook/process-webhook-event.use-case';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly processWebhookEvent: ProcessWebhookEventUseCase,
  ) {}

  @Post()
  async handleWebhook(
    @Query('source') source: WebhookSource,
    @Body() event: any,
  ): Promise<void> {
    if (source === 'kiwify') {
      await this.processWebhookEvent.execute(
        source,
        event as KiwifyWebhookPayloadDto,
      );
    } else {
      await this.processWebhookEvent.execute(source, event);
    }
  }
}
