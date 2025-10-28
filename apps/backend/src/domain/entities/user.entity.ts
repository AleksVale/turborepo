import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

export interface UserProps {
  id: number;
  name: string;
  email: Email;
  password: Password;
  roleId: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(props: {
    id: number;
    name: string;
    email: Email;
    password: Password;
    roleId?: number | null;
  }): User {
    return new User({
      ...props,
      roleId: props.roleId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static restore(props: UserProps): User {
    return new User(props);
  }

  get id(): number {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get roleId(): number | null {
    return this.props.roleId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateEmail(email: Email): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  updatePassword(password: Password): void {
    this.props.password = password;
    this.props.updatedAt = new Date();
  }

  assignRole(roleId: number): void {
    this.props.roleId = roleId;
    this.props.updatedAt = new Date();
  }

  removeRole(): void {
    this.props.roleId = null;
    this.props.updatedAt = new Date();
  }

  softDelete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  restore(): void {
    this.props.deletedAt = null;
    this.props.updatedAt = new Date();
  }
}
