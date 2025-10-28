import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email';

export interface ListUsersFilters {
  search?: string;
  roleId?: number;
  limit?: number;
  offset?: number;
}

export interface ListUsersResult {
  users: User[];
  total: number;
}

export abstract class IUserRepository {
  abstract findById(id: number): Promise<User | null>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract findAll(filters?: ListUsersFilters): Promise<ListUsersResult>;
  abstract save(user: User): Promise<User>;
  abstract update(user: User): Promise<User>;
  abstract delete(id: number): Promise<void>;
}
