import type { PublicUser, User } from './user.entity.js';

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    emailVerified: user.emailVerifiedAt !== null,
    hasPassword: user.passwordHash !== null,
  };
}
