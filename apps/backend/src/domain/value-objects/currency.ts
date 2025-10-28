export class Currency {
  private readonly value: string;

  private constructor(currency: string) {
    this.value = currency;
  }

  static create(currency: string): Currency {
    if (!this.isValid(currency)) {
      throw new Error('Invalid currency: must be a 3-letter ISO code');
    }
    return new Currency(currency.toUpperCase());
  }

  private static isValid(currency: string): boolean {
    const currencyRegex = /^[A-Z]{3}$/;
    return currencyRegex.test(currency);
  }

  static BRL(): Currency {
    return new Currency('BRL');
  }

  static USD(): Currency {
    return new Currency('USD');
  }

  static EUR(): Currency {
    return new Currency('EUR');
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Currency): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
