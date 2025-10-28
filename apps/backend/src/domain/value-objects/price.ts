export class Price {
  private readonly value: number;

  private constructor(price: number) {
    this.value = price;
  }

  static create(price: number): Price {
    if (!this.isValid(price)) {
      throw new Error('Invalid price: must be a positive number');
    }
    return new Price(Math.round(price * 100) / 100);
  }

  private static isValid(price: number): boolean {
    return typeof price === 'number' && price >= 0 && !isNaN(price);
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toFixed(2);
  }
}
