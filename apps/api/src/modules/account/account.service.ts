import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import { TransactionHost } from '../../infrastructure/database/transaction-host.js';
import { OtpCodesRepository } from '../auth/repositories/otp-codes.repository.js';
import { PasswordService } from '../auth/services/password.service.js';
import { TokenService } from '../auth/services/token.service.js';
import { UsersRepository } from '../users/repositories/users.repository.js';
import { toPublicUser } from '../users/user.mapper.js';
import { processAvatar } from './avatar/avatar-image.js';
import { AvatarStorage } from './avatar/avatar-storage.js';
import type { ChangePasswordDto, DeleteAccountDto, UpdateProfileDto } from './dto/account.dto.js';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly users: UsersRepository,
    private readonly otpCodes: OtpCodesRepository,
    private readonly transaction: TransactionHost,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly avatars: AvatarStorage,
  ) {}

  async me(userId: string) {
    return toPublicUser(await this.findUser(userId));
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findUser(userId);
    const user = await this.users.update(userId, {
      fullName: dto.fullName,
      timezone: dto.timezone,
      colorTheme: dto.colorTheme,
    });
    return toPublicUser(user);
  }

  async updateAvatar(userId: string, file: Express.Multer.File | undefined) {
    if (!file) throw new ApiError(HttpStatus.BAD_REQUEST, 'AVATAR_REQUIRED');
    const previousUrl = (await this.findUser(userId)).avatarUrl;

    const avatarUrl = await this.avatars.save(await processAvatar(file.buffer));
    const updated = await this.users.update(userId, { avatarUrl }).catch(async (error: unknown) => {
      await this.removeAvatarFile(avatarUrl);
      throw error;
    });

    await this.removeAvatarFile(previousUrl);
    return toPublicUser(updated);
  }

  async removeAvatar(userId: string) {
    const previousUrl = (await this.findUser(userId)).avatarUrl;
    const updated = await this.users.update(userId, { avatarUrl: null });
    await this.removeAvatarFile(previousUrl);
    return toPublicUser(updated);
  }

  /** Other devices are signed out; the session that made the change stays signed in. */
  async changePassword(userId: string, dto: ChangePasswordDto, currentRefreshToken: string | undefined) {
    const user = await this.findUser(userId);

    if (user.passwordHash) {
      await this.assertPassword(user.passwordHash, dto.currentPassword);
      if (await this.passwords.verify(user.passwordHash, dto.newPassword)) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'PASSWORD_UNCHANGED');
      }
    }

    const passwordHash = await this.passwords.hash(dto.newPassword);
    await this.transaction.run(async () => {
      await this.users.update(user.id, { passwordHash });
      await this.tokens.revokeOtherSessions(user.id, currentRefreshToken);
    });
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const user = await this.findUser(userId);

    if (user.passwordHash) {
      await this.assertPassword(user.passwordHash, dto.password);
    } else if (dto.email?.toLowerCase() !== user.email.toLowerCase()) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'CONFIRMATION_MISMATCH');
    }

    await this.transaction.run(async () => {
      await this.otpCodes.deleteByEmail(user.email);
      await this.users.delete(user.id);
    });
    await this.removeAvatarFile(user.avatarUrl);
  }

  private async findUser(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    return user;
  }

  // 400, not 401: the web app treats 401 as an expired session and signs the user out
  private async assertPassword(passwordHash: string, password: string | undefined) {
    if (!password || !(await this.passwords.verify(passwordHash, password))) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'WRONG_PASSWORD');
    }
  }

  // A leftover file only wastes disk space, so a failed delete must not fail the request
  private async removeAvatarFile(url: string | null) {
    try {
      await this.avatars.remove(url);
    } catch (error) {
      this.logger.warn(`Could not delete avatar file ${url}: ${(error as Error).message}`);
    }
  }
}
