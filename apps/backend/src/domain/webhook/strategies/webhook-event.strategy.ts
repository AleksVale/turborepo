export abstract class WebhookEventStrategy {
  abstract handle(event: any): Promise<void>;
}
