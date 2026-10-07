import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import type { Lang } from '../../common/lang.decorator.js';
import { TransactionHost } from '../../infrastructure/database/transaction-host.js';
import type { PublicUser, User } from '../users/user.entity.js';
import { toPublicUser } from '../users/user.mapper.js';
import { UsersRepository } from '../users/repositories/users.repository.js';
import type { LoginDto, RegisterDto, ResetPasswordDto, SendOtpDto, VerifyOtpDto } from './dto/auth.dto.js';
import { OtpPurpose } from './entities/otp-code.entity.js';
import { OtpCodesRepository } from './repositories/otp-codes.repository.js';
import type { GoogleProfile } from './services/google-oauth.service.js';
import { OtpService } from './services/otp.service.js';
import { PasswordService } from './services/password.service.js';
import { TokenService, type ClientInfo } from './services/token.service.js';
import { TurnstileService } from './services/turnstile.service.js';

export interface Session {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly otpCodes: OtpCodesRepository,
    private readonly transaction: TransactionHost,
    private readonly passwords: PasswordService,
    private readonly otp: OtpService,
    private readonly tokens: TokenService,
    private readonly turnstile: TurnstileService,
  ) {}

  async register(dto: RegisterDto, lang: Lang, client: ClientInfo) {
    await this.turnstile.verify(dto.captchaToken, client.ipAddress);

    const existing = await this.users.findByEmail(dto.email);
    if (existing?.emailVerifiedAt) throw new ApiError(HttpStatus.CONFLICT, 'EMAIL_TAKEN');

    const passwordHash = await this.passwords.hash(dto.password);
    if (existing) {
      await this.users.update(existing.id, { fullName: dto.fullName, passwordHash });
    } else {
      await this.users.create({ email: dto.email, fullName: dto.fullName, passwordHash });
    }

    await this.otp.send(dto.email, OtpPurpose.REGISTER, lang);
    return { email: dto.email };
  }

  async login(dto: LoginDto, lang: Lang, client: ClientInfo): Promise<Session> {
    await this.turnstile.verify(dto.captchaToken, client.ipAddress);

    const user = await this.users.findByEmail(dto.email);
    const valid = user?.passwordHash ? await this.passwords.verify(user.passwordHash, dto.password) : false;
    if (!user || !valid) throw new ApiError(HttpStatus.UNAUTHORIZED, 'INVALID_CREDENTIALS');

    if (!user.emailVerifiedAt) {
      await this.otp.send(user.email, OtpPurpose.REGISTER, lang);
      throw new ApiError(HttpStatus.FORBIDDEN, 'EMAIL_NOT_VERIFIED', { email: user.email });
    }

    return this.createSession(user, client);
  }

  /** Always succeeds, so the response never reveals whether an account exists. */
  async forgotPassword(email: string, lang: Lang) {
    const user = await this.users.findByEmail(email);
    if (user) await this.otp.send(email, OtpPurpose.RESET_PASSWORD, lang);
  }

  async resendOtp(dto: SendOtpDto, lang: Lang) {
    const user = await this.users.findByEmail(dto.email);
    const shouldSend = dto.purpose === OtpPurpose.REGISTER ? user && !user.emailVerifiedAt : Boolean(user);

    if (shouldSend) {
      await this.otp.send(dto.email, dto.purpose, lang, { strict: true });
    }
  }

  async verifyOtp(dto: VerifyOtpDto, client: ClientInfo) {
    const otpId = await this.otp.verify(dto.email, dto.purpose, dto.code);

    if (dto.purpose === OtpPurpose.RESET_PASSWORD) {
      return { resetToken: await this.tokens.signResetToken(otpId, dto.email) };
    }

    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new ApiError(HttpStatus.BAD_REQUEST, 'OTP_EXPIRED');

    const verified = await this.users.update(user.id, { emailVerifiedAt: new Date() });
    return this.createSession(verified, client);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const payload = await this.tokens.verifyResetToken(dto.resetToken);

    const otp = await this.otpCodes.findById(payload.sub);
    const user = await this.users.findByEmail(payload.email);
    if (!user || !otp?.consumedAt || otp.resetUsedAt || otp.email !== payload.email) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'RESET_TOKEN_INVALID');
    }

    const passwordHash = await this.passwords.hash(dto.password);
    await this.transaction.run(async () => {
      await this.otpCodes.markResetUsed(otp.id);
      await this.users.update(user.id, { passwordHash, emailVerifiedAt: user.emailVerifiedAt ?? new Date() });
      await this.tokens.revokeAllForUser(user.id);
    });
  }

  async refresh(refreshToken: string | undefined, client: ClientInfo): Promise<Session> {
    if (!refreshToken) throw new ApiError(HttpStatus.UNAUTHORIZED, 'SESSION_EXPIRED');

    const rotated = await this.tokens.rotateRefreshToken(refreshToken, client);
    const user = await this.users.findById(rotated.userId);
    if (!user) throw new ApiError(HttpStatus.UNAUTHORIZED, 'SESSION_EXPIRED');

    return {
      accessToken: await this.tokens.signAccessToken({ sub: user.id, email: user.email }),
      refreshToken: rotated.refreshToken,
      user: toPublicUser(user),
    };
  }

  async logout(refreshToken: string | undefined) {
    if (refreshToken) await this.tokens.revokeRefreshToken(refreshToken);
  }

  async loginWithGoogle(profile: GoogleProfile, client: ClientInfo): Promise<Session> {
    const existing =
      (await this.users.findByGoogleId(profile.googleId)) ?? (await this.users.findByEmail(profile.email));

    const user = existing
      ? await this.users.update(existing.id, {
          googleId: profile.googleId,
          avatarUrl: existing.avatarUrl ?? profile.avatarUrl,
          emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
        })
      : await this.users.create({
          email: profile.email,
          fullName: profile.fullName,
          googleId: profile.googleId,
          avatarUrl: profile.avatarUrl,
          emailVerifiedAt: new Date()
        });

    return this.createSession(user, client);
  }

  private async createSession(user: User, client: ClientInfo): Promise<Session> {
    await this.users.update(user.id, { lastLoginAt: new Date() });

    return {
      accessToken: await this.tokens.signAccessToken({ sub: user.id, email: user.email }),
      refreshToken: await this.tokens.createRefreshToken(user.id, client),
      user: toPublicUser(user),
    };
  }
}
