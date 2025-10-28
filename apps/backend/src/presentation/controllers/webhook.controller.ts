import { Body, Controller, Post, Query } from '@nestjs/common';
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
    await this.processWebhookEvent.execute(source, event);
  }
}
