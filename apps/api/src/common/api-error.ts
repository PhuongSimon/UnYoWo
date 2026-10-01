import { HttpException, HttpStatus } from '@nestjs/common';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'CAPTCHA_FAILED'
  | 'EMAIL_TAKEN'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'OTP_INVALID'
  | 'OTP_EXPIRED'
  | 'OTP_TOO_MANY_ATTEMPTS'
  | 'OTP_COOLDOWN'
  | 'RESET_TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  | 'UNAUTHORIZED';

/**
 * Every error the API returns has a stable `code` the web app can translate:
 * { statusCode, code, message, ...extra }
 */
export class ApiError extends HttpException {
  constructor(status: HttpStatus, code: ErrorCode, extra: Record<string, unknown> = {}) {
    super({ statusCode: status, code, message: code, ...extra }, status);
  }
}
