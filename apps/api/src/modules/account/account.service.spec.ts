import sharp from 'sharp';
import type { TransactionHost } from '../../infrastructure/database/transaction-host.js';
import type { OtpCodesRepository } from '../auth/repositories/otp-codes.repository.js';
import { PasswordService } from '../auth/services/password.service.js';
import type { TokenService } from '../auth/services/token.service.js';
import { UsersRepository } from '../users/repositories/users.repository.js';
import type { CreateUserData, UpdateUserData, User } from '../users/user.entity.js';
import { AccountService } from './account.service.js';
import { AvatarStorage } from './avatar/avatar-storage.js';

class InMemoryUsersRepository extends UsersRepository {
  rows: User[] = [];
  failNextUpdate = false;

  async findById(id: string) {
    return this.rows.find((u) => u.id === id) ?? null;
  }
  async findByEmail(email: string) {
    return this.rows.find((u) => u.email === email) ?? null;
  }
  async findByGoogleId(googleId: string) {
    return this.rows.find((u) => u.googleId === googleId) ?? null;
  }
  async create(data: CreateUserData) {
    const user: User = {
      id: `user-${this.rows.length + 1}`,
      passwordHash: null,
      googleId: null,
      avatarUrl: null,
      emailVerifiedAt: new Date(),
      lastLoginAt: null,
      timezone: 'UTC',
      colorTheme: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.rows.push(user);
    return user;
  }
  async update(id: string, data: UpdateUserData) {
    if (this.failNextUpdate) {
      this.failNextUpdate = false;
      throw new Error('database down');
    }
    const user = this.rows.find((u) => u.id === id)!;
    const defined = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
    Object.assign(user, defined, { updatedAt: new Date() });
    return user;
  }
  async delete(id: string) {
    this.rows = this.rows.filter((u) => u.id !== id);
  }
}

class FakeAvatarStorage extends AvatarStorage {
  files = new Map<string, Buffer>();
  removed: (string | null)[] = [];

