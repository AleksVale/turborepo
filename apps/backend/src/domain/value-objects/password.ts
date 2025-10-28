export class Password {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Password {
    if (!this.isValid(password)) {
      throw new Error(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      );
    }
    return new Password(password);
  }

  static createFromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  private static isValid(password: string): boolean {
    if (password.length < 8) {
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber;
  }

  getValue(): string {
    return this.value;
  }
}
