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
  | 'UNAUTHORIZED'
  | 'LANGUAGE_NOT_FOUND'
  | 'SET_NOT_FOUND'
  | 'NOT_ENOUGH_ITEMS'
  | 'NOTHING_TO_REVIEW'
  | 'NO_MISTAKES'
  | 'GAME_SESSION_NOT_FOUND'
  | 'GAME_SESSION_EXPIRED'
  | 'GAME_SESSION_COMPLETED'
  | 'QUESTION_NOT_FOUND'
  | 'QUESTION_ALREADY_ANSWERED'
  | 'INVALID_ANSWER'
  | 'TIMER_NOT_STARTED'
  | 'TIME_UP'
  | 'TRANSLATION_SAME_LANGUAGE'
  | 'TRANSLATION_UNAVAILABLE';

/**
 * Every error the API returns has a stable `code` the web app can translate:
 * { statusCode, code, message, ...extra }
 */
export class ApiError extends HttpException {
  constructor(status: HttpStatus, code: ErrorCode, extra: Record<string, unknown> = {}) {
    super({ statusCode: status, code, message: code, ...extra }, status);
  }
}
