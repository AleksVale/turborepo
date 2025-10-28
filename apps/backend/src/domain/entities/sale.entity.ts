export interface SaleProps {
  id: string;
  orderId: string;
  productId: string;
  customerId: string;
  status: 'completed' | 'refunded';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export class Sale {
  private props: SaleProps;

  private constructor(props: SaleProps) {
    this.props = props;
  }

  static create(props: SaleProps): Sale {
    // Add domain validation here if needed
    return new Sale(props);
  }

  static restore(props: SaleProps): Sale {
    return new Sale(props);
  }

  get id() {
    return this.props.id;
  }

  get orderId() {
    return this.props.orderId;
  }

  get productId() {
    return this.props.productId;
  }

  get customerId() {
    return this.props.customerId;
  }

  get status() {
    return this.props.status;
  }

  get amount() {
    return this.props.amount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
