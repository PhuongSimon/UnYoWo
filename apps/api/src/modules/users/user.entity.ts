export interface User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string | null;
  googleId: string | null;
  avatarUrl: string | null;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  fullName: string;
  passwordHash?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
  emailVerifiedAt?: Date | null;
  lastLoginAt?: Date | null;
}

export type UpdateUserData = Partial<Omit<CreateUserData, 'email'>>;

/** Shape returned to clients: never exposes password hash or internal ids. */
export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  hasPassword: boolean;
}
