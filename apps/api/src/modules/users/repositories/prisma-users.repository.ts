import { Injectable } from '@nestjs/common';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import type { CreateUserData, UpdateUserData, User } from '../user.entity.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { googleId } });
  }

  create(data: CreateUserData): Promise<User> {
    return this.db.user.create({ data });
  }

  update(id: string, data: UpdateUserData): Promise<User> {
    return this.db.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.db.user.delete({ where: { id } });
  }
}
