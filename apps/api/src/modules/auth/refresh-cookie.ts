import type { CookieOptions, Request } from 'express';

export const REFRESH_COOKIE = 'refresh_token';

/** Scoped to /api/auth so the token only travels with auth and account requests. */
export function refreshCookieOptions(isProd: boolean): CookieOptions {
  return { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/api/auth' };
}

export function readRefreshCookie(req: Request) {
  return (req.cookies as Record<string, string | undefined>)[REFRESH_COOKIE];
}