  async save(image: Buffer) {
    const url = `/api/uploads/avatars/${this.files.size + 1}.webp`;
    this.files.set(url, image);
    return url;
  }
  async remove(url: string | null) {
    this.removed.push(url);
    if (url) this.files.delete(url);
  }
}

const passwords = new PasswordService();
const pngFile = async () =>
  ({ buffer: await sharp({ create: { width: 300, height: 300, channels: 3, background: '#3d007a' } }).png().toBuffer() }) as Express.Multer.File;

describe('AccountService', () => {
  let users: InMemoryUsersRepository;
  let avatars: FakeAvatarStorage;
  let deletedOtpEmails: string[];
  let revoked: [string, string | undefined][];
  let service: AccountService;

  beforeEach(() => {
    users = new InMemoryUsersRepository();
    avatars = new FakeAvatarStorage();
    deletedOtpEmails = [];
    revoked = [];
    const otpCodes = { deleteByEmail: async (email: string) => void deletedOtpEmails.push(email) } as unknown as OtpCodesRepository;
    const tokens = {
      revokeOtherSessions: async (userId: string, token: string | undefined) => void revoked.push([userId, token]),
    } as unknown as TokenService;
    const transaction = { run: <T>(fn: () => Promise<T>) => fn() } as unknown as TransactionHost;
    service = new AccountService(users, otpCodes, transaction, passwords, tokens, avatars);
  });

  const createPasswordUser = async () =>
    users.create({ email: 'lan@example.com', fullName: 'Lan', passwordHash: await passwords.hash('old-password') });
  const createGoogleUser = () =>
    users.create({ email: 'minh@gmail.com', fullName: 'Minh', googleId: 'g-1', avatarUrl: 'https://lh3.googleusercontent.com/a/1' });

  it('updates only the fields that were sent', async () => {
    const user = await createPasswordUser();

    const result = await service.updateProfile(user.id, { fullName: 'Lan Nguyễn', colorTheme: 'violet' });

    expect(result).toMatchObject({ fullName: 'Lan Nguyễn', colorTheme: 'violet', timezone: 'UTC' });
  });

  describe('changePassword', () => {
    it('refuses a wrong current password and keeps everything as it was', async () => {
      const user = await createPasswordUser();
      const before = user.passwordHash;

      await expect(
        service.changePassword(user.id, { currentPassword: 'guess', newPassword: 'new-password' }, 'token'),
      ).rejects.toMatchObject({ response: { code: 'WRONG_PASSWORD' } });
      expect(user.passwordHash).toBe(before);
      expect(revoked).toEqual([]);
    });

    it('refuses reusing the current password', async () => {
      const user = await createPasswordUser();

      await expect(
        service.changePassword(user.id, { currentPassword: 'old-password', newPassword: 'old-password' }, 'token'),
      ).rejects.toMatchObject({ response: { code: 'PASSWORD_UNCHANGED' } });
    });

    it('stores the new password and signs out the other devices only', async () => {
      const user = await createPasswordUser();

      await service.changePassword(user.id, { currentPassword: 'old-password', newPassword: 'new-password' }, 'this-device');

      expect(await passwords.verify(user.passwordHash!, 'new-password')).toBe(true);
      expect(revoked).toEqual([[user.id, 'this-device']]);
    });

    it('lets a Google-only account set its first password', async () => {
      const user = await createGoogleUser();

      await service.changePassword(user.id, { newPassword: 'first-password' }, undefined);

      expect(await passwords.verify(user.passwordHash!, 'first-password')).toBe(true);
    });
  });

  describe('deleteAccount', () => {
    it('needs the right password and keeps the account otherwise', async () => {
      const user = await createPasswordUser();

      await expect(service.deleteAccount(user.id, { password: 'guess' })).rejects.toMatchObject({
        response: { code: 'WRONG_PASSWORD' },
      });
      expect(await users.findById(user.id)).not.toBeNull();
    });

    it('deletes the user, their OTP codes and their uploaded avatar', async () => {
      const user = await createPasswordUser();
      await service.updateAvatar(user.id, await pngFile());
      const avatarUrl = user.avatarUrl;

      await service.deleteAccount(user.id, { password: 'old-password' });

      expect(await users.findById(user.id)).toBeNull();
      expect(deletedOtpEmails).toEqual(['lan@example.com']);
      expect(avatars.removed).toContain(avatarUrl);
    });

    it('asks a Google-only account to type its email instead of a password', async () => {
      const user = await createGoogleUser();

      await expect(service.deleteAccount(user.id, { email: 'someone@gmail.com' })).rejects.toMatchObject({
        response: { code: 'CONFIRMATION_MISMATCH' },
      });

      await service.deleteAccount(user.id, { email: 'Minh@Gmail.com' });
      expect(await users.findById(user.id)).toBeNull();
    });
  });

  describe('avatar', () => {
    it('stores the processed image and deletes the previous upload', async () => {
      const user = await createPasswordUser();

      const first = await service.updateAvatar(user.id, await pngFile());
      const second = await service.updateAvatar(user.id, await pngFile());

      expect(second.avatarUrl).not.toBe(first.avatarUrl);
      expect(avatars.removed).toContain(first.avatarUrl);
      expect((await sharp(avatars.files.get(second.avatarUrl!)!).metadata()).format).toBe('webp');
    });

    it('asks for a file when none was sent', async () => {
      const user = await createPasswordUser();

      await expect(service.updateAvatar(user.id, undefined)).rejects.toMatchObject({ response: { code: 'AVATAR_REQUIRED' } });
    });

    it('cleans up the new file when saving the user fails', async () => {
      const user = await createGoogleUser();
      users.failNextUpdate = true;

      await expect(service.updateAvatar(user.id, await pngFile())).rejects.toThrow('database down');
      expect(avatars.files.size).toBe(0);
      expect(user.avatarUrl).toBe('https://lh3.googleusercontent.com/a/1');
    });

    it('removes the avatar and leaves a Google photo URL to the storage to ignore', async () => {
      const user = await createGoogleUser();

      const result = await service.removeAvatar(user.id);

      expect(result.avatarUrl).toBeNull();
      expect(avatars.removed).toEqual(['https://lh3.googleusercontent.com/a/1']);
    });
  });
});
