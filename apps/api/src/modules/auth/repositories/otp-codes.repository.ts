import type { CreateOtpCodeData, OtpCode, OtpPurpose } from '../entities/otp-code.entity.js';

export abstract class OtpCodesRepository {
  abstract create(data: CreateOtpCodeData): Promise<OtpCode>;
  abstract findById(id: string): Promise<OtpCode | null>;
  abstract findLatest(email: string, purpose: OtpPurpose): Promise<OtpCode | null>;
  abstract findLatestActive(email: string, purpose: OtpPurpose): Promise<OtpCode | null>;
  abstract incrementAttempts(id: string): Promise<void>;
  abstract markConsumed(id: string): Promise<void>;
  abstract markResetUsed(id: string): Promise<void>;
}
