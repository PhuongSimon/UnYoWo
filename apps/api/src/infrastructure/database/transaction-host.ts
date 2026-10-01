import { AsyncLocalStorage } from 'node:async_hooks';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from './prisma.service.js';

export type DbClient = PrismaService | Prisma.TransactionClient;

/**
 * Lets services group several repository calls into one DB transaction without
 * passing a `tx` argument around: inside `run()`, every repository automatically
 * uses the transaction client (stored in AsyncLocalStorage for the current request).
 */
@Injectable()
export class TransactionHost {
  private readonly storage = new AsyncLocalStorage<Prisma.TransactionClient>();

  constructor(private readonly prisma: PrismaService) {}

  get client(): DbClient {
    return this.storage.getStore() ?? this.prisma;
  }

  run<T>(fn: () => Promise<T>): Promise<T> {
    if (this.storage.getStore()) return fn();
    return this.prisma.$transaction((tx) => this.storage.run(tx, fn));
  }
}
