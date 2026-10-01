export const OtpPurpose = {
  REGISTER: 'REGISTER',
  RESET_PASSWORD: 'RESET_PASSWORD',
} as const;

export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose];

export interface OtpCode {
  id: string;
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  attempts: number;
  expiresAt: Date;
  consumedAt: Date | null;
  resetUsedAt: Date | null;
  createdAt: Date;
}

export interface CreateOtpCodeData {
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: Date;
}
