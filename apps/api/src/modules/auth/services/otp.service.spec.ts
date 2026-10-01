import { ConfigService } from '@nestjs/config';
import type { MailService } from '../../../infrastructure/mail/mail.service.js';
import type { CreateOtpCodeData, OtpCode, OtpPurpose } from '../entities/otp-code.entity.js';
import { OtpCodesRepository } from '../repositories/otp-codes.repository.js';
import { OtpService } from './otp.service.js';

class InMemoryOtpCodesRepository extends OtpCodesRepository {
  rows: OtpCode[] = [];

  async create(data: CreateOtpCodeData) {
    const row: OtpCode = {
      id: String(this.rows.length + 1),
      attempts: 0,
      consumedAt: null,
      resetUsedAt: null,
      createdAt: new Date(),
      ...data,
    };
    this.rows.push(row);
    return row;
  }
  async findById(id: string) {
    return this.rows.find((r) => r.id === id) ?? null;
  }
  async findLatest(email: string, purpose: OtpPurpose) {
    return this.rows.filter((r) => r.email === email && r.purpose === purpose).at(-1) ?? null;
  }
  async findLatestActive(email: string, purpose: OtpPurpose) {
    return this.rows.filter((r) => r.email === email && r.purpose === purpose && !r.consumedAt).at(-1) ?? null;
  }
  async incrementAttempts(id: string) {
    const row = await this.findById(id);
    if (row) row.attempts += 1;
  }
  async markConsumed(id: string) {
    const row = await this.findById(id);
    if (row) row.consumedAt = new Date();
  }
  async markResetUsed(id: string) {
    const row = await this.findById(id);
    if (row) row.resetUsedAt = new Date();
  }
}

describe('OtpService', () => {
  let repo: InMemoryOtpCodesRepository;
  let sentCodes: string[];
  let service: OtpService;

  beforeEach(() => {
    repo = new InMemoryOtpCodesRepository();
    sentCodes = [];
    const mail = {
      send: async ({ text }: { text: string }) => void sentCodes.push(text.match(/\d{6}/)![0]),
    } as unknown as MailService;
    const config = new ConfigService({ JWT_RESET_SECRET: 'test-secret', OTP_MAX_ATTEMPTS: 2 });
    service = new OtpService(repo, mail, config);
  });

  it('sends a 6-digit code and stores only its hash', async () => {
    await service.send('a@b.com', 'REGISTER', 'en');

    expect(sentCodes[0]).toMatch(/^\d{6}$/);
    expect(repo.rows[0].codeHash).not.toContain(sentCodes[0]);
  });

  it('refuses a second code during the cooldown when strict', async () => {
    await service.send('a@b.com', 'REGISTER', 'en');

    await expect(service.send('a@b.com', 'REGISTER', 'en', { strict: true })).rejects.toMatchObject({
      response: { code: 'OTP_COOLDOWN' },
    });
  });

  it('accepts the right code once and locks after too many wrong attempts', async () => {
    await service.send('a@b.com', 'REGISTER', 'en');

    await expect(service.verify('a@b.com', 'REGISTER', '000000')).rejects.toMatchObject({
      response: { code: 'OTP_INVALID', attemptsLeft: 1 },
    });
    await expect(service.verify('a@b.com', 'REGISTER', '000001')).rejects.toMatchObject({
      response: { code: 'OTP_INVALID', attemptsLeft: 0 },
    });
    await expect(service.verify('a@b.com', 'REGISTER', sentCodes[0])).rejects.toMatchObject({
      response: { code: 'OTP_TOO_MANY_ATTEMPTS' },
    });
  });

  it('marks the code consumed after a successful verification', async () => {
    await service.send('a@b.com', 'RESET_PASSWORD', 'en');

    const id = await service.verify('a@b.com', 'RESET_PASSWORD', sentCodes[0]);

    expect(repo.rows[0].id).toBe(id);
    expect(repo.rows[0].consumedAt).toBeInstanceOf(Date);
  });
});
