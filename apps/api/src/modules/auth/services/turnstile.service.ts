import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiError } from '../../../common/api-error.js';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);

  constructor(private readonly config: ConfigService) {}

  async verify(token: string, remoteIp?: string) {
    const body = new URLSearchParams({
      secret: this.config.getOrThrow<string>('TURNSTILE_SECRET'),
      response: token,
    });
    if (remoteIp) body.set('remoteip', remoteIp);

    try {
      const res = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(5000) });
      const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
      if (data.success) return;
      this.logger.warn(`Turnstile rejected: ${data['error-codes']?.join(', ')}`);
    } catch (error) {
      this.logger.error('Turnstile verification request failed', error as Error);
    }
    throw new ApiError(HttpStatus.BAD_REQUEST, 'CAPTCHA_FAILED');
  }
}
