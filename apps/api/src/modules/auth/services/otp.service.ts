import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiError } from '../../../common/api-error.js';
import type { Lang } from '../../../common/lang.decorator.js';
import { MailService } from '../../../infrastructure/mail/mail.service.js';
import type { OtpPurpose } from '../entities/otp-code.entity.js';
import { buildOtpEmail } from '../mail/otp-email.js';
import { OtpCodesRepository } from '../repositories/otp-codes.repository.js';

@Injectable()
export class OtpService {
  private readonly ttlMinutes: number;
  private readonly cooldownSeconds: number;
  private readonly maxAttempts: number;
  private readonly secret: string;

  constructor(
    private readonly otpCodes: OtpCodesRepository,
    private readonly mail: MailService,
    config: ConfigService,
  ) {
    this.ttlMinutes = Number(config.get('OTP_TTL_MINUTES') ?? 10);
    this.cooldownSeconds = Number(config.get('OTP_RESEND_COOLDOWN_SECONDS') ?? 60);
    this.maxAttempts = Number(config.get('OTP_MAX_ATTEMPTS') ?? 5);
    this.secret = config.getOrThrow<string>('JWT_RESET_SECRET');
  }

  /** Seconds the user must still wait before a new code can be sent (0 = can send now). */
  async cooldownRemaining(email: string, purpose: OtpPurpose) {
    const latest = await this.otpCodes.findLatest(email, purpose);
    if (!latest) return 0;
    const elapsed = (Date.now() - latest.createdAt.getTime()) / 1000;
    return Math.max(0, Math.ceil(this.cooldownSeconds - elapsed));
  }

  /** Sends a new code. With `strict`, throws OTP_COOLDOWN instead of silently skipping. */
  async send(email: string, purpose: OtpPurpose, lang: Lang, { strict = false } = {}) {
    const wait = await this.cooldownRemaining(email, purpose);
    if (wait > 0) {
      if (strict) throw new ApiError(HttpStatus.TOO_MANY_REQUESTS, 'OTP_COOLDOWN', { retryAfter: wait });
      return;
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.otpCodes.create({
      email,
      purpose,
      codeHash: this.hashCode(email, purpose, code),
      expiresAt: new Date(Date.now() + this.ttlMinutes * 60_000),
    });
    await this.mail.send(buildOtpEmail(email, code, purpose, lang, this.ttlMinutes));
  }

  /** Checks the latest code and marks it consumed. Returns the OTP record id. */
  async verify(email: string, purpose: OtpPurpose, code: string) {
    const otp = await this.otpCodes.findLatestActive(email, purpose);

    if (!otp || otp.expiresAt < new Date()) throw new ApiError(HttpStatus.BAD_REQUEST, 'OTP_EXPIRED');
    if (otp.attempts >= this.maxAttempts) {
      throw new ApiError(HttpStatus.TOO_MANY_REQUESTS, 'OTP_TOO_MANY_ATTEMPTS');
    }

    const expected = Buffer.from(otp.codeHash, 'hex');
    const actual = Buffer.from(this.hashCode(email, purpose, code), 'hex');
    if (!timingSafeEqual(expected, actual)) {
      const attemptsLeft = Math.max(0, this.maxAttempts - otp.attempts - 1);
      await this.otpCodes.incrementAttempts(otp.id);
      throw new ApiError(HttpStatus.BAD_REQUEST, 'OTP_INVALID', { attemptsLeft });
    }

    await this.otpCodes.markConsumed(otp.id);
    return otp.id;
  }

  private hashCode(email: string, purpose: OtpPurpose, code: string) {
    return createHmac('sha256', this.secret).update(`${email}:${purpose}:${code}`).digest('hex');
  }
}
