export enum KiwifyOrderStatus {
  PAID = 'paid',
  WAITING_PAYMENT = 'waiting_payment',
  REFUSED = 'refused',
  REFUNDED = 'refunded',
  CHARGEDBACK = 'chargedback',
}

export enum KiwifyPaymentMethod {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
}

export enum KiwifyProductType {
  CLUB = 'club',
  PHYSICAL = 'physical',
  PAYMENT = 'payment',
  DIGITAL = 'digital',
  EVENT = 'event',
  MEMBERSHIP = 'membership',
}

export enum KiwifyWebhookEventType {
  BILLET_CREATED = 'billet_created',
  PIX_CREATED = 'pix_created',
  ORDER_REJECTED = 'order_rejected',
  ORDER_APPROVED = 'order_approved',
  ORDER_REFUNDED = 'order_refunded',
  CHARGEBACK = 'chargeback',
  SUBSCRIPTION_CANCELED = 'subscription_canceled',
  SUBSCRIPTION_LATE = 'subscription_late',
  SUBSCRIPTION_RENEWED = 'subscription_renewed',
}
