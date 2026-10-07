import type { CreateUserData, UpdateUserData, User } from '../user.entity.js';

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByGoogleId(googleId: string): Promise<User | null>;
  abstract create(data: CreateUserData): Promise<User>;
  abstract update(id: string, data: UpdateUserData): Promise<User>;
  /** Related rows (sessions, progress, stats…) go with it through ON DELETE CASCADE. */
  abstract delete(id: string): Promise<void>;
}
