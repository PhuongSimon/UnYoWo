import { Injectable } from '@nestjs/common';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import type { CreateOtpCodeData, OtpCode, OtpPurpose } from '../entities/otp-code.entity.js';
import { OtpCodesRepository } from './otp-codes.repository.js';

@Injectable()
export class PrismaOtpCodesRepository extends OtpCodesRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  create(data: CreateOtpCodeData): Promise<OtpCode> {
    return this.db.otpCode.create({ data });
  }

  findById(id: string): Promise<OtpCode | null> {
    return this.db.otpCode.findUnique({ where: { id } });
  }

  findLatest(email: string, purpose: OtpPurpose): Promise<OtpCode | null> {
    return this.db.otpCode.findFirst({ where: { email, purpose }, orderBy: { createdAt: 'desc' } });
  }

  findLatestActive(email: string, purpose: OtpPurpose): Promise<OtpCode | null> {
    return this.db.otpCode.findFirst({
      where: { email, purpose, consumedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async incrementAttempts(id: string) {
    await this.db.otpCode.update({ where: { id }, data: { attempts: { increment: 1 } } });
  }

  async markConsumed(id: string) {
    await this.db.otpCode.update({ where: { id }, data: { consumedAt: new Date() } });
  }

  async markResetUsed(id: string) {
    await this.db.otpCode.update({ where: { id }, data: { resetUsedAt: new Date() } });
  }
}
