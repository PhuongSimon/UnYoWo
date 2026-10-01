import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { TransactionHost } from './transaction-host.js';

@Global()
@Module({
  providers: [PrismaService, TransactionHost],
  exports: [PrismaService, TransactionHost],
})
export class PrismaModule {}
