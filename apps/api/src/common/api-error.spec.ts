import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error.js';

describe('ApiError', () => {
  it('exposes a stable code and extra fields in the response body', () => {
    const error = new ApiError(HttpStatus.TOO_MANY_REQUESTS, 'OTP_COOLDOWN', { retryAfter: 42 });

    expect(error.getStatus()).toBe(429);
    expect(error.getResponse()).toEqual({
      statusCode: 429,
      code: 'OTP_COOLDOWN',
      message: 'OTP_COOLDOWN',
      retryAfter: 42,
    });
  });
});
